import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  try {
    // 1. Get current user (if any) for the user_id field
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // 2. Parse body
    const body = await req.json();
    const {
      title,
      description,
      stepsToReproduce,
      location,
      deviceBrowser,
      contactEmail,
    } = body;

    if (!title || !description) {
      return NextResponse.json(
        { error: 'Title and description are required.' },
        { status: 400 }
      );
    }

    // 3. Setup Admin Client for privileged insert (bypassing strict RLS if necessary, or just ensuring reliability)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { error: 'Server configuration error.' },
        { status: 500 }
      );
    }

    const adminClient = createAdminClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // 4. Insert Bug Report
    const { error } = await adminClient.from('bug_reports').insert({
      user_id: user?.id || null,
      title,
      description,
      steps_to_reproduce: stepsToReproduce,
      location,
      device_browser: deviceBrowser,
      contact_email: contactEmail || user?.email, // Fallback to auth email if not provided
    });

    if (error) {
      console.error('Error inserting bug report:', error);
      return NextResponse.json(
        { error: 'Failed to submit bug report.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Unexpected error in bug report API:', error);
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
