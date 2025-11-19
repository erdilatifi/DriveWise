'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/auth-context';
import { Navbar } from '@/components/navbar';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useQuestions } from '@/hooks/use-questions';
import { ArrowLeft, Search, Languages, AlertTriangle, Edit } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function TranslationModePage() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [translationFilter, setTranslationFilter] = useState<'all' | 'missingEn' | 'missingSq'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const { data, isLoading, error } = useQuestions({
    category: categoryFilter || undefined,
    search: searchQuery,
    status: 'all',
    page: currentPage,
    pageSize: itemsPerPage,
  });

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      router.push('/');
    }
  }, [user, isAdmin, authLoading, router]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, categoryFilter, translationFilter]);

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading translation data...</p>
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
        <div className="container mx-auto px-6 py-8 max-w-7xl pt-28">
          <GlassCard className="p-6 flex items-center gap-3 text-destructive border border-border/80 bg-black/80">
            <AlertTriangle className="w-5 h-5" />
            <p>Error loading questions for translation: {error.message}</p>
          </GlassCard>
        </div>
      </div>
    );
  }

  const questions = data?.questions || [];
  const totalQuestions = data?.total || 0;

  // Apply translation filter in-memory
  const filteredQuestions = questions.filter((q) => {
    const hasEn = !!(q.question_text_en && q.question_text_en.trim().length > 0);
    const hasSq = !!(q.question_text_sq && q.question_text_sq.trim().length > 0);

    if (translationFilter === 'missingEn') return !hasEn;
    if (translationFilter === 'missingSq') return !hasSq;
    return true;
  });

  const totalPages = Math.ceil(totalQuestions / itemsPerPage) || 1;

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
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Languages className="w-6 h-6 text-primary" />
              Translation Mode (Questions)
            </h1>
            <p className="text-sm text-muted-foreground">
              Quickly review and fill in missing English / Albanian question texts.
            </p>
          </div>
        </div>

        {/* Filters */}
        <GlassCard className="p-6 mb-6 border border-border/80 bg-black/80">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by original question text..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="w-full md:w-48">
              <Select
                value={categoryFilter || 'all'}
                onValueChange={(value) => setCategoryFilter(value === 'all' ? '' : value)}
              >
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
            <div className="w-full md:w-56">
              <Select
                value={translationFilter}
                onValueChange={(value) => setTranslationFilter(value as typeof translationFilter)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Translation filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All questions</SelectItem>
                  <SelectItem value="missingEn">Missing English</SelectItem>
                  <SelectItem value="missingSq">Missing Albanian</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Showing {filteredQuestions.length} of {totalQuestions} questions on this page
            {' '}({translationFilter === 'all' ? 'no translation filter' : translationFilter === 'missingEn' ? 'missing English' : 'missing Albanian'}).
          </p>
        </GlassCard>

        {/* Translation table */}
        <GlassCard className="p-0 overflow-hidden border border-border/80 bg-black/80">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-muted/60 border-b border-border">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Category / Test</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Original Question</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">English (EN)</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Albanian (SQ)</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredQuestions.map((q) => {
                  const hasEn = !!(q.question_text_en && q.question_text_en.trim().length > 0);
                  const hasSq = !!(q.question_text_sq && q.question_text_sq.trim().length > 0);

                  return (
                    <tr key={q.id} className="border-b border-border/70 hover:bg-muted/40">
                      <td className="px-4 py-3 align-top whitespace-nowrap text-xs">
                        <div className="font-semibold">Cat {q.category}</div>
                        <div className="text-muted-foreground">Test #{q.test_number}</div>
                      </td>
                      <td className="px-4 py-3 align-top text-xs max-w-xs">
                        <p className="line-clamp-3 text-muted-foreground">{q.question_text}</p>
                      </td>
                      <td className="px-4 py-3 align-top text-xs max-w-xs">
                        <div className="flex items-start gap-2">
                          <span
                            className={`mt-0.5 h-2 w-2 rounded-full ${
                              hasEn ? 'bg-emerald-500' : 'bg-amber-500'
                            }`}
                          />
                          <p className={`line-clamp-3 ${hasEn ? '' : 'italic text-amber-600'}`}>
                            {hasEn ? q.question_text_en : 'Missing English translation'}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3 align-top text-xs max-w-xs">
                        <div className="flex items-start gap-2">
                          <span
                            className={`mt-0.5 h-2 w-2 rounded-full ${
                              hasSq ? 'bg-emerald-500' : 'bg-amber-500'
                            }`}
                          />
                          <p className={`line-clamp-3 ${hasSq ? '' : 'italic text-amber-600'}`}>
                            {hasSq ? q.question_text_sq : 'Missing Albanian translation'}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3 align-top text-right text-xs">
                        <Button
                          size="sm"
                          variant="outline"
                          asChild
                          className="inline-flex items-center gap-1"
                        >
                          <Link href={`/admin/questions/${q.id}/edit`}>
                            <Edit className="w-3 h-3" />
                            Edit
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  );
                })}
                {filteredQuestions.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-xs text-muted-foreground">
                      No questions match the current filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </GlassCard>

        {/* Simple pagination info (reuses existing question pagination) */}
        {totalPages > 1 && (
          <div className="mt-4 text-xs text-muted-foreground text-right">
            Page {currentPage} of {totalPages}
          </div>
        )}
      </motion.div>
    </div>
  );
}
