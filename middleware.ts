import { NextRequest, NextResponse } from 'next/server'
import { SESSION_COOKIE, verifySessionToken } from '@/lib/admin/crypto'

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}

export async function middleware(request: NextRequest) {
  const isDev = process.env.NODE_ENV === 'development'
  const isAdminExplicitlyEnabled = process.env.ENABLE_ADMIN_PANEL === 'true'
  const isAllowed = isDev || isAdminExplicitlyEnabled

  // In production (unless ENABLE_ADMIN_PANEL is explicitly set to true), completely hide admin routes with 404
  if (!isAllowed) {
    if (request.nextUrl.pathname.startsWith('/api/admin')) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    return NextResponse.rewrite(new URL('/_not-found', request.url), { status: 404 })
  }

  const { pathname } = request.nextUrl
  const normalizedPathname = pathname.replace(/\/+$/, '') || '/'

  const isPublicRoute = normalizedPathname === '/admin/login' || normalizedPathname === '/api/admin/auth/login'
  if (isPublicRoute) {
    return NextResponse.next()
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value
  const isValid = await verifySessionToken(token)

  if (!isValid) {
    if (pathname.startsWith('/api/admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const loginUrl = new URL('/admin/login', request.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}
