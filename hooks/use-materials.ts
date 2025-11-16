import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/utils/supabase/client';

export interface Material {
  id: string;
  chapter_id: number;
  title_en: string;
  title_sq: string;
  content_en: Record<string, any>;
  content_sq: Record<string, any>;
  order_index: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  images?: MaterialImage[];
}

export interface MaterialImage {
  id: string;
  material_id: string;
  image_url: string;
  caption_en?: string | null;
  caption_sq?: string | null;
  order_index?: number | null;
  created_at: string;
  updated_at: string;
}

export interface MaterialInput {
  chapter_id: number;
  title_en: string;
  title_sq: string;
  content_en: Record<string, any>;
  content_sq: Record<string, any>;
  order_index: number;
  is_published?: boolean;
}

export interface MaterialImageInput {
  material_id: string;
  image_url: string;
  caption_en?: string;
  caption_sq?: string;
  order_index?: number;
}

export interface MaterialsQueryParams {
  search?: string;
  chapterId?: number;
  page?: number;
  pageSize?: number;
  includeUnpublished?: boolean;
}

export interface MaterialsPageResult {
  materials: Material[];
  total: number;
}

// Fetch materials with optional pagination and filters, including related images
export function useMaterials(params: MaterialsQueryParams = {}) {
  const { search, chapterId, page = 1, pageSize = 50, includeUnpublished = false } = params;
  const supabase = createClient();

  return useQuery<MaterialsPageResult>({
    queryKey: ['materials', search, chapterId, page, pageSize, includeUnpublished],
    queryFn: async () => {
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      let query = supabase
        .from('study_materials')
        .select('*', { count: 'exact' })
        .order('order_index', { ascending: true });

      if (chapterId) {
        query = query.eq('chapter_id', chapterId);
      }

      if (!includeUnpublished) {
        query = query.eq('is_published', true);
      }

      if (search && search.trim()) {
        const term = search.trim();
        query = query.or(`title_en.ilike.%${term}%,title_sq.ilike.%${term}%`);
      }

      const { data, error, count } = await query.range(from, to);

      if (error) throw error;

      const materials = (data || []) as Material[];
      const materialIds = materials.map((m) => m.id);

      let images: MaterialImage[] = [];
      if (materialIds.length > 0) {
        const { data: imageData, error: imageError } = await supabase
          .from('material_images')
          .select('*')
          .in('material_id', materialIds)
          .order('order_index', { ascending: true })
          .order('created_at', { ascending: true });

        if (imageError) throw imageError;
        images = (imageData || []) as MaterialImage[];
      }

      const materialsWithImages: Material[] = materials.map((material) => ({
        ...material,
        images: images.filter((img) => img.material_id === material.id),
      }));

      return {
        materials: materialsWithImages,
        total: count || 0,
      };
    },
  });
}

// Fetch a single material with its images
export function useMaterial(id: string) {
  const supabase = createClient();

  return useQuery<Material | null>({
    queryKey: ['material', id],
    queryFn: async () => {
      if (!id) return null;

      const { data, error } = await supabase
        .from('study_materials')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      const material = data as Material;

      const { data: imageData, error: imageError } = await supabase
        .from('material_images')
        .select('*')
        .eq('material_id', id)
        .order('order_index', { ascending: true })
        .order('created_at', { ascending: true });

      if (imageError) throw imageError;

      return {
        ...material,
        images: (imageData || []) as MaterialImage[],
      };
    },
    enabled: !!id,
  });
}

// Create material (admin only via RLS)
export function useCreateMaterial() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  return useMutation({
    mutationFn: async (material: MaterialInput) => {
      const { data, error } = await supabase
        .from('study_materials')
        .insert([material])
        .select()
        .single();

      if (error) {
        throw new Error(error.message || error.details || 'Failed to create material');
      }

      return data as Material;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materials'] });
    },
  });
}

// Update material
export function useUpdateMaterial() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<MaterialInput> & { id: string }) => {
      const { data, error } = await supabase
        .from('study_materials')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message || error.details || 'Failed to update material');
      }

      return data as Material;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['materials'] });
      queryClient.invalidateQueries({ queryKey: ['material', data.id] });
    },
  });
}

// Delete material
export function useDeleteMaterial() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('study_materials')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(error.message || 'Failed to delete material');
      }

      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materials'] });
    },
  });
}

// Create material image record (DB only - upload to storage separately)
export function useCreateMaterialImage() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  return useMutation({
    mutationFn: async (image: MaterialImageInput) => {
      const { data, error } = await supabase
        .from('material_images')
        .insert([image])
        .select()
        .single();

      if (error) {
        throw new Error(error.message || error.details || 'Failed to create material image');
      }

      return data as MaterialImage;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['material', data.material_id] });
      queryClient.invalidateQueries({ queryKey: ['materials'] });
    },
  });
}

// Delete material image
export function useDeleteMaterialImage() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from('material_images')
        .delete()
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message || 'Failed to delete material image');
      }

      return data as MaterialImage;
    },
    onSuccess: (data) => {
      if (data?.material_id) {
        queryClient.invalidateQueries({ queryKey: ['material', data.material_id] });
      }
      queryClient.invalidateQueries({ queryKey: ['materials'] });
    },
  });
}

// Upload a material image file to Supabase storage and return the public URL
export function useUploadMaterialImage() {
  const supabase = createClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const ext = file.name.split('.').pop() || 'jpg';
      const unique = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const filePath = `materials/${unique}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('material-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        throw new Error(uploadError.message || 'Failed to upload material image');
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from('material-images').getPublicUrl(filePath);

      return publicUrl as string;
    },
  });
}
