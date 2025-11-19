'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { CATEGORY_INFO, type LicenseCategory } from '@/types/database';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, CheckCircle, CheckSquare } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/language-context';
import { useAuth } from '@/contexts/auth-context';
import { useCategoryEntitlements } from '@/hooks/use-subscriptions';

// Test question data structure
interface Question {
  id: string;
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
  correct_answer: string;
  correct_answers?: string[]; // Multiple correct answers support
  image_url?: string;
  topic?: string | null;
}

// Lazily load the rating modal to keep the main test bundle small
const RatingModal = dynamic(() => import('@/components/rating-modal').then(mod => mod.RatingModal), {
  ssr: false,
});

export default function TestPage() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClient();
  const queryClient = useQueryClient();
  const { t, language } = useLanguage();
  const category = (params.category as string).toUpperCase() as LicenseCategory;
  const testNumber = params.testNumber as string;

  const isMixedTest = testNumber === 'mixed';
  const isPersonalizedTest = testNumber === 'personalized';

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [showResults, setShowResults] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [startTime] = useState(Date.now());
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [lastTestAttemptId, setLastTestAttemptId] = useState<string | null>(null);

  const { user, isAdmin } = useAuth();
  const { data: entitlementResult } = useCategoryEntitlements(
    user?.id,
    category,
    isAdmin,
  );

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/login');
          return;
        }
        setUserId(user.id);

        // Check test type
        const isMixed = testNumber === 'mixed';
        const isPersonalized = testNumber === 'personalized';

        if (isPersonalized) {
          // First, get user's test attempts for this category
          const { data: testAttempts } = await supabase
            .from('test_attempts')
            .select('id')
            .eq('user_id', user.id)
            .eq('category', category);

          const testAttemptIds = testAttempts?.map(t => t.id) || [];

          // Fetch questions user got wrong
          let wrongQuestionIds: string[] = [];
          
          if (testAttemptIds.length > 0) {
            const { data: wrongAnswers, error: answersError } = await supabase
              .from('test_attempt_answers')
              .select('question_id')
              .eq('is_correct', false)
              .in('test_attempt_id', testAttemptIds);

            if (answersError) {
              console.error('Error fetching wrong answers:', answersError);
            }

            // Get unique question IDs
            wrongQuestionIds = [...new Set(wrongAnswers?.map(a => a.question_id) || [])];
          }
          
          let personalizedQuestions = [];

          if (wrongQuestionIds.length > 0) {
            // Fetch the actual questions
            const { data: wrongQuestions, error: questionsError } = await supabase
              .from('admin_questions')
              .select('*')
              .in('id', wrongQuestionIds)
              .eq('category', category);

            if (questionsError) {
              console.error('Error fetching questions:', questionsError);
            } else {
              personalizedQuestions = wrongQuestions || [];
            }
          }

          // If we don't have enough questions (need 10), fill with random
          if (personalizedQuestions.length < 10) {
            const { data: allQuestions, error: allError } = await supabase
              .from('admin_questions')
              .select('*')
              .eq('category', category);

            if (!allError && allQuestions) {
              // Filter out questions we already have
              const existingIds = personalizedQuestions.map(q => q.id);
              const availableQuestions = allQuestions.filter(q => !existingIds.includes(q.id));
              
              // Shuffle and add needed amount
              const shuffled = availableQuestions.sort(() => 0.5 - Math.random());
              const needed = 10 - personalizedQuestions.length;
              personalizedQuestions = [...personalizedQuestions, ...shuffled.slice(0, needed)];
            }
          }

          // Shuffle final list and take 10
          const finalQuestions = personalizedQuestions.sort(() => 0.5 - Math.random()).slice(0, 10);
          setQuestions(finalQuestions);

        } else if (isMixed) {
          // Fetch random questions from all tests in this category
          const { data, error } = await supabase
            .from('admin_questions')
            .select('*')
            .eq('category', category);

          if (error) {
            console.error('Error fetching questions:', error);
            return;
          }

          if (data && data.length > 0) {
            // Shuffle and take 10 random questions
            const shuffled = data.sort(() => 0.5 - Math.random());
            const randomQuestions = shuffled.slice(0, Math.min(10, data.length));
            setQuestions(randomQuestions);
          } else {
            console.warn('No questions found for this category');
          }
        } else {
          // Fetch questions for specific test number
          const { data, error } = await supabase
            .from('admin_questions')
            .select('*')
            .eq('category', category)
            .eq('test_number', parseInt(testNumber));

          if (error) {
            console.error('Error fetching questions:', error);
            return;
          }

          if (data && data.length > 0) {
            setQuestions(data);
          } else {
            console.warn('No questions found for this test');
          }
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [category, testNumber, router, supabase]);

  const categoryInfo = CATEGORY_INFO[category];
  const totalQuestions = questions.length;
  const progress = totalQuestions > 0 ? ((currentQuestion + 1) / totalQuestions) * 100 : 0;

  const handleAnswer = (value: string) => {
    if (questions.length > 0) {
      const question = questions[currentQuestion];
      const questionText = language === 'en'
        ? (question.question_text_en || question.question_text)
        : (question.question_text_sq || question.question_text);
      // Always use array mode for multiple selection
      const currentAnswers = (answers[question.id] as string[]) || [];
      const newAnswers = currentAnswers.includes(value)
        ? currentAnswers.filter(a => a !== value)
        : [...currentAnswers, value];
      setAnswers({ ...answers, [question.id]: newAnswers });
    }
  };

  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    try {
      // Calculate score
      const score = calculateScore();
      const timeElapsed = Math.floor((Date.now() - startTime) / 1000);

      // Ensure user profile exists before saving test
      console.log('🔍 Checking if user profile exists for:', userId);
      
      const { data: existingProfile, error: profileCheckError } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('id', userId)
        .maybeSingle();

      if (profileCheckError) {
        console.error('Error checking profile:', profileCheckError);
      }

      if (!existingProfile) {
        console.log('👤 User profile not found, creating...');
        
        // Create profile if it doesn't exist
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: newProfile, error: profileError } = await supabase
            .from('user_profiles')
            .insert({
              id: user.id,
              email: user.email || '',
              full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
            })
            .select()
            .single();

          if (profileError) {
            console.error('❌ Failed to create user profile:', profileError);
            toast.error('Failed to create user profile. Please try again.');
            setShowResults(true);
            return;
          }
          
          console.log('✅ User profile created:', newProfile);
        } else {
          console.error('❌ No authenticated user found');
          toast.error('Please log in again');
          router.push('/login');
          return;
        }
      } else {
        console.log('✅ User profile exists');
      }



      const { data: testAttempt, error: attemptError } = await supabase
        .from('test_attempts')
        .insert({
          user_id: userId,
          category: category,
          test_number: testNumber,
          score: score.correct,
          total_questions: score.total,
          percentage: score.percentage,
          time_taken_seconds: timeElapsed,
          completed_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (attemptError) {
        console.error('❌ ERROR SAVING TEST ATTEMPT!');
        console.error('Full error object:', JSON.stringify(attemptError, null, 2));
        console.error('Error message:', attemptError.message);
        console.error('Error code:', attemptError.code);
        console.error('Error details:', attemptError.details);
        console.error('Error hint:', attemptError.hint);
        toast.error('Failed to save test results: ' + attemptError.message);
        setShowResults(true);
        return;
      }

      console.log('✅ Test attempt saved successfully:', testAttempt);
      setLastTestAttemptId(testAttempt.id);

      // Invalidate cache to show updated results
      queryClient.invalidateQueries({ queryKey: ['user-test-stats', userId] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats', userId] });

      // Check if this is the user's first test
      const { count: testCount } = await supabase
        .from('test_attempts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      // Check if user has already rated the app
      const { data: userProfile } = await supabase
        .from('user_profiles')
        .select('app_rating')
        .eq('id', userId)
        .single();

      // Show rating modal if this is first test and user hasn't rated yet
      const isUserFirstTest = testCount === 1 && !userProfile?.app_rating;

      // Save individual answers
      if (testAttempt) {
        console.log('Test attempt saved successfully:', testAttempt.id);
        console.log('Number of questions to save:', questions.length);
        
        const answersToSave = questions.map((q) => {
          const userAnswer = answers[q.id];
          const correctAnswers = q.correct_answers && q.correct_answers.length > 0 
            ? q.correct_answers 
            : [q.correct_answer];
          
          // Check if answer is correct
          let isCorrect = false;
          if (Array.isArray(userAnswer)) {
            isCorrect = userAnswer.length === correctAnswers.length && 
                       userAnswer.every(a => correctAnswers.includes(a));
          } else {
            isCorrect = correctAnswers.includes(userAnswer);
          }
          
          // Convert answer to string for database
          const selectedAnswerString = Array.isArray(userAnswer) 
            ? userAnswer.join(',') 
            : userAnswer || null;
          
          return {
            test_attempt_id: testAttempt.id,
            question_id: q.id,
            selected_answer: selectedAnswerString,
            is_correct: isCorrect,
          };
        });

        console.log('Sample answer to save:', answersToSave[0]);

        const { data: savedAnswers, error: answersError } = await supabase
          .from('test_attempt_answers')
          .insert(answersToSave)
          .select();

        if (answersError) {
          console.error('❌ ERROR SAVING ANSWERS!');
          console.error('Error:', answersError);
          console.error('Error code:', answersError.code);
          console.error('Test score was saved, but answers could not be saved for review.');
        } else {
          console.log('✅ Answers saved successfully:', savedAnswers?.length || 0);
        }
      }

      setShowResults(true);
      
      // Show rating modal after a short delay if it's the first test
      if (testCount === 1 && !userProfile?.app_rating) {
        setTimeout(() => {
          setShowRatingModal(true);
        }, 1500);
      }
    } catch (error) {
      console.error('Error submitting test:', error);
      setShowResults(true);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q) => {
      const userAnswer = answers[q.id];
      const correctAnswers = q.correct_answers && q.correct_answers.length > 0 
        ? q.correct_answers 
        : [q.correct_answer];
      
      // Check if answer is correct
      if (Array.isArray(userAnswer)) {
        // Multiple answers - must match exactly
        if (userAnswer.length === correctAnswers.length && 
            userAnswer.every(a => correctAnswers.includes(a))) {
          correct++;
        }
      } else {
        // Single answer
        if (correctAnswers.includes(userAnswer)) {
          correct++;
        }
      }
    });
    return {
      correct,
      total: totalQuestions,
      percentage: totalQuestions > 0 ? Math.round((correct / totalQuestions) * 100) : 0,
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="max-w-3xl w-full mx-auto border-primary/20 bg-card/95 backdrop-blur-xl shadow-xl shadow-primary/5">
          <CardHeader>
            <Skeleton className="h-4 w-32 mb-3" />
            <Skeleton className="h-8 w-3/4" />
          </CardHeader>
          <CardContent className="space-y-6">
            <Skeleton className="h-48 w-full rounded-xl" />
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-5 w-5 rounded-md" />
                  <Skeleton className="h-4 flex-1" />
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 flex-1" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>{t('test.noQuestionsTitle')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              {t('test.noQuestionsDescription')}
            </p>
            <Button asChild>
              <Link href={`/category/${category.toLowerCase()}`}>
                {t('test.backToTests')}
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAdmin && entitlementResult && !entitlementResult.entitlements.canStartNewTest && !showResults) {
    const used = entitlementResult.testsTakenThisCycle;
    const remaining = entitlementResult.entitlements.remainingFreeTests ?? 0;
    const total = used + remaining;

    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="max-w-lg w-full border border-border/80 bg-black/80 backdrop-blur-xl shadow-[0_24px_80px_rgba(0,0,0,0.85)]">
          <CardHeader>
            <CardTitle className="text-2xl">
              {t('test.limitReachedTitle') || 'Free test limit reached'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>
              {t('test.limitReachedDescription') ||
                `You have used ${used}/${total} free tests for ${CATEGORY_INFO[category].name} this cycle.`}
            </p>
            <p>
              {t('test.limitReachedBenefits') ||
                'Upgrade to a paid plan for this category to unlock more tests, Decision Trainer, study material, and full test review.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button asChild className="flex-1">
                <Link href="/profile">
                  {t('test.upgradeCta') || 'See plans for this category'}
                </Link>
              </Button>
              <Button asChild variant="outline" className="flex-1">
                <Link href={`/category/${category.toLowerCase()}`}>
                  {t('test.backToTests')}
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showResults) {
    const score = calculateScore();
    const passed = score.percentage >= 80;

    // Build simple per-topic statistics for this test attempt
    const topicStatsMap: Record<string, { total: number; correct: number }> = {};

    questions.forEach((q) => {
      const topic = q.topic;
      if (!topic) return;

      if (!topicStatsMap[topic]) {
        topicStatsMap[topic] = { total: 0, correct: 0 };
      }

      const userAnswer = answers[q.id];
      const correctAnswers = q.correct_answers && q.correct_answers.length > 0
        ? q.correct_answers
        : [q.correct_answer];

      let isCorrect = false;
      if (Array.isArray(userAnswer)) {
        isCorrect = userAnswer.length === correctAnswers.length &&
                   userAnswer.every(a => correctAnswers.includes(a));
      } else {
        isCorrect = correctAnswers.includes(userAnswer as string);
      }

      topicStatsMap[topic].total += 1;
      if (isCorrect) {
        topicStatsMap[topic].correct += 1;
      }
    });

    const topicStats = Object.entries(topicStatsMap).map(([topic, stats]) => {
      const accuracy = stats.total > 0 ? stats.correct / stats.total : 0;
      return {
        topic,
        total: stats.total,
        correct: stats.correct,
        accuracy,
      };
    }).sort((a, b) => a.accuracy - b.accuracy);

    const weakTopics = topicStats.filter(t => t.total >= 2 && t.accuracy < 0.8).slice(0, 3);

    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border/40 bg-card/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <Button variant="ghost" asChild>
              <Link href={`/category/${category.toLowerCase()}`}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('test.backToTests')}
              </Link>
            </Button>
          </div>
        </header>

        <div className="container mx-auto px-4 py-16">
          <Card className="max-w-2xl mx-auto border border-border/80 bg-black/80 backdrop-blur-xl shadow-[0_30px_100px_rgba(0,0,0,0.9)]">
            <CardHeader className="text-center space-y-6">
              <div className="relative mx-auto w-24 h-24">
                <div className={`absolute inset-0 blur-2xl rounded-full ${
                  passed ? 'bg-primary/30' : 'bg-destructive/30'
                }`}></div>
                <div className={`relative w-24 h-24 rounded-2xl flex items-center justify-center ${
                  passed ? 'bg-gradient-to-br from-primary/20 to-primary/10 border-2 border-primary/30' : 'bg-gradient-to-br from-destructive/20 to-destructive/10 border-2 border-destructive/30'
                }`}>
                  <CheckCircle className={`w-14 h-14 ${
                    passed ? 'text-primary' : 'text-destructive'
                  }`} />
                </div>
              </div>
              <div>
                <CardTitle className="text-4xl font-bold mb-2">
                  {passed ? t('test.congratulations') : t('test.keepPracticing')}
                </CardTitle>
                <p className="text-muted-foreground text-lg">
                  {categoryInfo.name} - {
                    testNumber === 'mixed' ? t('test.mixedName') : 
                    testNumber === 'personalized' ? t('test.personalizedName') :
                    `${t('test.test')} ${testNumber}`
                  }
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="text-center">
                <div className={`text-7xl font-bold mb-3 ${
                  passed ? 'text-primary' : 'text-destructive'
                }`}>{score.percentage}%</div>
                <p className="text-muted-foreground text-lg">
                  {score.correct} {t('test.of')} {score.total} {t('test.correctAnswers')}
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm font-medium">
                  <span>{t('test.passingScore')}: 80%</span>
                  <span className={passed ? 'text-primary' : 'text-destructive'}>
                    {passed ? `✓ ${t('test.passed')}` : `✗ ${t('test.failed')}`}
                  </span>
                </div>
                <div className="w-full bg-secondary rounded-full h-3 overflow-hidden">
                  <div 
                    className={`h-3 rounded-full transition-all ${
                      passed ? 'bg-gradient-to-r from-primary to-primary/80' : 'bg-gradient-to-r from-destructive to-destructive/80'
                    }`}
                    style={{ width: `${score.percentage}%` }}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="border rounded-lg p-4 bg-muted/40">
                  <h3 className="text-sm font-semibold mb-1">{t('test.nextStepsTitle')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {passed ? (
                      isMixedTest || isPersonalizedTest
                        ? t('test.nextStepsPassedMixedOrPersonalized')
                        : t('test.nextStepsPassedStandard')
                    ) : (
                      isPersonalizedTest
                        ? t('test.nextStepsFailedPersonalized')
                        : t('test.nextStepsFailedStandard')
                    )}
                  </p>
                  {weakTopics.length > 0 && (
                    <>
                      <p className="text-xs text-amber-500 mt-2">
                        {t('test.weakTopicsInThisTest')}{': '}
                        {weakTopics.map((tTopic, idx) => (
                          <span key={tTopic.topic}>
                            {idx > 0 && ', '}
                            {tTopic.topic}
                          </span>
                        ))}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {weakTopics.map((tTopic) => {
                          const query = encodeURIComponent(tTopic.topic);
                          return (
                            <Button
                              key={tTopic.topic}
                              size="sm"
                              variant="outline"
                              className="text-xs px-3 py-1"
                              asChild
                            >
                              <Link href={`/materials?search=${query}`}>
                                {t('materials.title')}
                              </Link>
                            </Button>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button variant="outline" className="flex-1" asChild>
                    <Link href={`/category/${category.toLowerCase()}`}>
                      {t('test.backToTests')}
                    </Link>
                  </Button>

                  {lastTestAttemptId && (
                    <Button className="flex-1" variant="secondary" asChild>
                      <Link href={`/history/${lastTestAttemptId}`}>
                        Review this test
                      </Link>
                    </Button>
                  )}

                  <Button
                    className="flex-1"
                    onClick={() => {
                      // Reload page to reset everything
                      window.location.reload();
                    }}
                  >
                    {t('test.retakeTest')}
                  </Button>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  {!isPersonalizedTest && (
                    <Button variant="outline" className="flex-1" asChild>
                      <Link href={`/test/${category.toLowerCase()}/personalized`}>
                        {t('test.practiceWeakPointsCta')}
                      </Link>
                    </Button>
                  )}

                  {!isMixedTest && (
                    <Button variant="outline" className="flex-1" asChild>
                      <Link href={`/test/${category.toLowerCase()}/mixed`}>
                        {t('test.mixedTestCta')}
                      </Link>
                    </Button>
                  )}

                  <Button variant="outline" className="flex-1" asChild>
                    <Link href="/decision-trainer">
                      {t('test.decisionTrainerCta')}
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Rating Modal */}
        {userId && (
          <RatingModal
            open={showRatingModal}
            onClose={() => setShowRatingModal(false)}
            userId={userId}
          />
        )}
      </div>
    );
  }

  const question = questions[currentQuestion];

  if (!question) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="max-w-md w-full border border-border/80 bg-card/95 backdrop-blur-xl">
          <CardHeader>
            <CardTitle>{t('test.noQuestionsTitle')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              {t('test.noQuestionsDescription')}
            </p>
            <Button asChild>
              <Link href={`/category/${category.toLowerCase()}`}>
                {t('test.backToTests')}
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  const questionText = language === 'en'
    ? (question.question_text_en || question.question_text)
    : (question.question_text_sq || question.question_text);
  const currentAnswer = answers[question.id];
  const topicQuery = question.topic ? encodeURIComponent(question.topic) : '';

  const options = [
    {
      id: 'A',
      text: language === 'en'
        ? (question.option_a_en || question.option_a)
        : (question.option_a_sq || question.option_a),
    },
    {
      id: 'B',
      text: language === 'en'
        ? (question.option_b_en || question.option_b)
        : (question.option_b_sq || question.option_b),
    },
    {
      id: 'C',
      text: language === 'en'
        ? (question.option_c_en || question.option_c)
        : (question.option_c_sq || question.option_c),
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <Button variant="ghost" asChild size="sm">
              <Link href={`/category/${category.toLowerCase()}`}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('test.exitTest')}
              </Link>
            </Button>
            <div className="text-sm font-semibold px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary">
              {t('test.question')} {currentQuestion + 1} {t('test.of')} {totalQuestions}
            </div>
          </div>
          <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-primary to-primary/80 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </header>

      {/* Question */}
      <div className="container mx-auto px-4 py-8">
        <Card className={`${question.image_url ? 'max-w-6xl' : 'max-w-3xl'} mx-auto border border-border/80 bg-black/80 backdrop-blur-xl shadow-[0_24px_80px_rgba(0,0,0,0.85)]`}>
          <CardHeader>
            <div className="text-sm text-primary font-medium mb-3">
              {categoryInfo.name} - {
                testNumber === 'mixed' ? t('test.mixedName') : 
                testNumber === 'personalized' ? t('test.personalizedName') :
                `${t('test.test')} ${testNumber}`
              }
            </div>
            <CardTitle className="text-2xl md:text-3xl">{questionText}</CardTitle>
            {question.topic && topicQuery && (
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {question.topic}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 px-2 text-[11px]"
                  asChild
                >
                  <Link href={`/materials?search=${topicQuery}`}>
                    {t('materials.title')}
                  </Link>
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Side-by-side layout when image exists */}
            <div className={question.image_url ? "grid grid-cols-1 lg:grid-cols-2 gap-6" : ""}>
              {/* Image Section */}
              {question.image_url && (
                <div className="flex flex-col">
                  <div className="relative rounded-xl overflow-hidden border-2 border-border shadow-lg">
                    <img
                      src={question.image_url}
                      alt={t('test.questionIllustration')}
                      className="w-full h-auto object-contain bg-muted/30"
                      style={{ maxHeight: '400px' }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground text-center mt-2">{t('test.questionImage')}</p>
                </div>
              )}

              {/* Options Section - Always use checkboxes for multiple selection */}
              <div className="flex flex-col justify-center">
                <div className="space-y-3">
                  {options.map((option) => {
                    const isSelected = Array.isArray(currentAnswer) 
                      ? currentAnswer.includes(option.id)
                      : currentAnswer === option.id;
                    return (
                      <div
                        key={option.id}
                        className={`flex items-center gap-3 p-4 md:p-5 rounded-xl border transition-colors cursor-pointer ${
                          isSelected
                            ? 'border-primary/70 bg-primary/10 shadow-[0_18px_50px_rgba(0,0,0,0.9)]'
                            : 'border-border/70 bg-black/60 hover:border-primary/50 hover:bg-black/80'
                        }`}
                        onClick={() => handleAnswer(option.id)}
                      >
                        <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center ${
                          isSelected
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-border bg-black/60'
                        }`}>
                          {isSelected && (
                            <CheckSquare className="w-3.5 h-3.5" />
                          )}
                        </div>
                        <Label className="cursor-pointer flex-1 font-medium">
                          <span className="font-semibold mr-2">{option.id}.</span>
                          {option.text}
                        </Label>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                className="flex-1"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('test.previous')}
              </Button>
              {currentQuestion === totalQuestions - 1 ? (
                <Button
                  onClick={handleSubmit}
                  disabled={Object.keys(answers).length !== totalQuestions}
                  className="flex-1"
                >
                  {t('test.submitTest')}
                  <CheckCircle className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  disabled={!currentAnswer}
                  className="flex-1"
                >
                  {t('test.next')}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>

            {/* Question Navigator - Smart Pagination */}
            <div className="border-t pt-3">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-muted-foreground">{t('test.question')} {currentQuestion + 1} {t('test.of')} {totalQuestions}</p>
                <div className="flex items-center gap-1">
                  <span className={`w-2 h-2 rounded-full ${answers[question.id] ? 'bg-primary' : 'bg-secondary'}`} />
                  <span className="text-xs text-muted-foreground">
                    {Object.keys(answers).length}/{totalQuestions} {t('test.answeredLabel')}
                  </span>
                </div>
              </div>
              
              {/* Compact scrollable navigation */}
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
                    {questions.map((q, idx) => {
                      // Show current question and 4 on each side
                      const distance = Math.abs(idx - currentQuestion);
                      if (distance > 4 && idx !== 0 && idx !== totalQuestions - 1) return null;
                      
                      // Show ellipsis
                      if (distance === 5) {
                        return (
                          <span key={`ellipsis-${idx}`} className="px-1 text-xs text-muted-foreground">
                            ...
                          </span>
                        );
                      }
                      
                      return (
                        <button
                          key={q.id}
                          onClick={() => setCurrentQuestion(idx)}
                          className={`min-w-[28px] h-7 px-2 rounded text-xs font-medium transition-colors whitespace-nowrap ${
                            idx === currentQuestion
                              ? 'bg-primary text-primary-foreground'
                              : answers[q.id]
                              ? 'bg-primary/20 text-primary'
                              : 'bg-secondary hover:bg-secondary/80'
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
