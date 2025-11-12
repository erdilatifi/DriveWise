'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import { ArrowLeft, Trophy, Medal, Award, Target, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useTestsLeaderboard } from '@/hooks/use-tests-leaderboard';

export default function TestsLeaderboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { data: leaderboard = [], isLoading } = useTestsLeaderboard();

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
            <Link href="/tests">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Tests
            </Link>
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold flex items-center gap-3">
                <Trophy className="w-10 h-10 text-primary" />
                Tests Leaderboard
              </h1>
              <p className="text-muted-foreground mt-2">
                Top performers across all test categories
              </p>
            </div>
          </div>
        </div>

        <GlassCard className="p-6">
          {leaderboard.length === 0 ? (
            <div className="text-center py-12">
              <Trophy className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-bold mb-2">No Test Results Yet</h3>
              <p className="text-muted-foreground mb-4">
                Complete some tests to appear on the leaderboard!
              </p>
              <Button asChild>
                <Link href="/tests">
                  Start Testing
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {leaderboard.map((entry, index) => {
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
                        <div className="flex gap-4 mt-2 text-sm text-muted-foreground flex-wrap">
                          <span className="flex items-center gap-1">
                            <Target className="w-4 h-4" />
                            {entry.total_tests} tests
                          </span>
                          <span className="flex items-center gap-1 text-green-500">
                            <CheckCircle className="w-4 h-4" />
                            {entry.tests_passed} passed
                          </span>
                          <span className="flex items-center gap-1 text-red-500">
                            <XCircle className="w-4 h-4" />
                            {entry.tests_failed} failed
                          </span>
                          <span>{entry.overall_accuracy}% accuracy</span>
                          <span>{entry.categories_attempted} categories</span>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-3xl font-bold text-primary">
                          {entry.average_score}%
                        </div>
                        <div className="text-xs text-muted-foreground">Avg Score</div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-xl font-bold text-green-500">
                          {entry.best_score}%
                        </div>
                        <div className="text-xs text-muted-foreground">Best Score</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </GlassCard>

        {leaderboard.length > 0 && (
          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>Leaderboard updates automatically every minute</p>
            <p className="mt-1">Rankings based on average score, then total tests completed</p>
          </div>
        )}
      </div>
    </div>
  );
}
