import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { isPlanCurrentlyActive } from '@/lib/subscriptions';
import { Paywall } from '@/components/paywall';
import React from 'react';

export default async function DecisionTrainerLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch profile (for admin check) and plans in parallel
  const [profileResult, plansResult] = await Promise.all([
    supabase.from('user_profiles').select('is_admin').eq('id', user.id).single(),
    supabase.from('user_plans').select('start_date, end_date, status').eq('user_id', user.id).eq('status', 'active')
  ]);

  const isAdmin = !!profileResult.data?.is_admin;
  
  // If admin, allow access immediately
  if (isAdmin) {
    return <>{children}</>;
  }

  // Check if any plan is active
  const plans = plansResult.data || [];
  const hasActivePlan = plans.some(plan => 
    isPlanCurrentlyActive({ 
        startDate: plan.start_date, 
        endDate: plan.end_date 
    })
  );

  if (hasActivePlan) {
    return <>{children}</>;
  }

  // Block access and show Paywall
  return <Paywall />;
}
