'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { IconInput } from '@/components/ui/icon-input';
import { PasswordInput } from '@/components/ui/password-input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { AlertCircle, ArrowLeft, Mail, TrendingUp, Flame, ListChecks } from 'lucide-react';
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

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isBusy) return;

    if (!checkLimit()) {
      toast.error('Shumë tentativa hyrjeje', {
        description: 'Ju lutem prisni një minutë para se të provoni përsëri.',
      });
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const { error: signInError } = await signIn(email, password);

      if (signInError) {
        const errorMessage = signInError.message || 'Hyrja dështoi';
        setError(errorMessage);

        if (!errorMessage.toLowerCase().includes('blocked')) {
          toast.error('Hyrja dështoi', {
            description: errorMessage,
          });
        }

        setSubmitting(false);
        return;
      }

      toast.success('Hyrja u krye me sukses!');

      // Refresh the router to ensure middleware/server components see the new session cookie
      router.refresh();

      // Do NOT setSubmitting(false) here. Keep it true while we redirect.
      router.push('/dashboard');
    } catch (err) {
      console.error('Unexpected error during login:', err);
      const message =
        err instanceof Error ? err.message : 'Gabim i papritur. Ju lutem provoni përsëri.';
      setError(message);
      toast.error('Hyrja dështoi', {
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
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden lg:flex flex-col gap-6 text-sm text-muted-foreground"
        >
          <div className="space-y-2">
            <p className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-black/60 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              <span className="h-1.5 w-6 bg-gradient-to-r from-orange-500 to-amber-300 rounded-full" />
              Paneli DriveWise
            </p>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
              Hyni dhe vazhdoni saktësisht aty ku e latë.
            </h1>
            <p className="text-sm text-muted-foreground max-w-md">
              Shikoni rezultatet e fundit, temat e dobëta dhe serinë tuaj në një pamje të pastër, e frymëzuar nga panelet e provimeve dhe mjetet moderne të analitikës.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-3 text-xs">
            <div className="rounded-xl border border-border/70 bg-black/70 px-3 py-3 flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <TrendingUp className="w-3 h-3 text-orange-400" />
                <span>Përparimi javor</span>
              </div>
              <span className="text-lg font-semibold text-foreground">86%</span>
              <div className="mt-1 h-1.5 rounded-full bg-orange-500/10 overflow-hidden">
                <div className="h-full w-4/5 bg-gradient-to-r from-orange-500 to-amber-300" />
              </div>
              <span className="text-[11px] text-muted-foreground mt-1">+12% krahasuar me javën e kaluar</span>
            </div>
            <div className="rounded-xl border border-border/70 bg-black/70 px-3 py-3 flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <ListChecks className="w-3 h-3 text-orange-400" />
                <span>Teste të përfunduara</span>
              </div>
              <span className="text-lg font-semibold text-foreground">42</span>
              <div className="mt-1 h-1.5 rounded-full bg-orange-500/10 overflow-hidden">
                <div className="h-full w-2/3 bg-gradient-to-r from-orange-500 to-amber-300" />
              </div>
              <span className="text-[11px] text-muted-foreground mt-1">Historia ruhet përgjithmonë</span>
            </div>
            <div className="rounded-xl border border-border/70 bg-black/70 px-3 py-3 flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <Flame className="w-3 h-3 text-emerald-400" />
                <span>Seria ditore</span>
              </div>
              <span className="text-lg font-semibold text-foreground">7 ditë</span>
              <div className="mt-1 h-1.5 rounded-full bg-emerald-500/10 overflow-hidden">
                <div className="h-full w-3/4 bg-gradient-to-r from-emerald-500 to-emerald-300" />
              </div>
              <span className="text-[11px] text-muted-foreground mt-1">Vazhdo kështu</span>
            </div>
          </div>
        </motion.div>

        {/* Right: login card */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md justify-self-center"
        >
        <Card className="relative border border-border/80 bg-black/80 backdrop-blur-xl shadow-2xl shadow-primary/10">
          <CardHeader className="text-center space-y-4">
            <div className="relative mx-auto w-20 h-20">
              <div className="absolute inset-0 bg-primary/30 blur-2xl rounded-full animate-pulse" />
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
                  className="flex items-start gap-2 p-3 rounded-md bg-destructive/10 text-destructive text-sm"
                  aria-live="polite"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">{t('auth.email')}</Label>
                <IconInput
                  id="email"
                  type="email"
                  icon={<Mail />}
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
                    Keni harruar fjalëkalimin?
                  </Link>
                </div>
                <PasswordInput
                  id="password"
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
                  className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  {t('auth.backToHome')}
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
        </motion.div>
      </div>
    </div>
  );
}
