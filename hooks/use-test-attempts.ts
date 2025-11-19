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

export interface WeakTopicStat {
  topic: string;
  totalQuestions: number;
  correct: number;
  accuracy: number;
}

export interface WeakTopicsSummary {
  topics: WeakTopicStat[];
  weakTopics: WeakTopicStat[];
}

export interface TestAchievements {
  totalTests: number;
  bestPassStreak: number;
  totalQuestionsAnswered: number;
  firstTestCompleted: boolean;
  fivePassesInRow: boolean;
  hundredQuestionsAnswered: boolean;
}

export interface GlobalDailyStreak {
  currentStreak: number;
  bestStreak: number;
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

// Compute unified daily streak across tests and Decision Trainer
export function useGlobalDailyStreak(userId?: string) {
  return useQuery<GlobalDailyStreak>({
    queryKey: ['global-daily-streak', userId],
    queryFn: async () => {
      const supabase = createClient();

      // Get all test attempt dates
      const { data: testAttempts, error: testError } = await supabase
        .from('test_attempts')
        .select('completed_at')
        .eq('user_id', userId!);

      if (testError) throw testError;

      // Get all decision trainer attempt dates
      const { data: dtAttempts, error: dtError } = await supabase
        .from('decision_trainer_attempts')
        .select('created_at')
        .eq('user_id', userId!);

      if (dtError) throw dtError;

      const activeDayTimestamps: number[] = [];

      (testAttempts || []).forEach((a: { completed_at: string }) => {
        const d = new Date(a.completed_at);
        activeDayTimestamps.push(new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime());
      });

      (dtAttempts || []).forEach((a: { created_at: string }) => {
        const d = new Date(a.created_at);
        activeDayTimestamps.push(new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime());
      });

      const uniqueDays = [...new Set(activeDayTimestamps)].sort((a, b) => b - a); // newest first

      if (uniqueDays.length === 0) {
        return { currentStreak: 0, bestStreak: 0 };
      }

      // Compute current streak: consecutive days ending today or yesterday
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
      const yesterdayStart = todayStart - 86400000;

      let currentStreak = 0;
      let bestStreak = 0;

      // Only count streak if last active day is today or yesterday
      if (uniqueDays[0] === todayStart || uniqueDays[0] === yesterdayStart) {
        currentStreak = 1;
        bestStreak = 1;

        for (let i = 1; i < uniqueDays.length; i++) {
          const expectedPrevDay = uniqueDays[i - 1] - 86400000;
          if (uniqueDays[i] === expectedPrevDay) {
            currentStreak++;
            if (currentStreak > bestStreak) {
              bestStreak = currentStreak;
            }
          } else {
            // streak broken
            break;
          }
        }
      }

      return { currentStreak, bestStreak };
    },
    enabled: !!userId,
    staleTime: 2 * 60 * 1000,
  });
}

// Compute simple theory test achievements for a user
export function useTestAchievements(userId?: string) {
  return useQuery<TestAchievements>({
    queryKey: ['test-achievements', userId],
    queryFn: async () => {
      const supabase = createClient();

      // Get all test attempts for this user (ordered oldest -> newest for streak calc)
      const { data: attempts, error: attemptsError } = await supabase
        .from('test_attempts')
        .select('id, percentage, total_questions, completed_at')
        .eq('user_id', userId!)
        .order('completed_at', { ascending: true });

      if (attemptsError) throw attemptsError;
      const testAttempts = attempts || [];
      const totalTests = testAttempts.length;

      // Best streak of passed tests in a row
      let bestPassStreak = 0;
      let currentStreak = 0;
      testAttempts.forEach((attempt) => {
        const passed = Number(attempt.percentage) >= 80;
        if (passed) {
          currentStreak++;
          if (currentStreak > bestPassStreak) {
            bestPassStreak = currentStreak;
          }
        } else {
          currentStreak = 0;
        }
      });

      // Total questions answered across all tests (count answers rows)
      let totalQuestionsAnswered = 0;
      if (testAttempts.length > 0) {
        const attemptIds = testAttempts.map(a => a.id);

        const { count: answersCount, error: answersError } = await supabase
          .from('test_attempt_answers')
          .select('*', { count: 'exact', head: true })
          .in('test_attempt_id', attemptIds);

        if (answersError) throw answersError;
        totalQuestionsAnswered = answersCount || 0;
      }

      const firstTestCompleted = totalTests >= 1;
      const fivePassesInRow = bestPassStreak >= 5;
      const hundredQuestionsAnswered = totalQuestionsAnswered >= 100;

      return {
        totalTests,
        bestPassStreak,
        totalQuestionsAnswered,
        firstTestCompleted,
        fivePassesInRow,
        hundredQuestionsAnswered,
      };
    },
    enabled: !!userId,
    staleTime: 2 * 60 * 1000,
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
    onSuccess: () => {
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
export function useTestCount(category: string, enabled: boolean = true) {
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
    enabled: enabled && !!category,
  });
}

// Get overall weak-topic statistics across all past tests for a user
export function useWeakTopics(userId?: string) {
  return useQuery<WeakTopicsSummary>({
    queryKey: ['weak-topics', userId],
    queryFn: async () => {
      const supabase = createClient();

      // 1) Get all test attempts for this user
      const { data: attempts, error: attemptsError } = await supabase
        .from('test_attempts')
        .select('id')
        .eq('user_id', userId!);

      if (attemptsError) throw attemptsError;
      const attemptIds = (attempts || []).map(a => a.id);
      if (attemptIds.length === 0) {
        return { topics: [], weakTopics: [] };
      }

      // 2) Get all answers for those attempts
      const { data: answers, error: answersError } = await supabase
        .from('test_attempt_answers')
        .select('question_id, is_correct')
        .in('test_attempt_id', attemptIds);

      if (answersError) throw answersError;
      if (!answers || answers.length === 0) {
        return { topics: [], weakTopics: [] };
      }

      const questionIds = [...new Set(answers.map(a => a.question_id))];

      // 3) Get topics for those questions
      const { data: questions, error: questionsError } = await supabase
        .from('admin_questions')
        .select('id, topic')
        .in('id', questionIds);

      if (questionsError) throw questionsError;

      const topicByQuestionId = new Map<string, string | null>();
      (questions || []).forEach((q: { id: string; topic: string | null }) => {
        topicByQuestionId.set(q.id, q.topic ?? null);
      });

      const topicStatsMap: Record<string, { total: number; correct: number }> = {};

      answers.forEach((ans: { question_id: string; is_correct: boolean }) => {
        const topic = topicByQuestionId.get(ans.question_id);
        if (!topic) return;

        if (!topicStatsMap[topic]) {
          topicStatsMap[topic] = { total: 0, correct: 0 };
        }
        topicStatsMap[topic].total += 1;
        if (ans.is_correct) {
          topicStatsMap[topic].correct += 1;
        }
      });

      const topics: WeakTopicStat[] = Object.entries(topicStatsMap).map(([topic, stats]) => {
        const accuracy = stats.total > 0 ? stats.correct / stats.total : 0;
        return {
          topic,
          totalQuestions: stats.total,
          correct: stats.correct,
          accuracy,
        };
      }).sort((a, b) => a.accuracy - b.accuracy);

      const weakTopics = topics.filter(t => t.totalQuestions >= 3 && t.accuracy < 0.8).slice(0, 5);

      return { topics, weakTopics };
    },
    enabled: !!userId,
    staleTime: 2 * 60 * 1000,
  });
}
