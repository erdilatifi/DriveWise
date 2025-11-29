import { useQuery } from '@tanstack/react-query';
import { useSupabase } from '../contexts/supabase-context';

export type Category = 'A' | 'B' | 'C' | 'D';

export interface ScenarioOption {
  text: string;
  isCorrect: boolean;
  explanation?: string;
}

export interface Scenario {
  id: string;
  category: string;
  topic?: string;
  level: number;
  question: string;
  image_url: string | null;
  options: ScenarioOption[];
  correct_explanation: string;
  real_world_tip: string;
  xp: number;
  is_active: boolean;
  chapter_id?: number | null;
  is_published?: boolean;
}

export function useScenarios(category?: Category, topic?: string) {
  const supabase = useSupabase();
  return useQuery({
    queryKey: ['scenarios', category, topic],
    queryFn: async () => {
      
      const buildQuery = () => {
        let q = supabase
          .from('decision_trainer_scenarios')
          .select('*')
          .eq('is_active', true)
          .order('level', { ascending: true });

        if (category) {
          q = q.eq('category', category);
        }
        if (topic) {
          q = q.eq('topic', topic);
        }
        return q;
      };

      // Prefer published-only scenarios when the column exists
      const { data, error } = await buildQuery().eq('is_published', true);

      // If the is_published column does not exist yet (migration not run),
      // fall back to only filtering by is_active so scenarios still appear.
      if (error) {
        // Postgres undefined_column error
        const pgError = error as { code?: string };
        if (pgError.code === '42703') {
          const { data: fallbackData, error: fallbackError } = await buildQuery();
          if (fallbackError) throw fallbackError;
          return fallbackData as Scenario[];
        }
        throw error;
      }

      return data as Scenario[];
    },
    // Always refetch when the component mounts or the window gains focus
    // so that newly added scenarios in the admin panel are visible immediately.
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  });
}

export function useScenario(id: string) {
  const supabase = useSupabase();
  return useQuery({
    queryKey: ['scenario', id],
    queryFn: async () => {
      
      const { data, error } = await supabase
        .from('decision_trainer_scenarios')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Scenario;
    },
    enabled: !!id,
  });
}
