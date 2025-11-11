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
  });

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      router.push('/');
    }
  }, [user, isAdmin, authLoading, router]);

  useEffect(() => {
    if (question) {
      setFormData({
        category: question.category,
        test_number: question.test_number,
        question_text: question.question_text,
        option_a: question.option_a,
        option_b: question.option_b,
        option_c: question.option_c,
        correct_answer: question.correct_answer,
        image_url: question.image_url || '',
      });
    }
  }, [question]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Comprehensive validation
    const errors: string[] = [];
    
    if (!formData.question_text?.trim()) {
      errors.push('Question text is required');
    }
    if (!formData.option_a?.trim()) {
      errors.push('Option A is required');
    }
    if (!formData.option_b?.trim()) {
      errors.push('Option B is required');
    }
    if (!formData.option_c?.trim()) {
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
      correct_answer: formData.correct_answer,
    });

    try {
      const result = await updateQuestion.mutateAsync({ id, ...formData });
      console.log('Question updated successfully:', result);
      toast.success('Question updated successfully!');
      
      // Small delay to show success message
      setTimeout(() => {
        router.push('/admin/questions');
      }, 500);
    } catch (error: any) {
      const errorMessage = error?.message || 'Unknown error occurred';
      toast.error(`Failed to update question: ${errorMessage}`);
      console.error('Error updating question:', {
        message: error?.message,
        code: error?.code,
        details: error?.details,
        hint: error?.hint,
        formData: formData,
        fullError: error,
      });
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
    <div className="min-h-screen bg-background">
      <Navbar />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-6 py-8 max-w-4xl pt-28"
      >
        {/* Header */}
        <div className="mb-8">
          <div className="flex gap-2 mb-4">
            <Button variant="ghost" asChild>
              <Link href="/admin">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Admin Dashboard
              </Link>
            </Button>
            <span className="text-muted-foreground">/</span>
            <Button variant="ghost" asChild>
              <Link href="/admin/questions">
                Questions
              </Link>
            </Button>
          </div>
          <h1 className="text-3xl font-bold">Edit Question</h1>
          <p className="text-sm text-muted-foreground">Update question details</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <GlassCard className="p-6 space-y-6">
            {/* Category and Test Number */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger id="category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A">Category A</SelectItem>
                    <SelectItem value="B">Category B</SelectItem>
                    <SelectItem value="C">Category C</SelectItem>
                    <SelectItem value="D">Category D</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="test_number">Test Number *</Label>
                <Input
                  id="test_number"
                  type="number"
                  min="1"
                  max="10"
                  value={formData.test_number}
                  onChange={(e) => setFormData({ ...formData, test_number: parseInt(e.target.value) })}
                  required
                />
              </div>
            </div>

            {/* Question Text */}
            <div className="space-y-2">
              <Label htmlFor="question_text">Question Text *</Label>
              <Textarea
                id="question_text"
                rows={4}
                value={formData.question_text}
                onChange={(e) => setFormData({ ...formData, question_text: e.target.value })}
                placeholder="Enter the question text..."
                required
              />
            </div>

            {/* Options */}
            <div className="space-y-4">
              <Label>Answer Options *</Label>
              
              <div className="space-y-2">
                <Label htmlFor="option_a" className="text-sm text-muted-foreground">Option A</Label>
                <Input
                  id="option_a"
                  value={formData.option_a}
                  onChange={(e) => setFormData({ ...formData, option_a: e.target.value })}
                  placeholder="Enter option A..."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="option_b" className="text-sm text-muted-foreground">Option B</Label>
                <Input
                  id="option_b"
                  value={formData.option_b}
                  onChange={(e) => setFormData({ ...formData, option_b: e.target.value })}
                  placeholder="Enter option B..."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="option_c" className="text-sm text-muted-foreground">Option C</Label>
                <Input
                  id="option_c"
                  value={formData.option_c}
                  onChange={(e) => setFormData({ ...formData, option_c: e.target.value })}
                  placeholder="Enter option C..."
                  required
                />
              </div>
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
                <div className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:border-primary/50 transition-colors">
                  <RadioGroupItem value="C" id="correct_c" />
                  <Label htmlFor="correct_c" className="cursor-pointer flex-1 font-medium">
                    Option C {formData.correct_answer === 'C' && <span className="text-primary ml-2">✓ Selected</span>}
                  </Label>
                </div>
              </RadioGroup>
              <p className="text-xs text-muted-foreground">
                Currently selected: <span className="font-semibold text-primary">Option {formData.correct_answer}</span>
              </p>
            </div>

            {/* Image URL (Optional) */}
            <div className="space-y-2">
              <Label htmlFor="image_url">Image URL (Optional)</Label>
              <Input
                id="image_url"
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={updateQuestion.isPending}
                className="flex-1 shadow-lg shadow-primary/20"
              >
                {updateQuestion.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Update Question
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/admin/questions')}
                disabled={updateQuestion.isPending}
              >
                Cancel
              </Button>
            </div>
          </GlassCard>
        </form>
      </motion.div>
    </div>
  );
}
