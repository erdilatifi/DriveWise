'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CATEGORY_INFO, type LicenseCategory } from '@/types/database';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

// Mock question data - will be replaced with real API calls
const mockQuestions = [
  {
    id: '1',
    question: 'What does a red octagonal sign mean?',
    options: [
      { id: 'a', text: 'Yield' },
      { id: 'b', text: 'Stop' },
      { id: 'c', text: 'No Entry' },
      { id: 'd', text: 'Speed Limit' },
    ],
    correctAnswer: 'b',
  },
  {
    id: '2',
    question: 'What is the maximum speed limit in urban areas?',
    options: [
      { id: 'a', text: '40 km/h' },
      { id: 'b', text: '50 km/h' },
      { id: 'c', text: '60 km/h' },
      { id: 'd', text: '70 km/h' },
    ],
    correctAnswer: 'b',
  },
  {
    id: '3',
    question: 'When must you use your headlights?',
    options: [
      { id: 'a', text: 'Only at night' },
      { id: 'b', text: 'During rain and fog' },
      { id: 'c', text: 'At night and in poor visibility' },
      { id: 'd', text: 'Never during the day' },
    ],
    correctAnswer: 'c',
  },
  {
    id: '4',
    question: 'What should you do at a yellow traffic light?',
    options: [
      { id: 'a', text: 'Speed up to pass' },
      { id: 'b', text: 'Stop if safe to do so' },
      { id: 'c', text: 'Continue without slowing' },
      { id: 'd', text: 'Honk your horn' },
    ],
    correctAnswer: 'b',
  },
  {
    id: '5',
    question: 'What is the minimum following distance in good conditions?',
    options: [
      { id: 'a', text: '1 second' },
      { id: 'b', text: '2 seconds' },
      { id: 'c', text: '3 seconds' },
      { id: 'd', text: '5 seconds' },
    ],
    correctAnswer: 'c',
  },
  {
    id: '6',
    question: 'When are you allowed to use your horn in urban areas?',
    options: [
      { id: 'a', text: 'Anytime' },
      { id: 'b', text: 'Only in emergencies' },
      { id: 'c', text: 'To greet friends' },
      { id: 'd', text: 'When angry at other drivers' },
    ],
    correctAnswer: 'b',
  },
  {
    id: '7',
    question: 'What does a triangular sign with a red border indicate?',
    options: [
      { id: 'a', text: 'Information' },
      { id: 'b', text: 'Warning' },
      { id: 'c', text: 'Prohibition' },
      { id: 'd', text: 'Mandatory action' },
    ],
    correctAnswer: 'b',
  },
  {
    id: '8',
    question: 'When must you wear a seatbelt?',
    options: [
      { id: 'a', text: 'Only on highways' },
      { id: 'b', text: 'Only in the front seat' },
      { id: 'c', text: 'At all times while driving' },
      { id: 'd', text: 'Only during long trips' },
    ],
    correctAnswer: 'c',
  },
  {
    id: '9',
    question: 'What is the legal blood alcohol limit for drivers?',
    options: [
      { id: 'a', text: '0.0%' },
      { id: 'b', text: '0.3%' },
      { id: 'c', text: '0.5%' },
      { id: 'd', text: '0.8%' },
    ],
    correctAnswer: 'a',
  },
  {
    id: '10',
    question: 'Who has priority at an unmarked intersection?',
    options: [
      { id: 'a', text: 'The larger vehicle' },
      { id: 'b', text: 'The vehicle from the right' },
      { id: 'c', text: 'The vehicle from the left' },
      { id: 'd', text: 'The faster vehicle' },
    ],
    correctAnswer: 'b',
  },
];

export default function TestPage() {
  const params = useParams();
  const router = useRouter();
  const category = (params.category as string).toUpperCase() as LicenseCategory;
  const testNumber = params.testNumber as string;

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);

  const categoryInfo = CATEGORY_INFO[category];
  const totalQuestions = mockQuestions.length;
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  const handleAnswer = (value: string) => {
    setAnswers({ ...answers, [mockQuestions[currentQuestion].id]: value });
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

  const handleSubmit = () => {
    setShowResults(true);
  };

  const calculateScore = () => {
    let correct = 0;
    mockQuestions.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) {
        correct++;
      }
    });
    return {
      correct,
      total: totalQuestions,
      percentage: Math.round((correct / totalQuestions) * 100),
    };
  };

  if (showResults) {
    const score = calculateScore();
    const passed = score.percentage >= 80;

    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border/40 bg-card/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <Button variant="ghost" asChild>
              <Link href={`/category/${category.toLowerCase()}`}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Tests
              </Link>
            </Button>
          </div>
        </header>

        <div className="container mx-auto px-4 py-16">
          <Card className="max-w-2xl mx-auto border-primary/20 bg-card/95 backdrop-blur-xl shadow-2xl shadow-primary/10">
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
                  {passed ? 'Congratulations!' : 'Keep Practicing!'}
                </CardTitle>
                <p className="text-muted-foreground text-lg">
                  {categoryInfo.name} - Test {testNumber}
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="text-center">
                <div className={`text-7xl font-bold mb-3 ${
                  passed ? 'text-primary' : 'text-destructive'
                }`}>{score.percentage}%</div>
                <p className="text-muted-foreground text-lg">
                  {score.correct} out of {score.total} correct answers
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm font-medium">
                  <span>Passing Score: 80%</span>
                  <span className={passed ? 'text-primary' : 'text-destructive'}>
                    {passed ? '✓ Passed' : '✗ Failed'}
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

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" asChild>
                  <Link href={`/category/${category.toLowerCase()}`}>
                    Back to Tests
                  </Link>
                </Button>
                <Button 
                  className="flex-1"
                  onClick={() => {
                    setCurrentQuestion(0);
                    setAnswers({});
                    setShowResults(false);
                  }}
                >
                  Retry Test
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const question = mockQuestions[currentQuestion];
  const currentAnswer = answers[question.id];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <Button variant="ghost" asChild size="sm">
              <Link href={`/category/${category.toLowerCase()}`}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Exit Test
              </Link>
            </Button>
            <div className="text-sm font-semibold px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary">
              Question {currentQuestion + 1} of {totalQuestions}
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
        <Card className="max-w-3xl mx-auto border-primary/20 bg-card/95 backdrop-blur-xl shadow-xl shadow-primary/5">
          <CardHeader>
            <div className="text-sm text-primary font-medium mb-3">
              {categoryInfo.name} - Test {testNumber}
            </div>
            <CardTitle className="text-2xl md:text-3xl">{question.question}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <RadioGroup value={currentAnswer} onValueChange={handleAnswer}>
              {question.options.map((option) => (
                <RadioGroupItem key={option.id} value={option.id}>
                  <span className="font-medium mr-2">{option.id.toUpperCase()}.</span>
                  {option.text}
                </RadioGroupItem>
              ))}
            </RadioGroup>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                className="flex-1"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              {currentQuestion === totalQuestions - 1 ? (
                <Button
                  onClick={handleSubmit}
                  disabled={Object.keys(answers).length !== totalQuestions}
                  className="flex-1"
                >
                  Submit Test
                  <CheckCircle className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  disabled={!currentAnswer}
                  className="flex-1"
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>

            {/* Question Navigator */}
            <div className="border-t pt-4">
              <p className="text-sm text-muted-foreground mb-3">Quick Navigation</p>
              <div className="grid grid-cols-10 gap-2">
                {mockQuestions.map((q, idx) => (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestion(idx)}
                    className={`aspect-square rounded-md text-sm font-medium transition-colors ${
                      idx === currentQuestion
                        ? 'bg-primary text-primary-foreground'
                        : answers[q.id]
                        ? 'bg-primary/20 text-primary'
                        : 'bg-secondary hover:bg-secondary/80'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
