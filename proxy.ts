import { type NextRequest } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';

export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

// Follow Supabase + Next.js 13 App Router recommendation:
// run updateSession on all application routes so PKCE code exchanges
// and auth cookies stay in sync for every request (including /login?code=...).
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
