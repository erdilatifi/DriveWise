'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/language-context';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useLanguage();

  useEffect(() => {
    // Log error for debugging (only in console, never show to user)
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <GlassCard className="p-8 max-w-lg text-center">
        <AlertCircle className="w-20 h-20 mx-auto mb-4 text-red-500" />
        <h1 className="text-3xl font-bold mb-2">{t('error.title')}</h1>
        <p className="text-muted-foreground mb-6">
          {t('error.message')}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={reset} size="lg">
            <RefreshCw className="w-4 h-4 mr-2" />
            {t('error.tryAgain')}
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/dashboard">
              <Home className="w-4 h-4 mr-2" />
              {t('error.goToDashboard')}
            </Link>
          </Button>
        </div>
        
        <div className="mt-6 pt-6 border-t border-border">
          <p className="text-sm text-muted-foreground mb-2">
            {t('error.needHelp')}
          </p>
          <p className="text-xs text-muted-foreground">
            {t('error.contactSupport')}
          </p>
        </div>
      </GlassCard>
    </div>
  );
}
