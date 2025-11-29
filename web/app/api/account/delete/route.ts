import { NextResponse } from 'next/server';
import { createClient as createServerClient } from '@/utils/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';

export async function DELETE(_req: Request) {
  try {
    const supabase = await createServerClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { error: 'Server is not configured for account deletion.' },
        { status: 500 },
      );
    }

    const adminClient = createAdminClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Parse optional feedback from body
    let feedback = null;
    try {
      const body = await _req.json();
      if (body && body.reason) {
        feedback = body;
      }
    } catch {
      // Body might be empty if no feedback provided
    }

    // If feedback exists, save it to user_feedback table
    if (feedback) {
      // Fetch profile for snapshot
      const { data: profile } = await adminClient
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      // Insert into user_feedback (independent table, no FK constraint to auth.users)
      await adminClient.from('user_feedback').insert({
        user_id: user.id, // Stored for reference
        display_name: profile?.full_name || user.user_metadata?.full_name || 'Deleted User',
        avatar_url: profile?.avatar_url || user.user_metadata?.avatar_url,
        email: user.email, // Stored privately for admin reference
        reason: feedback.reason,
        comment: feedback.comment || feedback.customReason, // Use comment or custom reason
        is_public_allowed: feedback.allowPublic || false,
      });
    }

    const { error: deleteError } = await adminClient.auth.admin.deleteUser(user.id);

    if (deleteError) {
      return NextResponse.json({ error: 'Failed to delete account.' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Unexpected server error.' }, { status: 500 });
  }
}
