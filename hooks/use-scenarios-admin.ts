import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/utils/supabase/client';
import { toast } from 'sonner';

export interface ScenarioFilters {
  search?: string;
  category?: string;
  level?: number;
  status?: 'active' | 'inactive' | 'all';
}

export interface PaginationOptions {
  page: number;
  pageSize: number;
}

export interface Scenario {
  id: string;
  category: string;
  level: number;
  question: string;
  image_url?: string;
  options: any[];
  correct_explanation: string;
  real_world_tip: string;
  xp: number;
  is_active: boolean;
  is_published?: boolean;
  created_at?: string;
}

export interface ScenarioInput {
  category: string;
  level: number;
  question: string;
  image_url?: string;
  options: any[];
  correct_explanation: string;
  real_world_tip: string;
  xp: number;
  is_active?: boolean;
  is_published?: boolean;
}

// Optimized hook for fetching scenarios with pagination and filtering
export function useScenarios(filters: ScenarioFilters = {}, pagination: PaginationOptions) {
  return useQuery({
    queryKey: ['admin-scenarios', filters, pagination],
    queryFn: async () => {
      const supabase = createClient();
      
      // Build query with filters
      let query = supabase
        .from('decision_trainer_scenarios')
        .select('*', { count: 'exact' });
      
      // Apply search filter
      if (filters.search?.trim()) {
        query = query.or(`question.ilike.%${filters.search}%,correct_explanation.ilike.%${filters.search}%,real_world_tip.ilike.%${filters.search}%`);
      }
      
      // Apply category filter
      if (filters.category && filters.category !== 'all') {
        query = query.eq('category', filters.category);
      }
      
      // Apply level filter
      if (filters.level) {
        query = query.eq('level', filters.level);
      }
      
      // Apply status filter
      if (filters.status && filters.status !== 'all') {
        query = query.eq('is_active', filters.status === 'active');
      }
      
      // Apply pagination
      const from = (pagination.page - 1) * pagination.pageSize;
      const to = from + pagination.pageSize - 1;
      
      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) {
        console.error('Error fetching scenarios:', error);
        throw error;
      }
      
      return {
        scenarios: data || [],
        totalCount: count || 0,
        totalPages: Math.ceil((count || 0) / pagination.pageSize),
        currentPage: pagination.page,
        hasNextPage: pagination.page < Math.ceil((count || 0) / pagination.pageSize),
        hasPrevPage: pagination.page > 1,
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook for creating a new scenario
export function useCreateScenario() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (scenarioData: ScenarioInput) => {
      const supabase = createClient();
      
      const { data, error } = await supabase
        .from('decision_trainer_scenarios')
        .insert([{ 
          ...scenarioData, 
          is_active: true,
          is_published: scenarioData.is_published ?? true,
        }])
        .select()
        .single();
      
      if (error) {
        console.error('Error creating scenario:', error);
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      // Invalidate all scenario queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ['admin-scenarios'] });
      toast.success('Scenario created successfully!');
    },
    onError: (error: Error) => {
      console.error('Failed to create scenario:', error);
      if (error.message.includes('23505')) {
        toast.error('A scenario with this ID already exists');
      } else if (error.message.includes('42501')) {
        toast.error('Permission denied. Please check your admin privileges.');
      } else {
        toast.error('Failed to create scenario: ' + error.message);
      }
    },
  });
}

// Hook for updating a scenario
export function useUpdateScenario() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, scenarioData }: { id: string; scenarioData: Partial<ScenarioInput> }) => {
      const supabase = createClient();
      
      const { data, error } = await supabase
        .from('decision_trainer_scenarios')
        .update(scenarioData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating scenario:', error);
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-scenarios'] });
      toast.success('Scenario updated successfully!');
    },
    onError: (error: Error) => {
      console.error('Failed to update scenario:', error);
      toast.error('Failed to update scenario: ' + error.message);
    },
  });
}

// Hook for deleting a scenario
export function useDeleteScenario() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const supabase = createClient();
      
      const { error } = await supabase
        .from('decision_trainer_scenarios')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting scenario:', error);
        throw error;
      }
      
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-scenarios'] });
      toast.success('Scenario deleted successfully!');
    },
    onError: (error: Error) => {
      console.error('Failed to delete scenario:', error);
      toast.error('Failed to delete scenario: ' + error.message);
    },
  });
}

// Hook for bulk operations
export function useBulkScenarioOperations() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      operation, 
      scenarioIds, 
      data 
    }: { 
      operation: 'activate' | 'deactivate' | 'delete' | 'update';
      scenarioIds: string[];
      data?: Partial<ScenarioInput>;
    }) => {
      const supabase = createClient();
      
      switch (operation) {
        case 'activate':
          const { error: activateError } = await supabase
            .from('decision_trainer_scenarios')
            .update({ is_active: true })
            .in('id', scenarioIds);
          if (activateError) throw activateError;
          break;
          
        case 'deactivate':
          const { error: deactivateError } = await supabase
            .from('decision_trainer_scenarios')
            .update({ is_active: false })
            .in('id', scenarioIds);
          if (deactivateError) throw deactivateError;
          break;
          
        case 'delete':
          const { error: deleteError } = await supabase
            .from('decision_trainer_scenarios')
            .delete()
            .in('id', scenarioIds);
          if (deleteError) throw deleteError;
          break;
          
        case 'update':
          if (!data) throw new Error('Data is required for update operation');
          const { error: updateError } = await supabase
            .from('decision_trainer_scenarios')
            .update(data)
            .in('id', scenarioIds);
          if (updateError) throw updateError;
          break;
      }
      
      return { operation, scenarioIds };
    },
    onSuccess: ({ operation, scenarioIds }) => {
      queryClient.invalidateQueries({ queryKey: ['admin-scenarios'] });
      
      const operationNames = {
        activate: 'activated',
        deactivate: 'deactivated', 
        delete: 'deleted',
        update: 'updated'
      };
      
      toast.success(`${scenarioIds.length} scenario(s) ${operationNames[operation]} successfully!`);
    },
    onError: (error: Error) => {
      console.error('Bulk operation failed:', error);
      toast.error('Bulk operation failed: ' + error.message);
    },
  });
}

// Hook for scenario statistics
export function useScenarioStats() {
  return useQuery({
    queryKey: ['scenario-stats'],
    queryFn: async () => {
      const supabase = createClient();
      
      // Get total count
      const { count: totalCount } = await supabase
        .from('decision_trainer_scenarios')
        .select('*', { count: 'exact', head: true });
      
      // Get active count
      const { count: activeCount } = await supabase
        .from('decision_trainer_scenarios')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);
      
      // Get count by category
      const { data: categoryData } = await supabase
        .from('decision_trainer_scenarios')
        .select('category')
        .eq('is_active', true);
      
      const categoryStats = categoryData?.reduce((acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};
      
      // Get count by level
      const { data: levelData } = await supabase
        .from('decision_trainer_scenarios')
        .select('level')
        .eq('is_active', true);
      
      const levelStats = levelData?.reduce((acc, item) => {
        acc[item.level] = (acc[item.level] || 0) + 1;
        return acc;
      }, {} as Record<number, number>) || {};
      
      return {
        totalCount: totalCount || 0,
        activeCount: activeCount || 0,
        inactiveCount: (totalCount || 0) - (activeCount || 0),
        categoryStats,
        levelStats,
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
