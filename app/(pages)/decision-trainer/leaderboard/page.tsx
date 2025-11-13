'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import { ArrowLeft, Trophy, Medal, Award, Zap } from 'lucide-react';
import Link from 'next/link';
import { useLeaderboard } from '@/hooks/use-leaderboard';

export default function LeaderboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { data: leaderboardData, isLoading } = useLeaderboard(user?.id);
  
  const topTen = leaderboardData?.topTen || [];
  const currentUserRank = leaderboardData?.currentUserRank;
  const totalUsers = leaderboardData?.totalUsers || 0;

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
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
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl pt-28">
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/decision-trainer">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Trainer
            </Link>
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">🏆 Leaderboard</h1>
              <p className="text-muted-foreground">Top learners in Decision Trainer</p>
            </div>
          </div>
        </div>

        <GlassCard className="p-6">
          {/* Current User Rank (if not in top 10) */}
          {currentUserRank && !currentUserRank.isInTopTen && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">Your Rank</h3>
                <span className="text-sm text-muted-foreground">
                  #{currentUserRank.rank} of {totalUsers}
                </span>
              </div>
              <div className="p-4 rounded-lg border-2 border-primary bg-primary/5">
                <div className="flex items-center gap-4">
                  <div className="w-12 flex justify-center">
                    <span className="text-primary font-bold">#{currentUserRank.rank}</span>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold">
                        {currentUserRank.full_name || currentUserRank.email?.split('@')[0] || 'You'}
                      </h3>
                      <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">You</span>
                    </div>
                    <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                      <span>{currentUserRank.total_scenarios} scenarios</span>
                      <span>{currentUserRank.accuracy}% accuracy</span>
                      <span>{currentUserRank.categories_completed} categories</span>
                      {currentUserRank.best_time_seconds && (
                        <span className="text-blue-500">⏱️ {formatTime(currentUserRank.best_time_seconds)}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center gap-2 text-2xl font-bold text-primary">
                      <Zap className="w-5 h-5" />
                      {currentUserRank.total_xp}
                    </div>
                    <div className="text-xs text-muted-foreground">XP</div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-xl font-bold text-orange-500">
                      🔥 {currentUserRank.best_streak}
                    </div>
                    <div className="text-xs text-muted-foreground">Best Streak</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Top 10 Leaderboard</h3>
              {totalUsers > 10 && (
                <span className="text-sm text-muted-foreground">
                  Showing top 10 of {totalUsers} users
                </span>
              )}
            </div>
            
            {topTen.length === 0 ? (
              <div className="text-center py-12">
                <Trophy className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-bold mb-2">No Leaderboard Data Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Complete some scenarios in Decision Trainer to appear on the leaderboard!
                </p>
                <Button asChild>
                  <Link href="/decision-trainer">
                    Start Learning
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
                        ? 'border-primary bg-primary/5'
                        : rank <= 3
                        ? 'border-yellow-500/30 bg-yellow-500/5'
                        : 'border-border'
                    }`}
                  >
                    <div className="flex items-center gap-4">
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
                        <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                          <span>{entry.total_scenarios} scenarios</span>
                          <span>{entry.accuracy}% accuracy</span>
                          <span>{entry.categories_completed} categories</span>
                          {entry.best_time_seconds && (
                            <span className="text-blue-500">⏱️ {formatTime(entry.best_time_seconds)}</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center gap-2 text-2xl font-bold text-primary">
                          <Zap className="w-5 h-5" />
                          {entry.total_xp}
                        </div>
                        <div className="text-xs text-muted-foreground">XP</div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-xl font-bold text-orange-500">
                          🔥 {entry.best_streak}
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
          <GlassCard className="p-6 text-center">
            <Trophy className="w-12 h-12 mx-auto mb-3 text-yellow-500" />
            <h3 className="font-bold text-2xl mb-1">{topTen[0]?.total_xp || 0}</h3>
            <p className="text-sm text-muted-foreground">Highest XP</p>
          </GlassCard>
          
          <GlassCard className="p-6 text-center">
            <Award className="w-12 h-12 mx-auto mb-3 text-green-500" />
            <h3 className="font-bold text-2xl mb-1">
              {topTen[0]?.accuracy || 0}%
            </h3>
            <p className="text-sm text-muted-foreground">Top Accuracy</p>
          </GlassCard>
          
          <GlassCard className="p-6 text-center">
            <div className="text-4xl mb-3">🔥</div>
            <h3 className="font-bold text-2xl mb-1">
              {topTen.length > 0 ? Math.max(...topTen.map((e: any) => e.best_streak), 0) : 0}
            </h3>
            <p className="text-sm text-muted-foreground">Longest Streak</p>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
