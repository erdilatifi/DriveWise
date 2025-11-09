'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Navbar } from '@/components/navbar';
import { GlassCard } from '@/components/ui/glass-card';
import { motion } from 'framer-motion';
import { Users, FileText, CheckCircle, XCircle, TrendingUp, BarChart3 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/utils/supabase/client';

export default function StatsPage() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      router.push('/');
    }
  }, [user, isAdmin, authLoading, router]);

  // Fetch statistics
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      // Get total users
      const { count: totalUsers } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true });

      // Get total questions
      const { count: totalQuestions } = await supabase
        .from('admin_questions')
        .select('*', { count: 'exact', head: true });

      // Get questions by category
      const { data: questionsByCategory } = await supabase
        .from('admin_questions')
        .select('category');

      const categoryCounts = questionsByCategory?.reduce((acc, q) => {
        acc[q.category] = (acc[q.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      // Get total test attempts
      const { count: totalAttempts } = await supabase
        .from('test_attempts')
        .select('*', { count: 'exact', head: true });

      // Get passed/failed attempts
      const { data: attempts } = await supabase
        .from('test_attempts')
        .select('percentage');

      const passedAttempts = attempts?.filter(a => a.percentage >= 80).length || 0;
      const failedAttempts = (attempts?.length || 0) - passedAttempts;

      return {
        totalUsers: totalUsers || 0,
        totalQuestions: totalQuestions || 0,
        totalAttempts: totalAttempts || 0,
        passedAttempts,
        failedAttempts,
        categoryCounts,
      };
    },
  });

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading statistics...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-6 py-8 max-w-7xl"
      >
        {/* Header */}
        <div className="mb-8 space-y-2">
          <h1 className="text-3xl font-bold">Statistics</h1>
          <p className="text-sm text-muted-foreground">
            System overview and metrics
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <p className="text-3xl font-bold mb-1">{stats?.totalUsers || 0}</p>
              <p className="text-sm text-muted-foreground">Total Users</p>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <BarChart3 className="w-5 h-5 text-primary" />
              </div>
              <p className="text-3xl font-bold mb-1">{stats?.totalQuestions || 0}</p>
              <p className="text-sm text-muted-foreground">Total Questions</p>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-primary" />
                </div>
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <p className="text-3xl font-bold mb-1">{stats?.totalAttempts || 0}</p>
              <p className="text-sm text-muted-foreground">Test Attempts</p>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                </div>
              </div>
              <p className="text-3xl font-bold mb-1 text-green-500">{stats?.passedAttempts || 0}</p>
              <p className="text-sm text-muted-foreground">Passed Tests</p>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-red-500" />
                </div>
              </div>
              <p className="text-3xl font-bold mb-1 text-red-500">{stats?.failedAttempts || 0}</p>
              <p className="text-sm text-muted-foreground">Failed Tests</p>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
              </div>
              <p className="text-3xl font-bold mb-1">
                {stats?.totalAttempts ? Math.round((stats.passedAttempts / stats.totalAttempts) * 100) : 0}%
              </p>
              <p className="text-sm text-muted-foreground">Pass Rate</p>
            </GlassCard>
          </motion.div>
        </div>

        {/* Questions by Category */}
        <GlassCard className="p-6">
          <h2 className="text-lg font-semibold mb-6">Questions by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Object.entries(stats?.categoryCounts || {}).map(([category, count]) => (
              <div key={category} className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="text-2xl font-bold text-primary mb-1">{count}</p>
                <p className="text-sm text-muted-foreground">Category {category}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
