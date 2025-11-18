import { type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match only pages that need auth protection, excluding:
     * - API routes
     * - Static files (_next/static, _next/image)
     * - Public assets (favicon, images)
     * - Public pages (/, /login, /register)
     */
    '/dashboard/:path*',
    '/admin/:path*',
    '/category/:path*',
    '/test/:path*',
    '/history/:path*',
    '/decision-trainer/:path*',
    '/materials/:path*',
  ],
}