'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { AlertTriangle, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading: authLoading, isAdmin, userProfile, refreshUser, signOut } = useAuth();
  const { t } = useLanguage();
  const [fullNameInput, setFullNameInput] = useState(
    userProfile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || '',
  );
  const [savingName, setSavingName] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [deleteConfirmInput, setDeleteConfirmInput] = useState('');

  const { data: plans } = useUserPlans(user?.id || undefined);
  const { hasAnyActivePlan } = useGlobalPremium(user?.id, isAdmin);
  const paidPlans = useMemo(() => {
    return (plans || []).filter((p) => p.plan_tier && p.plan_tier !== 'FREE');
  }, [plans]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">
            {authLoading ? t('auth.signingIn') : t('test.loadingQuestions')}
          </p>
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
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-5xl space-y-6">
          <GlassCard className="p-6 md:p-7 border border-border/80 bg-black/85 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">{t('profile.title') || 'Plan & usage summary'}</p>
              <h1 className="text-2xl md:text-3xl font-semibold tracking-tight mb-1">{displayName}</h1>
              {email && <p className="text-sm text-muted-foreground">{email}</p>}
              {!isAdmin && (
                <p className="mt-1 text-xs text-muted-foreground">
                  {hasAnyActivePlan
                    ? 'You have at least one active paid plan. See details below.'
                    : 'You are currently on the free plan. Start a paid plan to unlock all premium features.'}
                </p>
              )}
              {isAdmin && (
                <p className="mt-2 text-xs text-amber-400">
                  {t('profile.adminUnlimited') ||
                    'Admin: You already have unlimited access to all categories and features.'}
                </p>
              )}
            </div>
            <div className="flex flex-col items-end gap-2">
              {hasAnyActivePlan && !isAdmin && (
                <Badge variant="outline" className="border-emerald-500/70 text-emerald-400 text-xs">
                  {t('profile.premiumBadge') || 'Active paid plan'}
                </Badge>
              )}
            </div>
          </GlassCard>

          <GlassCard className="p-6 md:p-7 border border-border/80 bg-black/85">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-semibold tracking-tight">
                  {t('profile.accountSettingsTitle')}
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                  {t('profile.accountSettingsDescription')}
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="full-name">{t('profile.displayNameLabel')}</Label>
                <div className="flex gap-2">
                  <Input
                    id="full-name"
                    value={fullNameInput}
                    onChange={(e) => setFullNameInput(e.target.value)}
                    className="text-sm"
                  />
                  <Button
                    size="sm"
                    type="button"
                    onClick={handleSaveName}
                    disabled={savingName || !fullNameInput.trim() || fullNameInput.trim() === displayName}
                    className="whitespace-nowrap"
                  >
                    {savingName ? 'Saving...' : 'Save'}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="account-email">{t('profile.emailLabel')}</Label>
                <Input id="account-email" value={email} disabled className="text-sm" />
                <p className="text-xs text-muted-foreground">
                  {t('profile.emailHelp')}
                </p>
              </div>
            </div>

            <div className="mt-6 border-t border-border/60 pt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-destructive mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-destructive">{t('profile.dangerZoneTitle')}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {t('profile.dangerZoneDescription')}
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="inline-flex items-center gap-2 self-start md:self-auto"
                onClick={() => setDeleteDialogOpen(true)}
              >
                <Trash2 className="w-4 h-4" />
                {t('profile.deleteAccountButton')}
              </Button>
            </div>
          </GlassCard>

          <GlassCard className="p-6 md:p-7 border border-border/80 bg-black/85">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-semibold tracking-tight">
                  {t('plans.profilePaidPlansTitle') || 'Your paid plans'}
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                  {paidPlans.length > 0
                    ? 'These are your paid plans by license category. You can extend them from the pricing page.'
                    : 'You do not have any paid plans yet. Start a plan from the pricing page to unlock all premium features.'}
                </p>
              </div>
              {!isAdmin && paidPlans.length > 0 && (
                <Button size="sm" variant="outline" asChild>
                  <Link href="/pricing">{t('plans.profileExtendViaPricingCta') || 'Go to pricing'}</Link>
                </Button>
              )}
            </div>

            {paidPlans.length === 0 && !isAdmin && (
              <div className="mt-2">
                <Button asChild>
                  <Link href="/pricing">{t('plans.profileExtendViaPricingCta') || 'Go to pricing'}</Link>
                </Button>
              </div>
            )}

            {paidPlans.length > 0 && (
              <div className="mt-4 space-y-3">
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
                  const statusLabel = isActive ? 'Active' : 'Expired';
                  const statusClass = isActive
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/40'
                    : 'bg-muted text-muted-foreground border border-border/60';

                  const planTier = plan.plan_tier as PaidPlanTier;
                  const planDef = BILLING_CONFIG.plans[planTier] || null;

                  return (
                    <div
                      key={plan.id}
                      className="rounded-xl border border-border/80 bg-black/70 p-4 flex flex-col gap-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">
                            Category {category}
                          </p>
                          <p className="text-sm font-semibold">{info?.name || category}</p>
                        </div>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${statusClass}`}
                        >
                          {statusLabel}
                        </span>
                      </div>
                      {isActive && remainingDays !== null && remainingDays <= 7 && (
                        <p className="mt-1 text-[11px] text-amber-400">
                          Expiring soon
                        </p>
                      )}

                      <div className="text-xs text-muted-foreground space-y-1">
                        <p>
                          Plan:{' '}
                          <span className="font-medium">
                            {planDef?.label || plan.plan_tier}
                          </span>
                        </p>
                        <p>
                          Starts:{' '}
                          <span className="font-medium">
                            {startDate ? startDate.toLocaleDateString() : '-'}
                          </span>
                        </p>
                        <p>
                          Ends:{' '}
                          <span className="font-medium">
                            {endDate ? endDate.toLocaleDateString() : '-'}
                          </span>
                          {remainingDays !== null && (
                            <span className="text-muted-foreground/70">
                              {' '}
                              ({remainingDays} days left)
                            </span>
                          )}
                        </p>
                      </div>

                      {startDate && endDate && (
                        <div className="mt-1">
                          <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                            <div
                              className="h-2 rounded-full bg-gradient-to-r from-primary to-primary/70 transition-all"
                              style={{ width: `${progressPct}%` }}
                            />
                          </div>
                          <p className="mt-1 text-[11px] text-muted-foreground">
                            Time used: {Math.round(progressPct)}%
                          </p>
                        </div>
                      )}

                      {!isAdmin && (
                        <div className="mt-1 flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs flex-1"
                            asChild
                          >
                            <Link href={`/pricing?category=${category}&plan=${plan.plan_tier}`}>
                              {t('plans.profileExtendViaPricingCta') || 'Go to pricing'}
                            </Link>
                          </Button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </GlassCard>
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
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-4 h-4" />
              {t('profile.deleteDialogTitle')}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t('profile.deleteDialogDescription')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="mt-4 space-y-2">
            <Label htmlFor="delete-confirm" className="text-xs">
              {t('profile.deleteDialogConfirmLabel')}
            </Label>
            <Input
              id="delete-confirm"
              value={deleteConfirmInput}
              onChange={(e) => setDeleteConfirmInput(e.target.value)}
              placeholder="DELETE"
              className="text-sm"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteDialogOpen(false)}>
              {t('profile.deleteDialogCancel')}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDeleteAccount}
              disabled={deletingAccount || deleteConfirmInput !== 'DELETE'}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deletingAccount ? t('profile.deleteDialogConfirming') : t('profile.deleteDialogConfirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
