'use client';

import { useState, useEffect } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { CATEGORY_INFO, type LicenseCategory } from '@/types/database';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, CheckCircle, CheckSquare, Lock } from 'lucide-react';
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
const RatingModal = dynamic(
  () => import('@/components/rating-modal').then((mod) => mod.RatingModal),
  {
    ssr: false,
  },
);

// Single browser Supabase client (avoids re-creating in effects)
const supabase = createClient();

export default function TestPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { t, language } = useLanguage();

  const category = (params.category as string).toUpperCase() as LicenseCategory;
  const testNumber = params.testNumber as string;

  const isMixedTest = testNumber === 'mixed';
  const isPersonalizedTest = testNumber === 'personalized';

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [showResults, setShowResults] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [startTime, setStartTime] = useState(Date.now());
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [lastTestAttemptId, setLastTestAttemptId] = useState<string | null>(null);

  const { user, isAdmin, loading: authLoading } = useAuth();
  const { data: entitlementResult } = useCategoryEntitlements(
    user?.id,
    category,
    isAdmin,
  );

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push('/login');
      return;
    }

    const fetchQuestions = async () => {
      try {
        setUserId(user.id);
        setStartTime(Date.now());

        const storageKey = `test_progress_${user.id}_${category}_${testNumber}`;
        const saved = localStorage.getItem(storageKey);
        
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            // Check if data is less than 24 hours old
            if (Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000) {
              console.log('Restoring test progress from local storage');
              setQuestions(parsed.questions);
              setAnswers(parsed.answers);
              setCurrentQuestion(parsed.currentQuestion);
              setStartTime(parsed.startTime || Date.now());
              setLoading(false);
              return;
            }
          } catch (e) {
            console.error('Failed to parse saved test progress', e);
            localStorage.removeItem(storageKey);
          }
        }

        const loadedQuestions = await loadQuestionsForTest({
          supabase,
          userId: user.id,
          category,
          testNumber,
        });

        setQuestions(loadedQuestions);
      } catch (error) {
        console.error('Error loading questions:', error);
        toast.error(t('test.loadError'));
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [authLoading, user, category, testNumber, router]);

  // Save progress to local storage
  useEffect(() => {
    if (!userId || questions.length === 0 || showResults) return;

    const storageKey = `test_progress_${userId}_${category}_${testNumber}`;
    const data = {
      questions,
      answers,
      currentQuestion,
      startTime,
      timestamp: Date.now(),
    };
    localStorage.setItem(storageKey, JSON.stringify(data));
  }, [userId, category, testNumber, questions, answers, currentQuestion, startTime, showResults]);

  const categoryInfo = CATEGORY_INFO[category];
  const totalQuestions = questions.length;
  const progress = totalQuestions > 0 ? ((currentQuestion + 1) / totalQuestions) * 100 : 0;

  const answeredCount = questions.reduce((count, q) => {
    const userAnswer = answers[q.id];
    return userAnswer && userAnswer.length > 0 ? count + 1 : count;
  }, 0);
  const allAnswered = totalQuestions > 0 && answeredCount === totalQuestions;

  const handleAnswer = (value: string) => {
    if (questions.length === 0) return;
    const question = questions[currentQuestion];
    const currentAnswers = answers[question.id] || [];
    const newAnswers = currentAnswers.includes(value)
      ? currentAnswers.filter((a) => a !== value)
      : [...currentAnswers, value];
    setAnswers({ ...answers, [question.id]: newAnswers });
  };

  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    try {
      // Calculate score
      const score = calculateScore(questions, answers);
      const timeElapsed = Math.floor((Date.now() - startTime) / 1000);

      // Ensure user profile exists before saving test
      const {
        data: existingProfile,
        error: profileCheckError,
      } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('id', userId)
        .maybeSingle();

      if (profileCheckError) {
        // Silent log for monitoring, but proceed to try insert
        console.error('Error checking profile:', profileCheckError);
      }

      if (!existingProfile) {
        if (user) {
          const {
            error: profileError,
          } = await supabase
            .from('user_profiles')
            .insert({
              id: user.id,
              email: user.email || '',
              full_name:
                user.user_metadata?.full_name ||
                user.email?.split('@')[0] ||
                'User',
            })
            .select()
            .single();

          if (profileError) {
            toast.error(t('test.createProfileError'));
            setShowResults(true);
            return;
          }
        } else {
          toast.error(t('auth.loginAgain'));
          router.push('/login');
          return;
        }
      }

      const {
        data: testAttempt,
        error: attemptError,
      } = await supabase
        .from('test_attempts')
        .insert({
          user_id: userId,
          category,
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
        toast.error(t('test.saveError'));
        setShowResults(true);
        return;
      }

      setLastTestAttemptId(testAttempt.id);

      // Invalidate cache to show updated results
      queryClient.invalidateQueries({ queryKey: ['user-test-stats', userId] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats', userId] });

      // Check if this is the user's first test
      const {
        count: testCount,
      } = await supabase
        .from('test_attempts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      // Check if user has already rated the app
      const {
        data: userProfile,
      } = await supabase
        .from('user_profiles')
        .select('app_rating')
        .eq('id', userId)
        .single();

      const isUserFirstTest = testCount === 1 && !userProfile?.app_rating;

      // Save individual answers
      if (testAttempt) {
        const answersToSave = questions.map((q) => {
          const userAnswer = answers[q.id] || [];
          const correctAnswers =
            q.correct_answers && q.correct_answers.length > 0
              ? q.correct_answers
              : [q.correct_answer];

          const isCorrect =
            userAnswer.length === correctAnswers.length &&
            userAnswer.every((a) => correctAnswers.includes(a));

          const selectedAnswerString =
            userAnswer.length > 0 ? userAnswer.join(',') : null;

          return {
            test_attempt_id: testAttempt.id,
            question_id: q.id,
            selected_answer: selectedAnswerString,
            is_correct: isCorrect,
          };
        });

        const {
          error: answersError,
        } = await supabase
          .from('test_attempt_answers')
          .insert(answersToSave)
          .select();

        if (answersError) {
          toast.error(t('test.saveDetailsError'));
        }
      }

      // Clear local storage
      const storageKey = `test_progress_${userId}_${category}_${testNumber}`;
      localStorage.removeItem(storageKey);

      setShowResults(true);

      if (isUserFirstTest) {
        setTimeout(() => {
          setShowRatingModal(true);
        }, 1500);
      }
    } catch (error) {
      console.error('Error submitting test:', error);
      toast.error(t('test.unexpectedError'));
      setShowResults(true);
    }
  };

  const score = calculateScore(questions, answers);
  const weakTopics = showResults ? computeWeakTopics(questions, answers) : [];

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="max-w-md w-full border border-border/80 bg-card/95 backdrop-blur-xl">
          <CardHeader>
            <CardTitle>Loading</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-muted-foreground">
                {authLoading ? 'Authenticating...' : 'Redirecting...'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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

  if (
    !isAdmin &&
    entitlementResult &&
    !entitlementResult.entitlements.canStartNewTest &&
    !showResults
  ) {
    const used = entitlementResult.testsTakenThisCycle;
    const remaining = entitlementResult.entitlements.remainingFreeTests ?? 0;
    const total = used + remaining;
    const isSq = language === 'sq';

    return (
      <div className="min-h-screen bg-background text-foreground">
        {/* Background elements */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-orange-500/20 via-transparent to-transparent blur-3xl" />
        
        <div className="flex items-center justify-center min-h-screen p-4">
          <GlassCard className="w-full max-w-2xl p-8 md:p-10 border border-orange-500/30 bg-black/85 text-center relative overflow-hidden">
            <div className="pointer-events-none absolute -top-24 -right-24 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl" />
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-orange-500/10 flex items-center justify-center mb-6 border border-orange-500/20">
                <Lock className="w-8 h-8 text-orange-400" />
              </div>
              
              <h1 className="text-3xl font-semibold mb-3 tracking-tight">
                {t('test.limitReachedTitle') || 'Free test limit reached'}
              </h1>
              <p className="text-base text-muted-foreground mb-8 max-w-lg mx-auto leading-relaxed">
                {t('test.limitReachedDescription') ||
                  `You have used ${used}/${total} free tests for ${
                    CATEGORY_INFO[category].name
                  } this cycle.`}
              </p>
              
              <div className="grid gap-4 text-left max-w-md mx-auto mb-8 w-full">
                {[
                  t('test.unlimitedTestsBenefit'),
                  t('test.fullReviewBenefit'),
                  t('test.trainerUnlockedBenefit')
                ].map((benefit, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                    <div className="mt-0.5 w-5 h-5 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-2 rounded-full bg-orange-400" />
                    </div>
                    <span className="text-sm text-muted-foreground">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
                <Button asChild className="flex-1 bg-orange-500 hover:bg-orange-600 text-black font-medium h-11">
                  <Link href={`/pricing?category=${category}`}>
                    {t('test.upgradeCta') || 'See plans'}
                  </Link>
                </Button>
                <Button asChild variant="outline" className="flex-1 h-11 border-white/10 hover:bg-white/5">
                  <Link href={`/category/${category.toLowerCase()}`}>
                    {t('test.backToTests')}
                  </Link>
                </Button>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    );
  }

  if (showResults) {
    const passed = score.percentage >= 80;

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
                <div
                  className={`absolute inset-0 blur-2xl rounded-full ${
                    passed ? 'bg-primary/30' : 'bg-destructive/30'
                  }`}
                />
                <div
                  className={`relative w-24 h-24 rounded-2xl flex items-center justify-center ${
                    passed
                      ? 'bg-gradient-to-br from-primary/20 to-primary/10 border-2 border-primary/30'
                      : 'bg-gradient-to-br from-destructive/20 to-destructive/10 border-2 border-destructive/30'
                  }`}
                >
                  <CheckCircle
                    className={`w-14 h-14 ${
                      passed ? 'text-primary' : 'text-destructive'
                    }`}
                  />
                </div>
              </div>
              <div>
                <CardTitle className="text-4xl font-bold mb-2">
                  {passed ? t('test.congratulations') : t('test.keepPracticing')}
                </CardTitle>
                <p className="text-muted-foreground text-lg">
                  {categoryInfo.name} -{' '}
                  {testNumber === 'mixed'
                    ? t('test.mixedName')
                    : testNumber === 'personalized'
                    ? t('test.personalizedName')
                    : `${t('test.test')} ${testNumber}`}
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="text-center">
                <div
                  className={`text-7xl font-bold mb-3 ${
                    passed ? 'text-primary' : 'text-destructive'
                  }`}
                >
                  {score.percentage}%
                </div>
                <p className="text-muted-foreground text-lg">
                  {score.correct} {t('test.of')} {score.total}{' '}
                  {t('test.correctAnswers')}
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm font-medium">
                  <span>{t('test.passingScore')}: 80%</span>
                  <span
                    className={passed ? 'text-primary' : 'text-destructive'}
                  >
                    {passed
                      ? `✓ ${t('test.passed')}`
                      : `✗ ${t('test.failed')}`}
                  </span>
                </div>
                <div className="w-full bg-secondary rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-3 rounded-full transition-all ${
                      passed
                        ? 'bg-gradient-to-r from-primary to-primary/80'
                        : 'bg-gradient-to-r from-destructive to-destructive/80'
                    }`}
                    style={{ width: `${score.percentage}%` }}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="border rounded-lg p-4 bg-muted/40">
                  <h3 className="text-sm font-semibold mb-1">
                    {t('test.nextStepsTitle')}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {passed ? (
                      isMixedTest || isPersonalizedTest ? (
                        t('test.nextStepsPassedMixedOrPersonalized')
                      ) : (
                        t('test.nextStepsPassedStandard')
                      )
                    ) : isPersonalizedTest ? (
                      t('test.nextStepsFailedPersonalized')
                    ) : (
                      t('test.nextStepsFailedStandard')
                    )}
                  </p>
                  {weakTopics.length > 0 && (
                    <>
                      <p className="text-xs text-amber-500 mt-2">
                        {t('test.weakTopicsInThisTest')}
                        {': '}
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
                        {t('test.reviewTest')}
                      </Link>
                    </Button>
                  )}

                  <Button
                    className="flex-1"
                    onClick={async () => {
                      if (!userId) return;
                      try {
                        setLoading(true);
                        setShowResults(false);
                        setAnswers({});
                        setCurrentQuestion(0);
                        setLastTestAttemptId(null);
                        setShowRatingModal(false);
                        setStartTime(Date.now());
                        const reloaded = await loadQuestionsForTest({
                          supabase,
                          userId,
                          category,
                          testNumber,
                        });
                        setQuestions(reloaded);
                      } catch (error) {
                        console.error('Error reloading test:', error);
                        toast.error('Could not restart test. Please try again.');
                      } finally {
                        setLoading(false);
                      }
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

  const questionText =
    language === 'en'
      ? question.question_text_en || question.question_text
      : question.question_text_sq || question.question_text;
  const currentAnswer = answers[question.id] || [];
  const topicQuery = question.topic ? encodeURIComponent(question.topic) : '';

  const options = [
    {
      id: 'A',
      text:
        language === 'en'
          ? question.option_a_en || question.option_a
          : question.option_a_sq || question.option_a,
    },
    {
      id: 'B',
      text:
        language === 'en'
          ? question.option_b_en || question.option_b
          : question.option_b_sq || question.option_b,
    },
    {
      id: 'C',
      text:
        language === 'en'
          ? question.option_c_en || question.option_c
          : question.option_c_sq || question.option_c,
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
              {t('test.question')} {currentQuestion + 1} {t('test.of')}{' '}
              {totalQuestions}
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
        <Card
          className={`${
            question.image_url ? 'max-w-6xl' : 'max-w-3xl'
          } mx-auto border border-border/80 bg-black/80 backdrop-blur-xl shadow-[0_24px_80px_rgba(0,0,0,0.85)]`}
        >
          <CardHeader>
            <div className="text-sm text-primary font-medium mb-3">
              {categoryInfo.name} -{' '}
              {testNumber === 'mixed'
                ? t('test.mixedName')
                : testNumber === 'personalized'
                ? t('test.personalizedName')
                : `${t('test.test')} ${testNumber}`}
            </div>
            <CardTitle className="text-2xl md:text-3xl">
              {questionText}
            </CardTitle>
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
            <div
              className={
                question.image_url
                  ? 'grid grid-cols-1 lg:grid-cols-2 gap-6'
                  : ''
              }
            >
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
                  <p className="text-xs text-muted-foreground text-center mt-2">
                    {t('test.questionImage')}
                  </p>
                </div>
              )}

              {/* Options Section - Always use checkboxes for multiple selection */}
              <div className="flex flex-col justify-center">
                <div className="space-y-3">
                  {options.map((option) => {
                    const isSelected = currentAnswer.includes(option.id);
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
                        <div
                          className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center ${
                            isSelected
                              ? 'border-primary bg-primary text-primary-foreground'
                              : 'border-border bg-black/60'
                          }`}
                        >
                          {isSelected && (
                            <CheckSquare className="w-3.5 h-3.5" />
                          )}
                        </div>
                        <Label className="cursor-pointer flex-1 font-medium">
                          <span className="font-semibold mr-2">
                            {option.id}.
                          </span>
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
                  disabled={!allAnswered}
                  className="flex-1"
                >
                  {t('test.submitTest')}
                  <CheckCircle className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  disabled={currentAnswer.length === 0}
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
                <p className="text-xs text-muted-foreground">
                  {t('test.question')} {currentQuestion + 1} {t('test.of')}{' '}
                  {totalQuestions}
                </p>
                <div className="flex items-center gap-1">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      currentAnswer.length > 0 ? 'bg-primary' : 'bg-secondary'
                    }`}
                  />
                  <span className="text-xs text-muted-foreground">
                    {answeredCount}/{totalQuestions}{' '}
                    {t('test.answeredLabel')}
                  </span>
                </div>
              </div>

              {/* Compact scrollable navigation */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setCurrentQuestion(Math.max(0, currentQuestion - 5))
                  }
                  disabled={currentQuestion === 0}
                  className="p-1 rounded hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowLeft className="w-3 h-3" />
                </button>

                <div className="flex-1 overflow-x-auto scrollbar-hide">
                  <div className="flex gap-1">
                    {questions.map((q, idx) => {
                      const distance = Math.abs(idx - currentQuestion);
                      if (
                        distance > 4 &&
                        idx !== 0 &&
                        idx !== totalQuestions - 1
                      )
                        return null;

                      if (distance === 5) {
                        return (
                          <span
                            key={`ellipsis-${idx}`}
                            className="px-1 text-xs text-muted-foreground"
                          >
                            ...
                          </span>
                        );
                      }

                      const answeredForQ =
                        answers[q.id] && answers[q.id].length > 0;

                      return (
                        <button
                          key={q.id}
                          onClick={() => setCurrentQuestion(idx)}
                          className={`min-w-[28px] h-7 px-2 rounded text-xs font-medium transition-colors whitespace-nowrap ${
                            idx === currentQuestion
                              ? 'bg-primary text-primary-foreground'
                              : answeredForQ
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
                  onClick={() =>
                    setCurrentQuestion(
                      Math.min(totalQuestions - 1, currentQuestion + 5),
                    )
                  }
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

/* Helpers */

function shuffleArray<T>(items: T[]): T[] {
  return [...items].sort(() => 0.5 - Math.random());
}

async function getPersonalizedQuestions({
  supabase,
  userId,
  category,
}: {
  supabase: SupabaseClient;
  userId: string;
  category: LicenseCategory;
}): Promise<Question[]> {
  const { data: testAttempts, error: attemptsError } = await supabase
    .from('test_attempts')
    .select('id')
    .eq('user_id', userId)
    .eq('category', category);

  if (attemptsError) {
    throw new Error(`Error fetching test attempts: ${attemptsError.message}`);
  }

  const testAttemptIds = testAttempts?.map((t) => t.id) || [];
  if (testAttemptIds.length === 0) return [];

  const { data: wrongAnswers, error: answersError } = await supabase
    .from('test_attempt_answers')
    .select('question_id')
    .eq('is_correct', false)
    .in('test_attempt_id', testAttemptIds);

  if (answersError) {
    throw new Error(`Error fetching wrong answers: ${answersError.message}`);
  }

  const wrongQuestionIds = [
    ...new Set(wrongAnswers?.map((a) => a.question_id) || []),
  ];
  if (wrongQuestionIds.length === 0) return [];

  const { data: wrongQuestions, error: questionsError } = await supabase
    .from('admin_questions')
    .select('*')
    .in('id', wrongQuestionIds)
    .eq('category', category);

  if (questionsError) {
    throw new Error(`Error fetching questions: ${questionsError.message}`);
  }

  let personalizedQuestions: Question[] = (wrongQuestions || []) as Question[];

  if (personalizedQuestions.length < 10) {
    const { data: allQuestions } = await supabase
      .from('admin_questions')
      .select('*')
      .eq('category', category);

    if (allQuestions && allQuestions.length > 0) {
      const existingIds = new Set(personalizedQuestions.map((q) => q.id));
      const availableQuestions = (allQuestions as Question[]).filter(
        (q) => !existingIds.has(q.id),
      );
      const shuffled = shuffleArray(availableQuestions);
      const needed = 10 - personalizedQuestions.length;
      personalizedQuestions = [
        ...personalizedQuestions,
        ...shuffled.slice(0, Math.max(0, needed)),
      ];
    }
  }

  return shuffleArray(personalizedQuestions).slice(0, 10);
}

async function getMixedQuestions({
  supabase,
  category,
}: {
  supabase: SupabaseClient;
  category: LicenseCategory;
}): Promise<Question[]> {
  const { data, error } = await supabase
    .from('admin_questions')
    .select('*')
    .eq('category', category);

  if (error) {
    throw new Error(`Error fetching mixed questions: ${error.message}`);
  }

  if (!data || data.length === 0) {
    return [];
  }

  const shuffled = shuffleArray(data as Question[]);
  return shuffled.slice(0, Math.min(10, shuffled.length));
}

async function getFixedTestQuestions({
  supabase,
  category,
  testNumber,
}: {
  supabase: SupabaseClient;
  category: LicenseCategory;
  testNumber: string;
}): Promise<Question[]> {
  const parsedNumber = parseInt(testNumber, 10);
  if (Number.isNaN(parsedNumber)) {
    throw new Error('Invalid test number');
  }

  const { data, error } = await supabase
    .from('admin_questions')
    .select('*')
    .eq('category', category)
    .eq('test_number', parsedNumber);

  if (error) {
    throw new Error(`Error fetching fixed test questions: ${error.message}`);
  }

  if (!data || data.length === 0) {
    return [];
  }

  return data as Question[];
}

async function loadQuestionsForTest({
  supabase,
  userId,
  category,
  testNumber,
}: {
  supabase: SupabaseClient;
  userId: string;
  category: LicenseCategory;
  testNumber: string;
}): Promise<Question[]> {
  if (testNumber === 'personalized') {
    const personalized = await getPersonalizedQuestions({
      supabase,
      userId,
      category,
    });
    if (personalized.length > 0) return personalized;
    return getMixedQuestions({ supabase, category });
  }

  if (testNumber === 'mixed') {
    return getMixedQuestions({ supabase, category });
  }

  return getFixedTestQuestions({ supabase, category, testNumber });
}

function calculateScore(
  questions: Question[],
  answers: Record<string, string[]>,
) {
  const totalQuestions = questions.length;
  let correct = 0;

  questions.forEach((q) => {
    const userAnswer = answers[q.id] || [];
    const correctAnswers =
      q.correct_answers && q.correct_answers.length > 0
        ? q.correct_answers
        : [q.correct_answer];

    const isCorrect =
      userAnswer.length === correctAnswers.length &&
      userAnswer.every((a) => correctAnswers.includes(a));

    if (isCorrect) correct += 1;
  });

  return {
    correct,
    total: totalQuestions,
    percentage:
      totalQuestions > 0
        ? Math.round((correct / totalQuestions) * 100)
        : 0,
  };
}

function computeWeakTopics(
  questions: Question[],
  answers: Record<string, string[]>,
) {
  const topicStatsMap: Record<string, { total: number; correct: number }> = {};

  questions.forEach((q) => {
    const topic = q.topic;
    if (!topic) return;

    if (!topicStatsMap[topic]) {
      topicStatsMap[topic] = { total: 0, correct: 0 };
    }

    const userAnswer = answers[q.id] || [];
    const correctAnswers =
      q.correct_answers && q.correct_answers.length > 0
        ? q.correct_answers
        : [q.correct_answer];

    const isCorrect =
      userAnswer.length === correctAnswers.length &&
      userAnswer.every((a) => correctAnswers.includes(a));

    topicStatsMap[topic].total += 1;
    if (isCorrect) {
      topicStatsMap[topic].correct += 1;
    }
  });

  const topicStats = Object.entries(topicStatsMap)
    .map(([topic, stats]) => {
      const accuracy =
        stats.total > 0 ? stats.correct / stats.total : 0;
      return {
        topic,
        total: stats.total,
        correct: stats.correct,
        accuracy,
      };
    })
    .sort((a, b) => a.accuracy - b.accuracy);

  return topicStats.filter((t) => t.total >= 2 && t.accuracy < 0.8).slice(0, 3);
}