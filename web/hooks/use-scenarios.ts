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
  topic: string;
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

export const TOPIC_MAPPING: Record<string, string> = {
  'traffic-lights': 'traffic_lights',
  'signs': 'road_signs',
  'pedestrians': 'pedestrian_safety',
  'right-of-way': 'right_of_way',
  'hazards': 'road_hazard',
  'parking': 'parking_rules',
};

export const REVERSE_TOPIC_MAPPING: Record<string, string> = Object.entries(TOPIC_MAPPING).reduce(
  (acc, [k, v]) => ({ ...acc, [v]: k }),
  {}
);

export function useScenarios(category?: Category, licenseCategory: string = 'B') {
  return useQuery({
    queryKey: ['scenarios', category, licenseCategory],
    queryFn: async () => {
      const supabase = createClient();
      
      const buildQuery = () => {
        let q = supabase
          .from('decision_trainer_scenarios')
          .select('*')
          .eq('is_active', true)
          .order('level', { ascending: true });

        if (category) {
          // Map frontend category (kebab-case) to DB topic (snake_case)
          const dbTopic = TOPIC_MAPPING[category] || category;
          q = q.eq('topic', dbTopic);
        }
        
        // Filter by license category (e.g. 'B')
        if (licenseCategory) {
          q = q.eq('category', licenseCategory);
        }

        return q;
      };

      // Prefer published-only scenarios when the column exists
      const { data, error } = await buildQuery().eq('is_published', true);

      let resultData: Scenario[] = [];

      // If the is_published column does not exist yet (migration not run),
      // fall back to only filtering by is_active so scenarios still appear.
      if (error) {
        // Postgres undefined_column error
        const pgError = error as { code?: string };
        if (pgError.code === '42703') {
          const { data: fallbackData, error: fallbackError } = await buildQuery();
          if (fallbackError) throw fallbackError;
          resultData = fallbackData as Scenario[];
        } else {
          throw error;
        }
      } else {
        resultData = data as Scenario[];
      }

      // Transform DB data to match frontend expectations
      // Map DB topic (snake_case) back to frontend category (kebab-case)
      return resultData.map(scenario => ({
        ...scenario,
        category: REVERSE_TOPIC_MAPPING[scenario.topic] || scenario.category
      }));
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
