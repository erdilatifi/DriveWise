import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/utils/supabase/client';

export interface TrafficSign {
  id: string;
  code: string;
  category: 'danger' | 'prohibition' | 'mandatory' | 'info';
  name: string;
  description: string;
  image_url: string;
  created_at: string;
  updated_at: string;
}

export interface TrafficSignInput {
  code: string;
  category: 'danger' | 'prohibition' | 'mandatory' | 'info';
  name: string;
  description: string;
  image_url: string;
}

export interface TrafficSignsQueryParams {
  category?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}

export function useTrafficSigns(params: TrafficSignsQueryParams = {}) {
  const { category, search, page = 1, pageSize = 50 } = params;
  const supabase = createClient();

  return useQuery({
    queryKey: ['traffic-signs', category, search, page, pageSize],
    queryFn: async () => {
      let query = supabase
        .from('traffic_signs')
        .select('*', { count: 'planned' })
        .order('code', { ascending: true });

      if (category && category !== 'all') {
        query = query.eq('category', category);
      }

      if (search) {
        query = query.or(`name.ilike.%${search}%,code.ilike.%${search}%`);
      }

      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      const { data, error, count } = await query.range(from, to);

      if (error) throw error;

      const signsWithUrls = (data || []).map((sign: any) => {
        if (sign.image_url && !sign.image_url.startsWith('http')) {
          const { data: { publicUrl } } = supabase.storage
            .from('signs')
            .getPublicUrl(sign.image_url);
          return { ...sign, image_url: publicUrl };
        }
        return sign;
      });

      return {
        signs: signsWithUrls as TrafficSign[],
        total: count || 0,
      };
    },
  });
}

export function useUpdateTrafficSign() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<TrafficSignInput> & { id: string }) => {
      const { data, error } = await supabase
        .from('traffic_signs')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as TrafficSign;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['traffic-signs'] });
    },
  });
}

export function useDeleteTrafficSign() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('traffic_signs')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['traffic-signs'] });
    },
  });
}

export function useUploadSignImage() {
  const supabase = createClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const ext = file.name.split('.').pop() || 'png';
      const unique = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const filePath = `signs/${unique}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('signs')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from('signs').getPublicUrl(filePath);

      return publicUrl;
    },
  });
}
