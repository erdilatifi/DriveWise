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
      toast.success('Testi u fshi me sukses');
      setDeleteDialogOpen(false);
      setTestToDelete(null);
    } catch (error) {
      console.error('Error deleting test:', error);
      toast.error('Dështoi fshirja e testit');
    }
  };

  const handleClearAllHistory = async () => {
    if (!user?.id) return;

    try {
      await clearAllMutation.mutateAsync(user.id);
      toast.success('Historia e testeve u pastrua me sukses');
      setClearAllDialogOpen(false);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error clearing history:', error);
      toast.error('Dështoi pastrimi i historisë');
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
    <div className="relative min-h-screen bg-background text-foreground overflow-hidden">
      {/* Background grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(60%_60%_at_50%_20%,#000_20%,transparent_70%)]"
      >
        <svg className="h-full w-full opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="history-grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M32 0H0V32" fill="none" stroke="currentColor" strokeWidth="0.4" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#history-grid)" />
        </svg>
      </div>

      {/* Warm glows & rails */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-orange-500/25 via-transparent to-transparent blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="hidden lg:block absolute top-24 bottom-24 left-[10%] w-px bg-gradient-to-b from-transparent via-orange-500/25 to-transparent" />
        <div className="hidden lg:block absolute top-24 bottom-24 right-[10%] w-px bg-gradient-to-b from-transparent via-orange-500/25 to-transparent" />
      </div>

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
              Kthehu te Paneli
            </Link>
          </Button>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Historia e Testeve</h1>
              <p className="text-muted-foreground">
                Rishikoni të gjitha testet e përfunduara dhe gjurmoni përparimin tuaj
              </p>
            </div>
            {totalTests > 0 && (
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-3xl font-bold text-primary">{totalTests}</p>
                  <p className="text-sm text-muted-foreground">Teste Totale</p>
                </div>
                <Button
                  variant="destructive"
                  onClick={() => setClearAllDialogOpen(true)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Pastro Gjithë Historinë
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
                Filtro sipas rezultatit
              </p>
              <div className="flex gap-2">
                <Button
                  variant={statusFilter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('all')}
                >
                  Të gjitha
                </Button>
                <Button
                  variant={statusFilter === 'passed' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('passed')}
                >
                  Kaluar
                </Button>
                <Button
                  variant={statusFilter === 'failed' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('failed')}
                >
                  Dështuar
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
                                Kategoria {test.category} - {
                                  test.test_number === 'mixed' ? 'Test i Përzier' :
                                  test.test_number === 'personalized' ? 'Test i Personalizuar' :
                                  `Testi #${test.test_number}`
                                }
                              </h3>
                              <p className="text-xs sm:text-sm text-muted-foreground">
                                {formatDate(test.completed_at)} • {test.total_questions} pyetje
                              </p>
                            </div>
                          </div>
                          <div className="hidden sm:flex flex-col items-end text-xs">
                            <span className={`px-2 py-1 rounded-full font-medium ${
                              passed ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'
                            }`}>
                              {passed ? 'Kaluar' : 'Dështuar'}
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
                              <p className="text-xs text-muted-foreground">Rezultati</p>
                            </div>
                            <div className="hidden sm:block h-8 w-px bg-border" />
                            <div className="text-xs sm:text-sm text-muted-foreground">
                              {test.score}/{test.total_questions} të sakta
                            </div>
                          </div>

                          <div className="flex flex-row sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto sm:justify-end">
                            <Button asChild className="flex-[0.7] sm:flex-none">
                              <Link href={`/history/${test.id}`}>
                                <Eye className="w-4 h-4 mr-2" />
                                Rishiko
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
                <p className="text-muted-foreground mb-2">Ende asnjë test në këtë filtër</p>
                <p className="text-xs text-muted-foreground">Provoni të ndryshoni filtrin ose bëni një test të ri.</p>
              </GlassCard>
            )}

            {/* Delete Single Test Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Fshi Historinë e Testit?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Ky veprim nuk mund të zhbëhet. Do të fshijë përgjithmonë këtë përpjekje testi dhe të gjitha përgjigjet e lidhura me të.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setDeleteDialogOpen(false)}>
                    Anulo
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteTest}
                    disabled={deleteTestMutation.isPending}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {deleteTestMutation.isPending ? 'Duke fshirë...' : 'Fshi'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {/* Clear All History Dialog */}
            <AlertDialog open={clearAllDialogOpen} onOpenChange={setClearAllDialogOpen}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Pastro Gjithë Historinë e Testeve?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Ky veprim nuk mund të zhbëhet. Do të fshijë përgjithmonë TË GJITHA {totalTests} përpjekjet e testeve dhe përgjigjet e lidhura me to nga historia juaj.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setClearAllDialogOpen(false)}>
                    Anulo
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleClearAllHistory}
                    disabled={clearAllMutation.isPending}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {clearAllMutation.isPending ? 'Duke pastruar...' : `Pastro të gjitha ${totalTests} testet`}
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
                    Faqja {currentPage} nga {totalPages}
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
                      E Mëparshme
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
                      E Radhës
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>

                  {/* Total Tests Info */}
                  <div className="text-sm text-muted-foreground">
                    Duke shfaqur {(currentPage - 1) * testsPerPage + 1}{' '}
                    - {Math.min(currentPage * testsPerPage, totalTests)} nga {totalTests} teste
                  </div>
                </div>
              </GlassCard>
            )}
          </>
        ) : (
          <GlassCard className="p-12 text-center border border-border/80 bg-black/80">
            <p className="text-muted-foreground mb-4">Ende asnjë histori testesh</p>
            <Button asChild>
              <Link href="/">Fillo Testin Tënd të Parë</Link>
            </Button>
          </GlassCard>
        )}
      </motion.div>
    </div>
  );
}
