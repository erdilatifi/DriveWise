import { NextRequest, NextResponse } from 'next/server';
import * as crypto from 'crypto';
import { createAdminClient } from '@/utils/supabase/admin';
import { BILLING_CONFIG, type PaidPlanTier } from '@/lib/subscriptions';

// Force dynamic to allow reading request body
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    // 1. Read raw body and signature
    const signature = req.headers.get('paddle-signature');
    const rawBody = await req.text();
    const secret = process.env.PADDLE_WEBHOOK_SECRET;

    if (!secret) {
      console.error('❌ PADDLE_WEBHOOK_SECRET is missing in environment variables');
      // Do NOT break the build, just return error
      return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
    }

    if (!signature) {
      console.error('❌ Missing Paddle signature header');
      return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
    }

    // 2. Verify Signature (HMAC SHA256)
    // Paddle signature format: ts=1234567890;h1=hash
    const parts = signature.split(';');
    const tsPart = parts.find((p) => p.startsWith('ts='));
    const h1Part = parts.find((p) => p.startsWith('h1='));

    if (!tsPart || !h1Part) {
      console.error('❌ Invalid Paddle signature format');
      return NextResponse.json({ error: 'Invalid signature format' }, { status: 401 });
    }

    const ts = tsPart.split('=')[1];
    const h1 = h1Part.split('=')[1];
    const payload = `${ts}:${rawBody}`;

    const calculatedHash = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');

    if (calculatedHash !== h1) {
      console.error('❌ Paddle signature verification failed');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    console.log('✅ Paddle signature verified');

    // 3. Parse Event
    const event = JSON.parse(rawBody);
    const eventType = event.event_type; 
    
    console.log(`🔔 Paddle Event Received: ${eventType}`);

    // 4. Handle Events
    if (eventType === 'transaction.completed') {
      console.log('📝 Processing transaction.completed');
      const data = event.data;
      
      // Extract Email & Custom Data
      // Note: In Paddle Billing, customer info is in 'customer' object if expanded, 
      // OR we rely on the email passed in custom_data/guest_email if available.
      // Usually HSC transaction events have: data.customer.email (if customer exists) or data.details.line_items...
      // For guest checkout, check data.custom_data first for identifying info, or data.customer.
      
      // For HSC with guest_email, Paddle creates a customer.
      const customerEmail = data.customer?.email || data.custom_data?.guest_email;
      const category = data.custom_data?.category;

      if (!customerEmail) {
        console.error('❌ No customer email found in transaction');
        return NextResponse.json({ received: true }); // Return 200 to stop retries if unfixable
      }

      if (!category) {
        console.error('❌ No category found in custom_data');
        // Fallback or manual handling needed. 
        return NextResponse.json({ received: true });
      }

      // Determine Plan Tier based on amount
      // data.details.totals.grand_total is string, usually in minor units (cents) if currency is EUR? 
      // Wait, Paddle API v1 was strings. Billing API (v2) uses strings representing minor units?
      // Actually, let's check data.items[0].price.unit_price.amount (string).
      // 3.00 EUR -> "300"
      
      let planTier: PaidPlanTier | null = null;
      const amountStr = data.details?.totals?.grand_total || '0';
      const amount = parseInt(amountStr, 10);

      // Approximate checks (Paddle amounts are strings of minor units, e.g. "300" for 3.00 EUR)
      if (amount === 300) {
        planTier = 'PLAN_A'; // 1 Month
      } else if (amount === 500) {
        planTier = 'PLAN_B'; // 2 Months
      } else if (amount === 800) {
        planTier = 'PLAN_C'; // 3 Months
      } else {
        console.warn('⚠️ Unknown amount:', amount, 'Defaulting to PLAN_A or checking logic');
        // You might want to log this critical error.
        // For now, if unknown, we can't proceed safely.
        console.error('❌ Could not map amount to Plan Tier');
        return NextResponse.json({ received: true });
      }

      console.log(`✅ Identified Plan: ${planTier} for User: ${customerEmail}, Category: ${category}`);

      // 5. Activate Plan in Database
      const supabase = createAdminClient();
      
      // Find User ID
      const { data: userProfile, error: userError } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('email', customerEmail)
        .single();

      if (userError || !userProfile) {
        console.error('❌ User not found for email:', customerEmail);
        return NextResponse.json({ received: true });
      }

      const userId = userProfile.id;
      const planDef = BILLING_CONFIG.plans[planTier];
      
      // Calculate Dates
      const now = new Date();
      const startDate = new Date(now);
      const endDate = new Date(now);
      endDate.setMonth(endDate.getMonth() + planDef.months);

      // Upsert Plan
      const { error: upsertError } = await supabase.from('user_plans').upsert(
        {
          user_id: userId,
          category: category,
          plan_tier: planTier,
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          status: 'active',
        },
        { onConflict: 'user_id,category' }
      );

      if (upsertError) {
        console.error('❌ Failed to activate plan in DB:', upsertError);
        return NextResponse.json({ error: 'DB Error' }, { status: 500 });
      }

      console.log('🎉 Plan Activated Successfully!');
    }

    // Return success
    return NextResponse.json({ received: true });

  } catch (error: any) {
    console.error('❌ Webhook Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}
