'use client';

import { useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Trophy, Target, Award, Zap, History, Brain } from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { Skeleton } from '@/components/ui/skeleton';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useLanguage } from '@/contexts/language-context';
import { useAuth } from '@/contexts/auth-context';
import { motion } from 'framer-motion';
import { useDashboardStats, useWeakTopics, useGlobalDailyStreak } from '@/hooks/use-test-attempts';
import { useDecisionTrainerStats } from '@/hooks/use-decision-trainer';
import { CATEGORY_INFO, type LicenseCategory } from '@/types/database';

export default function DashboardPage() {
  const { t } = useLanguage();
  const { user, userProfile, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Use TanStack Query for data fetching
  const { data: dashboardData, isLoading: loading, error } = useDashboardStats(user?.id);
  const { data: trainerStats } = useDecisionTrainerStats(user?.id);
  const { data: weakTopicsData } = useWeakTopics(user?.id);
  const { data: globalStreak } = useGlobalDailyStreak(user?.id);
  const categories = useMemo(
    () => Object.keys(CATEGORY_INFO) as LicenseCategory[],
    []
  );
  
  const stats = dashboardData?.stats || {
    totalTests: 0,
    averageScore: 0,
    bestScore: 0,
    testsThisWeek: 0,
    streak: 0,
    passedTests: 0,
    failedTests: 0,
  };
  
  const progressData = dashboardData?.progressData || [];
  const recentTests = dashboardData?.recentTests || [];
  
  const userFullName = userProfile?.full_name;

  // Redirect to home if not authenticated and not loading
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  // Show loader if no user (even during loading) to prevent empty dashboard flash
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">
            {authLoading ? 'Authenticating...' : 'Redirecting...'}
          </p>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    console.error('❌ ERROR FETCHING DASHBOARD DATA:', error);
    
    if (error.message?.includes('42P01')) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <p className="text-destructive mb-4">⚠️ Database tables missing!</p>
            <p className="text-muted-foreground">Run database.sql in Supabase SQL Editor.</p>
          </div>
        </div>
      );
    }
  }

  // While stats are loading (after auth), show a skeleton dashboard layout
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-28">
          <div className="container mx-auto px-8 py-12 max-w-7xl">
            {/* Header skeleton */}
            <div className="mb-12 space-y-3">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-80" />
            </div>

            {/* Stats grid skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {Array.from({ length: 4 }).map((_, i) => (
                <GlassCard key={i} className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-5 w-5 rounded-full" />
                  </div>
                  <Skeleton className="h-7 w-16 mb-2" />
                  <Skeleton className="h-3 w-32" />
                </GlassCard>
              ))}
            </div>

            {/* Charts skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              <GlassCard className="p-6 lg:col-span-2">
                <div className="mb-6 space-y-2">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-3 w-64" />
                </div>
                <Skeleton className="h-60 w-full rounded-xl" />
              </GlassCard>

              <GlassCard className="p-6 border border-border/80 bg-black/80">
                <div className="mb-6 space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-3 w-52" />
                </div>
                <Skeleton className="h-60 w-full rounded-full" />
              </GlassCard>
            </div>

            {/* History CTA skeleton */}
            <GlassCard className="p-8 border border-border/80 bg-black/80 relative overflow-hidden">
              <div className="pointer-events-none absolute -right-32 top-0 h-40 w-40 bg-gradient-to-bl from-orange-500/30 to-transparent blur-3xl opacity-80" />
              <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-3 w-64" />
                </div>
                <Skeleton className="h-10 w-full sm:w-40" />
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    );
  }

  // Show empty state if no tests taken yet
  const hasData = stats.totalTests > 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <motion.div className="pt-28">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="container mx-auto px-8 py-12 max-w-7xl"
        >
          {/* Hero snapshot */}
          <GlassCard className="mb-10 p-6 md:p-7 border border-white/8 bg-black/70 relative overflow-hidden rounded-[1.75rem] shadow-[0_30px_120px_rgba(0,0,0,0.85)]">
            <div className="pointer-events-none absolute inset-0 rounded-[1.75rem] bg-[radial-gradient(circle_at_top,rgba(249,115,22,0.35),transparent_55%),radial-gradient(circle_at_bottom,rgba(0,0,0,0.85),transparent_55%)] blur-2xl opacity-80" />
            <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-xl">
                <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
                  {t('dashboard.welcome')},{' '}
                  <span className="bg-gradient-to-r from-orange-400 to-amber-200 bg-clip-text text-transparent">
                    {userFullName || user?.email?.split('@')[0]}
                  </span>
                </h1>
                <p className="text-sm text-muted-foreground">
                  {t('dashboard.subtitle')}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 text-xs md:text-sm w-full md:w-auto">
                <div className="rounded-xl border border-border/70 bg-black/70 px-3 py-2 flex flex-col gap-1 min-w-[90px]">
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <Target className="w-3 h-3 text-primary" />
                    {t('dashboard.avgScore')}
                  </span>
                  <span className="text-base font-semibold">
                    {stats.averageScore}%
                  </span>
                  <div className="mt-1 h-1.5 rounded-full bg-orange-500/10 overflow-hidden">
                    <div className="h-full w-3/4 bg-gradient-to-r from-orange-500 to-amber-300" />
                  </div>
                </div>
                <div className="rounded-xl border border-border/70 bg-black/70 px-3 py-2 flex flex-col gap-1 min-w-[90px]">
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <Trophy className="w-3 h-3 text-primary" />
                    {t('dashboard.totalTests')}
                  </span>
                  <span className="text-base font-semibold">
                    {stats.totalTests}
                  </span>
                  <div className="mt-1 h-1.5 rounded-full bg-orange-500/10 overflow-hidden">
                    <div className="h-full w-2/3 bg-gradient-to-r from-orange-500 to-amber-300" />
                  </div>
                </div>
                <div className="rounded-xl border border-border/70 bg-black/70 px-3 py-2 flex flex-col gap-1 min-w-[90px]">
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <Zap className="w-3 h-3 text-primary" />
                    {t('dashboard.streak')}
                  </span>
                  <span className="text-base font-semibold">
                    {(globalStreak?.currentStreak ?? 0)} {t('dashboard.days')}
                  </span>
                  <div className="mt-1 h-1.5 rounded-full bg-orange-500/10 overflow-hidden">
                    <div className="h-full w-4/5 bg-gradient-to-r from-orange-500 to-amber-300" />
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Section divider under hero */}
          <div className="h-px w-full bg-gradient-to-r from-transparent via-orange-400/70 to-transparent opacity-70 mb-8" />

          {/* === MAIN GRID LAYOUT (Vercel / Supabase style) === */}
          {hasData ? (
            <>
              {/* When user has data: main analytics band + charts below */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-12">
                {/* Left column: weak topics + weekly progress */}
                <div className="xl:col-span-2 space-y-8">
                  {/* Overall weak topics across all tests */}
                  {weakTopicsData && weakTopicsData.topics.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.48 }}
                    >
                      <GlassCard className="p-6 border border-border/80 bg-black/80">
                        <div className="flex flex-col gap-3">
                          <div className="flex items-center justify-between">
                            <div className="space-y-2">
                              <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-black/60 px-2.5 py-0.5 text-[11px] text-muted-foreground">
                                <span className="h-1.5 w-8 bg-gradient-to-r from-orange-500 to-amber-300 rounded-full" />
                                <span>Analytics</span>
                              </div>
                              <div>
                                <h2 className="text-lg font-semibold mb-1">{t('dashboard.weakTopicsTitle')}</h2>
                                <p className="text-sm text-muted-foreground">
                                  {t('dashboard.weakTopicsSubtitle')}
                                </p>
                              </div>
                            </div>
                            {weakTopicsData.weakTopics.length > 0 && (
                              <p className="text-xs font-medium text-amber-500">
                                {weakTopicsData.weakTopics.map((tTopic, idx) => (
                                  <span key={tTopic.topic}>
                                    {idx > 0 && ', '}
                                    {tTopic.topic}
                                  </span>
                                ))}
                              </p>
                            )}
                          </div>

                          <div className="space-y-2">
                            {weakTopicsData.topics.slice(0, 5).map((tTopic) => {
                              const percentage = Math.round(tTopic.accuracy * 100);
                              const isWeak = weakTopicsData.weakTopics.some(w => w.topic === tTopic.topic);
                              return (
                                <div key={tTopic.topic} className="text-xs">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="font-medium truncate mr-2">{tTopic.topic}</span>
                                    <span className={`font-semibold ${
                                      isWeak ? 'text-red-500' : percentage >= 90 ? 'text-green-500' : 'text-amber-500'
                                    }`}>
                                      {tTopic.correct}/{tTopic.totalQuestions} ({percentage}%)
                                    </span>
                                  </div>
                                  <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                                    <div
                                      className={`h-2 rounded-full transition-all ${
                                        isWeak
                                          ? 'bg-red-500/80'
                                          : percentage >= 90
                                          ? 'bg-green-500/80'
                                          : 'bg-amber-500/80'
                                      }`}
                                      style={{ width: `${Math.max(8, percentage)}%` }}
                                    />
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {weakTopicsData.topics.length > 0 && (() => {
                            const strongTopics = weakTopicsData.topics
                              .filter((tTopic) => tTopic.totalQuestions >= 2 && tTopic.accuracy >= 0.8)
                              .sort((a, b) => b.accuracy - a.accuracy)
                              .slice(0, 3);

                            if (strongTopics.length === 0) return null;

                            return (
                              <div className="pt-3 mt-2 border-t border-border/40">
                                <p className="text-[11px] font-semibold text-muted-foreground mb-1">
                                  {t('dashboard.strongTopicsTitle')}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {strongTopics.map((tTopic) => (
                                    <span
                                      key={tTopic.topic}
                                      className="inline-flex items-center rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-[11px] text-emerald-600"
                                    >
                                      {tTopic.topic}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            );
                          })()}

                          {categories.length > 0 && (
                            <div className="pt-3 mt-2 border-t border-border/40 flex flex-wrap gap-2">
                              {categories.slice(0, 4).map((cat) => (
                                <Button
                                  key={cat}
                                  size="sm"
                                  variant="outline"
                                  asChild
                                  className="text-xs px-3 py-1"
                                >
                                  <Link href={`/test/${cat.toLowerCase()}/personalized`}>
                                    {t('test.personalizedName')} · {cat}
                                  </Link>
                                </Button>
                              ))}
                            </div>
                          )}
                        </div>
                      </GlassCard>
                    </motion.div>
                  )}

                  {/* Weekly progress chart stacked below weak topics */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.52 }}
                  >
                    <GlassCard className="p-6 border border-border/80 bg-black/80">
                      <div className="mb-6 space-y-2">
                        <div className="h-1 w-16 rounded-full bg-gradient-to-r from-orange-500 to-amber-300" />
                        <div>
                          <h2 className="text-lg font-semibold mb-1">{t('dashboard.weeklyProgress')}</h2>
                          <p className="text-sm text-muted-foreground">{t('dashboard.weeklyProgressDesc')}</p>
                        </div>
                      </div>
                      <div className="relative w-full h-60">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={progressData} margin={{ top: 8, left: -20, right: 10 }}>
                            <CartesianGrid
                              stroke="#27272a"
                              strokeDasharray="3 3"
                              vertical={false}
                            />
                            <XAxis
                              dataKey="date"
                              tickLine={false}
                              axisLine={false}
                              tick={{ fill: "#a1a1aa", fontSize: 10 }}
                            />
                            <YAxis
                              tickLine={false}
                              axisLine={false}
                              tick={{ fill: "#71717a", fontSize: 10 }}
                              tickFormatter={(v) => `${v}%`}
                            />
                            <Tooltip
                              cursor={{ stroke: "#3f3f46", strokeWidth: 1 }}
                              contentStyle={{
                                backgroundColor: "#020617",
                                border: "1px solid #27272a",
                                borderRadius: "0.5rem",
                                padding: "0.35rem 0.5rem",
                              }}
                              labelStyle={{ color: "#e5e5e5", fontSize: 11 }}
                              itemStyle={{ color: "#fed7aa", fontSize: 11 }}
                              formatter={(value: number) => [`${value}%`, "Score"]}
                            />
                            <Line
                              type="monotone"
                              dataKey="score"
                              stroke="#fb923c"
                              strokeWidth={2}
                              dot={{ r: 3, strokeWidth: 1, stroke: "#fde68a", fill: "#fb923c" }}
                              activeDot={{ r: 4 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </GlassCard>
                  </motion.div>
                </div>

                {/* Right column: trainer summary + history CTA */}
                <div className="space-y-8">
                  {trainerStats && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.45 }}
                    >
                      <GlassCard className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 border border-border/80 bg-black/80">
                        <div className="flex items-start gap-4 max-w-md">
                  
                          <div>
                            <h2 className="text-sm font-semibold mb-1">{t('dashboard.trainerProgressTitle')}</h2>
                            <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-muted-foreground">
                              <span>
                                {trainerStats.totalScenarios} {t('dashboard.trainerScenarios')}
                              </span>
                              <span>
                                {trainerStats.accuracy}% {t('dashboard.trainerAccuracy')}
                              </span>
                              <span>
                                {trainerStats.totalXp} {t('dashboard.trainerXp')}
                              </span>
                            </div>
                            <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-muted-foreground">
                              <span>
                                {t('dashboard.trainerBestStreak')}: {trainerStats.bestStreak}
                              </span>
                              <span>
                                {t('dashboard.trainerCategoriesPracticed')}: {trainerStats.categoriesCompleted}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-stretch gap-3 w-full md:w-auto">
                          <div className="text-[11px] text-muted-foreground">
                            <span className="font-semibold block">
                              {t('dashboard.trainerAchievementsLabel')}
                            </span>
                            <span className="block mt-0.5 leading-relaxed break-words">
                              {trainerStats.totalScenarios >= 1 && t('trainer.firstSteps')}
                              {trainerStats.totalAttempts >= 20 && trainerStats.accuracy >= 80 && `, ${t('trainer.accuracyAce')}`}
                              {trainerStats.bestStreak >= 10 && `, ${t('trainer.streakMaster')}`}
                              {trainerStats.totalXp >= 500 && `, ${t('trainer.xpHunter')}`}
                              {trainerStats.categoriesCompleted >= 3 && `, ${t('trainer.categoryExplorer')}`}
                            </span>
                          </div>
                          <Button size="sm" asChild className="md:self-end w-full md:w-auto">
                            <Link href="/decision-trainer">
                              <Brain className="w-4 h-4 mr-2" />
                              {t('trainer.title')}
                            </Link>
                          </Button>
                        </div>
                      </GlassCard>
                    </motion.div>
                  )}

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <GlassCard className="p-8 border border-border/80 bg-black/80 h-full flex flex-col justify-between">
                      <div>
                        <h2 className="text-xl font-semibold mb-2">{t('dashboard.testHistoryTitle')}</h2>
                        <p className="text-sm text-muted-foreground">
                          {t('dashboard.testHistorySubtitle')}
                        </p>
                      </div>
                      <div className="mt-6">
                        <Button size="lg" asChild className="shadow-lg shadow-primary/20 w-full">
                          <Link href="/history">
                            <History className="w-4 h-4 mr-2" />
                            {t('dashboard.viewHistoryCta')}
                          </Link>
                        </Button>
                      </div>
                    </GlassCard>
                  </motion.div>
                </div>
              </div>

              {/* Pass Rate + practice shortcuts row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                {/* Pass Rate Pie Chart */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <GlassCard className="p-6 border border-border/80 bg-black/80 h-full flex flex-col">
                    <div className="mb-6 space-y-2">
                      <div className="h-1 w-16 rounded-full bg-gradient-to-r from-orange-500 to-amber-300" />
                      <div>
                        <h2 className="text-lg font-semibold mb-1">{t('dashboard.passRate')}</h2>
                        <p className="text-sm text-muted-foreground">{t('dashboard.passRateDesc')}</p>
                      </div>
                    </div>
                    <div className="relative w-full h-60">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: t('dashboard.passed'), value: stats.passedTests, color: 'hsl(var(--primary))' },
                              { name: t('dashboard.failed'), value: stats.failedTests, color: 'hsl(var(--destructive))' }
                            ]}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={90}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            <Cell fill="hsl(var(--primary))" />
                            <Cell fill="hsl(var(--destructive))" />
                          </Pie>
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'hsl(var(--card))', 
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '12px',
                              padding: '8px 12px'
                            }}
                            labelStyle={{ color: '#fff' }}
                            itemStyle={{ color: '#fff' }}
                            formatter={(value: number) => [`${value}`, 'Count']}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex justify-center gap-6 mt-4">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-primary" />
                        <span className="text-sm font-medium">{t('dashboard.passed')} ({Math.round((stats.passedTests / stats.totalTests) * 100)}%)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-destructive" />
                        <span className="text-sm font-medium">{t('dashboard.failed')} ({Math.round((stats.failedTests / stats.totalTests) * 100)}%)</span>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>

                {/* Practice shortcuts / quick access */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.68 }}
                >
                  <GlassCard className="p-6 border border-border/80 bg-black/80 h-full flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-black/60 px-2.5 py-0.5 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                        <span className="h-1 w-6 rounded-full bg-gradient-to-r from-orange-500 to-amber-300" />
                        <span>{t('dashboard.onboardingTitle')}</span>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {t('dashboard.onboardingSubtitle')}
                        </p>
                      </div>
                    </div>
                    <div className="mt-5 flex flex-col gap-3 text-sm">
                      <Button asChild className="flex shadow-sm justify-between">
                        <Link href="/materials">
                          <span>{t('materials.title')}</span>
                        </Link>
                      </Button>
                      <Button asChild variant="outline" className="flex shadow-sm justify-between">
                        <Link href="/decision-trainer">
                          <span>{t('trainer.title')}</span>
                        </Link>
                      </Button>
                      <Button asChild variant="outline" className="flex shadow-sm justify-between">
                        <Link href="/category">
                          <span>{t('categories.title')}</span>
                        </Link>
                      </Button>
                    </div>
                  </GlassCard>
                </motion.div>
              </div>
            </>
          ) : (
            <>
              {/* When user has no data yet: onboarding + trainer in a similar 2/3 + 1/3 layout */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-12">
                <div className="xl:col-span-2 space-y-8">
                  {/* Empty State / Onboarding for new users */}
                  <GlassCard className="p-7 md:p-8 border border-border/80 bg-black/80 relative overflow-hidden">
                    <div className="pointer-events-none absolute -right-24 -top-24 h-40 w-40 rounded-full bg-primary/20 blur-3xl opacity-60" />
                    <div className="relative flex flex-col lg:flex-row gap-6 lg:gap-8 items-start lg:items-center">
                      <div className="flex-1 space-y-4">
                        <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-black/60 px-2.5 py-0.5 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                          <span className="h-1 w-6 rounded-full bg-gradient-to-r from-orange-500 to-amber-300" />
                          <span>{t('dashboard.onboardingTitle')}</span>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="mt-1 hidden sm:block">
                            <Trophy className="w-8 h-8 text-primary" />
                          </div>
                          <div className="space-y-2">
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {t('dashboard.onboardingSubtitle')}
                            </p>
                            <ul className="space-y-1.5 text-sm text-muted-foreground">
                              <li className="flex items-start gap-2">
                                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                <span>{t('dashboard.onboardingStep1')}</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-orange-400" />
                                <span>{t('dashboard.onboardingStep2')}</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-sky-400" />
                                <span>{t('dashboard.onboardingStep3')}</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-3 w-full lg:w-auto text-sm">
                        <Button asChild className="flex shadow-sm justify-between">
                          <Link href="/materials">
                            <span>{t('materials.title')}</span>
                          </Link>
                        </Button>
                        <Button asChild variant="outline" className="flex shadow-sm justify-between">
                          <Link href="/decision-trainer">
                            <span>{t('trainer.title')}</span>
                          </Link>
                        </Button>
                        <Button asChild variant="outline" className="flex shadow-sm justify-between">
                          <Link href="/category">
                            <span>{t('categories.title')}</span>
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </GlassCard>
                </div>

                <div className="space-y-8">
                  {trainerStats && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.45 }}
                    >
                      <GlassCard className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-border/80 bg-black/80 h-full">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Brain className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h2 className="text-sm font-semibold mb-1">{t('dashboard.trainerProgressTitle')}</h2>
                            <p className="text-xs text-muted-foreground">
                              {trainerStats.totalScenarios} {t('dashboard.trainerScenarios')} · {trainerStats.accuracy}% {t('dashboard.trainerAccuracy')} · {trainerStats.totalXp} {t('dashboard.trainerXp')}
                            </p>
                            <p className="text-[11px] text-muted-foreground mt-1">
                              {t('dashboard.trainerBestStreak')}: {trainerStats.bestStreak} · {t('dashboard.trainerCategoriesPracticed')}: {trainerStats.categoriesCompleted}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col items-stretch gap-2 w-full md:w-auto">
                          <div className="flex gap-2 text-[11px] text-muted-foreground">
                            <span className="font-semibold">{t('dashboard.trainerAchievementsLabel')}</span>
                            <span>
                              {trainerStats.totalScenarios >= 1 && t('trainer.firstSteps')}
                              {trainerStats.totalAttempts >= 20 && trainerStats.accuracy >= 80 && `, ${t('trainer.accuracyAce')}`}
                              {trainerStats.bestStreak >= 10 && `, ${t('trainer.streakMaster')}`}
                              {trainerStats.totalXp >= 500 && `, ${t('trainer.xpHunter')}`}
                              {trainerStats.categoriesCompleted >= 3 && `, ${t('trainer.categoryExplorer')}`}
                            </span>
                          </div>
                          <Button size="sm" asChild className="md:self-end w-full md:w-auto">
                            <Link href="/decision-trainer">
                              <Brain className="w-4 h-4 mr-2" />
                              {t('trainer.title')}
                            </Link>
                          </Button>
                        </div>
                      </GlassCard>
                    </motion.div>
                  )}
                </div>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
