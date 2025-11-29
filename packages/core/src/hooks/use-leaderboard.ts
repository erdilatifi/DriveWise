import { useQuery } from '@tanstack/react-query';
import { useSupabase } from '../contexts/supabase-context';

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

export function useLeaderboard(currentUserId?: string) {
  const supabase = useSupabase();
  return useQuery({
    queryKey: ['leaderboard', currentUserId],
    queryFn: async () => {
      
      // Get all leaderboard data to calculate ranks
      const { data: allData, error } = await supabase
        .from('decision_trainer_leaderboard')
        .select('*')
        .order('total_xp', { ascending: false })
        .order('best_time_seconds', { ascending: true });

      if (error) {
        console.error('Leaderboard error:', error);
        return { topTen: [], currentUserRank: null, totalUsers: 0 };
      }
      
      const leaderboard = (allData || []) as LeaderboardEntry[];
      const totalUsers = leaderboard.length;
      
      // Get top 10
      const topTen = leaderboard.slice(0, 10);
      
      // Find current user's rank and data
      let currentUserRank = null;
      if (currentUserId) {
        const userIndex = leaderboard.findIndex(entry => entry.user_id === currentUserId);
        if (userIndex !== -1) {
          currentUserRank = {
            ...leaderboard[userIndex],
            rank: userIndex + 1,
            isInTopTen: userIndex < 10
          };
        }
      }
      
      return {
        topTen,
        currentUserRank,
        totalUsers
      };
    },
    staleTime: 30 * 1000, // 30 seconds - leaderboard updates frequently
    refetchInterval: 60 * 1000, // Auto-refresh every minute
  });
}
