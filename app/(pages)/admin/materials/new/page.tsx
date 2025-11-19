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
import { motion } from 'framer-motion';
import {
  useCreateMaterial,
  useUploadMaterialImage,
  useCreateMaterialImage,
  useMaterials,
} from '@/hooks/use-materials';
import { toast } from 'sonner';
import { ArrowLeft, Save, ImagePlus, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface MaterialFormState {
  chapter_id: number;
  order_index: number;
  title_en: string;
  title_sq: string;
  content_en_text: string;
  content_sq_text: string;
  is_published: boolean;
}

interface PendingImage {
  file: File;
  caption_en: string;
  caption_sq: string;
  order_index?: number;
}

export default function NewMaterialPage() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();
  const createMaterial = useCreateMaterial();
  const uploadImage = useUploadMaterialImage();
  const createMaterialImage = useCreateMaterialImage();
  const { data: existingMaterialsData } = useMaterials({ includeUnpublished: true, pageSize: 200 });

  const [formData, setFormData] = useState<MaterialFormState>({
    chapter_id: 1,
    order_index: 1,
    title_en: '',
    title_sq: '',
    content_en_text: '{\n  \n}',
    content_sq_text: '{\n  \n}',
    is_published: true,
  });

  const [pendingImages, setPendingImages] = useState<PendingImage[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageCaptionEn, setImageCaptionEn] = useState('');
  const [imageCaptionSq, setImageCaptionSq] = useState('');
  const [imageOrderIndex, setImageOrderIndex] = useState<number | ''>('');

  const usedChapterIds = new Set(
    (existingMaterialsData?.materials || []).map((m: any) => m.chapter_id as number),
  );

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      router.push('/');
    }
  }, [user, isAdmin, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors: string[] = [];

    if (!formData.title_en.trim()) {
      errors.push('English title is required');
    }
    if (!formData.title_sq.trim()) {
      errors.push('Albanian title is required');
    }
    if (!formData.chapter_id || formData.chapter_id < 1 || formData.chapter_id > 20) {
      errors.push('Chapter must be between 1 and 20');
    }
    if (!formData.order_index) {
      errors.push('Order index is required');
    }

    if (usedChapterIds.has(formData.chapter_id)) {
      errors.push('A material for this chapter already exists. Please edit it instead.');
    }

    let contentEn: any;
    let contentSq: any;

    try {
      contentEn = JSON.parse(formData.content_en_text || '{}');
    } catch {
      errors.push('English content must be valid JSON');
    }

    try {
      contentSq = JSON.parse(formData.content_sq_text || '{}');
    } catch {
      errors.push('Albanian content must be valid JSON');
    }

    if (errors.length > 0) {
      toast.error(errors[0]);
      console.error('Validation errors:', errors);
      return;
    }

    try {
      const result = await createMaterial.mutateAsync({
        chapter_id: formData.chapter_id,
        order_index: formData.order_index,
        title_en: formData.title_en.trim(),
        title_sq: formData.title_sq.trim(),
        content_en: contentEn,
        content_sq: contentSq,
        is_published: formData.is_published,
      });
      
      if (pendingImages.length > 0) {
        for (let i = 0; i < pendingImages.length; i++) {
          const img = pendingImages[i];
          const publicUrl = await uploadImage.mutateAsync(img.file);

          await createMaterialImage.mutateAsync({
            material_id: result.id,
            image_url: publicUrl,
            caption_en: img.caption_en || undefined,
            caption_sq: img.caption_sq || undefined,
            order_index: img.order_index,
          });
        }
      }

      toast.success('Material created successfully!');

      setTimeout(() => {
        router.push(`/admin/materials/${result.id}/edit`);
      }, 500);
    } catch (error: any) {
      const message = error?.message || 'Failed to create material';
      if (message.includes('23505')) {
        toast.error('A material for this chapter already exists. Please edit it instead.');
      } else {
        toast.error(message);
      }
      console.error('Error creating material:', error);
    }
  };

  const handleAddImageToQueue = () => {
    if (!imageFile) {
      toast.error('Please select an image file');
      return;
    }

    const order =
      imageOrderIndex === '' ? pendingImages.length + 1 : Number(imageOrderIndex) || undefined;

    const next: PendingImage = {
      file: imageFile,
      caption_en: imageCaptionEn,
      caption_sq: imageCaptionSq,
      order_index: order,
    };

    setPendingImages((prev) => [...prev, next]);
    setImageFile(null);
    setImageCaptionEn('');
    setImageCaptionSq('');
    setImageOrderIndex('');
  };

  const handleRemovePendingImage = (index: number) => {
    setPendingImages((prev) => prev.filter((_, i) => i !== index));
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
    <div className="min-h-screen bg-background text-foreground">
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
          </div>
          <h1 className="text-3xl font-bold">Add Study Material</h1>
          <p className="text-sm text-muted-foreground">
            Create a new study material entry for a specific chapter
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <GlassCard className="p-6 space-y-6 border border-border/80 bg-black/80">
            {/* Chapter and Order */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="chapter_id">Chapter *</Label>
                <Select
                  value={String(formData.chapter_id)}
                  onValueChange={(value) => {
                    const chapter = parseInt(value, 10) || 1;
                    setFormData({
                      ...formData,
                      chapter_id: chapter,
                      order_index: chapter,
                    });
                  }}
                >
                  <SelectTrigger id="chapter_id">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 20 }).map((_, index) => {
                      const chapter = index + 1;
                      if (usedChapterIds.has(chapter)) return null;
                      return (
                        <SelectItem key={chapter} value={String(chapter)}>
                          Chapter {chapter}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="order_index">Order Index *</Label>
                <Input
                  id="order_index"
                  type="number"
                  min="1"
                  value={formData.order_index}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      order_index: parseInt(e.target.value, 10) || 1,
                    })
                  }
                  required
                />
              </div>
            </div>

            {/* Titles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title_en">Title (English) *</Label>
                <Input
                  id="title_en"
                  value={formData.title_en}
                  onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                  placeholder="e.g. 1. Basic Traffic Rules"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title_sq">Title (Albanian) *</Label>
                <Input
                  id="title_sq"
                  value={formData.title_sq}
                  onChange={(e) => setFormData({ ...formData, title_sq: e.target.value })}
                  placeholder="p.sh. 1. Rregullat Bazike"
                  required
                />
              </div>
            </div>

            {/* Content JSON */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="content_en_text">Content (English JSON) *</Label>
                <Textarea
                  id="content_en_text"
                  rows={10}
                  value={formData.content_en_text}
                  onChange={(e) => setFormData({ ...formData, content_en_text: e.target.value })}
                  placeholder="Paste or write the content as a JSON object (keys and arrays)."
                  className="font-mono text-xs"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Example: {'{"section_key": ["Point 1", "Point 2"]}'}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content_sq_text">Content (Albanian JSON) *</Label>
                <Textarea
                  id="content_sq_text"
                  rows={10}
                  value={formData.content_sq_text}
                  onChange={(e) => setFormData({ ...formData, content_sq_text: e.target.value })}
                  placeholder="Përmbajtja në formë JSON për shqip."
                  className="font-mono text-xs"
                  required
                />
              </div>
            </div>

            {/* Published Toggle */}
            <div className="flex items-center gap-3 pt-2">
              <input
                id="is_published"
                type="checkbox"
                checked={formData.is_published}
                onChange={(e) =>
                  setFormData({ ...formData, is_published: e.target.checked })
                }
              />
              <Label htmlFor="is_published" className="text-sm">
                Published (visible to users)
              </Label>
            </div>

            <div className="space-y-4 pt-4 border-t border-border">
              <div className="flex items-center gap-2">
                <ImagePlus className="w-4 h-4" />
                <h2 className="text-lg font-semibold">Material Images</h2>
              </div>

              <div className="grid gap-6 md:grid-cols-[minmax(0,2fr),minmax(0,3fr)]">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="image_file">Add Image</Label>
                    <input
                      id="image_file"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                      className="block w-full text-sm text-muted-foreground"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="image_caption_en">Caption (English)</Label>
                      <Input
                        id="image_caption_en"
                        value={imageCaptionEn}
                        onChange={(e) => setImageCaptionEn(e.target.value)}
                        placeholder="Optional caption in English"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="image_caption_sq">Caption (Albanian)</Label>
                      <Input
                        id="image_caption_sq"
                        value={imageCaptionSq}
                        onChange={(e) => setImageCaptionSq(e.target.value)}
                        placeholder="Përshkrim opsional në shqip"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 max-w-xs">
                    <Label htmlFor="image_order_index">Order Index</Label>
                    <Input
                      id="image_order_index"
                      type="number"
                      min="1"
                      value={imageOrderIndex === '' ? '' : imageOrderIndex}
                      onChange={(e) => {
                        const value = e.target.value;
                        setImageOrderIndex(value === '' ? '' : parseInt(value, 10) || '');
                      }}
                      placeholder="Leave empty to append automatically"
                    />
                    <p className="text-xs text-muted-foreground">
                      Images are uploaded after the material is created and shown above the chapter
                      content.
                    </p>
                  </div>

                  <Button
                    type="button"
                    onClick={handleAddImageToQueue}
                    className="shadow-sm"
                    disabled={!imageFile}
                  >
                    <ImagePlus className="w-4 h-4 mr-2" />
                    Add Image to Queue
                  </Button>
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-medium">Images queued for upload</p>
                  {pendingImages.length === 0 ? (
                    <p className="text-xs text-muted-foreground">
                      No images queued yet. You can add images now or later on the edit page.
                    </p>
                  ) : (
                    <div className="space-y-2 text-xs">
                      {pendingImages.map((img, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between gap-3 border border-border rounded-md px-3 py-2 bg-muted/40"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{img.file.name}</p>
                            {img.order_index && (
                              <p className="text-[10px] text-muted-foreground">
                                Order: {img.order_index}
                              </p>
                            )}
                          </div>
                          <Button
                            type="button"
                            size="icon"
                            variant="destructive"
                            className="h-7 w-7"
                            onClick={() => handleRemovePendingImage(index)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={
                  createMaterial.isPending ||
                  uploadImage.isPending ||
                  createMaterialImage.isPending
                }
                className="flex-1 shadow-lg shadow-primary/20"
              >
                {createMaterial.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Create Material
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/admin/materials')}
                disabled={createMaterial.isPending}
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
