import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import { Home, Shield } from 'lucide-react';

export default function AdminNotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <GlassCard className="p-8 max-w-lg text-center">
        <Shield className="w-20 h-20 mx-auto mb-4 text-yellow-500" />
        <h1 className="text-5xl font-bold mb-2">404</h1>
        <h2 className="text-2xl font-semibold mb-2">Admin Page Not Found</h2>
        <p className="text-muted-foreground mb-6">
          The admin page you're looking for doesn't exist.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/admin">
              <Shield className="w-4 h-4 mr-2" />
              Admin Dashboard
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/dashboard">
              <Home className="w-4 h-4 mr-2" />
              User Dashboard
            </Link>
          </Button>
        </div>
      </GlassCard>
    </div>
  );
}
