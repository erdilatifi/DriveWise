import type { LicenseCategory } from '../types/database';

// Plan identifiers
export type PlanTier = 'FREE' | 'PLAN_A' | 'PLAN_B' | 'PLAN_C';

export type PaidPlanTier = Exclude<PlanTier, 'FREE'>;

export interface PlanDefinition {
  id: PaidPlanTier;
  label: string;
  months: number;
  priceEur: number;
  // derived convenience fields
  pricePerMonthEur: number;
  badge?: 'MOST_POPULAR' | 'BEST_VALUE';
  emphasize?: boolean;
}

export interface BillingConfig {
  freeTestLimitPerCategory: number;
  paidTestLimitPerCategory: number;
  billingCycleDays: number;
  bestValuePlan: PaidPlanTier;
  plans: Record<PaidPlanTier, PlanDefinition>;
}

// Centralized billing / pricing configuration.
// Values can be overridden via NEXT_PUBLIC_* env vars without changing code.
const freeLimit = 3; // Default from web env
const paidLimit = 9999;
const cycleDays = 30;
const bestValueEnv = 'PLAN_C';

const rawPlans: Omit<PlanDefinition, 'pricePerMonthEur'>[] = [
  {
    id: 'PLAN_A',
    label: '1 month',
    months: 1,
    priceEur: 3,
  },
  {
    id: 'PLAN_B',
    label: '2 months',
    months: 2,
    priceEur: 6,
  },
  {
    id: 'PLAN_C',
    label: '3 months',
    months: 3,
    priceEur: 8,
    badge: 'BEST_VALUE',
    emphasize: true,
  },
];

const plansRecord = rawPlans.reduce<Record<PaidPlanTier, PlanDefinition>>((acc, plan) => {
  const pricePerMonthEur = plan.priceEur / plan.months;
  acc[plan.id] = { ...plan, pricePerMonthEur };
  return acc;
}, {} as Record<PaidPlanTier, PlanDefinition>);

export const BILLING_CONFIG: BillingConfig = {
  freeTestLimitPerCategory: freeLimit,
  paidTestLimitPerCategory: paidLimit,
  billingCycleDays: cycleDays,
  bestValuePlan: bestValueEnv as PaidPlanTier,
  plans: plansRecord,
};

export interface CategoryPlan {
  id: string;
  userId: string;
  category: LicenseCategory;
  planTier: PaidPlanTier;
  startDate: string; // ISO
  endDate: string;   // ISO
  isActive: boolean;
  createdAt: string; // ISO
}

export interface Entitlements {
  canAccessTests: boolean;
  canStartNewTest: boolean;
  remainingFreeTests?: number;
  canAccessDecisionTrainer: boolean;
  canAccessStudyMaterial: boolean;
  canReviewTestsInDetail: boolean;
}

export interface EntitlementInput {
  isAdmin: boolean;
  testsTakenThisCycle: number;
  activePlan?: Pick<CategoryPlan, 'planTier' | 'startDate' | 'endDate' | 'isActive'> | null;
  now?: Date;
}

export function isPlanCurrentlyActive(plan?: { startDate: string; endDate: string } | null, now: Date = new Date()): boolean {
  if (!plan) return false;
  const start = new Date(plan.startDate).getTime();
  const end = new Date(plan.endDate).getTime();
  const ts = now.getTime();
  return ts >= start && ts <= end;
}

export function computeEntitlements(input: EntitlementInput): Entitlements {
  const { isAdmin, testsTakenThisCycle, activePlan, now } = input;

  if (isAdmin) {
    return {
      canAccessTests: true,
      canStartNewTest: true,
      remainingFreeTests: undefined,
      canAccessDecisionTrainer: true,
      canAccessStudyMaterial: true,
      canReviewTestsInDetail: true,
    };
  }

  const hasActivePaidPlan = !!activePlan && isPlanCurrentlyActive(
    { startDate: activePlan.startDate, endDate: activePlan.endDate },
    now,
  );

  if (hasActivePaidPlan) {
    return {
      canAccessTests: true,
      canStartNewTest: testsTakenThisCycle < BILLING_CONFIG.paidTestLimitPerCategory,
      remainingFreeTests: Math.max(
        0,
        BILLING_CONFIG.paidTestLimitPerCategory - testsTakenThisCycle,
      ),
      canAccessDecisionTrainer: true,
      canAccessStudyMaterial: true,
      canReviewTestsInDetail: true,
    };
  }

  const remainingFree = Math.max(0, BILLING_CONFIG.freeTestLimitPerCategory - testsTakenThisCycle);

  return {
    canAccessTests: true,
    canStartNewTest: remainingFree > 0,
    remainingFreeTests: remainingFree,
    canAccessDecisionTrainer: false,
    canAccessStudyMaterial: false,
    canReviewTestsInDetail: false,
  };
}

export interface CycleUsageInput {
  attempts: { category: string; completed_at: string }[];
  category: LicenseCategory;
  now?: Date;
}

export function countTestsInCurrentCycle(input: CycleUsageInput): number {
  const { attempts, category, now } = input;
  const current = now ?? new Date();
  const cycleStart = new Date(current);
  cycleStart.setDate(cycleStart.getDate() - BILLING_CONFIG.billingCycleDays + 1);
  const startTs = cycleStart.getTime();
  const endTs = current.getTime();

  return attempts.filter((a) => {
    if (a.category !== category) return false;
    const ts = new Date(a.completed_at).getTime();
    return ts >= startTs && ts <= endTs;
  }).length;
}
