'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CATEGORY_INFO, type LicenseCategory } from '@/types/database';
import { Trophy, Target, TrendingUp, Clock, Award, Zap, Play, BarChart3 } from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useLanguage } from '@/contexts/language-context';

export default function DashboardPage() {
  const { t } = useLanguage();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setUser(user);
      setLoading(false);
    };

    getUser();
  }, [router, supabase]);

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

  // Mock data - will be replaced with real data from Supabase
  const stats = {
    totalTests: 24,
    averageScore: 87,
    bestScore: 98,
    testsThisWeek: 8,
    hoursStudied: 12.5,
    streak: 5,
  };

  const progressData = [
    { date: 'Mon', score: 75 },
    { date: 'Tue', score: 82 },
    { date: 'Wed', score: 78 },
    { date: 'Thu', score: 85 },
    { date: 'Fri', score: 90 },
    { date: 'Sat', score: 87 },
    { date: 'Sun', score: 92 },
  ];

  const categoryData = [
    { category: 'Category B', tests: 12, avgScore: 88 },
    { category: 'Category A', tests: 8, avgScore: 85 },
    { category: 'Category C', tests: 4, avgScore: 82 },
  ];

  const performanceData = [
    { name: 'Passed', value: 20, color: 'hsl(var(--primary))' },
    { name: 'Failed', value: 4, color: 'hsl(var(--destructive))' },
  ];

  const recentTests = [
    { id: 1, category: 'B', testNumber: 5, score: 92, date: '2024-11-09', passed: true },
    { id: 2, category: 'B', testNumber: 4, score: 87, date: '2024-11-08', passed: true },
    { id: 3, category: 'A', testNumber: 3, score: 85, date: '2024-11-07', passed: true },
    { id: 4, category: 'B', testNumber: 3, score: 78, date: '2024-11-06', passed: false },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-1">
            {t('dashboard.welcome')}, <span className="text-primary">{user?.email?.split('@')[0]}</span>
          </h1>
          <p className="text-sm text-muted-foreground">{t('dashboard.subtitle')}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <Card className="border-primary/20 bg-gradient-to-br from-card to-card/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-4">
              <CardTitle className="text-xs font-medium">{t('dashboard.totalTests')}</CardTitle>
              <Trophy className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="text-2xl font-bold">{stats.totalTests}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-primary">+{stats.testsThisWeek}</span> {t('dashboard.thisWeek')}
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-gradient-to-br from-card to-card/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-4">
              <CardTitle className="text-xs font-medium">{t('dashboard.avgScore')}</CardTitle>
              <Target className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="text-2xl font-bold">{stats.averageScore}%</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-primary">+5%</span> {t('dashboard.lastWeek')}
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-gradient-to-br from-card to-card/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-4">
              <CardTitle className="text-xs font-medium">{t('dashboard.bestScore')}</CardTitle>
              <Award className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="text-2xl font-bold">{stats.bestScore}%</div>
              <p className="text-xs text-muted-foreground">
                {t('dashboard.personalBest')}
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-gradient-to-br from-card to-card/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-4">
              <CardTitle className="text-xs font-medium">{t('dashboard.streak')}</CardTitle>
              <Zap className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="text-2xl font-bold">{stats.streak} {t('dashboard.days')}</div>
              <p className="text-xs text-muted-foreground">
                {t('dashboard.keepGoing')}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          {/* Progress Chart */}
          <Card className="lg:col-span-2 border-primary/20">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">{t('dashboard.weeklyProgress')}</CardTitle>
              <CardDescription className="text-xs">{t('dashboard.weeklyProgressDesc')}</CardDescription>
            </CardHeader>
            <CardContent className="pb-4">
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--primary))', r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Performance Pie Chart */}
          <Card className="border-primary/20">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">{t('dashboard.passRate')}</CardTitle>
              <CardDescription className="text-xs">{t('dashboard.passRateDesc')}</CardDescription>
            </CardHeader>
            <CardContent className="pb-4">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={performanceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {performanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                  <span className="text-sm">{t('dashboard.passed')} (83%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-destructive"></div>
                  <span className="text-sm">{t('dashboard.failed')} (17%)</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          {/* Category Performance */}
          <Card className="border-primary/20">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">{t('dashboard.categoryPerformance')}</CardTitle>
              <CardDescription className="text-xs">{t('dashboard.categoryPerformanceDesc')}</CardDescription>
            </CardHeader>
            <CardContent className="pb-4">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="category" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="tests" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Recent Tests */}
          <Card className="border-primary/20">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">{t('dashboard.recentTests')}</CardTitle>
              <CardDescription className="text-xs">{t('dashboard.recentTestsDesc')}</CardDescription>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="space-y-2">
                {recentTests.map((test) => (
                  <div
                    key={test.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:border-primary/50 transition-colors bg-card/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold ${
                        test.passed ? 'bg-primary/20 text-primary' : 'bg-destructive/20 text-destructive'
                      }`}>
                        {test.category}
                      </div>
                      <div>
                        <p className="font-medium">{t('test.test')} {test.testNumber}</p>
                        <p className="text-sm text-muted-foreground">{test.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-2xl font-bold ${
                        test.passed ? 'text-primary' : 'text-destructive'
                      }`}>
                        {test.score}%
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {test.passed ? t('dashboard.passed') : t('dashboard.failed')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">{t('dashboard.continuelearning')}</CardTitle>
            <CardDescription className="text-xs">{t('dashboard.pickUpWhere')}</CardDescription>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Button asChild className="h-auto py-4 flex-col gap-2 shadow-lg shadow-primary/20">
                <Link href="/category/b">
                  <Play className="w-5 h-5" />
                  <span className="text-sm">{t('dashboard.continueCategoryB')}</span>
                </Link>
              </Button>
              <Button variant="outline" asChild className="h-auto py-4 flex-col gap-2">
                <Link href="/">
                  <BarChart3 className="w-5 h-5" />
                  <span className="text-sm">{t('dashboard.browseCategories')}</span>
                </Link>
              </Button>
              <Button variant="outline" asChild className="h-auto py-4 flex-col gap-2">
                <Link href="/category/a">
                  <Target className="w-5 h-5" />
                  <span className="text-sm">{t('dashboard.startNewCategory')}</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
