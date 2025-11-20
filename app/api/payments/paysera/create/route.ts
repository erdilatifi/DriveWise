import { NextRequest, NextResponse } from 'next/server';
import { createClient as createServerClient } from '@/utils/supabase/sever';
import { BILLING_CONFIG, type PaidPlanTier } from '@/lib/subscriptions';
import type { LicenseCategory } from '@/types/database';
import { getPayseraConfig, buildPayseraRequest, buildPayseraRedirectUrl } from '@/lib/paysera';

interface CreateBody {
  category: LicenseCategory;
  planTier: PaidPlanTier;
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = (await req.json()) as Partial<
      CreateBody & { successUrl?: string; cancelUrl?: string }
    >;
    const { category, planTier } = body;

    if (!category || !planTier) {
      return NextResponse.json({ error: 'Missing category or planTier' }, { status: 400 });
    }

    const planDef = BILLING_CONFIG.plans[planTier as PaidPlanTier];
    if (!planDef) {
      return NextResponse.json({ error: 'Invalid plan tier' }, { status: 400 });
    }

    const amountCents = Math.round(planDef.priceEur * 100);

    const config = getPayseraConfig();

    const { data: orderRow, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        category,
        plan_tier: planTier,
        amount_cents: amountCents,
        currency: 'EUR',
        status: 'pending',
      })
      .select('id')
      .single();

    if (orderError || !orderRow) {
      return NextResponse.json({ error: 'Could not create order' }, { status: 500 });
    }

    const orderId: string = orderRow.id;

    const acceptUrl = `${config.frontendBaseUrl}/payment/success?orderId=${orderId}`;
    const cancelUrl = `${config.frontendBaseUrl}/payment/cancel?orderId=${orderId}`;
    const callbackUrl = `${config.appBaseUrl}/api/payments/paysera/callback`;

    const payload = buildPayseraRequest(
      {
        orderId,
        amountCents,
        currency: 'EUR',
        acceptUrl,
        cancelUrl,
        callbackUrl,
      },
      config,
    );

    const payUrl = buildPayseraRedirectUrl(payload, config);

    return NextResponse.json({ orderId, payUrl });
  } catch {
    return NextResponse.json({ error: 'Failed to start payment.' }, { status: 500 });
  }
}
