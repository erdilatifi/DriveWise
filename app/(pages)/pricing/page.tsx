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

// Redirect to Paddle Hosted Checkout (HSC)
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
      setSelectedPlan(null); // Reset plan when category changes
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
      toast.error(isSq ? 'Ju lutem zgjidhni kategorinë dhe planin.' : 'Please select a category and a plan.');
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
      // Determine the correct checkout URL based on selected plan
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

      // Validate URL format
      let urlObj: URL;
      try {
        urlObj = new URL(checkoutUrlStr);
      } catch (e) {
        console.error('Invalid checkout URL format:', checkoutUrlStr, e);
        toast.error(isSq ? 'URL e pavlefshme.' : 'Invalid checkout URL configuration.');
        setIsProcessing(false);
        return;
      }

      // Redirect to Paddle hosted checkout with email pre-filled
      if (user?.email) {
        urlObj.searchParams.append('guest_email', user.email);
      }
      
      // Pass custom data
      urlObj.searchParams.append('custom_data[category]', selectedCategory);
      urlObj.searchParams.append('custom_data[user_id]', user.id);
      
      console.log('Redirecting to Paddle:', urlObj.toString());
      window.location.href = urlObj.toString();
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

  const selectedPlanData = selectedPlan ? BILLING_CONFIG.plans[selectedPlan] : null;

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
              {/* Hero */}
              <div className="flex items-center justify-between gap-3 mb-6">
                <div>
                  <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
                    {isSq ? 'Çmime të thjeshta' : 'Simple pricing'}
                  </h1>
                  <p className="mt-1 text-xs md:text-sm text-muted-foreground">
                    {isSq
                      ? 'Paguaj një herë dhe ushtro sa të duash.'
                      : 'Pay once, practice as much as you want.'}
                  </p>
                </div>
                <div className="hidden md:flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-3 py-2 text-[11px] text-primary">
                  <Sparkles className="w-4 h-4" />
                  <span>
                    {isSq ? 'Pa abonim automatik' : 'No auto-renew'}
                  </span>
                </div>
              </div>

              {/* Step 1: Category Selector */}
              <div className="mb-8">
                 <div className="flex items-center gap-2 mb-3">
                    <div className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${selectedCategory ? 'bg-primary text-black' : 'bg-muted text-muted-foreground'}`}>1</div>
                    <h3 className={`text-sm font-medium ${selectedCategory ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {isSq ? 'Zgjidh kategorinë' : 'Choose your category'}
                    </h3>
                 </div>

                <div className="flex flex-wrap gap-2 pl-8">
                  {LICENSE_CATEGORIES.map((cat) => {
                    const info = CATEGORY_INFO[cat];
                    const isActive = cat === selectedCategory;
                    // Check if user has active plan for this category (not selected, but actually active in DB)
                    const planForThisCat = existingPlans?.find(p => p.category === cat);
                    const isPlanActive = planForThisCat && planForThisCat.status === 'active' && isPlanCurrentlyActive({ startDate: planForThisCat.start_date, endDate: planForThisCat.end_date });

                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => handleSelectCategory(cat)}
                        className={`relative flex items-center gap-2 rounded-lg px-4 py-3 text-xs border transition-all duration-200 ${
                          isActive
                            ? 'border-primary bg-primary/10 text-foreground shadow-[0_0_15px_rgba(251,146,60,0.15)]'
                            : 'border-border/70 bg-black/40 text-muted-foreground hover:border-primary/50 hover:bg-primary/5 hover:text-foreground'
                        }`}
                      >
                        <span className="font-semibold">{info.name}</span>
                        {isPlanActive && (
                          <span className="ml-1 rounded-full bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 text-[9px] border border-emerald-500/30">
                             ✓
                          </span>
                        )}
                         {isActive && (
                            <div className="absolute -top-1 -right-1">
                                <span className="flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                                </span>
                            </div>
                         )}
                      </button>
                    );
                  })}
                </div>
                
                {currentCategoryPlan && currentCategoryPlanActive && (
                  <div className="pl-8 mt-2">
                      <p className="text-[11px] text-emerald-400">
                        {t('pricing.currentPlanFor')}{' '}
                        {CATEGORY_INFO[selectedCategory!].name}:{' '}
                        <span className="font-semibold">{currentCategoryPlan.plan_tier}</span>
                        {currentCategoryPlan.end_date && (
                        <>
                            {' '}
                            {t('pricing.until')}{' '}
                            {new Date(currentCategoryPlan.end_date).toLocaleDateString()}
                        </>
                        )}
                    </p>
                  </div>
                )}
              </div>

              {/* Free vs Paid Comparison */}
              <div className="pl-8 mt-6 grid gap-3 md:grid-cols-2 opacity-80 hover:opacity-100 transition-opacity">
                <Card className="border border-border/60 bg-black/40">
                  <CardHeader className="pb-2 pt-3 px-3">
                    <CardTitle className="text-xs flex items-center justify-between">
                      <span>{isSq ? 'Falas' : 'Free'}</span>
                      <span className="text-[10px] text-muted-foreground">0 €</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-3 pb-3 space-y-1">
                    {featureListFree.map((f) => (
                      <p
                        key={f}
                        className="text-[10px] text-muted-foreground flex items-start gap-2"
                      >
                        <span className="mt-[2px] text-muted-foreground/60">•</span>
                        <span>{f}</span>
                      </p>
                    ))}
                  </CardContent>
                </Card>

                <Card className="border border-primary/40 bg-primary/5 relative overflow-hidden">
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(251,146,60,0.1),_transparent_60%)]" />
                  <CardHeader className="pb-2 pt-3 px-3 relative z-10">
                    <CardTitle className="text-xs flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Crown className="w-3 h-3 text-primary" />
                        <span>{isSq ? 'Premium' : 'Premium'}</span>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-3 pb-3 space-y-1 relative z-10">
                    {featureListPaid.map((f) => (
                      <p
                        key={f}
                        className="text-[10px] text-muted-foreground flex items-start gap-2"
                      >
                        <Check className="w-3 h-3 mt-[1px] text-primary" />
                        <span>{f}</span>
                      </p>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </GlassCard>

            {/* RIGHT: Plan cards + summary */}
            <div className="flex flex-col gap-4">
               {/* Step 2 Header */}
               <div className="flex items-center gap-2 mb-1">
                    <div className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${selectedPlan ? 'bg-primary text-black' : 'bg-muted text-muted-foreground'}`}>2</div>
                    <h3 className={`text-sm font-medium ${selectedPlan ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {isSq ? 'Zgjidh planin' : 'Choose your plan'}
                    </h3>
               </div>

              {/* Plans row */}
              <div className={`grid gap-4 md:grid-cols-3 transition-all duration-300 ${!selectedCategory ? 'opacity-50 grayscale pointer-events-none' : 'opacity-100'}`}>
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
                      className={`relative border flex flex-col justify-between h-full cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? 'border-primary ring-1 ring-primary bg-black/90 shadow-[0_0_30px_rgba(251,146,60,0.15)] transform scale-[1.02]'
                          : isBestValue
                          ? 'border-primary/50 bg-black/80 hover:border-primary/80'
                          : 'border-border/60 bg-black/60 hover:border-primary/40'
                      }`}
                      onClick={() => {
                        if (!isCurrentActivePlan && !isProcessing && !isAdmin) {
                          setSelectedPlan(plan.id);
                        }
                      }}
                    >
                      {isBestValue && (
                        <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 z-20">
                          <Badge className="rounded-full border border-primary/90 bg-gradient-to-r from-orange-500 via-amber-300 to-orange-500 text-[9px] px-2 py-0.5 text-black font-bold shadow-sm">
                            {isSq ? 'MË I SHITURI' : 'BEST VALUE'}
                          </Badge>
                        </div>
                      )}

                      {isSelected && (
                         <div className="absolute top-2 right-2 text-primary">
                            <div className="rounded-full bg-primary/20 p-1">
                                <Check className="w-3 h-3" />
                            </div>
                         </div>
                      )}

                      <CardHeader className="pt-6 pb-3">
                        <CardTitle className="text-sm font-semibold flex flex-col gap-1">
                          <div className="flex items-center justify-between gap-2">
                            <span>{plan.label}</span>
                          </div>
                          <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-bold">{plan.priceEur}</span>
                            <span className="text-xs text-muted-foreground">
                              {isSq ? '€' : '€'}
                            </span>
                          </div>
                        </CardTitle>
                      </CardHeader>

                      <CardContent className="pb-2 space-y-1">
                        <p className="text-[11px] text-muted-foreground">
                          {isSq ? 'Vetëm' : 'Just'} {plan.pricePerMonthEur.toFixed(2)} € /
                          {isSq ? ' muaj' : ' mo'}
                        </p>
                        <p className="text-[10px] text-muted-foreground/70">
                          {isSq
                            ? 'Pa abonim automatik'
                            : 'One-time payment'}
                        </p>
                      </CardContent>

                      <CardFooter className="pt-2">
                        <div className={`w-full py-1.5 text-[10px] font-medium text-center rounded border ${isSelected ? 'bg-primary text-black border-primary' : 'bg-transparent border-border text-muted-foreground'}`}>
                             {isSelected ? (isSq ? 'E ZGJEDHUR' : 'SELECTED') : (isSq ? 'Zgjidh' : 'Select')}
                        </div>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>

              {/* Summary + final CTA */}
              <GlassCard className={`border border-border/80 bg-gradient-to-r from-black via-zinc-950 to-black px-4 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-500 ${selectedCategory && selectedPlan ? 'opacity-100 translate-y-0' : 'opacity-50 translate-y-4 pointer-events-none'}`}>
                <div className="space-y-1 text-xs md:text-sm">
                  {selectedCategory && selectedPlanData && (
                    <>
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-full border border-primary/40 bg-primary/10 px-2 py-[3px] text-[11px] text-primary flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            {isSq ? 'Përmbledhje' : 'Summary'}
                            </span>
                            <span className="text-foreground font-medium">
                            {CATEGORY_INFO[selectedCategory].name} <span className="text-muted-foreground">+</span> {selectedPlanData.label}
                            </span>
                        </div>
                        <p className="text-muted-foreground text-xs">
                            {isSq ? 'Total: ' : 'Total: '}
                            <span className="font-semibold text-foreground">
                            {selectedPlanData.priceEur} €
                            </span>
                        </p>
                    </>
                  )}
                  {(!selectedCategory || !selectedPlanData) && (
                       <p className="text-muted-foreground italic">{isSq ? 'Zgjidhni kategorinë dhe planin për të vazhduar' : 'Select a category and plan to continue'}</p>
                  )}
                </div>

                <div className="flex flex-col items-end gap-1">
                  <Button
                    type="button"
                    onClick={handlePurchase}
                    disabled={!selectedCategory || !selectedPlan || isProcessing || isAdmin || currentCategoryPlanActive}
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
                      : !selectedCategory || !selectedPlan
                      ? isSq
                         ? 'Zgjidh opsionet...'
                         : 'Select options...'
                      : isSq
                      ? 'Vazhdo te pagesa'
                      : 'Continue to payment'}
                  </Button>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
