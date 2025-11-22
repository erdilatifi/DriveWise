'use client';

import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
       <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-emerald-500/10 via-transparent to-transparent" />
      <Navbar />
      <div className="pt-32 pb-16 container mx-auto px-4 flex items-center justify-center min-h-[80vh]">
        <GlassCard className="p-8 md:p-10 border border-border/80 bg-black/85 max-w-md w-full text-center">
          <div className="mx-auto w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 border border-emerald-500/20">
            <CheckCircle className="w-8 h-8 text-emerald-500" />
          </div>
          
          <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
          <p className="text-muted-foreground mb-8">
            Thank you for your purchase. Your premium features are now active.
          </p>

          <Button asChild className="w-full" size="lg">
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        </GlassCard>
      </div>
    </div>
  );
}
