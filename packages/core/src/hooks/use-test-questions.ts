import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSupabase } from '../contexts/supabase-context';
import { Question as TestQuestion } from './use-questions';

export interface TestSubmissionAnswer {
  question_id: string;
  selected_answer: 'A' | 'B' | 'C';
  is_correct: boolean;
  time_spent: number;
}

// Helper to get wrong question IDs
async function getWrongQuestionIds(supabase: any, userId: string, category: string) {
  // 1. Get all attempts for user/category
  const { data: attempts } = await supabase
    .from('test_attempts')
    .select('id, completed_at')
    .eq('user_id', userId)
    .eq('category', category)
    .order('completed_at', { ascending: true }); // Oldest first

  if (!attempts || attempts.length === 0) return [];

  const attemptIds = attempts.map((a: any) => a.id);

  // 2. Get all answers for these attempts
  const { data: answers } = await supabase
    .from('test_attempt_answers')
    .select('question_id, is_correct, test_attempt_id')
    .in('test_attempt_id', attemptIds);

  if (!answers) return [];

  // 3. Determine status of each question
  // We process answers in order of attempts (which we sorted).
  // Actually, answers query might not return in order. We need to map attempt_id to order.
  const attemptOrder = new Map(attempts.map((a: any, index: number) => [a.id, index]));
  
  const sortedAnswers = (answers as any[]).sort((a, b) => {
    return ((attemptOrder.get(a.test_attempt_id) as number) || 0) - ((attemptOrder.get(b.test_attempt_id) as number) || 0);
  });

  const questionStatus = new Map<string, boolean>(); // id -> isCorrect
  
  sortedAnswers.forEach(ans => {
    questionStatus.set(ans.question_id, ans.is_correct);
  });

  // 4. Filter only those that are currently false (wrong)
  const wrongIds: string[] = [];
  questionStatus.forEach((isCorrect, id) => {
    if (!isCorrect) wrongIds.push(id);
  });

  return wrongIds;
}

// Get stats for personalized tests (how many wrong questions)
export function usePersonalizedStats(userId?: string, category: string = 'B') {
  const supabase = useSupabase();
  return useQuery({
    queryKey: ['personalized-stats', userId, category],
    queryFn: async () => {
      if (!userId) return { totalWrong: 0, pageCount: 0 };
      const wrongIds = await getWrongQuestionIds(supabase, userId, category);
      return {
        totalWrong: wrongIds.length,
        pageCount: Math.ceil(wrongIds.length / 30)
      };
    },
    enabled: !!userId,
    staleTime: 1 * 60 * 1000,
  });
}

// Get questions for a specific test
export function useTestQuestions(category: string, testNumber: string, userId?: string) {
  const supabase = useSupabase();
  return useQuery({
    queryKey: ['test-questions', category, testNumber, userId],
    queryFn: async () => {
      
      const isPersonalized = testNumber.startsWith('personalized');
      const isMixed = testNumber === 'mixed' || testNumber === 'random';

      if (isPersonalized && userId) {
        const parts = testNumber.split('-');
        const page = parts.length > 1 ? parseInt(parts[1]) : 1;
        const pageSize = 30;

        const wrongQuestionIds = await getWrongQuestionIds(supabase, userId, category);
        
        if (wrongQuestionIds.length === 0) {
           // If no wrong questions, return empty or maybe fallback to random? 
           // User requirement: "a test is created from the wrong answers".
           // If empty, it should probably show empty or completed.
           return []; 
        }

        // Paginate
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const pageIds = wrongQuestionIds.slice(startIndex, endIndex);

        if (pageIds.length === 0) return [];

        const { data: questions, error: questionsError } = await supabase
            .from('admin_questions')
            .select('*')
            .in('id', pageIds)
            .eq('is_published', true);

        if (questionsError) throw questionsError;
        return (questions || []) as TestQuestion[];

      } else if (isMixed) {
        // Get random questions from all tests in category
        const { data, error } = await supabase
          .from('admin_questions')
          .select('*')
          .eq('category', category)
          .eq('is_published', true);

        if (error) throw error;

        const shuffled = (data || []).sort(() => Math.random() - 0.5);
        return shuffled.slice(0, 30) as TestQuestion[]; // Changed to 30 for consistency

      } else {
        // Get questions for specific test number
        const { data, error } = await supabase
          .from('admin_questions')
          .select('*')
          .eq('category', category)
          .eq('test_number', parseInt(testNumber))
          .eq('is_published', true);

        if (error) throw error;
        // Ensure we return all questions for the test (usually 30), not slice(0, 10)
        return (data || []) as TestQuestion[];
      }
    },
    enabled: !!category && !!testNumber,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Submit test attempt
export function useSubmitTestAttempt() {
  const queryClient = useQueryClient();
  const supabase = useSupabase();
  
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
      questions: TestQuestion[];
      answers: Record<string, 'A' | 'B' | 'C'>;
      score: number;
      percentage: number;
    }) => {

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
          } as any);
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
        } as any)
        .select()
        .single();

      if (attemptError) throw attemptError;

      const attempt = testAttempt as any;

      // Save individual answers
      const answersToSave: (TestSubmissionAnswer & { test_attempt_id: string })[] = questions.map(question => ({
        test_attempt_id: attempt.id,
        question_id: question.id,
        selected_answer: answers[question.id] || 'A',
        is_correct: answers[question.id] === question.correct_answer,
        time_spent: 0, // Although type has it, we remove it from insert below if needed, but `as any` is used.
        // Wait, the error said 'time_spent' column not found. So I must remove it from the object I send to insert.
        // But the TestSubmissionAnswer interface has it. I should make it optional or Omit it.
      }));

      const answersPayload = answersToSave.map(({ time_spent, ...rest }) => rest);

      const { error: answersError } = await supabase
        .from('test_attempt_answers')
        .insert(answersPayload as any);

      if (answersError) throw answersError;

      return {
        testAttempt: attempt,
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
  const supabase = useSupabase();
  return useQuery({
    queryKey: ['rating-modal-check', userId],
    queryFn: async () => {
      
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

      const profile = userProfile as any;

      return {
        shouldShowRating: (testCount === 1 || testCount === 5 || testCount === 10) && !profile?.app_rating,
        testCount,
        hasRated: !!profile?.app_rating,
      };
    },
    enabled: !!userId,
    staleTime: 0,
    refetchOnMount: 'always',
  });
}
