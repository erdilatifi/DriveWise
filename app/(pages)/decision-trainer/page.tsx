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
import { useCompleteCategory } from '@/hooks/use-decision-trainer';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/language-context';
// import Confetti from 'react-canvas-confetti';

export default function DecisionTrainerPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { t } = useLanguage();
  
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
            toast.error('Time\'s up!');
            handleNext();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [selectedCategory, showResult, selectedOptions]);

  const categoryScenarios = scenarios;
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
      .map((option, index) => option.isCorrect ? index : -1)
      .filter(index => index !== -1);
    
    const isCorrect = selectedOptions.length === correctOptionIndices.length &&
      selectedOptions.every(index => correctOptionIndices.includes(index)) &&
      correctOptionIndices.every(index => selectedOptions.includes(index));
    
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
      toast.success(`Correct! +${currentScenario.xp} XP`);
      if (stats.streak > 0 && stats.streak % 5 === 0) {
        // Trigger confetti on streak milestones
      }
    } else {
      toast.error('Incorrect. Read the explanation to learn!');
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
        } catch (error) {
          console.error('Error saving results:', error);
          toast.error('Results saved locally but failed to sync to leaderboard');
        }
      }
      
      // Reset for next session
      setSelectedCategory(null);
      setCurrentScenarioIndex(0);
      setSelectedOptions([]);
      setShowResult(false);
      setSessionAttempts([]);
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
                <h1 className="text-4xl font-bold mb-2">📚 Decision Trainer</h1>
                <p className="text-muted-foreground">{t('dashboard.keepGoing')}</p>
              </div>
              <Button asChild variant="outline">
                <Link href="/decision-trainer/leaderboard">
                  <Trophy className="w-4 h-4 mr-2" />
                  Leaderboard
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(CATEGORY_INFO).map(([key, info]) => {
              const categoryCount = scenarios.filter((scenario) => scenario.category === key).length;
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
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm mt-2">
                        <span className="text-muted-foreground">{categoryCount} scenarios</span>
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {/* <Confetti refConfetti={setConfettiInstance} /> */}
      
      <div className="container mx-auto px-4 py-8 max-w-4xl pt-28">
        <div className="mb-8">
          <Button variant="ghost" onClick={() => setSelectedCategory(null)} className="mb-4">
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
              {currentScenario.options.map((option, index) => {
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
                        
                        {!sessionAttempts[sessionAttempts.length - 1]?.isCorrect && (
                          <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-lg mb-3">
                            <p className="text-sm font-semibold mb-1">{t('test.correctLabel')}</p>
                            <div className="space-y-1">
                              {selectedOptions.map(optionIndex => (
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
