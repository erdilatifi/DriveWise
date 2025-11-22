import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/utils/supabase/client';
import type { LicenseCategory, UserPlan as DbUserPlan } from '@/types/database';
import {
  computeEntitlements,
  countTestsInCurrentCycle,
  isPlanCurrentlyActive,
  type CategoryPlan,
  type Entitlements,
  type PaidPlanTier,
} from '@/lib/subscriptions';

interface CategoryEntitlementsResult {
  entitlements: Entitlements;
  plan: CategoryPlan | null;
  testsTakenThisCycle: number;
}

interface TestAttemptRowForEntitlements {
  category: LicenseCategory;
  completed_at: string;
}

export function useUserPlans(userId?: string) {
  return useQuery<DbUserPlan[]>({
    queryKey: ['user-plans', userId],
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('user_plans')
        .select('*')
        .eq('user_id', userId!);
      if (error) {
        throw error;
      }
      return data || [];
    },
    enabled: !!userId,
    staleTime: 0,
    refetchOnMount: 'always',
  });
}

export function useGlobalPremium(userId?: string, isAdmin?: boolean) {
  const query = useUserPlans(userId);

  const now = new Date();
  const hasAnyActivePlan =
    !!isAdmin ||
    (query.data || []).some((plan) =>
      plan.status === 'active' &&
      isPlanCurrentlyActive({ startDate: plan.start_date, endDate: plan.end_date }, now),
    );

  return {
    ...query,
    hasAnyActivePlan,
  };
}

export function useCategoryEntitlements(
  userId: string | undefined,
  category: LicenseCategory | undefined,
  isAdmin: boolean,
) {
  return useQuery<CategoryEntitlementsResult>({
    queryKey: ['category-entitlements', userId, category, isAdmin],
    queryFn: async () => {
      const supabase = createClient();

      const [plansResult, attemptsResult] = await Promise.all([
        supabase
          .from('user_plans')
          .select('*')
          .eq('user_id', userId!)
          .eq('category', category!)
          .order('end_date', { ascending: false })
          .limit(1),
        supabase
          .from('test_attempts')
          .select('category, completed_at')
          .eq('user_id', userId!),
      ]);

      if (plansResult.error) {
        throw plansResult.error;
      }
      if (attemptsResult.error) {
        throw attemptsResult.error;
      }

      const planRow = (plansResult.data || [])[0] as DbUserPlan | undefined;

      const now = new Date();

      const testsTakenThisCycle = countTestsInCurrentCycle({
        attempts: (attemptsResult.data || []).map((a: TestAttemptRowForEntitlements) => ({
          category: a.category,
          completed_at: a.completed_at,
        })),
        category: category!,
        now,
      });

      const plan: CategoryPlan | null = planRow
        ? {
            id: planRow.id,
            userId: planRow.user_id,
            category: planRow.category,
            planTier: planRow.plan_tier as PaidPlanTier,
            startDate: planRow.start_date,
            endDate: planRow.end_date,
            isActive: planRow.status === 'active',
            createdAt: planRow.created_at,
          }
        : null;

      const entitlements = computeEntitlements({
        isAdmin,
        testsTakenThisCycle,
        activePlan: plan
          ? {
              planTier: plan.planTier,
              startDate: plan.startDate,
              endDate: plan.endDate,
              isActive: plan.isActive,
            }
          : null,
        now,
      });

      return {
        entitlements,
        plan,
        testsTakenThisCycle,
      };
    },
    enabled: !!userId && !!category,
    staleTime: 0,
    refetchOnMount: 'always',
  });
}
