'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
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

export default function DashboardPage() {
  const { t } = useLanguage();
  const { user, userProfile, loading: authLoading } = useAuth();
  const router = useRouter();
  
  // Use TanStack Query for data fetching
  const { data: dashboardData, isLoading: loading, error } = useDashboardStats(user?.id);
  const { data: trainerStats } = useDecisionTrainerStats(user?.id);
  const { data: weakTopicsData } = useWeakTopics(user?.id);
  const { data: globalStreak } = useGlobalDailyStreak(user?.id);
  
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

              <GlassCard className="p-6">
                <div className="mb-6 space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-3 w-52" />
                </div>
                <Skeleton className="h-60 w-full rounded-full" />
              </GlassCard>
            </div>

            {/* History CTA skeleton */}
            <GlassCard className="p-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
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
        {/* Header */}
        <div className="mb-12 space-y-3">
          <h1 className="text-3xl font-bold">
            {t('dashboard.welcome')}, <span className="text-primary">{userFullName || user?.email?.split('@')[0]}</span>
          </h1>
          <p className="text-sm text-muted-foreground">{t('dashboard.subtitle')}</p>
        </div>

        {/* Empty State / Onboarding for new users */}
        {!hasData && (
          <GlassCard className="p-10 mb-12">
            <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <Trophy className="w-10 h-10 text-primary" />
                  <h2 className="text-2xl font-bold">
                    {t('dashboard.onboardingTitle')}
                  </h2>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  {t('dashboard.onboardingSubtitle')}
                </p>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>{t('dashboard.onboardingStep1')}</p>
                  <p>{t('dashboard.onboardingStep2')}</p>
                  <p>{t('dashboard.onboardingStep3')}</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                <Button asChild className="flex-1 shadow-sm">
                  <Link href="/materials">
                    {t('materials.title')}
                  </Link>
                </Button>
                <Button asChild variant="outline" className="flex-1 shadow-sm">
                  <Link href="/decision-trainer">
                    {t('trainer.title')}
                  </Link>
                </Button>
                <Button asChild variant="outline" className="flex-1 shadow-sm">
                  <Link href="/">
                    {t('categories.title')}
                  </Link>
                </Button>
              </div>
            </div>
          </GlassCard>
        )}

        {/* Overall weak topics across all tests */}
        {hasData && weakTopicsData && weakTopicsData.topics.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.48 }}
            className="mb-12"
          >
            <GlassCard className="p-6 max-w-3xl">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold mb-1">{t('dashboard.weakTopicsTitle')}</h2>
                    <p className="text-sm text-muted-foreground">
                      {t('dashboard.weakTopicsSubtitle')}
                    </p>
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
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Stats Grid */}
        {hasData && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { icon: Trophy, label: t('dashboard.totalTests'), value: stats.totalTests, subtitle: `+${stats.testsThisWeek} ${t('dashboard.thisWeek')}`, delay: 0.1 },
              { icon: Target, label: t('dashboard.avgScore'), value: `${stats.averageScore}%`, subtitle: stats.averageScore >= 80 ? t('dashboard.avgScoreHighSubtitle') : t('dashboard.avgScoreLowSubtitle'), delay: 0.2 },
              { icon: Award, label: t('dashboard.bestScore'), value: `${stats.bestScore}%`, subtitle: t('dashboard.personalBest'), delay: 0.3 },
              { icon: Zap, label: t('dashboard.streak'), value: `${globalStreak?.currentStreak ?? 0} ${t('dashboard.days')}`, subtitle: t('dashboard.streakSubtitle'), delay: 0.4 },
            ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: stat.delay }}
            >
              <GlassCard className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
                <p className="text-2xl font-bold mb-1">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
              </GlassCard>
            </motion.div>
          ))}
          </div>
        )}

        {/* Decision Trainer Summary */}
        {trainerStats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="mb-12"
          >
            <GlassCard className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
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

        {hasData && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Progress Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-2"
          >
            <GlassCard className="p-6">
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-1">{t('dashboard.weeklyProgress')}</h2>
                <p className="text-sm text-muted-foreground">{t('dashboard.weeklyProgressDesc')}</p>
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis 
                    dataKey="date" 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={12}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '12px',
                      padding: '8px 12px'
                    }}
                    labelStyle={{ color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--primary))', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </GlassCard>
          </motion.div>

          {/* Pass Rate Pie Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <GlassCard className="p-6">
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-1">{t('dashboard.passRate')}</h2>
                <p className="text-sm text-muted-foreground">{t('dashboard.passRateDesc')}</p>
              </div>
              <ResponsiveContainer width="100%" height={240}>
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
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                  <span className="text-sm font-medium">{t('dashboard.passed')} ({Math.round((stats.passedTests / stats.totalTests) * 100)}%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-destructive"></div>
                  <span className="text-sm font-medium">{t('dashboard.failed')} ({Math.round((stats.failedTests / stats.totalTests) * 100)}%)</span>
                </div>
              </div>
            </GlassCard>
          </motion.div>
          </div>
        )}

        {/* View History Button */}
        {hasData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mb-12"
          >
            <GlassCard className="p-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold mb-2">{t('dashboard.testHistoryTitle')}</h2>
                  <p className="text-sm text-muted-foreground">
                    {t('dashboard.testHistorySubtitle')}
                  </p>
                </div>
                <Button size="lg" asChild className="shadow-lg shadow-primary/20 w-full sm:w-auto">
                  <Link href="/history">
                    <History className="w-4 h-4 mr-2" />
                    {t('dashboard.viewHistoryCta')}
                  </Link>
                </Button>
              </div>
            </GlassCard>
          </motion.div>
        )}

      </motion.div>
      </motion.div>
    </div>
  );
}
