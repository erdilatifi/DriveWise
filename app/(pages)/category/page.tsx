'use client';

import type { ComponentType, SVGProps } from 'react';
import { Navbar } from '@/components/navbar';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useLanguage } from '@/contexts/language-context';
import { CATEGORY_INFO, type LicenseCategory } from '@/types/database';
import { ArrowRight, Car, Truck, Bike, Bus, Sparkles } from 'lucide-react';

const CATEGORY_ICONS: Record<LicenseCategory, ComponentType<SVGProps<SVGSVGElement>>> = {
  A: Bike,
  B: Car,
  C: Truck,
  D: Bus,
};

export default function CategoryIndexPage() {
  const { t, language } = useLanguage();
  const isSq = language === 'sq';
  const categories = Object.keys(CATEGORY_INFO) as LicenseCategory[];

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-hidden">
      {/* Background grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(60%_60%_at_50%_20%,#000_20%,transparent_70%)]"
      >
        <svg className="h-full w-full opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="category-grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M32 0H0V32" fill="none" stroke="currentColor" strokeWidth="0.4" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#category-grid)" />
        </svg>
      </div>

      {/* Warm glows & rails (subtle, not 1:1 with pricing) */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-orange-500/25 via-transparent to-transparent blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-6rem] left-[8%] h-52 w-52 rounded-full bg-orange-400/16 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-7rem] right-[14%] h-64 w-64 rounded-full bg-amber-500/16 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="hidden lg:block absolute top-24 bottom-24 left-[12%] w-px bg-gradient-to-b from-transparent via-orange-500/20 to-transparent" />
        <div className="hidden lg:block absolute top-24 bottom-24 right-[12%] w-px bg-gradient-to-b from-transparent via-orange-500/20 to-transparent" />
        <div className="hidden md:block absolute inset-x-[14%] top-64 h-px bg-gradient-to-r from-transparent via-orange-400/18 to-transparent" />
      </div>

      <Navbar />

      <main className="pt-32 pb-16">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl relative">
          {/* Header */}
          <header className="max-w-2xl space-y-4 mb-10 md:mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-black/60 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              <span className="h-1.5 w-7 rounded-full bg-gradient-to-r from-orange-500 to-orange-300" />
              {t('categories.title')}
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight">
              {isSq ? 'Zgjidh kategorinë tënde të patentës' : 'Choose your license category'}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-300 to-white mt-1">
                {isSq ? ' dhe ndërto rrugën tënde drejt provimit.' : ' and build your road to the exam.'}
              </span>
            </h1>

            <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-lg">
              {isSq
                ? 'Fillo me kategorinë që të duhet më parë. Më vonë mund të shtosh kategori të tjera, ndërsa progresi ruhet veçmas për secilën.'
                : 'Start with the category you need first. You can add more later, with progress tracked separately for each one.'}
            </p>

            <div className="flex items-center gap-2 text-[11px] text-muted-foreground/80">
              <Sparkles className="h-3.5 w-3.5 text-orange-300" />
              <span>
                {isSq
                  ? 'Çdo kategori ka ritmin dhe vështirësinë e vet – zgjidh atë që të përputhet me realitetin tënd të përditshëm.'
                  : 'Each category has its own rhythm and difficulty – pick the one that best matches your everyday driving reality.'}
              </span>
            </div>
          </header>

          {/* Categories Grid */}
          <section
            aria-label={t('categories.title')}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6"
          >
            {categories.map((cat) => {
              const info = CATEGORY_INFO[cat];
              const Icon = CATEGORY_ICONS[cat] ?? Car;

              return (
                <GlassCard
                  key={cat}
                  className="group relative overflow-hidden border border-border/80 bg-black/85 p-5 md:p-6 flex flex-col justify-between min-h-[220px] hover:border-orange-500/60 hover:bg-black/95 transition-all duration-300"
                >
                  {/* Soft “road route” accent */}
                  <div className="pointer-events-none absolute -right-10 top-8 h-40 w-40 rounded-full border border-dashed border-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="pointer-events-none absolute -bottom-8 left-6 h-24 w-24 rounded-full bg-orange-500/6 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative z-10 flex flex-col gap-5 h-full">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="h-11 w-11 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 group-hover:text-orange-300 group-hover:scale-105 transition-all duration-300">
                          <Icon className="w-6 h-6" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                            {isSq ? 'Kategoria' : 'Category'}
                          </span>
                          <h2 className="text-lg font-semibold tracking-tight text-foreground group-hover:text-orange-100 transition-colors">
                            {info.name}
                          </h2>
                        </div>
                      </div>

                      <span className="text-4xl font-bold text-white/8 font-mono group-hover:text-orange-500/20 transition-colors">
                        {cat}
                      </span>
                    </div>

                    <p className="text-xs md:text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-4">
                      {info.description}
                    </p>

                    <div className="mt-auto pt-2">
                      <Button
                        asChild
                        variant="outline"
                        className="w-full justify-between border-white/10 bg-white/5 text-xs md:text-sm font-medium group-hover:bg-orange-500 group-hover:text-black group-hover:border-orange-500 transition-all duration-300"
                      >
                        <Link href={`/category/${cat.toLowerCase()}`}>
                          <span className="flex items-center gap-1.5">
                            {isSq
                              ? `Ushtro kategorinë ${cat}`
                              : `Practice category ${cat}`}
                          </span>
                          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </GlassCard>
              );
            })}
          </section>

          {/* Helper text under grid */}
          <p className="mt-6 text-[11px] text-muted-foreground/75">
            {isSq
              ? 'Mund të ndryshosh kategorinë kur të duash nga paneli kryesor. Çdo kategori ka statistikat dhe historinë e saj të veçantë.'
              : 'You can switch categories anytime from the main dashboard. Each category keeps its own stats and history.'}
          </p>
        </div>
      </main>
    </div>
  );
}
