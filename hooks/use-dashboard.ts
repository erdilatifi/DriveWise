import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/utils/supabase/client';

export interface DashboardStats {
  totalTests: number;
  completedTests: number;
  averageScore: number;
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  recentTests: RecentTest[];
}

export interface RecentTest {
  id: string;
  category: string;
  test_number: number;
  score: number;
  total_questions: number;
  completed_at: string;
}

export function useDashboardStats(userId?: string) {
  return useQuery({
    queryKey: ['dashboard-stats', userId],
    queryFn: async () => {
      const supabase = createClient();
      
      // Fetch user's test results
      const { data: results, error } = await supabase
        .from('test_results')
        .select('*')
        .eq('user_id', userId!)
        .order('completed_at', { ascending: false });

      if (error) throw error;

      const testResults = results || [];
      
      // Calculate stats
      const totalTests = testResults.length;
      const completedTests = testResults.filter(r => r.score !== null).length;
      const totalQuestions = testResults.reduce((sum, r) => sum + (r.total_questions || 0), 0);
      const correctAnswers = testResults.reduce((sum, r) => sum + (r.correct_answers || 0), 0);
      const averageScore = completedTests > 0
        ? Math.round(testResults.reduce((sum, r) => sum + (r.score || 0), 0) / completedTests)
        : 0;
      const accuracy = totalQuestions > 0
        ? Math.round((correctAnswers / totalQuestions) * 100)
        : 0;

      // Recent tests (last 5)
      const recentTests = testResults.slice(0, 5).map(r => ({
        id: r.id,
        category: r.category,
        test_number: r.test_number,
        score: r.score || 0,
        total_questions: r.total_questions || 0,
        completed_at: r.completed_at,
      }));

      return {
        totalTests,
        completedTests,
        averageScore,
        totalQuestions,
        correctAnswers,
        accuracy,
        recentTests,
      } as DashboardStats;
    },
    enabled: !!userId,
    staleTime: 0,
    refetchOnMount: 'always',
  });
}

// Get user profile with admin status
export function useUserProfile(userId?: string) {
  return useQuery({
    queryKey: ['user-profile', userId],
    queryFn: async () => {
      const supabase = createClient();
      
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId!)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
    staleTime: 0,
    refetchOnMount: 'always',
  });
}

// Get all users (admin only)
export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const supabase = createClient();
      
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    staleTime: 60 * 1000, // 1 minute
  });
}
