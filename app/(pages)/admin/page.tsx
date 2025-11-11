'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Navbar } from '@/components/navbar';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { FileText, Plus, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminPage() {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push('/');
    }
  }, [user, isAdmin, loading, router]);

  if (loading) {
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
    <div className="min-h-screen bg-background">
      <Navbar />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-6 py-8 max-w-7xl pt-28"
      >
        {/* Header */}
        <div className="mb-8 space-y-2">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Manage quiz questions and monitor system performance
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <GlassCard hover className="p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">All Questions</h3>
              <p className="text-sm text-muted-foreground mb-4">
                View and manage all quiz questions
              </p>
              <Button asChild className="w-full">
                <Link href="/admin/questions">View Questions</Link>
              </Button>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard hover className="p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <Plus className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Add Question</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Create a new quiz question
              </p>
              <Button asChild className="w-full">
                <Link href="/admin/questions/new">Add New</Link>
              </Button>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <GlassCard hover className="p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Statistics</h3>
              <p className="text-sm text-muted-foreground mb-4">
                View users, questions, and test metrics
              </p>
              <Button asChild className="w-full">
                <Link href="/admin/stats">View Stats</Link>
              </Button>
            </GlassCard>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
