import type { Metadata } from 'next'
import carsData from '@/data/cars.json'
import quickCompareData from '@/data/quick-compares.json'

export default function CompareLayout({ children }: { children: React.ReactNode }) {
  return children
}

function findCarForCompare(id: string) {
  if (!id) return null
  const normalized = decodeURIComponent(id).toLowerCase().trim()
  return (carsData as any[]).find((c) => {
    if (c.id?.toLowerCase() === normalized) return true
    if (c.slug?.toLowerCase() === normalized) return true
    const slugNoPhev = (c.slug || '').toLowerCase().replace(/-phev$/, '')
    const idNoPhev = normalized.replace(/-phev$/, '')
    if (slugNoPhev && slugNoPhev === idNoPhev) return true
    if (c.slug && (c.slug.includes(normalized) || normalized.includes(c.slug))) return true
    return false
  })
}

export async function generateMetadata({ params }: { params: { cars: string } }): Promise<Metadata> {
  const baseUrl = 'https://phevs.eu'
  const slug = params.cars

  const customCompare = (quickCompareData as any[]).find((c) => c.slug === slug)

  let selected: any[] = []
  if (customCompare) {
    const car1 = (carsData as any[]).find((c) => c.id === customCompare.vehicle1Id)
    const car2 = (carsData as any[]).find((c) => c.id === customCompare.vehicle2Id)
    if (car1 && car2) {
      selected = [car1, car2]
    }
  }

  if (selected.length < 2) {
    const ids = slug.includes('-vs-') ? slug.split('-vs-') : slug.split(',')
    selected = ids
      .map((id) => findCarForCompare(id))
      .filter(Boolean) as any[]
  }

  const title = selected.length >= 2
    ? `${selected[0].brand} ${selected[0].model} vs ${selected[1].brand} ${selected[1].model} Plug-in Hybrid (PHEV) Comparison | PHEVs.eu`
    : 'Plug-in Hybrid (PHEV) Comparison | PHEVs.eu'

  const description = selected.length >= 2
    ? `Compare ${selected[0].brand} ${selected[0].model} and ${selected[1].brand} ${selected[1].model} Plug-in Hybrid (PHEV) models by electric range (${selected[0].ev_range_km} km vs ${selected[1].ev_range_km} km), battery capacity (${selected[0].battery_kwh} kWh vs ${selected[1].battery_kwh} kWh), power (${selected[0].power_hp} HP vs ${selected[1].power_hp} HP) and fuel consumption.`
    : 'Compare Plug-in Hybrid (PHEV) models by electric range, battery capacity, charging time, power, and technical specs.'

  const finalTitle = customCompare?.metaTitle
    ? `${customCompare.metaTitle.replace(' PHEV Comparison', '')} Plug-in Hybrid (PHEV) Comparison | PHEVs.eu`
    : title
  const finalDescription = customCompare?.metaDescription
    ? `${customCompare.metaDescription} Plug-in Hybrid (PHEV) technical specs and detailed comparison.`
    : description

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


