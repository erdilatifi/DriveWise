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
import { BILLING_CONFIG, type PaidPlanTier } from '@/lib/subscriptions';
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

  const initialCategory = useMemo<LicenseCategory>(() => {
    const fromQuery = (searchParams.get('category') || '').toUpperCase();
    if (LICENSE_CATEGORIES.includes(fromQuery as LicenseCategory)) {
      return fromQuery as LicenseCategory;
    }
    return 'B';
  }, [searchParams]);

  const [selectedCategory, setSelectedCategory] = useState<LicenseCategory>(
    initialCategory,
  );
  const [selectedPlan, setSelectedPlan] = useState<PaidPlanTier>(BILLING_CONFIG.bestValuePlan);
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: existingPlans } = useUserPlans(user?.id || undefined);
  const { hasAnyActivePlan } = useGlobalPremium(user?.id, isAdmin);

  const currentCategoryPlan = useMemo(() => {
    if (!existingPlans) return null;
    return existingPlans.find((p) => p.category === selectedCategory) || null;
  }, [existingPlans, selectedCategory]);

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
    setIsProcessing(true);
    try {
      const successUrl = window.location.origin + '/pricing?category=' + selectedCategory.toLowerCase();
      const cancelUrl = successUrl;

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
          description: 'You have full access for this category. Decision Trainer and Study Material are unlocked.',
        });
        router.refresh();
      } else if (session.redirectUrl) {
        window.location.href = session.redirectUrl;
      } else {
        toast.error('Payment did not complete. Please try again.');
      }
    } catch (error: unknown) {
      console.error('Error during payment:', error);
      const description = error instanceof Error ? error.message : 'Please try again later.';
      toast.error('Could not start payment.', {
        description,
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
          <div className="mb-6 flex items-center justify-between">
            <Button variant="ghost" onClick={() => router.back()} className="text-sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('auth.backToHome')}
            </Button>
            {hasAnyActivePlan && !isAdmin && (
              <Badge variant="outline" className="border-emerald-500/60 text-emerald-400 text-xs">
                <Crown className="w-3 h-3 mr-1" />
                {t('pricing.currentlyPremium') || 'You are currently on a paid plan'}
              </Badge>
            )}
          </div>

          <div className="grid gap-6 md:grid-cols-[1.2fr,1.8fr] items-start mb-8">
            <GlassCard className="p-6 md:p-7 border border-border/80 bg-black/85">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/5 px-3 py-1 text-[11px] font-medium text-primary mb-4">
                <Sparkles className="w-4 h-4" />
                <span>{t('pricing.tagline') || 'Smart plans for serious learners'}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-3">
                {t('pricing.title') || 'Choose your plan'}
              </h1>
              <p className="text-sm text-muted-foreground mb-4">
                {t('pricing.subtitle') ||
                  'Start free with a few tests, then unlock Decision Trainer, full Study Material, and detailed reviews when you are ready.'}
              </p>

              <div className="mt-4">
                <p className="text-xs font-medium text-muted-foreground mb-2">
                  {t('pricing.selectCategoryLabel') || 'License category'}
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
                    {t('pricing.currentPlanLabel') || 'Current plan:'}{' '}
                    <span className="font-semibold">{currentCategoryPlan.plan_tier}</span>
                  </p>
                )}

                {isAdmin && (
                  <p className="mt-3 text-xs text-amber-400">
                    {t('pricing.adminNote') ||
                      'You are an admin and already have unlimited access. This page is in preview mode.'}
                  </p>
                )}

                <div className="mt-6 grid gap-3 md:grid-cols-2">
                  <Card className="border border-border/80 bg-black/70">
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center gap-2">
                        {t('pricing.freePlanTitle') || 'Free plan'}
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
                        {t('pricing.paidPlanTitle') || 'Paid benefits'}
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
                return (
                  <Card
                    key={plan.id}
                    className={`relative border transition-all cursor-pointer flex flex-col justify-between h-full ${
                      isBestValue
                        ? 'border-primary/80 bg-primary/5 shadow-[0_20px_60px_rgba(0,0,0,0.9)] scale-[1.02]'
                        : 'border-border/80 bg-black/80 hover:border-primary/60'
                    } ${isSelected ? 'ring-2 ring-primary/60' : ''}`}
                    onClick={() => setSelectedPlan(plan.id)}
                  >
                    {isBestValue && (
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                        <Badge className="text-[10px] px-3 py-0.5 bg-primary text-primary-foreground">
                          {t('pricing.bestValueBadge') || 'Best value'}
                        </Badge>
                      </div>
                    )}
                    <CardHeader className="pt-6 pb-3">
                      <CardTitle className="text-sm font-semibold flex items-center justify-between">
                        <span>{plan.label}</span>
                        <span className="text-xs text-muted-foreground">
                          {t('pricing.perMonthLabel') || '≈'} {plan.pricePerMonthEur.toFixed(2)} €/mo
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-2xl font-bold mb-1">{plan.priceEur} €</p>
                      <p className="text-xs text-muted-foreground">
                        {plan.months === 1
                          ? t('pricing.durationSingleMonth') || 'for 1 month access'
                          : `${plan.months} ${t('pricing.durationMonthsSuffix') || 'months of access'}`}
                      </p>
                    </CardContent>
                    <CardFooter className="pt-2 flex flex-col gap-2">
                      <Button
                        type="button"
                        disabled={isProcessing || isAdmin}
                        className="w-full"
                      >
                        {isAdmin
                          ? t('pricing.adminCta') || 'Admin preview'
                          : isProcessing && isSelected
                          ? t('pricing.processingCta') || 'Processing...'
                          : t('pricing.selectCta') || 'Select plan'}
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Button
              type="button"
              onClick={handlePurchase}
              disabled={isProcessing || isAdmin}
              className="min-w-[200px]"
            >
              {isAdmin
                ? t('pricing.adminCta') || 'Admin preview'
                : isProcessing
                ? t('pricing.processingCta') || 'Processing...'
                : t('pricing.primaryCta') || 'Continue to payment'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
