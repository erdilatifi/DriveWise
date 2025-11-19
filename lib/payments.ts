import type { LicenseCategory } from '@/types/database';
import { createClient } from '@/utils/supabase/client';
import { BILLING_CONFIG } from './subscriptions';
import type { PaidPlanTier } from './subscriptions';

const PAYMENT_ENABLED =
  (process.env.NEXT_PUBLIC_PAYMENT_ENABLED ?? process.env.PAYMENT_ENABLED ?? 'false') === 'true';

const PAYMENT_PROVIDER =
  (process.env.NEXT_PUBLIC_PAYMENT_PROVIDER ?? process.env.PAYMENT_PROVIDER ?? 'mock') || 'mock';

export type PaymentStatus = 'requires_action' | 'succeeded' | 'failed';

export interface PaymentRequest {
  userId: string;
  category: LicenseCategory;
  planTier: PaidPlanTier;
  successUrl: string;
  cancelUrl: string;
}

export interface PaymentSession {
  id: string;
  provider: string;
  status: PaymentStatus;
  redirectUrl?: string;
}

export function isPaymentEnabled(): boolean {
  return PAYMENT_ENABLED && PAYMENT_PROVIDER !== 'mock';
}

function createMockId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

export async function createPaymentSession(
  request: PaymentRequest,
): Promise<PaymentSession> {
  if (!isPaymentEnabled()) {
    return {
      id: createMockId('mock_pay'),
      provider: 'mock',
      status: 'succeeded',
    };
  }

  // Real provider integration will go here (Stripe, bank gateway via TEB, etc.).
  // For now we keep this as a well-defined stub so we can plug in later
  // without changing the rest of the app.
  throw new Error('Real payment provider integration is not implemented yet.');
}

export interface ActivatePlanParams {
  userId: string;
  category: LicenseCategory;
  planTier: PaidPlanTier;
  purchasedAt?: Date;
}

export async function activatePlanForUser(params: ActivatePlanParams): Promise<void> {
  const { userId, category, planTier, purchasedAt } = params;

  const planDef = BILLING_CONFIG.plans[planTier];
  const now = purchasedAt ?? new Date();

  const startDate = new Date(now);
  const endDate = new Date(now);
  endDate.setMonth(endDate.getMonth() + planDef.months);

  const supabase = createClient();

  const { error } = await supabase.from('user_plans').upsert(
    {
      user_id: userId,
      category,
      plan_tier: planTier,
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
      status: 'active',
    },
    { onConflict: 'user_id,category' },
  );

  if (error) {
    throw error;
  }
}
