'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CATEGORY_INFO, type LicenseCategory } from '@/types/database';
import { useAuth } from '@/contexts/auth-context';
import { useLanguage } from '@/contexts/language-context';
import { useUserPlans, useGlobalPremium } from '@/hooks/use-subscriptions';
import { useTestAttempts } from '@/hooks/use-test-attempts';
import { BILLING_CONFIG, countTestsInCurrentCycle, isPlanCurrentlyActive } from '@/lib/subscriptions';
import { createPaymentSession, activatePlanForUser } from '@/lib/payments';
import { toast } from 'sonner';

const LICENSE_CATEGORIES: LicenseCategory[] = ['A', 'B', 'C', 'D'];

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading: authLoading, isAdmin, userProfile } = useAuth();
  const { t } = useLanguage();

  const [updatingCategory, setUpdatingCategory] = useState<LicenseCategory | null>(null);

  const { data: plans } = useUserPlans(user?.id || undefined);
  const { hasAnyActivePlan } = useGlobalPremium(user?.id, isAdmin);
  const { data: attempts } = useTestAttempts(user?.id || undefined);

  const attemptsArray = (attempts || []) as { category: string; completed_at: string }[];

  const testsByCategoryThisCycle: Record<LicenseCategory, number> = useMemo(() => {
    const now = new Date();
    const result: Record<LicenseCategory, number> = {
      A: 0,
      B: 0,
      C: 0,
      D: 0,
    };
    for (const cat of LICENSE_CATEGORIES) {
      result[cat] = countTestsInCurrentCycle({
        attempts: attemptsArray,
        category: cat,
        now,
      });
    }
    return result;
  }, [attemptsArray]);

  let mostActiveCategory: LicenseCategory | null = null;
  let mostActiveCount = 0;
  for (const cat of LICENSE_CATEGORIES) {
    const used = testsByCategoryThisCycle[cat];
    if (used > mostActiveCount) {
      mostActiveCount = used;
      mostActiveCategory = cat;
    }
  }

  const handlePlanChange = async (category: LicenseCategory) => {
    if (!user || isAdmin) return;

    setUpdatingCategory(category);
    try {
      const planTier = BILLING_CONFIG.bestValuePlan;
      const successUrl = window.location.origin + '/profile';
      const cancelUrl = successUrl;

      const session = await createPaymentSession({
        userId: user.id,
        category,
        planTier,
        successUrl,
        cancelUrl,
      });

      if (session.status === 'succeeded') {
        await activatePlanForUser({
          userId: user.id,
          category,
          planTier,
        });
        toast.success('Plan updated', {
          description: `Your plan for category ${category} is now active.`,
        });
        router.refresh();
      } else if (session.redirectUrl) {
        window.location.href = session.redirectUrl;
      } else {
        toast.error('Payment did not complete. Please try again.');
      }
    } catch (error: unknown) {
      console.error('Error during plan change:', error);
      const description = error instanceof Error ? error.message : 'Please try again later.';
      toast.error('Could not start payment.', {
        description,
      });
    } finally {
      setUpdatingCategory(null);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">
            {authLoading ? t('auth.signingIn') : t('test.loadingQuestions')}
          </p>
        </div>
      </div>
    );
  }

  const displayName =
    userProfile?.full_name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
  const email = user.email || userProfile?.email || '';

  const getPlanForCategory = (category: LicenseCategory) => {
    if (!plans) return null;
    const row = plans.find((p) => p.category === category);
    if (!row) return null;
    const active =
      row.status === 'active' &&
      isPlanCurrentlyActive({ startDate: row.start_date, endDate: row.end_date });
    return {
      raw: row,
      isActive: active,
    };
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-5xl space-y-6">
          <GlassCard className="p-6 md:p-7 border border-border/80 bg-black/85 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">{t('profile.title') || 'Plan & usage summary'}</p>
              <h1 className="text-2xl md:text-3xl font-semibold tracking-tight mb-1">{displayName}</h1>
              {email && <p className="text-sm text-muted-foreground">{email}</p>}
              {!isAdmin && (
                <p className="mt-1 text-xs text-muted-foreground">
                  {hasAnyActivePlan
                    ? 'You have at least one active paid plan. See details by category below.'
                    : 'You are currently on the free plan. You can start a paid plan for any category below.'}
                </p>
              )}
              {isAdmin && (
                <p className="mt-2 text-xs text-amber-400">
                  {t('profile.adminUnlimited') ||
                    'Admin: You already have unlimited access to all categories and features.'}
                </p>
              )}
            </div>
            <div className="flex flex-col items-end gap-2">
              {hasAnyActivePlan && !isAdmin && (
                <Badge variant="outline" className="border-emerald-500/70 text-emerald-400 text-xs">
                  {t('profile.premiumBadge') || 'Active paid plan'}
                </Badge>
              )}
            </div>
          </GlassCard>

          <GlassCard className="p-6 md:p-7 border border-border/80 bg-black/85">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-semibold tracking-tight">
                  {t('profile.planStatusTitle') || 'Plans & usage by license category'}
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Track your current plan, remaining days, and test usage for each category.
                </p>
                {mostActiveCategory && mostActiveCount > 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Most active this cycle: Category {mostActiveCategory} - {CATEGORY_INFO[mostActiveCategory].name}{' '}
                    ({mostActiveCount} tests).
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {LICENSE_CATEGORIES.map((cat) => {
                const info = CATEGORY_INFO[cat];
                const planInfo = getPlanForCategory(cat);
                const planRow = planInfo?.raw;
                const isActive = planInfo?.isActive || false;
                const isPaid = !!planRow;

                const statusLabel = isPaid ? 'Paid' : 'Free';
                const statusClass = isPaid
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/40'
                  : 'bg-muted text-muted-foreground';

                const testsUsed = testsByCategoryThisCycle[cat];
                const freeLimit = BILLING_CONFIG.freeTestLimitPerCategory;

                const endDate = planRow?.end_date ? new Date(planRow.end_date) : null;
                const now = new Date();
                const remainingDays = endDate
                  ? Math.max(0, Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
                  : null;

                const isProcessing = updatingCategory === cat;

                return (
                  <div
                    key={cat}
                    className="rounded-xl border border-border/80 bg-black/70 p-4 flex flex-col gap-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Category {cat}</p>
                        <p className="text-sm font-semibold">{info.name}</p>
                      </div>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${statusClass}`}
                      >
                        {statusLabel}
                      </span>
                    </div>

                    {isPaid && planRow && (
                      <div className="text-xs text-muted-foreground space-y-1">
                        <p>
                          Plan: <span className="font-medium">{planRow.plan_tier}</span>
                        </p>
                        <p>
                          {t('profile.expiresOnLabel') || 'Expires on:'}{' '}
                          {endDate ? endDate.toLocaleDateString() : '-'}
                          {remainingDays !== null && (
                            <span className="text-muted-foreground/70">
                              {' '}
                              ({remainingDays} {t('profile.daysRemaining') || 'days left'})
                            </span>
                          )}
                        </p>
                        <p>
                          Tests this cycle:{' '}
                          <span className="font-medium">{testsUsed}</span>
                        </p>
                      </div>
                    )}

                    {!isPaid && !isAdmin && (
                      <p className="text-xs text-muted-foreground">
                        {t('profile.freeUsageLabel') || 'Free usage this cycle:'}{' '}
                        <span className="font-medium">
                          {testsUsed}/{freeLimit} {t('profile.testsLabel') || 'tests'}
                        </span>
                      </p>
                    )}

                    <div className="mt-auto flex gap-2">
                      {(!isPaid || !isActive) && !isAdmin && (
                        <Button
                          size="sm"
                          variant="default"
                          className="text-xs flex-1"
                          onClick={() => handlePlanChange(cat)}
                          disabled={isProcessing}
                        >
                          {t('profile.upgradeCta') || 'Start plan'}
                        </Button>
                      )}
                      {isPaid && isActive && !isAdmin && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs flex-1"
                          onClick={() => handlePlanChange(cat)}
                          disabled={isProcessing}
                        >
                          {t('profile.extendCta') || 'Extend / renew'}
                        </Button>
                      )}
                      {isAdmin && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs flex-1"
                          onClick={() => router.push('/admin/subscriptions')}
                        >
                          {t('profile.previewCta') || 'Manage users'}
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
