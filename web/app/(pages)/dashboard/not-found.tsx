import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import { Home, ArrowLeft } from 'lucide-react';

export default function DashboardNotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <GlassCard className="p-8 max-w-lg text-center">
        <div className="text-6xl mb-4">🚗</div>
        <h1 className="text-5xl font-bold mb-2">404</h1>
        <h2 className="text-2xl font-semibold mb-2">Wrong Turn!</h2>
        <p className="text-muted-foreground mb-6">
          You don&apos;t have access to the dashboard.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/dashboard">
              <Home className="w-4 h-4 mr-2" />
              Dashboard Home
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Main Page
            </Link>
          </Button>
        </div>
      </GlassCard>
    </div>
  );
}
