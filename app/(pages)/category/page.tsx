'use client';

import { Navbar } from '@/components/navbar';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useLanguage } from '@/contexts/language-context';
import { CATEGORY_INFO, type LicenseCategory } from '@/types/database';
import { ArrowRight, Target } from 'lucide-react';

export default function CategoryIndexPage() {
  const { t } = useLanguage();
  const categories = Object.keys(CATEGORY_INFO) as LicenseCategory[];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-28 pb-16">
        <div className="container mx-auto px-4 max-w-5xl space-y-8">
          <div className="max-w-2xl space-y-3">
            <p className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-black/60 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              <span className="h-1.5 w-6 rounded-full bg-gradient-to-r from-orange-500 to-orange-300" />
              {t('categories.title')}
            </p>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
              {t('categories.title')}
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              {t('categories.description')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-4">
            {categories.map((cat) => {
              const info = CATEGORY_INFO[cat];
              return (
                <GlassCard
                  key={cat}
                  className="p-5 md:p-6 border border-border/80 bg-black/80 hover:border-primary/60 hover:shadow-[0_20px_60px_rgba(0,0,0,0.9)] transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary">
                      <Target className="w-3.5 h-3.5" />
                      <span>
                        {t('category.licenseCategory')} {cat}
                      </span>
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold tracking-tight mb-1">{info.name}</h2>
                      <p className="text-sm text-muted-foreground">{info.description}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button asChild className="w-full justify-between text-sm">
                      <Link href={`/category/${cat.toLowerCase()}`}>
                        <span>{t('categories.startPractice')}</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
