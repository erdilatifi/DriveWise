import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSupabase } from '../contexts/supabase-context';
import { TestAttempt as DBTestAttempt } from '../types/database';

export interface ExtendedTestAttempt extends DBTestAttempt {
  test_number?: string; // Add if missing in DB types but present in API
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
  dominantCategory: string | null;
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
  const supabase = useSupabase();
  return useQuery({
    queryKey: ['test-attempts', userId],
    queryFn: async () => {
      
      const { data: attempts, error } = await supabase
        .from('test_attempts')
        .select('*')
        .eq('user_id', userId!)
        .order('completed_at', { ascending: false });

      if (error) throw error;
      return attempts || [] as ExtendedTestAttempt[];
    },
    enabled: !!userId,
    staleTime: 0,
    refetchOnMount: 'always',
  });
}

// Compute unified daily streak across tests and Decision Trainer
export function useGlobalDailyStreak(userId?: string) {
  const supabase = useSupabase();
  return useQuery<GlobalDailyStreak>({
    queryKey: ['global-daily-streak', userId],
    queryFn: async () => {

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

      ((testAttempts || []) as any[]).forEach((a: any) => {
        const d = new Date(a.completed_at);
        activeDayTimestamps.push(new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime());
      });

      ((dtAttempts || []) as any[]).forEach((a: any) => {
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
    staleTime: 0,
    refetchOnMount: 'always',
  });
}

// Compute simple theory test achievements for a user
export function useTestAchievements(userId?: string) {
  const supabase = useSupabase();
  return useQuery<TestAchievements>({
    queryKey: ['test-achievements', userId],
    queryFn: async () => {

      // Get all test attempts for this user (ordered oldest -> newest for streak calc)
      const { data: attempts, error: attemptsError } = await supabase
        .from('test_attempts')
        .select('id, percentage, total_questions, completed_at')
        .eq('user_id', userId!)
        .order('completed_at', { ascending: true });

      if (attemptsError) throw attemptsError;
      const testAttempts = (attempts || []) as any[];
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

// Get dashboard stats derived from test attempts (Optimized V2)
export function useDashboardStats(userId?: string) {
  const supabase = useSupabase();
  return useQuery({
    queryKey: ['dashboard-stats', userId],
    queryFn: async () => {

      const emptyResult = {
        stats: {
          totalTests: 0,
          averageScore: 0,
          bestScore: 0,
          testsThisWeek: 0,
          streak: 0,
          passedTests: 0,
          failedTests: 0,
        },
        progressData: [] as ProgressData[],
        recentTests: [] as RecentTest[],
      };

      try {
        // Parallelize fetches
        const [statsRes, progressRes, recentRes, streakRes] = await Promise.all([
          supabase.rpc('get_dashboard_stats', { p_user_id: userId! } as any),
          supabase.rpc('get_weekly_progress', { p_user_id: userId! } as any),
          supabase.rpc('get_recent_tests', { p_user_id: userId!, p_limit: 4 } as any),
          // We still need dates for streak, but we can select JUST dates
          supabase.from('test_attempts').select('completed_at').eq('user_id', userId!).order('completed_at', { ascending: false })
        ]);

        if (statsRes.error) throw statsRes.error;
        if (progressRes.error) throw progressRes.error;
        if (recentRes.error) throw recentRes.error;

        const statsData = (statsRes.data as any)?.[0] || {
          total_tests: 0,
          average_score: 0,
          best_score: 0,
          tests_this_week: 0,
          passed_tests: 0,
          failed_tests: 0
        };

        // Calculate streak
        const testDates = ((streakRes.data || []) as any[]).map((test: any) => {
          const date = new Date(test.completed_at);
          return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
        });
        const uniqueDateTimes = [...new Set(testDates)].sort((a, b) => b - a);

        let streak = 0;
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        const yesterdayStart = todayStart - 86400000;

        if (
          uniqueDateTimes.length > 0 &&
          (uniqueDateTimes[0] === todayStart || uniqueDateTimes[0] === yesterdayStart)
        ) {
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

        // Format progress data
        // Map database rows to 7-day chart format
        const progressData: ProgressData[] = [];
        const dbProgress = (progressRes.data || []) as any[];
        
        for (let i = 6; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          const dateStr = d.toISOString().split('T')[0]; // YYYY-MM-DD
          const dayLabel = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()];
          
          const dayStat = dbProgress.find((p: any) => p.attempt_date === dateStr);
          
          progressData.push({
            date: dayLabel,
            score: dayStat ? dayStat.daily_avg_score : 0
          });
        }

        // Format recent tests
        const recentTests: RecentTest[] = ((recentRes.data || []) as any[]).map((test: any) => ({
          id: test.id,
          category: test.category,
          testNumber: test.test_number || '1',
          score: Number(test.percentage),
          date: new Date(test.completed_at).toLocaleDateString(),
          passed: Number(test.percentage) >= 80,
        }));

        return {
          stats: {
            totalTests: statsData.total_tests,
            averageScore: statsData.average_score,
            bestScore: statsData.best_score,
            testsThisWeek: statsData.tests_this_week,
            streak: streak, // Calculated locally for now
            passedTests: statsData.passed_tests,
            failedTests: statsData.failed_tests,
          },
          progressData,
          recentTests,
        };

      } catch (error) {
        console.error('Dashboard stats error:', error);
        // Fallback to empty result if RPC fails (e.g. if migration not run)
        return emptyResult;
      }
    },
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Get paginated test history
export function useTestHistory(userId?: string, page: number = 1, pageSize: number = 6) {
  const supabase = useSupabase();
  return useQuery({
    queryKey: ['test-history', userId, page, pageSize],
    queryFn: async () => {
      
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
    staleTime: 0,
    refetchOnMount: 'always',
  });
}

// Delete test attempt
export function useDeleteTestAttempt() {
  const queryClient = useQueryClient();
  const supabase = useSupabase();
  
  return useMutation({
    mutationFn: async (testId: string) => {
      
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
  const supabase = useSupabase();
  
  return useMutation({
    mutationFn: async (userId: string) => {
      
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
  const supabase = useSupabase();
  return useQuery({
    queryKey: ['test-count', category],
    queryFn: async () => {
      
      const { data, error } = await supabase
        .from('admin_questions')
        .select('test_number')
        .eq('category', category);

      if (error) throw error;
      
      // Get unique test numbers
      const uniqueTests = [...new Set(((data || []) as any[]).map(q => q.test_number))];
      return uniqueTests.length;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes - test count doesn't change often
    enabled: enabled && !!category,
  });
}

// Get overall weak-topic statistics across all past tests for a user
export function useWeakTopics(userId?: string) {
  const supabase = useSupabase();
  return useQuery<WeakTopicsSummary>({
    queryKey: ['weak-topics', userId],
    queryFn: async () => {

      // 1) Get all test attempts for this user (limit to last 50 for performance/stability)
      const { data: attempts, error: attemptsError } = await supabase
        .from('test_attempts')
        .select('id')
        .eq('user_id', userId!)
        .order('completed_at', { ascending: false })
        .limit(50);

      if (attemptsError) throw attemptsError;
      const attemptIds = ((attempts || []) as any[]).map(a => a.id);
      if (attemptIds.length === 0) {
        return { topics: [], weakTopics: [], dominantCategory: null };
      }

      // 2) Get all answers for those attempts
      const { data: answers, error: answersError } = await supabase
        .from('test_attempt_answers')
        .select('question_id, is_correct')
        .in('test_attempt_id', attemptIds);

      if (answersError) throw answersError;
      if (!answers || answers.length === 0) {
        return { topics: [], weakTopics: [], dominantCategory: null };
      }

      const questionIds = [...new Set((answers as any[]).map(a => a.question_id))];

      // 3) Get topics AND categories for those questions
      const { data: questions, error: questionsError } = await supabase
        .from('admin_questions')
        .select('id, topic, category')
        .in('id', questionIds);

      if (questionsError) throw questionsError;

      const topicByQuestionId = new Map<string, { topic: string | null, category: string | null }>();
      ((questions || []) as any[]).forEach((q: { id: string; topic: string | null; category: string | null }) => {
        topicByQuestionId.set(q.id, { topic: q.topic ?? null, category: q.category ?? null });
      });

      const topicStatsMap: Record<string, { total: number; correct: number; category: string | null }> = {};

      (answers as any[]).forEach((ans: { question_id: string; is_correct: boolean }) => {
        const info = topicByQuestionId.get(ans.question_id);
        if (!info || !info.topic) return;

        const topic = info.topic;
        if (!topicStatsMap[topic]) {
          topicStatsMap[topic] = { total: 0, correct: 0, category: info.category };
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

      // Determine dominant category from weak topics
      const categoryCounts: Record<string, number> = {};
      weakTopics.forEach(wt => {
        const cat = topicStatsMap[wt.topic]?.category;
        if (cat) {
          categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
        }
      });
      
      let dominantCategory: string | null = null;
      let maxCount = 0;
      Object.entries(categoryCounts).forEach(([cat, count]) => {
        if (count > maxCount) {
          maxCount = count;
          dominantCategory = cat;
        }
      });

      // Fallback: if no dominant category found from weak topics (e.g. empty), use the most frequent category from all topics
      if (!dominantCategory && topics.length > 0) {
         const allCategoryCounts: Record<string, number> = {};
         Object.values(topicStatsMap).forEach(stats => {
            if (stats.category) {
               allCategoryCounts[stats.category] = (allCategoryCounts[stats.category] || 0) + 1;
            }
         });
         let allMaxCount = 0;
         Object.entries(allCategoryCounts).forEach(([cat, count]) => {
            if (count > allMaxCount) {
               allMaxCount = count;
               dominantCategory = cat;
            }
         });
      }

      return { topics, weakTopics, dominantCategory };
    },
    enabled: !!userId,
    staleTime: 2 * 60 * 1000,
  });
}
