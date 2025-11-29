'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { useLanguage } from '@/contexts/language-context';
import { Navbar } from '@/components/navbar';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Search, Upload, Trash2, Save, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useTrafficSigns, useUpdateTrafficSign, useDeleteTrafficSign, useUploadSignImage, TrafficSign } from '@/hooks/use-traffic-signs';
import { GlassCard } from '@/components/ui/glass-card';
import { toast } from 'sonner';

export default function AdminSignsPage() {
  const { user, isAdmin, loading } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [editingSign, setEditingSign] = useState<TrafficSign | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { data, isLoading, refetch } = useTrafficSigns({ page, search, category, pageSize: 50 });
  const updateSign = useUpdateTrafficSign();
  const deleteSign = useDeleteTrafficSign();
  const uploadImage = useUploadSignImage();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push('/');
    }
  }, [user, isAdmin, loading, router]);

  const handleImageUpload = async (file: File) => {
    if (!editingSign) return;
    setIsUploading(true);
    try {
      const publicUrl = await uploadImage.mutateAsync(file);
      setEditingSign({ ...editingSign, image_url: publicUrl });
      toast.success('Image uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    if (!editingSign) return;
    try {
      await updateSign.mutateAsync({
        id: editingSign.id,
        name: editingSign.name,
        description: editingSign.description,
        image_url: editingSign.image_url
      });
      toast.success('Sign updated successfully');
      setEditingSign(null);
      refetch();
    } catch (error) {
      toast.error('Failed to update sign');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this sign?')) {
      try {
        await deleteSign.mutateAsync(id);
        toast.success('Sign deleted successfully');
        refetch();
      } catch (error) {
        toast.error('Failed to delete sign');
      }
    }
  };

  if (loading || !user || !isAdmin) return null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="container mx-auto px-6 py-8 max-w-7xl pt-28">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" asChild className="pl-0 hover:bg-transparent hover:text-primary">
            <Link href="/admin" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              {t('admin.backToDashboard')}
            </Link>
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">{t('admin.trafficSigns')}</h1>
            <p className="text-muted-foreground">
              {t('admin.trafficSignsDesc')}
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by name or code..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-card/50 focus:outline-none focus:border-primary"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              className="px-4 py-2 rounded-lg border border-border bg-card/50 focus:outline-none focus:border-primary"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="danger">Danger</option>
              <option value="prohibition">Prohibition</option>
              <option value="mandatory">Mandatory</option>
              <option value="info">Info</option>
            </select>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">Loading signs...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data?.signs.map((sign) => (
                <GlassCard key={sign.id} className="p-4 flex flex-col h-full bg-black/40 border-border/50">
                  {editingSign?.id === sign.id ? (
                    <div className="space-y-4 flex-1">
                      <div className="relative aspect-video bg-black/20 rounded-lg overflow-hidden flex items-center justify-center group border-2 border-dashed border-border/50">
                        {editingSign.image_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={editingSign.image_url} alt={sign.name} className="w-full h-full object-contain" />
                        ) : (
                          <ImageIcon className="w-8 h-8 text-muted-foreground" />
                        )}
                        <label className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                          />
                          <div className="text-white flex flex-col items-center">
                            <Upload className="w-6 h-6 mb-2" />
                            <span className="text-xs">Change Image</span>
                          </div>
                        </label>
                        {isUploading && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                            <Loader2 className="w-6 h-6 animate-spin text-white" />
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">Name</label>
                          <input
                            value={editingSign.name}
                            onChange={(e) => setEditingSign({ ...editingSign, name: e.target.value })}
                            className="w-full px-3 py-2 rounded bg-black/20 border border-border focus:border-primary outline-none text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">Description</label>
                          <textarea
                            value={editingSign.description}
                            onChange={(e) => setEditingSign({ ...editingSign, description: e.target.value })}
                            className="w-full px-3 py-2 rounded bg-black/20 border border-border focus:border-primary outline-none text-sm min-h-[80px]"
                          />
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2 mt-auto">
                        <Button size="sm" onClick={handleSave} className="flex-1">
                          <Save className="w-4 h-4 mr-2" />
                          Save
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setEditingSign(null)}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="aspect-video bg-white/5 rounded-lg mb-4 p-2 flex items-center justify-center relative">
                        {sign.image_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={sign.image_url} alt={sign.name} className="w-full h-full object-contain" />
                        ) : (
                          <div className="text-center text-muted-foreground">
                            <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <span className="text-xs">No image</span>
                          </div>
                        )}
                        <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 backdrop-blur-sm rounded text-xs font-mono text-primary">
                          {sign.code}
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1 line-clamp-1">{sign.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                          {sign.description}
                        </p>
                      </div>

                      <div className="flex gap-2 mt-auto pt-4 border-t border-border/30">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="flex-1 hover:bg-primary/10 hover:text-primary"
                          onClick={() => setEditingSign(sign)}
                        >
                          Edit
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="hover:bg-red-500/10 hover:text-red-500 text-muted-foreground"
                          onClick={() => handleDelete(sign.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </>
                  )}
                </GlassCard>
              ))}
            </div>
          )}

          {/* Pagination */}
          {data && data.total > 50 && (
            <div className="flex justify-center gap-2 mt-8">
              <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
              >
                Previous
              </Button>
              <div className="flex items-center px-4">
                Page {page} of {Math.ceil(data.total / 50)}
              </div>
              <Button
                variant="outline"
                disabled={page >= Math.ceil(data.total / 50)}
                onClick={() => setPage(p => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
