'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Navbar } from '@/components/navbar';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { motion } from 'framer-motion';
import { useQuestion, useUpdateQuestion, QuestionInput } from '@/hooks/use-questions';
import { toast } from 'sonner';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

interface EditQuestionPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditQuestionPage({ params }: EditQuestionPageProps) {
  const { id } = use(params);
  const { user, isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();
  const { data: question, isLoading: questionLoading } = useQuestion(id);
  const updateQuestion = useUpdateQuestion();

  const [formData, setFormData] = useState<QuestionInput>({
    category: 'B',
    test_number: 1,
    question_text: '',
    option_a: '',
    option_b: '',
    option_c: '',
    correct_answer: 'A',
    image_url: '',
    is_published: true,
  });
  const [hasOptionC, setHasOptionC] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      router.push('/');
    }
  }, [user, isAdmin, authLoading, router]);

  useEffect(() => {
    if (question) {
      setHasOptionC(!!question.option_c);
      setFormData({
        category: question.category,
        test_number: question.test_number,
        question_text: question.question_text,
        option_a: question.option_a,
        option_b: question.option_b,
        option_c: question.option_c,
        correct_answer: question.correct_answer,
        image_url: question.image_url || '',
        is_published: question.is_published,
      });
    }
  }, [question]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clean up data before validation/submission
    const finalOptionC = hasOptionC ? formData.option_c : undefined;
    
    // Ensure correct answer isn't C if C is disabled
    let finalCorrectAnswer = formData.correct_answer;
    if (!hasOptionC && finalCorrectAnswer === 'C') {
      finalCorrectAnswer = 'A'; // Default back to A
    }

    // Comprehensive validation
    const errors: string[] = [];
    
    if (!formData.question_text) {
      errors.push('Question text is required');
    }
    if (!formData.option_a) {
      errors.push('Option A is required');
    }
    if (!formData.option_b) {
      errors.push('Option B is required');
    }
    if (hasOptionC && !formData.option_c) {
      errors.push('Option C is required');
    }
    if (!formData.correct_answer) {
      errors.push('Please select the correct answer');
    }
    if (!['A', 'B', 'C'].includes(formData.correct_answer)) {
      errors.push('Correct answer must be A, B, or C');
    }
    if (!formData.category) {
      errors.push('Category is required');
    }
    if (!formData.test_number || formData.test_number < 1 || formData.test_number > 10) {
      errors.push('Test number must be between 1 and 10');
    }

    if (errors.length > 0) {
      toast.error(errors[0]);
      console.error('Validation errors:', errors);
      return;
    }

    // Log what we're updating
    console.log('Updating question:', {
      id,
      category: formData.category,
      test_number: formData.test_number,
      correct_answer: finalCorrectAnswer,
      has_option_c: hasOptionC,
    });

    try {
      const result = await updateQuestion.mutateAsync({
        id,
        category: formData.category,
        test_number: formData.test_number,
        question_text: formData.question_text,
        option_a: formData.option_a,
        option_b: formData.option_b,
        option_c: finalOptionC,
        correct_answer: finalCorrectAnswer,
        image_url: formData.image_url,
        is_published: formData.is_published,
      });
      console.log('Question updated successfully:', result);
      toast.success('Question updated successfully!');
      
      // Small delay to show success message
      setTimeout(() => {
        router.push('/admin/questions');
      }, 500);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error(`Failed to update question: ${message}`);
      console.error('Error updating question:', error, { formData });
    }
  };

  if (authLoading || questionLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin || !question) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-6 py-8 max-w-4xl pt-28"
      >
        {/* Header ... */}
        
        {/* Form */}
        <form onSubmit={handleSubmit}>
          <GlassCard className="p-6 space-y-6 border border-border/80 bg-black/80">
            {/* ... (Category, Test Number, Question Text) ... */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* ... */}
            </div>

            {/* Question Text */}
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="question_text">Question Text *</Label>
                <Textarea
                  id="question_text"
                  rows={4}
                  value={formData.question_text}
                  onChange={(e) => setFormData({ ...formData, question_text: e.target.value })}
                  placeholder="Enter the question text..."
                />
              </div>
            </div>

            {/* Options */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Answer Options *</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setHasOptionC(!hasOptionC)}
                >
                  {hasOptionC ? 'Remove Option C' : 'Add Option C'}
                </Button>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="option_a" className="text-sm text-muted-foreground">Option A</Label>
                <Input
                  id="option_a"
                  value={formData.option_a}
                  onChange={(e) => setFormData({ ...formData, option_a: e.target.value })}
                  placeholder="Enter option A..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="option_b" className="text-sm text-muted-foreground">Option B</Label>
                <Input
                  id="option_b"
                  value={formData.option_b}
                  onChange={(e) => setFormData({ ...formData, option_b: e.target.value })}
                  placeholder="Enter option B..."
                />
              </div>

              {hasOptionC && (
                <div className="space-y-2">
                  <Label htmlFor="option_c" className="text-sm text-muted-foreground">Option C</Label>
                  <Input
                    id="option_c"
                    value={formData.option_c || ''}
                    onChange={(e) => setFormData({ ...formData, option_c: e.target.value })}
                    placeholder="Enter option C..."
                  />
                </div>
              )}
            </div>

            {/* Correct Answer */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Correct Answer *</Label>
              <p className="text-sm text-muted-foreground">Select which option is the correct answer</p>
              <RadioGroup
                value={formData.correct_answer}
                onValueChange={(value) => {
                  console.log('Selected correct answer:', value);
                  setFormData({ ...formData, correct_answer: value as 'A' | 'B' | 'C' });
                }}
                className="flex flex-col gap-3"
              >
                <div className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:border-primary/50 transition-colors">
                  <RadioGroupItem value="A" id="correct_a" />
                  <Label htmlFor="correct_a" className="cursor-pointer flex-1 font-medium">
                    Option A {formData.correct_answer === 'A' && <span className="text-primary ml-2">✓ Selected</span>}
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:border-primary/50 transition-colors">
                  <RadioGroupItem value="B" id="correct_b" />
                  <Label htmlFor="correct_b" className="cursor-pointer flex-1 font-medium">
                    Option B {formData.correct_answer === 'B' && <span className="text-primary ml-2">✓ Selected</span>}
                  </Label>
                </div>
                
                {hasOptionC && (
                  <div className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:border-primary/50 transition-colors">
                    <RadioGroupItem value="C" id="correct_c" />
                    <Label htmlFor="correct_c" className="cursor-pointer flex-1 font-medium">
                      Option C {formData.correct_answer === 'C' && <span className="text-primary ml-2">✓ Selected</span>}
                    </Label>
                  </div>
                )}
              </RadioGroup>
              <p className="text-xs text-muted-foreground">
                Currently selected: <span className="font-semibold text-primary">Option {formData.correct_answer}</span>
              </p>
            </div>

            {/* ... (rest of form) ... */}
          </GlassCard>
        </form>
      </motion.div>
    </div>
  );
}
