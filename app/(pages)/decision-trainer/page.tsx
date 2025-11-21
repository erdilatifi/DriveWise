'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import { Skeleton } from '@/components/ui/skeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Check, X, Lightbulb, Trophy, Zap, Timer, TrafficCone, Octagon, User, GitBranch, AlertTriangle, Car } from 'lucide-react';
import Link from 'next/link';
import { CATEGORY_INFO, type Category } from '@/data/scenarios';
import { useScenarios, type Scenario as TrainerScenario } from '@/hooks/use-scenarios';
import { useCompleteCategory, useDecisionTrainerProgress, useDecisionTrainerStats } from '@/hooks/use-decision-trainer';
import type { DecisionTrainerProgress } from '@/hooks/use-decision-trainer';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/language-context';
import { useGlobalPremium } from '@/hooks/use-subscriptions';
// import Confetti from 'react-canvas-confetti';

type SessionAttempt = {
  scenarioId: string;
  isCorrect: boolean;
  selectedOptions: number[];
  timeTakenMs: number;
  xpEarned: number;
};

const CATEGORY_ICONS: Record<Category, React.ReactNode> = {
  'traffic-lights': <TrafficCone className="w-5 h-5 text-primary" />,
  signs: <Octagon className="w-5 h-5 text-primary" />,
  pedestrians: <User className="w-5 h-5 text-primary" />,
  'right-of-way': <GitBranch className="w-5 h-5 text-primary" />,
  hazards: <AlertTriangle className="w-5 h-5 text-primary" />,
  parking: <Car className="w-5 h-5 text-primary" />,
};

export default function DecisionTrainerPage() {
  const { user, loading: authLoading, isAdmin } = useAuth();
  const router = useRouter();
  const { t } = useLanguage();
  const { data: categoryProgressData } = useDecisionTrainerProgress(user?.id);
  const { data: trainerStats } = useDecisionTrainerStats(user?.id);
  const { hasAnyActivePlan, isLoading: premiumLoading } = useGlobalPremium(user?.id, isAdmin);
  
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [stats, setStats] = useState({ correct: 0, total: 0, streak: 0, xp: 0 });
  const [timeLeft, setTimeLeft] = useState(30); // 30 seconds per scenario
  const [totalTime, setTotalTime] = useState(0);
  const [sessionAttempts, setSessionAttempts] = useState<SessionAttempt[]>([]);
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
  const { data: rawScenarios = [], isLoading: scenariosLoading, error: scenariosError } = useScenarios(selectedCategory || undefined);
  const scenarios = (rawScenarios ?? []) as TrainerScenario[];

  const toastBaseClass =
    'text-[13px] rounded-xl px-3 py-2 shadow-[0_18px_60px_rgba(0,0,0,0.9)] backdrop-blur-sm';

  const toastStyles = {
    success: {
      className:
        toastBaseClass +
        ' bg-emerald-500/15 border border-emerald-400/70 text-emerald-50',
    },
    error: {
      className:
        toastBaseClass +
        ' bg-red-500/15 border border-red-500/70 text-red-50',
    },
    info: {
      className:
        toastBaseClass +
        ' bg-primary/10 border border-primary/70 text-foreground',
    },
  } as const;
  
  // Mutation for completing category
  const completeCategoryMutation = useCompleteCategory();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

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

    const subset = selectSessionScenarioIds({ scenarios, mode });
    setSessionScenarioIds(subset);
    setCurrentScenarioIndex(0);
  }, [selectedCategory, scenariosLoading, scenarios, mode, sessionScenarioIds]);

  const categoryScenarios = selectedCategory
    ? (sessionScenarioIds
        ? scenarios.filter((s) => sessionScenarioIds.includes(s.id))
        : scenarios)
    : scenarios;
  const currentScenario = categoryScenarios[currentScenarioIndex];

  // Timer countdown for each scenario
  useEffect(() => {
    if (!selectedCategory || !currentScenario || showResult) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [selectedCategory, currentScenarioIndex, showResult, currentScenario]);

  // When time runs out, auto-submit the current selection (or mark incorrect with none)
  useEffect(() => {
    if (!selectedCategory || !currentScenario || showResult) return;
    if (timeLeft > 0) return;

    handleTimeUp();
  }, [timeLeft, selectedCategory, currentScenario, showResult]);

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

  const recordAttempt = (attempt: SessionAttempt) => {
    setSessionAttempts((prev) => [...prev, attempt]);
    setShowResult(true);

    setStats((prev) => {
      const newStreak = attempt.isCorrect ? prev.streak + 1 : 0;
      const newStats = {
        correct: prev.correct + (attempt.isCorrect ? 1 : 0),
        total: prev.total + 1,
        streak: newStreak,
        xp: prev.xp + attempt.xpEarned,
      };

      // Streak-based celebrations could go here using newStreak
      // e.g. if (attempt.isCorrect && newStreak > 0 && newStreak % 5 === 0) { ... }

      return newStats;
    });

    if (attempt.isCorrect) {
      toast.success(
        `${t('trainer.toastCorrect')} +${attempt.xpEarned} XP`,
        toastStyles.success,
      );
    } else {
      toast.error(t('trainer.toastIncorrect'), toastStyles.error);
    }
  };

  const handleSubmitAnswer = () => {
    if (selectedOptions.length === 0 || !currentScenario) return;

    const correctOptionIndices = currentScenario.options
      .map((option, index) => (option.isCorrect ? index : -1))
      .filter((index: number) => index !== -1);

    const isCorrect =
      selectedOptions.length === correctOptionIndices.length &&
      selectedOptions.every((index: number) =>
        correctOptionIndices.includes(index),
      ) &&
      correctOptionIndices.every((index: number) =>
        selectedOptions.includes(index),
      );

    const timeTaken = (30 - timeLeft) * 1000; // Convert to milliseconds
    const xpEarned = isCorrect ? currentScenario.xp : 0;

    const attempt: SessionAttempt = {
      scenarioId: currentScenario.id,
      isCorrect,
      selectedOptions,
      timeTakenMs: timeTaken,
      xpEarned,
    };

    recordAttempt(attempt);
  };

  const handleTimeUp = () => {
    if (!currentScenario || showResult) return;

    const correctOptionIndices = currentScenario.options
      .map((option, index) => (option.isCorrect ? index : -1))
      .filter((index: number) => index !== -1);

    const isCorrect =
      selectedOptions.length === correctOptionIndices.length &&
      selectedOptions.every((index: number) =>
        correctOptionIndices.includes(index),
      ) &&
      correctOptionIndices.every((index: number) =>
        selectedOptions.includes(index),
      );

    const timeTaken = (30 - timeLeft) * 1000;
    const xpEarned = isCorrect ? currentScenario.xp : 0;

    const attempt: SessionAttempt = {
      scenarioId: currentScenario.id,
      isCorrect,
      selectedOptions,
      timeTakenMs: timeTaken,
      xpEarned,
    };

    recordAttempt(attempt);
  };

  const resetSessionState = (resetCategory: boolean) => {
    if (resetCategory) {
      setSelectedCategory(null);
    }
    setCurrentScenarioIndex(0);
    setSelectedOptions([]);
    setShowResult(false);
    setStats({ correct: 0, total: 0, streak: 0, xp: 0 });
    setTimeLeft(30);
    setTotalTime(0);
    setSessionAttempts([]);
    setSessionScenarioIds(null);
    if (resetCategory && mode === 'weak') {
      setMode('full');
    }
  };

  const handleNext = async () => {
    if (currentScenarioIndex < categoryScenarios.length - 1) {
      setCurrentScenarioIndex((prev) => prev + 1);
      setSelectedOptions([]);
      setShowResult(false);
      setTimeLeft(30); // Reset timer for next scenario
    } else {
      // Category completed - save results to database
      const completionTime = sessionAttempts.reduce(
        (sum, a) => sum + a.timeTakenMs,
        0,
      );
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
            `${t('test.congratulations')} – ${result.sessionStats.accuracy}% ${t('test.accuracy')}, +${result.sessionStats.totalXpEarned} XP`,
            { ...toastStyles.success, duration: 5000 }
          );

          const mistakes = computeMistakes(
            sessionAttempts,
            categoryScenarios as TrainerScenario[],
          );

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
          toast.error(t('trainer.toastSyncFailed'), toastStyles.error);

          const computedStats = computeSessionStats(
            sessionAttempts,
            completionTime,
          );
          const mistakes = computeMistakes(
            sessionAttempts,
            categoryScenarios as TrainerScenario[],
          );

          if (selectedCategory) {
            setLastSessionSummary({
              category: selectedCategory,
              stats: computedStats,
              mistakes,
            });
          }
        }
      }

      // Reset for next session
      resetSessionState(true);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startCategory = (category: Category) => {
    const availableScenarios = (scenarios || []).filter((s) => s.category === category);
    if (!availableScenarios.length) {
      toast.error(t('trainer.noScenariosTitle'), toastStyles.error);
      return;
    }

    setSelectedCategory(category);
    setCurrentScenarioIndex(0);
    setSelectedOptions([]);
    setShowResult(false);
    setStats({ correct: 0, total: 0, streak: 0, xp: 0 });
    setTimeLeft(30);
    setTotalTime(0);
    setSessionAttempts([]);
    setSessionScenarioIds(null);
  };

  const handleStartWeakPoints = () => {
    const progressList = (categoryProgressData || []) as DecisionTrainerProgress[];
    const withAttempts = progressList.filter((p) => p.total_attempts > 0);
    if (withAttempts.length === 0) {
      toast.error(t('trainer.toastWeakLocked'), toastStyles.error);
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
      toast.info(`${t('trainer.toastFocusingWeak')} ${info.name}`, toastStyles.info);
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

  if (!isAdmin && !premiumLoading && !hasAnyActivePlan) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8 max-w-3xl pt-28">
          <GlassCard className="p-6 border border-border/80 bg-black/80">
            <h1 className="text-2xl font-semibold mb-2 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-primary" />
              {t('trainer.premiumRequiredTitle') || 'Unlock Decision Trainer'}
            </h1>
            <p className="text-sm text-muted-foreground mb-4">
              {t('trainer.premiumRequiredDescription') ||
                'Decision Trainer is part of the paid plan. With a paid plan you get full access to all trainer categories, smarter practice modes, and detailed review features.'}
            </p>
            <ul className="text-sm text-muted-foreground mb-4 list-disc pl-5 space-y-1">
              <li>
                {t('trainer.premiumBenefitUnlimited') || 'Unlimited Decision Trainer practice across all categories.'}
              </li>
              <li>
                {t('trainer.premiumBenefitStudy') || 'Access to related study material and test reviews for deeper learning.'}
              </li>
              <li>
                {t('trainer.premiumBenefitFocus') || 'Smart modes that focus on your weak points and speed.'}
              </li>
            </ul>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild className="flex-1">
                <Link href="/pricing">
                  {t('trainer.premiumUpgradeCta') || 'See plans'}
                </Link>
              </Button>
              <Button asChild variant="outline" className="flex-1">
                <Link href="/dashboard">
                  {t('auth.backToHome')}
                </Link>
              </Button>
            </div>
          </GlassCard>
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

  if (selectedCategory && !scenariosLoading && categoryScenarios.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8 max-w-4xl pt-28">
          <GlassCard className="p-6 border border-border/80 bg-black/80">
            <h1 className="text-xl font-semibold mb-2 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" />
              {t('trainer.noScenariosTitle')}
            </h1>
            <p className="text-sm text-muted-foreground mb-4">
              {t('trainer.noScenariosSubtitle')}
            </p>
            <Button variant="outline" onClick={() => setSelectedCategory(null)}>
              {t('auth.backToHome')}
            </Button>
          </GlassCard>
        </div>
      </div>
    );
  }

  if (!selectedCategory) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8 max-w-7xl pt-28 relative">
          <div className="pointer-events-none absolute inset-x-0 top-20 h-px bg-gradient-to-r from-transparent via-orange-400/35 to-transparent opacity-70" />
          <div className="pointer-events-none absolute hidden md:block left-1/2 top-24 bottom-10 w-px bg-gradient-to-b from-orange-400/30 via-transparent to-transparent opacity-70" />

          <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('auth.backToHome')}
            </Link>
          </Button>
          <GlassCard className="p-5 md:p-6 border border-border/80 bg-black/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden">
            <div className="pointer-events-none absolute -right-24 -top-24 h-40 w-40 rounded-full bg-primary/20 blur-3xl opacity-60" />
            <div className="relative space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/5 px-3 py-1 text-[11px] font-medium text-primary">
                <Zap className="w-4 h-4" />
                <span>{t('trainer.practiceModes')}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
                {t('trainer.title')}
              </h1>
              <p className="text-sm md:text-base text-muted-foreground">
                {t('trainer.heroExplainer')}
              </p>
            </div>
            <div className="relative">
              <Button asChild variant="outline" className="mt-2 md:mt-0">
                <Link href="/decision-trainer/leaderboard">
                  <Trophy className="w-4 h-4 mr-2" />
                  {t('trainer.leaderboard')}
                </Link>
              </Button>
            </div>
          </GlassCard>
        </div>

          {scenariosError && (
            <div className="mb-6">
              <GlassCard className="p-4 border-destructive/40">
                <p className="text-sm text-destructive font-medium mb-1">
                  {t('error.title')}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t('error.message')}
                </p>
              </GlassCard>
            </div>
          )}

          {!scenariosError && !scenariosLoading && scenarios.length === 0 && (
            <div className="mb-6">
              <GlassCard className="p-4">
                <p className="text-sm font-medium mb-1">
                  {t('trainer.noScenariosTitle')}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t('trainer.noScenariosSubtitle')}
                </p>
              </GlassCard>
            </div>
          )}

          {lastSessionSummary && (
            <div className="mb-6">
              <GlassCard className="p-6 border border-border/80 bg-black/80 relative overflow-hidden">
                <div className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-70" />
                <div className="pointer-events-none absolute -right-24 bottom-0 w-40 h-40 rounded-full bg-primary/15 blur-3xl" />
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div>
                    <h2 className="text-lg font-bold flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-primary" />
                      {t('trainer.lastSessionTitle')}: {CATEGORY_INFO[lastSessionSummary.category]?.name || lastSessionSummary.category}
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      {lastSessionSummary.stats.correctCount}/{lastSessionSummary.stats.totalCount} {t('test.correctLabel').toLowerCase()} · {lastSessionSummary.stats.accuracy}% {t('test.accuracy').toLowerCase()} · {lastSessionSummary.stats.totalXpEarned} {t('dashboard.trainerXp')}
                    </p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t('test.timeLeft')}: {lastSessionSummary.stats.avgTimeSeconds}s · {t('dashboard.trainerBestStreak')}: {lastSessionSummary.stats.maxStreak}
                  </div>
                </div>

                {lastSessionSummary.mistakes.length > 0 ? (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">{t('trainer.questionsToReview')}</p>
                    {lastSessionSummary.mistakes.map((m) => (
                      <div key={m.scenarioId} className="text-sm flex flex-col md:flex-row md:items-center justify-between gap-2 border-t border-border/60 pt-2 mt-2">
                        <span className="text-muted-foreground line-clamp-2">
                          {m.question || t('test.question')}
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
                    {(categoryProgressData || []).some((p) => p.total_attempts > 0) && (
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
              <GlassCard className="p-6 border border-border/80 bg-black/80">
                {(() => {
                  const achievements = [
                    {
                      id: 'first-scenario',
                      label: t('trainer.firstSteps'),
                      description: t('trainer.firstScenarioDesc'),
                      unlocked: trainerStats.totalScenarios >= 1,
                    },
                    {
                      id: 'accuracy-ace',
                      label: t('trainer.accuracyAce'),
                      description: t('trainer.accuracyAceDesc'),
                      unlocked: trainerStats.totalAttempts >= 20 && trainerStats.accuracy >= 80,
                    },
                    {
                      id: 'streak-master',
                      label: t('trainer.streakMaster'),
                      description: t('trainer.streakMasterDesc'),
                      unlocked: trainerStats.bestStreak >= 10,
                    },
                    {
                      id: 'xp-hunter',
                      label: t('trainer.xpHunter'),
                      description: t('trainer.xpHunterDesc'),
                      unlocked: trainerStats.totalXp >= 500,
                    },
                    {
                      id: 'category-explorer',
                      label: t('trainer.categoryExplorer'),
                      description: t('trainer.categoryExplorerDesc'),
                      unlocked: trainerStats.categoriesCompleted >= 3,
                    },
                    {
                      id: 'consistency-pro',
                      label: t('trainer.consistencyPro'),
                      description: t('trainer.consistencyProDesc'),
                      unlocked: trainerStats.totalScenarios >= 50,
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
                          {unlockedCount}/{achievements.length} {t('trainer.achievementsUnlockedLabel')}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {achievements.map((ach) => (
                          <div
                            key={ach.id}
                            className={`border rounded-lg px-3 py-2 text-xs ${
                              ach.unlocked
                                ? 'border-primary/60 bg-primary/15'
                                : 'border-border/70 bg-black/60 opacity-80'
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
          
          <GlassCard className="p-4 mb-6 border border-border/80 bg-black/80">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">
                  {t('trainer.practiceModes')}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant={mode === 'full' ? 'default' : 'outline'}
                  onClick={() => setMode('full')}
                >
                  {t('trainer.fullCategory')}
                </Button>
                <Button
                  size="sm"
                  variant={mode === 'quick5' ? 'default' : 'outline'}
                  onClick={() => setMode('quick5')}
                >
                  {t('trainer.quick5')}
                </Button>
                <Button
                  size="sm"
                  variant={mode === 'quick10' ? 'default' : 'outline'}
                  onClick={() => setMode('quick10')}
                >
                  {t('trainer.quick10')}
                </Button>
                {(categoryProgressData || []).some((p) => p.total_attempts > 0) && (
                  <Button
                    size="sm"
                    variant={mode === 'weak' ? 'default' : 'outline'}
                    onClick={handleStartWeakPoints}
                  >
                    {t('trainer.weakPoints')}
                  </Button>
                )}
              </div>
            </div>
          </GlassCard>

          {scenariosLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <GlassCard
                  key={i}
                  className="p-6 md:p-7 border border-border/80 bg-black/80"
                >
                  <div className="flex items-start gap-4">
                    <Skeleton className="w-12 h-12 md:w-14 md:h-14 rounded-2xl" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-3 w-40" />
                      <Skeleton className="h-3 w-28" />
                      <Skeleton className="h-8 w-32" />
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(CATEGORY_INFO).map(([key, info]) => {
                const categoryCount = scenarios.filter((scenario) => scenario.category === key).length;
                const progressForCategory = (categoryProgressData || []).find((p) => p.category === key);
                const totalAttempts = progressForCategory?.total_attempts ?? 0;
                const correctAnswers = progressForCategory?.correct_answers ?? 0;
                const accuracy = totalAttempts > 0 ? Math.round((correctAnswers / totalAttempts) * 100) : null;
                let statusLabel = t('trainer.statusNew');
                let statusClass = 'bg-muted text-muted-foreground';
                if (totalAttempts > 0 && accuracy !== null) {
                  if (accuracy >= 80) {
                    statusLabel = t('trainer.statusStrong');
                    statusClass = 'bg-green-500/10 text-green-600 border border-green-500/30';
                  } else if (accuracy >= 50) {
                    statusLabel = t('trainer.statusImproving');
                    statusClass = 'bg-blue-500/10 text-blue-600 border border-blue-500/30';
                  } else {
                    statusLabel = t('trainer.statusNeedsAttention');
                    statusClass = 'bg-yellow-500/10 text-yellow-600 border border-yellow-500/30';
                  }
                }
                return (
                  <GlassCard
                    key={key}
                    className="p-6 md:p-7 border border-border/80 bg-black/80 hover:border-primary/60 hover:shadow-[0_22px_60px_rgba(0,0,0,0.9)] transition-all cursor-pointer"
                    onClick={() => startCategory(key as Category)}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                        {CATEGORY_ICONS[key as Category]}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg md:text-xl font-semibold mb-1">{info.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{info.description}</p>
                        <div className="flex flex-wrap items-center gap-2 mb-2 text-xs">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full font-medium ${statusClass}`}
                          >
                            {statusLabel}
                          </span>
                          <span className="text-muted-foreground">
                            {categoryCount} {t('trainer.scenariosShort')}
                            {accuracy !== null && ` · ${accuracy}% ${t('trainer.accuracyShort')}`}
                          </span>
                        </div>
                        <Button size="sm" className="w-full sm:w-auto">
                          {t('categories.startPractice')} →
                        </Button>
                      </div>
                    </div>
                  </GlassCard>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  const categoryInfo = CATEGORY_INFO[selectedCategory];
  const progress = ((currentScenarioIndex + 1) / categoryScenarios.length) * 100;
  const correctOptionIndices = currentScenario
    ? currentScenario.options
        .map((option, index) => (option.isCorrect ? index : -1))
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
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  {CATEGORY_ICONS[selectedCategory as Category]}
                </div>
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
                <div className={`flex items-center justify-center gap-1.5 text-2xl font-semibold ${
                  timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-sky-400'
                }`}>
                  <Timer className="w-5 h-5" />
                  <span>{timeLeft}s</span>
                </div>
                <div className="text-xs text-muted-foreground">{t('test.timeLeft')}</div>
              </div>
              <div className="text-center min-w-[70px]">
                <div className="text-2xl font-bold text-primary">{stats.xp}</div>
                <div className="text-xs text-muted-foreground">{t('dashboard.trainerXp')}</div>
              </div>
              <div className="text-center min-w-[70px]">
                <div className="text-2xl font-bold text-amber-300">{stats.streak}</div>
                <div className="text-xs text-muted-foreground">{t('dashboard.streak')}</div>
              </div>
            </div>
          </div>

          <div className="w-full bg-muted rounded-full h-2">
            <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {currentScenario && (
          <GlassCard className="p-6 md:p-8 border border-border/80 bg-black/80">
            <h2 className="text-2xl font-bold mb-6">{currentScenario.question}</h2>

            <div className="space-y-3 mb-6">
              {currentScenario.options.map((option, index: number) => {
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
                    className={`w-full p-4 md:p-5 rounded-xl border-2 text-left transition-all ${
                      showCorrect
                        ? 'border-green-500/80 bg-green-500/15'
                        : showWrong
                        ? 'border-red-500/80 bg-red-500/15'
                        : showMissed
                        ? 'border-yellow-500/80 bg-yellow-500/12'
                        : isSelected
                        ? 'border-primary/70 bg-primary/10 shadow-[0_18px_50px_rgba(0,0,0,0.9)]'
                        : 'border-border/70 bg-black/60 hover:border-primary/50 hover:bg-black/80'
                    }`}
                    whileHover={{ scale: showResult ? 1 : 1.02 }}
                    whileTap={{ scale: showResult ? 1 : 0.98 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center ${
                          isSelected 
                            ? 'border-primary bg-primary text-primary-foreground' 
                            : 'border-border bg-black/60'
                        }`}>
                          {isSelected && <Check className="w-3.5 h-3.5" />}
                        </div>
                        <span className="font-medium break-words text-left">{option.text}</span>
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
                          {sessionAttempts[sessionAttempts.length - 1]?.isCorrect ? t('test.correctTitle') : t('test.incorrectTitle')}
                        </h3>
                        <div className="mb-3 text-sm">
                          <p className="font-semibold">
                            {t('trainer.correctCombinationLabel')}{' '}
                            <span className="text-green-600">
                              {correctLetters.length > 0 ? correctLetters.join(' + ') : '-'}
                            </span>
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {t('trainer.yourSelectionLabel')}{' '}
                            {selectedLetters.length > 0 ? selectedLetters.join(' + ') : t('trainer.noSelectionLabel')}
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
                          <div className="flex items-start gap-2">
                            <Lightbulb className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                            <p className="text-sm text-muted-foreground">{currentScenario.real_world_tip}</p>
                          </div>
                        </div>

                        {currentScenario.chapter_id && (
                          <div className="mt-3">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => router.push(`/materials?chapter=${currentScenario.chapter_id}`)}
                            >
                              {t('trainer.reviewChapterCta')} {currentScenario.chapter_id}
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
          <GlassCard className="p-6 border border-border/80 bg-black/80">
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

function selectSessionScenarioIds({
  scenarios,
  mode,
}: {
  scenarios: TrainerScenario[];
  mode: 'full' | 'quick5' | 'quick10' | 'weak';
}): string[] {
  if (mode === 'full') {
    return [];
  }

  const maxQuestions = mode === 'quick5' || mode === 'weak' ? 5 : 10;
  const shuffled = [...scenarios].sort(() => Math.random() - 0.5);
  return shuffled
    .slice(0, Math.min(maxQuestions, shuffled.length))
    .map((s) => s.id as string);
}

function computeSessionStats(
  attempts: SessionAttempt[],
  completionTimeMs: number,
) {
  const totalXpEarned = attempts.reduce((sum, a) => sum + a.xpEarned, 0);
  const correctCount = attempts.filter((a) => a.isCorrect).length;
  const totalCount = attempts.length;
  const accuracy =
    totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;

  let maxStreak = 0;
  let currentStreak = 0;
  for (const attempt of attempts) {
    if (attempt.isCorrect) {
      currentStreak += 1;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  }

  const avgTimeSeconds =
    totalCount > 0
      ? Math.round(completionTimeMs / totalCount / 1000)
      : 0;

  return {
    totalXpEarned,
    correctCount,
    totalCount,
    accuracy,
    maxStreak,
    avgTimeSeconds,
  };
}

function computeMistakes(
  attempts: SessionAttempt[],
  scenarios: TrainerScenario[],
) {
  return attempts
    .filter((a) => !a.isCorrect)
    .map((a) => {
      const scenario = scenarios.find((s) => s.id === a.scenarioId);
      return {
        scenarioId: a.scenarioId,
        question: scenario?.question || '',
        chapterId: scenario?.chapter_id ?? null,
      };
    });
}
