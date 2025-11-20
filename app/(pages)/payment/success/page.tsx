'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/language-context';

type OrderStatus = 'loading' | 'paid' | 'pending' | 'error';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t } = useLanguage();
  const orderId = searchParams.get('orderId');

  const [status, setStatus] = useState<OrderStatus>('loading');

  useEffect(() => {
    if (!orderId) {
      setStatus('error');
      return;
    }

    let cancelled = false;
    let attempts = 0;

    const poll = async () => {
      if (cancelled) return;
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        if (!res.ok) {
          if (attempts >= 8) {
            setStatus('error');
          } else {
            attempts += 1;
            setTimeout(poll, 3000);
          }
          return;
        }

        const order = await res.json();
        if (order.status === 'paid') {
          setStatus('paid');
        } else if (attempts >= 8) {
          setStatus('pending');
        } else {
          attempts += 1;
          setTimeout(poll, 3000);
        }
      } catch {
        if (attempts >= 8) {
          setStatus('error');
        } else {
          attempts += 1;
          setTimeout(poll, 3000);
        }
      }
    };

    poll();

    return () => {
      cancelled = true;
    };
  }, [orderId]);

  let title = 'Checking payment...';
  let description = 'We are confirming your payment status. This may take a few seconds.';

  if (!orderId) {
    title = 'Missing order information';
    description = 'We could not find payment details. Please go back to pricing and try again.';
  } else if (status === 'paid') {
    title = 'Payment successful';
    description = 'Your plan should now be active. You can start using all premium features.';
  } else if (status === 'pending') {
    title = 'Payment processing';
    description =
      'We have not yet received a final confirmation from the payment provider. If this persists, please contact support.';
  } else if (status === 'error') {
    title = 'Could not confirm payment';
    description = 'Something went wrong while checking your payment. Please try again later.';
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <GlassCard className="p-6 md:p-8 border border-border/80 bg-black/85">
            <h1 className="text-xl md:text-2xl font-semibold mb-2">{title}</h1>
            <p className="text-sm text-muted-foreground mb-6">{description}</p>

            {status === 'loading' && (
              <div className="flex items-center gap-3 mb-6">
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span className="text-xs text-muted-foreground">{t('test.loadingQuestions')}</span>
              </div>
            )}

            {orderId && (
              <p className="text-[11px] text-muted-foreground mb-4">Order ID: {orderId}</p>
            )}

            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <Button asChild className="flex-1">
                <Link href="/dashboard">{t('auth.backToHome')}</Link>
              </Button>
              <Button asChild variant="outline" className="flex-1">
                <Link href="/pricing">Go to pricing</Link>
              </Button>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
