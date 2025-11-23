'use client';

import { useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { CATEGORY_INFO, type LicenseCategory } from '@/types/database';
import { useAuth } from '@/contexts/auth-context';
import { useLanguage } from '@/contexts/language-context';
import { useUserPlans, useGlobalPremium } from '@/hooks/use-subscriptions';
import { BILLING_CONFIG, type PaidPlanTier } from '@/lib/subscriptions';
import { createClient } from '@/utils/supabase/client';
import { AlertTriangle, Trash2, User, Shield, CreditCard, Settings, LogOut, Check } from 'lucide-react';
import { toast } from 'sonner';

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading: authLoading, isAdmin, userProfile, refreshUser, signOut } = useAuth();
  const { t, language } = useLanguage();
  const isSq = language === 'sq';
  const [fullNameInput, setFullNameInput] = useState(
    userProfile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || '',
  );
  const [savingName, setSavingName] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [deleteConfirmInput, setDeleteConfirmInput] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [authLoading, user, router]);

  const { data: plans } = useUserPlans(user?.id || undefined);
  const { hasAnyActivePlan } = useGlobalPremium(user?.id, isAdmin);
  const paidPlans = useMemo(() => {
    return (plans || []).filter((p) => p.plan_tier && p.plan_tier !== 'FREE');
  }, [plans]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-28 md:pt-32 pb-12">
          <div className="container mx-auto px-4 max-w-5xl space-y-6">
            <GlassCard className="p-6 md:p-7 h-32 border border-border/80 bg-black/85 flex items-center justify-between">
               <div className="space-y-2">
                 <Skeleton className="h-4 w-32" />
                 <Skeleton className="h-8 w-48" />
                 <Skeleton className="h-3 w-40" />
               </div>
               <Skeleton className="h-8 w-24" />
            </GlassCard>
            <GlassCard className="p-6 md:p-7 h-64 border border-border/80 bg-black/85">
               <div className="mb-6 space-y-2">
                 <Skeleton className="h-5 w-40" />
                 <Skeleton className="h-3 w-64" />
               </div>
               <div className="grid gap-4 md:grid-cols-2">
                 <Skeleton className="h-10 w-full" />
                 <Skeleton className="h-10 w-full" />
               </div>
            </GlassCard>
          </div>
        </div>
      </div>
    );
  }

  const displayName =
    userProfile?.full_name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
  const email = user.email || userProfile?.email || '';

  const supabase = createClient();

  const handleSaveName = async () => {
    if (!user) return;
    const trimmed = fullNameInput.trim();
    if (!trimmed) {
      toast.error('Name cannot be empty');
      return;
    }

    setSavingName(true);
    try {
      const { error: profileError } = await supabase
        .from('user_profiles')
        .update({ full_name: trimmed })
        .eq('id', user.id);

      if (profileError) {
        throw profileError;
      }

      const { error: authError } = await supabase.auth.updateUser({
        data: { full_name: trimmed },
      });

      if (authError) {
        throw authError;
      }

      await refreshUser();

      toast.success('Name updated', {
        description: 'Your display name has been updated successfully.',
      });
    } catch (error: unknown) {
      const description = error instanceof Error ? error.message : 'Please try again later.';
      toast.error('Could not update name.', { description });
    } finally {
      setSavingName(false);
    }
  };

  const handleConfirmDeleteAccount = async () => {
    if (!user) return;
    setDeletingAccount(true);
    try {
      const response = await fetch('/api/account/delete', {
        method: 'DELETE',
      });

      if (!response.ok) {
        let description = 'Please try again later.';
        try {
          const body = await response.json();
          if (body?.error) {
            description = body.error;
          }
        } catch {
          // ignore JSON parse errors
        }
        throw new Error(description);
      }

      toast.success('Account deleted', {
        description: 'Your account and all associated data have been deleted.',
      });

      setDeleteDialogOpen(false);

      await signOut();
    } catch (error: unknown) {
      const description = error instanceof Error ? error.message : 'Please try again later.';
      toast.error('Could not delete account.', { description });
    } finally {
      setDeletingAccount(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-hidden">
      {/* Background grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(60%_60%_at_50%_20%,#000_20%,transparent_70%)]"
      >
        <svg className="h-full w-full opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="profile-grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M32 0H0V32" fill="none" stroke="currentColor" strokeWidth="0.4" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#profile-grid)" />
        </svg>
      </div>

      {/* Warm glows & rails */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-orange-500/25 via-transparent to-transparent blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="hidden lg:block absolute top-24 bottom-24 left-[10%] w-px bg-gradient-to-b from-transparent via-orange-500/25 to-transparent" />
        <div className="hidden lg:block absolute top-24 bottom-24 right-[10%] w-px bg-gradient-to-b from-transparent via-orange-500/25 to-transparent" />
      </div>

      <Navbar />

      <div className="pt-28 md:pt-32 pb-12">
        <div className="container mx-auto px-4 max-w-5xl relative">
          {/* Header */}
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/40 bg-orange-500/10 px-3 py-1 text-[11px] font-medium text-orange-300 mb-4">
              <Settings className="w-3.5 h-3.5" />
              <span>{t('profile.title') || 'Account & Settings'}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
              {isSq ? 'Menaxho llogarinë' : 'Manage your account'}
            </h1>
            <p className="text-sm md:text-base text-muted-foreground mt-2 max-w-xl">
              {isSq 
                ? 'Menaxho profilin, planet aktive dhe sigurinë e llogarisë.' 
                : 'Manage your profile, active plans, and account security.'}
            </p>
          </div>

          <div className="grid gap-8">
            {/* Profile Summary Card */}
            <GlassCard className="p-6 md:p-8 border border-border/80 bg-black/85 relative overflow-hidden">
              <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-orange-500/10 blur-3xl opacity-60" />
              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500/20 to-black border border-orange-500/30 flex items-center justify-center">
                    <User className="w-8 h-8 text-orange-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold tracking-tight">{displayName}</h2>
                    <p className="text-sm text-muted-foreground">{email}</p>
                    {!isAdmin && (
                      <div className="flex items-center gap-2 mt-2">
                        {hasAnyActivePlan ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-medium text-emerald-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            {isSq ? 'Plan aktiv' : 'Active plan'}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-medium text-muted-foreground">
                            <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
                            {isSq ? 'Plan falas' : 'Free plan'}
                          </span>
                        )}
                      </div>
                    )}
                    {isAdmin && (
                      <p className="mt-2 text-xs text-orange-300 font-medium">
                        {t('profile.adminUnlimited') || 'Admin Access: Unlimited'}
                      </p>
                    )}
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full md:w-auto border-white/10 hover:bg-white/5 hover:text-red-400 hover:border-red-500/30 transition-colors"
                  onClick={() => signOut()}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  {isSq ? 'Dil nga llogaria' : 'Log out'}
                </Button>
              </div>
            </GlassCard>

            {/* Settings Grid */}
            <div className="grid gap-8 md:grid-cols-2">
              {/* Personal Info */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b border-white/10">
                  <User className="w-4 h-4 text-orange-400" />
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    {t('profile.accountSettingsTitle')}
                  </h2>
                </div>
                
                <GlassCard className="p-6 border border-border/80 bg-black/80">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="full-name" className="text-xs text-muted-foreground">
                        {t('profile.displayNameLabel')}
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          id="full-name"
                          value={fullNameInput}
                          onChange={(e) => setFullNameInput(e.target.value)}
                          className="text-sm bg-black/50 border-border/60 focus:ring-orange-500/50"
                        />
                        <Button
                          size="sm"
                          type="button"
                          onClick={handleSaveName}
                          disabled={savingName || !fullNameInput.trim() || fullNameInput.trim() === displayName}
                          className="whitespace-nowrap bg-white/10 hover:bg-white/20 border-transparent text-foreground"
                        >
                          {savingName ? 'Saving...' : isSq ? 'Ruaj' : 'Save'}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="account-email" className="text-xs text-muted-foreground">
                        {t('profile.emailLabel')}
                      </Label>
                      <Input 
                        id="account-email" 
                        value={email} 
                        disabled 
                        className="text-sm bg-white/5 border-transparent text-muted-foreground" 
                      />
                      <p className="text-[10px] text-muted-foreground/60">
                        {t('profile.emailHelp')}
                      </p>
                    </div>
                  </div>
                </GlassCard>
              </div>

              {/* Subscription Info */}
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-orange-400" />
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                      {t('plans.profilePaidPlansTitle') || 'Active Plans'}
                    </h2>
                  </div>
                  {!isAdmin && paidPlans.length > 0 && (
                    <Link 
                      href="/pricing" 
                      className="text-xs text-orange-400 hover:text-orange-300 transition-colors"
                    >
                      {isSq ? 'Zgjero planet' : 'Extend plans'} →
                    </Link>
                  )}
                </div>

                <GlassCard className="p-6 border border-border/80 bg-black/80 min-h-[200px]">
                  {paidPlans.length === 0 && !isAdmin ? (
                    <div className="flex flex-col items-center justify-center h-full py-8 text-center space-y-4">
                      <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-muted-foreground/50" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{isSq ? 'Asnjë plan aktiv' : 'No active plans'}</p>
                        <p className="text-xs text-muted-foreground max-w-[200px] mx-auto">
                          {isSq 
                            ? 'Fillo një plan për të hapur të gjitha veçoritë.'
                            : 'Start a plan to unlock all premium features.'}
                        </p>
                      </div>
                      <Button size="sm" asChild className="bg-orange-600 hover:bg-orange-500 text-white border-none">
                        <Link href="/pricing">{t('plans.profileExtendViaPricingCta') || 'View Pricing'}</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {paidPlans.map((plan) => {
                        const category = (plan.category as LicenseCategory) || 'B';
                        const info = CATEGORY_INFO[category];
                        const startDate = plan.start_date ? new Date(plan.start_date) : null;
                        const endDate = plan.end_date ? new Date(plan.end_date) : null;
                        const now = new Date();

                        let progressPct = 0;
                        let remainingDays: number | null = null;
                        if (startDate && endDate) {
                          const totalMs = endDate.getTime() - startDate.getTime();
                          const usedMs = Math.min(Math.max(now.getTime() - startDate.getTime(), 0), Math.max(totalMs, 0));
                          progressPct = totalMs > 0 ? Math.min(100, Math.max(0, (usedMs / totalMs) * 100)) : 100;
                          const diffDays = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                          remainingDays = diffDays > 0 ? diffDays : 0;
                        }

                        const isActive = plan.status === 'active' && endDate && endDate.getTime() >= now.getTime();
                        const planTier = plan.plan_tier as PaidPlanTier;
                        const planDef = BILLING_CONFIG.plans[planTier] || null;

                        return (
                          <div
                            key={plan.id}
                            className="rounded-xl border border-white/10 bg-white/5 p-4 flex flex-col gap-3 hover:border-orange-500/30 transition-colors"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                                  <span className="font-bold text-orange-400">{category}</span>
                                </div>
                                <div>
                                  <p className="text-sm font-semibold">{info?.name || category}</p>
                                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                                    {planDef?.label || plan.plan_tier}
                                  </p>
                                </div>
                              </div>
                              {isActive && (
                                <span className="flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                              )}
                            </div>

                            {startDate && endDate && (
                              <div className="space-y-1.5">
                                <div className="flex justify-between text-[10px] text-muted-foreground">
                                  <span>{isSq ? 'Progresi' : 'Usage'}</span>
                                  <span>{remainingDays} {isSq ? 'ditë mbetura' : 'days left'}</span>
                                </div>
                                <div className="w-full bg-black/40 rounded-full h-1.5 overflow-hidden border border-white/5">
                                  <div
                                    className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all"
                                    style={{ width: `${progressPct}%` }}
                                  />
                                </div>
                              </div>
                            )}

                            {!isAdmin && isActive && remainingDays !== null && remainingDays <= 7 && (
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="w-full h-7 text-xs border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                                asChild
                              >
                                <Link href={`/pricing?category=${category}`}>
                                  {isSq ? 'Rinovoni tani' : 'Renew now'}
                                </Link>
                              </Button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </GlassCard>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="mt-8 pt-8 border-t border-white/10">
              <div className="flex items-center gap-2 mb-6">
                <Shield className="w-4 h-4 text-red-400" />
                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  {t('profile.dangerZoneTitle')}
                </h2>
              </div>
              
              <GlassCard className="p-6 border border-red-500/20 bg-red-500/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-red-200">
                    {t('profile.deleteAccountButton')}
                  </h3>
                  <p className="text-xs text-red-200/60 max-w-md">
                    {t('profile.dangerZoneDescription')}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="inline-flex items-center gap-2 whitespace-nowrap bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 hover:border-red-500/40"
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  <Trash2 className="w-4 h-4" />
                  {t('profile.deleteAccountButton')}
                </Button>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>

      <AlertDialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open);
          if (!open) {
            setDeleteConfirmInput('');
          }
        }}
      >
        <AlertDialogContent className="bg-zinc-950 border-border/80">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-500">
              <AlertTriangle className="w-5 h-5" />
              {t('profile.deleteDialogTitle')}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              {t('profile.deleteDialogDescription')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="mt-4 space-y-3">
            <Label htmlFor="delete-confirm" className="text-xs uppercase tracking-wider text-muted-foreground">
              {t('profile.deleteDialogConfirmLabel')}
            </Label>
            <Input
              id="delete-confirm"
              value={deleteConfirmInput}
              onChange={(e) => setDeleteConfirmInput(e.target.value)}
              placeholder="DELETE"
              className="bg-black/50 border-red-500/20 focus:border-red-500/50 focus:ring-red-500/20"
            />
          </div>
          <AlertDialogFooter className="mt-6">
            <AlertDialogCancel onClick={() => setDeleteDialogOpen(false)} className="border-white/10 hover:bg-white/5 hover:text-foreground">
              {t('profile.deleteDialogCancel')}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDeleteAccount}
              disabled={deletingAccount || deleteConfirmInput !== 'DELETE'}
              className="bg-red-600 hover:bg-red-700 text-white border-none"
            >
              {deletingAccount ? t('profile.deleteDialogConfirming') : t('profile.deleteDialogConfirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
