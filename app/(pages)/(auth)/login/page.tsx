'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { useLanguage } from '@/contexts/language-context';
import { useAuth } from '@/contexts/auth-context';
import { toast } from 'sonner';

// Lazy load Image for better performance
const Image = dynamic(() => import('next/image'), { ssr: false });

export default function LoginPage() {
  const { t } = useLanguage();
  const { signIn, user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) {
      router.push('/dashboard');
    }
  }, [user, authLoading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error: signInError } = await signIn(email, password);

    if (signInError) {
      const errorMessage = signInError.message || 'Failed to login';
      setError(errorMessage);
      
      // Only show toast for non-blocked errors (blocked errors are handled in auth context)
      if (!errorMessage.includes('blocked')) {
        toast.error('Login Failed', {
          description: errorMessage,
        });
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Premium background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      
      <Card className="w-full max-w-md relative border-primary/20 bg-card/95 backdrop-blur-xl shadow-2xl shadow-primary/10">
        <CardHeader className="text-center space-y-4">
          <div className="relative mx-auto w-20 h-20">
            <div className="absolute inset-0 bg-primary/30 blur-2xl rounded-full"></div>
            <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-primary/30 shadow-xl shadow-primary/20">
              <Image 
                src="/logo-white.png" 
                alt="DriveWise Logo" 
                width={80} 
                height={80}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">{t('auth.welcomeBack')}</CardTitle>
            <CardDescription className="text-base mt-2">
              {t('auth.signInDescription')}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">{t('auth.email')}</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">{t('auth.password')}</Label>
                <Link 
                  href="/forgot-password" 
                  className="text-xs text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <Button type="submit" className="w-full shadow-lg shadow-primary/20 h-12 text-base font-semibold" disabled={loading}>
              {loading ? t('auth.signingIn') : t('auth.signIn')}
            </Button>

            <div className="text-center text-sm pt-4">
              <span className="text-muted-foreground">{t('auth.dontHaveAccount')} </span>
              <Link href="/register" className="text-primary hover:text-primary/80 font-semibold transition-colors">
                {t('auth.signUp')}
              </Link>
            </div>

            <div className="text-center pt-2">
              <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                ← {t('auth.backToHome')}
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}