import type { Metadata } from 'next'
import carsData from '@/data/cars.json'
import quickCompareData from '@/data/quick-compares.json'

export default function CompareLayout({ children }: { children: React.ReactNode }) {
  return children
}

export async function generateMetadata({ params }: { params: { cars: string } }): Promise<Metadata> {
  const baseUrl = 'https://www.phevs.eu'
  const slug = params.cars

  const ids = slug.includes('-vs-') ? slug.split('-vs-') : slug.split(',')
  const selected = ids
    .map((id) => (carsData as any[]).find((c) => c.id === id || c.slug === id))
    .filter(Boolean) as any[]

  const title = selected.length >= 2
    ? `${selected[0].brand} ${selected[0].model} vs ${selected[1].brand} ${selected[1].model} PHEV Comparison | PHEVs.eu`
    : 'PHEV Comparison | PHEVs.eu'

  const description = selected.length >= 2
    ? `Compare ${selected[0].brand} ${selected[0].model} vs ${selected[1].brand} ${selected[1].model} in our PHEV database: range (${selected[0].ev_range_km} km vs ${selected[1].ev_range_km} km), battery (${selected[0].battery_kwh} kWh vs ${selected[1].battery_kwh} kWh), power (${selected[0].power_hp} HP vs ${selected[1].power_hp} HP), consumption (${selected[0].fuel_consumption} vs ${selected[1].fuel_consumption} L/100km), CO₂ (${selected[0].co2_emission} vs ${selected[1].co2_emission} g/km).`
    : 'Compare PHEVs by range, battery, power, consumption, and emissions using our plug-in hybrid database.'

  const customCompare = (quickCompareData as any[]).find((c) => c.slug === slug)
  const finalTitle = customCompare?.metaTitle || title
  const finalDescription = customCompare?.metaDescription || description

  return {
    title: finalTitle,
    description: finalDescription,
    alternates: {
      canonical: `${baseUrl}/compare/${slug}`,
      languages: {
        'x-default': `${baseUrl}/compare/${slug}`,
        en: `${baseUrl}/compare/${slug}`,
        tr: `${baseUrl}/compare/${slug}`,
        de: `${baseUrl}/compare/${slug}`,
        pl: `${baseUrl}/compare/${slug}`,
      },
    },
    openGraph: {
      title: finalTitle,
      description: finalDescription,
      type: 'website',
      url: `${baseUrl}/compare/${slug}`,
      siteName: 'PHEVs.eu',
    },
  }
}


