'use client';

import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Trophy, Target, Award, Zap, History } from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useLanguage } from '@/contexts/language-context';
import { useAuth } from '@/contexts/auth-context';
import { motion } from 'framer-motion';
import { useDashboardStats } from '@/hooks/use-test-attempts';

export default function DashboardPage() {
  const { t } = useLanguage();
  const { user, userProfile } = useAuth();
  
  // Use TanStack Query for data fetching
  const { data: dashboardData, isLoading: loading, error } = useDashboardStats(user?.id);
  
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
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

        {/* Empty State */}
        {!hasData && (
          <GlassCard className="p-12 text-center mb-12">
            <Trophy className="w-16 h-16 text-primary mx-auto mb-4 opacity-50" />
            <h2 className="text-2xl font-bold mb-2">No Tests Yet</h2>
            <p className="text-muted-foreground mb-6">
              Start taking tests to see your progress and statistics here
            </p>
            <Button asChild className="shadow-lg shadow-primary/20">
              <Link href="/">Browse Categories</Link>
            </Button>
          </GlassCard>
        )}

        {/* Stats Grid */}
        {hasData && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { icon: Trophy, label: t('dashboard.totalTests'), value: stats.totalTests, subtitle: `+${stats.testsThisWeek} ${t('dashboard.thisWeek')}`, delay: 0.1 },
              { icon: Target, label: t('dashboard.avgScore'), value: `${stats.averageScore}%`, subtitle: `${stats.averageScore >= 80 ? 'Great job!' : 'Keep practicing'}`, delay: 0.2 },
              { icon: Award, label: t('dashboard.bestScore'), value: `${stats.bestScore}%`, subtitle: t('dashboard.personalBest'), delay: 0.3 },
              { icon: Zap, label: t('dashboard.streak'), value: `${stats.streak} ${stats.streak === 1 ? 'day' : 'days'}`, subtitle: t('dashboard.keepGoing'), delay: 0.4 },
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
                      { name: 'Passed', value: stats.passedTests, color: 'hsl(var(--primary))' },
                      { name: 'Failed', value: stats.failedTests, color: 'hsl(var(--destructive))' }
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
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                  <span className="text-sm font-medium">Passed ({Math.round((stats.passedTests / stats.totalTests) * 100)}%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-destructive"></div>
                  <span className="text-sm font-medium">Failed ({Math.round((stats.failedTests / stats.totalTests) * 100)}%)</span>
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
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold mb-2">Test History</h2>
                  <p className="text-sm text-muted-foreground">
                    View all your completed tests and review your answers
                  </p>
                </div>
                <Button size="lg" asChild className="shadow-lg shadow-primary/20">
                  <Link href="/history">
                    <History className="w-4 h-4 mr-2" />
                    View History
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
