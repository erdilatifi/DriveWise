'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { useAuth } from '@/contexts/auth-context';
import { toast } from 'sonner';

import { useRateLimit } from '@/hooks/use-rate-limit';

// Lazy load Image component for better performance
const Image = dynamic(() => import('next/image'), { ssr: false });

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const { checkLimit } = useRateLimit({ maxRequests: 3, windowMs: 60000 }); // Limit: 3 requests per minute
  const supabase = createClient();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) {
      router.push('/dashboard');
    }
  }, [authLoading, user, router]);

  // Cooldown timer
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if still in cooldown
    if (cooldown > 0) {
      toast.error('Ju lutem prisni', {
        description: `Mund të kërkoni një link tjetër rivendosjeje pas ${cooldown} sekondash.`,
      });
      return;
    }

    if (!checkLimit()) {
      toast.error('Shumë kërkesa', {
        description: 'Ju lutem prisni një minutë para se të provoni përsëri.',
      });
      return;
    }

    setLoading(true);

    try {
      const redirectUrl = `${window.location.origin}/reset-password`;
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });

      if (error) {
        console.error('Reset password error:', error);
        
        // Check if it's a rate limit error
        if (error.message.includes('seconds') || error.message.includes('request this after')) {
          // Extract seconds from error message if possible
          const match = error.message.match(/(\d+)\s*seconds?/);
          const seconds = match ? parseInt(match[1]) : 60;
          
          setCooldown(seconds);
          toast.error('Kufizim kërkesash', {
            description: `Ju lutem prisni ${seconds} sekonda para se të kërkoni një link tjetër rivendosjeje.`,
            duration: 5000,
          });
        } else {
          throw error;
        }
        return;
      }

      // Set cooldown after successful send (60 seconds)
      setCooldown(60);
      setSent(true);
      toast.success('Linku u dërgua', {
        description: 'Kontrolloni email-in tuaj për linkun e rivendosjes së fjalëkalimit. Nëse nuk e shihni, kontrolloni dosjen e spam-it.',
        duration: 5000,
      });
    } catch (error: unknown) {
      console.error('Caught error:', error);
      const message = error instanceof Error ? error.message : 'Gabim i panjohur';
      toast.error('Gabim', {
        description: message || 'Dështoi dërgimi i email-it. Ju lutem provoni përsëri.',
      });
    } finally {
      setLoading(false);
    }
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
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Keni harruar fjalëkalimin?
            </CardTitle>
            <CardDescription className="text-base mt-2">
              {sent
                ? "Ju kemi dërguar një link rivendosjeje"
                : "Shkruani email-in tuaj për të marrë një link rivendosjeje fjalëkalimi"
              }
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {sent ? (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                <p className="text-sm text-green-500">
                  Kontrolloni kutinë tuaj postare për linkun e rivendosjes së fjalëkalimit. Nëse nuk e shihni, kontrolloni dosjen e spam-it.
                </p>
              </div>
              <Button asChild className="w-full" variant="outline">
                <Link href="/login">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Kthehu te Hyrja
                </Link>
              </Button>
            </div>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Adresa e Email-it</Label>
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

              <Button 
                type="submit" 
                className="w-full shadow-lg shadow-primary/20" 
                disabled={loading || cooldown > 0}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Duke dërguar...
                  </>
                ) : cooldown > 0 ? (
                  `Prisni ${cooldown}s`
                ) : (
                  'Dërgo Linkun e Rivendosjes'
                )}
              </Button>

              {cooldown > 0 && (
                <p className="text-xs text-center text-muted-foreground">
                  Mund të kërkoni një link tjetër rivendosjeje pas {cooldown} sekondash
                </p>
              )}

              <Button asChild className="w-full" variant="outline">
                <Link href="/login">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Kthehu te Hyrja
                </Link>
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
