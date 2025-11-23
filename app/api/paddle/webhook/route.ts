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
      return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
    }

    if (!signature) {
      console.error('❌ Missing Paddle signature header');
      return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
    }

    // 2. Verify Signature (HMAC SHA256)
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
      console.log('📝 Processing transaction completed');
      const data = event.data;
      
      // Extract Email & Custom Data
      const customData = data.custom_data || {};
      const customerEmail = data.customer?.email || customData.guest_email;
      let category = customData.category as string;
      const userIdFromCustomData = customData.user_id;
      const transactionId = data.id;
      const currency = data.currency_code || 'EUR';
      // Amount is typically a string in minor units (e.g. "300" for 3.00)
      const amountStr = data.details?.totals?.grand_total || '0';
      const amountCents = parseInt(amountStr, 10);

      if (!userIdFromCustomData && !customerEmail) {
        console.error('❌ No user identifier (user_id or email) found in transaction');
        return NextResponse.json({ received: true });
      }

      if (!category) {
        console.error('❌ No category found in custom_data');
        // Fallback logic could go here, but safer to fail for now
        return NextResponse.json({ received: true });
      }
      
      // Normalize Category (A, B, C, D)
      category = category.toUpperCase();
      if (!['A', 'B', 'C', 'D'].includes(category)) {
         console.warn(`⚠️ Invalid category received: ${category}. Defaulting to 'B' for safety or handling error.`);
         // Proceeding might break DB constraints if not handled. Let's assume B if invalid? 
         // Better to log and return, but user paid! Let's fallback to 'B' as standard car license.
         category = 'B';
      }

      // Determine Plan Tier based on amount
      let planTier: PaidPlanTier | null = null;
      
      // Heuristic mapping - Update this if prices change!
      // 3.00 EUR -> PLAN_A
      // 5.00 EUR -> PLAN_B
      // 8.00 EUR -> PLAN_C
      if (amountCents >= 290 && amountCents <= 310) {
        planTier = 'PLAN_A'; 
      } else if (amountCents >= 490 && amountCents <= 510) {
        planTier = 'PLAN_B'; 
      } else if (amountCents >= 790 && amountCents <= 810) {
        planTier = 'PLAN_C'; 
      } else {
        console.warn('⚠️ Unknown amount:', amountCents, 'Defaulting to PLAN_A');
        planTier = 'PLAN_A';
      }

      console.log(`✅ Identified Plan: ${planTier} for Category: ${category} (Amount: ${amountCents} ${currency})`);

      // 5. Database Operations
      const supabase = createAdminClient();
      
      let userId = userIdFromCustomData;

      // Lookup User by Email if ID missing
      if (!userId && customerEmail) {
        console.log(`🔍 Looking up user by email: ${customerEmail}`);
        const { data: userProfile, error: userError } = await supabase
          .from('user_profiles')
          .select('id')
          .eq('email', customerEmail)
          .single();

        if (userError || !userProfile) {
          console.error('❌ User not found for email:', customerEmail);
          // IMPORTANT: In a real app, we might want to CREATE the user here if they don't exist (Guest Checkout).
          // But 'handle_new_user' trigger handles auth.users inserts. We can't insert into auth.users easily here without a password.
          // For now, we return success to Paddle so it stops retrying, but we log the error.
          return NextResponse.json({ received: true });
        }
        userId = userProfile.id;
      }
      
      if (!userId) {
         console.error('❌ Could not resolve a valid User ID');
         return NextResponse.json({ received: true });
      }

      console.log(`👤 Processing for User ID: ${userId}`);

      // A. Create Order
      console.log('📦 Creating Order...');
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: userId,
          category: category,
          plan_tier: planTier,
          amount_cents: amountCents,
          currency: currency,
          status: 'paid', // Paddle transaction.completed means it's paid
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (orderError) {
        console.error('❌ Failed to create order:', orderError);
        // We continue to try to grant the plan even if order logging fails, 
        // because the user paid. But this is critical for accounting.
      } else {
        console.log(`✅ Order created: ${order.id}`);
        
        // B. Create Payment Transaction
        const { error: txError } = await supabase
          .from('payment_transactions')
          .insert({
            order_id: order.id,
            provider: 'paddle',
            provider_status: 'completed',
            amount_cents: amountCents,
            currency: currency,
            raw_payload: event, // Store full event for debugging
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
          
        if (txError) console.error('❌ Failed to log transaction:', txError);
      }

      // C. Activate Plan
      console.log('🔓 Activating Plan...');
      const planDef = BILLING_CONFIG.plans[planTier];
      const now = new Date();
      const startDate = new Date(now);
      const endDate = new Date(now);
      endDate.setMonth(endDate.getMonth() + planDef.months);

      const { error: upsertError } = await supabase.from('user_plans').upsert(
        {
          user_id: userId,
          category: category,
          plan_tier: planTier,
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          status: 'active',
          updated_at: now.toISOString() // Ensure updated_at changes
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
