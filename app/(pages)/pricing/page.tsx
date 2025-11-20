'use client';

import { useState, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Check, ArrowLeft, Crown, Sparkles } from 'lucide-react';
import { CATEGORY_INFO, type LicenseCategory } from '@/types/database';
import { BILLING_CONFIG, isPlanCurrentlyActive, type PaidPlanTier } from '@/lib/subscriptions';
import { createPaymentSession, activatePlanForUser } from '@/lib/payments';
import { useAuth } from '@/contexts/auth-context';
import { useLanguage } from '@/contexts/language-context';
import { useUserPlans, useGlobalPremium } from '@/hooks/use-subscriptions';
import { toast } from 'sonner';

const LICENSE_CATEGORIES: LicenseCategory[] = ['A', 'B', 'C', 'D'];

export default function PricingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAdmin } = useAuth();
  const { t } = useLanguage();

  const paymentStatus = searchParams.get('payment');

  const initialCategory = useMemo<LicenseCategory>(() => {
    const fromQuery = (searchParams.get('category') || '').toUpperCase();
    if (LICENSE_CATEGORIES.includes(fromQuery as LicenseCategory)) {
      return fromQuery as LicenseCategory;
    }
    return 'B';
  }, [searchParams]);

  const initialPlan = useMemo<PaidPlanTier>(() => {
    const fromQuery = (searchParams.get('plan') || '').toUpperCase() as PaidPlanTier;
    if (fromQuery && BILLING_CONFIG.plans[fromQuery]) {
      return fromQuery;
    }
    return BILLING_CONFIG.bestValuePlan;
  }, [searchParams]);

  const [selectedCategory, setSelectedCategory] = useState<LicenseCategory>(
    initialCategory,
  );
  const [selectedPlan, setSelectedPlan] = useState<PaidPlanTier>(initialPlan);
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: existingPlans } = useUserPlans(user?.id || undefined);
  const { hasAnyActivePlan } = useGlobalPremium(user?.id, isAdmin);

  const currentCategoryPlan = useMemo(() => {
    if (!existingPlans) return null;
    return existingPlans.find((p) => p.category === selectedCategory) || null;
  }, [existingPlans, selectedCategory]);

  const currentCategoryPlanActive = useMemo(() => {
    if (!currentCategoryPlan) return false;
    if (currentCategoryPlan.status !== 'active') return false;
    return isPlanCurrentlyActive({
      startDate: currentCategoryPlan.start_date,
      endDate: currentCategoryPlan.end_date,
    });
  }, [currentCategoryPlan]);

  const handlePurchase = async () => {
    if (!user) {
      router.push('/login');
      return;
    }
    if (isAdmin) {
      toast.info('Admins already have full access to all features.', {
        description: 'You can still use this page to preview pricing, but no payment is required.',
      });
      return;
    }
    if (currentCategoryPlanActive) {
      toast.info('You already have an active plan for this category.', {
        description:
          'You can purchase a new plan for this category after the current one expires.',
      });
      return;
    }
    setIsProcessing(true);
    try {
      const paymentEnabled =
        (process.env.NEXT_PUBLIC_PAYMENT_ENABLED ?? 'false') === 'true';
      const paymentProvider = process.env.NEXT_PUBLIC_PAYMENT_PROVIDER ?? 'mock';

      if (paymentEnabled && paymentProvider === 'paysera') {
        const response = await fetch('/api/payments/paysera/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            category: selectedCategory,
            planTier: selectedPlan,
          }),
        });

        if (!response.ok) {
          toast.error('Could not start payment.', {
            description: t('error.message'),
          });
          return;
        }

        const data = await response.json();
        if (!data.payUrl) {
          toast.error('Could not start payment.', {
            description: t('error.message'),
          });
          return;
        }

        window.location.href = data.payUrl as string;
      } else {
        const baseUrl =
          window.location.origin + '/pricing?category=' + selectedCategory.toLowerCase();
        const successUrl = baseUrl + '&payment=success';
        const cancelUrl = baseUrl + '&payment=cancel';

        const session = await createPaymentSession({
          userId: user.id,
          category: selectedCategory,
          planTier: selectedPlan,
          successUrl,
          cancelUrl,
        });

        if (session.status === 'succeeded') {
          await activatePlanForUser({
            userId: user.id,
            category: selectedCategory,
            planTier: selectedPlan,
          });
          toast.success('Your plan is now active.', {
            description:
              'You have full access for this category. Decision Trainer and Study Material are unlocked.',
          });
          router.refresh();
        } else if (session.redirectUrl) {
          window.location.href = session.redirectUrl;
        } else {
          toast.error('Payment did not complete. Please try again.');
        }
      }
    } catch (error: unknown) {
      toast.error('Could not start payment.', {
        description: t('error.message'),
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const featureListFree = [
    'Up to 3 tests per category each cycle',
    'Basic test history only (scores & dates)',
    'No Decision Trainer',
    'No Study Material access',
    'No detailed test review with explanations',
  ];

  const featureListPaid = [
    'Higher or unlimited tests in your chosen category',
    'Full Decision Trainer access (all trainer categories)',
    'Full Study Material access (all chapters)',
    'Detailed test review with explanations',
    'Smarter practice suggestions and insights',
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="mb-4 flex items-center justify-between">
            <Button variant="ghost" onClick={() => router.back()} className="text-sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('auth.backToHome')}
            </Button>
            {hasAnyActivePlan && !isAdmin && (
              <Badge variant="outline" className="border-emerald-500/60 text-emerald-400 text-xs">
                <Crown className="w-3 h-3 mr-1" />
                {t('plans.currentlyPremium') || 'You are currently on a paid plan'}
              </Badge>
            )}
          </div>

          {paymentStatus === 'success' && (
            <div className="mb-4 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-50">
              Your payment was confirmed. If this was a new plan, your access should now be active.
            </div>
          )}
          {paymentStatus === 'cancel' && (
            <div className="mb-4 rounded-xl border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs text-amber-50">
              Payment was canceled or did not complete. You can try again below.
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-[1.2fr,1.8fr] items-start mb-8">
            <GlassCard className="p-6 md:p-7 border border-border/80 bg-black/85">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/5 px-3 py-1 text-[11px] font-medium text-primary mb-4">
                <Sparkles className="w-4 h-4" />
                <span>{t('plans.hero.badge') || 'Smart plans for serious learners'}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-3">
                {t('plans.hero.title') || 'Choose your plan'}
              </h1>
              <p className="text-sm text-muted-foreground mb-4">
                {t('plans.hero.subtitle') ||
                  'Start free with a few tests, then unlock Decision Trainer, full Study Material, and detailed reviews when you are ready.'}
              </p>

              <div className="mt-4">
                <p className="text-xs font-medium text-muted-foreground mb-2">
                  {t('plans.selectCategoryLabel') || 'License category'}
                </p>
                <div className="flex flex-wrap gap-2">
                  {LICENSE_CATEGORIES.map((cat) => {
                    const info = CATEGORY_INFO[cat];
                    const isActive = cat === selectedCategory;
                    return (
                      <Button
                        key={cat}
                        type="button"
                        size="sm"
                        variant={isActive ? 'default' : 'outline'}
                        className={`text-xs px-3 py-1 rounded-full border ${
                          isActive
                            ? 'border-primary/70 bg-primary text-primary-foreground'
                            : 'border-border/70 bg-black/40 text-foreground'
                        }`}
                        onClick={() => setSelectedCategory(cat)}
                      >
                        {info.name}
                      </Button>
                    );
                  })}
                </div>

                {currentCategoryPlan && (
                  <p className="mt-3 text-xs text-emerald-400">
                    {t('plans.currentPlanLabel') || 'Current plan:'}{' '}
                    <span className="font-semibold">{currentCategoryPlan.plan_tier}</span>
                  </p>
                )}

                {isAdmin && (
                  <p className="mt-3 text-xs text-amber-400">
                    {t('plans.adminNote') ||
                      'You are an admin and already have unlimited access. This page is in preview mode.'}
                  </p>
                )}

                <div className="mt-6 grid gap-3 md:grid-cols-2">
                  <Card className="border border-border/80 bg-black/70">
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center gap-2">
                        Free plan
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1">
                      {featureListFree.map((f) => (
                        <p key={f} className="text-xs text-muted-foreground flex items-start gap-2">
                          <span className="mt-[3px] text-muted-foreground/60">•</span>
                          <span>{f}</span>
                        </p>
                      ))}
                    </CardContent>
                  </Card>

                  <Card className="border border-primary/70 bg-primary/5">
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Crown className="w-4 h-4 text-primary" />
                        Paid benefits
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1">
                      {featureListPaid.map((f) => (
                        <p key={f} className="text-xs text-muted-foreground flex items-start gap-2">
                          <Check className="w-3 h-3 mt-[2px] text-primary" />
                          <span>{f}</span>
                        </p>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </GlassCard>

            <div className="grid gap-4 md:grid-cols-3">
              {Object.values(BILLING_CONFIG.plans).map((plan) => {
                const isBestValue = plan.id === BILLING_CONFIG.bestValuePlan;
                const isSelected = plan.id === selectedPlan;
                const isCurrentActivePlan =
                  !!currentCategoryPlan &&
                  currentCategoryPlan.plan_tier === plan.id &&
                  currentCategoryPlanActive;

                return (
                  <Card
                    key={plan.id}
                    className={`relative border transition-all cursor-pointer flex flex-col justify-between h-full ${
                      isBestValue
                        ? 'border-primary/80 bg-primary/5 shadow-[0_20px_60px_rgba(0,0,0,0.9)] scale-[1.02]'
                        : 'border-border/80 bg-black/80 hover:border-primary/60'
                    } ${isSelected ? 'ring-2 ring-primary/60' : ''}`}
                    onClick={() => {
                      if (!isCurrentActivePlan && !isProcessing && !isAdmin) {
                        setSelectedPlan(plan.id);
                      }
                    }}
                  >
                    {isBestValue && (
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                        <Badge className="text-[10px] px-3 py-0.5 bg-primary text-primary-foreground">
                          Best value
                        </Badge>
                      </div>
                    )}
                    <CardHeader className="pt-6 pb-3">
                      <CardTitle className="text-sm font-semibold flex items-center justify-between">
                        <span>{plan.label}</span>
                        <span className="text-xs text-muted-foreground">
                          ≈ {plan.pricePerMonthEur.toFixed(2)} €/mo
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-2xl font-bold mb-1">{plan.priceEur} €</p>
                      <p className="text-xs text-muted-foreground">
                        {plan.months === 1
                          ? 'for 1 month access'
                          : `${plan.months} months of access`}
                      </p>
                    </CardContent>
                    <CardFooter className="pt-2 flex flex-col gap-2">
                      <Button
                        type="button"
                        disabled={isProcessing || isAdmin || isCurrentActivePlan}
                        className="w-full"
                      >
                        {isAdmin
                          ? 'Admin preview'
                          : isCurrentActivePlan
                          ? 'Current active plan'
                          : isProcessing && isSelected
                          ? 'Processing...'
                          : 'Select plan'}
                      </Button>
                      {isCurrentActivePlan && currentCategoryPlan?.end_date && (
                        <p className="mt-1 text-[11px] text-emerald-400 text-center">
                          Active until {new Date(currentCategoryPlan.end_date).toLocaleDateString()}
                        </p>
                      )}
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          </div>

          <div className="mt-6 flex flex-col items-end gap-2">
            <div className="flex items-center gap-3">
              <Button
                type="button"
                onClick={handlePurchase}
                disabled={isProcessing || isAdmin || currentCategoryPlanActive}
                className="min-w-[200px]"
              >
                {isAdmin
                  ? 'Admin preview'
                  : isProcessing
                  ? 'Processing...'
                  : 'Continue to payment'}
              </Button>
            </div>
            {currentCategoryPlanActive && currentCategoryPlan && (
              <p className="text-xs text-muted-foreground max-w-md text-right">
                You already have an active {currentCategoryPlan.plan_tier} plan for{' '}
                {CATEGORY_INFO[selectedCategory].name}. You can buy again for this category after it
                expires.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
