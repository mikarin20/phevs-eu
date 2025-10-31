import { MetadataRoute } from 'next'
import carsData from '@/data/cars.json'
import blogData from '@/data/blog.json'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://phevs.eu'
  
  // Yardımcı: güvenli slug üretimi ve boş değerleri filtreleme
  const slugify = (value: unknown): string | null => {
    if (value === null || value === undefined) return null
    const str = String(value).trim()
    if (!str) return null
    const normalized = str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // diacritics kaldır
      .replace(/[\s/]+/g, '-') // boşluk ve '/'
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
    return normalized ? encodeURIComponent(normalized) : null
  }
  
  // Ana sayfa ve önemli sayfalar
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/compare`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/cookies`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/demo`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
  ]

  // Marka bazında sayfalar oluştur
  const brands = [...new Set(carsData.map(car => car.brand).filter(Boolean))]
  const brandRoutes = brands
    .map((brand) => slugify(brand))
    .filter(Boolean)
    .map((brandSlug) => ({
    url: `${baseUrl}/brands/${brandSlug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // Segment bazında sayfalar oluştur
  const segments = [...new Set(carsData.map(car => car.segment).filter(Boolean))]
  const segmentRoutes = segments
    .map((segment) => slugify(segment))
    .filter(Boolean)
    .map((segmentSlug) => ({
    url: `${baseUrl}/segments/${segmentSlug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // FAQ sayfaları
  const faqSlugs = [
    'phev-nedir-nasil-calisir',
    'phev-bev-farki-nedir',
    'phev-avantajlari-nelerdir',
    'phev-satin-alma-rehberi',
    'phev-fiyat-araligi-nedir',
    'phev-tesvikler-hangi-ulkelerde',
    'phev-menzil-hesaplama-nasil',
    'phev-sarj-sureleri-ne-kadar',
    'phev-batarya-omru-ne-kadar',
    'phev-sarj-tipleri-nelerdir',
    'ev-phev-sarj-cihazi-gerekli-mi',
    'phev-sarj-istasyonu-nasil-bulunur',
    'phev-bakim-maliyeti-nedir',
    'phev-garanti-suresi-ne-kadar',
    'phev-servis-aglari-yeterli-mi'
  ]
  
  const faqRoutes = faqSlugs.map((slug) => ({
    url: `${baseUrl}/faq/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Tüm araba model sayfaları - öncelik sıralaması
  const carRoutes = (carsData as any[])
    .map((car) => {
      const rawId = car.id ?? car.slug
      const safeId = slugify(rawId)
      if (!safeId) return null

      let priority = 0.6
      const popularBrands = ['BMW', 'Audi', 'Mercedes-Benz', 'Volkswagen', 'Toyota', 'Hyundai', 'Kia', 'Land Rover', 'Lexus']
      if (car.brand && popularBrands.includes(car.brand)) {
        priority = 0.8
      }
      if (typeof car.year === 'number' && car.year >= 2024) {
        priority = Math.max(priority, 0.7)
      }

      return {
        url: `${baseUrl}/models/${safeId}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority,
      }
    })
    .filter(Boolean)
    .filter((item, idx, arr) => idx === arr.findIndex((x) => x!.url === item!.url)) as MetadataRoute.Sitemap

  // Blog yazıları (görseller dahil)
  const blogRoutes = (blogData as any[]).map((post) => {
    const featuredImageUrl = post.featured_image?.startsWith('http') 
      ? post.featured_image 
      : `${baseUrl}${post.featured_image}`
    
    return {
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.updated_at || post.published_at),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
      // Next.js MetadataRoute.Sitemap image desteği için alternatif yaklaşım
      // Image bilgileri structured data ve OpenGraph'da zaten var
    }
  })

  return [...routes, ...brandRoutes, ...segmentRoutes, ...faqRoutes, ...carRoutes, ...blogRoutes]
}

