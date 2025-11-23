import { NextRequest, NextResponse } from 'next/server';
import * as crypto from 'crypto';
import { createAdminClient } from '@/utils/supabase/admin';
import { BILLING_CONFIG, type PaidPlanTier } from '@/lib/subscriptions';

// Force dynamic to allow reading request body
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  return NextResponse.json({
    status: 'online',
    env_check: {
      PADDLE_WEBHOOK_SECRET: !!process.env.PADDLE_WEBHOOK_SECRET,
      NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY
    }
  });
}

export async function POST(req: NextRequest) {
  try {
    console.log('🔔 Webhook received at', new Date().toISOString());
    
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
      
      // DEBUG: Log keys to understand payload structure
      console.log('🔑 Data Keys:', Object.keys(data));
      if (data.custom_data) {
         console.log('🔍 custom_data type:', typeof data.custom_data);
      }

      // Extract Email & Custom Data
      // In Paddle Billing, custom_data is directly on the transaction object
      const customData = data.custom_data || {};
      console.log('🔍 Raw Custom Data:', JSON.stringify(customData));

      const customerEmail = data.customer?.email || customData.guest_email || customData.email;

      // Helper to safely extract from nested structures (Paddle sometimes nests custom_data inside custom_data)
      const getCustomDataValue = (key: string) => {
        // Check direct key
        if (customData[key]) return customData[key];
        // Check nested custom_data
        if (customData.custom_data && customData.custom_data[key]) return customData.custom_data[key];
        // Check capitalized key (Category vs category)
        const capKey = key.charAt(0).toUpperCase() + key.slice(1);
        if (customData[capKey]) return customData[capKey];
        if (customData.custom_data && customData.custom_data[capKey]) return customData.custom_data[capKey];
        
        return undefined;
      };

      let category = getCustomDataValue('category');
      const planFromCustomData = getCustomDataValue('plan') || getCustomDataValue('plan_tier');
      let userIdFromCustomData = getCustomDataValue('user_id') || getCustomDataValue('userId');

      const transactionId = data.id;
      const currency = data.currency_code || 'EUR';
      
      // Amount is typically a string in major units (e.g. "3.00")
      // We need to check where the amount is located.
      // Usually data.details.totals.grand_total
      const amountStr = data.details?.totals?.grand_total || '0';
      
      // FIX: Parse float and multiply by 100 to get cents
      const amountCents = Math.round(parseFloat(amountStr) * 100);

      console.log(`💰 Amount Parsed: ${amountStr} -> ${amountCents} cents`);

      if (!userIdFromCustomData && !customerEmail) {
        console.error('❌ No user identifier (user_id or email) found in transaction');
        return NextResponse.json({ received: true });
      }

      // Normalize Category (A, B, C, D)
      if (category) {
        category = category.toString().trim().toUpperCase();
        if (!['A', 'B', 'C', 'D'].includes(category)) {
           console.warn(`⚠️ Invalid category received: ${category}. Keeping as is for investigation.`);
        }
      } else {
        console.error(`❌ Missing category in custom_data. Transaction ID: ${transactionId}`);
        // Defaulting to UNKNOWN to avoid data corruption
        category = 'UNKNOWN';
      }

      // Determine Plan Tier
      let planTier: PaidPlanTier | null = null;
      
      // 1. Try to use explicit plan from custom_data
      if (planFromCustomData) {
        const normalizedPlan = planFromCustomData.toString().toUpperCase();
        if (['PLAN_A', 'PLAN_B', 'PLAN_C'].includes(normalizedPlan)) {
          planTier = normalizedPlan as PaidPlanTier;
          console.log(`✅ Using explicit plan from custom_data: ${planTier}`);
        } else {
           console.warn(`⚠️ Invalid plan in custom_data: ${planFromCustomData}. Falling back to amount.`);
        }
      }

      // 2. Fallback to Amount Heuristic if plan not found or invalid
      if (!planTier) {
        // Heuristic mapping - Update this if prices change!
        // 3.00 EUR -> 300 cents -> PLAN_A (Range: 250-400)
        // 5.00 EUR -> 500 cents -> PLAN_B (Range: 450-650)
        // 8.00 EUR -> 800 cents -> PLAN_C (Range: 750-950)
        if (amountCents >= 250 && amountCents <= 400) {
          planTier = 'PLAN_A'; 
        } else if (amountCents >= 450 && amountCents <= 650) {
          planTier = 'PLAN_B'; 
        } else if (amountCents >= 750 && amountCents <= 950) {
          planTier = 'PLAN_C'; 
        } else {
          console.warn('⚠️ Unknown amount:', amountCents, 'Defaulting to PLAN_A');
          planTier = 'PLAN_A';
        }
        console.log(`ℹ️ Inferred Plan from Amount: ${planTier} (${amountCents} cents)`);
      }

      console.log(`✅ Final Plan: ${planTier} for Category: ${category}`);

      // 5. Database Operations
      try {
        const supabase = createAdminClient();
        
        let userId = userIdFromCustomData;
        let userEmail = customerEmail;

        // Lookup User by Email if ID missing
        if (!userId && customerEmail) {
          console.log(`🔍 Looking up user by email: ${customerEmail}`);
          const { data: userProfile, error: userError } = await supabase
            .from('user_profiles')
            .select('id')
            .eq('email', customerEmail)
            .single();

          if (userError || !userProfile) {
            // Check auth.users just in case profile is missing but auth exists
            const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
            const authUser = authUsers?.users.find(u => u.email === customerEmail);
            
            if (authUser) {
               console.log(`⚠️ User found in Auth but not Profiles. Creating profile for ${authUser.id}`);
               userId = authUser.id;
               // Create missing profile
               await supabase.from('user_profiles').insert({
                  id: authUser.id,
                  email: customerEmail,
                  full_name: customerEmail.split('@')[0], // Fallback name
                  updated_at: new Date().toISOString()
               });
            } else {
               console.error('❌ User not found for email:', customerEmail);
               return NextResponse.json({ received: true });
            }
          } else {
              userId = userProfile.id;
          }
        }
        
        if (!userId) {
           console.error('❌ Could not resolve a valid User ID');
           return NextResponse.json({ received: true });
        }

        // Ensure User Profile Exists (Double Check for FK Constraint)
        const { data: profileCheck } = await supabase.from('user_profiles').select('id').eq('id', userId).single();
        if (!profileCheck) {
            console.log(`⚠️ Profile missing for ID ${userId}. Attempting to create stub.`);
            // Try to find email if we don't have it
            if (!userEmail) {
               const { data: u } = await supabase.auth.admin.getUserById(userId);
               userEmail = u.user?.email || `unknown_${userId}@example.com`;
            }
            
            const { error: createProfileError } = await supabase.from('user_profiles').insert({
                  id: userId,
                  email: userEmail,
                  full_name: 'Valued Customer',
                  updated_at: new Date().toISOString()
            });
            if (createProfileError) {
                console.error('❌ Failed to create stub profile:', createProfileError);
                // Can't proceed with Order creation if FK fails
                return NextResponse.json({ received: true });
            }
        }

        console.log(`👤 Processing for User ID: ${userId}`);

        // A. Create Order
        console.log('📦 Creating Order...');
        const { data: order, error: orderError } = await supabase
          .from('orders')
          .insert({
            user_id: userId,
            category: category, // 'A', 'B', 'C', 'D'
            plan_tier: planTier,
            amount_cents: amountCents,
            currency: currency,
            status: 'paid', 
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single();

        if (orderError) {
          console.error('❌ Failed to create order:', orderError);
          // If Order fails, Transaction will fail (FK). 
          // We try to upsert Plan anyway so user gets what they paid for.
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
              raw_payload: event, 
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
      } catch (dbError: any) {
        console.error('❌ Database Operation Failed:', dbError);
        return NextResponse.json({ error: 'Database Error', details: dbError.message }, { status: 500 });
      }
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
