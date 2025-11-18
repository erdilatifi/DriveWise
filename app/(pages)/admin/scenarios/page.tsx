'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { GlassCard } from '@/components/ui/glass-card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
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
  question_en?: string | null;
  question_sq?: string | null;
  image_url?: string;
  options: any[];
  correct_explanation: string;
  correct_explanation_en?: string | null;
  correct_explanation_sq?: string | null;
  real_world_tip: string;
  real_world_tip_en?: string | null;
  real_world_tip_sq?: string | null;
  xp: number;
  is_active: boolean;
  created_at?: string;
  chapter_id?: number | null;
  is_published?: boolean;
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
  const [publishedFilter, setPublishedFilter] = useState<string>('all');
  
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
    question_en: '',
    question_sq: '',
    image_url: '',
    options: [
      { text: '', isCorrect: false, explanation: '' },
      { text: '', isCorrect: false, explanation: '' },
      { text: '', isCorrect: false, explanation: '' },
      { text: '', isCorrect: false, explanation: '' },
    ],
    correct_explanation_en: '',
    correct_explanation_sq: '',
    real_world_tip_en: '',
    real_world_tip_sq: '',
    xp: 25,
    chapter_id: 1,
    is_published: true,
  });

  // Reset form to default values
  const resetForm = () => {
    setEditingScenario(null);
    setImageFile(null);
    setImagePreview('');
    setFormData({
      category: 'traffic-lights' as Category,
      level: 1,
      question_en: '',
      question_sq: '',
      image_url: '',
      options: [
        { text: '', isCorrect: false, explanation: '' },
        { text: '', isCorrect: false, explanation: '' },
        { text: '', isCorrect: false, explanation: '' },
        { text: '', isCorrect: false, explanation: '' },
      ],
      correct_explanation_en: '',
      correct_explanation_sq: '',
      real_world_tip_en: '',
      real_world_tip_sq: '',
      xp: 25,
      chapter_id: 1,
      is_published: true,
    });
  };

  // Open create form
  const handleOpenCreateForm = () => {
    resetForm();
    setShowForm(true);
  };

  // Close form
  const handleCloseForm = () => {
    setShowForm(false);
    resetForm();
  };

  // Calculate pagination info
  const totalPages = Math.ceil(totalCount / pageSize);
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  // Image preview when selecting a new file
  useEffect(() => {
    if (!imageFile) return;

    const url = URL.createObjectURL(imageFile);
    setImagePreview(url);

    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

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
      
      if (publishedFilter !== 'all') {
        query = query.eq('is_published', publishedFilter === 'published');
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
  }, [searchQuery, categoryFilter, levelFilter, statusFilter, publishedFilter, pageSize]);

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
  }, [categoryFilter, levelFilter, statusFilter, publishedFilter, fetchScenarios, user]);

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
    setPublishedFilter('all');
  };

  // Form helpers
  const handleFormFieldChange = (field: 'category' | 'level' | 'question_en' | 'question_sq' | 'correct_explanation_en' | 'correct_explanation_sq' | 'real_world_tip_en' | 'real_world_tip_sq' | 'xp' | 'image_url' | 'chapter_id', value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleOptionFieldChange = (index: number, field: 'text' | 'explanation', value: string) => {
    setFormData((prev) => {
      const options = [...prev.options];
      options[index] = {
        ...options[index],
        [field]: value,
      };
      return {
        ...prev,
        options,
      };
    });
  };

  const toggleOptionCorrect = (index: number) => {
    setFormData((prev) => {
      const options = prev.options.map((opt, i) =>
        i === index ? { ...opt, isCorrect: !opt.isCorrect } : opt
      );
      return {
        ...prev,
        options,
      };
    });
  };

  const handleImageChange = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
  };

  const handleSubmitScenario = async (e: any) => {
    e.preventDefault();
    if (uploading) return;

    try {
      const trimmedQuestionEn = formData.question_en.trim();
      const trimmedQuestionSq = formData.question_sq.trim();
      const baseQuestion = trimmedQuestionEn || trimmedQuestionSq;
      if (!baseQuestion) {
        toast.error('Question (at least one language) is required');
        return;
      }

      const normalizedOptions = formData.options
        .map((opt) => ({
          ...opt,
          text: opt.text.trim(),
          explanation: opt.explanation?.trim() || '',
        }))
        .filter((opt) => opt.text.length > 0);

      if (normalizedOptions.length < 2) {
        toast.error('Please provide at least two answer options');
        return;
      }

      if (!normalizedOptions.some((opt) => opt.isCorrect)) {
        toast.error('Please mark at least one option as correct');
        return;
      }

      const trimmedCorrectEn = formData.correct_explanation_en.trim();
      const trimmedCorrectSq = formData.correct_explanation_sq.trim();
      const baseCorrect = trimmedCorrectEn || trimmedCorrectSq;
      if (!baseCorrect) {
        toast.error('Correct explanation (at least one language) is required');
        return;
      }

      const trimmedTipEn = formData.real_world_tip_en.trim();
      const trimmedTipSq = formData.real_world_tip_sq.trim();
      const baseTip = trimmedTipEn || trimmedTipSq;
      if (!baseTip) {
        toast.error('Real-world tip (at least one language) is required');
        return;
      }

      if (!formData.xp || formData.xp <= 0) {
        toast.error('XP must be greater than 0');
        return;
      }

      setUploading(true);
      const supabase = createClient();

      let imageUrl = formData.image_url || '';

      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${fileExt}`;
        const filePath = `scenario-images/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('decision-trainer')
          .upload(filePath, imageFile);

        if (uploadError) {
          console.error('Error uploading image:', uploadError);
          toast.error('Failed to upload image');
          setUploading(false);
          return;
        }

        const { data: publicUrlData } = supabase.storage
          .from('decision-trainer')
          .getPublicUrl(filePath);

        imageUrl = publicUrlData.publicUrl;
      }

      if (editingScenario) {
        const { error } = await supabase
          .from('decision_trainer_scenarios')
          .update({
            category: formData.category,
            level: formData.level,
            question: baseQuestion,
            question_en: trimmedQuestionEn || null,
            question_sq: trimmedQuestionSq || null,
            image_url: imageUrl || null,
            options: normalizedOptions,
            correct_explanation: baseCorrect,
            correct_explanation_en: trimmedCorrectEn || null,
            correct_explanation_sq: trimmedCorrectSq || null,
            real_world_tip: baseTip,
            real_world_tip_en: trimmedTipEn || null,
            real_world_tip_sq: trimmedTipSq || null,
            xp: formData.xp,
            chapter_id: formData.chapter_id || null,
          })
          .eq('id', editingScenario.id);

        if (error) {
          console.error('Error updating scenario:', error);
          toast.error('Failed to update scenario');
          setUploading(false);
          return;
        }

        toast.success('Scenario updated successfully');
      } else {
        const generatedId = `scn-${Date.now()}`;

        const { error } = await supabase
          .from('decision_trainer_scenarios')
          .insert({
            id: generatedId,
            category: formData.category,
            level: formData.level,
            question: baseQuestion,
            question_en: trimmedQuestionEn || null,
            question_sq: trimmedQuestionSq || null,
            image_url: imageUrl || null,
            options: normalizedOptions,
            correct_explanation: baseCorrect,
            correct_explanation_en: trimmedCorrectEn || null,
            correct_explanation_sq: trimmedCorrectSq || null,
            real_world_tip: baseTip,
            real_world_tip_en: trimmedTipEn || null,
            real_world_tip_sq: trimmedTipSq || null,
            xp: formData.xp,
            is_active: true,
            chapter_id: formData.chapter_id || null,
          });

        if (error) {
          console.error('Error creating scenario:', error);
          toast.error('Failed to create scenario');
          setUploading(false);
          return;
        }

        toast.success('Scenario created successfully');
      }

      handleCloseForm();
      fetchScenarios(currentPage, true);
    } catch (error) {
      console.error('Error saving scenario:', error);
      toast.error('Failed to save scenario');
    } finally {
      setUploading(false);
    }
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
          <Button onClick={handleOpenCreateForm}>
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
              <div className="flex flex-wrap gap-2">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-40 min-w-[9rem]">
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
                  <SelectTrigger className="w-32 min-w-[7rem]">
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
                  <SelectTrigger className="w-32 min-w-[7rem]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={publishedFilter} onValueChange={setPublishedFilter}>
                  <SelectTrigger className="w-32 min-w-[7rem]">
                    <SelectValue placeholder="Published" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Publish</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
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
                      <Badge variant={scenario.is_published !== false ? "outline" : "destructive"}>
                        {scenario.is_published !== false ? 'Published' : 'Draft'}
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
                            question_en: scenario.question_en ?? scenario.question ?? '',
                            question_sq: scenario.question_sq ?? scenario.question ?? '',
                            image_url: scenario.image_url || '',
                            options: scenario.options,
                            correct_explanation_en: scenario.correct_explanation_en ?? scenario.correct_explanation ?? '',
                            correct_explanation_sq: scenario.correct_explanation_sq ?? scenario.correct_explanation ?? '',
                            real_world_tip_en: scenario.real_world_tip_en ?? scenario.real_world_tip ?? '',
                            real_world_tip_sq: scenario.real_world_tip_sq ?? scenario.real_world_tip ?? '',
                            xp: scenario.xp,
                            chapter_id: scenario.chapter_id || 1,
                            is_published: scenario.is_published !== false,
                          });
                          setImagePreview(scenario.image_url || '');
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

      {/* Add / Edit Scenario Form */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
          <div className="w-full max-w-4xl mx-4">
            <GlassCard className="p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">
                  {editingScenario ? 'Edit Scenario' : 'Add Scenario'}
                </h2>
                <Button variant="ghost" size="icon" onClick={handleCloseForm}>
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <form className="space-y-6" onSubmit={handleSubmitScenario}>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label className="mb-1 block">Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => handleFormFieldChange('category', value as Category)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(CATEGORY_INFO).map(([key, info]) => (
                          <SelectItem key={key} value={key}>
                            {info.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="mb-1 block">Level</Label>
                    <Select
                      value={String(formData.level)}
                      onValueChange={(value) => handleFormFieldChange('level', parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Level 1</SelectItem>
                        <SelectItem value="2">Level 2</SelectItem>
                        <SelectItem value="3">Level 3</SelectItem>
                        <SelectItem value="4">Level 4</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="mb-1 block">XP</Label>
                    <Input
                      type="number"
                      min={0}
                      value={formData.xp}
                      onChange={(e) => handleFormFieldChange('xp', parseInt(e.target.value || '0'))}
                    />
                  </div>

                  <div>
                    <Label className="mb-1 block">Chapter (optional)</Label>
                    <Input
                      type="number"
                      min={1}
                      max={20}
                      value={formData.chapter_id ?? ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        handleFormFieldChange(
                          'chapter_id',
                          value === '' ? null : parseInt(value, 10) || null,
                        );
                      }}
                      placeholder="e.g. 5"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="mb-1 block">Status</Label>
                    <Select
                      value={formData.is_published ? 'published' : 'draft'}
                      onValueChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          is_published: value === 'published',
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="block">Question (English)</Label>
                    <Textarea
                      value={formData.question_en}
                      onChange={(e) => handleFormFieldChange('question_en', e.target.value)}
                      placeholder="Enter the scenario question in English..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="block">Pyetja (Shqip)</Label>
                    <Textarea
                      value={formData.question_sq}
                      onChange={(e) => handleFormFieldChange('question_sq', e.target.value)}
                      placeholder="Shkruaj pyetjen në shqip..."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="block">Correct Explanation (English)</Label>
                    <Textarea
                      value={formData.correct_explanation_en}
                      onChange={(e) => handleFormFieldChange('correct_explanation_en', e.target.value)}
                      placeholder="Explain why the correct answer is right (EN)..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="block">Shpjegimi i saktë (Shqip)</Label>
                    <Textarea
                      value={formData.correct_explanation_sq}
                      onChange={(e) => handleFormFieldChange('correct_explanation_sq', e.target.value)}
                      placeholder="Shpjego pse përgjigjja është e saktë (SQ)..."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="block">Real-world Tip (English)</Label>
                    <Textarea
                      value={formData.real_world_tip_en}
                      onChange={(e) => handleFormFieldChange('real_world_tip_en', e.target.value)}
                      placeholder="Give a practical real-world driving tip (EN)..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="block">Këshillë praktike (Shqip)</Label>
                    <Textarea
                      value={formData.real_world_tip_sq}
                      onChange={(e) => handleFormFieldChange('real_world_tip_sq', e.target.value)}
                      placeholder="Jep një këshillë praktike në shqip (SQ)..."
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="block">Answer Options</Label>
                    <span className="text-xs text-muted-foreground">
                      Mark all correct answers (multiple correct options supported)
                    </span>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    {formData.options.map((option, index) => (
                      <div key={index} className="space-y-2 border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-muted-foreground">
                            Option {index + 1}
                          </span>
                          <Button
                            type="button"
                            size="sm"
                            variant={option.isCorrect ? 'default' : 'outline'}
                            onClick={() => toggleOptionCorrect(index)}
                          >
                            {option.isCorrect ? 'Correct' : 'Mark Correct'}
                          </Button>
                        </div>
                        <Input
                          placeholder="Option text"
                          value={option.text}
                          onChange={(e) => handleOptionFieldChange(index, 'text', e.target.value)}
                        />
                        <Textarea
                          placeholder="Optional explanation for this option"
                          value={option.explanation}
                          onChange={(e) => handleOptionFieldChange(index, 'explanation', e.target.value)}
                          className="mt-2"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="block">Image (optional)</Label>
                  <div className="flex items-center gap-4">
                    <Button type="button" variant="outline" className="flex items-center gap-2 relative overflow-hidden">
                      <ImageIcon className="w-4 h-4" />
                      <span>Choose Image</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={handleImageChange}
                      />
                    </Button>
                    {imagePreview && (
                      <div className="w-24 h-16 rounded-md overflow-hidden border">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                  {formData.image_url && !imagePreview && (
                    <p className="text-xs text-muted-foreground break-all">
                      Current image: {formData.image_url}
                    </p>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-2">
                  <Button type="button" variant="outline" onClick={handleCloseForm} disabled={uploading} className="w-full sm:w-auto">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={uploading} className="w-full sm:w-auto">
                    {uploading ? 'Saving...' : editingScenario ? 'Save Changes' : 'Create Scenario'}
                  </Button>
                </div>
              </form>
            </GlassCard>
          </div>
        </div>
      )}

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
