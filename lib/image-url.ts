// Public Cloudflare R2 bucket that now hosts /images/* assets previously served from /public
const R2_BASE_URL = 'https://pub-698245a4878b4d6596cd62322fdc9c75.r2.dev'

/** Resolves a local `/images/...` path (or falsy value) to its R2-hosted absolute URL. */
export function getImageUrl(path?: string | null): string {
  if (!path) return `${R2_BASE_URL}/images/placeholder-car.jpg`
  if (/^https?:\/\//i.test(path)) return path
  return `${R2_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`
}

export { R2_BASE_URL }
