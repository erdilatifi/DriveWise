'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/language-context';
import { useAuth } from '@/contexts/auth-context';
import { useRateLimit } from '@/hooks/use-rate-limit';

export default function RegisterPage() {
  const { t } = useLanguage();
  const { signUp } = useAuth();
  const router = useRouter();
  const { checkLimit } = useRateLimit({ maxRequests: 3, windowMs: 60000 }); // Stricter limit for registration
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  type Status = 'idle' | 'loading' | 'success' | 'error';
  const [status, setStatus] = useState<Status>('idle');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!checkLimit()) {
      toast.error('Too many registration attempts', {
        description: 'Please wait a minute before trying again.',
      });
      return;
    }

    setLoading(true);
    setStatus('loading');
    setStatusMessage(null);

    if (password !== confirmPassword) {
      setStatus('error');
      setStatusMessage('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setStatus('error');
      setStatusMessage('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    const { error: signUpError } = await signUp(email, password, fullName);

    if (signUpError) {
      setStatus('error');
      setStatusMessage(signUpError.message || 'Failed to create account');
      toast.error('Registration failed', {
        description: signUpError.message || 'Failed to create account',
      });
    } else {
      setStatus('success');
      setStatusMessage(
        `Your account has been created. We've sent a confirmation link to ${email}. Please open that email and click the link to activate your account, then come back here and sign in. If you don't see it, check your spam or junk folder.`,
      );
      toast.success('Account created!', {
        description: 'Please check your email and confirm your account before logging in.',
      });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-10 relative overflow-hidden">
      {/* Premium background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />
      <div className="pointer-events-none absolute -top-40 right-0 w-[420px] h-[420px] bg-primary/15 rounded-full blur-3xl opacity-80" />
      <div className="pointer-events-none absolute -bottom-40 left-0 w-[420px] h-[420px] bg-primary/5 rounded-full blur-3xl opacity-80" />
      <div className="pointer-events-none absolute inset-x-10 top-40 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-60" />

      <div className="relative z-10 w-full max-w-5xl grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] items-center">
        {/* Left: benefits / bullet points */}
        <div className="hidden lg:flex flex-col gap-6 text-sm text-muted-foreground">
          <div className="space-y-2">
            <p className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-black/60 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              <span className="h-1.5 w-6 bg-gradient-to-r from-orange-500 to-amber-300 rounded-full" />
              Create your DriveWise account
            </p>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
              Built for focused, exam-ready practice.
            </h1>
            <p className="text-sm text-muted-foreground max-w-md">
              Personalised tests, decision trainer scenarios, and rich analytics help you understand exactly what to study next.
            </p>
          </div>

          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span>Track pass rate, weak topics, and streak in a clear dashboard.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-orange-400" />
              <span>Practice with mixed and personalised tests that feel like the real exam.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-sky-400" />
              <span>Review every answer with explanations and materials links.</span>
            </li>
          </ul>
        </div>

        {/* Right: register card */}
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
                {t('auth.createAccount')}
              </CardTitle>
              <CardDescription className="text-base mt-2">
                {t('auth.createAccountDescription')}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4" autoComplete="on">
              {status !== 'idle' && statusMessage && (
                <div
                  className={`p-3 rounded-md border text-sm ${{
                    success: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/40',
                    error: 'bg-destructive/10 text-destructive border-destructive/40',
                    loading: 'bg-muted/10 text-muted-foreground border-border/60',
                    idle: '',
                  }[status]}`}
                >
                  {statusMessage}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="fullName">{t('auth.fullName')}</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  disabled={loading || status === 'success'}
                  autoComplete="name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">{t('auth.email')}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading || status === 'success'}
                  autoComplete="email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{t('auth.password')}</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading || status === 'success'}
                  autoComplete="new-password"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{t('auth.confirmPassword')}</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading || status === 'success'}
                  autoComplete="new-password"
                />
              </div>

              <Button
                type="submit"
                className="w-full shadow-lg shadow-primary/20 h-12 text-base font-semibold"
                disabled={loading || status === 'success'}
              >
                {status === 'success'
                  ? 'Check your email'
                  : loading
                  ? t('auth.creatingAccount')
                  : t('auth.signUp')}
              </Button>

              <div className="text-center text-sm pt-4">
                <span className="text-muted-foreground">{t('auth.alreadyHaveAccount')} </span>
                <Link
                  href="/login"
                  className="text-primary hover:text-primary/80 font-semibold transition-colors"
                >
                  {t('auth.signIn')}
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

