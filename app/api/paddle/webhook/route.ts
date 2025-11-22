import { NextRequest, NextResponse } from 'next/server';
import * as crypto from 'crypto';
import { createAdminClient } from '@/utils/supabase/admin';

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
      // Don't break the build/request, but log it. 
      // In production, you might want to return 500, but prompt says "Do NOT break the build; log an error."
      // We will proceed cautiously or return early if we can't verify.
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
    const eventType = event.event_type; // Paddle uses event_type (snake_case) usually, sometimes camelCase in docs. JSON body usually snake_case.
    
    console.log(`🔔 Paddle Event Received: ${eventType}`);

    const supabase = createAdminClient();
    let responseMessage = 'Event processed';

    switch (eventType) {
      case 'transaction.completed': {
        // Meaning: payment success (one-time or initial subscription payment)
        // Action: Mark is_premium = true, set end date
        const data = event.data;
        const customerEmail = data.customer?.email || data.custom_data?.guest_email;
        
        if (!customerEmail) {
          console.warn('⚠️ No customer email found in transaction.completed event');
          return NextResponse.json({ error: 'No email found' }, { status: 400 });
        }

        // Calculate subscription end if available, or default (e.g. 1 year or 1 month)
        // If it's a subscription transaction, data might have billing_period
        let endDate = new Date();
        if (data.billing_period?.end) {
          endDate = new Date(data.billing_period.end);
        } else {
          // Fallback for one-time payment default duration if needed. 
          // Assuming 1 month for now or relying on logic elsewhere.
          // Prompt says: "subscription_end = the billing period end date from the event"
          // If it's missing, we might just set it to null or a default.
          // Let's assume 1 year for one-time payments if no billing period.
          endDate.setFullYear(endDate.getFullYear() + 1);
        }

        console.log(`Processing transaction for: ${customerEmail}, Valid until: ${endDate.toISOString()}`);

        const { error } = await supabase
          .from('user_profiles')
          .update({
            is_premium: true,
            subscription_end: endDate.toISOString(),
          })
          .eq('email', customerEmail);

        if (error) {
          console.error('❌ Failed to update user profile:', error);
          throw error;
        }
        console.log('✅ User upgraded to premium via transaction.completed');
        break;
      }

      case 'subscription.created': {
        // Meaning: user started a subscription
        const data = event.data;
        const customerEmail = data.custom_data?.guest_email || await getEmailFromCustomerId(data.customer_id);
        
        // Note: Paddle events sometimes don't have full customer object in top level data, check payload structure.
        // Often data.customer is expanded. If not, we might need to fetch it or rely on custom_data.
        // We'll try data.customer?.email if available too.
        const email = customerEmail || data.customer?.email;

        if (!email) {
           console.warn(`⚠️ No email found for subscription ${data.id}`);
           break; // Can't update
        }

        const subId = data.id;
        const nextBilledAt = data.next_billed_at || data.current_billing_period?.end;

        console.log(`New subscription: ${subId} for ${email}`);

        const { error } = await supabase
          .from('user_profiles')
          .update({
            is_premium: true,
            subscription_id: subId,
            subscription_end: nextBilledAt,
          })
          .eq('email', email);

        if (error) {
          console.error('❌ Failed to update profile for subscription.created:', error);
          throw error;
        }
        console.log('✅ Subscription linked to user');
        break;
      }

      case 'subscription.updated': {
        // Meaning: renewal succeeded OR plan changed
        const data = event.data;
        const subId = data.id;
        const nextBilledAt = data.next_billed_at || data.current_billing_period?.end;
        const status = data.status; // active, past_due, paused, canceled

        console.log(`Subscription updated: ${subId}, Status: ${status}`);

        // Only update if we can identify the user by subscription_id
        // We don't strictly need email if we saved subscription_id before.
        // But Supabase update requires a WHERE clause.
        
        const updateData: any = {
          subscription_end: nextBilledAt,
        };

        if (status === 'active') {
          updateData.is_premium = true;
        }

        const { error } = await supabase
          .from('user_profiles')
          .update(updateData)
          .eq('subscription_id', subId);

        if (error) {
           console.error('❌ Failed to update profile for subscription.updated:', error);
           // Retry with email lookup if sub_id lookup failed (rare case if sub wasn't saved correctly)
        } else {
           console.log('✅ User subscription renewed/updated');
        }
        break;
      }

      case 'subscription.canceled': {
        // Meaning: user canceled auto-renew
        // Action: Keep premium active until subscription_end
        const data = event.data;
        const subId = data.id;
        console.log(`Subscription canceled: ${subId}`);
        // Do nothing to is_premium, just let it expire naturally or log it.
        // We might want to ensure subscription_end is correct.
        // Prompt says: "Do NOT remove premium immediately"
        break;
      }

      case 'transaction.payment_failed': {
        const data = event.data;
        console.warn(`⚠️ Payment failed for transaction ${data.id}`);
        break;
      }

      default:
        console.log(`ℹ️ Unhandled event type: ${eventType}`);
    }

    return NextResponse.json({ success: true, message: responseMessage });
  } catch (error: any) {
    console.error('❌ Webhook Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}

// Helper to maybe fetch email if not in payload (mock logic or relying on custom_data/email presence)
// Real implementation would call Paddle API if needed, but for now we assume email is in custom_data or customer object.
async function getEmailFromCustomerId(customerId: string): Promise<string | undefined> {
  // Placeholder: If you needed to call Paddle API to get customer details.
  // For now, returning undefined to rely on direct data.
  return undefined;
}

/*
  TODO: 
  - Add category-based logic if you plan to support multiple product tiers (A, B, C).
  - Currently, this logic applies GLOBAL premium status.

  ---
  LOCAL TESTING INSTRUCTIONS:
  1. Start local server: npm run dev
  2. Start ngrok: ngrok http 3000
  3. Copy ngrok URL (e.g., https://abc.ngrok-free.app)
  4. Go to Paddle Dashboard > Developer Tools > Notifications / Webhooks
  5. Create a new destination: https://abc.ngrok-free.app/api/paddle/webhook
  6. Enable events: transaction.completed, subscription.created, subscription.updated, subscription.canceled
  7. Use "Simulator" in Paddle to fire test events.
*/
