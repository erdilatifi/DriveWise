import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/admin';
import { BILLING_CONFIG, type PaidPlanTier } from '@/lib/subscriptions';
import type { LicenseCategory } from '@/types/database';

export async function POST(req: NextRequest) {
  try {
    // Signature verification skipped for now - TODO: Add HMAC verification
    const body = await req.text();
    const event = JSON.parse(body);
    const eventType = event.eventType || event.event_type;

    console.log('Paddle Webhook received:', eventType);

    if (eventType === 'transaction.completed') {
      const data = event.data;
      const customerEmail = data.customer?.email || data.customer_details?.email;
      
      // Try to extract metadata if passed
      // const customData = data.custom_data || {};
      
      if (!customerEmail) {
        console.error('Paddle Webhook: No customer email found');
        return NextResponse.json({ error: 'No email' }, { status: 400 });
      }

      const supabase = createAdminClient();
      
      // Look up user by email in user_profiles
      const { data: user, error: userError } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('email', customerEmail)
        .single();

      if (userError || !user) {
        console.error(`Paddle Webhook: User not found for email ${customerEmail}`);
        return NextResponse.json({ message: 'User not found' }, { status: 200 });
      }

      // Determine Plan and Category
      // In a robust implementation, these would come from product_id mapping or custom_data
      // For this migration, we default to:
      const planTier: PaidPlanTier = 'PLAN_C'; // Best Value
      const category: LicenseCategory = 'B';     // Default category

      const planDef = BILLING_CONFIG.plans[planTier];
      if (!planDef) {
        console.error(`Paddle Webhook: Plan definition not found for ${planTier}`);
        return NextResponse.json({ error: 'Invalid plan' }, { status: 500 });
      }

      const now = new Date();
      const startDate = new Date(now);
      const endDate = new Date(now);
      endDate.setMonth(endDate.getMonth() + planDef.months);

      const { error: upsertError } = await supabase.from('user_plans').upsert({
        user_id: user.id,
        category: category,
        plan_tier: planTier,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        status: 'active',
      }, { onConflict: 'user_id,category' });

      if (upsertError) {
        console.error('Paddle Webhook: Failed to upsert plan', upsertError);
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
      }

      console.log(`Paddle Webhook: Plan ${planTier} granted to user ${user.id} for category ${category}`);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('Paddle Webhook Error:', err);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
