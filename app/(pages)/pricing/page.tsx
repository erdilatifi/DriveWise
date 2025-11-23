'use client';

import { useState, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Check, ArrowLeft, Crown, Sparkles, Info } from 'lucide-react';
import { CATEGORY_INFO, type LicenseCategory } from '@/types/database';
import { BILLING_CONFIG, isPlanCurrentlyActive, type PaidPlanTier } from '@/lib/subscriptions';
import { useAuth } from '@/contexts/auth-context';
import { useLanguage } from '@/contexts/language-context';
import { useUserPlans, useGlobalPremium } from '@/hooks/use-subscriptions';
import { toast } from 'sonner';

const LICENSE_CATEGORIES: LicenseCategory[] = ['A', 'B', 'C', 'D'];

// Paddle Hosted Checkout URLs
const HSC_1M = (process.env.NEXT_PUBLIC_PADDLE_HSC_1M || '').trim();
const HSC_2M = (process.env.NEXT_PUBLIC_PADDLE_HSC_2M || '').trim();
const HSC_3M = (process.env.NEXT_PUBLIC_PADDLE_HSC_3M || '').trim();

export default function PricingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAdmin } = useAuth();
  const { t, language } = useLanguage();
  const isSq = language === 'sq';

  const paymentStatus = searchParams.get('payment');

  const initialCategory = useMemo<LicenseCategory | null>(() => {
    const fromQuery = (searchParams.get('category') || '').toUpperCase();
    if (LICENSE_CATEGORIES.includes(fromQuery as LicenseCategory)) {
      return fromQuery as LicenseCategory;
    }
    return null;
  }, [searchParams]);

  const initialPlan = useMemo<PaidPlanTier | null>(() => {
    const fromQuery = (searchParams.get('plan') || '').toUpperCase() as PaidPlanTier;
    if (fromQuery && BILLING_CONFIG.plans[fromQuery]) {
      return fromQuery;
    }
    return null;
  }, [searchParams]);

  const [selectedCategory, setSelectedCategory] = useState<LicenseCategory | null>(initialCategory);
  const [selectedPlan, setSelectedPlan] = useState<PaidPlanTier | null>(initialPlan);
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: existingPlans } = useUserPlans(user?.id || undefined);
  const { hasAnyActivePlan } = useGlobalPremium(user?.id, isAdmin);

  const currentCategoryPlan = useMemo(() => {
    if (!existingPlans || !selectedCategory) return null;
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

  const handleSelectCategory = (cat: LicenseCategory) => {
    if (cat !== selectedCategory) {
      setSelectedCategory(cat);
      setSelectedPlan(null);
    }
  };

  const handlePurchase = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (isAdmin) {
      toast.info(
        isSq
          ? 'Administratorët tashmë kanë qasje të plotë në të gjitha veçoritë.'
          : 'Admins already have full access to all features.',
        {
          description: isSq
            ? 'Mund ta përdorni këtë faqe vetëm si pamje paraprake të çmimeve, pa pasur nevojë të paguani.'
            : 'You can still use this page to preview pricing, but no payment is required.',
        },
      );
      return;
    }

    if (!selectedCategory || !selectedPlan) {
      return;
    }

    if (currentCategoryPlanActive) {
      toast.info(
        isSq
          ? 'Tashmë keni një plan aktiv për këtë kategori.'
          : 'You already have an active plan for this category.',
        {
          description: isSq
            ? 'Mund të blini një plan të ri për këtë kategori pasi të skadojë plani aktual.'
            : 'You can purchase a new plan for this category after the current one expires.',
        },
      );
      return;
    }

    setIsProcessing(true);
    try {
      let checkoutUrlStr = '';
      if (selectedPlan === 'PLAN_A') {
        checkoutUrlStr = HSC_1M;
      } else if (selectedPlan === 'PLAN_B') {
        checkoutUrlStr = HSC_2M;
      } else if (selectedPlan === 'PLAN_C') {
        checkoutUrlStr = HSC_3M;
      }

      if (!checkoutUrlStr) {
        console.error('Missing checkout URL for plan:', selectedPlan);
        toast.error(isSq ? 'Konfigurimi i gabuar.' : 'Configuration error (Missing URL).');
        setIsProcessing(false);
        return;
      }

      let urlObj: URL;
      try {
        urlObj = new URL(checkoutUrlStr);
      } catch (e) {
        console.error('Invalid checkout URL format:', checkoutUrlStr, e);
        toast.error(isSq ? 'URL e pavlefshme.' : 'Invalid checkout URL configuration.');
        setIsProcessing(false);
        return;
      }

      if (user?.email) {
        urlObj.searchParams.append('guest_email', user.email);
      }

      // Pass custom_data as a JSON string for Paddle Billing
      const customData = {
        category: selectedCategory,
        plan: selectedPlan,
        user_id: user.id,
      };
      // Use set() to avoid duplicates if custom_data already exists
      urlObj.searchParams.set('custom_data', JSON.stringify(customData));
      // Also set passthrough as a fallback for some Paddle integrations
      urlObj.searchParams.set('passthrough', JSON.stringify(customData));

      window.location.href = urlObj.toString();
    } catch (error) {
      console.error('Paddle redirect error:', error);
      toast.error(isSq ? 'Diçka shkoi keq.' : 'Something went wrong.');
      setIsProcessing(false);
    }
  };

  const featureListFree = isSq
    ? ['Deri në 3 teste për kategori', 'Rezultatet dhe historia bazë', 'Pa Decision Trainer', 'Pa Materiale Studimi']
    : ['Up to 3 tests per category', 'Scores and basic history', 'No Decision Trainer', 'No Study Material'];

  const featureListPaid = isSq
    ? [
        'Teste të pakufizuara në këtë kategori',
        'Decision Trainer i hapur',
        'Të gjitha Materialet e Studimit të hapura',
        'Rishikim i plotë me përgjigje të sakta',
      ]
    : [
        'Unlimited tests in this category',
        'Decision Trainer unlocked',
        'All Study Material unlocked',
        'Full review with correct answers',
      ];

  const selectedPlanData = selectedPlan ? BILLING_CONFIG.plans[selectedPlan] : null;

  const stepLabelCategory = isSq ? 'Zgjidh kategorinë' : 'Choose your category';
  const stepLabelPlan = isSq ? 'Zgjidh planin' : 'Choose your exam window';
  const stepLabelPay = isSq ? 'Konfirmo dhe paguaj' : 'Confirm & pay';

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-hidden">
      {/* Background grid like landing hero */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(60%_60%_at_50%_20%,#000_20%,transparent_70%)]"
      >
        <svg className="h-full w-full opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="pricing-grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M32 0H0V32" fill="none" stroke="currentColor" strokeWidth="0.4" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#pricing-grid)" />
        </svg>
      </div>

      {/* Warm glows & rails to match landing */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-orange-500/25 via-transparent to-transparent blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-6rem] left-[8%] h-60 w-60 rounded-full bg-orange-400/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-8rem] right-[12%] h-72 w-72 rounded-full bg-orange-500/20 blur-3xl" />

      {/* Side and center rails */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="hidden lg:block absolute top-24 bottom-24 left-[10%] w-px bg-gradient-to-b from-transparent via-orange-500/25 to-transparent" />
        <div className="hidden lg:block absolute top-24 bottom-24 right-[10%] w-px bg-gradient-to-b from-transparent via-orange-500/25 to-transparent" />
        <div className="hidden md:block absolute top-28 bottom-32 left-1/2 w-px -translate-x-1/2 bg-gradient-to-b from-orange-400/30 to-transparent" />
        <div className="hidden md:block absolute inset-x-[12%] top-64 h-px bg-gradient-to-r from-transparent via-orange-500/16 to-transparent" />
      </div>

      <Navbar />

      <div className="pt-32 pb-16">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 relative">
          {/* Back + Premium */}
          <div className="mb-4 flex items-center justify-between gap-4">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="text-sm flex items-center gap-2 px-0"
            >
              <ArrowLeft className="h-4 w-4" />
              {t('auth.backToHome')}
            </Button>

            {hasAnyActivePlan && !isAdmin && (
              <Badge
                variant="outline"
                className="border-emerald-500/60 text-emerald-400 text-xs flex items-center gap-1"
              >
                <Crown className="h-3 w-3" />
                {t('plans.currentlyPremium') || 'Premium aktive'}
              </Badge>
            )}
          </div>

          {/* Payment status */}
          {paymentStatus && (
            <div className="mb-3 text-xs" role="status" aria-live="polite">
              {paymentStatus === 'success' && (
                <div className="rounded-xl border border-emerald-500/50 bg-emerald-500/10 px-3 py-2 text-emerald-100">
                  {isSq
                    ? 'Pagesa u konfirmua. Qasja juaj tani duhet të jetë aktive.'
                    : 'Payment confirmed. Your access should now be active.'}
                </div>
              )}
              {paymentStatus === 'cancel' && (
                <div className="rounded-xl border border-amber-500/50 bg-amber-500/10 px-3 py-2 text-amber-100">
                  {isSq
                    ? 'Pagesa u anulua. Mund të provoni përsëri më poshtë.'
                    : 'Payment was canceled. You can try again below.'}
                </div>
              )}
            </div>
          )}

          {/* Header / hero copy */}
          <section className="mb-8 md:mb-10 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-black/60 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              <span className="h-1.5 w-8 rounded-full bg-gradient-to-r from-orange-500 to-orange-300" />
              {isSq ? 'Çmimet DriveWise' : 'DriveWise Pricing'}
            </div>

            <h1 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight">
              {isSq ? 'Zgjidh periudhën e ushtrimit' : 'Choose your exam window'}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-300 to-white">
                {isSq ? ' dhe çliro qasjen e plotë.' : ' and unlock full access.'}
              </span>
            </h1>

            <p className="mt-3 text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
              {isSq
                ? 'Çdo plan hap 1 kategori (A, B, C ose D) me teste të pakufizuara, Decision Trainer, Materiale Studimi dhe rishikim të plotë. Pa abonim automatik.'
                : 'Each plan unlocks 1 category (A, B, C or D) with unlimited mock tests, Decision Trainer, Study Material and full review. No auto-renew, no contracts.'}
            </p>

            <p className="mt-2 text-[11px] md:text-xs text-muted-foreground/80">
              {isSq
                ? 'Mund të filloni falas me disa teste dhe të kaloni në plan të paguar vetëm kur të jeni gati.'
                : 'You can start for free with a few tests, then upgrade when you want unlimited practice.'}
            </p>
          </section>

          {/* Stepper */}
          <div className="mb-8 grid gap-3 rounded-2xl border border-border/70 bg-black/75 p-3 text-xs md:grid-cols-3">
            {[
              { step: 1, label: stepLabelCategory },
              { step: 2, label: stepLabelPlan },
              { step: 3, label: stepLabelPay },
            ].map(({ step, label }) => {
              const isCompleted =
                (step === 1 && !!selectedCategory) ||
                (step === 2 && !!selectedPlan && !!selectedCategory) ||
                (step === 3 && !!selectedPlan && !!selectedCategory);
              const isCurrent =
                (step === 1 && !selectedCategory) ||
                (step === 2 && selectedCategory && !selectedPlan) ||
                (step === 3 && selectedCategory && selectedPlan);

              return (
                <div
                  key={step}
                  className={`flex items-center gap-3 rounded-xl border px-3 py-2 transition-colors ${
                    isCurrent
                      ? 'border-orange-400/70 bg-orange-500/10 text-foreground'
                      : isCompleted
                      ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-100'
                      : 'border-border/60 bg-black/60 text-muted-foreground'
                  }`}
                >
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                      isCompleted
                        ? 'bg-emerald-500 text-black'
                        : isCurrent
                        ? 'bg-orange-500 text-black'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {isCompleted ? <Check className="h-3 w-3" /> : step}
                  </div>
                  <span className="text-[11px] md:text-xs">{label}</span>
                </div>
              );
            })}
          </div>

          {/* Main layout: left (category + free vs paid), right (plans + summary) */}
          <div className="grid items-start gap-6 lg:grid-cols-[1.1fr,1.4fr]">
            {/* LEFT */}
            <GlassCard className="border border-border/80 bg-black/85 p-5 md:p-6 space-y-6">
              {/* Category chooser */}
              <div>
                <div className="mb-2 flex items-center justify-between gap-2">
                  <h2 className="text-sm font-semibold">{stepLabelCategory}</h2>
                  <span className="text-[11px] text-muted-foreground">
                    {isSq ? 'Zakonisht 1 minutë' : 'Takes about 1 minute'}
                  </span>
                </div>
                <p className="mb-3 text-xs text-muted-foreground">
                  {isSq
                    ? 'Zgjidh kategorinë e patentë shoferit për të cilën po përgatitesh. Mund të blesh plane veç e veç për çdo kategori.'
                    : 'Pick the license category you’re preparing for. You can buy separate plans for each category.'}
                </p>

                <div className="flex flex-wrap gap-2">
                  {LICENSE_CATEGORIES.map((cat) => {
                    const info = CATEGORY_INFO[cat];
                    const isActive = cat === selectedCategory;
                    const planForThisCat = existingPlans?.find((p) => p.category === cat);
                    const isPlanActive =
                      planForThisCat &&
                      planForThisCat.status === 'active' &&
                      isPlanCurrentlyActive({
                        startDate: planForThisCat.start_date,
                        endDate: planForThisCat.end_date,
                      });

                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => handleSelectCategory(cat)}
                        className={`relative flex min-w-[120px] items-center justify-between gap-2 rounded-xl border px-4 py-3 text-sm transition-all ${
                          isActive
                            ? 'border-orange-400 bg-orange-500/10 text-foreground shadow-[0_0_20px_rgba(249,115,22,0.3)]'
                            : 'border-border/70 bg-black/60 text-muted-foreground hover:border-orange-400/70 hover:bg-orange-500/5 hover:text-foreground'
                        }`}
                        aria-pressed={isActive}
                      >
                        <div className="flex flex-col text-left">
                          <span className="text-xs font-semibold uppercase tracking-wide">
                            {info.name}
                          </span>
                          <span className="text-[11px] text-muted-foreground">
                            {isSq ? 'Kategori licence' : 'License category'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          {isPlanActive && (
                            <span className="rounded-full border border-emerald-500/40 bg-emerald-500/20 px-2 py-[2px] text-[10px] text-emerald-300">
                              {isSq ? 'Aktive' : 'Active'}
                            </span>
                          )}
                          {isActive && (
                            <span className="flex h-3 w-3">
                              <span className="absolute inline-flex h-3 w-3 animate-ping rounded-full bg-orange-400 opacity-70" />
                              <span className="relative inline-flex h-3 w-3 rounded-full bg-orange-400" />
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {currentCategoryPlan && currentCategoryPlanActive && selectedCategory && (
                  <p className="mt-2 text-[11px] text-emerald-300">
                    {t('pricing.currentPlanFor')}{' '}
                    {CATEGORY_INFO[selectedCategory].name}:{' '}
                    <span className="font-semibold">{currentCategoryPlan.plan_tier}</span>
                    {currentCategoryPlan.end_date && (
                      <>
                        {' '}
                        {t('pricing.until')}{' '}
                        {new Date(currentCategoryPlan.end_date).toLocaleDateString()}
                      </>
                    )}
                  </p>
                )}
              </div>

              {/* Free vs Paid comparison */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-medium text-foreground">
                  <Sparkles className="h-4 w-4 text-orange-400" />
                  <span>
                    {isSq ? 'Çfarë merr falas dhe me Premium' : 'What you get free vs Premium'}
                  </span>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <Card className="border border-border/70 bg-black/70">
                    <CardHeader className="px-3 pb-2 pt-3">
                      <CardTitle className="flex items-center justify-between text-sm">
                        <span>{isSq ? 'Falas' : 'Free'}</span>
                        <span className="text-xs text-muted-foreground">0 €</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1 px-3 pb-3">
                      {featureListFree.map((f) => (
                        <p key={f} className="flex items-start gap-2 text-xs text-muted-foreground">
                          <span className="mt-[3px] text-muted-foreground/70">•</span>
                          <span>{f}</span>
                        </p>
                      ))}
                    </CardContent>
                  </Card>

                  <Card className="relative overflow-hidden border border-orange-400/70 bg-orange-500/5">
                    <CardHeader className="relative px-3 pb-2 pt-3">
                      <CardTitle className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <Crown className="h-4 w-4 text-orange-300" />
                          <span>Premium</span>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="relative space-y-1 px-3 pb-3">
                      {featureListPaid.map((f) => (
                        <p key={f} className="flex items-start gap-2 text-xs text-muted-foreground">
                          <Check className="mt-[2px] h-3 w-3 text-orange-400" />
                          <span>{f}</span>
                        </p>
                      ))}
                    </CardContent>
                  </Card>
                </div>

                {!user && (
                  <div className="mt-1 flex items-start gap-2 rounded-xl border border-border/70 bg-black/70 p-3 text-[11px] text-muted-foreground">
                    <Info className="mt-[2px] h-4 w-4 shrink-0" />
                    <p>
                      {isSq
                        ? 'Krijo llogari që të ruhen historia e testeve dhe progresi juaj.'
                        : 'Create an account so your test history and progress are saved.'}
                    </p>
                  </div>
                )}
              </div>
            </GlassCard>

            {/* RIGHT: Plans + summary */}
            <div className="space-y-4">
              {/* Plans row */}
              <section aria-label={stepLabelPlan} className="space-y-4">
                <div className="flex flex-col gap-0.5">
                  <h2 className="text-base md:text-lg font-semibold tracking-tight text-foreground">
                    {stepLabelPlan}
                  </h2>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    {isSq
                      ? 'Zgjidh sa gjatë dëshiron qasje të plotë.'
                      : 'Choose how long you want full access.'}
                  </p>
                </div>

                <div
                  className={`grid gap-5 md:grid-cols-3 transition-all duration-300 ${
                    !selectedCategory ? 'pointer-events-none opacity-45 grayscale' : 'opacity-100'
                  }`}
                >
                  {Object.values(BILLING_CONFIG.plans).map((plan) => {
                    const isBestValue = plan.id === BILLING_CONFIG.bestValuePlan;
                    const isSelected = plan.id === selectedPlan;
                    const isCurrentActivePlan =
                      !!currentCategoryPlan &&
                      currentCategoryPlan.plan_tier === plan.id &&
                      currentCategoryPlanActive;

                    // Dynamic CTA text based on plan duration
                    let ctaText = isSq ? 'Zgjidh këtë plan' : 'Choose this exam window';
                    if (plan.id === 'PLAN_A') ctaText = isSq ? 'Merr 1 muaj qasje' : 'Get 1 month access';
                    if (plan.id === 'PLAN_B') ctaText = isSq ? 'Merr 2 muaj qasje' : 'Get 2 months access';
                    if (plan.id === 'PLAN_C') ctaText = isSq ? 'Merr 3 muaj qasje' : 'Get 3 months access';

                    return (
                      <Card
                        key={plan.id}
                        className={`relative flex h-full cursor-pointer flex-col justify-between border transition-all duration-300 !overflow-visible rounded-3xl before:rounded-3xl ${
                          isSelected
                            ? 'border-orange-500 ring-1 ring-orange-500 bg-black shadow-[0_0_50px_rgba(249,115,22,0.4)] scale-[1.03] z-10'
                            : isBestValue
                            ? 'border-orange-500/40 bg-zinc-950 hover:border-orange-500/70 hover:bg-black scale-[1.01] z-0'
                            : 'border-border/70 bg-zinc-950 hover:border-orange-400/40 hover:bg-black'
                        }`}
                        onClick={() => {
                          if (!isCurrentActivePlan && !isProcessing && !isAdmin) {
                            setSelectedPlan(plan.id);
                          }
                        }}
                        aria-pressed={isSelected}
                        aria-disabled={isCurrentActivePlan || isAdmin}
                      >
                        {isBestValue && (
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 w-max max-w-[90%]">
                            <div className="relative rounded-full border border-orange-400/80 bg-gradient-to-r from-orange-600 to-amber-500 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-white shadow-[0_4px_12px_rgba(249,115,22,0.5)]">
                              {isSq ? 'Më i vlefshmi' : 'Best value'}
                              {/* Little shine effect */}
                              <div className="absolute inset-0 rounded-full bg-white/10" />
                            </div>
                          </div>
                        )}

                        {isSelected && (
                          <div className="absolute right-3 top-3 rounded-full bg-orange-500/20 p-1 text-orange-400">
                            <Check className="h-3.5 w-3.5" />
                          </div>
                        )}

                        <CardHeader className={`pt-8 pb-4 ${isBestValue ? 'bg-gradient-to-b from-orange-500/10 to-transparent rounded-t-3xl' : ''}`}>
                          <CardTitle className="flex flex-col gap-1.5 text-sm font-semibold">
                            <div className="flex items-center justify-between gap-2">
                              <span className={isBestValue ? 'text-orange-100' : 'text-foreground'}>
                                {plan.label}
                              </span>
                            </div>
                            <div className="flex items-baseline gap-1">
                              <span className={`text-3xl font-bold ${isBestValue ? 'text-white' : 'text-foreground'}`}>
                                {plan.priceEur}
                              </span>
                              <span className="text-sm text-muted-foreground">€</span>
                            </div>
                          </CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-3 pb-4 text-xs text-muted-foreground">
                          <div>
                            <p className="font-medium text-foreground/90 mb-0.5">
                              {isSq ? 'Vetëm' : 'Just'} {plan.pricePerMonthEur.toFixed(2)} € /{' '}
                              {isSq ? 'muaj' : 'mo'}
                            </p>
                            <p className="text-[11px] opacity-70">
                              {isSq
                                ? 'Pa abonim automatik.'
                                : 'No auto-renew.'}
                            </p>
                          </div>

                          {isCurrentActivePlan && (
                            <p className="mt-1 rounded bg-emerald-500/10 p-2 text-center text-[11px] font-medium text-emerald-400 border border-emerald-500/20">
                              {isSq
                                ? 'Ky plan është tashmë aktiv.'
                                : 'Plan currently active.'}
                          </p>
                          )}
                        </CardContent>

                        <CardFooter className="pt-2 pb-5">
                          <div
                            className={`w-full rounded-xl border py-2.5 text-center text-xs font-semibold transition-all duration-200 ${
                              isSelected
                                ? 'border-orange-500 bg-orange-500 text-white shadow-[0_4px_14px_rgba(249,115,22,0.4)]'
                                : isBestValue
                                ? 'border-orange-500/30 bg-orange-500/10 text-orange-200 group-hover:bg-orange-500/20 group-hover:border-orange-500/50'
                                : 'border-white/10 bg-white/5 text-muted-foreground group-hover:bg-white/10 group-hover:text-foreground'
                            }`}
                          >
                            {isSelected
                              ? (isSq ? 'Opsioni i zgjedhur' : 'Selected option')
                              : ctaText}
                          </div>
                        </CardFooter>
                      </Card>
                    );
                  })}
                </div>
              </section>

              {/* Summary + CTA */}
              <section aria-label={stepLabelPay}>
                <GlassCard
                  className={`flex flex-col gap-5 border border-border/80 bg-gradient-to-r from-black via-zinc-950 to-black px-6 py-6 md:flex-row md:items-center md:justify-between transition-all duration-500 ${
                    selectedCategory && selectedPlan ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-50'
                  }`}
                >
                  <div className="space-y-2 text-xs md:text-sm">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/40 bg-orange-500/10 px-2.5 py-1 text-[11px] font-medium text-orange-300 shadow-[0_0_10px_rgba(249,115,22,0.15)]">
                        <Sparkles className="h-3 w-3" />
                        {isSq ? 'Përmbledhja' : 'Summary'}
                      </span>
                      {selectedCategory && selectedPlanData && (
                        <span className="text-foreground font-medium tracking-tight">
                          {CATEGORY_INFO[selectedCategory].name}{' '}
                          <span className="text-muted-foreground/60 mx-1">/</span> {selectedPlanData.label}
                        </span>
                      )}
                    </div>

                    {selectedCategory && selectedPlanData ? (
                      <>
                        <p className="text-sm text-muted-foreground pl-1">
                          {isSq ? 'Total:' : 'Total:'}{' '}
                          <span className="text-xl font-bold text-white ml-1">{selectedPlanData.priceEur} €</span>{' '}
                          <span className="text-xs text-muted-foreground/80 ml-1">
                            {isSq
                              ? '(paguhet një herë)'
                              : '(one-time payment)'}
                          </span>
                        </p>
                      </>
                    ) : (
                      <p className="text-xs italic text-muted-foreground pl-1">
                        {isSq
                          ? 'Zgjidhni kategorinë dhe planin për të vazhduar.'
                          : 'Select a category and plan to continue.'}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col items-stretch gap-3 md:items-end">
                    <Button
                      type="button"
                      onClick={handlePurchase}
                      disabled={
                        !selectedCategory ||
                        !selectedPlan ||
                        isProcessing ||
                        isAdmin ||
                        currentCategoryPlanActive
                      }
                      size="lg"
                      className="min-w-[260px] h-12 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white font-semibold shadow-[0_0_25px_rgba(249,115,22,0.4)] border-none transition-all hover:scale-[1.02] hover:shadow-[0_0_35px_rgba(249,115,22,0.5)]"
                    >
                      {isAdmin
                        ? isSq
                          ? 'Pamje si admin'
                          : 'Admin preview'
                        : isProcessing
                        ? isSq
                          ? 'Duke u përpunuar...'
                          : 'Processing...'
                        : currentCategoryPlanActive
                        ? isSq
                          ? 'Plani tashmë është aktiv'
                          : 'Plan already active'
                        : !selectedCategory || !selectedPlan
                        ? isSq
                          ? 'Zgjidh opsionet...'
                          : 'Select options...'
                        : isSq
                        ? 'Hap qasjen e plotë'
                        : 'Unlock full exam access'}
                    </Button>

                    {!user && (
                      <p className="text-[10px] text-muted-foreground/70 text-center md:text-right">
                        {isSq
                          ? 'Krijo llogari që të ruhet historia e testeve.'
                          : 'Create an account to save your progress.'}
                      </p>
                    )}
                  </div>
                </GlassCard>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
