import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Routes that are public AND never redirect based on auth state (i.e. we
// don't need to know who the user is to decide what to do here). Skipping
// the Supabase auth.getUser() network round-trip for these avoids paying
// that latency on every visit to fully public pages like the landing page.
const ALWAYS_PUBLIC_ROUTES = [
  '/',
  '/pricing',
  '/payment/success', // Should be public to check status
  '/payment/cancel',
  '/privacy-policy',
  '/terms-of-service',
  '/refund-policy',
  '/reset-password', // Recovery session is validated client-side via the reset link's own token
]

// Auth routes: publicly reachable, but redirect away to /dashboard if the
// visitor turns out to already be logged in (these DO need to know `user`).
const AUTH_ROUTES = ['/login', '/register', '/forgot-password']

export async function updateSession(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const isApiRoute = pathname.startsWith('/api')

  if (isApiRoute || ALWAYS_PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next({ request })
  }

  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: DO NOT REMOVE auth.getUser()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isAuthRoute = AUTH_ROUTES.includes(pathname)

  // If user is not authenticated and trying to access a protected route (anything not public and not an auth route)
  if (!user && !isAuthRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // If user IS authenticated and tries to access auth routes (login/register), redirect to dashboard
  // This prevents "double login" or accessing sign up while logged in.
  if (user && isAuthRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse
}