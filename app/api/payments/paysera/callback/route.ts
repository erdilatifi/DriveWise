import { NextRequest } from 'next/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { BILLING_CONFIG, type PaidPlanTier } from '@/lib/subscriptions';
import { getPayseraConfig, parsePayseraCallback, isPayseraStatusSuccessful } from '@/lib/paysera';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const data = (formData.get('data') ?? '') as string;
    const sign = (formData.get('sign') ?? '') as string;

    if (!data || !sign) {
      return new Response('Missing data or sign', { status: 400 });
    }

    const config = getPayseraConfig();
    const callback = parsePayseraCallback(data, sign, config);

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return new Response('Server is not configured for payment processing.', { status: 500 });
    }

    const adminClient = createAdminClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const { data: order, error: orderError } = await adminClient
      .from('orders')
      .select('*')
      .eq('id', callback.orderId)
      .single();

    if (orderError || !order) {
      return new Response('Order not found', { status: 404 });
    }

    if (order.amount_cents !== callback.amountCents || order.currency !== callback.currency) {
      await adminClient.from('payment_transactions').insert({
        order_id: order.id,
        provider: 'paysera',
        provider_status: callback.status,
        amount_cents: callback.amountCents,
        currency: callback.currency,
        raw_payload: callback.raw,
      });
      return new Response('Bad amount or currency', { status: 400 });
    }

    const isSuccess = isPayseraStatusSuccessful(callback.status);
    const newStatus = isSuccess ? 'paid' : 'failed';

    if (order.status !== 'paid') {
      await adminClient
        .from('orders')
        .update({ status: newStatus, paysera_order_id: callback.raw.orderid ?? order.paysera_order_id })
        .eq('id', order.id);

      await adminClient.from('payment_transactions').insert({
        order_id: order.id,
        provider: 'paysera',
        provider_status: callback.status,
        amount_cents: callback.amountCents,
        currency: callback.currency,
        raw_payload: callback.raw,
      });

      if (isSuccess) {
        const planTier = order.plan_tier as PaidPlanTier;
        const planDef = BILLING_CONFIG.plans[planTier];

        const now = new Date();
        const startDate = new Date(now);
        const endDate = new Date(now);
        endDate.setMonth(endDate.getMonth() + planDef.months);

        await adminClient.from('user_plans').upsert(
          {
            user_id: order.user_id,
            category: order.category,
            plan_tier: planTier,
            start_date: startDate.toISOString(),
            end_date: endDate.toISOString(),
            status: 'active',
          },
          {
            onConflict: 'user_id,category',
          },
        );
      }
    }

    return new Response('OK');
  } catch {
    return new Response('Bad request', { status: 400 });
  }
}
