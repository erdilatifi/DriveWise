'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Navbar } from '@/components/navbar';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { Plus, Search, Edit, Trash2, Filter, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useQuestions, useDeleteQuestion } from '@/hooks/use-questions';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function QuestionsPage() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState<{ id: string; text: string } | null>(null);
  const itemsPerPage = 10;

  const { data, isLoading, error } = useQuestions({
    category: categoryFilter || undefined,
    search: searchQuery,
    status: statusFilter,
    page: currentPage,
    pageSize: itemsPerPage,
  });
  const deleteQuestion = useDeleteQuestion();

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      router.push('/');
    }
  }, [user, isAdmin, authLoading, router]);

  const openDeleteDialog = (id: string, questionText: string) => {
    setQuestionToDelete({ id, text: questionText });
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!questionToDelete) return;

    try {
      await deleteQuestion.mutateAsync(questionToDelete.id);
      toast.success('Question deleted successfully');
      setDeleteDialogOpen(false);
      setQuestionToDelete(null);
    } catch (error: any) {
      const errorMessage = error?.message || 'Unknown error occurred';
      toast.error(`Failed to delete question: ${errorMessage}`);
      console.error('Error deleting question:', {
        message: error?.message,
        code: error?.code,
        details: error?.details,
        fullError: error,
      });
    }
  };

  const totalQuestions = data?.total || 0;
  const paginatedQuestions = data?.questions || [];

  // Pagination calculations
  const totalPages = Math.ceil(totalQuestions / itemsPerPage);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, categoryFilter, statusFilter]);

  // Group questions by category
  const questionsByCategory = paginatedQuestions?.reduce((acc, question) => {
    if (!acc[question.category]) {
      acc[question.category] = [];
    }
    acc[question.category].push(question);
    return acc;
  }, {} as Record<string, typeof paginatedQuestions>);

  const categories = questionsByCategory ? Object.keys(questionsByCategory).sort() : [];

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading questions...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="container mx-auto px-6 py-8 max-w-7xl">
          <GlassCard className="p-6 border border-border/80 bg-black/80">
            <p className="text-destructive">Error loading questions: {error.message}</p>
          </GlassCard>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-6 py-8 max-w-7xl pt-28"
      >
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/admin">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Admin Dashboard
          </Link>
        </Button>

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Quiz Questions</h1>
            <p className="text-sm text-muted-foreground">
              Manage all quiz questions ({totalQuestions} total)
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button asChild variant="outline" className="shadow-sm">
              <Link href="/admin/translations">
                <Filter className="w-4 h-4 mr-2" />
                Translation mode
              </Link>
            </Button>
            <Button asChild className="shadow-lg shadow-primary/20">
              <Link href="/admin/questions/new">
                <Plus className="w-4 h-4 mr-2" />
                Add Question
              </Link>
            </Button>
          </div>
        </div>

        {/* Filters */}
        <GlassCard className="p-6 mb-6 border border-border/80 bg-black/80">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="w-full md:w-48">
              <Select value={categoryFilter || 'all'} onValueChange={(value) => setCategoryFilter(value === 'all' ? '' : value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="A">Category A</SelectItem>
                  <SelectItem value="B">Category B</SelectItem>
                  <SelectItem value="C">Category C</SelectItem>
                  <SelectItem value="D">Category D</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </GlassCard>

        {/* Questions by Category */}
        {questionsByCategory && categories.map((category) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <GlassCard className="p-6 border border-border/80 bg-black/80">
              {/* Category Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <span className="text-xl font-bold text-primary">{category}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Category {category}</h3>
                    <p className="text-sm text-muted-foreground">
                      {questionsByCategory?.[category]?.length || 0} question{questionsByCategory?.[category]?.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              </div>

              {/* Questions Grid */}
              <div className="grid grid-cols-1 gap-4">
                {questionsByCategory?.[category]?.map((question) => (
                    <div
                      key={question.id}
                      className="p-4 rounded-xl border border-border/80 bg-black/70 hover:border-primary/40 transition-colors"
                    >
                      <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="px-2 py-1 rounded-lg bg-muted text-muted-foreground text-xs font-semibold">
                              Test #{question.test_number}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${
                                question.is_published !== false
                                  ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/30'
                                  : 'bg-amber-500/10 text-amber-600 border border-amber-500/30'
                              }`}
                            >
                              {question.is_published !== false ? 'Published' : 'Draft'}
                            </span>
                          </div>
                          <p className="text-sm font-medium mb-3">{question.question_text}</p>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                            <div className={`p-2 rounded-lg ${question.correct_answer === 'A' ? 'bg-primary/10 border border-primary/20' : 'bg-muted/50'}`}>
                              <span className="font-semibold">A:</span> {question.option_a}
                            </div>
                            <div className={`p-2 rounded-lg ${question.correct_answer === 'B' ? 'bg-primary/10 border border-primary/20' : 'bg-muted/50'}`}>
                              <span className="font-semibold">B:</span> {question.option_b}
                            </div>
                            <div className={`p-2 rounded-lg ${question.correct_answer === 'C' ? 'bg-primary/10 border border-primary/20' : 'bg-muted/50'}`}>
                              <span className="font-semibold">C:</span> {question.option_c}
                            </div>
                          </div>
                        </div>
                        <div className="flex md:flex-col gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="flex-1 md:flex-none"
                          >
                            <Link href={`/admin/questions/${question.id}/edit`}>
                              <Edit className="w-4 h-4 md:mr-2" />
                              <span className="hidden md:inline">Edit</span>
                            </Link>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openDeleteDialog(question.id, question.question_text)}
                            disabled={deleteQuestion.isPending}
                            className="flex-1 md:flex-none text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4 md:mr-2" />
                            <span className="hidden md:inline">Delete</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          ))}

        {categories.length === 0 && (
          <GlassCard className="p-12 text-center border border-border/80 bg-black/80">
            <p className="text-muted-foreground">No questions found. Add your first question to get started.</p>
            <Button asChild className="mt-4">
              <Link href="/admin/questions/new">
                <Plus className="w-4 h-4 mr-2" />
                Add First Question
              </Link>
            </Button>
          </GlassCard>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex flex-col items-center gap-3">
            <p className="text-xs text-muted-foreground">
              Showing {(currentPage - 1) * itemsPerPage + 1}
              {' '}
              - {Math.min(currentPage * itemsPerPage, totalQuestions)} of {totalQuestions} questions
            </p>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  // Show first page, last page, current page, and pages around current
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => setCurrentPage(page)}
                          isActive={currentPage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  } else if (page === currentPage - 2 || page === currentPage + 2) {
                    return <PaginationEllipsis key={page} />;
                  }
                  return null;
                })}
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </motion.div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Question</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this question?
              <div className="mt-3 p-3 rounded-lg bg-muted/50 border border-border">
                <p className="text-sm font-medium text-foreground line-clamp-3">
                  {questionToDelete?.text}
                </p>
              </div>
              <p className="mt-3 text-destructive font-medium">
                This action cannot be undone.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteQuestion.isPending}
              className="bg-destructive hover:bg-destructive/90"
            >
              {deleteQuestion.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
