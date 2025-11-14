'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { GlassCard } from '@/components/ui/glass-card';
import { ArrowLeft, Plus, Edit, Trash2, Image as ImageIcon, X, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { toast } from 'sonner';
import { CATEGORY_INFO, type Category } from '@/data/scenarios';
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

interface Scenario {
  id: string;
  category: string;
  level: number;
  question: string;
  image_url?: string;
  options: any[];
  correct_explanation: string;
  real_world_tip: string;
  xp: number;
  is_active: boolean;
  created_at?: string;
}

export default function AdminScenariosPageOptimized() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  // Data state
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20); // Show 20 scenarios per page
  
  // Filter and search state
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingScenario, setEditingScenario] = useState<Scenario | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [scenarioToDelete, setScenarioToDelete] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    category: 'traffic-lights' as Category,
    level: 1,
    question: '',
    image_url: '',
    options: [
      { text: '', isCorrect: false, explanation: '' },
      { text: '', isCorrect: false, explanation: '' },
      { text: '', isCorrect: false, explanation: '' },
      { text: '', isCorrect: false, explanation: '' },
    ],
    correct_explanation: '',
    real_world_tip: '',
    xp: 25,
  });

  // Calculate pagination info
  const totalPages = Math.ceil(totalCount / pageSize);
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  // Optimized fetch with pagination and filtering
  const fetchScenarios = useCallback(async (page = 1, resetData = false) => {
    try {
      if (resetData) {
        setLoading(true);
      }
      
      const supabase = createClient();
      
      // Build query with filters
      let query = supabase
        .from('decision_trainer_scenarios')
        .select('*', { count: 'exact' });
      
      // Apply filters
      if (searchQuery.trim()) {
        query = query.or(`question.ilike.%${searchQuery}%,correct_explanation.ilike.%${searchQuery}%,real_world_tip.ilike.%${searchQuery}%`);
      }
      
      if (categoryFilter !== 'all') {
        query = query.eq('category', categoryFilter);
      }
      
      if (levelFilter !== 'all') {
        query = query.eq('level', parseInt(levelFilter));
      }
      
      if (statusFilter !== 'all') {
        query = query.eq('is_active', statusFilter === 'active');
      }
      
      // Apply pagination
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      
      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) {
        console.error('❌ Fetch error:', error);
        throw error;
      }
      
      console.log(`✅ Scenarios loaded: ${data?.length || 0} of ${count || 0} total`);
      
      setScenarios(data || []);
      setTotalCount(count || 0);
      setCurrentPage(page);
    } catch (error: unknown) {
      console.error('Error fetching scenarios:', error);
      const errorMessage = (error as Error).message || 'Failed to load scenarios';
      
      if (errorMessage.includes('42P01')) {
        toast.error('Decision trainer table not found. Please run the database migration.');
      } else if (errorMessage.includes('42501')) {
        toast.error('Permission denied. Please check your admin privileges.');
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  }, [searchQuery, categoryFilter, levelFilter, statusFilter, pageSize]);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (user) {
        setCurrentPage(1);
        fetchScenarios(1, true);
      }
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [searchQuery, fetchScenarios, user]);

  // Filter change effect
  useEffect(() => {
    if (user) {
      setCurrentPage(1);
      fetchScenarios(1, true);
    }
  }, [categoryFilter, levelFilter, statusFilter, fetchScenarios, user]);

  // Initial load
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    } else if (user) {
      fetchScenarios(1, true);
    }
  }, [user, authLoading, router, fetchScenarios]);

  // Pagination handlers
  const handleNextPage = () => {
    if (hasNextPage) {
      fetchScenarios(currentPage + 1, true);
    }
  };

  const handlePrevPage = () => {
    if (hasPrevPage) {
      fetchScenarios(currentPage - 1, true);
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      fetchScenarios(page, true);
    }
  };

  // Clear filters
  const clearFilters = () => {
    setSearchQuery('');
    setCategoryFilter('all');
    setLevelFilter('all');
    setStatusFilter('all');
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: pageSize }).map((_, i) => (
        <div key={i} className="p-4 border rounded-lg">
          <Skeleton className="h-4 w-3/4 mb-2" />
          <Skeleton className="h-3 w-1/2 mb-4" />
          <Skeleton className="h-20 w-full mb-2" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-16" />
          </div>
        </div>
      ))}
    </div>
  );

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-6 py-8 max-w-7xl pt-28">
          <div className="flex items-center justify-between mb-8">
            <div>
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-6 py-8 max-w-7xl pt-28">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <Button variant="ghost" asChild>
                <Link href="/admin">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Admin
                </Link>
              </Button>
            </div>
            <h1 className="text-3xl font-bold">Decision Trainer Scenarios</h1>
            <p className="text-muted-foreground">
              Manage interactive driving scenarios ({totalCount} total)
            </p>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Scenario
          </Button>
        </div>

        {/* Filters and Search */}
        <GlassCard className="p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search scenarios..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              {/* Filters */}
              <div className="flex gap-2">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {Object.entries(CATEGORY_INFO).map(([key, info]) => (
                      <SelectItem key={key} value={key}>
                        {info.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={levelFilter} onValueChange={setLevelFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="1">Level 1</SelectItem>
                    <SelectItem value="2">Level 2</SelectItem>
                    <SelectItem value="3">Level 3</SelectItem>
                    <SelectItem value="4">Level 4</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Clear filters button */}
            {(searchQuery || categoryFilter !== 'all' || levelFilter !== 'all' || statusFilter !== 'all') && (
              <Button variant="outline" onClick={clearFilters}>
                <X className="w-4 h-4 mr-2" />
                Clear Filters
              </Button>
            )}
          </div>
        </GlassCard>

        {/* Scenarios Grid */}
        {loading ? (
          <LoadingSkeleton />
        ) : scenarios.length === 0 ? (
          <GlassCard className="p-12 text-center">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-xl font-bold mb-2">No scenarios found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || categoryFilter !== 'all' || levelFilter !== 'all' || statusFilter !== 'all'
                ? 'Try adjusting your filters or search query.'
                : 'Get started by creating your first scenario.'}
            </p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add First Scenario
            </Button>
          </GlassCard>
        ) : (
          <>
            {/* Scenarios Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
              {scenarios.map((scenario) => (
                <GlassCard key={scenario.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex gap-2">
                      <Badge variant="outline">
                        {CATEGORY_INFO[scenario.category as Category]?.name || scenario.category}
                      </Badge>
                      <Badge variant="secondary">
                        Level {scenario.level}
                      </Badge>
                      <Badge variant={scenario.is_active ? "default" : "destructive"}>
                        {scenario.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>
                  
                  <h3 className="font-semibold mb-2 line-clamp-2">
                    {scenario.question}
                  </h3>
                  
                  {scenario.image_url && (
                    <div className="mb-3">
                      <img
                        src={scenario.image_url}
                        alt="Scenario"
                        className="w-full h-32 object-cover rounded-md"
                      />
                    </div>
                  )}
                  
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {scenario.correct_explanation}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-primary">
                      {scenario.xp} XP
                    </span>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingScenario(scenario);
                          setFormData({
                            category: scenario.category as Category,
                            level: scenario.level,
                            question: scenario.question,
                            image_url: scenario.image_url || '',
                            options: scenario.options,
                            correct_explanation: scenario.correct_explanation,
                            real_world_tip: scenario.real_world_tip,
                            xp: scenario.xp,
                          });
                          setShowForm(true);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          setScenarioToDelete(scenario.id);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalCount)} of {totalCount} scenarios
                </p>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrevPage}
                    disabled={!hasPrevPage}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>
                  
                  {/* Page numbers */}
                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <Button
                          key={pageNum}
                          variant={pageNum === currentPage ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(pageNum)}
                          className="w-10"
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextPage}
                    disabled={!hasNextPage}
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Scenario</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this scenario? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (!scenarioToDelete) return;
                
                try {
                  const supabase = createClient();
                  const { error } = await supabase
                    .from('decision_trainer_scenarios')
                    .delete()
                    .eq('id', scenarioToDelete);
                  
                  if (error) throw error;
                  
                  toast.success('Scenario deleted successfully');
                  fetchScenarios(currentPage, true);
                } catch (error) {
                  console.error('Error deleting scenario:', error);
                  toast.error('Failed to delete scenario');
                } finally {
                  setDeleteDialogOpen(false);
                  setScenarioToDelete(null);
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
