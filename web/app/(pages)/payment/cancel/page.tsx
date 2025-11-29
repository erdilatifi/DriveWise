'use client';

import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/language-context';

export default function PaymentCancelPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <GlassCard className="p-6 md:p-8 border border-border/80 bg-black/85">
            <h1 className="text-xl md:text-2xl font-semibold mb-2">Payment cancelled</h1>
            <p className="text-sm text-muted-foreground mb-6">
              Your payment was cancelled or not completed. You can return to the app and try again
              later.
            </p>

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
