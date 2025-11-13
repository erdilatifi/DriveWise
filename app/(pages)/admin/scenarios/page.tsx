'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import { ArrowLeft, Plus, Edit, Trash2, Image as ImageIcon, X } from 'lucide-react';
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
}

export default function AdminScenariosPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchScenarios();
    }
  }, [user]);

  const fetchScenarios = async () => {
    try {
      console.log('🔍 Fetching scenarios...');
      const supabase = createClient();
      
      // Test table access first
      const { data, error } = await supabase
        .from('decision_trainer_scenarios')
        .select('*')
        .order('category', { ascending: true })
        .order('level', { ascending: true });

      if (error) {
        console.error('❌ Fetch error:', error);
        console.error('Error details:', {
          message: error?.message,
          code: error?.code,
          details: error?.details,
          hint: error?.hint
        });
        throw error;
      }
      
      console.log('✅ Scenarios fetched:', data?.length || 0, 'scenarios');
      setScenarios(data || []);
    } catch (error: any) {
      console.error('❌ Error fetching scenarios:', error);
      
      if (error?.code === '42P01') {
        toast.error('Decision trainer table not found. Please run the database migration.');
      } else if (error?.code === '42501') {
        toast.error('Permission denied. Please check your admin privileges.');
      } else {
        toast.error(error?.message || 'Failed to load scenarios');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    setImageFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleImageUpload = async (file: File): Promise<string | null> => {
    try {
      setUploading(true);
      const supabase = createClient();
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `scenario-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('decision-trainer')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('decision-trainer')
        .getPublicUrl(filePath);

      toast.success('Image uploaded successfully!');
      return data.publicUrl;
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast.error(error.message || 'Failed to upload image');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      console.log('🔍 Starting scenario submission...');
      console.log('📝 Form data:', formData);
      
      const supabase = createClient();
      let imageUrl = formData.image_url;

      if (imageFile) {
        console.log('📸 Uploading image...');
        try {
          const uploadedUrl = await handleImageUpload(imageFile);
          if (uploadedUrl) {
            imageUrl = uploadedUrl;
            console.log('✅ Image uploaded:', uploadedUrl);
          } else {
            console.log('❌ Image upload failed - continuing without image');
            toast.warning('Image upload failed, scenario created without image');
            imageUrl = '';
          }
        } catch (uploadError) {
          console.error('❌ Image upload error:', uploadError);
          toast.warning('Image upload failed, scenario created without image');
          imageUrl = '';
        }
      }

      // Validate required fields
      if (!formData.question.trim()) {
        toast.error('Question is required');
        return;
      }

      if (!formData.correct_explanation.trim()) {
        toast.error('Correct explanation is required');
        return;
      }

      if (!formData.real_world_tip.trim()) {
        toast.error('Real-world tip is required');
        return;
      }

      // Validate options
      const validOptions = formData.options.filter(opt => opt.text.trim());
      if (validOptions.length < 2) {
        toast.error('At least 2 options are required');
        return;
      }

      const correctOptions = formData.options.filter(opt => opt.isCorrect);
      if (correctOptions.length === 0) {
        toast.error('At least one correct option is required');
        return;
      }

      const scenarioData = {
        category: formData.category,
        level: formData.level,
        question: formData.question.trim(),
        image_url: imageUrl || null,
        options: formData.options,
        correct_explanation: formData.correct_explanation.trim(),
        real_world_tip: formData.real_world_tip.trim(),
        xp: formData.xp,
        is_active: true,
      };

      console.log('💾 Saving scenario data:', scenarioData);

      if (editingScenario) {
        console.log('✏️ Updating existing scenario:', editingScenario.id);
        const { data, error } = await supabase
          .from('decision_trainer_scenarios')
          .update(scenarioData)
          .eq('id', editingScenario.id)
          .select();

        if (error) {
          console.error('❌ Update error:', error);
          throw error;
        }
        console.log('✅ Scenario updated:', data);
        toast.success('Scenario updated!');
      } else {
        console.log('➕ Creating new scenario...');
        const { data, error } = await supabase
          .from('decision_trainer_scenarios')
          .insert([scenarioData])
          .select();

        if (error) {
          console.error('❌ Insert error:', error);
          throw error;
        }
        console.log('✅ Scenario created:', data);
        toast.success('Scenario created!');
      }

      setShowForm(false);
      setEditingScenario(null);
      setImageFile(null);
      fetchScenarios();
      resetForm();
    } catch (error: any) {
      console.error('❌ Error saving scenario:', error);
      console.error('Error details:', {
        message: error?.message,
        code: error?.code,
        details: error?.details,
        hint: error?.hint,
        full: error
      });
      
      // Provide specific error messages
      if (error?.code === '23505') {
        toast.error('A scenario with this ID already exists');
      } else if (error?.code === '42501') {
        toast.error('Permission denied. Please check your admin privileges.');
      } else if (error?.message?.includes('violates check constraint')) {
        toast.error('Invalid data format. Please check all fields.');
      } else {
        toast.error(error?.message || 'Failed to save scenario');
      }
    }
  };

  const handleDeleteClick = (id: string) => {
    setScenarioToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!scenarioToDelete) return;

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('decision_trainer_scenarios')
        .delete()
        .eq('id', scenarioToDelete);

      if (error) throw error;
      toast.success('Scenario deleted!');
      fetchScenarios();
    } catch (error: any) {
      console.error('Error deleting scenario:', error);
      toast.error('Failed to delete scenario');
    } finally {
      setDeleteDialogOpen(false);
      setScenarioToDelete(null);
    }
  };

  const resetForm = () => {
    setFormData({
      category: 'traffic-lights',
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
    setImageFile(null);
    setImagePreview('');
  };

  const startEdit = (scenario: Scenario) => {
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
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl pt-28">
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/admin">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Admin
            </Link>
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Manage Scenarios</h1>
              <p className="text-muted-foreground">Create and edit Decision Trainer questions</p>
            </div>
            <Button onClick={() => { resetForm(); setShowForm(true); setEditingScenario(null); }}>
              <Plus className="w-4 h-4 mr-2" />
              New Scenario
            </Button>
          </div>
        </div>

        {showForm && (
          <GlassCard className="p-6 mb-8">
            <h2 className="text-2xl font-bold mb-6">{editingScenario ? 'Edit' : 'Create'} Scenario</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg"
                  >
                    {Object.entries(CATEGORY_INFO).map(([key, info]) => (
                      <option key={key} value={key}>{info.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Level (1-4)</label>
                  <input
                    type="number"
                    min="1"
                    max="4"
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Question</label>
                <textarea
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg"
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Image (Optional) - Max 5MB
                </label>
                <div className="space-y-3">
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                    onChange={handleImageSelect}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                    disabled={uploading}
                  />
                  
                  {uploading && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      Uploading image...
                    </div>
                  )}
                  
                  {(imagePreview || formData.image_url) && (
                    <div className="relative inline-block">
                      <img 
                        src={imagePreview || formData.image_url} 
                        alt="Preview" 
                        className="max-w-xs max-h-64 rounded-lg border-2 border-border object-contain"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview('');
                          setFormData({ ...formData, image_url: '' });
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-4">Options</label>
                {formData.options.map((option, index) => (
                  <div key={index} className="mb-4 p-4 border border-border rounded-lg">
                    <div className="flex items-center gap-4 mb-2">
                      <input
                        type="checkbox"
                        checked={option.isCorrect}
                        onChange={(e) => {
                          const newOptions = [...formData.options];
                          newOptions[index].isCorrect = e.target.checked;
                          setFormData({ ...formData, options: newOptions });
                        }}
                        className="w-4 h-4"
                      />
                      <input
                        type="text"
                        value={option.text}
                        onChange={(e) => {
                          const newOptions = [...formData.options];
                          newOptions[index].text = e.target.value;
                          setFormData({ ...formData, options: newOptions });
                        }}
                        className="flex-1 px-3 py-2 bg-background border border-border rounded-lg"
                        placeholder={`Option ${index + 1}`}
                        required
                      />
                    </div>
                    <input
                      type="text"
                      value={option.explanation || ''}
                      onChange={(e) => {
                        const newOptions = [...formData.options];
                        newOptions[index].explanation = e.target.value;
                        setFormData({ ...formData, options: newOptions });
                      }}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm"
                      placeholder="Explanation (for wrong answers)"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Correct Explanation</label>
                <textarea
                  value={formData.correct_explanation}
                  onChange={(e) => setFormData({ ...formData, correct_explanation: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg"
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Real-World Tip</label>
                <textarea
                  value={formData.real_world_tip}
                  onChange={(e) => setFormData({ ...formData, real_world_tip: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg"
                  rows={2}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">XP Points</label>
                <input
                  type="number"
                  min="10"
                  max="100"
                  value={formData.xp}
                  onChange={(e) => setFormData({ ...formData, xp: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg"
                  required
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit">{editingScenario ? 'Update' : 'Create'} Scenario</Button>
                <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditingScenario(null); }}>
                  Cancel
                </Button>
              </div>
            </form>
          </GlassCard>
        )}

        <div className="grid grid-cols-1 gap-4">
          {Object.entries(CATEGORY_INFO).map(([category, info]) => {
            const categoryScenarios = scenarios.filter(s => s.category === category);
            return (
              <GlassCard key={category} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <span className="text-2xl">{info.icon}</span>
                    {info.name}
                    <span className="text-sm text-muted-foreground">({categoryScenarios.length} scenarios)</span>
                  </h3>
                </div>
                <div className="space-y-2">
                  {categoryScenarios.map((scenario) => (
                    <div key={scenario.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">L{scenario.level}</span>
                          <span className="font-medium">{scenario.question.substring(0, 60)}...</span>
                        </div>
                        <div className="text-xs text-muted-foreground">{scenario.xp} XP</div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => startEdit(scenario)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDeleteClick(scenario.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {categoryScenarios.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">No scenarios yet</p>
                  )}
                </div>
              </GlassCard>
            );
          })}
        </div>

        {/* Delete Confirmation Modal */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Scenario</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this scenario? This action cannot be undone and will permanently remove the scenario from the Decision Trainer.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setDeleteDialogOpen(false)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteConfirm}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete Scenario
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
