import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/utils/supabase/client';

export interface UserProgress {
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

export interface ProgressUpdate {
  category: string;
  xp_gained: number;
  is_correct: boolean;
  time_seconds?: number;
}

// Fetch user's progress for all categories
export function useUserProgress(userId?: string) {
  return useQuery({
    queryKey: ['user-progress', userId],
    queryFn: async () => {
      const supabase = createClient();
      
      const { data, error } = await supabase
        .from('decision_trainer_progress')
        .select('*')
        .eq('user_id', userId!)
        .order('category');

      if (error) throw error;
      return (data || []) as UserProgress[];
    },
    enabled: !!userId,
    staleTime: 0,
    refetchOnMount: 'always',
  });
}

// Fetch progress for specific category
export function useCategoryProgress(userId?: string, category?: string) {
  return useQuery({
    queryKey: ['category-progress', userId, category],
    queryFn: async () => {
      const supabase = createClient();
      
      const { data, error } = await supabase
        .from('decision_trainer_progress')
        .select('*')
        .eq('user_id', userId!)
        .eq('category', category!)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = not found
      return data as UserProgress | null;
    },
    enabled: !!userId && !!category,
    staleTime: 0,
    refetchOnMount: 'always',
  });
}

// Update progress after completing a scenario
export function useUpdateProgress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, update }: { userId: string; update: ProgressUpdate }) => {
      const supabase = createClient();
      
      // Get current progress
      const { data: current } = await supabase
        .from('decision_trainer_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('category', update.category)
        .single();

      const newStreak = update.is_correct ? (current?.current_streak || 0) + 1 : 0;
      const newBestStreak = Math.max(newStreak, current?.best_streak || 0);
      
      // Calculate new time stats
      let newBestTime = current?.best_time_seconds;
      let newAvgTime = current?.average_time_seconds;
      
      if (update.time_seconds) {
        if (!newBestTime || update.time_seconds < newBestTime) {
          newBestTime = update.time_seconds;
        }
        
        const totalAttempts = (current?.total_attempts || 0) + 1;
        const currentTotal = (current?.average_time_seconds || 0) * (current?.total_attempts || 0);
        newAvgTime = Math.round((currentTotal + update.time_seconds) / totalAttempts);
      }

      const progressData = {
        user_id: userId,
        category: update.category,
        total_xp: (current?.total_xp || 0) + update.xp_gained,
        scenarios_completed: (current?.scenarios_completed || 0) + 1,
        correct_answers: (current?.correct_answers || 0) + (update.is_correct ? 1 : 0),
        total_attempts: (current?.total_attempts || 0) + 1,
        current_streak: newStreak,
        best_streak: newBestStreak,
        best_time_seconds: newBestTime,
        average_time_seconds: newAvgTime,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('decision_trainer_progress')
        .upsert(progressData, { onConflict: 'user_id,category' })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['user-progress', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['category-progress', variables.userId, variables.update.category] });
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
    },
  });
}

// Get user's total stats across all categories
export function useUserStats(userId?: string) {
  return useQuery({
    queryKey: ['user-stats', userId],
    queryFn: async () => {
      const supabase = createClient();
      
      const { data, error } = await supabase
        .from('decision_trainer_progress')
        .select('*')
        .eq('user_id', userId!);

      if (error) throw error;
      
      const progress = data || [];
      
      return {
        totalXP: progress.reduce((sum, p) => sum + p.total_xp, 0),
        totalScenarios: progress.reduce((sum, p) => sum + p.scenarios_completed, 0),
        totalCorrect: progress.reduce((sum, p) => sum + p.correct_answers, 0),
        totalAttempts: progress.reduce((sum, p) => sum + p.total_attempts, 0),
        bestStreak: Math.max(...progress.map(p => p.best_streak), 0),
        categoriesCompleted: progress.length,
        accuracy: progress.reduce((sum, p) => sum + p.total_attempts, 0) > 0
          ? Math.round((progress.reduce((sum, p) => sum + p.correct_answers, 0) / progress.reduce((sum, p) => sum + p.total_attempts, 0)) * 100)
          : 0,
      };
    },
    enabled: !!userId,
    staleTime: 0,
    refetchOnMount: 'always',
  });
}
