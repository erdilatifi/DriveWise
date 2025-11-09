'use client';

import { useEffect, useState } from 'react';
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
import { useCreateQuestion, QuestionInput } from '@/hooks/use-questions';
import { toast } from 'sonner';
import { ArrowLeft, Save, FileJson } from 'lucide-react';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { createClient } from '@/utils/supabase/client';

export default function NewQuestionPage() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();
  const supabase = createClient();
  const createQuestion = useCreateQuestion();
  const [jsonImportOpen, setJsonImportOpen] = useState(false);
  const [jsonInput, setJsonInput] = useState('');
  const [importing, setImporting] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.question_text || !formData.option_a || !formData.option_b || !formData.option_c) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await createQuestion.mutateAsync(formData);
      toast.success('Question created successfully');
      router.push('/admin/questions');
    } catch (error) {
      toast.error('Failed to create question');
      console.error(error);
    }
  };

  const handleJsonImport = async () => {
    if (!jsonInput.trim()) {
      toast.error('Please enter JSON data');
      return;
    }

    setImporting(true);
    try {
      const questions = JSON.parse(jsonInput);
      
      if (!Array.isArray(questions)) {
        toast.error('JSON must be an array of questions');
        return;
      }

      // Validate and insert questions
      const validQuestions = questions.map((q: any) => {
        if (!q.category || !q.test_number || !q.question_text || !q.option_a || !q.option_b || !q.option_c || !q.correct_answer) {
          throw new Error('Each question must have: category, test_number, question_text, option_a, option_b, option_c, correct_answer');
        }
        return {
          category: q.category.toUpperCase(),
          test_number: parseInt(q.test_number),
          question_text: q.question_text,
          option_a: q.option_a,
          option_b: q.option_b,
          option_c: q.option_c,
          correct_answer: q.correct_answer.toUpperCase(),
          image_url: q.image_url || null,
        };
      });

      const { error } = await supabase
        .from('admin_questions')
        .insert(validQuestions);

      if (error) {
        console.error('Error importing questions:', error);
        toast.error(`Failed to import questions: ${error.message}`);
        return;
      }

      toast.success(`Successfully imported ${validQuestions.length} questions`);
      setJsonInput('');
      setJsonImportOpen(false);
      router.push('/admin/questions');
    } catch (error: any) {
      toast.error(error.message || 'Invalid JSON format');
      console.error(error);
    } finally {
      setImporting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-6 py-8 max-w-4xl"
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Add New Question</h1>
              <p className="text-sm text-muted-foreground">Create a new quiz question or import multiple via JSON</p>
            </div>
            <Dialog open={jsonImportOpen} onOpenChange={setJsonImportOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="shadow-lg shadow-primary/20">
                  <FileJson className="w-4 h-4 mr-2" />
                  Import JSON
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Import Questions from JSON</DialogTitle>
                  <DialogDescription>
                    Paste JSON array of questions. Image URL is optional.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Example format:</p>
                    <pre className="bg-muted p-3 rounded-lg text-xs overflow-x-auto">
{`[
  {
    "category": "B",
    "test_number": 1,
    "question_text": "What does a red light mean?",
    "option_a": "Stop",
    "option_b": "Go",
    "option_c": "Slow down",
    "correct_answer": "A",
    "image_url": "https://example.com/image.jpg"
  },
  {
    "category": "B",
    "test_number": 1,
    "question_text": "What is the speed limit?",
    "option_a": "30 km/h",
    "option_b": "50 km/h",
    "option_c": "70 km/h",
    "correct_answer": "B"
  }
]`}
                    </pre>
                  </div>
                  <Textarea
                    placeholder="Paste your JSON here..."
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                    className="min-h-[300px] font-mono text-sm"
                  />
                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="outline"
                      onClick={() => setJsonImportOpen(false)}
                      disabled={importing}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleJsonImport}
                      disabled={importing}
                    >
                      {importing ? 'Importing...' : 'Import Questions'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
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
                    <SelectItem value="C1">Category C1</SelectItem>
                    <SelectItem value="CE">Category CE</SelectItem>
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
            <div className="space-y-2">
              <Label>Correct Answer *</Label>
              <RadioGroup
                value={formData.correct_answer}
                onValueChange={(value) => setFormData({ ...formData, correct_answer: value as 'A' | 'B' | 'C' })}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="A" id="correct_a" />
                  <Label htmlFor="correct_a" className="cursor-pointer">Option A</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="B" id="correct_b" />
                  <Label htmlFor="correct_b" className="cursor-pointer">Option B</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="C" id="correct_c" />
                  <Label htmlFor="correct_c" className="cursor-pointer">Option C</Label>
                </div>
              </RadioGroup>
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
                disabled={createQuestion.isPending}
                className="flex-1 shadow-lg shadow-primary/20"
              >
                {createQuestion.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Create Question
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/admin/questions')}
                disabled={createQuestion.isPending}
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
