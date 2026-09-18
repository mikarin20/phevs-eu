import { NextRequest, NextResponse } from 'next/server'
import { SESSION_COOKIE, verifySessionToken } from '@/lib/admin/crypto'

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isPublicRoute = pathname === '/admin/login' || pathname === '/api/admin/auth/login'
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
