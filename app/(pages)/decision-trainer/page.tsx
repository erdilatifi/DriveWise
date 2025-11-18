'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import { Skeleton } from '@/components/ui/skeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Check, X, Lightbulb, Trophy, Zap } from 'lucide-react';
import Link from 'next/link';
import { CATEGORY_INFO, type Category } from '@/data/scenarios';
import { useScenarios } from '@/hooks/use-scenarios';
import { useCompleteCategory, useDecisionTrainerProgress, useDecisionTrainerStats } from '@/hooks/use-decision-trainer';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/language-context';
// import Confetti from 'react-canvas-confetti';

export default function DecisionTrainerPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { t } = useLanguage();
  const { data: categoryProgressData } = useDecisionTrainerProgress(user?.id);
   const { data: trainerStats } = useDecisionTrainerStats(user?.id);
  
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [stats, setStats] = useState({ correct: 0, total: 0, streak: 0, xp: 0 });
  const [timeLeft, setTimeLeft] = useState(30); // 30 seconds per scenario
  const [totalTime, setTotalTime] = useState(0);
  const [categoryStartTime, setCategoryStartTime] = useState<number>(0);
  const [sessionAttempts, setSessionAttempts] = useState<Array<{
    scenarioId: string;
    isCorrect: boolean;
    selectedOptions: number[];
    timeTakenMs: number;
    xpEarned: number;
  }>>([]);
  const [mode, setMode] = useState<'full' | 'quick5' | 'quick10' | 'weak'>('full');
  const [sessionScenarioIds, setSessionScenarioIds] = useState<string[] | null>(null);
  const [lastSessionSummary, setLastSessionSummary] = useState<{
    category: Category;
    stats: {
      totalXpEarned: number;
      correctCount: number;
      totalCount: number;
      accuracy: number;
      maxStreak: number;
      avgTimeSeconds: number;
    };
    mistakes: Array<{
      scenarioId: string;
      question: string;
      chapterId?: number | null;
    }>;
  } | null>(null);
  // const [confettiInstance, setConfettiInstance] = useState<any>(null);

  // Fetch scenarios from database
  const { data: scenarios = [], isLoading: scenariosLoading } = useScenarios(selectedCategory || undefined);
  
  // Mutation for completing category
  const completeCategoryMutation = useCompleteCategory();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Timer countdown
  useEffect(() => {
    if (!selectedCategory || showResult) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Time's up - auto submit wrong answer
          if (selectedOptions.length === 0) {
            toast.error(t('trainer.toastTimesUp'));
            handleNext();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [selectedCategory, showResult, selectedOptions]);

  useEffect(() => {
    if (!selectedCategory || scenariosLoading) return;
    if (!scenarios.length) return;

    if (mode === 'full') {
      setSessionScenarioIds(null);
      return;
    }

    if (sessionScenarioIds && sessionScenarioIds.length > 0) {
      return;
    }

    const maxQuestions = mode === 'quick5' || mode === 'weak' ? 5 : 10;
    const shuffled = [...scenarios].sort(() => Math.random() - 0.5);
    const subset = shuffled
      .slice(0, Math.min(maxQuestions, shuffled.length))
      .map((s: any) => s.id as string);
    setSessionScenarioIds(subset);
    setCurrentScenarioIndex(0);
  }, [selectedCategory, scenariosLoading, scenarios, mode, sessionScenarioIds]);

  const categoryScenarios = selectedCategory
    ? (sessionScenarioIds
        ? (scenarios as any[]).filter((s) => sessionScenarioIds.includes(s.id))
        : scenarios)
    : scenarios;
  const currentScenario = categoryScenarios[currentScenarioIndex];

  const handleSelectOption = (index: number) => {
    if (showResult) return;
    setSelectedOptions(prev => {
      if (prev.includes(index)) {
        // Remove if already selected
        return prev.filter(i => i !== index);
      } else {
        // Add to selection
        return [...prev, index];
      }
    });
  };

  const handleSubmitAnswer = () => {
    if (selectedOptions.length === 0 || !currentScenario) return;

    // Check if answer is correct - user must select ALL correct options and NO incorrect ones
    const correctOptionIndices = currentScenario.options
      .map((option: any, index: number) => (option.isCorrect ? index : -1))
      .filter((index: number) => index !== -1);
    
    const isCorrect = selectedOptions.length === correctOptionIndices.length &&
      selectedOptions.every((index: number) => correctOptionIndices.includes(index)) &&
      correctOptionIndices.every((index: number) => selectedOptions.includes(index));
    
    const timeTaken = (30 - timeLeft) * 1000; // Convert to milliseconds
    const xpEarned = isCorrect ? currentScenario.xp : 0;
    
    // Track this attempt for batch submission
    const attempt = {
      scenarioId: currentScenario.id,
      isCorrect,
      selectedOptions,
      timeTakenMs: timeTaken,
      xpEarned,
    };
    
    setSessionAttempts(prev => [...prev, attempt]);
    
    setShowResult(true);
    setStats(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
      streak: isCorrect ? prev.streak + 1 : 0,
      xp: prev.xp + xpEarned,
    }));

    if (isCorrect) {
      toast.success(`${t('trainer.toastCorrect')} +${currentScenario.xp} XP`);
      if (stats.streak > 0 && stats.streak % 5 === 0) {
        // Trigger confetti on streak milestones
      }
    } else {
      toast.error(t('trainer.toastIncorrect'));
    }
  };

  const handleNext = async () => {
    if (currentScenarioIndex < categoryScenarios.length - 1) {
      setCurrentScenarioIndex(prev => prev + 1);
      setSelectedOptions([]);
      setShowResult(false);
      setTimeLeft(30); // Reset timer for next scenario
    } else {
      // Category completed - save results to database
      const completionTime = Date.now() - categoryStartTime;
      setTotalTime(Math.floor(completionTime / 1000));
      
      if (user?.id && selectedCategory && sessionAttempts.length > 0) {
        try {
          const result = await completeCategoryMutation.mutateAsync({
            userId: user.id,
            category: selectedCategory,
            attempts: sessionAttempts,
            totalTimeMs: completionTime,
          });
          
          toast.success(
            `🎉 Category Complete!\n` +
            `XP Earned: ${result.sessionStats.totalXpEarned}\n` +
            `Accuracy: ${result.sessionStats.accuracy}%\n` +
            `Best Streak: ${result.sessionStats.maxStreak}`,
            { duration: 5000 }
          );

          const mistakes = sessionAttempts
            .filter((a) => !a.isCorrect)
            .map((a) => {
              const scenario = categoryScenarios.find((s: any) => s.id === a.scenarioId);
              return {
                scenarioId: a.scenarioId,
                question: scenario?.question || '',
                chapterId: scenario?.chapter_id ?? null,
              };
            });

          setLastSessionSummary({
            category: selectedCategory,
            stats: {
              totalXpEarned: result.sessionStats.totalXpEarned,
              correctCount: result.sessionStats.correctCount,
              totalCount: result.sessionStats.totalCount,
              accuracy: result.sessionStats.accuracy,
              maxStreak: result.sessionStats.maxStreak,
              avgTimeSeconds: result.sessionStats.avgTimeSeconds,
            },
            mistakes,
          });
        } catch (error) {
          console.error('Error saving results:', error);
          toast.error(t('trainer.toastSyncFailed'));

          const totalXpEarned = sessionAttempts.reduce((sum, a) => sum + a.xpEarned, 0);
          const correctCount = sessionAttempts.filter((a) => a.isCorrect).length;
          const totalCount = sessionAttempts.length;
          const accuracy = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;
          let maxStreak = 0;
          let currentStreak = 0;
          for (const attempt of sessionAttempts) {
            if (attempt.isCorrect) {
              currentStreak++;
              maxStreak = Math.max(maxStreak, currentStreak);
            } else {
              currentStreak = 0;
            }
          }
          const avgTimeSeconds = totalCount > 0 ? Math.round(completionTime / totalCount / 1000) : 0;
          const mistakes = sessionAttempts
            .filter((a) => !a.isCorrect)
            .map((a) => {
              const scenario = categoryScenarios.find((s: any) => s.id === a.scenarioId);
              return {
                scenarioId: a.scenarioId,
                question: scenario?.question || '',
                chapterId: scenario?.chapter_id ?? null,
              };
            });

          if (selectedCategory) {
            setLastSessionSummary({
              category: selectedCategory,
              stats: {
                totalXpEarned,
                correctCount,
                totalCount,
                accuracy,
                maxStreak,
                avgTimeSeconds,
              },
              mistakes,
            });
          }
        }
      }
      
      // Reset for next session
      setSelectedCategory(null);
      setCurrentScenarioIndex(0);
      setSelectedOptions([]);
      setShowResult(false);
      setSessionAttempts([]);
      setSessionScenarioIds(null);
      if (mode === 'weak') {
        setMode('full');
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startCategory = (category: Category) => {
    setSelectedCategory(category);
    setCurrentScenarioIndex(0);
    setSelectedOptions([]);
    setShowResult(false);
    setStats({ correct: 0, total: 0, streak: 0, xp: 0 });
    setTimeLeft(30);
    setTotalTime(0);
    setCategoryStartTime(() => Date.now());
    setSessionAttempts([]); // Reset session attempts
    setSessionScenarioIds(null);
  };

  const handleStartWeakPoints = () => {
    const progressList = (categoryProgressData || []) as any[];
    const withAttempts = progressList.filter((p) => p.total_attempts > 0);
    if (withAttempts.length === 0) {
      toast.error(t('trainer.toastWeakLocked'));
      return;
    }

    const weakest = withAttempts.reduce((lowest, p) => {
      const acc = p.total_attempts > 0 ? p.correct_answers / p.total_attempts : 1;
      const lowestAcc = lowest.total_attempts > 0 ? lowest.correct_answers / lowest.total_attempts : 1;
      return acc < lowestAcc ? p : lowest;
    }, withAttempts[0]);

    const weakestCategory = weakest.category as Category;
    setMode('weak');
    startCategory(weakestCategory);
    const info = CATEGORY_INFO[weakestCategory];
    if (info) {
      toast.info(`${t('trainer.toastFocusingWeak')} ${info.name}`);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">
            {!user ? t('auth.signingIn') : t('test.loadingQuestions')}
          </p>
        </div>
      </div>
    );
  }

  if (selectedCategory && scenariosLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8 max-w-4xl pt-28">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <Skeleton className="h-9 w-40" />
              <div className="flex gap-4">
                <div className="text-center">
                  <Skeleton className="h-8 w-20 mb-1" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <div className="text-center">
                  <Skeleton className="h-6 w-16 mb-1" />
                  <Skeleton className="h-3 w-12" />
                </div>
                <div className="text-center">
                  <Skeleton className="h-6 w-16 mb-1" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            </div>
            <Skeleton className="h-2 w-full rounded-full" />
          </div>

          <GlassCard className="p-8">
            <Skeleton className="h-6 w-3/4 mb-6" />
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="w-full p-4 rounded-lg border-2 border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-5 h-5 rounded" />
                      <Skeleton className="h-4 w-40" />
                    </div>
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    );
  }

  if (!selectedCategory) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8 max-w-7xl pt-28">
          <div className="mb-8">
            <Button variant="ghost" asChild className="mb-4">
              <Link href="/dashboard">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('auth.backToHome')}
              </Link>
            </Button>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2">📚 {t('trainer.title')}</h1>
                <p className="text-muted-foreground">{t('dashboard.keepGoing')}</p>
              </div>
              <Button asChild variant="outline">
                <Link href="/decision-trainer/leaderboard">
                  <Trophy className="w-4 h-4 mr-2" />
                  {t('trainer.leaderboard')}
                </Link>
              </Button>
            </div>
          </div>

          {lastSessionSummary && (
            <div className="mb-6">
              <GlassCard className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div>
                    <h2 className="text-lg font-bold flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-primary" />
                      {t('trainer.lastSessionTitle')}: {CATEGORY_INFO[lastSessionSummary.category]?.name || lastSessionSummary.category}
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      {lastSessionSummary.stats.correctCount}/{lastSessionSummary.stats.totalCount} correct · {lastSessionSummary.stats.accuracy}% accuracy · {lastSessionSummary.stats.totalXpEarned} XP
                    </p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Avg time: {lastSessionSummary.stats.avgTimeSeconds}s · Best streak: {lastSessionSummary.stats.maxStreak}
                  </div>
                </div>

                {lastSessionSummary.mistakes.length > 0 ? (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">{t('trainer.questionsToReview')}</p>
                    {lastSessionSummary.mistakes.map((m) => (
                      <div key={m.scenarioId} className="text-sm flex flex-col md:flex-row md:items-center justify-between gap-2 border-t border-border/60 pt-2 mt-2">
                        <span className="text-muted-foreground line-clamp-2">
                          {m.question || 'Question'}
                        </span>
                        {m.chapterId && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => router.push(`/materials?chapter=${m.chapterId}`)}
                          >
                            Review chapter {m.chapterId}
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-green-600 flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    {t('trainer.perfectSession')}
                  </p>
                )}

                {/* Smart recommended next steps based on session accuracy */}
                <div className="mt-6 border-t pt-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold mb-1">{t('trainer.nextStepsTitle')}</p>
                    <p className="text-xs text-muted-foreground">
                      {lastSessionSummary.stats.accuracy >= 80
                        ? t('trainer.nextStepsHigh')
                        : lastSessionSummary.stats.accuracy >= 50
                        ? t('trainer.nextStepsMedium')
                        : t('trainer.nextStepsLow')}
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 md:justify-end">
                    {/* Practice more in Decision Trainer */}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setMode('quick5');
                        startCategory(lastSessionSummary.category);
                      }}
                    >
                      {t('trainer.practiceMoreCta')}
                    </Button>

                    {/* Weak points mode (if available via handleStartWeakPoints) */}
                    {(categoryProgressData || []).some((p: any) => p.total_attempts > 0) && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleStartWeakPoints}
                      >
                        {t('trainer.weakPointsModeCta')}
                      </Button>
                    )}

                    {/* Go to related tests for this category */}
                    <Button
                      size="sm"
                      asChild
                      variant="outline"
                    >
                      <Link href={`/category/${lastSessionSummary.category.toLowerCase()}`}>
                        {t('trainer.goToTestsCta')}
                      </Link>
                    </Button>
                  </div>
                </div>
              </GlassCard>
            </div>
          )}

          {trainerStats && (
            <div className="mb-6">
              <GlassCard className="p-6">
                {(() => {
                  const achievements = [
                    {
                      id: 'first-scenario',
                      label: 'First Steps',
                      description: 'Complete your first Decision Trainer scenario.',
                      unlocked: trainerStats.totalScenarios >= 1,
                    },
                    {
                      id: 'accuracy-ace',
                      label: 'Accuracy Ace',
                      description: 'Reach 80%+ accuracy over at least 20 attempts.',
                      unlocked: trainerStats.totalAttempts >= 20 && trainerStats.accuracy >= 80,
                    },
                    {
                      id: 'streak-master',
                      label: 'Streak Master',
                      description: 'Hit a best streak of 10 correct answers.',
                      unlocked: trainerStats.bestStreak >= 10,
                    },
                    {
                      id: 'xp-hunter',
                      label: 'XP Hunter',
                      description: 'Earn a total of 500 XP in Decision Trainer.',
                      unlocked: trainerStats.totalXp >= 500,
                    },
                    {
                      id: 'category-explorer',
                      label: 'Category Explorer',
                      description: 'Practice at least 3 different Decision Trainer categories.',
                      unlocked: trainerStats.categoriesCompleted >= 3,
                    },
                  ];

                  const unlockedCount = achievements.filter((a) => a.unlocked).length;

                  return (
                    <>
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-semibold flex items-center gap-2">
                          <Trophy className="w-4 h-4 text-primary" />
                          {t('dashboard.testAchievementsTitle')}
                        </h2>
                        <span className="text-xs text-muted-foreground">
                          {unlockedCount}/{achievements.length} unlocked
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {achievements.map((ach) => (
                          <div
                            key={ach.id}
                            className={`border rounded-lg px-3 py-2 text-xs ${
                              ach.unlocked
                                ? 'border-primary bg-primary/5'
                                : 'border-border/60 bg-background/40 opacity-80'
                            }`}
                          >
                            <div className="font-semibold flex items-center gap-1 mb-1">
                              {ach.unlocked ? (
                                <Check className="w-3 h-3 text-primary" />
                              ) : (
                                <span className="w-2 h-2 rounded-full bg-muted-foreground/40" />
                              )}
                              {ach.label}
                            </div>
                            <p className="text-[11px] text-muted-foreground">{ach.description}</p>
                          </div>
                        ))}
                      </div>
                    </>
                  );
                })()}
              </GlassCard>
            </div>
          )}
          
          <GlassCard className="p-4 mb-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">
                  Practice modes
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant={mode === 'full' ? 'default' : 'outline'}
                  onClick={() => setMode('full')}
                >
                  Full category
                </Button>
                <Button
                  size="sm"
                  variant={mode === 'quick5' ? 'default' : 'outline'}
                  onClick={() => setMode('quick5')}
                >
                  Quick: 5 questions
                </Button>
                <Button
                  size="sm"
                  variant={mode === 'quick10' ? 'default' : 'outline'}
                  onClick={() => setMode('quick10')}
                >
                  Quick: 10 questions
                </Button>
                {(categoryProgressData || []).some((p: any) => p.total_attempts > 0) && (
                  <Button
                    size="sm"
                    variant={mode === 'weak' ? 'default' : 'outline'}
                    onClick={handleStartWeakPoints}
                  >
                    Weak points
                  </Button>
                )}
              </div>
            </div>
          </GlassCard>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(CATEGORY_INFO).map(([key, info]) => {
              const categoryCount = scenarios.filter((scenario) => scenario.category === key).length;
              const progressForCategory = (categoryProgressData || []).find((p: any) => p.category === key);
              const totalAttempts = progressForCategory?.total_attempts ?? 0;
              const correctAnswers = progressForCategory?.correct_answers ?? 0;
              const accuracy = totalAttempts > 0 ? Math.round((correctAnswers / totalAttempts) * 100) : null;
              let statusLabel = 'New';
              let statusClass = 'bg-muted text-muted-foreground';
              if (totalAttempts > 0 && accuracy !== null) {
                if (accuracy >= 80) {
                  statusLabel = 'Strong';
                  statusClass = 'bg-green-500/10 text-green-600 border border-green-500/30';
                } else if (accuracy >= 50) {
                  statusLabel = 'Improving';
                  statusClass = 'bg-blue-500/10 text-blue-600 border border-blue-500/30';
                } else {
                  statusLabel = 'Needs attention';
                  statusClass = 'bg-yellow-500/10 text-yellow-600 border border-yellow-500/30';
                }
              }
              return (
                <GlassCard
                  key={key}
                  className="p-6 hover:border-primary/50 transition-all cursor-pointer"
                  onClick={() => startCategory(key as Category)}
                >
                  <div className="flex items-start gap-4">
                    <div className="text-5xl">{info.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2">{info.name}</h3>
                      <p className="text-sm text-muted-foreground">{info.description}</p>
                      <div className="mt-1">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${statusClass}`}>
                          {statusLabel}
                        </span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm mt-2">
                        <span className="text-muted-foreground">
                          {categoryCount} scenarios
                          {accuracy !== null && ` · ${accuracy}% accuracy`}
                        </span>
                        <Button size="sm" className="w-full sm:w-auto">
                          {t('categories.startPractice')} →
                        </Button>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  const categoryInfo = CATEGORY_INFO[selectedCategory];
  const progress = ((currentScenarioIndex + 1) / categoryScenarios.length) * 100;
  const correctOptionIndices = currentScenario
    ? currentScenario.options
        .map((option: any, index: number) => (option.isCorrect ? index : -1))
        .filter((index: number) => index !== -1)
    : [];
  const optionLetter = (index: number) => String.fromCharCode(65 + index);
  const correctLetters = correctOptionIndices.map(optionLetter);
  const selectedLetters = selectedOptions.map(optionLetter);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {/* <Confetti refConfetti={setConfettiInstance} /> */}
      
      <div className="container mx-auto px-4 py-8 max-w-4xl pt-28">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => {
              setSelectedCategory(null);
              setSessionScenarioIds(null);
              if (mode === 'weak') {
                setMode('full');
              }
            }}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('test.backToTests')}
          </Button>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <span className="text-4xl">{categoryInfo.icon}</span>
                {categoryInfo.name}
              </h1>
              <p className="text-muted-foreground">{t('test.question')} {currentScenarioIndex + 1} {t('test.of')} {categoryScenarios.length}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Mode:{' '}
                {mode === 'full' && t('trainer.modeFull')}
                {mode === 'quick5' && t('trainer.modeQuick5')}
                {mode === 'quick10' && t('trainer.modeQuick10')}
                {mode === 'weak' && t('trainer.modeWeak')}
              </p>
            </div>
            <div className="flex flex-wrap sm:flex-nowrap gap-4 justify-start sm:justify-end">
              <div className="text-center min-w-[90px]">
                <div className={`text-3xl font-bold ${timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-blue-500'}`}>
                  ⏱️ {timeLeft}s
                </div>
                <div className="text-xs text-muted-foreground">{t('test.timeLeft')}</div>
              </div>
              <div className="text-center min-w-[70px]">
                <div className="text-2xl font-bold text-primary">{stats.xp}</div>
                <div className="text-xs text-muted-foreground">XP</div>
              </div>
              <div className="text-center min-w-[70px]">
                <div className="text-2xl font-bold text-green-500">{stats.streak}</div>
                <div className="text-xs text-muted-foreground">{t('dashboard.streak')}</div>
              </div>
            </div>
          </div>

          <div className="w-full bg-muted rounded-full h-2">
            <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {currentScenario && (
          <GlassCard className="p-8">
            <h2 className="text-2xl font-bold mb-6">{currentScenario.question}</h2>

            <div className="space-y-3 mb-6">
              {currentScenario.options.map((option: any, index: number) => {
                const isSelected = selectedOptions.includes(index);
                const isCorrect = option.isCorrect;
                const showCorrect = showResult && isCorrect;
                const showWrong = showResult && isSelected && !isCorrect;
                const showMissed = showResult && !isSelected && isCorrect;

                return (
                  <motion.button
                    key={index}
                    onClick={() => handleSelectOption(index)}
                    disabled={showResult}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                      showCorrect
                        ? 'border-green-500 bg-green-500/10'
                        : showWrong
                        ? 'border-red-500 bg-red-500/10'
                        : showMissed
                        ? 'border-yellow-500 bg-yellow-500/10'
                        : isSelected
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                    whileHover={{ scale: showResult ? 1 : 1.02 }}
                    whileTap={{ scale: showResult ? 1 : 0.98 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                          isSelected 
                            ? 'border-primary bg-primary text-primary-foreground' 
                            : 'border-border'
                        }`}>
                          {isSelected && <Check className="w-3 h-3" />}
                        </div>
                        <span className="font-medium">{option.text}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {showCorrect && <Check className="w-5 h-5 text-green-500" />}
                        {showWrong && <X className="w-5 h-5 text-red-500" />}
                        {showMissed && <span className="text-yellow-500 text-sm font-medium">{t('test.failed')}</span>}
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            <AnimatePresence>
              {showResult && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <div className={`p-4 rounded-lg border-2 ${
                    sessionAttempts[sessionAttempts.length - 1]?.isCorrect
                      ? 'border-green-500 bg-green-500/10'
                      : 'border-red-500 bg-red-500/10'
                  }`}>
                    <div className="flex items-start gap-3">
                      <Lightbulb className="w-5 h-5 mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <h3 className="font-bold mb-2">
                          {sessionAttempts[sessionAttempts.length - 1]?.isCorrect ? '✓ Correct!' : '✗ Incorrect - Learn from this!'}
                        </h3>
                        <div className="mb-3 text-sm">
                          <p className="font-semibold">
                            Correct combination:{' '}
                            <span className="text-green-600">
                              {correctLetters.length > 0 ? correctLetters.join(' + ') : '-'}
                            </span>
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Your selection:{' '}
                            {selectedLetters.length > 0 ? selectedLetters.join(' + ') : 'No options selected'}
                          </p>
                        </div>
                        
                        {!sessionAttempts[sessionAttempts.length - 1]?.isCorrect && (
                          <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-lg mb-3">
                            <p className="text-sm font-semibold mb-1">{t('test.correctLabel')}</p>
                            <div className="space-y-1">
                              {selectedOptions.map((optionIndex: number) => (
                                <p key={optionIndex} className="text-sm">
                                  • {currentScenario.options[optionIndex].text}
                                  {currentScenario.options[optionIndex].explanation && (
                                    <span className="text-muted-foreground"> - {currentScenario.options[optionIndex].explanation}</span>
                                  )}
                                </p>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <div className="bg-green-500/10 border border-green-500/30 p-3 rounded-lg mb-3">
                          <p className="text-sm font-semibold mb-1">{t('test.correctAnswers')}</p>
                          <p className="text-sm">{currentScenario.correct_explanation}</p>
                        </div>
                        
                        <div className="bg-background/50 p-3 rounded-lg">
                          <p className="text-sm"><strong>💡 </strong>{currentScenario.real_world_tip}</p>
                        </div>

                        {currentScenario.chapter_id && (
                          <div className="mt-3">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => router.push(`/materials?chapter=${currentScenario.chapter_id}`)}
                            >
                              {t('materials.title')} – Chapter {currentScenario.chapter_id}
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <Button onClick={handleNext} className="w-full" size="lg">
                    {currentScenarioIndex < categoryScenarios.length - 1 ? t('test.next') : t('test.submitTest')}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

            {!showResult && (
              <div className="space-y-3">
                <div className="text-sm text-muted-foreground text-center">
                  {selectedOptions.length === 0 
                    ? t('test.selectAnswers')
                    : `${selectedOptions.length} ${t('test.optionsSelected')}`
                  }
                </div>
                <Button
                  onClick={handleSubmitAnswer}
                  disabled={selectedOptions.length === 0}
                  className="w-full"
                  size="lg"
                >
                  {t('test.submitAnswer')}
                </Button>
              </div>
            )}
          </GlassCard>
        )}

        <div className="mt-8">
          <GlassCard className="p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" />
              {t('test.sessionStats')}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">{stats.correct}/{stats.total}</div>
                <div className="text-xs text-muted-foreground">{t('test.correctLabel')}</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">{stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0}%</div>
                <div className="text-xs text-muted-foreground">{t('test.accuracy')}</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-500">{stats.streak}</div>
                <div className="text-xs text-muted-foreground">{t('test.bestStreak')}</div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
