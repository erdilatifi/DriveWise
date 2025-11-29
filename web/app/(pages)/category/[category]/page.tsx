'use client';

import { use, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import { Skeleton } from '@/components/ui/skeleton';
import { CATEGORY_INFO, type LicenseCategory } from '@/types/database';
import Link from 'next/link';
import { Play, Clock, CheckCircle, Target, Shuffle, Brain, FileText, Activity, ArrowRight } from 'lucide-react';
import { notFound, useRouter } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { useLanguage } from '@/contexts/language-context';
import { useTestCount } from '@/hooks/use-test-attempts';
import { useAuth } from '@/contexts/auth-context';

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { t, language } = useLanguage();
  const isSq = language === 'sq';
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { category: categoryParam } = use(params);
  const category = categoryParam.toUpperCase() as LicenseCategory;
  
  // Validate category
  if (!CATEGORY_INFO[category]) {
    notFound();
  }

  // Use TanStack Query for data fetching (must be called unconditionally before any early returns)
  const { data: testCount = 0, isLoading: loading } = useTestCount(category);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [authLoading, user, router]);

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">
            {authLoading ? 'Authenticating...' : 'Redirecting...'}
          </p>
        </div>
      </div>
    );
  }

  const categoryInfo = CATEGORY_INFO[category];
  const mockTests = Array.from({ length: testCount }, (_, i) => i + 1);

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-hidden">
      {/* Background grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(60%_60%_at_50%_20%,#000_20%,transparent_70%)]"
      >
        <svg className="h-full w-full opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="cat-detail-grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M32 0H0V32" fill="none" stroke="currentColor" strokeWidth="0.4" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cat-detail-grid)" />
        </svg>
      </div>

      {/* Warm glows & rails */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-orange-500/20 via-transparent to-transparent blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="hidden lg:block absolute top-24 bottom-24 left-[10%] w-px bg-gradient-to-b from-transparent via-orange-500/20 to-transparent" />
        <div className="hidden lg:block absolute top-24 bottom-24 right-[10%] w-px bg-gradient-to-b from-transparent via-orange-500/20 to-transparent" />
      </div>

      <Navbar />

      {/* Category header */}
      <section className="pt-32 pb-8">
        <div className="container mx-auto px-4 max-w-6xl relative">
          <GlassCard className="relative overflow-hidden p-6 md:p-8 border border-border/80 bg-black/85">
            <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-orange-500/10 blur-3xl opacity-60" />
            <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-4 max-w-xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/40 bg-orange-500/10 px-3 py-1 text-[11px] font-medium text-orange-300">
                  <Target className="w-3.5 h-3.5" />
                  <span className="uppercase tracking-wider">{t('category.licenseCategory')}</span>
                </div>
                <div className="space-y-2">
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight">
                    {categoryInfo.name}
                  </h1>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                    {categoryInfo.description}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto md:justify-end">
                <div className="flex items-center gap-3 rounded-xl bg-black/60 border border-border/60 px-4 py-3 backdrop-blur-sm">
                  <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm">
                      {loading ? '...' : testCount} {t('category.mockTests')}
                    </span>
                    <span className="text-muted-foreground text-[10px]">
                      {t('category.mock_tests_hint')}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-xl bg-black/60 border border-border/60 px-4 py-3 backdrop-blur-sm">
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm">
                      ~10 {t('category.minutesEach')}
                    </span>
                    <span className="text-muted-foreground text-[10px]">
                      {t('category.perTestApprox')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Tests & modes */}
      <section className="pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col gap-10">
            
            {/* Quick Actions */}
            <div className="grid gap-6 md:grid-cols-2">
              <GlassCard className="group relative overflow-hidden border border-orange-500/30 bg-gradient-to-br from-orange-500/5 via-black/80 to-black/90 p-6 hover:border-orange-500/50 transition-all duration-300">
                <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-orange-500/20 flex items-center justify-center text-orange-400 group-hover:scale-110 transition-transform duration-300">
                    <Shuffle className="w-6 h-6" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <h3 className="text-lg font-semibold group-hover:text-orange-100 transition-colors">
                      {isSq ? 'Test i Përzier' : 'Mixed Question Test'}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {isSq 
                        ? 'Pyetje të rastësishme nga të gjitha testet për një sfidë reale.'
                        : 'Random questions from all tests in this category for a full challenge.'}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    className="mt-4 sm:mt-0 w-full sm:w-auto shadow-lg shadow-orange-500/20 bg-orange-600 hover:bg-orange-500 text-white border-none"
                    asChild
                  >
                    <Link href={`/test/${category.toLowerCase()}/mixed`}>
                      {isSq ? 'Fillo tani' : 'Start mixed'}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </GlassCard>

              <GlassCard className="group relative overflow-hidden border border-purple-500/30 bg-gradient-to-br from-purple-500/5 via-black/80 to-black/90 p-6 hover:border-purple-500/50 transition-all duration-300">
                <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform duration-300">
                    <Brain className="w-6 h-6" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <h3 className="text-lg font-semibold group-hover:text-purple-100 transition-colors">
                      {isSq ? 'Test i Personalizuar' : 'Personalized Test'}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {isSq
                        ? 'Fokusohuni në pyetjet që keni gabuar më parë.'
                        : 'Focus on questions you previously missed to fix weak spots.'}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    className="mt-4 sm:mt-0 w-full sm:w-auto shadow-lg shadow-purple-500/20 bg-purple-600 hover:bg-purple-500 text-white border-none"
                    asChild
                  >
                    <Link href={`/test/${category.toLowerCase()}/personalized`}>
                      {isSq ? 'Fillo tani' : 'Start personalized'}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </GlassCard>
            </div>

            {/* Mock tests grid */}
            <div>
              <div className="flex flex-col gap-2 mb-6">
                <h2 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
                  <FileText className="w-5 h-5 text-orange-400" />
                  {isSq ? 'Testet e rregullta' : 'Standard Mock Tests'}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {loading
                    ? 'Loading tests...'
                    : testCount > 0
                      ? isSq 
                        ? `Zgjidhni nga ${testCount} teste zyrtare për këtë kategori.`
                        : `Choose from ${testCount} exam-style mock tests for this category.`
                      : t('category.noTestsDescription')}
                </p>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <GlassCard
                      key={i}
                      className="h-40 flex flex-col items-center justify-center p-6 space-y-4 border-border/50"
                    >
                      <Skeleton className="w-12 h-12 rounded-full" />
                      <div className="w-full space-y-2 text-center">
                        <Skeleton className="h-4 w-20 mx-auto" />
                        <Skeleton className="h-3 w-16 mx-auto" />
                      </div>
                    </GlassCard>
                  ))}
                </div>
              ) : testCount === 0 ? (
                <GlassCard className="p-8 text-center border border-border/80 bg-black/80">
                  <h3 className="text-lg font-semibold mb-2">{t('category.noTestsTitle')}</h3>
                  <p className="text-sm text-muted-foreground">{t('category.noTestsDescription')}</p>
                </GlassCard>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                  {mockTests.map((testNumber) => (
                    <Link
                      key={testNumber}
                      href={`/test/${category.toLowerCase()}/${testNumber}`}
                      className="group block h-full"
                    >
                      <GlassCard className="relative h-full p-6 border border-border/60 bg-black/60 hover:bg-black/80 hover:border-orange-500/40 transition-all duration-300 flex flex-col items-center justify-center gap-4 group-hover:shadow-[0_0_30px_rgba(249,115,22,0.1)]">
                        <div className="w-14 h-14 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-orange-500/20 transition-all duration-300">
                          <span className="text-xl font-bold text-orange-400 font-mono">
                            {testNumber}
                          </span>
                        </div>
                        
                        <div className="text-center space-y-1">
                          <p className="text-sm font-medium group-hover:text-orange-100 transition-colors">
                            Test {testNumber}
                          </p>
                          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                            10 {t('category.questions')}
                          </p>
                        </div>

                        <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-orange-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </GlassCard>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
