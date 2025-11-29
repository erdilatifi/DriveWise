import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSupabase } from '../contexts/supabase-context';

export interface DecisionTrainerProgress {
  id: string;
  user_id: string;
  category: string;
  total_xp: number;
  scenarios_completed: number;
  correct_answers: number;
  total_attempts: number;
  current_streak: number;
  best_streak: number;
  best_time_seconds: number | null;
  average_time_seconds: number | null;
  created_at: string;
  updated_at: string;
}

export interface DecisionTrainerAttempt {
  id: string;
  user_id: string;
  scenario_id: string;
  category: string;
  is_correct: boolean;
  selected_options: number[];
  time_taken_ms: number;
  xp_earned: number;
  created_at: string;
}

// Get user's progress for a specific category
export function useDecisionTrainerProgress(userId?: string, category?: string) {
  const supabase = useSupabase();
  return useQuery({
    queryKey: ['decision-trainer-progress', userId, category],
    queryFn: async () => {
      
      let query = supabase
        .from('decision_trainer_progress')
        .select('*')
        .eq('user_id', userId!);
      
      if (category) {
        query = query.eq('category', category);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    },
    enabled: !!userId,
    staleTime: 0,
    refetchOnMount: 'always',
  });
}

// Get user's overall stats across all categories
export function useDecisionTrainerStats(userId?: string) {
  const supabase = useSupabase();
  return useQuery({
    queryKey: ['decision-trainer-stats', userId],
    queryFn: async () => {
      
      const { data, error } = await supabase
        .from('decision_trainer_progress')
        .select('*')
        .eq('user_id', userId!)
        .returns<DecisionTrainerProgress[]>(); // Explicitly cast return type

      if (error) throw error;

      const progress = data || [];
      
      // Calculate overall stats
      const totalXp = progress.reduce((sum: number, p) => sum + (p.total_xp || 0), 0);
      const totalScenarios = progress.reduce((sum: number, p) => sum + (p.scenarios_completed || 0), 0);
      const totalCorrect = progress.reduce((sum: number, p) => sum + (p.correct_answers || 0), 0);
      const totalAttempts = progress.reduce((sum: number, p) => sum + (p.total_attempts || 0), 0);
      const bestStreak = Math.max(...progress.map(p => p.best_streak || 0), 0);
      const bestTime = Math.min(
        ...progress.map(p => p.best_time_seconds).filter((t): t is number => t !== null), 
        Infinity
      );
      const accuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;

      return {
        totalXp,
        totalScenarios,
        totalCorrect,
        totalAttempts,
        bestStreak,
        bestTime: bestTime === Infinity ? null : bestTime,
        accuracy,
        categoriesCompleted: progress.length,
        categoryProgress: progress,
      };
    },
    enabled: !!userId,
    staleTime: 60 * 1000, // 1 minute
  });
}

// Get IDs of scenarios where the user's latest attempt was incorrect
export function useWeakScenarioIds(userId?: string) {
  const supabase = useSupabase();
  return useQuery({
    queryKey: ['weak-scenario-ids', userId],
    queryFn: async () => {
      
      // Get all attempts for this user, ordered by date
      const { data, error } = await supabase
        .from('decision_trainer_attempts')
        .select('scenario_id, is_correct, created_at')
        .eq('user_id', userId!)
        .order('created_at', { ascending: true })
        .returns<Pick<DecisionTrainerAttempt, 'scenario_id' | 'is_correct'>[]>(); // Explicitly cast

      if (error) throw error;

      // Calculate latest status for each scenario
      const latestStatus = new Map<string, boolean>();
      (data || []).forEach((attempt) => {
        latestStatus.set(attempt.scenario_id, attempt.is_correct);
      });

      // Filter for IDs where the latest attempt was FALSE (incorrect)
      const weakIds: string[] = [];
      latestStatus.forEach((isCorrect, id) => {
        if (!isCorrect) {
          weakIds.push(id);
        }
      });

      return weakIds;
    },
    enabled: !!userId,
    staleTime: 0, // Always fresh
  });
}

// Submit scenario attempt and update progress
export function useSubmitScenarioAttempt() {
  const queryClient = useQueryClient();
  const supabase = useSupabase();
  
  return useMutation({
    mutationFn: async ({
      userId,
      scenarioId,
      category,
      isCorrect,
      selectedOptions,
      timeTakenMs,
      xpEarned,
    }: {
      userId: string;
      scenarioId: string;
      category: string;
      isCorrect: boolean;
      selectedOptions: number[];
      timeTakenMs: number;
      xpEarned: number;
    }) => {

      // 1. Insert the attempt record
      const { data: attempt, error: attemptError } = await supabase
        .from('decision_trainer_attempts')
        .insert({
          user_id: userId,
          scenario_id: scenarioId,
          category,
          is_correct: isCorrect,
          selected_options: selectedOptions,
          time_taken_ms: timeTakenMs,
          xp_earned: xpEarned,
        } as any)
        .select()
        .single();

      if (attemptError) throw attemptError;

      // 2. Get current progress for this category
      const { data: currentProgressData } = await supabase
        .from('decision_trainer_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('category', category)
        .maybeSingle();
        
      const currentProgress = currentProgressData as DecisionTrainerProgress | null;

      // 3. Calculate new progress values
      const newTotalXp = (currentProgress?.total_xp || 0) + xpEarned;
      const newScenariosCompleted = (currentProgress?.scenarios_completed || 0) + 1;
      const newCorrectAnswers = (currentProgress?.correct_answers || 0) + (isCorrect ? 1 : 0);
      const newTotalAttempts = (currentProgress?.total_attempts || 0) + 1;
      
      // Calculate streak
      let newCurrentStreak = 0;
      let newBestStreak = currentProgress?.best_streak || 0;
      
      if (isCorrect) {
        newCurrentStreak = (currentProgress?.current_streak || 0) + 1;
        newBestStreak = Math.max(newBestStreak, newCurrentStreak);
      } else {
        newCurrentStreak = 0;
      }

      // Calculate time stats
      const timeInSeconds = Math.round(timeTakenMs / 1000);
      const newBestTime = currentProgress?.best_time_seconds 
        ? Math.min(currentProgress.best_time_seconds, timeInSeconds)
        : timeInSeconds;
      
      // Calculate average time
      const totalTimeMs = (currentProgress?.average_time_seconds || 0) * (currentProgress?.total_attempts || 0) * 1000 + timeTakenMs;
      const newAverageTime = Math.round(totalTimeMs / newTotalAttempts / 1000);

      // 4. Upsert progress record
      const { data: progress, error: progressError } = await supabase
        .from('decision_trainer_progress')
        .upsert({
          user_id: userId,
          category,
          total_xp: newTotalXp,
          scenarios_completed: newScenariosCompleted,
          correct_answers: newCorrectAnswers,
          total_attempts: newTotalAttempts,
          current_streak: newCurrentStreak,
          best_streak: newBestStreak,
          best_time_seconds: newBestTime,
          average_time_seconds: newAverageTime,
          updated_at: new Date().toISOString(),
        } as any, {
          onConflict: 'user_id,category'
        })
        .select()
        .single();

      if (progressError) throw progressError;

      return {
        attempt,
        progress,
        newStats: {
          totalXp: newTotalXp,
          scenariosCompleted: newScenariosCompleted,
          correctAnswers: newCorrectAnswers,
          totalAttempts: newTotalAttempts,
          currentStreak: newCurrentStreak,
          bestStreak: newBestStreak,
          accuracy: Math.round((newCorrectAnswers / newTotalAttempts) * 100),
        }
      };
    },
    onSuccess: (_, variables) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['decision-trainer-progress', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['decision-trainer-stats', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
    },
  });
}

// Complete category session (batch update for multiple scenarios)
export function useCompleteCategory() {
  const queryClient = useQueryClient();
  const supabase = useSupabase();
  
  return useMutation({
    mutationFn: async ({
      userId,
      category,
      attempts,
      totalTimeMs,
    }: {
      userId: string;
      category: string;
      attempts: Array<{
        scenarioId: string;
        isCorrect: boolean;
        selectedOptions: number[];
        timeTakenMs: number;
        xpEarned: number;
      }>;
      totalTimeMs: number;
    }) => {

      // Insert all attempts
      const attemptRecords = attempts.map(attempt => ({
        user_id: userId,
        scenario_id: attempt.scenarioId,
        category,
        is_correct: attempt.isCorrect,
        selected_options: attempt.selectedOptions,
        time_taken_ms: attempt.timeTakenMs,
        xp_earned: attempt.xpEarned,
      }));

      const { error: attemptsError } = await supabase
        .from('decision_trainer_attempts')
        .insert(attemptRecords as any);

      if (attemptsError) throw attemptsError;

      // Calculate session stats
      const totalXpEarned = attempts.reduce((sum, a) => sum + a.xpEarned, 0);
      const correctCount = attempts.filter(a => a.isCorrect).length;
      const totalCount = attempts.length;
      
      // Calculate streak (consecutive correct answers)
      let maxStreak = 0;
      let currentStreak = 0;
      for (const attempt of attempts) {
        if (attempt.isCorrect) {
          currentStreak++;
          maxStreak = Math.max(maxStreak, currentStreak);
        } else {
          currentStreak = 0;
        }
      }

      // Get current progress
      const { data: currentProgressData } = await supabase
        .from('decision_trainer_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('category', category)
        .maybeSingle();
        
      const currentProgress = currentProgressData as DecisionTrainerProgress | null;

      // Update progress
      const newTotalXp = (currentProgress?.total_xp || 0) + totalXpEarned;
      const newScenariosCompleted = (currentProgress?.scenarios_completed || 0) + totalCount;
      const newCorrectAnswers = (currentProgress?.correct_answers || 0) + correctCount;
      const newTotalAttempts = (currentProgress?.total_attempts || 0) + totalCount;
      const newBestStreak = Math.max(currentProgress?.best_streak || 0, maxStreak);
      
      const avgTimeSeconds = Math.round(totalTimeMs / totalCount / 1000);
      const newBestTime = currentProgress?.best_time_seconds 
        ? Math.min(currentProgress.best_time_seconds, avgTimeSeconds)
        : avgTimeSeconds;

      const { data: progress, error: progressError } = await supabase
        .from('decision_trainer_progress')
        .upsert({
          user_id: userId,
          category,
          total_xp: newTotalXp,
          scenarios_completed: newScenariosCompleted,
          correct_answers: newCorrectAnswers,
          total_attempts: newTotalAttempts,
          current_streak: maxStreak, // Set to session streak
          best_streak: newBestStreak,
          best_time_seconds: newBestTime,
          average_time_seconds: avgTimeSeconds,
          updated_at: new Date().toISOString(),
        } as any, {
          onConflict: 'user_id,category'
        })
        .select()
        .single();

      if (progressError) throw progressError;

      return {
        progress,
        sessionStats: {
          totalXpEarned,
          correctCount,
          totalCount,
          accuracy: Math.round((correctCount / totalCount) * 100),
          maxStreak,
          avgTimeSeconds,
        }
      };
    },
    onSuccess: (_, variables) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['decision-trainer-progress', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['decision-trainer-stats', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
    },
  });
}
