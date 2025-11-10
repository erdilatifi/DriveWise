'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Navbar } from '@/components/navbar';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, CheckCircle, XCircle, CheckSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';

interface Answer {
  id: string;
  selected_answer: string;
  is_correct: boolean;
  question: {
    id: string;
    question_text: string;
    option_a: string;
    option_b: string;
    option_c: string;
    correct_answer: string;
    correct_answers?: string[];
    image_url?: string;
  } | null;
}

export default function ReviewPage() {
  const params = useParams();
  const router = useRouter();
  const testId = params.id as string;
  const supabase = createClient();

  interface TestInfo {
    id: string;
    category: string;
    test_number: string;
    score: number;
    total_questions: number;
    percentage: number;
    completed_at: string;
  }

  const [answers, setAnswers] = useState<Answer[]>([]);
  const [testInfo, setTestInfo] = useState<TestInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  useEffect(() => {
    fetchTestDetails();
  }, [testId]);

  const fetchTestDetails = async () => {
    try {
      // Get test attempt info
      const { data: test, error: testError } = await supabase
        .from('test_attempts')
        .select('*')
        .eq('id', testId)
        .single();

      if (testError) {
        console.error('Error fetching test:', testError);
        throw testError;
      }
      setTestInfo(test);

      // Get answers with questions - using question_id as foreign key
      const { data: answersData, error: answersError } = await supabase
        .from('test_attempt_answers')
        .select('*')
        .eq('test_attempt_id', testId)
        .order('answered_at', { ascending: true });

      if (answersError) {
        console.error('Error fetching answers:', answersError);
        throw answersError;
      }

      // Fetch questions separately
      if (answersData && answersData.length > 0) {
        const questionIds = answersData.map(a => a.question_id);
        const { data: questionsData, error: questionsError } = await supabase
          .from('admin_questions')
          .select('*')
          .in('id', questionIds);

        if (questionsError) {
          console.error('Error fetching questions:', questionsError);
          throw questionsError;
        }

        // Map questions to answers
        const answersWithQuestions = answersData.map(answer => {
          const matchedQuestion = questionsData?.find(q => q.id === answer.question_id);
          if (!matchedQuestion) {
            console.warn(`Question not found for answer ${answer.id}, question_id: ${answer.question_id}`);
          }
          return {
            ...answer,
            question: matchedQuestion || null
          };
        });

        setAnswers(answersWithQuestions);
      } else {
        setAnswers([]);
      }
    } catch (error) {
      console.error('Error fetching test details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-28">
        <Navbar />
        <div className="container mx-auto px-6 py-8 max-w-7xl flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!testInfo || answers.length === 0) {
    return (
      <div className="min-h-screen bg-background pt-28">
        <Navbar />
        <div className="container mx-auto px-6 py-8 max-w-7xl">
          <GlassCard className="p-12 text-center">
            <p className="text-muted-foreground mb-4">Test not found</p>
            <Button asChild>
              <Link href="/history">Back to History</Link>
            </Button>
          </GlassCard>
        </div>
      </div>
    );
  }

  const answer = answers[currentQuestion];
  const question = answer?.question;
  const totalQuestions = answers.length;
  const passed = testInfo.percentage >= 80;

  // Handle missing question data
  if (!question) {
    return (
      <div className="min-h-screen bg-background pt-28">
        <Navbar />
        <div className="container mx-auto px-6 py-8 max-w-7xl">
          <GlassCard className="p-12 text-center">
            <p className="text-muted-foreground mb-4">Question data not found</p>
            <Button asChild>
              <Link href="/history">Back to History</Link>
            </Button>
          </GlassCard>
        </div>
      </div>
    );
  }

  // Parse selected answers (could be "A" or "A,B")
  const selectedAnswers = answer.selected_answer ? answer.selected_answer.split(',') : [];
  const correctAnswers = question.correct_answers && question.correct_answers.length > 0
    ? question.correct_answers
    : [question.correct_answer];

  return (
    <div className="min-h-screen bg-background pt-28">
      <Navbar />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-6 py-8 max-w-7xl"
      >
        {/* Header */}
        <div className="mb-6">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/history">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to History
            </Link>
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-1">
                Category {testInfo.category} - {
                  testInfo.test_number === 'mixed' ? 'Mixed Test' :
                  testInfo.test_number === 'personalized' ? 'Personalized Test' :
                  `Test #${testInfo.test_number}`
                }
              </h1>
              <p className="text-muted-foreground">
                Review your answers and learn from mistakes
              </p>
            </div>
            <div className="text-right">
              <p className={`text-3xl font-bold ${passed ? 'text-green-500' : 'text-red-500'}`}>
                {testInfo.percentage}%
              </p>
              <p className="text-sm text-muted-foreground">
                {testInfo.score}/{testInfo.total_questions} correct
              </p>
            </div>
          </div>
        </div>

        {/* Question Card */}
        <Card className={`${question.image_url ? 'max-w-6xl' : 'max-w-4xl'} mx-auto mb-6`}>
          <CardContent className="p-6">
            {/* Question Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                answer.is_correct ? 'bg-green-500/20' : 'bg-red-500/20'
              }`}>
                {answer.is_correct ? (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-500" />
                )}
              </div>
              <div>
                <h2 className="text-xl font-semibold">Question {currentQuestion + 1} of {totalQuestions}</h2>
                <p className={`text-sm ${answer.is_correct ? 'text-green-500' : 'text-red-500'}`}>
                  {answer.is_correct ? 'Correct Answer' : 'Incorrect Answer'}
                </p>
              </div>
            </div>

            {/* Side-by-side layout when image exists */}
            <div className={question.image_url ? "grid grid-cols-1 lg:grid-cols-2 gap-6" : ""}>
              {/* Image Section */}
              {question.image_url && (
                <div className="flex flex-col">
                  <div className="relative rounded-xl overflow-hidden border-2 border-border shadow-lg">
                    <img
                      src={question.image_url}
                      alt="Question illustration"
                      className="w-full h-auto object-contain bg-muted/30"
                      style={{ maxHeight: '400px' }}
                    />
                  </div>
                </div>
              )}

              {/* Question and Options */}
              <div>
                <p className="text-lg font-medium mb-6">{question.question_text}</p>

                <div className="space-y-3">
                  {(['A', 'B', 'C'] as const).map((option) => {
                    const isCorrect = correctAnswers.includes(option);
                    const isSelected = selectedAnswers.includes(option);
                    const optionKey = `option_${option.toLowerCase()}` as 'option_a' | 'option_b' | 'option_c';
                    const optionText = question[optionKey];

                    return (
                      <div
                        key={option}
                        className={`p-4 rounded-lg border-2 ${
                          isCorrect
                            ? 'bg-green-500/10 border-green-500/50'
                            : isSelected && !isCorrect
                            ? 'bg-red-500/10 border-red-500/50'
                            : 'bg-muted/30 border-border'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {/* Checkbox/Radio indicator */}
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 ${
                            isSelected
                              ? isCorrect
                                ? 'border-green-500 bg-green-500'
                                : 'border-red-500 bg-red-500'
                              : isCorrect
                              ? 'border-green-500 bg-green-500'
                              : 'border-border'
                          }`}>
                            {(isSelected || isCorrect) && (
                              <CheckSquare className="w-4 h-4 text-white" />
                            )}
                          </div>

                          <div className="flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <p className="font-medium">
                                <span className="font-bold mr-2">{option}.</span>
                                {optionText}
                              </p>
                              <div className="flex flex-col gap-1">
                                {isCorrect && (
                                  <span className="text-green-500 text-xs font-semibold whitespace-nowrap">
                                    ✓ Correct
                                  </span>
                                )}
                                {isSelected && !isCorrect && (
                                  <span className="text-red-500 text-xs font-semibold whitespace-nowrap">
                                    ✗ Your answer
                                  </span>
                                )}
                                {isSelected && isCorrect && (
                                  <span className="text-green-500 text-xs font-semibold whitespace-nowrap">
                                    ✓ Your answer
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="outline"
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            <div className="text-sm text-muted-foreground">
              Question {currentQuestion + 1} of {totalQuestions}
            </div>

            <Button
              variant="outline"
              onClick={() => setCurrentQuestion(Math.min(totalQuestions - 1, currentQuestion + 1))}
              disabled={currentQuestion === totalQuestions - 1}
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {/* Smart Question Navigator */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 5))}
              disabled={currentQuestion === 0}
              className="p-1 rounded hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-3 h-3" />
            </button>

            <div className="flex-1 overflow-x-auto scrollbar-hide">
              <div className="flex gap-1">
                {answers.map((ans, idx) => {
                  const distance = Math.abs(idx - currentQuestion);
                  if (distance > 4 && idx !== 0 && idx !== totalQuestions - 1) return null;

                  if (distance === 5) {
                    return (
                      <span key={`ellipsis-${idx}`} className="px-1 text-xs text-muted-foreground">
                        ...
                      </span>
                    );
                  }

                  return (
                    <button
                      key={ans.id}
                      onClick={() => setCurrentQuestion(idx)}
                      className={`min-w-[32px] h-8 px-2 rounded text-xs font-medium transition-colors ${
                        idx === currentQuestion
                          ? 'bg-primary text-primary-foreground'
                          : ans.is_correct
                          ? 'bg-green-500/20 text-green-500 hover:bg-green-500/30'
                          : 'bg-red-500/20 text-red-500 hover:bg-red-500/30'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={() => setCurrentQuestion(Math.min(totalQuestions - 1, currentQuestion + 5))}
              disabled={currentQuestion === totalQuestions - 1}
              className="p-1 rounded hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
