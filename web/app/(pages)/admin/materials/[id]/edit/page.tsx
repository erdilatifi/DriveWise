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
import { motion } from 'framer-motion';
import {
  useMaterial,
  useUpdateMaterial,
  useUploadMaterialImage,
  useCreateMaterialImage,
  useDeleteMaterialImage,
} from '@/hooks/use-materials';
import type { LicenseCategory } from '@/types/database';
import { toast } from 'sonner';
import { ArrowLeft, Save, ImagePlus, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface EditMaterialPageProps {
  params: Promise<{
    id: string;
  }>;
}

interface MaterialFormState {
  chapter_id: number;
  category: LicenseCategory;
  order_index: number;
  title: string;
  content_text: string;
  is_published: boolean;
}

export default function EditMaterialPage({ params }: EditMaterialPageProps) {
  const { id } = use(params);
  const { user, isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();

  const { data: material, isLoading: materialLoading } = useMaterial(id);
  const updateMaterial = useUpdateMaterial();
  const uploadImage = useUploadMaterialImage();
  const createMaterialImage = useCreateMaterialImage();
  const deleteMaterialImage = useDeleteMaterialImage();

  const [formData, setFormData] = useState<MaterialFormState>({
    chapter_id: 1,
    category: 'B',
    order_index: 1,
    title: '',
    content_text: '{\n  \n}',
    is_published: true,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageCaption, setImageCaption] = useState('');
  const [imageOrderIndex, setImageOrderIndex] = useState<number | ''>('');

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      router.push('/');
    }
  }, [user, isAdmin, authLoading, router]);

  useEffect(() => {
    if (material) {
      setFormData({
        chapter_id: material.chapter_id,
        category: (material.category as LicenseCategory) || 'B',
        order_index: material.order_index,
        title: material.title,
        content_text: JSON.stringify(material.content || {}, null, 2),
        is_published: material.is_published,
      });
    }
  }, [material]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors: string[] = [];

    if (!formData.title.trim()) {
      errors.push('Titulli është i detyrueshëm');
    }
    if (!formData.chapter_id || formData.chapter_id < 1 || formData.chapter_id > 20) {
      errors.push('Kapitulli duhet të jetë mes 1 dhe 20');
    }
    if (!formData.order_index) {
      errors.push('Indeksi i renditjes është i detyrueshëm');
    }

    let content: Record<string, unknown> = {};

    try {
      content = JSON.parse(formData.content_text || '{}');
    } catch {
      errors.push('Përmbajtja duhet të jetë JSON e vlefshme');
    }

    if (errors.length > 0) {
      toast.error(errors[0]);
      console.error('Validation errors:', errors);
      return;
    }

    try {
      await updateMaterial.mutateAsync({
        id,
        chapter_id: formData.chapter_id,
        category: formData.category,
        order_index: formData.order_index,
        title: formData.title.trim(),
        content: content,
        is_published: formData.is_published,
      });

      toast.success('Materiali u përditësua me sukses!');

      setTimeout(() => {
        router.push('/admin/materials');
      }, 500);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Dështoi përditësimi i materialit';
      toast.error(message);
      console.error('Error updating material:', error);
    }
  };

  const handleAddImage = async () => {
    if (!material) {
      toast.error('Materiali ende nuk është ngarkuar');
      return;
    }

    if (!imageFile) {
      toast.error('Ju lutem zgjidhni një skedar imazhi');
      return;
    }

    try {
      const order = imageOrderIndex === ''
        ? ((material.images?.length || 0) + 1)
        : Number(imageOrderIndex) || null;

      const publicUrl = await uploadImage.mutateAsync(imageFile);

      await createMaterialImage.mutateAsync({
        material_id: material.id,
        image_url: publicUrl,
        caption: imageCaption || undefined,
        order_index: order === null ? undefined : order,
      });

      toast.success('Imazhi u shtua me sukses');
      setImageFile(null);
      setImageCaption('');
      setImageOrderIndex('');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Dështoi shtimi i imazhit';
      toast.error(message);
      console.error('Error adding material image:', error);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    try {
      await deleteMaterialImage.mutateAsync(imageId);
      toast.success('Imazhi u fshi');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Dështoi fshirja e imazhit';
      toast.error(message);
      console.error('Error deleting material image:', error);
    }
  };

  if (authLoading || materialLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Duke ngarkuar...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin || !material) {
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
              <Link href="/admin/materials">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kthehu te Materialet
              </Link>
            </Button>
          </div>
          <h1 className="text-3xl font-bold">Ndrysho Materialin Mësimor</h1>
          <p className="text-sm text-muted-foreground">
            Kapitulli {material.chapter_id} – {material.title}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <GlassCard className="p-6 space-y-6 border border-border/80 bg-black/80">
            {/* Chapter and Order */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="chapter_id">Kapitulli *</Label>
                <Select
                  value={String(formData.chapter_id)}
                  onValueChange={(value) => {
                    const chapter = parseInt(value, 10) || 1;
                    setFormData({
                      ...formData,
                      chapter_id: chapter,
                    });
                  }}
                >
                  <SelectTrigger id="chapter_id">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 20 }).map((_, index) => {
                      const chapter = index + 1;
                      return (
                        <SelectItem key={chapter} value={String(chapter)}>
                          Kapitulli {chapter}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="order_index">Indeksi i Renditjes *</Label>
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

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Titulli *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            {/* Content JSON */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="content_text">Përmbajtja (JSON) *</Label>
                <Textarea
                  id="content_text"
                  rows={10}
                  value={formData.content_text}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      content_text: e.target.value,
                    })
                  }
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
                Publikuar (i dukshëm për përdoruesit)
              </Label>
            </div>

            {/* Material Images */}
            <div className="space-y-4 pt-4 border-t border-border">
              <div className="flex items-center gap-2">
                <ImagePlus className="w-4 h-4" />
                <h2 className="text-lg font-semibold">Imazhet e Materialit</h2>
              </div>

              <div className="grid gap-6 md:grid-cols-[minmax(0,2fr),minmax(0,3fr)]">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="image_file">Shto Imazh</Label>
                    <input
                      id="image_file"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                      className="block w-full text-sm text-muted-foreground"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image_caption">Titra</Label>
                    <Input
                      id="image_caption"
                      value={imageCaption}
                      onChange={(e) => setImageCaption(e.target.value)}
                      placeholder="Titra opsionale"
                    />
                  </div>

                  <div className="space-y-2 max-w-xs">
                    <Label htmlFor="image_order_index">Indeksi i Renditjes</Label>
                    <Input
                      id="image_order_index"
                      type="number"
                      min="1"
                      value={imageOrderIndex === '' ? '' : imageOrderIndex}
                      onChange={(e) => {
                        const value = e.target.value;
                        setImageOrderIndex(value === '' ? '' : parseInt(value, 10) || '');
                      }}
                      placeholder="Lëreni bosh për ta shtuar në fund"
                    />
                    <p className="text-xs text-muted-foreground">
                      Imazhet shfaqen mbi përmbajtjen e kapitullit në faqen e materialeve.
                    </p>
                  </div>

                  <Button
                    type="button"
                    onClick={handleAddImage}
                    disabled={
                      uploadImage.isPending ||
                      createMaterialImage.isPending ||
                      !material
                    }
                    className="shadow-sm"
                  >
                    {uploadImage.isPending || createMaterialImage.isPending ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Duke ngarkuar...
                      </>
                    ) : (
                      <>
                        <ImagePlus className="w-4 h-4 mr-2" />
                        Ngarko Imazhin
                      </>
                    )}
                  </Button>
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-medium">Imazhet Ekzistuese</p>
                  {!material.images || material.images.length === 0 ? (
                    <p className="text-xs text-muted-foreground">
                      Ende nuk janë shtuar imazhe për këtë material.
                    </p>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      {material.images.map((img) => (
                        <div
                          key={img.id}
                          className="border border-border rounded-md overflow-hidden bg-muted/30 flex flex-col"
                        >
                          <div className="aspect-video bg-muted">
                            <img
                              src={img.image_url}
                              alt={img.caption || 'Material image'}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          </div>
                          <div className="p-2 space-y-1 text-xs">
                            <p className="font-medium truncate">
                              {img.caption || 'Pa titra'}
                            </p>
                            {typeof img.order_index === 'number' && (
                              <p className="text-[10px] text-muted-foreground">
                                Renditja: {img.order_index}
                              </p>
                            )}
                            <div className="flex justify-end pt-1">
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => handleDeleteImage(img.id)}
                                disabled={deleteMaterialImage.isPending}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
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
                disabled={updateMaterial.isPending}
                className="flex-1 shadow-lg shadow-primary/20"
              >
                {updateMaterial.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Duke përditësuar...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Përditëso Materialin
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/admin/materials')}
                disabled={updateMaterial.isPending}
              >
                Anulo
              </Button>
            </div>
          </GlassCard>
        </form>
      </motion.div>
    </div>
  );
}
