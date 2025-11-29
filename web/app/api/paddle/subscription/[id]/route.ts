import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getPaddleSubscription, cancelPaddleSubscription } from '@/lib/paddle-api';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const subscription = await getPaddleSubscription(id);

  if (!subscription) {
    return NextResponse.json({ error: 'Subscription not found' }, { status: 404 });
  }

  // Security check: Ensure the subscription belongs to the authenticated user
  const customDataUserId = subscription.custom_data?.user_id;
  
  if (customDataUserId && customDataUserId !== user.id) {
      console.error(`⚠️ Unauthorized access attempt: User ${user.id} tried to access sub ${id} belonging to ${customDataUserId}`);
      return NextResponse.json({ error: 'Unauthorized access to subscription' }, { status: 403 });
  }

  return NextResponse.json({ subscription });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Verify ownership first
  const subscription = await getPaddleSubscription(id);
  if (!subscription) {
    return NextResponse.json({ error: 'Subscription not found' }, { status: 404 });
  }
  
  const customDataUserId = subscription.custom_data?.user_id;
  if (customDataUserId && customDataUserId !== user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  // Perform cancellation at end of period
  const result = await cancelPaddleSubscription(id, 'next_billing_period');

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({ success: true, data: result.data });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Only allow removing if it matches the user's current subscription_id
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('subscription_id')
    .eq('id', user.id)
    .single();

  if (profile?.subscription_id !== id) {
     return NextResponse.json({ error: 'Subscription ID mismatch' }, { status: 400 });
  }

  // Update to null
  const { error } = await supabase
    .from('user_profiles')
    .update({ subscription_id: null })
    .eq('id', user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
