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
  explanation?: string;
  image_url?: string;
}

export interface TestAttemptAnswer {
  question_id: string;
  selected_answer: 'A' | 'B' | 'C';
  is_correct: boolean;
  time_spent: number;
}

// Get questions for a specific test
export function useTestQuestions(category: string, testNumber: string, userId?: string) {
  return useQuery({
    queryKey: ['test-questions', category, testNumber, userId],
    queryFn: async () => {
      const supabase = createClient();
      
      const isPersonalized = testNumber === 'personalized';
      const isMixed = testNumber === 'mixed';

      if (isPersonalized && userId) {
        // Get user's wrong answers for personalized test
        const { data: testAttempts } = await supabase
          .from('test_attempts')
          .select('id')
          .eq('user_id', userId)
          .eq('category', category);

        const testAttemptIds = (testAttempts || []).map(t => t.id);
        let wrongQuestionIds: string[] = [];
        
        if (testAttemptIds.length > 0) {
          const { data: wrongAnswers, error: answersError } = await supabase
            .from('test_attempt_answers')
            .select('question_id')
            .eq('is_correct', false)
            .in('test_attempt_id', testAttemptIds);

          if (answersError) throw answersError;

          wrongQuestionIds = [...new Set((wrongAnswers || []).map(a => a.question_id))];
        }

        let personalizedQuestions: Question[] = [];

        if (wrongQuestionIds.length > 0) {
          const { data: wrongQuestions, error: questionsError } = await supabase
            .from('admin_questions')
            .select('*')
            .in('id', wrongQuestionIds)
            .eq('is_published', true)
            .limit(10);

          if (questionsError) throw questionsError;
          personalizedQuestions = wrongQuestions || [];
        }

        // Fill with random questions if needed
        if (personalizedQuestions.length < 10) {
          const { data: allQuestions, error: allError } = await supabase
            .from('admin_questions')
            .select('*')
            .eq('category', category)
            .eq('is_published', true);

          if (allError) throw allError;

          const remainingQuestions = (allQuestions || [])
            .filter(q => !wrongQuestionIds.includes(q.id))
            .sort(() => Math.random() - 0.5)
            .slice(0, 10 - personalizedQuestions.length);

          personalizedQuestions = [...personalizedQuestions, ...remainingQuestions];
        }

        return personalizedQuestions.slice(0, 10);

      } else if (isMixed) {
        // Get random questions from all tests in category
        const { data, error } = await supabase
          .from('admin_questions')
          .select('*')
          .eq('category', category)
          .eq('is_published', true);

        if (error) throw error;

        const shuffled = (data || []).sort(() => Math.random() - 0.5);
        return shuffled.slice(0, 10);

      } else {
        // Get questions for specific test number
        const { data, error } = await supabase
          .from('admin_questions')
          .select('*')
          .eq('category', category)
          .eq('test_number', parseInt(testNumber))
          .eq('is_published', true);

        if (error) throw error;
        return (data || []).slice(0, 10);
      }
    },
    enabled: !!category && !!testNumber,
    staleTime: 5 * 60 * 1000, // 5 minutes - questions don't change often
  });
}

// Submit test attempt
export function useSubmitTestAttempt() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({
      userId,
      category,
      testNumber,
      questions,
      answers,
      score,
      percentage,
    }: {
      userId: string;
      category: string;
      testNumber: string;
      questions: Question[];
      answers: Record<string, 'A' | 'B' | 'C'>;
      score: number;
      percentage: number;
    }) => {
      const supabase = createClient();

      // Ensure user profile exists
      const { data: existingProfile } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('id', userId)
        .maybeSingle();

      if (!existingProfile) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from('user_profiles').insert({
            id: user.id,
            email: user.email || '',
            full_name: user.user_metadata?.full_name || '',
          });
        }
      }

      // Create test attempt
      const { data: testAttempt, error: attemptError } = await supabase
        .from('test_attempts')
        .insert({
          user_id: userId,
          category,
          test_number: testNumber,
          score,
          total_questions: questions.length,
          percentage,
          completed_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (attemptError) throw attemptError;

      // Save individual answers
      const answersToSave: (TestAttemptAnswer & { test_attempt_id: string })[] = questions.map(question => ({
        test_attempt_id: testAttempt.id,
        question_id: question.id,
        selected_answer: answers[question.id] || 'A',
        is_correct: answers[question.id] === question.correct_answer,
        time_spent: 0, // Could be enhanced to track actual time
      }));

      const { error: answersError } = await supabase
        .from('test_attempt_answers')
        .insert(answersToSave);

      if (answersError) throw answersError;

      return {
        testAttempt,
        answers: answersToSave,
      };
    },
    onSuccess: (_, variables) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['test-attempts', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['test-history', variables.userId] });
    },
  });
}

// Check if user should see rating modal
export function useCheckRatingModal(userId?: string) {
  return useQuery({
    queryKey: ['rating-modal-check', userId],
    queryFn: async () => {
      const supabase = createClient();
      
      // Check test count
      const { count: testCount } = await supabase
        .from('test_attempts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId!);

      // Check if user has already rated
      const { data: userProfile } = await supabase
        .from('user_profiles')
        .select('app_rating')
        .eq('id', userId!)
        .single();

      return {
        shouldShowRating: (testCount === 1 || testCount === 5 || testCount === 10) && !userProfile?.app_rating,
        testCount,
        hasRated: !!userProfile?.app_rating,
      };
    },
    enabled: !!userId,
    staleTime: 0,
    refetchOnMount: 'always',
  });
}
