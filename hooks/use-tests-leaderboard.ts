import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/utils/supabase/client';

export interface TestsLeaderboardEntry {
  user_id: string;
  full_name: string;
  email: string;
  total_tests: number;
  tests_passed: number;
  tests_failed: number;
  average_score: number;
  best_score: number;
  total_correct: number;
  total_questions: number;
  overall_accuracy: number;
  categories_attempted: number;
  last_test_date: string;
}

export function useTestsLeaderboard() {
  return useQuery({
    queryKey: ['tests-leaderboard'],
    queryFn: async () => {
      const supabase = createClient();
      
      const { data, error } = await supabase
        .from('tests_leaderboard')
        .select('*')
        .limit(100);

      if (error) {
        console.error('Tests leaderboard error:', error);
        return [];
      }
      
      return (data || []) as TestsLeaderboardEntry[];
    },
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Auto-refresh every minute
  });
}

// Get user's test statistics
export function useUserTestStats(userId?: string) {
  return useQuery({
    queryKey: ['user-test-stats', userId],
    queryFn: async () => {
      const supabase = createClient();
      
      const { data, error } = await supabase
        .from('test_attempts')
        .select('*')
        .eq('user_id', userId!)
        .not('completed_at', 'is', null)
        .order('completed_at', { ascending: false });

      if (error) throw error;

      const attempts = data || [];
      
      return {
        totalTests: attempts.length,
        testsPassed: attempts.filter(a => a.passed).length,
        testsFailed: attempts.filter(a => !a.passed).length,
        averageScore: attempts.length > 0
          ? Math.round(attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length * 10) / 10
          : 0,
        bestScore: attempts.length > 0
          ? Math.max(...attempts.map(a => a.score))
          : 0,
        recentTests: attempts.slice(0, 5),
      };
    },
    enabled: !!userId,
    staleTime: 30 * 1000,
  });
}
