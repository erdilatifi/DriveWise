'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import { Lightbulb } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import { Navbar } from '@/components/navbar';

export function Paywall() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-3xl pt-28">
        <GlassCard className="p-6 border border-border/80 bg-black/80">
          <h1 className="text-2xl font-semibold mb-2 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-primary" />
            {t('trainer.premiumRequiredTitle') || 'Unlock Decision Trainer'}
          </h1>
          <p className="text-sm text-muted-foreground mb-4">
            {t('trainer.premiumRequiredDescription') ||
              'Decision Trainer is part of the paid plan. With a paid plan you get full access to all trainer categories, smarter practice modes, and detailed review features.'}
          </p>
          <ul className="text-sm text-muted-foreground mb-4 list-disc pl-5 space-y-1">
            <li>
              {t('trainer.premiumBenefitUnlimited') || 'Unlimited Decision Trainer practice across all categories.'}
            </li>
            <li>
              {t('trainer.premiumBenefitStudy') || 'Access to related study material and test reviews for deeper learning.'}
            </li>
            <li>
              {t('trainer.premiumBenefitFocus') || 'Smart modes that focus on your weak points and speed.'}
            </li>
          </ul>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild className="flex-1">
              <Link href="/pricing">
                {t('trainer.premiumUpgradeCta') || 'See plans'}
              </Link>
            </Button>
            <Button asChild variant="outline" className="flex-1">
              <Link href="/dashboard">
                {t('auth.backToHome')}
              </Link>
            </Button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
