'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/language-context';
import { useAuth } from '@/contexts/auth-context';
import { useUserPlans } from '@/hooks/use-subscriptions';
import { isPlanCurrentlyActive } from '@/lib/subscriptions';
import { CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const { user, loading: authLoading } = useAuth();
  const isSq = language === 'sq';
  
  // Poll user plans
  const { data: plans, refetch, isError } = useUserPlans(user?.id);
  
  const [isChecking, setIsChecking] = useState(true);
  const [confirmedPlan, setConfirmedPlan] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const hasActivePlan = plans?.some(
    (p) =>
      p.status === 'active' &&
      isPlanCurrentlyActive({ startDate: p.start_date, endDate: p.end_date })
  );

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      // If not logged in, we can't check. Redirect to login or show message?
      // Probably redirect to login with a return url
      return;
    }

    if (hasActivePlan) {
      setConfirmedPlan(true);
      setIsChecking(false);
      return;
    }

    // Poll if no active plan found yet
    if (attempts < 10) { // Poll for ~30 seconds (10 * 3s)
      const timer = setTimeout(() => {
        refetch();
        setAttempts((prev) => prev + 1);
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      // Stop checking after timeout
      setIsChecking(false);
    }
  }, [authLoading, user, hasActivePlan, attempts, refetch]);

  // UI State
  let icon = <Loader2 className="w-12 h-12 text-primary animate-spin" />;
  let title = isSq ? 'Duke verifikuar pagesën...' : 'Verifying payment...';
  let description = isSq 
    ? 'Jemi duke pritur konfirmimin nga banka. Kjo mund të zgjasë pak sekonda.'
    : 'We are waiting for confirmation from the payment provider. This may take a few seconds.';
  let colorClass = 'border-primary/50 bg-primary/5';

  if (confirmedPlan) {
    icon = <CheckCircle2 className="w-12 h-12 text-emerald-500" />;
    title = isSq ? 'Pagesa u krye me sukses!' : 'Payment successful!';
    description = isSq
      ? 'Plani juaj tani është aktiv. Mund të filloni të përdorni të gjitha veçoritë premium.'
      : 'Your plan is now active. You can start using all premium features.';
    colorClass = 'border-emerald-500/50 bg-emerald-500/5';
  } else if (!isChecking && !confirmedPlan) {
    // Timeout or error
    icon = <AlertCircle className="w-12 h-12 text-amber-500" />;
    title = isSq ? 'Pagesa është në proces' : 'Payment processing';
    description = isSq
      ? 'Ende nuk kemi marrë konfirmimin përfundimtar. Ju lutemi prisni pak minuta dhe rifreskoni faqen, ose kontrolloni email-in tuaj.'
      : 'We haven\'t received final confirmation yet. Please wait a few minutes and refresh the page, or check your email.';
    colorClass = 'border-amber-500/50 bg-amber-500/5';
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-32 pb-12">
        <div className="container mx-auto px-4 max-w-xl">
          <GlassCard className={`p-8 border ${colorClass} text-center flex flex-col items-center`}>
            <div className="mb-6 p-4 rounded-full bg-black/20 backdrop-blur-md">
              {icon}
            </div>
            
            <h1 className="text-2xl font-bold mb-3">{title}</h1>
            <p className="text-muted-foreground mb-8 leading-relaxed max-w-md mx-auto">
              {description}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs mx-auto">
              <Button asChild className="flex-1 w-full" size="lg">
                <Link href="/dashboard">
                  {t('auth.backToHome') || 'Go to Dashboard'}
                </Link>
              </Button>
              
              {(!confirmedPlan && !isChecking) && (
                 <Button variant="outline" onClick={() => { setAttempts(0); setIsChecking(true); refetch(); }} className="flex-1 w-full">
                    {isSq ? 'Provo përsëri' : 'Try again'}
                 </Button>
              )}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
