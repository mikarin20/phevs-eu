// Edge-compatible auth primitives (Web Crypto) shared by middleware and API routes.
export const SESSION_COOKIE = 'admin_session'
const SESSION_TTL_MS = 1000 * 60 * 60 * 12 // 12 hours

const encoder = new TextEncoder()

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

async function hmacKey(secret: string) {
  return crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify'])
}

export async function sha256Hex(input: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', encoder.encode(input))
  return toHex(digest)
}

export async function createSessionToken(): Promise<string> {
  const secret = process.env.SESSION_SECRET
  if (!secret) throw new Error('SESSION_SECRET is not set')
  const expires = Date.now() + SESSION_TTL_MS
  const payload = `admin.${expires}`
  const key = await hmacKey(secret)
  const signature = toHex(await crypto.subtle.sign('HMAC', key, encoder.encode(payload)))
  return `${payload}.${signature}`
}

// Constant-time-ish comparison to avoid trivial timing side channels.
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

export async function verifySessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false
  const secret = process.env.SESSION_SECRET
  if (!secret) return false

  const parts = token.split('.')
  if (parts.length !== 3) return false
  const [role, expiresStr, signature] = parts
  const expires = Number(expiresStr)
  if (role !== 'admin' || !Number.isFinite(expires) || Date.now() > expires) return false

  const payload = `${role}.${expiresStr}`
  const key = await hmacKey(secret)
  const expectedSignature = toHex(await crypto.subtle.sign('HMAC', key, encoder.encode(payload)))
  return safeEqual(expectedSignature, signature)
}
