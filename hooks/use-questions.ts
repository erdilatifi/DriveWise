import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/utils/supabase/client';

export interface Question {
  id: string;
  category: string;
  test_number: number;
  question_text: string;
  question_text_en?: string | null;
  question_text_sq?: string | null;
  option_a: string;
  option_a_en?: string | null;
  option_a_sq?: string | null;
  option_b: string;
  option_b_en?: string | null;
  option_b_sq?: string | null;
  option_c: string;
  option_c_en?: string | null;
  option_c_sq?: string | null;
  correct_answer: 'A' | 'B' | 'C';
  correct_answers?: ('A' | 'B' | 'C')[]; // Multiple correct answers support
  explanation_en?: string | null;
  explanation_sq?: string | null;
  image_url?: string;
  is_published?: boolean;
  created_at: string;
  updated_at: string;
}

export interface QuestionInput {
  category: string;
  test_number: number;
  question_text: string;
  question_text_en?: string | null;
  question_text_sq?: string | null;
  option_a: string;
  option_a_en?: string | null;
  option_a_sq?: string | null;
  option_b: string;
  option_b_en?: string | null;
  option_b_sq?: string | null;
  option_c: string;
  option_c_en?: string | null;
  option_c_sq?: string | null;
  correct_answer: 'A' | 'B' | 'C';
  correct_answers?: ('A' | 'B' | 'C')[]; // Multiple correct answers support
  explanation_en?: string | null;
  explanation_sq?: string | null;
  image_url?: string;
  is_published?: boolean;
}

export interface QuestionsQueryParams {
  category?: string;
  search?: string;
  status?: 'all' | 'published' | 'draft';
  page: number;
  pageSize: number;
}

export interface QuestionsPageResult {
  questions: Question[];
  total: number;
}

// Fetch questions with server-side pagination and optional filters
export function useQuestions({ category, search, status = 'all', page, pageSize }: QuestionsQueryParams) {
  const supabase = createClient();

  return useQuery<QuestionsPageResult>({
    queryKey: ['questions', category, search, status, page, pageSize],
    queryFn: async () => {
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      let query = supabase
        .from('admin_questions')
        .select('*', { count: 'exact' })
        .order('category', { ascending: true })
        .order('test_number', { ascending: true });

      if (category) {
        query = query.eq('category', category);
      }

      if (status === 'published') {
        query = query.eq('is_published', true);
      } else if (status === 'draft') {
        query = query.eq('is_published', false);
      }

      if (search && search.trim()) {
        const term = search.trim();
        query = query.or(`question_text.ilike.%${term}%,category.ilike.%${term}%`);
      }

      const { data, error, count } = await query.range(from, to);

      if (error) throw error;

      return {
        questions: (data || []) as Question[],
        total: count || 0,
      };
    },
  });
}

// Fetch single question
export function useQuestion(id: string) {
  const supabase = createClient();

  return useQuery({
    queryKey: ['question', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('admin_questions')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Question;
    },
    enabled: !!id,
  });
}

// Create question
export function useCreateQuestion() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  return useMutation({
    mutationFn: async (question: QuestionInput) => {
      console.log('Creating question with data:', question);
      
      const { data, error } = await supabase
        .from('admin_questions')
        .insert([question])
        .select()
        .single();

      if (error) {
        console.error('Supabase create error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        });
        throw new Error(error.message || error.details || 'Failed to create question');
      }
      
      if (!data) {
        throw new Error('No data returned from insert operation');
      }
      
      console.log('Question created successfully:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
    },
    onError: (error) => {
      console.error('Mutation error:', error);
    },
  });
}

// Update question
export function useUpdateQuestion() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  return useMutation({
    mutationFn: async ({ id, ...question }: Partial<Question> & { id: string }) => {
      console.log('Updating question:', id, question);
      
      const { data, error } = await supabase
        .from('admin_questions')
        .update(question)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Supabase update error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        });
        throw new Error(error.message || error.details || 'Failed to update question');
      }
      
      if (!data) {
        throw new Error('No data returned from update operation');
      }
      
      console.log('Question updated successfully:', data);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      queryClient.invalidateQueries({ queryKey: ['question', data.id] });
    },
    onError: (error) => {
      console.error('Update mutation error:', error);
    },
  });
}

// Delete question
export function useDeleteQuestion() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('admin_questions')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Supabase delete error:', error);
        throw new Error(error.message || 'Failed to delete question');
      }
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
    },
  });
}
