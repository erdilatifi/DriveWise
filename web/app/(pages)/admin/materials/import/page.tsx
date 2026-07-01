'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { GlassCard } from '@/components/ui/glass-card';
import { useAuth } from '@/contexts/auth-context';

export default function ImportMaterialsPage() {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push('/');
    }
  }, [user, isAdmin, loading, router]);

  if (loading || !user || !isAdmin) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">{loading ? 'Duke ngarkuar...' : 'Duke u autentikuar...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="pt-28">
        <div className="container mx-auto px-4 py-10 max-w-3xl">
          <GlassCard className="p-6 space-y-4 border border-border/80 bg-black/80">
            <div>
              <h1 className="text-2xl font-bold mb-1">Importimi i Materialeve Mësimore</h1>
              <p className="text-sm text-muted-foreground">
                Përmbajtja e ngurtësuar (hardcoded) e materialeve mësimore është hequr nga pjesa e klientit (frontend).
                Për të mbjellë (seed) ose përditësuar <code>study_materials</code>, përdorni skriptin tuaj SQL të migrimit
                (për shembull <code>2025-11-16_seed_study_materials.sql</code>) direkt në SQL editor-in e Supabase.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Kjo faqe tani është vetëm informuese dhe mund të hiqet pasi baza e të dhënave të jetë mbjellë.
              </p>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
