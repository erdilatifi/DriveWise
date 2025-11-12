'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Check, X, Lightbulb, Trophy, Zap } from 'lucide-react';
import Link from 'next/link';
import { CATEGORY_INFO, type Category } from '@/data/scenarios';
import { useScenarios } from '@/hooks/use-scenarios';
import { toast } from 'sonner';
// import Confetti from 'react-canvas-confetti';

export default function DecisionTrainerPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [stats, setStats] = useState({ correct: 0, total: 0, streak: 0, xp: 0 });
  const [timeLeft, setTimeLeft] = useState(30); // 30 seconds per scenario
  const [totalTime, setTotalTime] = useState(0);
  const [categoryStartTime, setCategoryStartTime] = useState<number>(0);
  // const [confettiInstance, setConfettiInstance] = useState<any>(null);

  // Fetch scenarios from database
  const { data: scenarios = [], isLoading: scenariosLoading } = useScenarios(selectedCategory || undefined);

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
          if (selectedOption === null) {
            toast.error('Time\'s up!');
            handleNext();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [selectedCategory, showResult, selectedOption]);

  const categoryScenarios = scenarios;
  const currentScenario = categoryScenarios[currentScenarioIndex];

  const handleSelectOption = (index: number) => {
    if (showResult) return;
    setSelectedOption(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || !currentScenario) return;

    const isCorrect = currentScenario.options[selectedOption].isCorrect;
    const selectedOptionData = currentScenario.options[selectedOption];
    
    setShowResult(true);
    setStats(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
      streak: isCorrect ? prev.streak + 1 : 0,
      xp: prev.xp + (isCorrect ? currentScenario.xp : 0),
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

  const handleNext = () => {
    if (currentScenarioIndex < categoryScenarios.length - 1) {
      setCurrentScenarioIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowResult(false);
      setTimeLeft(30); // Reset timer for next scenario
    } else {
      const completionTime = Math.floor((Date.now() - categoryStartTime) / 1000);
      setTotalTime(completionTime);
      toast.success(`Category complete! Total XP: ${stats.xp} | Time: ${formatTime(completionTime)}`);
      setSelectedCategory(null);
      setCurrentScenarioIndex(0);
      setSelectedOption(null);
      setShowResult(false);
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
    setSelectedOption(null);
    setShowResult(false);
    setStats({ correct: 0, total: 0, streak: 0, xp: 0 });
    setTimeLeft(30);
    setTotalTime(0);
    setCategoryStartTime(Date.now());
  };

  if (authLoading || (selectedCategory && scenariosLoading)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  if (!selectedCategory) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8 max-w-7xl pt-28">
          <div className="mb-8">
            <Button variant="ghost" asChild className="mb-4">
              <Link href="/dashboard">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2">📚 Decision Trainer</h1>
                <p className="text-muted-foreground">Master driving rules through interactive scenarios</p>
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
              const categoryCount = 5; // Default count, will be updated when scenarios load
              return (
                <GlassCard key={key} className="p-6 hover:border-primary/50 transition-all cursor-pointer" onClick={() => startCategory(key as Category)}>
                  <div className="flex items-start gap-4">
                    <div className="text-5xl">{info.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2">{info.name}</h3>
                      <p className="text-sm text-muted-foreground">{info.description}</p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{categoryCount} scenarios</span>
                        <Button size="sm">Start →</Button>
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
            Back to Categories
          </Button>
          
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <span className="text-4xl">{categoryInfo.icon}</span>
                {categoryInfo.name}
              </h1>
              <p className="text-muted-foreground">Scenario {currentScenarioIndex + 1} of {categoryScenarios.length}</p>
            </div>
            <div className="flex gap-4">
              <div className="text-center">
                <div className={`text-3xl font-bold ${timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-blue-500'}`}>
                  ⏱️ {timeLeft}s
                </div>
                <div className="text-xs text-muted-foreground">Time Left</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{stats.xp}</div>
                <div className="text-xs text-muted-foreground">XP</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">{stats.streak}</div>
                <div className="text-xs text-muted-foreground">Streak</div>
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
                const isSelected = selectedOption === index;
                const isCorrect = option.isCorrect;
                const showCorrect = showResult && isCorrect;
                const showWrong = showResult && isSelected && !isCorrect;

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
                        : isSelected
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                    whileHover={{ scale: showResult ? 1 : 1.02 }}
                    whileTap={{ scale: showResult ? 1 : 0.98 }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{option.text}</span>
                      {showCorrect && <Check className="w-5 h-5 text-green-500" />}
                      {showWrong && <X className="w-5 h-5 text-red-500" />}
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
                    currentScenario.options[selectedOption!].isCorrect
                      ? 'border-green-500 bg-green-500/10'
                      : 'border-red-500 bg-red-500/10'
                  }`}>
                    <div className="flex items-start gap-3">
                      <Lightbulb className="w-5 h-5 mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <h3 className="font-bold mb-2">
                          {currentScenario.options[selectedOption!].isCorrect ? '✓ Correct!' : '✗ Incorrect - Learn from this!'}
                        </h3>
                        
                        {!currentScenario.options[selectedOption!].isCorrect && (
                          <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-lg mb-3">
                            <p className="text-sm font-semibold mb-1">Why this is wrong:</p>
                            <p className="text-sm">
                              {currentScenario.options[selectedOption!].explanation || 
                               'This option doesn\'t follow safe driving practices.'}
                            </p>
                          </div>
                        )}
                        
                        <div className="bg-green-500/10 border border-green-500/30 p-3 rounded-lg mb-3">
                          <p className="text-sm font-semibold mb-1">Correct answer:</p>
                          <p className="text-sm">{currentScenario.correct_explanation}</p>
                        </div>
                        
                        <div className="bg-background/50 p-3 rounded-lg">
                          <p className="text-sm"><strong>💡 Real-world tip:</strong> {currentScenario.real_world_tip}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button onClick={handleNext} className="w-full" size="lg">
                    {currentScenarioIndex < categoryScenarios.length - 1 ? 'Next Scenario →' : 'Complete Category 🎉'}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

            {!showResult && (
              <Button
                onClick={handleSubmitAnswer}
                disabled={selectedOption === null}
                className="w-full"
                size="lg"
              >
                Submit Answer
              </Button>
            )}
          </GlassCard>
        )}

        <div className="mt-8">
          <GlassCard className="p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" />
              Session Stats
            </h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">{stats.correct}/{stats.total}</div>
                <div className="text-xs text-muted-foreground">Correct</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">{stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0}%</div>
                <div className="text-xs text-muted-foreground">Accuracy</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-500">{stats.streak}</div>
                <div className="text-xs text-muted-foreground">Best Streak</div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
