'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import { Skeleton } from '@/components/ui/skeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Check, X, Lightbulb, Trophy, Zap, Timer, TrafficCone, Octagon, User, GitBranch, AlertTriangle, Car, Play, Lock } from 'lucide-react';
import Link from 'next/link';
import { CATEGORY_INFO, type Category } from '@/data/scenarios';
import { useScenarios, type Scenario as TrainerScenario } from '@/hooks/use-scenarios';
import { useCompleteCategory, useDecisionTrainerProgress, useDecisionTrainerStats, useWeakScenarioIds } from '@/hooks/use-decision-trainer';
import type { DecisionTrainerProgress } from '@/hooks/use-decision-trainer';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/language-context';
import { useGlobalPremium, useUserPlans } from '@/hooks/use-subscriptions';
import { isPlanCurrentlyActive } from '@/lib/subscriptions';
// import Confetti from 'react-canvas-confetti';

type SessionAttempt = {
  scenarioId: string;
  isCorrect: boolean;
  selectedOptions: number[];
  timeTakenMs: number;
  xpEarned: number;
};

const CATEGORY_ICONS: Record<Category, React.ReactNode> = {
  'traffic-lights': <TrafficCone className="w-5 h-5" />,
  signs: <Octagon className="w-5 h-5" />,
  pedestrians: <User className="w-5 h-5" />,
  'right-of-way': <GitBranch className="w-5 h-5" />,
  hazards: <AlertTriangle className="w-5 h-5" />,
  parking: <Car className="w-5 h-5" />,
};

export default function DecisionTrainerPage() {
  const { user, loading: authLoading, isAdmin } = useAuth();
  const router = useRouter();
  const { t, language } = useLanguage();
  const isSq = language === 'sq';
  const { data: categoryProgressData } = useDecisionTrainerProgress(user?.id);
  const { data: trainerStats } = useDecisionTrainerStats(user?.id);
  const { data: weakScenarioIds } = useWeakScenarioIds(user?.id);
  
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
  
  const { hasAnyActivePlan, isLoading: premiumLoading } = useGlobalPremium(user?.id, isAdmin);
  const { data: userPlans } = useUserPlans(user?.id);

  const activeLicenseCategory = React.useMemo(() => {
    if (isAdmin) return 'B'; // Default for admin
    const now = new Date();
    const activePlan = (userPlans || []).find(
      (plan) =>
        plan.status === 'active' &&
        isPlanCurrentlyActive({ startDate: plan.start_date, endDate: plan.end_date }, now)
    );
    return (activePlan?.category as string) || 'B';
  }, [userPlans, isAdmin]);

  // Fetch scenarios from database
  const { data: rawScenarios = [], isLoading: scenariosLoading, error: scenariosError } = useScenarios(
    selectedCategory || undefined,
    activeLicenseCategory
  );
  const scenarios = (rawScenarios ?? []) as TrainerScenario[];

  const completeCategoryMutation = useCompleteCategory();

  const categoryScenarios = selectedCategory
    ? (sessionScenarioIds
        ? scenarios.filter((s) => sessionScenarioIds.includes(s.id))
        : scenarios)
    : scenarios;
  const currentScenario = categoryScenarios[currentScenarioIndex];

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // --- DEFINE HANDLERS & HELPERS BEFORE EARLY RETURNS ---

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

  const handleSelectOption = (index: number) => {
    if (showResult) return;
    setSelectedOptions(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      } else {
        return [...prev, index];
      }
    });
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
            `${t('trainer.toastCompleted')} – ${result.sessionStats.accuracy}% ${t('trainer.toastAccuracy')}, +${result.sessionStats.totalXpEarned} XP`,
            { ...toastStyles.success, duration: 5000 }
          );

          // Helper for mistakes (simple re-calc or just pass empty array if needed, 
          // but for now we rely on it being available in scope or we define it here)
          // Ideally computeMistakes should be imported or defined. 
          // Since it was likely defined at the bottom or outside, let's assume we need to move it too or import it.
          // Checking file... computeMistakes is likely defined at the bottom of the file outside component.
          // If so, we are fine. If it was inside component, we need to hoist it.
          // Looking at previous reads, it seemed to be used but I didn't see the definition. 
          // Assuming it's outside or imported.
          
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

  const startCategory = (category: Category, specificIds: string[] | null = null) => {
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
    setSessionScenarioIds(specificIds);
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
    const info = CATEGORY_INFO[weakestCategory];
    
    // Filter global weak IDs to only those in this category
    const categoryWeakIds = (weakScenarioIds || []).filter(id => {
      const s = scenarios.find(sc => sc.id === id);
      return s && s.category === weakestCategory;
    });

    setMode('weak');
    
    if (categoryWeakIds.length > 0) {
      startCategory(weakestCategory, categoryWeakIds);
      if (info) {
        toast.info(`${t('trainer.toastFocusingWeak')} ${info.name} (${categoryWeakIds.length} ${t('test.questions')})`, toastStyles.info);
      }
    } else {
      // Fallback if no specific IDs found
      startCategory(weakestCategory);
      if (info) {
        toast.info(`${t('trainer.toastFocusingWeak')} ${info.name}`, toastStyles.info);
      }
    }
  };

  // --- HOOKS THAT USE HANDLERS ---

  // Timer countdown for each scenario
  useEffect(() => {
    if (!selectedCategory || !currentScenario || showResult) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [selectedCategory, currentScenarioIndex, showResult, currentScenario]);

  // When time runs out, auto-submit
  useEffect(() => {
    if (!selectedCategory || !currentScenario || showResult) return;
    if (timeLeft > 0) return;

    handleTimeUp();
  }, [timeLeft, selectedCategory, currentScenario, showResult]); // Added handleTimeUp to dependencies effectively? No, it's stable enough if defined in scope.

  // --- EARLY RETURNS START HERE ---
  
  if (authLoading || !user || premiumLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8 max-w-7xl pt-32">
           <div className="mb-8">
             <Skeleton className="h-10 w-32 mb-4" />
             <GlassCard className="p-6 h-64 flex flex-col justify-center items-center">
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-4 w-64" />
             </GlassCard>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <GlassCard key={i} className="p-6 h-40">
                   <Skeleton className="w-12 h-12 rounded-2xl mb-4" />
                   <Skeleton className="h-5 w-24 mb-2" />
                   <Skeleton className="h-3 w-full" />
                </GlassCard>
              ))}
           </div>
        </div>
      </div>
    );
  }

  if (!isAdmin && !hasAnyActivePlan) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        {/* Background elements */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-orange-500/20 via-transparent to-transparent blur-3xl" />
        <Navbar />
        <div className="pt-32">
          <div className="container mx-auto px-4 py-10 max-w-3xl">
            <GlassCard className="p-8 md:p-10 border border-orange-500/30 bg-black/85 text-center relative overflow-hidden">
              <div className="pointer-events-none absolute -top-24 -right-24 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl" />
              
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-orange-500/10 flex items-center justify-center mb-6 border border-orange-500/20">
                  <Lock className="w-8 h-8 text-orange-400" />
                </div>
                
                <h1 className="text-3xl font-semibold mb-3 tracking-tight">
                  {t('trainer.premiumRequiredTitle')}
                </h1>
                <p className="text-base text-muted-foreground mb-8 max-w-lg mx-auto leading-relaxed">
                  {t('trainer.premiumRequiredDescription')}
                </p>
                
                <div className="grid gap-4 text-left max-w-md mx-auto mb-8 w-full">
                  {[
                    t('trainer.premiumBenefitUnlimited'),
                    t('trainer.premiumBenefitStudy'),
                    t('trainer.premiumBenefitFocus')
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
                    <Link href="/pricing">
                      {t('trainer.premiumUpgradeCta')}
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="flex-1 h-11 border-white/10 hover:bg-white/5">
                    <Link href="/dashboard">
                      {t('auth.backToHome')}
                    </Link>
                  </Button>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    );
  }


  if (selectedCategory && scenariosLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8 max-w-4xl pt-32">
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
        <div className="container mx-auto px-4 py-8 max-w-4xl pt-32">
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
      <div className="relative min-h-screen bg-background text-foreground overflow-hidden">
        {/* Background grid */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(60%_60%_at_50%_20%,#000_20%,transparent_70%)]"
        >
          <svg className="h-full w-full opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="trainer-grid" width="32" height="32" patternUnits="userSpaceOnUse">
                <path d="M32 0H0V32" fill="none" stroke="currentColor" strokeWidth="0.4" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#trainer-grid)" />
          </svg>
        </div>

        {/* Warm glows & rails */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-orange-500/25 via-transparent to-transparent blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="hidden lg:block absolute top-24 bottom-24 left-[10%] w-px bg-gradient-to-b from-transparent via-orange-500/25 to-transparent" />
          <div className="hidden lg:block absolute top-24 bottom-24 right-[10%] w-px bg-gradient-to-b from-transparent via-orange-500/25 to-transparent" />
        </div>

        <Navbar />
        
        <div className="container mx-auto px-4 py-8 max-w-7xl pt-32 relative">
          <div className="mb-8">
            <Button variant="ghost" asChild className="mb-6 hover:bg-orange-500/10 hover:text-orange-400 transition-colors">
              <Link href="/dashboard">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('auth.backToHome')}
              </Link>
            </Button>
            
            <GlassCard className="p-6 md:p-8 border border-border/80 bg-black/85 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
              <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-orange-500/10 blur-3xl opacity-60" />
              
              <div className="relative z-10 space-y-3 max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/40 bg-orange-500/10 px-3 py-1 text-[11px] font-medium text-orange-300">
                  <Zap className="w-3.5 h-3.5" />
                  <span>{t('trainer.practiceModes')}</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
                  {t('trainer.title')}
                </h1>
                <p className="text-base text-muted-foreground leading-relaxed">
                  {t('trainer.heroExplainer')}
                </p>
              </div>
              
              <div className="relative z-10 flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <Button asChild variant="outline" className="h-11 border-border/60 bg-black/40 hover:bg-black/60 hover:border-orange-500/50">
                  <Link href="/decision-trainer/leaderboard">
                    <Trophy className="w-4 h-4 mr-2 text-yellow-500" />
                    {t('trainer.leaderboard')}
                  </Link>
                </Button>
              </div>
            </GlassCard>
          </div>

          {scenariosError && (
            <div className="mb-6">
              <GlassCard className="p-6 border-red-500/30 bg-black/80">
                <p className="text-sm text-red-400 font-medium mb-1 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
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
              <GlassCard className="p-6 text-center bg-black/80">
                <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-1">
                  {t('trainer.noScenariosTitle')}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t('trainer.noScenariosSubtitle')}
                </p>
              </GlassCard>
            </div>
          )}

          {lastSessionSummary && (
            <div className="mb-8">
              <GlassCard className="p-6 md:p-8 border border-border/80 bg-black/85 relative overflow-hidden">
                <div className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent opacity-70" />
                <div className="pointer-events-none absolute -right-24 bottom-0 w-64 h-64 rounded-full bg-orange-500/10 blur-3xl" />
                
                <div className="relative z-10">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                      <h2 className="text-xl font-bold flex items-center gap-2 mb-1">
                        <Trophy className="w-5 h-5 text-orange-400" />
                        {t('trainer.lastSessionTitle')}: {CATEGORY_INFO[lastSessionSummary.category]?.name || lastSessionSummary.category}
                      </h2>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Check className="w-3 h-3 text-green-500" />
                          {lastSessionSummary.stats.correctCount}/{lastSessionSummary.stats.totalCount} {t('test.correctLabel')}
                        </span>
                        <span>•</span>
                        <span>{lastSessionSummary.stats.accuracy}% {t('test.accuracy')}</span>
                        <span>•</span>
                        <span className="text-orange-300">+{lastSessionSummary.stats.totalXpEarned} XP</span>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                      {t('test.timeLeft')}: {lastSessionSummary.stats.avgTimeSeconds}s · {t('dashboard.trainerBestStreak')}: {lastSessionSummary.stats.maxStreak}
                    </div>
                  </div>

                  {lastSessionSummary.mistakes.length > 0 ? (
                    <div className="space-y-3 bg-white/5 rounded-xl p-4 border border-white/10">
                      <p className="text-sm font-medium flex items-center gap-2 text-orange-200">
                        <Lightbulb className="w-4 h-4" />
                        {t('trainer.questionsToReview')}
                      </p>
                      {lastSessionSummary.mistakes.map((m) => (
                        <div key={m.scenarioId} className="text-sm flex flex-col md:flex-row md:items-center justify-between gap-3 border-t border-white/5 pt-3 mt-2 first:mt-0 first:border-0 first:pt-0">
                          <span className="text-muted-foreground line-clamp-2 flex-1">
                            {m.question || t('test.question')}
                          </span>
                          {m.chapterId && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-shrink-0 h-8 text-xs border-white/10 hover:bg-white/5"
                              onClick={() => router.push(`/materials?chapter=${m.chapterId}`)}
                            >
                              {t('trainer.reviewChapterCta')} {m.chapterId}
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 flex items-center gap-3 text-green-400">
                      <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                        <Check className="w-5 h-5" />
                      </div>
                      <p className="text-sm font-medium">{t('trainer.perfectSession')}</p>
                    </div>
                  )}

                  {/* Smart recommended next steps based on session accuracy */}
                  <div className="mt-6 pt-6 border-t border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold mb-1 text-foreground/90">{t('trainer.nextStepsTitle')}</p>
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
                        className="bg-orange-500 hover:bg-orange-600 text-black border-none font-medium"
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
                          className="border-white/10 hover:bg-white/5"
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
                        className="border-white/10 hover:bg-white/5"
                      >
                        <Link href={`/category/${lastSessionSummary.category.toLowerCase()}`}>
                          {t('trainer.goToTestsCta')}
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </div>
          )}

          {trainerStats && (
            <div className="mb-8">
              <GlassCard className="p-6 md:p-8 border border-border/80 bg-black/80">
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
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                          <Trophy className="w-5 h-5 text-orange-400" />
                          {t('dashboard.trainerAchievementsLabel')}
                        </h2>
                        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-muted-foreground">
                          {unlockedCount}/{achievements.length} {t('trainer.achievementsUnlockedLabel')}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {achievements.map((ach) => (
                          <div
                            key={ach.id}
                            className={`border rounded-xl p-4 transition-all duration-300 ${
                              ach.unlocked
                                ? 'border-orange-500/30 bg-orange-500/5 shadow-[0_0_15px_rgba(249,115,22,0.05)]'
                                : 'border-white/5 bg-black/40 opacity-60 grayscale'
                            }`}
                          >
                            <div className="font-semibold flex items-center gap-2 mb-2 text-sm">
                              {ach.unlocked ? (
                                <div className="w-5 h-5 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                                  <Check className="w-3 h-3 text-orange-400" />
                                </div>
                              ) : (
                                <div className="w-5 h-5 rounded-full bg-white/10 flex-shrink-0" />
                              )}
                              <span className={ach.unlocked ? 'text-orange-100' : 'text-muted-foreground'}>
                                {ach.label}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground pl-7 leading-relaxed">{ach.description}</p>
                          </div>
                        ))}
                      </div>
                    </>
                  );
                })()}
              </GlassCard>
            </div>
          )}
          
          <GlassCard className="p-6 border border-border/80 bg-black/80 mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                  <Zap className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <span className="text-sm font-semibold block text-foreground/90">
                    {t('trainer.practiceModes')}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {t('category.selectTestDesc')}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 w-full md:w-auto">
                <Button
                  size="sm"
                  variant={mode === 'full' ? 'default' : 'outline'}
                  onClick={() => setMode('full')}
                  className={mode === 'full' ? 'bg-orange-500 text-black hover:bg-orange-600' : 'border-white/10 hover:bg-white/5'}
                >
                  {t('trainer.fullCategory')}
                </Button>
                <Button
                  size="sm"
                  variant={mode === 'quick5' ? 'default' : 'outline'}
                  onClick={() => setMode('quick5')}
                  className={mode === 'quick5' ? 'bg-orange-500 text-black hover:bg-orange-600' : 'border-white/10 hover:bg-white/5'}
                >
                  {t('trainer.quick5')}
                </Button>
                <Button
                  size="sm"
                  variant={mode === 'quick10' ? 'default' : 'outline'}
                  onClick={() => setMode('quick10')}
                  className={mode === 'quick10' ? 'bg-orange-500 text-black hover:bg-orange-600' : 'border-white/10 hover:bg-white/5'}
                >
                  {t('trainer.quick10')}
                </Button>
                {(categoryProgressData || []).some((p) => p.total_attempts > 0) && (
                  <Button
                    size="sm"
                    variant={mode === 'weak' ? 'default' : 'outline'}
                    onClick={handleStartWeakPoints}
                    className={mode === 'weak' ? 'bg-orange-500 text-black hover:bg-orange-600' : 'border-white/10 hover:bg-white/5'}
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
                let statusClass = 'bg-white/5 text-muted-foreground border border-white/10';
                
                if (totalAttempts > 0 && accuracy !== null) {
                  if (accuracy >= 80) {
                    statusLabel = t('trainer.statusStrong');
                    statusClass = 'bg-green-500/10 text-green-400 border border-green-500/20';
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
                    className="group relative overflow-hidden p-6 md:p-7 border border-border/80 bg-black/80 hover:border-primary/60 hover:shadow-[0_22px_60px_rgba(0,0,0,0.9)] transition-all cursor-pointer"
                    onClick={() => startCategory(key as Category)}
                  >
                    {/* Hover effects */}
                    <div className="pointer-events-none absolute -right-10 top-8 h-40 w-40 rounded-full border border-dashed border-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="pointer-events-none absolute -bottom-8 left-6 h-24 w-24 rounded-full bg-primary/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="relative z-10 flex items-start gap-4">
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
