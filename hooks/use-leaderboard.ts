import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/utils/supabase/client';

export interface LeaderboardEntry {
  user_id: string;
  full_name: string;
  email: string;
  total_xp: number;
  total_scenarios: number;
  total_correct: number;
  total_attempts: number;
  best_streak: number;
  best_time_seconds: number | null;
  average_time_seconds: number | null;
  accuracy: number;
  categories_completed: number;
}

export function useLeaderboard() {
  return useQuery({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      const supabase = createClient();
      
      const { data, error } = await supabase
        .from('decision_trainer_leaderboard')
        .select('*')
        .limit(100);

      if (error) {
        console.error('Leaderboard error:', error);
        return [];
      }
      
      return (data || []) as LeaderboardEntry[];
    },
    staleTime: 30 * 1000, // 30 seconds - leaderboard updates frequently
    refetchInterval: 60 * 1000, // Auto-refresh every minute
  });
}
