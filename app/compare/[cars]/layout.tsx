import type { Metadata } from 'next'
import carsData from '@/data/cars.json'
import quickCompareData from '@/data/quick-compares.json'
import comparisonVideosData from '@/data/comparison-videos.json'

export default function CompareLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { cars: string }
}) {
  const slug = params?.cars || ''
  const customCompare = (quickCompareData as any[]).find((c) => c.slug === slug)
  let selected: any[] = []
  if (customCompare) {
    const car1 = (carsData as any[]).find((c) => c.id === customCompare.vehicle1Id)
    const car2 = (carsData as any[]).find((c) => c.id === customCompare.vehicle2Id)
    if (car1 && car2) selected = [car1, car2]
  }
  if (selected.length < 2) {
    const ids = slug.includes('-vs-') ? slug.split('-vs-') : slug.split(',')
    selected = ids.map((id) => findCarForCompare(id)).filter(Boolean) as any[]
  }

  let videoSchema = null
  if (selected.length >= 2) {
    let matchingVideo = null

    if (customCompare?.youtubeId) {
      const fromLibrary = (comparisonVideosData as any[]).find((v) => v.youtubeId === customCompare.youtubeId)
      if (fromLibrary) {
        matchingVideo = fromLibrary
      } else {
        matchingVideo = {
          id: `compare-${customCompare.slug}`,
          youtubeId: customCompare.youtubeId,
          title: customCompare.videoTitle || `${selected[0].brand} ${selected[0].model} vs ${selected[1].brand} ${selected[1].model}`,
          channel: 'Comparison Test',
          description: customCompare.summary || '',
          publishedAt: '2026-09-15',
        }
      }
    }

    if (!matchingVideo) {
      const car1Ids = [
        selected[0].id?.toLowerCase(),
        selected[0].slug?.toLowerCase(),
        (selected[0].slug || '').toLowerCase().replace(/-phev$/, ''),
      ].filter(Boolean)
      const car2Ids = [
        selected[1].id?.toLowerCase(),
        selected[1].slug?.toLowerCase(),
        (selected[1].slug || '').toLowerCase().replace(/-phev$/, ''),
      ].filter(Boolean)

      matchingVideo = (comparisonVideosData as any[]).find((video) => {
        const relatedLower = (video.relatedCars || []).map((rc: string) => rc.toLowerCase())
        const hasCar1 = car1Ids.some((id) => relatedLower.includes(id))
        const hasCar2 = car2Ids.some((id) => relatedLower.includes(id))
        return hasCar1 && hasCar2
      })
    }

    if (matchingVideo) {
      videoSchema = {
        '@context': 'https://schema.org',
        '@type': 'VideoObject',
        name: matchingVideo.title,
        description:
          matchingVideo.description ||
          `${selected[0].brand} ${selected[0].model} vs ${selected[1].brand} ${selected[1].model} comparison.`,
        thumbnailUrl: `https://i.ytimg.com/vi/${matchingVideo.youtubeId}/hqdefault.jpg`,
        embedUrl: `https://www.youtube-nocookie.com/embed/${matchingVideo.youtubeId}`,
        uploadDate: matchingVideo.publishedAt || '2026-09-15',
      }
    }
  }

  return (
    <>
      {videoSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(videoSchema) }}
        />
      )}
      {children}
    </>
  )
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
  const baseUrl = 'https://www.phevs.eu'
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

  const defaultTitle = selected.length >= 2
    ? `${selected[0].brand} ${selected[0].model} vs ${selected[1].brand} ${selected[1].model} PHEV Comparison: Specs & Range Compared | PHEVs.eu`
    : 'PHEV Comparison: Specs & Range Compared | PHEVs.eu'

  const description = selected.length >= 2
    ? `Compare ${selected[0].brand} ${selected[0].model} and ${selected[1].brand} ${selected[1].model} Plug-in Hybrid (PHEV) models by electric range (${selected[0].ev_range_km} km vs ${selected[1].ev_range_km} km), battery capacity (${selected[0].battery_kwh} kWh vs ${selected[1].battery_kwh} kWh), power (${selected[0].power_hp} HP vs ${selected[1].power_hp} HP) and fuel consumption.`
    : 'Compare Plug-in Hybrid (PHEV) models by electric range, battery capacity, charging time, power, and technical specs.'

  const finalTitle = customCompare?.metaTitle
    ? (customCompare.metaTitle.includes('PHEVs.eu') ? customCompare.metaTitle : `${customCompare.metaTitle} | PHEVs.eu`)
    : defaultTitle
  const finalDescription = customCompare?.metaDescription
    ? `${customCompare.metaDescription} Plug-in Hybrid (PHEV) technical specs and detailed comparison.`
    : description

  // Crawl budget & thin content protection:
  // Only index curated comparisons with actual search volume / editor curation.
  // Combinatorial pairs (out of ~9,870 possibilities) remain functional for users with noindex, follow.
  const isCuratedComparison = Boolean(customCompare)
  const compareCanonicalUrl = `${baseUrl}/compare/${slug}/`

  return {
    title: finalTitle,
    description: finalDescription,
    robots: isCuratedComparison
      ? { index: true, follow: true }
      : { index: false, follow: true },
    alternates: {
      canonical: compareCanonicalUrl,
      languages: {
        'x-default': compareCanonicalUrl,
        en: compareCanonicalUrl,
        de: compareCanonicalUrl,
        fr: compareCanonicalUrl,
        es: compareCanonicalUrl,
        tr: compareCanonicalUrl,
        pl: compareCanonicalUrl,
      },
    },
    openGraph: {
      title: finalTitle,
      description: finalDescription,
      type: 'website',
      url: compareCanonicalUrl,
      siteName: 'PHEVs.eu',
    },
  }
}


