import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/utils/supabase/client';

export interface Question {
  id: string;
  category: string;
  test_number: number;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  correct_answer: 'A' | 'B' | 'C';
  correct_answers?: ('A' | 'B' | 'C')[]; // Multiple correct answers support
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface QuestionInput {
  category: string;
  test_number: number;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  correct_answer: 'A' | 'B' | 'C';
  correct_answers?: ('A' | 'B' | 'C')[]; // Multiple correct answers support
  image_url?: string;
}

// Fetch all questions
export function useQuestions(category?: string) {
  const supabase = createClient();

  return useQuery({
    queryKey: ['questions', category],
    queryFn: async () => {
      let query = supabase
        .from('admin_questions')
        .select('*')
        .order('category', { ascending: true })
        .order('test_number', { ascending: true });

      if (category) {
        query = query.eq('category', category);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Question[];
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
