import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/utils/supabase/client';

export interface TestAttempt {
  id: string;
  user_id: string;
  category: string;
  test_number: string;
  score: number;
  total_questions: number;
  percentage: number;
  completed_at: string;
}

export interface DashboardStats {
  totalTests: number;
  averageScore: number;
  bestScore: number;
  testsThisWeek: number;
  streak: number;
  passedTests: number;
  failedTests: number;
}

export interface ProgressData {
  date: string;
  score: number;
}

export interface RecentTest {
  id: string;
  category: string;
  testNumber: string;
  score: number;
  date: string;
  passed: boolean;
}

// Get user's test attempts with dashboard stats
export function useTestAttempts(userId?: string) {
  return useQuery({
    queryKey: ['test-attempts', userId],
    queryFn: async () => {
      const supabase = createClient();
      
      const { data: attempts, error } = await supabase
        .from('test_attempts')
        .select('*')
        .eq('user_id', userId!)
        .order('completed_at', { ascending: false });

      if (error) throw error;
      return attempts || [];
    },
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Get dashboard stats derived from test attempts
export function useDashboardStats(userId?: string) {
  return useQuery({
    queryKey: ['dashboard-stats', userId],
    queryFn: async () => {
      const supabase = createClient();
      
      const { data: attempts, error } = await supabase
        .from('test_attempts')
        .select('*')
        .eq('user_id', userId!)
        .order('completed_at', { ascending: false });

      if (error) throw error;

      const testAttempts = attempts || [];
      
      if (testAttempts.length === 0) {
        return {
          stats: {
            totalTests: 0,
            averageScore: 0,
            bestScore: 0,
            testsThisWeek: 0,
            streak: 0,
            passedTests: 0,
            failedTests: 0,
          },
          progressData: [],
          recentTests: [],
        };
      }

      // Calculate stats
      const totalTests = testAttempts.length;
      const totalScore = testAttempts.reduce((sum, test) => sum + test.percentage, 0);
      const averageScore = Math.round(totalScore / totalTests);
      const bestScore = Math.max(...testAttempts.map(test => test.percentage));
      const passedTests = testAttempts.filter(test => test.percentage >= 80).length;
      const failedTests = totalTests - passedTests;

      // Calculate tests this week
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const testsThisWeek = testAttempts.filter(test => 
        new Date(test.completed_at) >= oneWeekAgo
      ).length;

      // Calculate streak (consecutive days with tests)
      const testDates = testAttempts.map(test => {
        const date = new Date(test.completed_at);
        return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
      });
      const uniqueDateTimes = [...new Set(testDates)].sort((a, b) => b - a);
      
      let streak = 0;
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
      const yesterdayStart = todayStart - 86400000;
      
      if (uniqueDateTimes.length > 0 && (uniqueDateTimes[0] === todayStart || uniqueDateTimes[0] === yesterdayStart)) {
        streak = 1;
        for (let i = 1; i < uniqueDateTimes.length; i++) {
          const expectedPrevDay = uniqueDateTimes[i - 1] - 86400000;
          if (uniqueDateTimes[i] === expectedPrevDay) {
            streak++;
          } else {
            break;
          }
        }
      }

      // Prepare progress data (last 7 days)
      const last7Days = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toDateString();
        const dayTests = testAttempts.filter(test => 
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

      // Prepare recent tests (last 4)
      const recentTests = testAttempts.slice(0, 4).map(test => ({
        id: test.id,
        category: test.category,
        testNumber: test.test_number || '1',
        score: test.percentage,
        date: new Date(test.completed_at).toLocaleDateString(),
        passed: test.percentage >= 80,
      }));

      return {
        stats: {
          totalTests,
          averageScore,
          bestScore,
          testsThisWeek,
          streak,
          passedTests,
          failedTests,
        },
        progressData: last7Days,
        recentTests,
      };
    },
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Get paginated test history
export function useTestHistory(userId?: string, page: number = 1, pageSize: number = 6) {
  return useQuery({
    queryKey: ['test-history', userId, page, pageSize],
    queryFn: async () => {
      const supabase = createClient();
      
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      const [attemptsResult, countResult] = await Promise.all([
        supabase
          .from('test_attempts')
          .select('*')
          .eq('user_id', userId!)
          .order('completed_at', { ascending: false })
          .range(from, to),
        supabase
          .from('test_attempts')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId!)
      ]);

      if (attemptsResult.error) throw attemptsResult.error;
      if (countResult.error) throw countResult.error;

      return {
        tests: attemptsResult.data || [],
        totalCount: countResult.count || 0,
        totalPages: Math.ceil((countResult.count || 0) / pageSize),
      };
    },
    enabled: !!userId,
    staleTime: 60 * 1000, // 1 minute
  });
}

// Delete test attempt
export function useDeleteTestAttempt() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (testId: string) => {
      const supabase = createClient();
      
      const { error } = await supabase
        .from('test_attempts')
        .delete()
        .eq('id', testId);

      if (error) throw error;
    },
    onSuccess: (_, testId) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['test-attempts'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      queryClient.invalidateQueries({ queryKey: ['test-history'] });
    },
  });
}

// Clear all test attempts for user
export function useClearAllTestAttempts() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (userId: string) => {
      const supabase = createClient();
      
      const { error } = await supabase
        .from('test_attempts')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;
    },
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['test-attempts'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      queryClient.invalidateQueries({ queryKey: ['test-history'] });
    },
  });
}

// Get test count for category
export function useTestCount(category: string) {
  return useQuery({
    queryKey: ['test-count', category],
    queryFn: async () => {
      const supabase = createClient();
      
      const { data, error } = await supabase
        .from('admin_questions')
        .select('test_number')
        .eq('category', category);

      if (error) throw error;
      
      // Get unique test numbers
      const uniqueTests = [...new Set((data || []).map(q => q.test_number))];
      return uniqueTests.length || 10;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes - test count doesn't change often
  });
}
