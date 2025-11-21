'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/utils/supabase/client';
import { Navbar } from '@/components/navbar';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CATEGORY_INFO, type LicenseCategory } from '@/types/database';
import { useAuth } from '@/contexts/auth-context';
import {
  BILLING_CONFIG,
  isPlanCurrentlyActive,
  type PaidPlanTier,
} from '@/lib/subscriptions';
// We now use a dedicated admin API route for granting plans
import { toast } from 'sonner';

interface AdminUserProfile {
  id: string;
  email: string | null;
  full_name: string | null;
  created_at: string;
}

interface AdminUserPlan {
  id: string;
  user_id: string;
  category: LicenseCategory;
  plan_tier: string;
  start_date: string;
  end_date: string;
  status: string;
  created_at: string;
}

const LICENSE_CATEGORIES: LicenseCategory[] = ['A', 'B', 'C', 'D'];

export default function AdminSubscriptionsPage() {
  const router = useRouter();
  const { user, loading: authLoading, isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const supabase = createClient();

  const [selectedPlanTier, setSelectedPlanTier] = useState<PaidPlanTier>(
    BILLING_CONFIG.bestValuePlan,
  );

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-subscriptions'],
    queryFn: async () => {
      const [profilesRes, plansRes] = await Promise.all([
        supabase
          .from('user_profiles')
          .select('id, email, full_name, created_at')
          .order('created_at'),
        supabase.from('user_plans').select('*'),
      ]);

      if (profilesRes.error) throw profilesRes.error;
      if (plansRes.error) throw plansRes.error;

      return {
        profiles: (profilesRes.data || []) as AdminUserProfile[],
        plans: (plansRes.data || []) as AdminUserPlan[],
      };
    },
    enabled: !!user && isAdmin,
    staleTime: 60 * 1000,
  });

  const grantMutation = useMutation({
    mutationFn: async (params: {
      userId: string;
      category: LicenseCategory;
      planTier: PaidPlanTier;
    }) => {
      const res = await fetch('/api/admin/plans/grant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!res.ok) {
        let message = 'Failed to grant plan';
        try {
          const data = await res.json();
          if (data?.error) message = data.error;
        } catch {
          // ignore JSON parse errors
        }
        throw new Error(message);
      }
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-subscriptions'] });

      const vars = variables as {
        userId: string;
        category: LicenseCategory;
        planTier: PaidPlanTier;
      };

      const profile = data?.profiles?.find((p) => p.id === vars.userId);
      const planDef = BILLING_CONFIG.plans[vars.planTier];

      const userLabel = profile?.full_name || profile?.email || 'user';

      toast.success(
        `Granted ${planDef.label} plan (${vars.planTier}) for category ${vars.category} to ${userLabel}.`,
      );
    },
    onError: (err: any) => {
      console.error(err);
      toast.error('Failed to grant plan. Please try again.');
    },
  });

  const plansByUser = useMemo(() => {
    const map = new Map<string, AdminUserPlan[]>();
    if (!data?.plans) return map;
    for (const plan of data.plans) {
      const arr = map.get(plan.user_id) || [];
      arr.push(plan);
      map.set(plan.user_id, arr);
    }
    return map;
  }, [data]);

  // ❗ these must be BEFORE any conditional returns (no hooks below!)
  const profiles = data?.profiles || [];

  const totalPaidUsers = useMemo(() => {
    if (!data?.plans) return 0;
    const usersWithPlans = new Set<string>();
    for (const plan of data.plans) {
      usersWithPlans.add(plan.user_id);
    }
    return usersWithPlans.size;
  }, [data]);

  // ------------- conditional UI branches (no hooks below this) -------------

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Authenticating...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-28 pb-12 max-w-4xl">
          <GlassCard className="p-8 border border-border/80 bg-black/85 text-center space-y-4">
            <div>
              <h1 className="text-xl font-semibold mb-1">Admin access required</h1>
              <p className="text-sm text-muted-foreground">
                This page is only available to admins. If you believe this is a mistake,
                please contact the owner.
              </p>
            </div>
            <Button onClick={() => router.push('/dashboard')}>Back to dashboard</Button>
          </GlassCard>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-28 pb-12 max-w-5xl flex flex-col items-center justify-center gap-3">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-muted-foreground">
            Loading subscription overview…
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-28 pb-12 max-w-5xl">
          <GlassCard className="p-6 border border-border/80 bg-black/85 space-y-2">
            <p className="text-sm font-semibold text-destructive">
              Failed to load subscriptions
            </p>
            <p className="text-xs text-muted-foreground break-words">
              Something went wrong while loading subscription data. Please try again
              later.
            </p>
          </GlassCard>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-28 pb-12 max-w-6xl space-y-6">
        {/* Header / summary card */}
        <GlassCard className="p-6 md:p-7 border border-border/80 bg-black/85 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Admin
              </p>
              <Badge variant="outline" className="border-primary/70 text-primary text-[10px]">
                Using mock payments
              </Badge>
            </div>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
              Subscription overview
            </h1>
            <p className="text-sm text-muted-foreground max-w-xl">
              See all users, their plans by category, and quickly grant or extend access
              while payments are in testing.
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span>
                Total users:&nbsp;
                <span className="font-semibold text-foreground">
                  {profiles.length}
                </span>
              </span>
              <span>
                Paying users (at least one plan):{' '}
                <span className="font-semibold text-foreground">
                  {totalPaidUsers}
                </span>
              </span>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <div className="flex flex-col items-end gap-1">
              <label className="text-[11px] text-muted-foreground">
                Plan used for grants
              </label>
              <select
                className="text-[11px] bg-black/70 border border-border/70 rounded-md px-2 py-1 text-foreground focus:outline-none focus:ring-1 focus:ring-primary/60"
                value={selectedPlanTier}
                onChange={(e) => setSelectedPlanTier(e.target.value as PaidPlanTier)}
              >
                {Object.values(BILLING_CONFIG.plans).map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.label} ({plan.months}m)
                  </option>
                ))}
              </select>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => router.push('/profile')}
            >
              Open account page
            </Button>
          </div>
        </GlassCard>

        {/* Users / plans table */}
        <GlassCard className="p-4 md:p-5 border border-border/80 bg-black/85 overflow-x-auto">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-foreground">
              Users &amp; license categories
            </h2>
            <p className="text-[11px] text-muted-foreground">
              Click &ldquo;Grant free plan&rdquo; to create or extend access.
            </p>
          </div>

          {profiles.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-sm text-muted-foreground">
                No users found yet. New users will appear here automatically.
              </p>
            </div>
          ) : (
            <table className="w-full text-xs md:text-sm border-collapse">
              <thead>
                <tr className="border-b border-border/60 bg-black/70">
                  <th className="py-2 pr-3 text-left font-medium text-muted-foreground sticky top-0 bg-black/80 backdrop-blur z-10">
                    User
                  </th>
                  <th className="py-2 pr-3 text-left font-medium text-muted-foreground hidden md:table-cell sticky top-0 bg-black/80 backdrop-blur z-10">
                    Email
                  </th>
                  {LICENSE_CATEGORIES.map((cat) => (
                    <th
                      key={cat}
                      className="py-2 px-2 text-left font-medium text-muted-foreground whitespace-nowrap sticky top-0 bg-black/80 backdrop-blur z-10"
                    >
                      Cat {cat}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {profiles.map((profile) => {
                  const userPlans = plansByUser.get(profile.id) || [];

                  const getPlanCell = (category: LicenseCategory) => {
                    const row = userPlans.find((p) => p.category === category);
                    if (!row) {
                      return {
                        label: 'Free',
                        detail: '',
                        isActive: false,
                        isExpired: false,
                      };
                    }

                    const active =
                      row.status === 'active' &&
                      isPlanCurrentlyActive({
                        startDate: row.start_date,
                        endDate: row.end_date,
                      });

                    const endDate = new Date(row.end_date);
                    const now = new Date();
                    const remainingDays = Math.max(
                      0,
                      Math.ceil(
                        (endDate.getTime() - now.getTime()) /
                          (1000 * 60 * 60 * 24),
                      ),
                    );

                    return {
                      label: active ? row.plan_tier : `${row.plan_tier} (expired)`,
                      detail: active
                        ? `${remainingDays}d left`
                        : endDate.toLocaleDateString(),
                      isActive: active,
                      isExpired: !active,
                    };
                  };

                  return (
                    <tr
                      key={profile.id}
                      className="border-b border-border/30 last:border-0 hover:bg-white/5 transition-colors"
                    >
                      <td className="py-2 pr-3 align-top">
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground">
                            {profile.full_name || profile.email || 'Unknown user'}
                          </span>
                          <span className="md:hidden text-[11px] text-muted-foreground">
                            {profile.email || ''}
                          </span>
                          <span className="text-[10px] text-muted-foreground mt-0.5">
                            Joined:{' '}
                            {new Date(profile.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </td>
                      <td className="py-2 pr-3 align-top hidden md:table-cell text-muted-foreground">
                        {profile.email || ''}
                      </td>
                      {LICENSE_CATEGORIES.map((cat) => {
                        const planCell = getPlanCell(cat);
                        const isMutating = grantMutation.isPending;

                        return (
                          <td key={cat} className="py-2 px-2 align-top">
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-1">
                                <span
                                  className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium border ${
                                    planCell.isActive
                                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/40'
                                      : planCell.isExpired
                                      ? 'bg-red-500/10 text-red-400 border-red-500/40'
                                      : 'bg-muted/60 text-muted-foreground border-border/50'
                                  }`}
                                >
                                  {planCell.label}
                                </span>
                              </div>
                              {planCell.detail && (
                                <span className="text-[10px] text-muted-foreground">
                                  {planCell.detail}
                                </span>
                              )}
                              <Button
                                size="sm"
                                variant="outline"
                                className="mt-1 text-[10px] px-2 py-1 h-7"
                                disabled={isMutating}
                                onClick={() =>
                                  grantMutation.mutate({
                                    userId: profile.id,
                                    category: cat,
                                    planTier: selectedPlanTier,
                                  })
                                }
                              >
                                {planCell.isActive ? 'Extend (free)' : 'Grant free plan'}
                              </Button>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
