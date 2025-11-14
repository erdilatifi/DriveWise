import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/utils/supabase/client';

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
  return useQuery({
    queryKey: ['decision-trainer-progress', userId, category],
    queryFn: async () => {
      const supabase = createClient();
      
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
    staleTime: 60 * 1000, // 1 minute
  });
}

// Get user's overall stats across all categories
export function useDecisionTrainerStats(userId?: string) {
  return useQuery({
    queryKey: ['decision-trainer-stats', userId],
    queryFn: async () => {
      const supabase = createClient();
      
      const { data, error } = await supabase
        .from('decision_trainer_progress')
        .select('*')
        .eq('user_id', userId!);

      if (error) throw error;

      const progress = data || [];
      
      // Calculate overall stats
      const totalXp = progress.reduce((sum, p) => sum + p.total_xp, 0);
      const totalScenarios = progress.reduce((sum, p) => sum + p.scenarios_completed, 0);
      const totalCorrect = progress.reduce((sum, p) => sum + p.correct_answers, 0);
      const totalAttempts = progress.reduce((sum, p) => sum + p.total_attempts, 0);
      const bestStreak = Math.max(...progress.map(p => p.best_streak), 0);
      const bestTime = Math.min(...progress.map(p => p.best_time_seconds).filter(t => t !== null), Infinity);
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

// Submit scenario attempt and update progress
export function useSubmitScenarioAttempt() {
  const queryClient = useQueryClient();
  
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
      const supabase = createClient();

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
        })
        .select()
        .single();

      if (attemptError) throw attemptError;

      // 2. Get current progress for this category
      const { data: currentProgress } = await supabase
        .from('decision_trainer_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('category', category)
        .maybeSingle();

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
      const totalTimeMs = (currentProgress?.average_time_seconds || 0) * (currentProgress?.total_attempts || 0) + timeTakenMs;
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
        }, {
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
      const supabase = createClient();

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
        .insert(attemptRecords);

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
      const { data: currentProgress } = await supabase
        .from('decision_trainer_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('category', category)
        .maybeSingle();

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
        }, {
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
