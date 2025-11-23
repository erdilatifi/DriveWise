'use client';

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { GlassCard } from '@/components/ui/glass-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { BookOpen, Search, ChevronRight, AlertCircle, Lock } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import { useMaterials, type Material } from '@/hooks/use-materials';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/auth-context';
import { useGlobalPremium, useUserPlans } from '@/hooks/use-subscriptions';
import type { LicenseCategory } from '@/types/database';
import { isPlanCurrentlyActive } from '@/lib/subscriptions';

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
  36,
];

export default function MaterialsPage() {
  const { language, t } = useLanguage();
  const isSq = language === 'sq';
  const searchParams = useSearchParams();
  const { user, isAdmin } = useAuth();
  const { data: userPlans } = useUserPlans(user?.id);
  const allowedCategories = useMemo<LicenseCategory[]>(() => {
    if (isAdmin) {
      return ['A', 'B', 'C', 'D'];
    }
    const now = new Date();
    return (userPlans || [])
      .filter((plan) =>
        plan.status === 'active' &&
        isPlanCurrentlyActive({ startDate: plan.start_date, endDate: plan.end_date }, now),
      )
      .map((plan) => plan.category as LicenseCategory);
  }, [userPlans, isAdmin]);

  const primaryCategory = !isAdmin ? allowedCategories[0] : undefined;

  const { data, isLoading, error } = useMaterials({
    pageSize: 50,
    category: primaryCategory,
  });
  const materials = (data?.materials ?? []) as Material[];
  const { hasAnyActivePlan, isLoading: premiumLoading } = useGlobalPremium(user?.id, isAdmin);

  const sectionOrder: SectionKey[] = useMemo(() => {
    const chapterIds = Array.from(
      new Set(materials.map((m) => m.chapter_id as number))
    ).sort((a, b) => a - b);
    return chapterIds.length > 0 ? chapterIds : SECTION_ORDER;
  }, [materials]);
  
  const [selectedSection, setSelectedSection] = useState<SectionKey>(() => {
    const chapterParam = searchParams.get('chapter');
    const fallback = sectionOrder[0] ?? SECTION_ORDER[0];
    if (!chapterParam) return fallback;

    const chapter = parseInt(chapterParam, 10);
    if (!Number.isNaN(chapter) && (sectionOrder as number[]).includes(chapter)) {
      return chapter as SectionKey;
    }
    return fallback;
  });

  const [search, setSearch] = useState<string>(() => {
    const searchParam = searchParams.get('search') || searchParams.get('q');
    return searchParam || '';
  });

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
        const materialForChapter = materials.find((m) => m.chapter_id === id);
        label =
          language === 'sq'
            ? materialForChapter?.title_sq || `Chapter ${id}`
            : materialForChapter?.title_en || `Chapter ${id}`;
      }

      return label.toLowerCase().includes(query);
    });
  }, [sectionOrder, search, materials, language, t]);

  const renderValue = (value: unknown) => {
    if (typeof value === 'string') {
      return <p className="text-sm text-muted-foreground leading-relaxed mb-4">{value}</p>;
    }
    if (Array.isArray(value)) {
      return (
        <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground mb-4">
          {value.map((item, idx) => (
            <li key={idx} className="pl-1">{typeof item === 'string' ? item : String(item)}</li>
          ))}
        </ul>
      );
    }
    if (typeof value === 'object' && value !== null) {
      const entries = Object.entries(value as Record<string, unknown>);
      return (
        <div className="space-y-6">
          {entries.map(([subKey, subValue]) => (
            <div key={subKey} className="space-y-2">
              <h4 className="text-base font-semibold text-foreground capitalize flex items-center gap-2">
                <div className="h-1 w-1 rounded-full bg-orange-500" />
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

  const currentSectionContent = (baseContent || {}) as Record<string, unknown>;
  const currentImages = currentMaterial?.images ?? [];

  const sectionIndex = sectionOrder.indexOf(selectedSection);
  const totalSections = sectionOrder.length;
  const sectionTitleKey = sectionIndex >= 0 ? `materials.section.${sectionIndex + 1}` : '';
  let sectionTitle = sectionTitleKey ? t(sectionTitleKey) : '';
  if (!sectionTitle || sectionTitle === sectionTitleKey) {
    const materialForSelected = materials.find((m) => m.chapter_id === selectedSection);
    sectionTitle =
      language === 'sq'
        ? materialForSelected?.title_sq || `Chapter ${selectedSection}`
        : materialForSelected?.title_en || `Chapter ${selectedSection}`;
  }

  // Try to interpret content as a structured chapter JSON as described in the schema
  const chapter = (currentSectionContent as any)?.chapter as
    | {
        code?: string;
        title?: string;
        description?: string;
        sections?: Array<{
          order?: number;
          title?: string;
          points?: unknown;
        }>;
      }
    | undefined;

  const chapterSections = Array.isArray(chapter?.sections) ? chapter!.sections : [];

  if (isLoading || premiumLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />

        <div className="pt-32">
          <div className="container mx-auto px-4 py-10 max-w-6xl">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar skeleton */}
              <aside className="w-full lg:w-80 space-y-4">
                <GlassCard className="p-4 flex items-center gap-3">
                  <Skeleton className="w-10 h-10 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-40" />
                  </div>
                </GlassCard>

                <GlassCard className="p-3">
                  <Skeleton className="h-10 w-full rounded-lg" />
                </GlassCard>

                <GlassCard className="p-2 space-y-2">
                  {Array.from({ length: 8 }).map((_, idx) => (
                    <Skeleton key={idx} className="h-10 w-full rounded-lg" />
                  ))}
                </GlassCard>
              </aside>

              {/* Main content skeleton */}
              <main className="flex-1">
                <GlassCard className="p-6 md:p-10">
                  <Skeleton className="h-8 w-64 mb-6" />
                  <div className="space-y-4">
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

  if (!isAdmin && !premiumLoading && (!hasAnyActivePlan || allowedCategories.length === 0)) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        {/* Background elements */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-orange-500/20 via-transparent to-transparent blur-3xl" />
        <Navbar />
        <div className="pt-32">
          <div className="container mx-auto px-4 py-10 max-w-3xl">
            <GlassCard className="p-8 md:p-10 border border-orange-500/30 bg-black/85 text-center relative overflow-hidden">
              <div className="pointer-events-none absolute -top-24 -right-24 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl" />
              
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-orange-500/10 flex items-center justify-center mb-6 border border-orange-500/20">
                  <Lock className="w-8 h-8 text-orange-400" />
                </div>
                
                <h1 className="text-3xl font-semibold mb-3 tracking-tight">
                  {t('materials.premiumRequiredTitle')}
                </h1>
                <p className="text-base text-muted-foreground mb-8 max-w-lg mx-auto leading-relaxed">
                  {t('materials.premiumRequiredDescription')}
                </p>
                
                <div className="grid gap-4 text-left max-w-md mx-auto mb-8 w-full">
                  {[
                    t('materials.premiumBenefitAllChapters'),
                    t('materials.premiumBenefitDeeper'),
                    t('materials.premiumBenefitVisuals')
                  ].map((benefit, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                      <div className="mt-0.5 w-5 h-5 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                        <div className="w-2 h-2 rounded-full bg-orange-400" />
                      </div>
                      <span className="text-sm text-muted-foreground">{benefit}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
                  <Button asChild className="flex-1 bg-orange-500 hover:bg-orange-600 text-black font-medium h-11">
                    <Link href="/pricing?category=B">
                      {t('materials.premiumUpgradeCta')}
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="flex-1 h-11 border-white/10 hover:bg-white/5">
                    <Link href="/dashboard">
                      {t('auth.backToHome')}
                    </Link>
                  </Button>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32">
          <div className="container mx-auto px-4 py-10 max-w-3xl">
            <GlassCard className="p-8 text-center border-red-500/30 bg-black/80">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <p className="text-lg font-semibold text-red-400 mb-2">
                {t('materials.errorLoadFailed')}
              </p>
              <p className="text-sm text-muted-foreground break-words">
                {t('error.message')}
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
        <div className="pt-32">
          <div className="container mx-auto px-4 py-10 max-w-3xl">
            <GlassCard className="p-8 text-center bg-black/80">
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h1 className="text-xl font-bold mb-2">{t('materials.emptyTitle')}</h1>
              <p className="text-sm text-muted-foreground">{t('materials.emptySubtitle')}</p>
            </GlassCard>
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
            <pattern id="materials-grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M32 0H0V32" fill="none" stroke="currentColor" strokeWidth="0.4" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#materials-grid)" />
        </svg>
      </div>

      {/* Warm glows & rails */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-orange-500/20 via-transparent to-transparent blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="hidden lg:block absolute top-24 bottom-24 left-[10%] w-px bg-gradient-to-b from-transparent via-orange-500/20 to-transparent" />
        <div className="hidden lg:block absolute top-24 bottom-24 right-[10%] w-px bg-gradient-to-b from-transparent via-orange-500/20 to-transparent" />
      </div>

      <Navbar />

      <div className="pt-32">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <aside className="w-full lg:w-80 space-y-6">
              <GlassCard className="p-5 flex items-center gap-4 border border-border/80 bg-black/75 sticky top-32">
                <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center shadow-inner border border-orange-500/20">
                  <BookOpen className="w-6 h-6 text-orange-400" />
                </div>
                <div className="space-y-1">
                  <h1 className="text-lg font-semibold tracking-tight">
                    {t('materials.title')}
                  </h1>
                  <p className="text-xs text-muted-foreground leading-tight">
                    {isSq ? 'Lexo teorinë për të mësuar' : 'Read theory to improve'}
                  </p>
                </div>
              </GlassCard>

              <div className="lg:sticky lg:top-56 space-y-4">
                <GlassCard className="p-3 border border-border/80 bg-black/75">
                  <div className="relative">
                    <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                    <Input
                      placeholder={t('materials.searchPlaceholder')}
                      className="pl-9 bg-black/50 border-border/60 focus-visible:ring-1 focus-visible:ring-orange-500/50 h-10 text-sm"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                </GlassCard>

                <GlassCard className="p-2 space-y-1 border border-border/80 bg-black/75 max-h-[calc(100vh-300px)] overflow-y-auto custom-scrollbar">
                  {filteredSectionOrder.map((id) => {
                    const isActive = id === selectedSection;
                    const sectionIndex = sectionOrder.indexOf(id);
                    const key = `materials.section.${sectionIndex + 1}`;
                    let label = t(key);
                    if (!label || label === key) {
                      const materialForChapter = materials.find((m: Material) => m.chapter_id === id);
                      label =
                        language === 'sq'
                          ? materialForChapter?.title_sq || `Chapter ${id}`
                          : materialForChapter?.title_en || `Chapter ${id}`;
                    }
                    return (
                      <Button
                        key={id}
                        variant={isActive ? 'default' : 'ghost'}
                        className={`w-full justify-start text-sm font-medium flex items-center gap-3 rounded-lg px-3 py-6 transition-all ${
                          isActive
                            ? 'bg-orange-500/10 text-orange-200 border border-orange-500/30 shadow-[0_0_15px_rgba(249,115,22,0.1)]'
                            : 'text-muted-foreground border border-transparent hover:bg-white/5 hover:text-foreground'
                        }`}
                        onClick={() => {
                          setSelectedSection(id);
                          setSearch('');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                      >
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                          isActive ? 'bg-orange-500 text-black' : 'bg-white/10 text-muted-foreground'
                        }`}>
                          {id}
                        </div>
                        <span className="truncate text-left line-clamp-2 leading-tight">{label}</span>
                        {isActive && <ChevronRight className="w-4 h-4 ml-auto text-orange-400 flex-shrink-0" />}
                      </Button>
                    );
                  })}
                </GlassCard>
              </div>
            </aside>

            {/* Main content */}
            <main className="flex-1 min-w-0">
              <GlassCard className="p-6 md:p-10 border border-border/80 bg-black/85 min-h-[80vh]">
                <div className="flex flex-col gap-6 mb-8 pb-8 border-b border-border/40">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                        {sectionIndex >= 0 && (
                        <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-[11px] font-medium text-orange-300">
                            <span className="h-1.5 w-1.5 rounded-full bg-orange-400 animate-pulse" />
                            <span>
                            {isSq ? 'Kapitulli' : 'Chapter'} {selectedSection}
                            </span>
                        </div>
                        )}
                        <span className="text-xs text-muted-foreground">
                            ~5-10 {isSq ? 'min lexim' : 'min read'}
                        </span>
                    </div>
                    
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                      {sectionTitle}
                    </h2>
                    
                    {search ? (
                      <p className="text-sm text-muted-foreground">
                        {t('materials.resultsForPrefix')} &quot;{search}&quot; {t('materials.resultsForSuffix')}
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
                        {isSq 
                            ? 'Lexoni me kujdes materialin më poshtë. Kuptimi i këtyre koncepteve është thelbësor për të kaluar provimin.'
                            : 'Read the material carefully. Understanding these concepts is key to passing your exam.'}
                      </p>
                    )}
                  </div>
                </div>

                {/* Images for this chapter */}
                {currentImages.length > 0 && (
                  <div className="grid gap-6 mb-10 md:grid-cols-2">
                    {currentImages.map((img) => (
                      <figure
                        key={img.id}
                        className="overflow-hidden rounded-xl border border-border/60 bg-black/40 shadow-lg group"
                      >
                        <div className="overflow-hidden">
                            <img
                            src={img.image_url}
                            alt={
                                language === 'sq'
                                ? img.caption_sq || img.caption_en || sectionTitle
                                : img.caption_en || img.caption_sq || sectionTitle
                            }
                            loading="lazy"
                            className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                        </div>
                        {(img.caption_en || img.caption_sq) && (
                          <figcaption className="px-4 py-3 text-xs text-muted-foreground bg-black/60 border-t border-border/40 backdrop-blur-sm">
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
                  key={selectedSection}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-8"
                >
                  {Object.keys(currentSectionContent).length === 0 ? (
                    <div className="py-12 text-center">
                        <p className="text-muted-foreground">
                        {t('materials.noResults')}
                        </p>
                    </div>
                  ) : chapter && chapterSections.length > 0 ? (
                    <div className="space-y-8">
                      <div className="space-y-4">
                        {chapter.title && (
                          <h2 className="text-2xl font-semibold tracking-tight text-foreground/90">
                            {chapter.title}
                          </h2>
                        )}
                        {chapter.description && (
                          <p className="text-base text-muted-foreground leading-7">
                            {chapter.description}
                          </p>
                        )}
                      </div>

                      <div className="space-y-8">
                        {chapterSections.map((section, index) => {
                            const key = section.order ?? index;
                            const pointsRaw = section.points;
                            const pointsArray = Array.isArray(pointsRaw)
                            ? (pointsRaw as unknown[])
                            : typeof pointsRaw === 'string'
                                ? [pointsRaw]
                                : [];

                            return (
                            <div key={key} className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4 hover:border-white/20 transition-colors">
                                {section.title && (
                                <h3 className="text-lg font-semibold flex items-center gap-2 text-foreground/90">
                                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                                    {section.title}
                                </h3>
                                )}
                                {pointsArray.length > 0 && (
                                <ul className="space-y-3">
                                    {pointsArray.map((p, idx) => (
                                    <li key={idx} className="text-sm leading-relaxed text-muted-foreground pl-4 border-l-2 border-white/10">
                                        {typeof p === 'string' ? p : String(p)}
                                    </li>
                                    ))}
                                </ul>
                                )}
                            </div>
                            );
                        })}
                      </div>
                    </div>
                  ) : (
                    Object.entries(currentSectionContent).map(([key, value]) => (
                      <section key={key} className="space-y-4">
                        <h3 className="text-xl font-semibold capitalize flex items-center gap-2 pb-2 border-b border-border/40 text-foreground/90">
                          {key.replace(/_/g, ' ')}
                        </h3>
                        {renderValue(value)}
                      </section>
                    ))
                  )}
                </motion.div>

                {/* Bottom CTA */}
                <div className="mt-12 pt-8 border-t border-border/40 flex justify-end">
                    <Button asChild className="bg-orange-500 hover:bg-orange-600 text-black font-medium px-6">
                        <Link href="/dashboard">
                            {isSq ? 'Kthehu në Ballinë' : 'Back to Dashboard'}
                        </Link>
                    </Button>
                </div>
              </GlassCard>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
