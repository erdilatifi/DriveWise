'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Trophy, Medal, Award, Zap } from 'lucide-react';
import Link from 'next/link';
import { useLeaderboard } from '@/hooks/use-leaderboard';
import { useLanguage } from '@/contexts/language-context';

export default function LeaderboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { t } = useLanguage();
  const { data: leaderboardData, isLoading } = useLeaderboard(user?.id);
  
  const topTen = leaderboardData?.topTen || [];
  const currentUserRank = leaderboardData?.currentUserRank;
  const totalUsers = leaderboardData?.totalUsers || 0;

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8 max-w-6xl pt-28">
          <div className="mb-8">
            <Skeleton className="h-9 w-40 mb-4" />
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-64" />
              </div>
            </div>
          </div>

          <GlassCard className="p-6">
            <div className="mb-6 space-y-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-40" />
              </div>
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="p-4 rounded-lg border-2 border-border">
                  <div className="flex items-center gap-4">
                    <div className="w-12 flex justify-center">
                      <Skeleton className="h-6 w-6 rounded-full" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-40" />
                      <div className="flex gap-4">
                        <Skeleton className="h-3 w-24" />
                        <Skeleton className="h-3 w-24" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const formatTime = (seconds: number) => {
    if (!seconds) return '--';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Award className="w-6 h-6 text-amber-600" />;
    return <span className="text-muted-foreground font-bold">#{rank}</span>;
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <Navbar />
      {/* Background accents */}
      <div className="pointer-events-none absolute -top-40 right-0 w-[420px] h-[420px] bg-primary/15 rounded-full blur-3xl opacity-80" />
      <div className="pointer-events-none absolute -bottom-40 left-0 w-[420px] h-[420px] bg-primary/5 rounded-full blur-3xl opacity-80" />
      <div className="pointer-events-none absolute inset-x-16 top-40 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-50" />

      <div className="container mx-auto px-4 py-8 max-w-6xl pt-28 relative z-10">
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/decision-trainer">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('leaderboard.backToTrainer')}
            </Link>
          </Button>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h1 className="inline-flex items-center gap-3 text-3xl md:text-4xl font-semibold tracking-tight mb-2">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-border/70 bg-black/70">
                  <Trophy className="w-5 h-5 text-orange-300" />
                </span>
                <span className="bg-gradient-to-r from-orange-400 to-amber-200 bg-clip-text text-transparent">
                  {t('trainer.leaderboard')}
                </span>
              </h1>
              <p className="text-sm text-muted-foreground">{t('leaderboard.subtitle')}</p>
            </div>
          </div>
        </div>

        <GlassCard className="p-6 border border-border/80 bg-black/80 relative overflow-hidden">
          <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-orange-400/40 to-transparent opacity-70" />
          {/* Current User Rank (if not in top 10) */}
          {currentUserRank && !currentUserRank.isInTopTen && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">{t('leaderboard.yourRank')}</h3>
                <span className="text-sm text-muted-foreground">
                  #{currentUserRank.rank} of {totalUsers}
                </span>
              </div>
              <div className="p-4 rounded-lg border-2 border-primary/70 bg-primary/10">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="w-12 flex justify-center">
                    <span className="text-primary font-semibold text-sm px-2 py-1 rounded-full bg-primary/10 border border-primary/40">#{currentUserRank.rank}</span>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold">
                        {currentUserRank.full_name || currentUserRank.email?.split('@')[0] || 'You'}
                      </h3>
                      <span className="text-xs bg-primary/15 text-primary px-2 py-1 rounded-full border border-primary/30">You</span>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-muted-foreground">
                      <span>{currentUserRank.total_scenarios} scenarios</span>
                      <span>{currentUserRank.accuracy}% accuracy</span>
                      <span>{currentUserRank.categories_completed} categories</span>
                      {currentUserRank.best_time_seconds && (
                        <span className="text-blue-500">⏱️ {formatTime(currentUserRank.best_time_seconds)}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-center sm:text-right">
                    <div className="flex items-center gap-2 text-2xl font-semibold text-primary">
                      <Zap className="w-5 h-5" />
                      {currentUserRank.total_xp}
                    </div>
                    <div className="text-xs text-muted-foreground">XP</div>
                  </div>
                  
                  <div className="text-center sm:text-right">
                    <div className="flex items-center justify-end gap-2 text-xl font-semibold text-orange-300">
                      <Zap className="w-4 h-4" />
                      {currentUserRank.best_streak}
                    </div>
                    <div className="text-xs text-muted-foreground">Best Streak</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{t('leaderboard.top10Title')}</h3>
              {totalUsers > 10 && (
                <span className="text-sm text-muted-foreground">
                  {t('leaderboard.showingTop10Of')} {totalUsers}
                </span>
              )}
            </div>
            
            {topTen.length === 0 ? (
              <div className="text-center py-12">
                <Trophy className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-bold mb-2">{t('leaderboard.noDataTitle')}</h3>
                <p className="text-muted-foreground mb-4">
                  {t('leaderboard.noDataSubtitle')}
                </p>
                <Button asChild>
                  <Link href="/decision-trainer">
                    {t('leaderboard.startLearningCta')}
                  </Link>
                </Button>
              </div>
            ) : (
              topTen.map((entry, index) => {
                const rank = index + 1;
                const isCurrentUser = entry.user_id === user.id;
                
                return (
                  <div
                    key={entry.user_id}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      isCurrentUser
                        ? 'border-primary/80 bg-primary/10'
                        : rank <= 3
                        ? 'border-amber-400/60 bg-black/70'
                        : 'border-border/70 bg-black/70'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="w-12 flex justify-center">
                        {getRankIcon(rank)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold">
                            {entry.full_name || entry.email?.split('@')[0] || 'Anonymous'}
                          </h3>
                          {isCurrentUser && (
                            <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">You</span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-muted-foreground">
                          <span>{entry.total_scenarios} scenarios</span>
                          <span>{entry.accuracy}% accuracy</span>
                          <span>{entry.categories_completed} categories</span>
                          {entry.best_time_seconds && (
                            <span className="text-blue-500">⏱️ {formatTime(entry.best_time_seconds)}</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-center sm:text-right">
                        <div className="flex items-center gap-2 text-2xl font-semibold text-primary">
                          <Zap className="w-5 h-5" />
                          {entry.total_xp}
                        </div>
                        <div className="text-xs text-muted-foreground">XP</div>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center justify-end gap-2 text-xl font-semibold text-orange-300">
                          <Zap className="w-4 h-4" />
                          {entry.best_streak}
                        </div>
                        <div className="text-xs text-muted-foreground">Best Streak</div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </GlassCard>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassCard className="p-6 text-center border border-border/80 bg-black/80">
            <Trophy className="w-10 h-10 mx-auto mb-3 text-amber-300" />
            <h3 className="font-bold text-2xl mb-1">{topTen[0]?.total_xp || 0}</h3>
            <p className="text-sm text-muted-foreground">{t('leaderboard.highestXp')}</p>
          </GlassCard>
          
          <GlassCard className="p-6 text-center border border-border/80 bg-black/80">
            <Award className="w-10 h-10 mx-auto mb-3 text-emerald-300" />
            <h3 className="font-bold text-2xl mb-1">
              {topTen[0]?.accuracy || 0}%
            </h3>
            <p className="text-sm text-muted-foreground">{t('leaderboard.topAccuracy')}</p>
          </GlassCard>
          
          <GlassCard className="p-6 text-center border border-border/80 bg-black/80">
            <Zap className="w-8 h-8 mx-auto mb-3 text-orange-300" />
            <h3 className="font-bold text-2xl mb-1">
              {topTen.length > 0 ? Math.max(...topTen.map((e: any) => e.best_streak), 0) : 0}
            </h3>
            <p className="text-sm text-muted-foreground">{t('leaderboard.longestStreak')}</p>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
