import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/utils/supabase/client';
import { Category } from '@/data/scenarios';

export interface ScenarioOption {
  text: string;
  isCorrect: boolean;
  explanation?: string;
}

export interface Scenario {
  id: string;
  category: string;
  level: number;
  question: string;
  image_url: string | null;
  options: ScenarioOption[];
  correct_explanation: string;
  real_world_tip: string;
  xp: number;
  is_active: boolean;
  chapter_id?: number | null;
}

export function useScenarios(category?: Category) {
  return useQuery({
    queryKey: ['scenarios', category],
    queryFn: async () => {
      const supabase = createClient();
      
      let query = supabase
        .from('decision_trainer_scenarios')
        .select('*')
        .eq('is_active', true)
        .order('level', { ascending: true });

      if (category) {
        query = query.eq('category', category);
      }

      const { data, error } = await query;

      if (error) throw error;
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
  return useQuery({
    queryKey: ['scenario', id],
    queryFn: async () => {
      const supabase = createClient();
      
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
