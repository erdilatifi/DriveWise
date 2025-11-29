import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import { ArrowLeft, AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <GlassCard className="p-8 max-w-md text-center">
        <AlertCircle className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
        <h1 className="text-3xl font-bold mb-2">Page Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex gap-4">
          <Button asChild className="flex-1">
            <Link href="/decision-trainer">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Trainer
            </Link>
          </Button>
          <Button asChild variant="outline" className="flex-1">
            <Link href="/dashboard">
              Dashboard
            </Link>
          </Button>
        </div>
      </GlassCard>
    </div>
  );
}
