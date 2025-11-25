'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { useLanguage } from '@/contexts/language-context';
import { Navbar } from '@/components/navbar';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { FileText, Plus, BarChart3, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminPage() {
  const { user, isAdmin, loading } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push('/');
    }
  }, [user, isAdmin, loading, router]);

  if (loading || !user || !isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">
            {loading ? 'Loading...' : 'Authenticating...'}
          </p>
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
        {/* Header */}
        <div className="mb-8 space-y-2">
          <h1 className="text-3xl font-bold">{t('admin.dashboardTitle')}</h1>
          <p className="text-sm text-muted-foreground">
            {t('admin.dashboardSubtitle')}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <GlassCard hover className="h-full flex flex-col p-6 border border-border/80 bg-black/80">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{t('admin.allQuestions')}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {t('admin.allQuestionsDesc')}
              </p>
              <Button asChild className="w-full">
                <Link href="/admin/questions">{t('admin.viewQuestions')}</Link>
              </Button>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <GlassCard hover className="h-full flex flex-col p-6 border border-border/80 bg-black/80">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <div className="flex -space-x-2">
                  <div className="w-6 h-6 rounded-full bg-primary/20 border-2 border-black flex items-center justify-center">
                    <span className="text-[10px] font-bold text-primary">U</span>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-primary/20 border-2 border-black flex items-center justify-center">
                    <span className="text-[10px] font-bold text-primary">M</span>
                  </div>
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">{t('admin.users')}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {t('admin.usersDesc')}
              </p>
              <Button asChild className="w-full">
                <Link href="/admin/users">{t('admin.manageUsers')}</Link>
              </Button>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard hover className="h-full flex flex-col p-6 border border-border/80 bg-black/80">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <Plus className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{t('admin.addQuestion')}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {t('admin.addQuestionDesc')}
              </p>
              <Button asChild className="w-full">
                <Link href="/admin/questions/new">{t('admin.addNew')}</Link>
              </Button>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <GlassCard hover className="h-full flex flex-col p-6 border border-border/80 bg-black/80">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{t('admin.stats')}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {t('admin.statsDesc')}
              </p>
              <Button asChild className="w-full">
                <Link href="/admin/stats">{t('admin.viewStats')}</Link>
              </Button>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <GlassCard hover className="h-full flex flex-col p-6 border border-border/80 bg-black/80">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{t('admin.subscriptions')}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {t('admin.subscriptionsDesc')}
              </p>
              <Button asChild className="w-full">
                <Link href="/admin/subscriptions">{t('admin.manageSubscriptions')}</Link>
              </Button>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <GlassCard hover className="h-full flex flex-col p-6 border border-border/80 bg-black/80">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{t('admin.decisionTrainer')}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {t('admin.decisionTrainerDesc')}
              </p>
              <Button asChild className="w-full">
                <Link href="/admin/scenarios">{t('admin.manageScenarios')}</Link>
              </Button>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <GlassCard hover className="h-full flex flex-col p-6 border border-border/80 bg-black/80">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{t('admin.studyMaterials')}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {t('admin.studyMaterialsDesc')}
              </p>
              <Button asChild className="w-full">
                <Link href="/admin/materials">{t('admin.manageMaterials')}</Link>
              </Button>
            </GlassCard>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
