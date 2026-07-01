'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Navbar } from '@/components/navbar';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { BookOpen, Plus, Search, Edit, Trash2, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useMaterials, useDeleteMaterial, Material } from '@/hooks/use-materials';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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

export default function MaterialsPage() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [chapterFilter, setChapterFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [materialToDelete, setMaterialToDelete] = useState<Material | null>(null);
  const itemsPerPage = 10;

  const chapterId = chapterFilter === 'all' ? undefined : parseInt(chapterFilter, 10) || undefined;

  const { data, isLoading, error } = useMaterials({
    search: searchQuery,
    chapterId,
    page: currentPage,
    pageSize: itemsPerPage,
    includeUnpublished: true,
  });

  const deleteMaterial = useDeleteMaterial();

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      router.push('/');
    }
  }, [user, isAdmin, authLoading, router]);

  const totalMaterials = data?.total || 0;
  const materials = data?.materials || [];
  const totalPages = Math.ceil(totalMaterials / itemsPerPage) || 1;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, chapterFilter]);

  const openDeleteDialog = (material: Material) => {
    setMaterialToDelete(material);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!materialToDelete) return;

    try {
      await deleteMaterial.mutateAsync(materialToDelete.id);
      toast.success('Materiali u fshi me sukses');
      setDeleteDialogOpen(false);
      setMaterialToDelete(null);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Ndodhi një gabim i panjohur';
      toast.error(`Dështoi fshirja e materialit: ${message}`);
      console.error('Error deleting material:', error);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Duke ngarkuar materialet...</p>
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
            <p className="text-destructive">Gabim gjatë ngarkimit të materialeve: {error.message}</p>
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
            Kthehu në Panelin Admin
          </Link>
        </Button>

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <BookOpen className="w-7 h-7 text-primary" />
              Materialet Mësimore
            </h1>
            <p className="text-sm text-muted-foreground">
              Menaxho materialet mësimore për secilin kapitull ({totalMaterials} gjithsej)
            </p>
          </div>
          <Button asChild className="shadow-lg shadow-primary/20">
            <Link href="/admin/materials/new">
              <Plus className="w-4 h-4 mr-2" />
              Shto Material
            </Link>
          </Button>
        </div>

        {/* Filters */}
        <GlassCard className="p-6 mb-6 border border-border/80 bg-black/80">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Kërko sipas titullit..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="w-full md:w-48">
              <Select
                value={chapterFilter}
                onValueChange={(value) => setChapterFilter(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Të gjithë kapitujt" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Të gjithë kapitujt</SelectItem>
                  {Array.from({ length: 13 }).map((_, index) => {
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
          </div>
        </GlassCard>

        {/* Materials List */}
        <div className="space-y-4">
          {materials.length === 0 && (
            <GlassCard className="p-12 text-center border border-border/80 bg-black/80">
              <p className="text-muted-foreground mb-4">
                Nuk u gjet asnjë material. Shto materialin tënd të parë mësimor.
              </p>
              <Button asChild>
                <Link href="/admin/materials/new">
                  <Plus className="w-4 h-4 mr-2" />
                  Shto Materialin e Parë
                </Link>
              </Button>
            </GlassCard>
          )}

          {materials.map((material) => (
            <GlassCard
              key={material.id}
              className="p-5 flex flex-col md:flex-row justify-between gap-4 border border-border/80 bg-black/80"
            >
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="px-2 py-1 rounded-lg bg-primary/10 text-primary text-xs font-semibold">
                    Kapitulli {material.chapter_id}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                      material.is_published
                        ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300'
                        : 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300'
                    }`}
                  >
                    {material.is_published ? 'Publikuar' : 'Skicë'}
                  </span>
                </div>
                <h3 className="text-lg font-semibold mb-1">
                  {material.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                  {/* Render a preview of content if needed, or just remove description */}
                </p>
                <p className="text-xs text-muted-foreground">
                  Përditësuar më: {new Date(material.updated_at).toLocaleString()}
                </p>
              </div>

              <div className="flex md:flex-col gap-2 md:min-w-[160px]">
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="flex-1 md:flex-none"
                >
                  <Link href={`/admin/materials/${material.id}/edit`}>
                    <Edit className="w-4 h-4 md:mr-2" />
                    <span className="hidden md:inline">Ndrysho</span>
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openDeleteDialog(material)}
                  disabled={deleteMaterial.isPending}
                  className="flex-1 md:flex-none text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4 md:mr-2" />
                  <span className="hidden md:inline">Fshi</span>
                </Button>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex flex-col items-center gap-3">
            <p className="text-xs text-muted-foreground">
              Duke shfaqur {(currentPage - 1) * itemsPerPage + 1}{' '}
              - {Math.min(currentPage * itemsPerPage, totalMaterials)} nga {totalMaterials} materiale
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                E mëparshme
              </Button>
              <span className="text-xs text-muted-foreground">
                Faqja {currentPage} nga {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              >
                E radhës
              </Button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Fshi Materialin</AlertDialogTitle>
            <AlertDialogDescription>
              A jeni i sigurt që doni të fshini këtë material?
              <div className="mt-3 p-3 rounded-lg bg-muted/50 border border-border">
                <p className="text-sm font-medium text-foreground line-clamp-2">
                  Kapitulli {materialToDelete?.chapter_id}: {materialToDelete?.title}
                </p>
              </div>
              <p className="mt-3 text-destructive font-medium">
                Ky veprim nuk mund të zhbëhet.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteDialogOpen(false)}>
              Anulo
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteMaterial.isPending}
              className="bg-destructive hover:bg-destructive/90"
            >
              {deleteMaterial.isPending ? 'Duke fshirë...' : 'Fshi'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
