import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/utils/supabase/client';
import { UserProfile } from '@/types/database';

export interface UsersQueryParams {
  search?: string;
  role?: 'all' | 'admin' | 'user';
  isPremium?: boolean;
  page: number;
  pageSize: number;
}

export interface UsersPageResult {
  users: UserProfile[];
  total: number;
}

// Fetch users with server-side pagination and optional filters
export function useUsers({ search, role = 'all', isPremium, page, pageSize }: UsersQueryParams) {
  const supabase = createClient();

  return useQuery<UsersPageResult>({
    queryKey: ['users', search, role, isPremium, page, pageSize],
    queryFn: async () => {
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      let query = supabase
        .from('user_profiles')
        .select('*', { count: 'exact' })
        .order('is_admin', { ascending: false })
        .order('created_at', { ascending: false });

      if (search && search.trim()) {
        const term = search.trim();
        query = query.or(`email.ilike.%${term}%,full_name.ilike.%${term}%`);
      }

      if (role === 'admin') {
        query = query.eq('is_admin', true);
      } else if (role === 'user') {
        query = query.eq('is_admin', false);
      }

      if (isPremium !== undefined) {
        query = query.eq('is_premium', isPremium);
      }

      const { data, error, count } = await query.range(from, to);

      if (error) throw error;

      return {
        users: (data || []) as UserProfile[],
        total: count || 0,
      };
    },
  });
}

// Update user role/status
export function useUpdateUser() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<UserProfile> & { id: string }) => {
      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

// Delete user
export function useDeleteUser() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('user_profiles')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}
