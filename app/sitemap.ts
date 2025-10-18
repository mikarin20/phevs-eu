import { MetadataRoute } from 'next'
import carsData from '@/data/cars.json'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://phevs.eu'
  
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
  ]

  // Marka bazında sayfalar oluştur
  const brands = [...new Set(carsData.map(car => car.brand))]
  const brandRoutes = brands.map((brand) => ({
    url: `${baseUrl}/brands/${brand.toLowerCase().replace(/\s+/g, '-')}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // Segment bazında sayfalar oluştur
  const segments = [...new Set(carsData.map(car => car.segment))]
  const segmentRoutes = segments.map((segment) => ({
    url: `${baseUrl}/segments/${segment.toLowerCase().replace(/\s+/g, '-')}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // Tüm araba model sayfaları - öncelik sıralaması
  const carRoutes = carsData.map((car) => {
    let priority = 0.6
    
    // Popüler markalar için yüksek öncelik
    const popularBrands = ['BMW', 'Audi', 'Mercedes-Benz', 'Volkswagen', 'Toyota', 'Hyundai', 'Kia']
    if (popularBrands.includes(car.brand)) {
      priority = 0.8
    }
    
    // Yeni modeller için yüksek öncelik
    if (car.year >= 2024) {
      priority = Math.max(priority, 0.7)
    }

    return {
      url: `${baseUrl}/models/${car.id}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority,
    }
  })

  return [...routes, ...brandRoutes, ...segmentRoutes, ...carRoutes]
}

