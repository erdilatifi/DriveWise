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
import { useAuth } from '@/contexts/auth-context';
import { useLanguage } from '@/contexts/language-context';
import { useUserPlans, useGlobalPremium } from '@/hooks/use-subscriptions';
import { toast } from 'sonner';

const LICENSE_CATEGORIES: LicenseCategory[] = ['A', 'B', 'C', 'D'];

// Redirect to Paddle hosted checkout (sandbox)
const PADDLE_CHECKOUT_URL = process.env.NEXT_PUBLIC_PADDLE_CHECKOUT_URL || "https://sandbox-pay.paddle.io/hsc_01kapf97740ws4b88nn0b4qyae_q8nxebsa9skjqg0n7b43kwzt7t8j61h2";

export default function PricingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAdmin } = useAuth();
  const { t, language } = useLanguage();
  const isSq = language === 'sq';

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

  const [selectedCategory, setSelectedCategory] = useState<LicenseCategory>(initialCategory);
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
      // Redirect to Paddle hosted checkout with email pre-filled
      const checkoutUrl = new URL(PADDLE_CHECKOUT_URL);
      if (user?.email) {
        checkoutUrl.searchParams.append('guest_email', user.email);
      }
      window.location.href = checkoutUrl.toString();
    } catch (error) {
      console.error("Paddle redirect error:", error);
      toast.error(isSq ? 'Diçka shkoi keq.' : 'Something went wrong.');
      setIsProcessing(false);
    }
  };

  const featureListFree = isSq
    ? [
        'Deri në 3 teste për kategori',
        'Rezultatet dhe historia bazë',
        'Pa Decision Trainer',
        'Pa Materiale Studimi',
      ]
    : [
        'Up to 3 tests per category',
        'Scores and basic history',
        'No Decision Trainer',
        'No Study Material',
      ];

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

  const selectedPlanData = BILLING_CONFIG.plans[selectedPlan];

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black text-foreground overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-orange-500/20 via-transparent to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-[-8rem] h-80 bg-gradient-to-t from-orange-500/15 via-transparent to-transparent" />

      {/* Subtle background rails (not part of content) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
      >
        {/* Horizontal lines */}
        <div className="hidden md:block absolute inset-x-[10%] top-40 h-px bg-gradient-to-r from-transparent via-border/40 to-transparent" />
        <div className="hidden lg:block absolute inset-x-[14%] top-80 h-px bg-gradient-to-r from-transparent via-orange-500/25 to-transparent" />
        <div className="hidden md:block absolute inset-x-[12%] bottom-32 h-px bg-gradient-to-r from-transparent via-border/30 to-transparent" />

        {/* Vertical center rail */}
        <div className="hidden lg:block absolute top-24 bottom-28 left-1/2 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-border/35 to-transparent" />
      </div>

      <Navbar />

      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Top bar */}
          <div className="mb-4 flex items-center justify-between">
            <Button variant="ghost" onClick={() => router.back()} className="text-sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('auth.backToHome')}
            </Button>

            {hasAnyActivePlan && !isAdmin && (
              <Badge variant="outline" className="border-emerald-500/60 text-emerald-400 text-xs">
                <Crown className="w-3 h-3 mr-1" />
                {t('plans.currentlyPremium') || 'Premium aktive'}
              </Badge>
            )}
          </div>

          {/* Payment status */}
          {paymentStatus === 'success' && (
            <div className="mb-4 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-50">
              {isSq
                ? 'Pagesa u konfirmua. Qasja juaj tani duhet të jetë aktive.'
                : 'Payment confirmed. Your access should now be active.'}
            </div>
          )}
          {paymentStatus === 'cancel' && (
            <div className="mb-4 rounded-xl border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs text-amber-50">
              {isSq
                ? 'Pagesa u anulua. Mund të provoni përsëri më poshtë.'
                : 'Payment was canceled. You can try again below.'}
            </div>
          )}

          {/* Trust line */}
          <div className="mb-5 flex items-center gap-2 text-[11px] text-muted-foreground">
            <span className="h-[3px] w-8 rounded-full bg-gradient-to-r from-orange-500 via-amber-300 to-orange-500" />
            <span>
              {isSq
                ? 'Ndërtuar për nxënës në Kosovë që po përgatiten për provimin teorik të shoferit me ushtrime sa më reale.'
                : 'Built for Kosovo driving theory learners who want clear, realistic exam practice.'}
            </span>
          </div>

          {/* Main layout */}
          <div className="grid gap-6 lg:grid-cols-[1.2fr,1.8fr] items-start mb-10">
            {/* LEFT: Steps + category + free vs paid */}
            <GlassCard className="p-6 md:p-7 border border-border/80 bg-black/85">
              {/* Stepper */}
              <div className="flex items-center gap-3 text-[11px] font-medium text-muted-foreground mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                    1
                  </div>
                  <span>{isSq ? 'Zgjidh kategorinë' : 'Choose category'}</span>
                </div>
                <div className="h-px w-7 bg-border/60" />
                <div className="flex items-center gap-2 opacity-80">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full border border-border text-[10px]">
                    2
                  </div>
                  <span>{isSq ? 'Zgjidh planin' : 'Choose plan'}</span>
                </div>
                <div className="h-px w-7 bg-border/40" />
                <div className="flex items-center gap-2 opacity-60">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full border border-border text-[10px]">
                    3
                  </div>
                  <span>{isSq ? 'Paguaj dhe fillo' : 'Pay & start'}</span>
                </div>
              </div>

              {/* Hero */}
              <div className="flex items-center justify-between gap-3 mb-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
                    {isSq ? 'Çmime të thjeshta për provimin tënd' : 'Simple pricing for your exam'}
                  </h1>
                  <p className="mt-1 text-xs md:text-sm text-muted-foreground">
                    {isSq
                      ? 'Paguaj një herë dhe ushtro sa të duash gjatë periudhës së qasjes.'
                      : 'Pay once, practice as much as you want during your access period.'}
                  </p>
                </div>
                <div className="hidden md:flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-3 py-2 text-[11px] text-primary">
                  <Sparkles className="w-4 h-4" />
                  <span>
                    {isSq ? 'Pa abonim automatik. Pa tarifa të fshehta.' : 'No auto-renew. No hidden fees.'}
                  </span>
                </div>
              </div>

              {/* Category selector */}
              <div className="mt-4">
                <p className="text-xs font-medium text-muted-foreground mb-2">
                  {isSq ? 'Kategoria e lejes së vozitjes' : 'License category'}
                </p>
                <div className="flex flex-wrap gap-2">
                  {LICENSE_CATEGORIES.map((cat) => {
                    const info = CATEGORY_INFO[cat];
                    const isActive = cat === selectedCategory;
                    const isThisCategoryActivePlan =
                      !!currentCategoryPlan &&
                      currentCategoryPlan.category === cat &&
                      currentCategoryPlanActive;

                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setSelectedCategory(cat)}
                        className={`relative flex items-center gap-2 rounded-full px-3 py-1.5 text-xs border transition-all duration-150 ${
                          isActive
                            ? 'border-primary/90 bg-primary text-white shadow-md shadow-primary/30 scale-[1.02]'
                            : 'border-border/70 bg-black/40 text-foreground hover:border-primary/50 hover:bg-primary/5 hover:-translate-y-[1px]'
                        }`}
                      >
                        <span>{info.name}</span>
                        {isThisCategoryActivePlan && (
                          <span className="rounded-full bg-emerald-500/10 text-emerald-400 px-2 py-[1px] text-[10px] border border-emerald-500/40">
                            {isSq ? 'Aktiv' : 'Active'}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {currentCategoryPlan && (
                  <p className="mt-3 text-[11px] text-emerald-400">
                    {t('pricing.currentPlanFor')}{' '}
                    {CATEGORY_INFO[selectedCategory].name}:{' '}
                    <span className="font-semibold">{currentCategoryPlan.plan_tier}</span>
                    {currentCategoryPlanActive && currentCategoryPlan.end_date && (
                      <>
                        {' '}
                        {t('pricing.until')}{' '}
                        {new Date(currentCategoryPlan.end_date).toLocaleDateString()}
                      </>
                    )}
                  </p>
                )}

                {isAdmin && (
                  <p className="mt-3 text-[11px] text-amber-400">
                    {isSq
                      ? 'Ju jeni administrator dhe tashmë keni qasje të plotë. Kjo faqe është vetëm pamje paraprake.'
                      : 'You are an admin and already have full access. This screen is a preview only.'}
                  </p>
                )}
              </div>

              {/* Free vs Paid */}
              <div className="mt-6 grid gap-3 md:grid-cols-2">
                <Card className="border border-border/80 bg-black/70">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center justify-between">
                      <span>{isSq ? 'Falas' : 'Free'}</span>
                      <span className="text-xs text-muted-foreground">0 €</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1.5">
                    {featureListFree.map((f) => (
                      <p
                        key={f}
                        className="text-xs text-muted-foreground flex items-start gap-2"
                      >
                        <span className="mt-[3px] text-muted-foreground/60">•</span>
                        <span>{f}</span>
                      </p>
                    ))}
                  </CardContent>
                </Card>

                <Card className="border border-primary/70 bg-primary/5 relative overflow-hidden">
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(251,146,60,0.16),_transparent_55%)]" />
                  <CardHeader className="pb-2 relative z-10">
                    <CardTitle className="text-sm flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Crown className="w-4 h-4 text-primary" />
                        <span>{isSq ? 'Qasje e plotë' : 'Full access'}</span>
                      </div>
                      <span className="text-[11px] text-primary">
                        {isSq ? 'E rekomanduar' : 'Recommended'}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1.5 relative z-10">
                    {featureListPaid.map((f) => (
                      <p
                        key={f}
                        className="text-xs text-muted-foreground flex items-start gap-2"
                      >
                        <Check className="w-3 h-3 mt-[2px] text-primary" />
                        <span>{f}</span>
                      </p>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </GlassCard>

            {/* RIGHT: Plan cards + summary */}
            <div className="flex flex-col gap-4">
              {/* Plans row */}
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
                      className={`relative border flex flex-col justify-between h-full cursor-pointer transition-all ${
                        isSelected
                          ? 'border-primary/80 ring-2 ring-primary/60 bg-gradient-to-b from-primary/10 via-black to-black shadow-[0_18px_60px_rgba(0,0,0,0.9)]'
                          : isBestValue
                          ? 'border-primary/60 bg-black/90 hover:border-primary/80 hover:shadow-[0_14px_40px_rgba(0,0,0,0.8)]'
                          : 'border-border/80 bg-black/80 hover:border-primary/60'
                      }`}
                      onClick={() => {
                        if (!isCurrentActivePlan && !isProcessing && !isAdmin) {
                          setSelectedPlan(plan.id);
                        }
                      }}
                    >
                      {isBestValue && (
                        <div className="absolute top-2 left-1/2 -translate-x-1/2">
                          <Badge className="rounded-full border border-primary/90 bg-gradient-to-r from-orange-500 via-amber-300 to-orange-500 text-[10px] px-3 py-[3px] text-black shadow-md shadow-orange-500/40">
                            Best value
                          </Badge>
                        </div>
                      )}

                      <CardHeader className="pt-6 pb-3">
                        <CardTitle className="text-sm font-semibold flex flex-col gap-1">
                          <div className="flex items-center justify-between gap-2">
                            <span>{plan.label}</span>
                            <span className="text-[11px] text-muted-foreground">
                              {plan.months === 1
                                ? isSq
                                  ? '1 muaj'
                                  : '1 month'
                                : isSq
                                ? `${plan.months} muaj`
                                : `${plan.months} months`}
                            </span>
                          </div>
                          <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-bold">{plan.priceEur}</span>
                            <span className="text-xs text-muted-foreground">
                              {isSq ? '€ gjithsej' : '€ total'}
                            </span>
                          </div>
                        </CardTitle>
                      </CardHeader>

                      <CardContent className="pb-2 space-y-1">
                        <p className="text-[11px] text-muted-foreground">
                          ≈ {plan.pricePerMonthEur.toFixed(2)} € /
                          {isSq ? ' muaj' : ' month'}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          {isSq
                            ? 'Pagesë një herë · pa abonim'
                            : 'One-time payment · no subscription'}
                        </p>
                        {isBestValue && (
                          <p className="text-[11px] text-emerald-400">
                            {isSq ? 'Zgjedhja më e shpeshtë' : 'Most popular choice'}
                          </p>
                        )}
                      </CardContent>

                      <CardFooter className="pt-2 flex flex-col gap-2">
                        <Button
                          type="button"
                          disabled={isProcessing || isAdmin || isCurrentActivePlan}
                          className="w-full"
                        >
                          {isAdmin
                            ? isSq
                              ? 'Pamje si admin'
                              : 'Admin preview'
                            : isCurrentActivePlan
                            ? isSq
                              ? 'Plani aktual'
                              : 'Current plan'
                            : isProcessing && isSelected
                            ? isSq
                              ? 'Duke u përpunuar...'
                              : 'Processing...'
                            : isSelected
                            ? isSq
                              ? 'I zgjedhur'
                              : 'Selected'
                            : isSq
                            ? 'Zgjidh planin'
                            : 'Choose plan'}
                        </Button>
                        {isCurrentActivePlan && currentCategoryPlan?.end_date && (
                          <p className="mt-1 text-[11px] text-emerald-400 text-center">
                            Active until{' '}
                            {new Date(currentCategoryPlan.end_date).toLocaleDateString()}
                          </p>
                        )}
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>

              {/* Summary + final CTA */}
              <GlassCard className="border border-border/80 bg-gradient-to-r from-black via-zinc-950 to-black px-4 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1 text-xs md:text-sm">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-primary/40 bg-primary/10 px-2 py-[3px] text-[11px] text-primary flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      {isSq ? 'Përmbledhje' : 'Summary'}
                    </span>
                    <span className="text-muted-foreground">
                      {CATEGORY_INFO[selectedCategory].name} · {selectedPlanData.label}
                    </span>
                  </div>
                  <p className="text-muted-foreground">
                    {isSq ? 'Ju paguani ' : 'You pay '}
                    <span className="font-semibold text-foreground">
                      {selectedPlanData.priceEur} €
                    </span>{' '}
                    {isSq ? 'një herë për ' : 'one time for '}
                    <span className="font-semibold text-foreground">
                      {selectedPlanData.months === 1
                        ? isSq
                          ? '1 muaj'
                          : '1 month'
                        : isSq
                        ? `${selectedPlanData.months} muaj`
                        : `${selectedPlanData.months} months`}
                    </span>{' '}
                    {isSq
                      ? 'të qasjes së plotë në këtë kategori.'
                      : 'of full access in this category.'}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <Button
                    type="button"
                    onClick={handlePurchase}
                    disabled={isProcessing || isAdmin || currentCategoryPlanActive}
                    className="min-w-[220px]"
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
                      : isSq
                      ? 'Vazhdo te pagesa'
                      : 'Continue to payment'}
                  </Button>
                  {currentCategoryPlanActive && currentCategoryPlan && (
                    <p className="text-[11px] text-muted-foreground text-right max-w-xs">
                      {isSq
                        ? 'Tashmë keni një plan aktiv '
                        : 'You already have an active '}
                      {currentCategoryPlan.plan_tier}{' '}
                      {isSq ? 'për ' : 'plan for '}
                      {CATEGORY_INFO[selectedCategory].name}.{' '}
                      {isSq
                        ? 'Mund të blini përsëri për këtë kategori pasi të skadojë.'
                        : 'You can buy again for this category after it expires.'}
                    </p>
                  )}
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
