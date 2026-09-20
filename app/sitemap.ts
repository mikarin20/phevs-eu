import { MetadataRoute } from 'next'
import carsData from '@/data/cars.json'
import blogData from '@/data/blog.json'
import quickComparesData from '@/data/quick-compares.json'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.phevs.eu'
  const now = new Date()

  // 1. Ana sayfa ve statik kurumsal / rehber sayfaları (trailingSlash: true)
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/videos/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/longest-range-phev/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/phev-with-dc-charging/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/7-seater-phev/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/compare/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/tax-simulator/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/faq/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about/`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy/`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms/`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/cookies/`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]

  // 2. Aktif FAQ Detay Sayfaları (İngilizce canonical slug'lar)
  const faqSlugs = [
    'what-is-phev-how-it-works',
    'phev-vs-bev-differences',
    'phev-benefits-and-advantages',
    'phev-buying-guide',
    'phev-price-ranges',
    'phev-range-wltp-calculation',
    'phev-charging-times-ac-vs-dc',
    'phev-battery-life-degradation',
    'phev-charging-types-connectors',
    'phev-home-charging-wallbox-vs-outlet',
    'phev-find-charging-stations',
    'phev-maintenance-costs',
  ]

  const faqRoutes: MetadataRoute.Sitemap = faqSlugs.map((slug) => ({
    url: `${baseUrl}/faq/${slug}/`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  // 3. Popüler Quick Compare Sayfaları
  const compareRoutes: MetadataRoute.Sitemap = (quickComparesData as any[]).map((compare) => ({
    url: `${baseUrl}/compare/${compare.slug}/`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  // 4. Tüm Araç Model Sayfaları (slug veya id ile benzersiz, trailingSlash ile)
  const seenCarUrls = new Set<string>()
  const carRoutes: MetadataRoute.Sitemap = []

  for (const car of carsData as any[]) {
    const slugOrId = car.slug || car.id
    if (!slugOrId) continue

    const url = `${baseUrl}/models/${slugOrId}/`
    if (seenCarUrls.has(url)) continue
    seenCarUrls.add(url)

    let priority = 0.6
    const popularBrands = ['BMW', 'Audi', 'Mercedes-Benz', 'Volkswagen', 'Toyota', 'Hyundai', 'Kia', 'Land Rover', 'Lexus', 'Volvo']
    if (car.brand && popularBrands.includes(car.brand)) {
      priority = 0.8
    }
    if (typeof car.year === 'number' && car.year >= 2025) {
      priority = Math.max(priority, 0.7)
    }

    carRoutes.push({
      url,
      lastModified: car.last_updated ? new Date(car.last_updated) : now,
      changeFrequency: 'weekly',
      priority,
    })
  }

  // 5. Blog Makaleleri (Sadece yayında olanlar)
  const blogRoutes: MetadataRoute.Sitemap = (blogData as any[])
    .filter((post) => post.status !== 'draft')
    .map((post) => ({
      url: `${baseUrl}/blog/${post.slug}/`,
      lastModified: new Date(post.updated_at || post.published_at || now),
      changeFrequency: 'monthly',
      priority: 0.7,
    }))

  return [...staticRoutes, ...faqRoutes, ...compareRoutes, ...carRoutes, ...blogRoutes]
}
