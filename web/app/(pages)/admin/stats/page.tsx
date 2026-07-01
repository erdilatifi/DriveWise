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

  // Fetch statistics using scalable RPC
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
    interface AdminStats {
      totalUsers: number;
      totalQuestions: number;
      totalAttempts: number;
      passedAttempts: number;
      failedAttempts: number;
      categoryCounts: Record<string, number>;
      questionsPerTest: Record<string, number>;
      scenarioCategoryCounts: Record<string, number>;
      scenarioLevelCounts: Record<string, number>;
      materialsByChapter: Record<string, { total: number; published: number }>;
    }

    const { data, error } = await supabase.rpc('get_admin_dashboard_stats');
      
      if (error) {
        console.error('Error fetching admin stats:', error);
        throw error;
      }

      const statsData = data as AdminStats;

      // Ensure all expected fields exist with defaults
      return {
        totalUsers: statsData?.totalUsers || 0,
        totalQuestions: statsData?.totalQuestions || 0,
        totalAttempts: statsData?.totalAttempts || 0,
        passedAttempts: statsData?.passedAttempts || 0,
        failedAttempts: statsData?.failedAttempts || 0,
        categoryCounts: statsData?.categoryCounts || {},
        questionsPerTest: statsData?.questionsPerTest || {},
        scenarioCategoryCounts: statsData?.scenarioCategoryCounts || {},
        scenarioLevelCounts: statsData?.scenarioLevelCounts || {},
        materialsByChapter: statsData?.materialsByChapter || {},
      };
    },
  });

  // Fetch users with optimized query

  // Fetch users with optimized query
  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ['admin-users', debouncedSearch, page],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_users_with_stats', {
        page_number: page,
        page_size: usersPerPage,
        search_term: debouncedSearch || null,
        role_filter: 'all',
        premium_filter: 'all'
      });

      if (error) throw error;

      return { 
        users: (data?.users || []) as UserData[], 
        total: data?.total || 0 
      };
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
      toast.success('Përdoruesi u fshi me sukses');
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      setDeleteDialogOpen(false);
      setSelectedUser(null);
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : 'Gabim i panjohur';
      toast.error(`Dështoi fshirja e përdoruesit: ${message}`);
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
      toast.success('Statusi i përdoruesit u përditësua');
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      setBlockDialogOpen(false);
      setSelectedUser(null);
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : 'Gabim i panjohur';
      toast.error(`Dështoi përditësimi i përdoruesit: ${message}`);
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
          <p className="text-muted-foreground">Duke ngarkuar statistikat...</p>
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
            Kthehu në Panelin Admin
          </Link>
        </Button>

        {/* Header */}
        <div className="mb-8 space-y-2">
          <h1 className="text-3xl font-bold">Statistika &amp; Menaxhimi i Përdoruesve</h1>
          <p className="text-sm text-muted-foreground">
            Përmbledhje e sistemit, metrika dhe administrimi i përdoruesve
          </p>
          <p className="text-xs text-muted-foreground">
            Doni të rregulloni planet?{' '}
            <Link href="/admin/subscriptions" className="underline underline-offset-2">
              Hap administrimin e abonimeve
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
              <p className="text-sm text-muted-foreground">Përdorues Gjithsej</p>
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
              <p className="text-sm text-muted-foreground">Pyetje Gjithsej</p>
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
              <p className="text-sm text-muted-foreground">Përpjekje Testesh</p>
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
              <p className="text-sm text-muted-foreground">Teste të Kaluara</p>
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
              <p className="text-sm text-muted-foreground">Teste të Dështuara</p>
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
              <p className="text-sm text-muted-foreground">Përqindja e Kalimit</p>
            </GlassCard>
          </motion.div>
        </div>

        {/* Questions by Category */}
        <GlassCard className="p-6 border border-border/80 bg-black/90">
          <h2 className="text-lg font-semibold mb-6">Pyetjet sipas Kategorisë</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Object.entries((stats?.categoryCounts || {}) as Record<string, number>).map(([category, count]) => (
              <div key={category} className="text-center p-4 rounded-xl bg-black/80 border border-border/80">
                <p className="text-2xl font-bold text-primary mb-1">{count}</p>
                <p className="text-sm text-muted-foreground">Kategoria {category}</p>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Content coverage overview */}
        <GlassCard className="p-6 mt-8 border border-border/80 bg-black/80">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Questions per test */}
            <div>
              <h2 className="text-lg font-semibold mb-3">Mbulimi i Testit të Teorisë</h2>
              <p className="text-xs text-muted-foreground mb-3">
                Pyetje për çdo kategori/test. Qelizat me numra të ulët ju ndihmojnë të shihni ku nevojiten më shumë pyetje.
              </p>
              <div className="space-y-1 text-xs">
                {Object.entries((stats?.questionsPerTest || {}) as Record<string, number>)
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
                        <span className="font-medium">Kat {category} · Testi {testNumber}</span>
                        <span className={low ? 'text-amber-600 font-semibold' : 'text-muted-foreground'}>
                          {count} pyetje
                        </span>
                      </div>
                    );
                  })}
                {Object.keys(stats?.questionsPerTest || {}).length === 0 && (
                  <p className="text-xs text-muted-foreground">Nuk u gjetën pyetje teorie.</p>
                )}
              </div>
            </div>

            {/* Decision Trainer scenarios coverage */}
            <div>
              <h2 className="text-lg font-semibold mb-3">Mbulimi i Decision Trainer</h2>
              <p className="text-xs text-muted-foreground mb-3">
                Skenarë sipas kategorisë dhe nivelit për të identifikuar boshllëqet në përmbajtjen praktike të trajnimit.
              </p>
              <div className="space-y-3 text-xs">
                <div>
                  <p className="font-semibold mb-1">Sipas Kategorisë</p>
                  <div className="space-y-1">
                    {Object.entries((stats?.scenarioCategoryCounts || {}) as Record<string, number>).map(([category, count]) => (
                      <div key={category} className="flex items-center justify-between px-2 py-1 rounded bg-black/60 border border-border/70">
                        <span className="font-medium">Kategoria {category}</span>
                        <span className="text-muted-foreground">{count} skenarë</span>
                      </div>
                    ))}
                    {Object.keys(stats?.scenarioCategoryCounts || {}).length === 0 && (
                      <p className="text-xs text-muted-foreground">Nuk u gjetën skenarë të Decision Trainer.</p>
                    )}
                  </div>
                </div>

                <div>
                  <p className="font-semibold mb-1">Sipas Nivelit</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries((stats?.scenarioLevelCounts || {}) as Record<string, number>).map(([level, count]) => (
                      <div key={level} className="px-2 py-1 rounded-full bg-black/60 border border-border/70">
                        <span className="font-medium mr-1">N{level}</span>
                        <span className="text-muted-foreground">{count}</span>
                      </div>
                    ))}
                    {Object.keys(stats?.scenarioLevelCounts || {}).length === 0 && (
                      <p className="text-xs text-muted-foreground">Ende nuk ka skenarë sipas nivelit.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Study materials coverage */}
            <div>
              <h2 className="text-lg font-semibold mb-3">Mbulimi i Materialeve Mësimore</h2>
              <p className="text-xs text-muted-foreground mb-3">
                Materiale për çdo kapitull dhe statusi i publikimit. Kapitujt pa ose me pak materiale janë theksuar.
              </p>
              <div className="space-y-1 text-xs">
                {Array.from({ length: 13 }).map((_, idx) => {
                  const chapterId = idx + 1;
                  const materialsMap = (stats?.materialsByChapter || {}) as Record<string, { total: number; published: number }>;
                  const chapterStats = materialsMap[chapterId] || { total: 0, published: 0 };
                  const low = chapterStats.total === 0;
                  return (
                    <div
                      key={chapterId}
                      className={`flex items-center justify-between px-2 py-1 rounded ${
                        low ? 'bg-red-500/15 border border-red-500/50' : 'bg-black/60 border border-border/70'
                      }`}
                    >
                      <span className="font-medium">Kapitulli {chapterId}</span>
                      <span className={low ? 'text-red-600 font-semibold' : 'text-muted-foreground'}>
                        {chapterStats.published}/{chapterStats.total} publikuar
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
              Fshi Llogarinë e Përdoruesit
            </DialogTitle>
            <DialogDescription>
              A jeni i sigurt që doni të fshini <strong>{selectedUser?.email}</strong>?
              Ky veprim nuk mund të zhbëhet. I gjithë historiku i tyre i testeve do të fshihet përgjithmonë.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Anulo
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteUserMutation.isPending}
            >
              {deleteUserMutation.isPending ? 'Duke fshirë...' : 'Fshi Përdoruesin'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Block Confirmation Dialog */}
      <Dialog open={blockDialogOpen} onOpenChange={setBlockDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedUser?.is_blocked ? 'Zhblloko' : 'Blloko'} Përdoruesin
            </DialogTitle>
            <DialogDescription>
              {selectedUser?.is_blocked
                ? `A jeni i sigurt që doni të zhbllokoni ${selectedUser?.email}? Ata do të rifitojnë qasje në llogarinë e tyre.`
                : `A jeni i sigurt që doni të bllokoni ${selectedUser?.email}? Ata nuk do të mund të qasen në llogarinë e tyre.`
              }
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBlockDialogOpen(false)}>
              Anulo
            </Button>
            <Button
              onClick={confirmBlock}
              disabled={blockUserMutation.isPending}
            >
              {blockUserMutation.isPending ? 'Duke përditësuar...' : (selectedUser?.is_blocked ? 'Zhblloko Përdoruesin' : 'Blloko Përdoruesin')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
