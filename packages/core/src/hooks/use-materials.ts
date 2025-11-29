import { useQuery } from '@tanstack/react-query';
import { useSupabase } from '../contexts/supabase-context';
import type { LicenseCategory } from '../types/database';

type MaterialContent = Record<string, unknown>;

export interface Material {
  id: string;
  chapter_id: number;
  category?: LicenseCategory | null;
  title: string;
  content: MaterialContent;
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
  caption?: string | null;
  order_index?: number | null;
  created_at: string;
  updated_at: string;
}

export interface MaterialsQueryParams {
  search?: string;
  chapterId?: number;
  category?: LicenseCategory;
  page?: number;
  pageSize?: number;
  includeUnpublished?: boolean;
  fields?: string; // Allow selecting specific columns
}

export interface MaterialsPageResult {
  materials: Material[];
  total: number;
}

// Fetch materials with optional pagination and filters, including related images
export function useMaterials(params: MaterialsQueryParams = {}) {
  const {
    search,
    chapterId,
    category,
    page = 1,
    pageSize = 50,
    includeUnpublished = false,
    fields = '*',
  } = params;
  const supabase = useSupabase();

  return useQuery<MaterialsPageResult>({
    queryKey: ['materials', search, chapterId, category, page, pageSize, includeUnpublished, fields],
    queryFn: async () => {
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      // Select specific fields if provided, otherwise *
      let query = supabase
        .from('study_materials')
        .select(fields, { count: 'planned' })
        .order('order_index', { ascending: true });

      if (chapterId) {
        query = query.eq('chapter_id', chapterId);
      }

      if (category) {
        query = query.eq('category', category);
      }

      if (!includeUnpublished) {
        query = query.eq('is_published', true);
      }

      if (search && search.trim()) {
        const term = search.trim();
        query = query.ilike('title', `%${term}%`);
      }

      const { data, error, count } = await query.range(from, to);

      if (error) throw error;

      const materials = (data || []) as unknown as Material[];
      
      // Only fetch images if we are fetching full content or specifically requested
      if (fields !== '*') {
         return {
            materials,
            total: count || 0,
         };
      }

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
  const supabase = useSupabase();

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
