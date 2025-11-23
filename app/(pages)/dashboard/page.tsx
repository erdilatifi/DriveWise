'use client';

import { useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Trophy, Target, Zap, History, Brain, Activity, TrendingUp, AlertCircle, ArrowRight } from 'lucide-react';
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
  const { t, language } = useLanguage();
  const isSq = language === 'sq';
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

  // Show skeleton loader if no user (even during loading) to prevent empty dashboard flash
  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32">
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
          </div>
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
        <div className="pt-32">
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

            {/* Charts skeleton matching actual layout (Wide, Narrow, Narrow, Wide) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 auto-rows-fr mb-12">
              {/* Weekly Progress Skeleton (Wide) */}
              <GlassCard className="p-6 lg:col-span-2">
                <div className="mb-6 space-y-2">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-3 w-64" />
                </div>
                <Skeleton className="h-60 w-full rounded-xl" />
              </GlassCard>

              {/* Trainer Stats Skeleton (Narrow) */}
              <GlassCard className="p-6 lg:col-span-1 flex flex-col gap-6">
                <div className="flex justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                  <Skeleton className="h-8 w-8 rounded-lg" />
                </div>
                <div className="grid grid-cols-2 gap-3 flex-1">
                  <Skeleton className="h-20 w-full rounded-xl" />
                  <Skeleton className="h-20 w-full rounded-xl" />
                  <Skeleton className="h-20 w-full rounded-xl" />
                  <Skeleton className="h-20 w-full rounded-xl" />
                </div>
                <Skeleton className="h-10 w-full mt-auto" />
              </GlassCard>

              {/* Quick Access Skeleton (Narrow) */}
              <GlassCard className="p-6 lg:col-span-1 flex flex-col justify-between">
                <div className="space-y-4">
                  <Skeleton className="h-6 w-24 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-3 w-full" />
                  </div>
                </div>
                <div className="space-y-3 mt-8">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              </GlassCard>

              {/* Pass Rate Skeleton (Wide) */}
              <GlassCard className="p-6 lg:col-span-2">
                <div className="mb-6 space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-3 w-52" />
                </div>
                <div className="flex items-center justify-center h-60">
                  <Skeleton className="h-48 w-48 rounded-full" />
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show empty state if no tests taken yet
  const hasData = stats.totalTests > 0;

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-hidden">
      {/* Background grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(60%_60%_at_50%_20%,#000_20%,transparent_70%)]"
      >
        <svg className="h-full w-full opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dashboard-grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M32 0H0V32" fill="none" stroke="currentColor" strokeWidth="0.4" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dashboard-grid)" />
        </svg>
      </div>

      {/* Warm glows & rails */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-orange-500/25 via-transparent to-transparent blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="hidden lg:block absolute top-24 bottom-24 left-[10%] w-px bg-gradient-to-b from-transparent via-orange-500/25 to-transparent" />
        <div className="hidden lg:block absolute top-24 bottom-24 right-[10%] w-px bg-gradient-to-b from-transparent via-orange-500/25 to-transparent" />
      </div>

      <Navbar />

      <motion.div className="pt-32 pb-16">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="container mx-auto px-8 max-w-7xl relative"
        >
          {/* Hero snapshot */}
          <div className="mb-10 relative">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/40 bg-orange-500/10 px-3 py-1 text-[11px] font-medium text-orange-300">
                  <Activity className="w-3.5 h-3.5" />
                  <span>{isSq ? 'Paneli kryesor' : 'Dashboard'}</span>
                </div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight">
                  {isSq ? 'Progresi yt' : 'Your progress'}
                </h1>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  {isSq 
                    ? 'Shiko nëse je gati për provim dhe ku duhet të fokusohesh.'
                    : 'See if you’re exam-ready and where to focus next.'}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 w-full md:w-auto">
                <GlassCard className="p-3 flex flex-col gap-1 min-w-[100px] border-border/60 bg-black/40">
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1.5 uppercase tracking-wider">
                    <Target className="w-3 h-3 text-orange-400" />
                    {t('dashboard.avgScore')}
                  </span>
                  <span className="text-xl font-bold text-foreground">
                    {stats.averageScore}%
                  </span>
                  <div className="h-1 rounded-full bg-white/10 overflow-hidden w-full mt-auto">
                    <div className="h-full bg-gradient-to-r from-orange-500 to-amber-300" style={{ width: `${stats.averageScore}%` }} />
                  </div>
                </GlassCard>
                
                <GlassCard className="p-3 flex flex-col gap-1 min-w-[100px] border-border/60 bg-black/40">
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1.5 uppercase tracking-wider">
                    <Trophy className="w-3 h-3 text-orange-400" />
                    {t('dashboard.totalTests')}
                  </span>
                  <span className="text-xl font-bold text-foreground">
                    {stats.totalTests}
                  </span>
                  <div className="h-1 rounded-full bg-white/10 overflow-hidden w-full mt-auto">
                    <div className="h-full bg-gradient-to-r from-orange-500 to-amber-300" style={{ width: `${Math.min((stats.totalTests / 50) * 100, 100)}%` }} />
                  </div>
                </GlassCard>

                <GlassCard className="p-3 flex flex-col gap-1 min-w-[100px] border-border/60 bg-black/40">
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1.5 uppercase tracking-wider">
                    <Zap className="w-3 h-3 text-orange-400" />
                    {t('dashboard.streak')}
                  </span>
                  <span className="text-xl font-bold text-foreground">
                    {(globalStreak?.currentStreak ?? 0)}
                  </span>
                  <div className="h-1 rounded-full bg-white/10 overflow-hidden w-full mt-auto">
                    <div className="h-full bg-gradient-to-r from-orange-500 to-amber-300" style={{ width: `${Math.min(((globalStreak?.currentStreak ?? 0) / 7) * 100, 100)}%` }} />
                  </div>
                </GlassCard>
              </div>
            </div>
          </div>

          {/* Section divider */}
          <div className="h-px w-full bg-gradient-to-r from-transparent via-orange-500/20 to-transparent mb-10" />

          {/* === MAIN GRID LAYOUT === */}
          {hasData ? (
            <div className="space-y-8">
              {/* Weak topics - Full Width */}
              {weakTopicsData && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <GlassCard className="p-6 md:p-8 border border-border/80 bg-black/85">
                    <div className="flex flex-col gap-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h2 className="text-lg font-semibold flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-orange-400" />
                            {t('dashboard.weakTopicsTitle')}
                          </h2>
                          <p className="text-sm text-muted-foreground">
                            {t('dashboard.weakTopicsSubtitle')}
                          </p>
                        </div>
                        {weakTopicsData.weakTopics.length > 0 && (
                          <Button variant="outline" size="sm" className="text-xs h-8 border-orange-500/30 text-orange-300 hover:bg-orange-500/10" asChild>
                            <Link href={`/test/${(categories[0] || 'B').toLowerCase()}/personalized`}>
                              {isSq ? 'Ushtro pikat e dobëta' : 'Practice weak topics'}
                            </Link>
                          </Button>
                        )}
                      </div>

                      {weakTopicsData.topics.length > 0 ? (
                        <div className="space-y-4">
                          {weakTopicsData.topics.slice(0, 5).map((tTopic) => {
                            const percentage = Math.round(tTopic.accuracy * 100);
                            const isWeak = weakTopicsData.weakTopics.some(w => w.topic === tTopic.topic);
                            return (
                              <div key={tTopic.topic} className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="font-medium">{tTopic.topic}</span>
                                  <span className={`font-semibold ${
                                    isWeak ? 'text-red-400' : percentage >= 90 ? 'text-emerald-400' : 'text-orange-300'
                                  }`}>
                                    {percentage}%
                                  </span>
                                </div>
                                <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                                  <div
                                    className={`h-full rounded-full transition-all duration-500 ${
                                      isWeak
                                        ? 'bg-red-500/80'
                                        : percentage >= 90
                                        ? 'bg-emerald-500/80'
                                        : 'bg-orange-400/80'
                                    }`}
                                    style={{ width: `${Math.max(5, percentage)}%` }}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="py-12 text-center text-sm text-muted-foreground bg-white/5 rounded-xl border border-white/5 border-dashed">
                          <p>No topic data available yet. Take some tests to identify your weak areas!</p>
                        </div>
                      )}

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

              {/* The 4 Main Cards Grid (Same Height, Different Widths) */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 auto-rows-fr">
                {/* Weekly progress chart (Longer - 2 cols) */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="h-full lg:col-span-2"
                >
                  <GlassCard className="p-6 md:p-8 border border-border/80 bg-black/85 h-full flex flex-col">
                    <div className="mb-8 space-y-1">
                      <h2 className="text-lg font-semibold flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-orange-400" />
                        {t('dashboard.weeklyProgress')}
                      </h2>
                      <p className="text-sm text-muted-foreground">{t('dashboard.weeklyProgressDesc')}</p>
                    </div>
                    <div className="relative w-full flex-1 min-h-[250px]">
                      {progressData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={progressData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                              <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid
                              stroke="#ffffff10"
                              strokeDasharray="3 3"
                              vertical={false}
                            />
                            <XAxis
                              dataKey="date"
                              tickLine={false}
                              axisLine={false}
                              tick={{ fill: "#a1a1aa", fontSize: 11 }}
                              dy={10}
                            />
                            <YAxis
                              tickLine={false}
                              axisLine={false}
                              tick={{ fill: "#a1a1aa", fontSize: 11 }}
                              tickFormatter={(v) => `${v}%`}
                            />
                            <Tooltip
                              cursor={{ stroke: "#ffffff20", strokeWidth: 1 }}
                              contentStyle={{
                                backgroundColor: "#09090b",
                                border: "1px solid #27272a",
                                borderRadius: "0.75rem",
                                padding: "0.5rem 0.75rem",
                                boxShadow: "0 10px 30px -10px rgba(0,0,0,0.5)"
                              }}
                              labelStyle={{ color: "#e5e5e5", fontSize: 12, marginBottom: 4 }}
                              itemStyle={{ color: "#fdba74", fontSize: 12, fontWeight: 600 }}
                              formatter={(value: number) => [`${value}%`, "Score"]}
                            />
                            <Line
                              type="monotone"
                              dataKey="score"
                              stroke="#f97316"
                              strokeWidth={3}
                              dot={{ r: 4, strokeWidth: 2, stroke: "#000", fill: "#f97316" }}
                              activeDot={{ r: 6, strokeWidth: 0, fill: "#fff" }}
                              fill="url(#colorScore)"
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="flex items-center justify-center h-full text-sm text-muted-foreground bg-white/5 rounded-xl border border-white/5 border-dashed">
                          No progress data available for this week.
                        </div>
                      )}
                    </div>
                  </GlassCard>
                </motion.div>

                {/* Trainer summary (Shorter - 1 col) */}
                {trainerStats && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="h-full lg:col-span-1"
                  >
                    <GlassCard className="p-6 md:p-8 border border-border/80 bg-black/85 h-full flex flex-col gap-6 min-h-[360px]">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h2 className="text-lg font-semibold flex items-center gap-2">
                            <Brain className="w-5 h-5 text-orange-400" />
                            {t('dashboard.trainerProgressTitle')}
                          </h2>
                          <p className="text-sm text-muted-foreground">
                            {t('dashboard.trainerAccuracy')}: <span className="text-foreground font-medium">{trainerStats.accuracy}%</span>
                          </p>
                        </div>
                        <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400">
                          <Zap className="w-5 h-5" />
                        </div>
                      </div>

                      <div className="flex flex-col gap-4 flex-1">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                            <p className="text-xs text-muted-foreground mb-1">{t('dashboard.trainerScenarios')}</p>
                            <p className="text-xl font-bold">{trainerStats.totalScenarios}</p>
                          </div>
                          <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                            <p className="text-xs text-muted-foreground mb-1">{t('dashboard.trainerXp')}</p>
                            <p className="text-xl font-bold text-orange-300">{trainerStats.totalXp}</p>
                          </div>
                          <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                            <p className="text-xs text-muted-foreground mb-1">Best Streak</p>
                            <p className="text-xl font-bold text-emerald-400">{trainerStats.bestStreak}</p>
                          </div>
                          <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                            <p className="text-xs text-muted-foreground mb-1">Categories</p>
                            <p className="text-xl font-bold text-blue-400">{trainerStats.categoriesCompleted}</p>
                          </div>
                        </div>
                        
                        <div className="p-4 rounded-xl bg-gradient-to-br from-orange-500/10 to-transparent border border-orange-500/20 space-y-3">
                          <p className="text-xs font-medium text-orange-200 uppercase tracking-wider">
                            {t('dashboard.trainerAchievementsLabel')}
                          </p>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {trainerStats.totalScenarios >= 1 ? (
                              <>
                                {t('trainer.firstSteps')}
                                {trainerStats.totalAttempts >= 20 && trainerStats.accuracy >= 80 && `, ${t('trainer.accuracyAce')}`}
                                {trainerStats.bestStreak >= 10 && `, ${t('trainer.streakMaster')}`}
                                {trainerStats.totalXp >= 500 && `, ${t('trainer.xpHunter')}`}
                                {trainerStats.categoriesCompleted >= 3 && `, ${t('trainer.categoryExplorer')}`}
                              </>
                            ) : (
                              <span className="italic opacity-70">Start training to unlock achievements...</span>
                            )}
                          </p>
                        </div>
                      </div>

                      <Button asChild className="w-full bg-orange-600 hover:bg-orange-500 text-white border-none shadow-lg shadow-orange-500/20 mt-auto">
                        <Link href="/decision-trainer">
                          {t('trainer.title')}
                          <Brain className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>
                    </GlassCard>
                  </motion.div>
                )}

                {/* Quick access / Start your learning journey (Shorter - 1 col) */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="h-full lg:col-span-1"
                >
                  <GlassCard className="p-6 md:p-8 border border-border/80 bg-black/85 h-full flex flex-col justify-between relative overflow-hidden min-h-[360px]">
                    <div className="pointer-events-none absolute -top-24 -right-24 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl" />
                    
                    <div className="relative z-10 space-y-4">
                      <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-[11px] font-medium text-orange-300 uppercase tracking-wider">
                        <span>{t('dashboard.onboardingTitle')}</span>
                      </div>
                      <div className="space-y-2">
                        <h2 className="text-lg font-semibold">Next steps for you</h2>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {t('dashboard.onboardingSubtitle')}
                        </p>
                      </div>
                    </div>
                    
                    <div className="relative z-10 mt-8 grid gap-3">
                      <Button asChild className="h-12 justify-between bg-white/5 hover:bg-white/10 border border-white/10 text-foreground">
                        <Link href="/materials">
                          <span className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">1</span>
                            {t('materials.title')}
                          </span>
                          <Target className="w-4 h-4 opacity-50" />
                        </Link>
                      </Button>
                      <Button asChild className="h-12 justify-between bg-white/5 hover:bg-white/10 border border-white/10 text-foreground">
                        <Link href="/decision-trainer">
                          <span className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">2</span>
                            {t('trainer.title')}
                          </span>
                          <Brain className="w-4 h-4 opacity-50" />
                        </Link>
                      </Button>
                      <Button asChild className="h-12 justify-between bg-orange-600 hover:bg-orange-500 text-white border-none shadow-lg shadow-orange-500/20">
                        <Link href="/category">
                          <span className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white">3</span>
                            Category
                          </span>
                          <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center">
                            <ArrowRight className="w-3 h-3" />
                          </div>
                        </Link>
                      </Button>
                    </div>
                  </GlassCard>
                </motion.div>

                {/* Pass Rate Pie Chart (Longer - 2 cols) */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="h-full lg:col-span-2"
                >
                  <GlassCard className="p-6 md:p-8 border border-border/80 bg-black/85 h-full flex flex-col">
                    <div className="mb-6 space-y-2">
                      <h2 className="text-lg font-semibold flex items-center gap-2">
                        <Target className="w-5 h-5 text-orange-400" />
                        {t('dashboard.passRate')}
                      </h2>
                      <p className="text-sm text-muted-foreground">{t('dashboard.passRateDesc')}</p>
                    </div>
                    <div className="relative w-full flex-1 min-h-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: t('dashboard.passed'), value: stats.passedTests, color: '#10b981' }, // emerald-500
                              { name: t('dashboard.failed'), value: stats.failedTests, color: '#ef4444' }  // red-500
                            ]}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={90}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                          >
                            <Cell fill="#10b981" />
                            <Cell fill="#ef4444" />
                          </Pie>
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#09090b', 
                              border: '1px solid #27272a',
                              borderRadius: '12px',
                              padding: '8px 12px',
                              boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)'
                            }}
                            labelStyle={{ color: '#fff', fontWeight: 600 }}
                            itemStyle={{ color: '#fff' }}
                            formatter={(value: number) => [`${value}`, 'Count']}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                      {/* Center text */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="text-center">
                          <span className="text-3xl font-bold">{stats.totalTests}</span>
                          <p className="text-xs text-muted-foreground uppercase tracking-wide">Tests</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-center gap-8 mt-6">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-emerald-500" />
                        <span className="text-sm font-medium text-emerald-100">{t('dashboard.passed')} ({stats.totalTests > 0 ? Math.round((stats.passedTests / stats.totalTests) * 100) : 0}%)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <span className="text-sm font-medium text-red-100">{t('dashboard.failed')} ({stats.totalTests > 0 ? Math.round((stats.failedTests / stats.totalTests) * 100) : 0}%)</span>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              </div>

              {/* Full-width history section at the bottom */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mb-4"
              >
                <GlassCard className="p-6 md:p-8 border border-border/80 bg-black/85 relative overflow-hidden w-full">
                  <div className="pointer-events-none absolute -right-16 -bottom-16 w-48 h-48 rounded-full bg-white/5 blur-3xl" />
                  <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div className="space-y-2">
                      <h2 className="text-lg font-semibold flex items-center gap-2">
                        <History className="w-5 h-5 text-orange-400" />
                        {t('dashboard.testHistoryTitle')}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {t('dashboard.testHistorySubtitle')}
                      </p>
                    </div>
                    <Button
                      size="lg"
                      variant="outline"
                      asChild
                      className="w-full md:w-auto border-white/10 hover:bg-white/5"
                    >
                      <Link href="/history">
                        {t('dashboard.viewHistoryCta')}
                      </Link>
                    </Button>
                  </div>
                </GlassCard>
              </motion.div>
            </div>
          ) : (
            <>
              {/* When user has no data yet: onboarding + trainer in a similar 2/3 + 1/3 layout */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-12">
                <div className="xl:col-span-2 space-y-8">
                  {/* Empty State / Onboarding for new users */}
                  <GlassCard className="p-8 md:p-10 border border-border/80 bg-black/85 relative overflow-hidden">
                    <div className="pointer-events-none absolute -right-32 -top-32 h-64 w-64 rounded-full bg-orange-500/10 blur-3xl opacity-60" />
                    <div className="relative flex flex-col lg:flex-row gap-8 lg:gap-12 items-start lg:items-center">
                      <div className="flex-1 space-y-6">
                        <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-[11px] font-medium text-orange-300 uppercase tracking-wider">
                          <span>{t('dashboard.onboardingTitle')}</span>
                        </div>
                        
                        <div className="space-y-4">
                          <h2 className="text-2xl font-semibold">Get started with DriveWise</h2>
                          <p className="text-base text-muted-foreground leading-relaxed">
                            {t('dashboard.onboardingSubtitle')}
                          </p>
                          
                          <div className="space-y-3 pt-2">
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                              <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">1</div>
                              <span className="text-sm">{t('dashboard.onboardingStep1')}</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                              <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400 font-bold">2</div>
                              <span className="text-sm">{t('dashboard.onboardingStep2')}</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold">3</div>
                              <span className="text-sm">{t('dashboard.onboardingStep3')}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-3 w-full lg:w-72 text-sm bg-white/5 p-6 rounded-2xl border border-white/10">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Quick Start</p>
                        <Button asChild className="w-full justify-start bg-orange-600 hover:bg-orange-500 text-white">
                          <Link href="/materials">
                            <Target className="w-4 h-4 mr-2" />
                            <span>{t('materials.title')}</span>
                          </Link>
                        </Button>
                        <Button asChild variant="outline" className="w-full justify-start border-white/10 hover:bg-white/5">
                          <Link href="/decision-trainer">
                            <Brain className="w-4 h-4 mr-2" />
                            <span>{t('trainer.title')}</span>
                          </Link>
                        </Button>
                        <Button asChild variant="outline" className="w-full justify-start border-white/10 hover:bg-white/5">
                          <Link href="/category">
                            <Activity className="w-4 h-4 mr-2" />
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
