import { NextRequest, NextResponse } from 'next/server'
import { sha256Hex, createSessionToken, SESSION_COOKIE } from '@/lib/admin/crypto'

export async function POST(request: NextRequest) {
  const isDev = process.env.NODE_ENV === 'development'
  const isAdminExplicitlyEnabled = process.env.ENABLE_ADMIN_PANEL === 'true'

  if (!isDev && !isAdminExplicitlyEnabled) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const body = await request.json().catch(() => ({ password: '' }))
  const password = typeof body.password === 'string' ? body.password : ''
  const expectedHash = process.env.ADMIN_PASSWORD_HASH

  if (!expectedHash) {
    return NextResponse.json({ error: 'Admin login is not configured (ADMIN_PASSWORD_HASH missing)' }, { status: 500 })
  }
  if (!password || (await sha256Hex(password)) !== expectedHash) {
    // Artificial delay to prevent automated rapid brute-force attacks
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  }

  const token = await createSessionToken()
  const res = NextResponse.json({ ok: true })
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 12,
  })
  return res
}
