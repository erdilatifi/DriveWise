'use client';

import { use, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import { CATEGORY_INFO, type LicenseCategory } from '@/types/database';
import Link from 'next/link';
import { Play, Clock, CheckCircle, Target, Shuffle, Brain } from 'lucide-react';
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
  const { t } = useLanguage();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { category: categoryParam } = use(params);
  const category = categoryParam.toUpperCase() as LicenseCategory;
  
  // Validate category
  if (!CATEGORY_INFO[category]) {
    notFound();
  }

  // Use TanStack Query for data fetching (must be called unconditionally before any early returns)
  const { data: testCount = 10, isLoading: loading } = useTestCount(category);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [authLoading, user, router]);

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
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
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Category header */}
      <section className="pt-28 pb-8">
        <div className="container mx-auto px-4 max-w-5xl">
          <GlassCard className="relative overflow-hidden p-6 md:p-8 border border-border/80 bg-black/80">
            <div className="pointer-events-none absolute -right-24 -top-24 h-48 w-48 rounded-full bg-primary/25 blur-3xl opacity-60" />
            <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-4 max-w-xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-[11px] font-medium text-primary">
                  <Target className="w-4 h-4" />
                  <span>{t('category.licenseCategory')}</span>
                </div>
                <div className="space-y-2">
                  <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
                    {categoryInfo.name}
                  </h1>
                  <p className="text-sm md:text-base text-muted-foreground">
                    {categoryInfo.description}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto md:justify-end">
                <div className="flex items-center gap-2 rounded-xl bg-black/70 border border-border/80 px-4 py-3 text-xs">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {loading ? '...' : testCount} {t('category.mockTests')}
                    </span>
                    <span className="text-muted-foreground text-[11px]">
                      {t('category.mock_tests_hint')}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-black/70 border border-border/80 px-4 py-3 text-xs">
                  <Clock className="w-4 h-4 text-primary" />
                  <div className="flex flex-col">
                    <span className="font-medium">
                      ~10 {t('category.minutesEach')}
                    </span>
                    <span className="text-muted-foreground text-[11px]">
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
            {/* Mock tests grid */}
            <div>
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-6">
                <div className="space-y-1">
                  <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
                    {t('category.selectTest')}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {loading
                      ? 'Loading tests...'
                      : `Choose from ${testCount} exam-style mock tests for this category.`}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {mockTests.map((testNumber) => (
                  <Link
                    key={testNumber}
                    href={`/test/${category.toLowerCase()}/${testNumber}`}
                    className="group"
                  >
                    <Card className="relative h-full border border-border/80 bg-black/75 hover:border-primary/60 transition-colors duration-300 overflow-hidden">
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <CardContent className="relative flex flex-col items-center justify-center px-6 py-7 space-y-4">
                        <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/40 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                          <span className="text-2xl font-semibold text-primary">
                            {testNumber}
                          </span>
                        </div>
                        <div className="text-center space-y-1">
                          <p className="text-sm font-medium">Test {testNumber}</p>
                          <p className="text-xs text-muted-foreground">
                            10 {t('category.questions')}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          className="w-full text-xs shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-shadow"
                        >
                          <Play className="w-3 h-3 mr-1" />
                          {t('category.start')}
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>

            {/* Mixed & Personalized modes */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="bg-gradient-to-br from-primary/10 via-black/60 to-black/80 border-primary/40 shadow-lg shadow-primary/20">
                <CardContent className="p-6 md:p-7 flex flex-col md:flex-row items-start md:items-center gap-5">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-primary/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Shuffle className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <h3 className="text-lg font-semibold">Mixed Question Test</h3>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      Random questions from all tests in this category for when you want a full exam-style challenge.
                    </p>
                  </div>
                  <Button
                    size="sm"
                    className="mt-2 md:mt-0 flex-shrink-0 shadow-lg shadow-primary/30"
                    asChild
                  >
                    <Link href={`/test/${category.toLowerCase()}/mixed`}>
                      <Shuffle className="w-4 h-4 mr-1" />
                      Start mixed
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500/15 via-black/60 to-black/80 border-purple-500/40 shadow-lg shadow-purple-500/25">
                <CardContent className="p-6 md:p-7 flex flex-col md:flex-row items-start md:items-center gap-5">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-purple-500/25 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Brain className="w-6 h-6 text-purple-200" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <h3 className="text-lg font-semibold">Personalized Test</h3>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      Focus on questions you previously missed to turn weak spots into strong ones.
                    </p>
                  </div>
                  <Button
                    size="sm"
                    className="mt-2 md:mt-0 flex-shrink-0 shadow-lg shadow-purple-500/40 bg-purple-600 hover:bg-purple-700"
                    asChild
                  >
                    <Link href={`/test/${category.toLowerCase()}/personalized`}>
                      <Brain className="w-4 h-4 mr-1" />
                      Start personalized
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
