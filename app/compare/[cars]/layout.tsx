import type { Metadata } from 'next'
import carsData from '@/data/cars.json'

export default function CompareLayout({ children }: { children: React.ReactNode }) {
  return children
}

export async function generateMetadata({ params }: { params: { cars: string } }): Promise<Metadata> {
  const baseUrl = 'https://phevs.eu'
  const slug = params.cars

  const ids = slug.includes('-vs-') ? slug.split('-vs-') : slug.split(',')
  const selected = ids
    .map((id) => (carsData as any[]).find((c) => c.id === id || c.slug === id))
    .filter(Boolean) as any[]

  const title = selected.length >= 2
    ? `${selected[0].brand} ${selected[0].model} vs ${selected[1].brand} ${selected[1].model} Karşılaştırması | PHEVs.eu`
    : 'PHEV Araç Karşılaştırması | PHEVs.eu'

  const description = selected.length >= 2
    ? `${selected[0].brand} ${selected[0].model} ile ${selected[1].brand} ${selected[1].model} karşılaştırması: menzil (${selected[0].ev_range_km} km vs ${selected[1].ev_range_km} km), batarya (${selected[0].battery_kwh} kWh vs ${selected[1].battery_kwh} kWh), güç (${selected[0].power_hp} HP vs ${selected[1].power_hp} HP), tüketim (${selected[0].fuel_consumption} vs ${selected[1].fuel_consumption} L/100km), CO₂ (${selected[0].co2_emission} vs ${selected[1].co2_emission} g/km), fiyat (≈ €${Number(selected[0].price_eur).toLocaleString('en-US')} vs €${Number(selected[1].price_eur).toLocaleString('en-US')}).`
    : 'PHEV araçları menzil, batarya, güç, tüketim, emisyon ve fiyat parametreleriyle karşılaştırın.'

  return {
    title,
    description,
    alternates: {
      canonical: `${baseUrl}/compare/${slug}`,
      languages: {
        'x-default': `${baseUrl}/compare/${slug}`,
        en: `${baseUrl}/compare/${slug}`,
        tr: `${baseUrl}/compare/${slug}?lang=tr`,
        de: `${baseUrl}/compare/${slug}?lang=de`,
        pl: `${baseUrl}/compare/${slug}?lang=pl`,
      },
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: `${baseUrl}/compare/${slug}`,
      siteName: 'PHEVs.eu',
    },
  }
}


