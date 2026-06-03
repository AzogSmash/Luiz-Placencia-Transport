import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const SKIP_TRACKING = ['/admin', '/dashboard', '/compte', '/login', '/register', '/api/']

function shouldTrack(pathname: string): boolean {
  if (SKIP_TRACKING.some(s => pathname.startsWith(s))) return false
  if (pathname.includes('.')) return false // static assets
  return true
}

function detectBrowser(ua: string): string {
  if (/Edg\//.test(ua))          return 'Microsoft Edge'
  if (/OPR\/|Opera/.test(ua))    return 'Opera'
  if (/Firefox\//.test(ua))      return 'Firefox'
  if (/Chrome\//.test(ua))       return 'Chrome'
  if (/Safari\//.test(ua))       return 'Safari'
  return 'Other'
}

function detectOS(ua: string): string {
  if (/Windows/.test(ua))        return 'Windows'
  if (/Macintosh|Mac OS X/.test(ua)) return 'Mac'
  if (/iPhone|iPad/.test(ua))    return 'iOS'
  if (/Android/.test(ua))        return 'Android'
  if (/Linux/.test(ua))          return 'Linux'
  return 'Other'
}

function simpleHash(str: string): string {
  let h = 0
  for (let i = 0; i < str.length; i++) h = (Math.imul(31, h) + str.charCodeAt(i)) | 0
  return Math.abs(h).toString(36)
}

function trackPageView(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (!shouldTrack(pathname)) return

  const country  = request.headers.get('x-vercel-ip-country') ?? null
  const ua       = request.headers.get('user-agent') ?? ''
  const referrer = request.headers.get('referer') ?? null
  const device   = /mobile|android/i.test(ua) ? 'Mobile' : /ipad|tablet/i.test(ua) ? 'Tablet' : 'Desktop'
  const browser  = detectBrowser(ua)
  const os       = detectOS(ua)
  const key      = (process.env.SUPABASE_SERVICE_ROLE_KEY ?? '').trim()

  const rawIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
            ?? request.headers.get('x-real-ip')
            ?? ''
  const ip_hash = rawIp ? simpleHash(rawIp + 'lpt_salt') : null

  fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/page_views`, {
    method: 'POST',
    headers: {
      'apikey':        key,
      'Authorization': `Bearer ${key}`,
      'Content-Type':  'application/json',
      'Prefer':        'return=minimal',
    },
    body: JSON.stringify({ path: pathname, country, device, browser, os, referrer, ip_hash }),
  }).catch(() => {})
}

export async function middleware(request: NextRequest) {
  // Track page view for public pages (non-blocking)
  trackPageView(request)

  const { pathname } = request.nextUrl

  // Only run auth logic for protected routes
  if (
    !pathname.startsWith('/dashboard') &&
    !pathname.startsWith('/admin') &&
    !pathname.startsWith('/compte') &&
    pathname !== '/login' &&
    pathname !== '/register'
  ) {
    return NextResponse.next()
  }

  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Protect /dashboard, /admin, /compte
  if ((pathname.startsWith('/dashboard') || pathname.startsWith('/admin') || pathname.startsWith('/compte')) && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  // Redirect authenticated users away from /login and /register
  if ((pathname === '/login' || pathname === '/register') && user) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon|icon).*)'],
}
