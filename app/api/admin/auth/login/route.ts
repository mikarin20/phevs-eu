import { NextRequest, NextResponse } from 'next/server'
import { sha256Hex, createSessionToken, SESSION_COOKIE } from '@/lib/admin/crypto'

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({ password: '' }))
  const password = typeof body.password === 'string' ? body.password : ''
  const expectedHash = process.env.ADMIN_PASSWORD_HASH

  if (!expectedHash) {
    return NextResponse.json({ error: 'Admin login is not configured (ADMIN_PASSWORD_HASH missing)' }, { status: 500 })
  }
  if (!password || (await sha256Hex(password)) !== expectedHash) {
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
