import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import carsData from '@/data/cars.json'

// Static generation için gerekli
export async function generateStaticParams() {
  return carsData.map((car) => ({
    id: car.id,
  }))
}

export default function ModelLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

// Dinamik kanonik URL ve temel meta
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const id = params.id
  const baseUrl = 'https://www.phevs.eu'

  const car = (carsData as any[]).find((c) => c.id === id || c.slug === id)

  // Eğer araç bulunamazsa 404 döndür
  if (!car) {
    notFound()
  }

  const title = `${car.brand} ${car.model} ${car.year} Specs | PHEV Database | PHEVs.eu`
  const description = `${car.brand} ${car.model} (${car.year}) PHEV database entry — ${car.ev_range_km} km electric range, ${car.battery_kwh} kWh battery, ${car.power_hp} HP, ${car.fuel_consumption} L/100km consumption, CO₂ ${car.co2_emission} g/km.`

  return {
    title,
    description,
    alternates: {
      canonical: `${baseUrl}/models/${id}`,
      languages: {
        'x-default': `${baseUrl}/models/${id}`,
        en: `${baseUrl}/models/${id}`,
        tr: `${baseUrl}/models/${id}`,
        de: `${baseUrl}/models/${id}`,
        pl: `${baseUrl}/models/${id}`,
      },
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: `${baseUrl}/models/${id}`,
      siteName: 'PHEVs.eu',
    },
  }
}

