'use client';

import { useEffect, useState } from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CATEGORY_INFO, type LicenseCategory } from '@/types/database';
import { Trophy, Target, Award, Zap, Play, CheckCircle, XCircle, Eye } from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useLanguage } from '@/contexts/language-context';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export default function DashboardPage() {
  const { t } = useLanguage();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTests: 0,
    averageScore: 0,
    bestScore: 0,
    testsThisWeek: 0,
    streak: 0,
    passedTests: 0,
    failedTests: 0,
  });
  const [progressData, setProgressData] = useState<any[]>([]);
  const [recentTests, setRecentTests] = useState<any[]>([]);
  const [selectedTest, setSelectedTest] = useState<any>(null);
  const [testDetails, setTestDetails] = useState<any>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const fetchTestDetails = async (testId: string) => {
    setLoadingDetails(true);
    try {
      // Fetch test attempt answers
      const { data: answers, error } = await supabase
        .from('test_attempt_answers')
        .select('*')
        .eq('test_attempt_id', testId);

      if (error) {
        console.error('Error fetching test details:', error);
        return;
      }

      if (!answers || answers.length === 0) {
        setTestDetails([]);
        return;
      }

      // Fetch question details separately from admin_questions
      const questionIds = answers.map(a => a.question_id);
      const { data: questions, error: questionsError } = await supabase
        .from('admin_questions')
        .select('*')
        .in('id', questionIds);

      if (questionsError) {
        console.error('Error fetching questions:', questionsError);
        setTestDetails(answers);
        return;
      }

      // Merge answers with question details
      const detailedAnswers = answers.map(answer => {
        const question = questions?.find(q => q.id === answer.question_id);
        return {
          ...answer,
          question: question || null,
        };
      });

      setTestDetails(detailedAnswers);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoadingDetails(false);
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setUser(user);

      // Ensure user profile exists
      const { data: existingProfile } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('id', user.id)
        .maybeSingle();

      if (!existingProfile) {
        // Create profile if it doesn't exist
        await supabase.from('user_profiles').insert({
          id: user.id,
          email: user.email || '',
          full_name: user.user_metadata?.full_name || '',
        });
      }

      // Fetch test attempts
      const { data: attempts, error } = await supabase
        .from('test_attempts')
        .select('*')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false });

      if (error) {
        console.error('❌ ERROR FETCHING TEST ATTEMPTS');
        console.error('Error:', error);
        
        if (error.code === '42P01') {
          alert('⚠️ Database tables missing!\n\nRun database.sql in Supabase SQL Editor.');
        }
        
        // Show empty state
        setStats({ 
          totalTests: 0, 
          averageScore: 0, 
          bestScore: 0, 
          testsThisWeek: 0,
          streak: 0,
          passedTests: 0, 
          failedTests: 0 
        });
        setProgressData([]);
        setRecentTests([]);
        setLoading(false);
        return;
      }

      if (attempts && attempts.length > 0) {
        // Calculate stats
        const totalTests = attempts.length;
        const totalScore = attempts.reduce((sum, test) => sum + test.percentage, 0);
        const averageScore = Math.round(totalScore / totalTests);
        const bestScore = Math.max(...attempts.map(test => test.percentage));
        const passedTests = attempts.filter(test => test.percentage >= 80).length;
        const failedTests = totalTests - passedTests;

        // Calculate tests this week
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const testsThisWeek = attempts.filter(test => 
          new Date(test.completed_at) >= oneWeekAgo
        ).length;

        // Calculate streak (consecutive days with tests)
        const testDates = attempts.map(test => 
          new Date(test.completed_at).toDateString()
        );
        const uniqueDates = [...new Set(testDates)].sort((a, b) => 
          new Date(b).getTime() - new Date(a).getTime()
        );
        
        let streak = 0;
        const today = new Date().toDateString();
        if (uniqueDates[0] === today || uniqueDates[0] === new Date(Date.now() - 86400000).toDateString()) {
          streak = 1;
          for (let i = 1; i < uniqueDates.length; i++) {
            const prevDate = new Date(uniqueDates[i - 1]);
            const currDate = new Date(uniqueDates[i]);
            const diffDays = Math.floor((prevDate.getTime() - currDate.getTime()) / 86400000);
            if (diffDays === 1) {
              streak++;
            } else {
              break;
            }
          }
        }

        setStats({
          totalTests,
          averageScore,
          bestScore,
          testsThisWeek,
          streak,
          passedTests,
          failedTests,
        });

        // Prepare progress data (last 7 days)
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const dateStr = date.toDateString();
          const dayTests = attempts.filter(test => 
            new Date(test.completed_at).toDateString() === dateStr
          );
          const avgScore = dayTests.length > 0
            ? Math.round(dayTests.reduce((sum, test) => sum + test.percentage, 0) / dayTests.length)
            : 0;
          
          last7Days.push({
            date: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()],
            score: avgScore,
          });
        }
        setProgressData(last7Days);

        // Prepare recent tests (last 4)
        const recent = attempts.slice(0, 4).map(test => ({
          id: test.id,
          category: test.category,
          testNumber: test.test_number || '1', // Get from database
          score: test.percentage,
          date: new Date(test.completed_at).toLocaleDateString(),
          passed: test.percentage >= 80,
        }));
        setRecentTests(recent);
      }

      setLoading(false);
    };

    fetchDashboardData();
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

  const categories = Object.keys(CATEGORY_INFO) as LicenseCategory[];

  // Show empty state if no tests taken yet
  const hasData = stats.totalTests > 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="container mx-auto px-8 py-12 max-w-7xl"
      >
        {/* Header */}
        <div className="mb-12 space-y-3">
          <h1 className="text-3xl font-bold">
            {t('dashboard.welcome')}, <span className="text-primary">{user?.email?.split('@')[0]}</span>
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

        {/* Recent Tests */}
        {hasData && recentTests.length > 0 && (
          <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mb-12"
        >
          <GlassCard className="p-8">
            <h2 className="text-xl font-semibold mb-6">{t('dashboard.recentTests')}</h2>
            <div className="space-y-4">
              {recentTests.map((test) => (
                <div
                  key={test.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      test.passed ? 'bg-green-500/10' : 'bg-red-500/10'
                    }`}>
                      {test.passed ? (
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">
                        Category {test.category} - {
                          test.testNumber === 'mixed' ? 'Mixed Test' : 
                          test.testNumber === 'personalized' ? 'Personalized Test' :
                          `Test #${test.testNumber}`
                        }
                      </p>
                      <p className="text-sm text-muted-foreground">{test.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className={`text-2xl font-bold ${test.passed ? 'text-green-500' : 'text-red-500'}`}>
                      {test.score}%
                    </p>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedTest(test);
                            fetchTestDetails(test.id);
                          }}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Review
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Test Review - Category {test.category}</DialogTitle>
                          <DialogDescription>
                            Score: {test.score}% - {test.passed ? 'Passed' : 'Failed'} - {test.date}
                          </DialogDescription>
                        </DialogHeader>
                        {loadingDetails ? (
                          <div className="flex items-center justify-center py-8">
                            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                          </div>
                        ) : testDetails && testDetails.length > 0 ? (
                          <div className="space-y-4 mt-4">
                            {testDetails.map((answer: any, index: number) => (
                              <div
                                key={answer.id}
                                className={`p-4 rounded-xl border ${
                                  answer.is_correct
                                    ? 'border-green-500/20 bg-green-500/5'
                                    : 'border-red-500/20 bg-red-500/5'
                                }`}
                              >
                                <div className="flex items-start gap-3 mb-3">
                                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                    answer.is_correct ? 'bg-green-500/20' : 'bg-red-500/20'
                                  }`}>
                                    {answer.is_correct ? (
                                      <CheckCircle className="w-5 h-5 text-green-500" />
                                    ) : (
                                      <XCircle className="w-5 h-5 text-red-500" />
                                    )}
                                  </div>
                                  <div className="flex-1">
                                    <p className="font-medium mb-2">Question {index + 1}</p>
                                    <p className="text-sm mb-3">{answer.question?.question_text || 'Question not found'}</p>
                                    {answer.question?.image_url && (
                                      <img 
                                        src={answer.question.image_url} 
                                        alt="Question" 
                                        className="w-full max-w-sm rounded-lg mb-3 border border-border"
                                      />
                                    )}
                                    <div className="space-y-2">
                                      {['A', 'B', 'C'].map((option) => {
                                        const isCorrect = answer.question?.correct_answer === option;
                                        const isSelected = answer.selected_answer === option;
                                        const optionText = answer.question?.[`option_${option.toLowerCase()}`];
                                        
                                        return (
                                          <div 
                                            key={option}
                                            className={`p-3 rounded-lg text-sm border ${
                                              isCorrect
                                                ? 'bg-green-500/10 border-green-500/30'
                                                : isSelected && !isCorrect
                                                ? 'bg-red-500/10 border-red-500/30'
                                                : 'bg-muted/50 border-transparent'
                                            }`}
                                          >
                                            <div className="flex items-center gap-2">
                                              <span className="font-semibold">{option}:</span>
                                              <span className="flex-1">{optionText}</span>
                                              {isCorrect && (
                                                <span className="text-green-500 text-xs font-semibold">✓ Correct</span>
                                              )}
                                              {isSelected && !isCorrect && (
                                                <span className="text-red-500 text-xs font-semibold">✗ Your answer</span>
                                              )}
                                              {isSelected && isCorrect && (
                                                <span className="text-green-500 text-xs font-semibold">✓ Your answer</span>
                                              )}
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-center text-muted-foreground py-8">No details available</p>
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
          </motion.div>
        )}

        {/* Continue Learning */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <GlassCard className="p-8 bg-gradient-to-br from-primary/10 via-transparent to-transparent">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">{t('dashboard.quickStart')}</h2>
              <p className="text-sm text-muted-foreground">Choose a category to continue your learning journey</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {categories.slice(0, 4).map((category) => (
                <Button
                  key={category}
                  asChild
                  variant="outline"
                  className="h-auto py-6 flex-col gap-3 hover:border-primary hover:bg-primary/5 transition-all"
                >
                  <Link href={`/category/${category.toLowerCase()}`}>
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-2">
                      <Play className="w-6 h-6 text-primary" />
                    </div>
                    <span className="font-semibold">
                      {CATEGORY_INFO[category].name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Start practicing
                    </span>
                  </Link>
                </Button>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </motion.div>
    </div>
  );
}
