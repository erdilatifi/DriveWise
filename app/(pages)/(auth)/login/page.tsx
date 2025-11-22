'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { useLanguage } from '@/contexts/language-context';
import { useAuth } from '@/contexts/auth-context';
import { toast } from 'sonner';
import { createClient } from '@/utils/supabase/client';
import { useRateLimit } from '@/hooks/use-rate-limit';

export default function LoginPage() {
  const { t } = useLanguage();
  const { signIn, user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { checkLimit } = useRateLimit({ maxRequests: 5, windowMs: 60000 });

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const isBusy = submitting || authLoading;

  // If already logged in, redirect away from login page
  useEffect(() => {
    if (authLoading) return;

    let fromEmailConfirm = false;

    if (typeof window !== 'undefined') {
      const search = window.location.search;
      const hash = window.location.hash || '';
      const params = new URLSearchParams(search);
      const type = params.get('type');
      const hasCode = params.has('code');

      // Supabase email confirmation / magic link usually includes type=signup
      // and/or access_token in the hash fragment.
      if (type === 'signup' || hash.includes('access_token=') || hasCode) {
        fromEmailConfirm = true;
      }
    }

    if (fromEmailConfirm) {
      // User arrived from email confirmation link: ensure any auto-created
      // session is fully cleared so they can log in manually.
      const supabase = createClient();
      supabase.auth.signOut().catch((err) => {
        console.error('Error clearing session after email confirm:', err);
      });

      // Clean the URL to plain /login so this effect doesn't re-trigger
      // with the same code/hash parameters.
      router.replace('/login');
      return;
    }

    // Normal case: if user is already logged in and this is not an email-confirm
    // callback, redirect them to the dashboard.
    if (user) {
      router.replace('/dashboard');
    }
  }, [authLoading, user, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isBusy) return;

    if (!checkLimit()) {
      toast.error('Too many login attempts', {
        description: 'Please wait a minute before trying again.',
      });
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const { error: signInError } = await signIn(email, password);

      if (signInError) {
        const errorMessage = signInError.message || 'Failed to login';
        setError(errorMessage);

        if (!errorMessage.toLowerCase().includes('blocked')) {
          toast.error('Login Failed', {
            description: errorMessage,
          });
        }

        setSubmitting(false);
        return;
      }

      toast.success('Login successful!');
      // Do NOT setSubmitting(false) here. Keep it true while we redirect.
      // This prevents the user from clicking again during the navigation.
      router.push('/dashboard');
    } catch (err) {
      console.error('Unexpected error during login:', err);
      const message =
        err instanceof Error ? err.message : 'Unexpected error. Please try again.';
      setError(message);
      toast.error('Login Failed', {
        description: message,
      });
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-10 relative overflow-hidden">
      {/* Premium background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />
      <div className="pointer-events-none absolute -top-40 right-0 w-[420px] h-[420px] bg-primary/15 rounded-full blur-3xl opacity-80" />
      <div className="pointer-events-none absolute -bottom-40 left-0 w-[420px] h-[420px] bg-primary/5 rounded-full blur-3xl opacity-80" />
      <div className="pointer-events-none absolute inset-x-10 top-40 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-60" />

      <div className="relative z-10 w-full max-w-5xl grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] items-center">
        {/* Left: benefits / snapshot */}
        <div className="hidden lg:flex flex-col gap-6 text-sm text-muted-foreground">
          <div className="space-y-2">
            <p className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-black/60 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              <span className="h-1.5 w-6 bg-gradient-to-r from-orange-500 to-amber-300 rounded-full" />
              DriveWise Dashboard
            </p>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
              Log in and pick up exactly where you left off.
            </h1>
            <p className="text-sm text-muted-foreground max-w-md">
              See your latest scores, weak topics, and streak in one clean view inspired by exam
              dashboards and modern analytics tools.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-3 text-xs">
            <div className="rounded-xl border border-border/70 bg-black/70 px-3 py-3 flex flex-col gap-1">
              <span className="text-[11px] text-muted-foreground">Weekly progress</span>
              <span className="text-lg font-semibold text-foreground">86%</span>
              <div className="mt-1 h-1.5 rounded-full bg-orange-500/10 overflow-hidden">
                <div className="h-full w-4/5 bg-gradient-to-r from-orange-500 to-amber-300" />
              </div>
              <span className="text-[11px] text-muted-foreground mt-1">+12% vs last week</span>
            </div>
            <div className="rounded-xl border border-border/70 bg-black/70 px-3 py-3 flex flex-col gap-1">
              <span className="text-[11px] text-muted-foreground">Tests completed</span>
              <span className="text-lg font-semibold text-foreground">42</span>
              <div className="mt-1 h-1.5 rounded-full bg-orange-500/10 overflow-hidden">
                <div className="h-full w-2/3 bg-gradient-to-r from-orange-500 to-amber-300" />
              </div>
              <span className="text-[11px] text-muted-foreground mt-1">History saved forever</span>
            </div>
            <div className="rounded-xl border border-border/70 bg-black/70 px-3 py-3 flex flex-col gap-1">
              <span className="text-[11px] text-muted-foreground">Daily streak</span>
              <span className="text-lg font-semibold text-foreground">7 days</span>
              <div className="mt-1 h-1.5 rounded-full bg-emerald-500/10 overflow-hidden">
                <div className="h-full w-3/4 bg-gradient-to-r from-emerald-500 to-emerald-300" />
              </div>
              <span className="text-[11px] text-muted-foreground mt-1">Keep it going</span>
            </div>
          </div>
        </div>

        {/* Right: login card */}
        <Card className="w-full max-w-md justify-self-center relative border border-border/80 bg-black/80 backdrop-blur-xl shadow-2xl shadow-primary/10">
          <CardHeader className="text-center space-y-4">
            <div className="relative mx-auto w-20 h-20">
              <div className="absolute inset-0 bg-primary/30 blur-2xl rounded-full" />
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
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                {t('auth.welcomeBack')}
              </CardTitle>
              <CardDescription className="text-base mt-2">
                {t('auth.signInDescription')}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4" autoComplete="on">
              {error && (
                <div
                  className="p-3 rounded-md bg-destructive/10 text-destructive text-sm"
                  aria-live="polite"
                >
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
                  disabled={isBusy}
                  autoComplete="email"
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
                  disabled={isBusy}
                  autoComplete="current-password"
                />
              </div>

              <Button
                type="submit"
                className="w-full shadow-lg shadow-primary/20 h-12 text-base font-semibold"
                disabled={isBusy}
                aria-busy={isBusy}
              >
                {isBusy ? t('auth.signingIn') : t('auth.signIn')}
              </Button>

              <div className="text-center text-sm pt-4">
                <span className="text-muted-foreground">{t('auth.dontHaveAccount')} </span>
                <Link
                  href="/register"
                  className="text-primary hover:text-primary/80 font-semibold transition-colors"
                >
                  {t('auth.signUp')}
                </Link>
              </div>

              <div className="text-center pt-2">
                <Link
                  href="/"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  ← {t('auth.backToHome')}
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
