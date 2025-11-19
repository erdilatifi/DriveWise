'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, ChevronLeft, ChevronRight, Eye, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/auth-context';
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
import { toast } from 'sonner';
import { useTestHistory, useDeleteTestAttempt, useClearAllTestAttempts } from '@/hooks/use-test-attempts';

export default function HistoryPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clearAllDialogOpen, setClearAllDialogOpen] = useState(false);
  const [testToDelete, setTestToDelete] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'passed' | 'failed'>('all');
  const testsPerPage = 6;

  // Use TanStack Query for data fetching
  const { data: historyData, isLoading: loading, error } = useTestHistory(user?.id, currentPage, testsPerPage);
  const deleteTestMutation = useDeleteTestAttempt();
  const clearAllMutation = useClearAllTestAttempts();

  const tests = historyData?.tests || [];
  const totalTests = historyData?.totalCount || 0;
  const totalPages = historyData?.totalPages || 1;

  const filteredTests = tests.filter((test) => {
    const passed = test.percentage >= 80;
    if (statusFilter === 'passed') return passed;
    if (statusFilter === 'failed') return !passed;
    return true;
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
    }
  }, [authLoading, user, router]);

  const handleDeleteTest = async () => {
    if (!testToDelete) return;

    try {
      await deleteTestMutation.mutateAsync(testToDelete);
      toast.success('Test deleted successfully');
      setDeleteDialogOpen(false);
      setTestToDelete(null);
    } catch (error) {
      console.error('Error deleting test:', error);
      toast.error('Failed to delete test');
    }
  };

  const handleClearAllHistory = async () => {
    if (!user?.id) return;

    try {
      await clearAllMutation.mutateAsync(user.id);
      toast.success('All test history cleared successfully');
      setClearAllDialogOpen(false);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error clearing history:', error);
      toast.error('Failed to clear history');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">
            {authLoading ? 'Authenticating...' : 'Redirecting...'}
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="container mx-auto px-6 py-8 max-w-7xl pt-28">
          {/* Header skeleton */}
          <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
            <Skeleton className="h-9 w-40" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-72" />
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right space-y-1">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-10 w-40" />
            </div>
          </div>

          {/* Tests list skeleton */}
          <div className="space-y-4 mb-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <GlassCard key={i} className="p-6 border border-border/80 bg-black/80">
                <div className="flex items-center justify-between gap-4">
                  <Skeleton className="w-12 h-12 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-64" />
                    <Skeleton className="h-3 w-40" />
                  </div>
                  <div className="text-center space-y-2">
                    <Skeleton className="h-7 w-12" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-9 w-20" />
                    <Skeleton className="h-9 w-9" />
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
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
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Test History</h1>
              <p className="text-muted-foreground">
                Review all your completed tests and track your progress
              </p>
            </div>
            {totalTests > 0 && (
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-3xl font-bold text-primary">{totalTests}</p>
                  <p className="text-sm text-muted-foreground">Total Tests</p>
                </div>
                <Button
                  variant="destructive"
                  onClick={() => setClearAllDialogOpen(true)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear All History
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Tests List */}
        {totalTests > 0 ? (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <p className="text-sm text-muted-foreground">
                Filter by result
              </p>
              <div className="flex gap-2">
                <Button
                  variant={statusFilter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('all')}
                >
                  All
                </Button>
                <Button
                  variant={statusFilter === 'passed' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('passed')}
                >
                  Passed
                </Button>
                <Button
                  variant={statusFilter === 'failed' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('failed')}
                >
                  Failed
                </Button>
              </div>
            </div>

            {filteredTests.length > 0 ? (
              <div className="space-y-4 mb-8">
                {filteredTests.map((test) => {
                const passed = test.percentage >= 80;
                return (
                  <motion.div
                    key={test.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <GlassCard className="p-5 sm:p-6 border border-border/80 bg-black/80 hover:border-primary/40 transition-colors">
                      <div className="flex flex-col gap-3">
                        {/* Top row: icon + basic info */}
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                              passed ? 'bg-green-500/10' : 'bg-red-500/10'
                            }`}>
                              {passed ? (
                                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
                              ) : (
                                <XCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
                              )}
                            </div>
                            <div>
                              <h3 className="font-semibold text-base sm:text-lg mb-0.5">
                                Category {test.category} - {
                                  test.test_number === 'mixed' ? 'Mixed Test' :
                                  test.test_number === 'personalized' ? 'Personalized Test' :
                                  `Test #${test.test_number}`
                                }
                              </h3>
                              <p className="text-xs sm:text-sm text-muted-foreground">
                                {formatDate(test.completed_at)} • {test.total_questions} questions
                              </p>
                            </div>
                          </div>
                          <div className="hidden sm:flex flex-col items-end text-xs">
                            <span className={`px-2 py-1 rounded-full font-medium ${
                              passed ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'
                            }`}>
                              {passed ? 'Passed' : 'Failed'}
                            </span>
                          </div>
                        </div>

                        {/* Bottom row: score + actions */}
                        <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-3">
                          <div className="flex items-center gap-4 w-full sm:w-auto">
                            <div className="text-center">
                              <p className={`text-2xl sm:text-3xl font-bold ${passed ? 'text-green-500' : 'text-red-500'}`}>
                                {test.percentage}%
                              </p>
                              <p className="text-xs text-muted-foreground">Score</p>
                            </div>
                            <div className="hidden sm:block h-8 w-px bg-border" />
                            <div className="text-xs sm:text-sm text-muted-foreground">
                              {test.score}/{test.total_questions} correct
                            </div>
                          </div>

                          <div className="flex flex-row sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto sm:justify-end">
                            <Button asChild className="flex-[0.7] sm:flex-none">
                              <Link href={`/history/${test.id}`}>
                                <Eye className="w-4 h-4 mr-2" />
                                Review
                              </Link>
                            </Button>
                            <Button
                              variant="destructive"
                              size="icon"
                              className="flex-[0.3] sm:flex-none"
                              onClick={() => {
                                setTestToDelete(test.id);
                                setDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>
                );
                })}
              </div>
            ) : (
              <GlassCard className="p-12 text-center mb-8 border border-border/80 bg-black/80">
                <p className="text-muted-foreground mb-2">No tests in this filter yet</p>
                <p className="text-xs text-muted-foreground">Try changing the filter or take a new test.</p>
              </GlassCard>
            )}

            {/* Delete Single Test Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Test History?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete this test attempt and all associated answers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setDeleteDialogOpen(false)}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteTest}
                    disabled={deleteTestMutation.isPending}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {deleteTestMutation.isPending ? 'Deleting...' : 'Delete'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {/* Clear All History Dialog */}
            <AlertDialog open={clearAllDialogOpen} onOpenChange={setClearAllDialogOpen}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear All Test History?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete ALL {totalTests} test attempts and their associated answers from your history.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setClearAllDialogOpen(false)}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleClearAllHistory}
                    disabled={clearAllMutation.isPending}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {clearAllMutation.isPending ? 'Clearing...' : `Clear All ${totalTests} Tests`}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {/* Pagination */}
            {totalPages > 1 && (
              <GlassCard className="p-4 border border-border/80 bg-black/80">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  {/* Page Info */}
                  <div className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </div>

                  {/* Pagination Controls */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      Previous
                    </Button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                        if (
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                          return (
                            <Button
                              key={page}
                              variant={currentPage === page ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => setCurrentPage(page)}
                              className="min-w-[40px]"
                            >
                              {page}
                            </Button>
                          );
                        } else if (page === currentPage - 2 || page === currentPage + 2) {
                          return <span key={page} className="px-2 text-muted-foreground">...</span>;
                        }
                        return null;
                      })}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>

                  {/* Total Tests Info */}
                  <div className="text-sm text-muted-foreground">
                    Showing {(currentPage - 1) * testsPerPage + 1}{' '}
                    - {Math.min(currentPage * testsPerPage, totalTests)} of {totalTests} tests
                  </div>
                </div>
              </GlassCard>
            )}
          </>
        ) : (
          <GlassCard className="p-12 text-center border border-border/80 bg-black/80">
            <p className="text-muted-foreground mb-4">No test history yet</p>
            <Button asChild>
              <Link href="/">Start Your First Test</Link>
            </Button>
          </GlassCard>
        )}
      </motion.div>
    </div>
  );
}
