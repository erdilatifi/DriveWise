import { NextRequest, NextResponse } from 'next/server';
import { createClient as createServerClient } from '@/utils/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { BILLING_CONFIG } from '@/lib/subscriptions';
import { grantPlanSchema } from '@/lib/validations/admin';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Check if user is admin in DB
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    if (!profile?.is_admin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const parsed = grantPlanSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }
    const { userId, category, planTier } = parsed.data;

    const planDef = BILLING_CONFIG.plans[planTier];

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json({ error: 'Server is not configured for admin plan grants.' }, { status: 500 });
    }

    const adminClient = createAdminClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const now = new Date();
    const startDate = new Date(now);
    const endDate = new Date(now);
    endDate.setMonth(endDate.getMonth() + planDef.months);

    const { error } = await adminClient.from('user_plans').upsert(
      {
        user_id: userId,
        category,
        plan_tier: planTier,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        status: 'active',
      },
      { onConflict: 'user_id,category' },
    );

    if (error) {
      console.error('Admin grant plan error:', error);
      return NextResponse.json({ error: 'Failed to grant plan' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Admin grant plan unexpected error:', err);
    return NextResponse.json({ error: 'Failed to grant plan' }, { status: 500 });
  }
}
