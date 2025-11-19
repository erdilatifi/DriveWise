'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/utils/supabase/client';
import { Navbar } from '@/components/navbar';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CATEGORY_INFO, type LicenseCategory } from '@/types/database';
import { useAuth } from '@/contexts/auth-context';
import { BILLING_CONFIG, isPlanCurrentlyActive } from '@/lib/subscriptions';
import { activatePlanForUser } from '@/lib/payments';

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

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-subscriptions'],
    queryFn: async () => {
      const [profilesRes, plansRes] = await Promise.all([
        supabase.from('user_profiles').select('id, email, full_name, created_at').order('created_at'),
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
    mutationFn: async (params: { userId: string; category: LicenseCategory }) => {
      await activatePlanForUser({
        userId: params.userId,
        category: params.category,
        planTier: BILLING_CONFIG.bestValuePlan,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-subscriptions'] });
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
          <GlassCard className="p-8 border border-border/80 bg-black/85 text-center">
            <h1 className="text-xl font-semibold mb-2">Admin access required</h1>
            <p className="text-sm text-muted-foreground mb-4">
              This page is only available to admins. If you believe this is a mistake, please contact the owner.
            </p>
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
        <div className="container mx-auto px-4 pt-28 pb-12 max-w-5xl flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-28 pb-12 max-w-5xl">
          <GlassCard className="p-6 border border-border/80 bg-black/85">
            <p className="text-sm font-semibold text-destructive mb-1">Failed to load subscriptions</p>
            <p className="text-xs text-muted-foreground break-words">
              {error instanceof Error ? error.message : String(error)}
            </p>
          </GlassCard>
        </div>
      </div>
    );
  }

  const profiles = data?.profiles || [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-28 pb-12 max-w-6xl space-y-6">
        <GlassCard className="p-6 md:p-7 border border-border/80 bg-black/85 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Admin</p>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight mb-1">
              Subscription overview
            </h1>
            <p className="text-sm text-muted-foreground">
              See all users, their plans by category, and quickly grant or extend access while payments are in testing.
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge variant="outline" className="border-primary/70 text-primary text-xs">
              Using mock payments
            </Badge>
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

        <GlassCard className="p-4 md:p-5 border border-border/80 bg-black/85 overflow-x-auto">
          <table className="w-full text-xs md:text-sm border-collapse">
            <thead>
              <tr className="border-b border-border/60">
                <th className="py-2 pr-3 text-left font-medium text-muted-foreground">User</th>
                <th className="py-2 pr-3 text-left font-medium text-muted-foreground hidden md:table-cell">
                  Email
                </th>
                {LICENSE_CATEGORIES.map((cat) => (
                  <th
                    key={cat}
                    className="py-2 px-2 text-left font-medium text-muted-foreground whitespace-nowrap"
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
                    };
                  }
                  const active =
                    row.status === 'active' &&
                    isPlanCurrentlyActive({ startDate: row.start_date, endDate: row.end_date });
                  const endDate = new Date(row.end_date);
                  const now = new Date();
                  const remainingDays = Math.max(
                    0,
                    Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
                  );
                  return {
                    label: active ? row.plan_tier : `${row.plan_tier} (expired)`,
                    detail: active ? `${remainingDays}d left` : endDate.toLocaleDateString(),
                    isActive: active,
                  };
                };

                return (
                  <tr key={profile.id} className="border-b border-border/30 last:border-0">
                    <td className="py-2 pr-3 align-top">
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground">
                          {profile.full_name || profile.email || 'Unknown user'}
                        </span>
                        <span className="md:hidden text-[11px] text-muted-foreground">
                          {profile.email || ''}
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
                                className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium ${
                                  planCell.isActive
                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/40'
                                    : 'bg-muted text-muted-foreground'
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
                                grantMutation.mutate({ userId: profile.id, category: cat })
                              }
                            >
                              {planCell.isActive ? 'Extend' : 'Grant plan'}
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
        </GlassCard>
      </div>
    </div>
  );
}
