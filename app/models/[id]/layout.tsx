import type { Metadata } from 'next'
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
  const baseUrl = 'https://phevs.eu'

  const car = (carsData as any[]).find((c) => c.id === id || c.slug === id)

  const title = car
    ? `${car.brand} ${car.model} ${car.year} Teknik Özellikler ve Fiyat | PHEVs.eu`
    : 'PHEV Model Detayı | PHEVs.eu'

  const description = car
    ? `${car.brand} ${car.model} (${car.year}) — ${car.ev_range_km} km elektrik menzili, ${car.battery_kwh} kWh batarya, ${car.power_hp} HP güç, ${car.fuel_consumption} L/100km tüketim, CO₂ ${car.co2_emission} g/km. Avrupa piyasasında tahmini başlangıç fiyatı €${Number(car.price_eur).toLocaleString('en-US')}.`
    : 'PHEV model teknik özellikleri, menzil, batarya kapasitesi, güç ve fiyat bilgileri.'

  return {
    title,
    description,
    alternates: {
      canonical: `${baseUrl}/models/${id}`,
      languages: {
        'x-default': `${baseUrl}/models/${id}`,
        en: `${baseUrl}/models/${id}`,
        tr: `${baseUrl}/models/${id}?lang=tr`,
        de: `${baseUrl}/models/${id}?lang=de`,
        pl: `${baseUrl}/models/${id}?lang=pl`,
      },
    },
    openGraph: car
      ? {
          title,
          description,
          type: 'product',
          url: `${baseUrl}/models/${id}`,
          siteName: 'PHEVs.eu',
        }
      : undefined,
  }
}
