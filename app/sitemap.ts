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
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
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
  const carRoutes = carsData.map((car) => {
    let priority = 0.6
    
    // Popüler markalar için yüksek öncelik
    const popularBrands = ['BMW', 'Audi', 'Mercedes-Benz', 'Volkswagen', 'Toyota', 'Hyundai', 'Kia', 'Land Rover']
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

  return [...routes, ...brandRoutes, ...segmentRoutes, ...faqRoutes, ...carRoutes]
}

