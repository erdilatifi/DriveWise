'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PasswordInput } from '@/components/ui/password-input';
import { PasswordStrength } from '@/components/ui/password-strength';
import { Label } from '@/components/ui/label';
import { createClient } from '@/utils/supabase/client';
import { toast } from 'sonner';
import { AlertCircle, ShieldCheck } from 'lucide-react';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const supabase = createClient();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate passwords
    if (password.length < 6) {
      setError('Fjalëkalimi duhet të ketë të paktën 6 karaktere');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Fjalëkalimet nuk përputhen');
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.updateUser({
        password: password,
      });

      console.log('Password update response:', { data, error });

      if (error) {
        console.error('Password update error:', error);
        throw error;
      }

      toast.success('Fjalëkalimi u përditësua', {
        description: 'Fjalëkalimi juaj u rivendos me sukses. Duke ju çuar te paneli...',
        duration: 2500,
      });

      // Redirect to dashboard shortly after showing the toast
      setTimeout(() => {
        router.replace('/dashboard');
        router.refresh();
      }, 800);
    } catch (error: unknown) {
      console.error('Caught error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Dështoi rivendosja e fjalëkalimit';
      setError(errorMessage);
      toast.error('Gabim', {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-10 relative overflow-hidden">
      {/* Premium background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />
      <div className="pointer-events-none absolute -top-40 right-0 w-[420px] h-[420px] bg-primary/15 rounded-full blur-3xl opacity-80" />
      <div className="pointer-events-none absolute -bottom-40 left-0 w-[420px] h-[420px] bg-primary/5 rounded-full blur-3xl opacity-80" />
      <div className="pointer-events-none absolute inset-x-10 top-40 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-60" />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <Card className="relative border border-border/80 bg-black/80 backdrop-blur-xl shadow-2xl shadow-primary/10">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-border/60 bg-black/60 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              <span className="h-1.5 w-6 bg-gradient-to-r from-orange-500 to-amber-300 rounded-full" />
              Siguria e Llogarisë
            </div>
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
              <div className="absolute -bottom-1.5 -right-1.5 flex h-7 w-7 items-center justify-center rounded-full border-2 border-background bg-black shadow-lg">
                <ShieldCheck className="w-3.5 h-3.5 text-primary" />
              </div>
            </div>
            <div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Rivendos Fjalëkalimin
              </CardTitle>
              <CardDescription className="text-base mt-2">
                Shkruani fjalëkalimin tuaj të ri më poshtë
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleResetPassword} className="space-y-4">
              {error && (
                <div className="flex items-start gap-2 p-3 rounded-md bg-destructive/10 text-destructive text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="password">Fjalëkalimi i Ri</Label>
                <PasswordInput
                  id="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  minLength={6}
                  autoComplete="new-password"
                />
                <PasswordStrength password={password} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Konfirmo Fjalëkalimin e Ri</Label>
                <PasswordInput
                  id="confirmPassword"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                  minLength={6}
                  autoComplete="new-password"
                />
              </div>

              <Button
                type="submit"
                className="w-full shadow-lg shadow-primary/20 h-12 text-base font-semibold"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Duke rivendosur...
                  </>
                ) : (
                  'Rivendos Fjalëkalimin'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
