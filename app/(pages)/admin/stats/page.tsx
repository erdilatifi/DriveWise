'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Navbar } from '@/components/navbar';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { Users, FileText, CheckCircle, XCircle, TrendingUp, BarChart3, ArrowLeft, Search, Trash2, Ban, AlertTriangle, Star } from 'lucide-react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/utils/supabase/client';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function StatsPage() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();
  const supabase = createClient();
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  interface UserData {
    id: string;
    email: string;
    full_name: string | null;
    created_at: string;
    is_blocked: boolean;
    is_admin?: boolean;
    test_attempts_count: number;
    app_rating?: number;
  }

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const usersPerPage = 20;

  // Debounce search to avoid excessive queries
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1); // Reset to first page on search
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      router.push('/');
    }
  }, [user, isAdmin, authLoading, router]);

  // Fetch statistics
  const { data: stats, isLoading: statsLoading } = useQuery({
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

      // Get questions by category and test for coverage
      const { data: questionsDetail } = await supabase
        .from('admin_questions')
        .select('category, test_number');

      const categoryCounts = questionsDetail?.reduce((acc, q) => {
        acc[q.category] = (acc[q.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      const questionsPerTest = questionsDetail?.reduce((acc, q) => {
        const key = `${q.category}-${q.test_number}`;
        acc[key] = (acc[key] || 0) + 1;
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

      // Decision Trainer coverage: scenarios by category and level
      const { data: scenariosDetail } = await supabase
        .from('decision_trainer_scenarios')
        .select('category, level, is_active');

      const scenarioCategoryCounts = scenariosDetail?.reduce((acc, s) => {
        acc[s.category] = (acc[s.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      const scenarioLevelCounts = scenariosDetail?.reduce((acc, s) => {
        acc[s.level] = (acc[s.level] || 0) + 1;
        return acc;
      }, {} as Record<number, number>) || {};

      // Study materials coverage: materials per chapter
      const { data: materialsDetail } = await supabase
        .from('study_materials')
        .select('chapter_id, is_published');

      const materialsByChapter = materialsDetail?.reduce((acc, m) => {
        const chapterId = m.chapter_id as number;
        if (!acc[chapterId]) {
          acc[chapterId] = { total: 0, published: 0 };
        }
        acc[chapterId].total += 1;
        if (m.is_published) {
          acc[chapterId].published += 1;
        }
        return acc;
      }, {} as Record<number, { total: number; published: number }>) || {};

      return {
        totalUsers: totalUsers || 0,
        totalQuestions: totalQuestions || 0,
        totalAttempts: totalAttempts || 0,
        passedAttempts,
        failedAttempts,
        categoryCounts,
        questionsPerTest,
        scenarioCategoryCounts,
        scenarioLevelCounts,
        materialsByChapter,
      };
    },
  });

  // Fetch users with optimized query
  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ['admin-users', debouncedSearch, page],
    queryFn: async () => {
      const from = (page - 1) * usersPerPage;
      const to = from + usersPerPage - 1;

      // First, get user count for pagination (optimized with head: true)
      let countQuery = supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true });

      if (debouncedSearch) {
        countQuery = countQuery.or(`email.ilike.%${debouncedSearch}%,full_name.ilike.%${debouncedSearch}%`);
      }

      const { count } = await countQuery;

      // Then fetch only the users we need without expensive joins
      let dataQuery = supabase
        .from('user_profiles')
        .select('id, email, full_name, created_at, is_blocked, app_rating, is_admin')
        .order('created_at', { ascending: false })
        .range(from, to);

      if (debouncedSearch) {
        dataQuery = dataQuery.or(`email.ilike.%${debouncedSearch}%,full_name.ilike.%${debouncedSearch}%`);
      }

      const { data, error } = await dataQuery;

      if (error) throw error;

      // Fetch test attempt counts separately for visible users only
      if (data && data.length > 0) {
        const userIds = data.map(u => u.id);
        const { data: attemptCounts } = await supabase
          .from('test_attempts')
          .select('user_id')
          .in('user_id', userIds);

        // Count attempts per user
        const countsByUser = attemptCounts?.reduce((acc, attempt) => {
          acc[attempt.user_id] = (acc[attempt.user_id] || 0) + 1;
          return acc;
        }, {} as Record<string, number>) || {};

        // Add counts to users
        const usersWithCounts: UserData[] = data.map(user => ({
          ...user,
          test_attempts_count: countsByUser[user.id] || 0,
          is_admin: user.is_admin || false,
        }));

        return { users: usersWithCounts, total: count || 0 };
      }

      return { users: [] as UserData[], total: count || 0 };
    },
    staleTime: 30000, // Cache for 30 seconds
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from('user_profiles')
        .delete()
        .eq('id', userId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('User deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      setDeleteDialogOpen(false);
      setSelectedUser(null);
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Failed to delete user: ${message}`);
    },
  });

  // Block user mutation (we'll add a blocked field)
  const blockUserMutation = useMutation({
    mutationFn: async ({ userId, isBlocked }: { userId: string; isBlocked: boolean }) => {
      const { error } = await supabase
        .from('user_profiles')
        .update({ is_blocked: isBlocked })
        .eq('id', userId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('User status updated');
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      setBlockDialogOpen(false);
      setSelectedUser(null);
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Failed to update user: ${message}`);
    },
  });

  const handleDeleteUser = (user: UserData) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handleBlockUser = (user: UserData) => {
    setSelectedUser(user);
    setBlockDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedUser) {
      deleteUserMutation.mutate(selectedUser.id);
    }
  };

  const confirmBlock = () => {
    if (selectedUser) {
      blockUserMutation.mutate({
        userId: selectedUser.id,
        isBlocked: !selectedUser.is_blocked,
      });
    }
  };

  const totalPages = usersData ? Math.ceil(usersData.total / usersPerPage) : 0;

  if (authLoading || statsLoading) {
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
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-6 py-8 max-w-7xl pt-28"
      >
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/admin">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Admin Dashboard
          </Link>
        </Button>

        {/* Header */}
        <div className="mb-8 space-y-2">
          <h1 className="text-3xl font-bold">Statistics & User Management</h1>
          <p className="text-sm text-muted-foreground">
            System overview, metrics, and user administration
          </p>
          <p className="text-xs text-muted-foreground">
            Need to adjust plans?{' '}
            <Link href="/admin/subscriptions" className="underline underline-offset-2">
              Open subscriptions admin
            </Link>
            .
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <GlassCard className="h-full flex flex-col justify-between p-6 border border-border/80 bg-black/80">
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

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <GlassCard className="h-full flex flex-col justify-between p-6 border border-border/80 bg-black/80">
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

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <GlassCard className="h-full flex flex-col justify-between p-6 border border-border/80 bg-black/80">
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

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <GlassCard className="h-full flex flex-col justify-between p-6 border border-border/80 bg-black/80">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                </div>
              </div>
              <p className="text-3xl font-bold mb-1 text-green-500">{stats?.passedAttempts || 0}</p>
              <p className="text-sm text-muted-foreground">Passed Tests</p>
            </GlassCard>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <GlassCard className="h-full flex flex-col justify-between p-6 border border-border/80 bg-black/80">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-red-500" />
                </div>
              </div>
              <p className="text-3xl font-bold mb-1 text-red-500">{stats?.failedAttempts || 0}</p>
              <p className="text-sm text-muted-foreground">Failed Tests</p>
            </GlassCard>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <GlassCard className="h-full flex flex-col justify-between p-6 border border-border/80 bg-black/80">
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

        {/* User Management Section */}
        <GlassCard className="p-6 mb-8 border border-border/80 bg-black/80">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h2 className="text-xl font-semibold">User Management</h2>
              <p className="text-sm text-muted-foreground">
                {usersData?.total || 0} total users
              </p>
            </div>
            <div className="w-full md:w-64 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by email or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {usersLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : usersData && usersData.users.length > 0 ? (
            <>
              <div className="space-y-2">
                {usersData.users.map((userData: UserData, index: number) => (
                  <motion.div
                    key={userData.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-border/80 hover:border-primary/40 transition-colors bg-black/80"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{userData.email}</p>
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-sm text-muted-foreground">
                              {userData.full_name || 'No name set'} • {userData.test_attempts_count || 0} tests taken
                              {userData.is_blocked && <span className="ml-2 text-red-500">• Blocked</span>}
                              {userData.is_admin && <span className="ml-2 text-yellow-500">• Admin</span>}
                            </p>
                            {userData.app_rating && (
                              <div className="flex items-center gap-1">
                                <span className="text-xs text-muted-foreground">•</span>
                                <div className="flex items-center gap-0.5">
                                  {Array.from({ length: 5 }, (_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-3 h-3 ${
                                        i < userData.app_rating!
                                          ? 'fill-yellow-400 text-yellow-400'
                                          : 'text-muted-foreground/30'
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto sm:justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleBlockUser(userData)}
                        disabled={userData.is_admin}
                        className={userData.is_blocked ? 'text-green-500' : 'text-orange-500'}
                      >
                        <Ban className="w-4 h-4 mr-2" />
                        {userData.is_blocked ? 'Unblock' : 'Block'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteUser(userData)}
                        disabled={userData.is_admin}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <div className="flex items-center gap-2">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (page <= 3) {
                        pageNum = i + 1;
                      } else if (page >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = page - 2 + i;
                      }
                      
                      return (
                        <Button
                          key={i}
                          variant={page === pageNum ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setPage(pageNum)}
                          className="w-10"
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-muted-foreground">No users found</p>
            </div>
          )}
        </GlassCard>

        {/* Questions by Category */}
        <GlassCard className="p-6 border border-border/80 bg-black/90">
          <h2 className="text-lg font-semibold mb-6">Questions by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Object.entries(stats?.categoryCounts || {}).map(([category, count]) => (
              <div key={category} className="text-center p-4 rounded-xl bg-black/80 border border-border/80">
                <p className="text-2xl font-bold text-primary mb-1">{count}</p>
                <p className="text-sm text-muted-foreground">Category {category}</p>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Content coverage overview */}
        <GlassCard className="p-6 mt-8 border border-border/80 bg-black/80">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Questions per test */}
            <div>
              <h2 className="text-lg font-semibold mb-3">Theory Test Coverage</h2>
              <p className="text-xs text-muted-foreground mb-3">
                Questions per category/test. Cells with low counts help you see where more questions are needed.
              </p>
              <div className="space-y-1 text-xs">
                {Object.entries(stats?.questionsPerTest || {})
                  .sort(([aKey], [bKey]) => aKey.localeCompare(bKey))
                  .map(([key, count]) => {
                    const [category, testNumber] = key.split('-');
                    const low = count < 20; // arbitrary threshold for highlighting low-coverage tests
                    return (
                      <div
                        key={key}
                        className={`flex items-center justify-between px-2 py-1 rounded ${
                          low ? 'bg-amber-500/15 border border-amber-500/50' : 'bg-black/60 border border-border/70'
                        }`}
                      >
                        <span className="font-medium">Cat {category} · Test {testNumber}</span>
                        <span className={low ? 'text-amber-600 font-semibold' : 'text-muted-foreground'}>
                          {count} questions
                        </span>
                      </div>
                    );
                  })}
                {Object.keys(stats?.questionsPerTest || {}).length === 0 && (
                  <p className="text-xs text-muted-foreground">No theory questions found.</p>
                )}
              </div>
            </div>

            {/* Decision Trainer scenarios coverage */}
            <div>
              <h2 className="text-lg font-semibold mb-3">Decision Trainer Coverage</h2>
              <p className="text-xs text-muted-foreground mb-3">
                Scenarios by category and level to spot gaps in practical training content.
              </p>
              <div className="space-y-3 text-xs">
                <div>
                  <p className="font-semibold mb-1">By Category</p>
                  <div className="space-y-1">
                    {Object.entries(stats?.scenarioCategoryCounts || {}).map(([category, count]) => (
                      <div key={category} className="flex items-center justify-between px-2 py-1 rounded bg-black/60 border border-border/70">
                        <span className="font-medium">Category {category}</span>
                        <span className="text-muted-foreground">{count} scenarios</span>
                      </div>
                    ))}
                    {Object.keys(stats?.scenarioCategoryCounts || {}).length === 0 && (
                      <p className="text-xs text-muted-foreground">No Decision Trainer scenarios found.</p>
                    )}
                  </div>
                </div>

                <div>
                  <p className="font-semibold mb-1">By Level</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(stats?.scenarioLevelCounts || {}).map(([level, count]) => (
                      <div key={level} className="px-2 py-1 rounded-full bg-black/60 border border-border/70">
                        <span className="font-medium mr-1">L{level}</span>
                        <span className="text-muted-foreground">{count}</span>
                      </div>
                    ))}
                    {Object.keys(stats?.scenarioLevelCounts || {}).length === 0 && (
                      <p className="text-xs text-muted-foreground">No scenarios by level yet.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Study materials coverage */}
            <div>
              <h2 className="text-lg font-semibold mb-3">Study Materials Coverage</h2>
              <p className="text-xs text-muted-foreground mb-3">
                Materials per chapter and publication status. Chapters with no or few materials are highlighted.
              </p>
              <div className="space-y-1 text-xs">
                {Array.from({ length: 13 }).map((_, idx) => {
                  const chapterId = idx + 1;
                  const chapterStats = stats?.materialsByChapter?.[chapterId] || { total: 0, published: 0 };
                  const low = chapterStats.total === 0;
                  return (
                    <div
                      key={chapterId}
                      className={`flex items-center justify-between px-2 py-1 rounded ${
                        low ? 'bg-red-500/15 border border-red-500/50' : 'bg-black/60 border border-border/70'
                      }`}
                    >
                      <span className="font-medium">Chapter {chapterId}</span>
                      <span className={low ? 'text-red-600 font-semibold' : 'text-muted-foreground'}>
                        {chapterStats.published}/{chapterStats.total} published
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-5 h-5" />
              Delete User Account
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{selectedUser?.email}</strong>? 
              This action cannot be undone. All their test history will be permanently deleted.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteUserMutation.isPending}
            >
              {deleteUserMutation.isPending ? 'Deleting...' : 'Delete User'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Block Confirmation Dialog */}
      <Dialog open={blockDialogOpen} onOpenChange={setBlockDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedUser?.is_blocked ? 'Unblock' : 'Block'} User
            </DialogTitle>
            <DialogDescription>
              {selectedUser?.is_blocked
                ? `Are you sure you want to unblock ${selectedUser?.email}? They will regain access to their account.`
                : `Are you sure you want to block ${selectedUser?.email}? They will not be able to access their account.`
              }
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBlockDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={confirmBlock}
              disabled={blockUserMutation.isPending}
            >
              {blockUserMutation.isPending ? 'Updating...' : (selectedUser?.is_blocked ? 'Unblock User' : 'Block User')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
