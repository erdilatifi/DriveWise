'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { GlassCard } from '@/components/ui/glass-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { BookOpen, Search, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import { useMaterials } from '@/hooks/use-materials';
import { Skeleton } from '@/components/ui/skeleton';

type SectionKey = number;

const SECTION_ORDER: SectionKey[] = [
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
];

export default function MaterialsPage() {
  const [selectedSection, setSelectedSection] = useState<SectionKey>(1);
  const [search, setSearch] = useState('');
  const { language, t } = useLanguage();
  const searchParams = useSearchParams();

  const { data, isLoading, error } = useMaterials({ pageSize: 50 });
  const materials = (data?.materials ?? []) as any[];

  const sectionOrder: SectionKey[] = useMemo(() => {
    const chapterIds = Array.from(
      new Set(materials.map((m) => m.chapter_id as number))
    ).sort((a, b) => a - b);
    return chapterIds.length > 0 ? chapterIds : SECTION_ORDER;
  }, [materials]);

  useEffect(() => {
    const chapterParam = searchParams.get('chapter');
    if (!chapterParam) return;

    const chapter = parseInt(chapterParam, 10);
    if (!Number.isNaN(chapter) && (sectionOrder as number[]).includes(chapter)) {
      setSelectedSection(chapter as SectionKey);
    }
  }, [searchParams, sectionOrder]);

  const currentMaterial = useMemo(() => {
    return materials.find((m) => m.chapter_id === selectedSection) ?? null;
  }, [materials, selectedSection]);

  const baseContent = useMemo(() => {
    if (!currentMaterial) return null;
    return language === 'sq' ? currentMaterial.content_sq : currentMaterial.content_en;
  }, [currentMaterial, language]);
  const filteredSectionOrder = useMemo(() => {
    if (!search.trim()) return sectionOrder;

    const query = search.toLowerCase();

    return sectionOrder.filter((id) => {
      const sectionIndex = sectionOrder.indexOf(id);
      const key = `materials.section.${sectionIndex + 1}`;
      let label = t(key);

      if (!label || label === key) {
        const materialForChapter = materials.find((m: any) => m.chapter_id === id);
        label =
          language === 'sq'
            ? materialForChapter?.title_sq || `Chapter ${id}`
            : materialForChapter?.title_en || `Chapter ${id}`;
      }

      return label.toLowerCase().includes(query);
    });
  }, [sectionOrder, search, materials, language, t]);

  const renderValue = (value: any) => {
    if (typeof value === 'string') {
      return <p className="text-sm text-muted-foreground leading-relaxed mb-2">{value}</p>;
    }
    if (Array.isArray(value)) {
      return (
        <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
          {value.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      );
    }
    if (typeof value === 'object' && value !== null) {
      return (
        <div className="space-y-4">
          {Object.entries(value).map(([subKey, subValue]) => (
            <div key={subKey} className="space-y-1">
              <h4 className="text-sm font-semibold text-foreground capitalize">
                {subKey.replace(/_/g, ' ')}
              </h4>
              {renderValue(subValue)}
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const currentSectionContent = (baseContent || {}) as any;
  const currentImages = (currentMaterial?.images ?? []) as any[];

  const sectionIndex = sectionOrder.indexOf(selectedSection);
  const sectionTitleKey = sectionIndex >= 0 ? `materials.section.${sectionIndex + 1}` : '';
  let sectionTitle = sectionTitleKey ? t(sectionTitleKey) : '';
  if (!sectionTitle || sectionTitle === sectionTitleKey) {
    const materialForSelected = materials.find((m: any) => m.chapter_id === selectedSection);
    sectionTitle =
      language === 'sq'
        ? materialForSelected?.title_sq || `Chapter ${selectedSection}`
        : materialForSelected?.title_en || `Chapter ${selectedSection}`;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />

        <div className="pt-28">
          <div className="container mx-auto px-4 py-10 max-w-6xl">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar skeleton */}
              <aside className="w-full lg:w-72 space-y-4">
                <GlassCard className="p-4 flex items-center gap-3">
                  <Skeleton className="w-10 h-10 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-40" />
                  </div>
                </GlassCard>

                <GlassCard className="p-3">
                  <Skeleton className="h-9 w-full" />
                </GlassCard>

                <GlassCard className="p-2 space-y-2 max-h-[480px] overflow-y-auto">
                  {Array.from({ length: 8 }).map((_, idx) => (
                    <Skeleton key={idx} className="h-9 w-full" />
                  ))}
                </GlassCard>
              </aside>

              {/* Main content skeleton */}
              <main className="flex-1">
                <GlassCard className="p-6 md:p-8">
                  <Skeleton className="h-6 w-48 mb-4" />
                  <div className="space-y-3">
                    {Array.from({ length: 6 }).map((_, idx) => (
                      <Skeleton key={idx} className="h-4 w-full" />
                    ))}
                  </div>
                </GlassCard>
              </main>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-28">
          <div className="container mx-auto px-4 py-10 max-w-3xl">
            <GlassCard className="p-6">
              <p className="text-sm font-semibold text-destructive mb-1">
                {t('materials.errorLoadFailed')}
              </p>
              <p className="text-xs text-muted-foreground break-words">
                {(error as any)?.message || String(error)}
              </p>
            </GlassCard>
          </div>
        </div>
      </div>
    );
  }

  if (!materials.length) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-28">
          <div className="container mx-auto px-4 py-10 max-w-3xl">
            <GlassCard className="p-6">
              <h1 className="text-lg font-bold mb-2">{t('materials.emptyTitle')}</h1>
              <p className="text-sm text-muted-foreground">{t('materials.emptySubtitle')}</p>
            </GlassCard>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-28">
        <div className="container mx-auto px-4 py-10 max-w-6xl">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <aside className="w-full lg:w-72 space-y-4">
              <GlassCard className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h1 className="text-lg font-bold">{t('materials.title')}</h1>
                  <p className="text-xs text-muted-foreground">{t('materials.subtitle')}</p>
                </div>
              </GlassCard>

              <GlassCard className="p-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                  <Input
                    placeholder={t('materials.searchPlaceholder')}
                    className="pl-9 bg-background/60 border-border/60"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </GlassCard>

              <GlassCard className="p-2 space-y-1 max-h-[480px] overflow-y-auto">
                {filteredSectionOrder.map((id) => {
                  const isActive = id === selectedSection;
                  const sectionIndex = sectionOrder.indexOf(id);
                  const key = `materials.section.${sectionIndex + 1}`;
                  let label = t(key);
                  if (!label || label === key) {
                    const materialForChapter = materials.find((m: any) => m.chapter_id === id);
                    label =
                      language === 'sq'
                        ? materialForChapter?.title_sq || `Chapter ${id}`
                        : materialForChapter?.title_en || `Chapter ${id}`;
                  }
                  return (
                    <Button
                      key={id}
                      variant={isActive ? 'default' : 'ghost'}
                      className={`w-full justify-start text-sm font-medium flex items-center gap-2 ${
                        isActive ? 'bg-primary text-primary-foreground' : 'text-foreground/80'
                      }`}
                      onClick={() => {
                        setSelectedSection(id);
                        setSearch('');
                      }}
                    >
                      <ChevronRight className="w-4 h-4" />
                      <span className="truncate text-left">{label}</span>
                    </Button>
                  );
                })}
              </GlassCard>
            </aside>

            {/* Main content */}
            <main className="flex-1">
              <GlassCard className="p-6 md:p-8">
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-1">
                      {sectionTitle}
                    </h2>
                    {search ? (
                      <p className="text-xs text-muted-foreground">
                        {t('materials.resultsForPrefix')} "{search}" {t('materials.resultsForSuffix')}
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        {t('materials.readCarefully')}
                      </p>
                    )}
                  </div>
                </div>

                {/* Images for this chapter */}
                {currentImages.length > 0 && (
                  <div className="grid gap-4 mb-6 md:grid-cols-2">
                    {currentImages.map((img) => (
                      <figure
                        key={img.id}
                        className="overflow-hidden rounded-xl border border-border bg-muted/40"
                      >
                        <img
                          src={img.image_url}
                          alt={
                            language === 'sq'
                              ? img.caption_sq || img.caption_en || sectionTitle
                              : img.caption_en || img.caption_sq || sectionTitle
                          }
                          loading="lazy"
                          className="w-full h-48 object-cover"
                        />
                        {(img.caption_en || img.caption_sq) && (
                          <figcaption className="px-3 py-2 text-xs text-muted-foreground">
                            {language === 'sq'
                              ? img.caption_sq || img.caption_en
                              : img.caption_en || img.caption_sq}
                          </figcaption>
                        )}
                      </figure>
                    ))}
                  </div>
                )}

                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  {Object.keys(currentSectionContent).length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      {t('materials.noResults')}
                    </p>
                  ) : (
                    Object.entries(currentSectionContent).map(([key, value]) => (
                      <section key={key} className="space-y-2">
                        <h3 className="text-base font-semibold capitalize">
                          {key.replace(/_/g, ' ')}
                        </h3>
                        {renderValue(value)}
                      </section>
                    ))
                  )}
                </motion.div>
              </GlassCard>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
