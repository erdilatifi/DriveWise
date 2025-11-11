'use client';

import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import { CATEGORY_INFO, type LicenseCategory } from '@/types/database';
import Link from 'next/link';
import Image from 'next/image';
import { Car, Bike, Truck, Bus, Zap, Target, TrendingUp, Shield } from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { useLanguage } from '@/contexts/language-context';
import { motion } from 'framer-motion';

const categoryIcons: Record<LicenseCategory, React.ReactNode> = {
  A: <Bike className="w-8 h-8" />,
  B: <Car className="w-8 h-8" />,
  C: <Truck className="w-8 h-8" />,
  D: <Bus className="w-8 h-8" />,
};

export default function HomePage() {
  const { t } = useLanguage();
  const categories = useMemo(
    () => Object.keys(CATEGORY_INFO) as LicenseCategory[],
    []
  );

  // Make "B" prominent (most common), fall back to first if missing
  const featured = useMemo<LicenseCategory>(() => {
    return (['B', ...categories].find(c => categories.includes(c as LicenseCategory)) ??
      categories[0]) as LicenseCategory;
  }, [categories]);

  const subtleRise = {
    initial: { opacity: 0, y: 20, scale: 0.98 },
    whileInView: { opacity: 1, y: 0, scale: 1 },
    viewport: { once: true },
    transition: { duration: 0.5 },
  };

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      {/* Soft grid background (unchanged) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(60%_60%_at_50%_30%,#000_20%,transparent_70%)]"
      >
        <svg className="h-full w-full opacity-[0.08]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M32 0H0V32" fill="none" stroke="currentColor" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Glow blobs - contained */}
      <div className="pointer-events-none absolute top-0 right-0 h-96 w-96 rounded-full bg-primary/20 blur-3xl opacity-50" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-96 w-96 rounded-full bg-primary/10 blur-3xl opacity-50" />

      <Navbar />

      {/* Hero (unchanged) */}
      <motion.section {...subtleRise} className="relative overflow-hidden pt-28">
        <div className="container relative mx-auto px-6 py-24 md:py-32 max-w-7xl">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                {t('home.hero.badge')}
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              {t('home.hero.title')}
              <span className="block text-primary mt-2">
                {t('home.hero.titleAccent')}
              </span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {t('home.hero.description')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" asChild className="h-12 px-8 text-base font-semibold shadow-lg shadow-primary/20">
                <Link href="/register">{t('home.hero.startLearning')}</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="h-12 px-8 text-base font-semibold">
                <Link href="#categories">{t('home.hero.browseCategories')}</Link>
              </Button>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Features (unchanged) */}
      <section className="container mx-auto px-6 py-20 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Target, title: t('features.comprehensive.title'), desc: t('features.comprehensive.desc') },
            { icon: TrendingUp, title: t('features.progress.title'), desc: t('features.progress.desc') },
            { icon: Shield, title: t('features.guaranteed.title'), desc: t('features.guaranteed.desc') },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              viewport={{ once: true }}
            >
              <GlassCard hover className="p-6 h-full relative overflow-hidden">
                <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary/10 blur-2xl" />
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Categories (no duplicates, no vertical overflow) */}
      <section id="categories" className="container mx-auto px-6 pt-4 pb-20 max-w-7xl">
        <div className="text-center mb-14 space-y-3">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            {t('categories.title')}
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('categories.description')}
          </p>
        </div>

        {/* Single render pass: Featured + Side list ONLY */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 max-w-full">
          {/* Featured - stretches to match side cards */}
          <motion.div {...subtleRise} className="lg:col-span-2 flex">
            <Link href={`/category/${featured.toLowerCase()}`} className="flex-1">
              <div className="group relative overflow-hidden rounded-2xl border border-border bg-card h-full flex flex-col">
                {/* Decorative (absolute; doesn't affect height) */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-primary/10" />
                </div>

                <div className="relative z-10 p-6 md:p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                      {t('categories.popular')}
                    </div>

                    <h3 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight">
                      {CATEGORY_INFO[featured].name}
                    </h3>
                    <p className="mt-2 text-muted-foreground max-w-2xl">
                      {CATEGORY_INFO[featured].description}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-primary font-semibold group-hover:gap-3 transition-all">
                      <span>{t('categories.startPractice')}</span>
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>

                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      {categoryIcons[featured]}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Side list (auto height cards) */}
          <div className="flex flex-col gap-5">
            {categories
              .filter((c) => c !== featured)
              .map((category, i) => (
                <CategoryCard
                  key={category}
                  category={category}
                  index={i}
                  tStart={t('categories.startPractice')}
                />
              ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-black/20 backdrop-blur-sm mt-20 w-full">
        <div className="container mx-auto px-6 py-12 max-w-7xl w-full">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden border border-primary/30">
                <Image
                  src="/logo-white.png"
                  alt="DriveWise Logo"
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-lg font-semibold">DriveWise</span>
            </div>
            <p className="text-sm text-muted-foreground">
              &copy; 2024 DriveWise. Kosovo&apos;s Premier Driving Theory Platform.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ---------- Components (auto-height, safe) ---------- */

function CategoryCard({
  category,
  index,
  tStart,
}: {
  category: LicenseCategory;
  index: number;
  tStart: string;
}) {
  const rise = {
    initial: { opacity: 0, y: 14, scale: 0.99 },
    whileInView: { opacity: 1, y: 0, scale: 1 },
    viewport: { once: true },
    transition: { duration: 0.45, delay: index * 0.08 },
  };

  return (
    <motion.div {...rise}>
      <Link href={`/category/${category.toLowerCase()}`}>
        <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 hover:border-primary/50 transition-all duration-300">
          {/* Decorative glow (absolute; doesn’t push height) */}
          <div className="pointer-events-none absolute right-0 top-0 h-24 w-24 translate-x-1/4 -translate-y-1/4 rounded-full bg-primary/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="relative flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
              {categoryIcons[category]}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h4 className="text-lg font-semibold tracking-tight truncate">
                  {CATEGORY_INFO[category].name}
                </h4>
                <span className="inline-flex rounded-full border border-border px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                  {`Cat ${category}`}
                </span>
              </div>

              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                {CATEGORY_INFO[category].description}
              </p>

              <div className="mt-3 flex items-center gap-2 text-primary text-sm font-medium group-hover:gap-3 transition-all">
                <span>{tStart}</span>
                <svg
                  className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
