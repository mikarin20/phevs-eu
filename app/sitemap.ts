import { MetadataRoute } from 'next'
import carsData from '@/data/cars.json'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://phevs.eu'
  
  // Ana sayfa
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
      priority: 0.8,
    },
  ]

  // Tüm araba model sayfaları
  const carRoutes = carsData.map((car) => ({
    url: `${baseUrl}/models/${car.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...routes, ...carRoutes]
}

