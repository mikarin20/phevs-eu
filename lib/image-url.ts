// Public Cloudflare R2 bucket hosting car/brand images uploaded by upload-r2.mjs.
// Only /public/images/cars/brands/** was migrated, and objects are keyed as
// "cars/brands/..." (no "images/" prefix) — everything else (blog images,
// placeholder, og-image) still ships from /public and must stay local.
const R2_BASE_URL = 'https://pub-698245a4878b4d6596cd62322fdc9c75.r2.dev'
const R2_CAR_IMAGE_PREFIX = '/images/cars/brands/'

/** Resolves a car/brand `/images/cars/brands/...` path to its R2-hosted URL; leaves other paths (blog, placeholder) local. */
export function getImageUrl(path?: string | null): string {
  if (!path) return '/images/placeholder-car.jpg'
  if (/^https?:\/\//i.test(path)) return path
  const normalized = path.startsWith('/') ? path : `/${path}`
  if (normalized.startsWith(R2_CAR_IMAGE_PREFIX)) {
    return `${R2_BASE_URL}${normalized.replace('/images', '')}`
  }
  return normalized
}

export { R2_BASE_URL }
