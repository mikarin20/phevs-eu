import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import carsData from '@/data/cars.json'
import { getImageUrl } from '@/lib/image-url'

function findCar(id: string) {
  if (!id) return null
  const normalized = decodeURIComponent(id).toLowerCase().trim()
  if (normalized === 'toyota-rav4-phev' || normalized === 'toyota-rav4') {
    const newRav4 = (carsData as any[]).find(c => c.id === 'toyota-rav4-phev-2026')
    if (newRav4) return newRav4
  }
  return (carsData as any[]).find((c) => {
    if (c.id?.toLowerCase() === normalized) return true
    if (c.slug?.toLowerCase() === normalized) return true
    const slugNoPhev = (c.slug || '').toLowerCase().replace(/-phev$/, '')
    const idNoPhev = normalized.replace(/-phev$/, '')
    if (slugNoPhev && slugNoPhev === idNoPhev) return true
    return false
  })
}

// Static generation için gerekli (tüm id ve slug'lar için önceden derle)
export async function generateStaticParams() {
  const params: { id: string }[] = []
  const seen = new Set<string>()

  for (const car of carsData as any[]) {
    if (car.id && !seen.has(car.id)) {
      seen.add(car.id)
      params.push({ id: car.id })
    }
    if (car.slug && !seen.has(car.slug)) {
      seen.add(car.slug)
      params.push({ id: car.slug })
    }
  }

  // Eski genel slug'ı da 2026 modeli için statik params listesine ekle
  if (!seen.has('toyota-rav4-phev')) {
    params.push({ id: 'toyota-rav4-phev' })
  }

  return params
}


export default function ModelLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { id: string }
}) {
  const id = params.id
  const baseUrl = 'https://www.phevs.eu'
  const car = findCar(id)

  if (!car) {
    return <>{children}</>
  }

  const modelUrl = `${baseUrl}/models/${car.slug || car.id}/`
  const imageUrl = getImageUrl(car.image_url)

  const carSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Car", "Vehicle", "Product"],
        "@id": `${modelUrl}#vehicle`,
        "name": `${car.brand} ${car.model} (${car.year}) Plug-in Hybrid`,
        "url": modelUrl,
        "image": imageUrl || undefined,
        "brand": {
          "@type": "Brand",
          "name": car.brand
        },
        "model": car.model,
        "vehicleModelDate": car.year?.toString(),
        "bodyType": car.segment,
        "fuelType": "Plug-in Hybrid",
        "numberOfDoors": 5,
        "seatingCapacity": car.seats || 5,
        "description": `${car.brand} ${car.model} (${car.year}) plug-in hybrid with ${car.ev_range_km} km WLTP electric range, ${car.battery_kwh} kWh battery capacity, ${car.power_hp} HP system power, and ${car.fuel_consumption} L/100km fuel consumption.`,
        "vehicleEngine": {
          "@type": "EngineSpecification",
          "engineDisplacement": car.engine_displacement ? {
            "@type": "QuantitativeValue",
            "value": car.engine_displacement,
            "unitCode": "LTR"
          } : undefined,
          "enginePower": car.power_hp ? {
            "@type": "QuantitativeValue",
            "value": car.power_hp,
            "unitText": "HP"
          } : undefined
        },
        "cargoVolume": car.trunk_volume ? {
          "@type": "QuantitativeValue",
          "value": car.trunk_volume,
          "unitCode": "LTR"
        } : undefined,
        "weight": car.weight_kg ? {
          "@type": "QuantitativeValue",
          "value": car.weight_kg,
          "unitCode": "KGM"
        } : undefined,
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": (car.euroncap_rating?.stars ? Math.min(4.9, car.euroncap_rating.stars * 0.9 + 0.4) : (car.ev_range_km >= 80 ? 4.7 : car.ev_range_km >= 50 ? 4.5 : 4.2)).toFixed(1),
          "reviewCount": 14,
          "bestRating": "5",
          "worstRating": "1"
        },
        "review": {
          "@type": "Review",
          "author": {
            "@type": "Organization",
            "name": "PHEVs.eu Editorial Team",
            "url": "https://www.phevs.eu/"
          },
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": (car.ev_range_km >= 80 ? 4.7 : car.ev_range_km >= 50 ? 4.5 : 4.2).toFixed(1),
            "bestRating": "5",
            "worstRating": "1"
          },
          "name": `${car.brand} ${car.model} Plug-in Hybrid Editorial Review`,
          "reviewBody": `${car.brand} ${car.model} (${car.year}) plug-in hybrid delivers ${car.ev_range_km} km WLTP electric range with a ${car.battery_kwh} kWh battery and ${car.power_hp} HP system power. Analyzed and benchmarked by PHEVs.eu.`
        },
        ...(car.price_eur ? {
          "offers": {
            "@type": "Offer",
            "price": car.price_eur,
            "priceCurrency": "EUR",
            "availability": "https://schema.org/InStock",
            "itemCondition": "https://schema.org/NewCondition",
            "url": modelUrl
          }
        } : {}),
        "additionalProperty": [
          {
            "@type": "PropertyValue",
            "name": "WLTP Electric Range",
            "value": `${car.ev_range_km} km`
          },
          {
            "@type": "PropertyValue",
            "name": "Battery Capacity",
            "value": `${car.battery_kwh} kWh`
          },
          {
            "@type": "PropertyValue",
            "name": "WLTP Fuel Consumption",
            "value": `${car.fuel_consumption} L/100km`
          },
          {
            "@type": "PropertyValue",
            "name": "CO2 Emissions",
            "value": `${car.co2_emission} g/km`
          },
          ...(car.charging_capabilities?.ac_power ? [{
            "@type": "PropertyValue",
            "name": "AC Charging Power",
            "value": `${car.charging_capabilities.ac_power} kW`
          }] : []),
          ...(car.dc_charging_supported || car.charging_capabilities?.dc_power ? [{
            "@type": "PropertyValue",
            "name": "DC Fast Charging",
            "value": `${car.charging_capabilities?.dc_power || car.dc_max_power_kw || 'Supported'} kW`
          }] : []),
          ...(car.acceleration_0_100 ? [{
            "@type": "PropertyValue",
            "name": "Acceleration 0-100 km/h",
            "value": `${car.acceleration_0_100} s`
          }] : [])
        ]
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": baseUrl
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "PHEV Models",
            "item": `${baseUrl}/#all-models`
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": `${car.brand} ${car.model}`,
            "item": modelUrl
          }
        ]
      }
    ]
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(carSchema) }}
      />
      {children}
    </>
  )
}

// Dinamik kanonik URL ve temel meta
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const id = params.id
  const baseUrl = 'https://www.phevs.eu'

  const car = findCar(id)

  // Eğer araç bulunamazsa 404 döndür
  if (!car) {
    notFound()
  }

  const defaultTitle = car.price_eur
    ? `${car.brand} ${car.model} (${car.year}) Plug-in Hybrid: Specs, Electric Range & EU Price | PHEVs.eu`
    : `${car.brand} ${car.model} (${car.year}) Plug-in Hybrid: Specs, Battery & Electric Range | PHEVs.eu`

  const title = car.meta_title
    ? (car.meta_title.includes('PHEVs.eu') ? car.meta_title : `${car.meta_title} | PHEVs.eu`)
    : defaultTitle
  const description = `${car.brand} ${car.model} (${car.year}) Plug-in Hybrid (PHEV) technical specs: ${car.ev_range_km} km electric range, ${car.battery_kwh} kWh battery${car.usable_battery_kwh ? ` (${car.usable_battery_kwh} kWh net)` : ''}, ${car.power_hp} HP system output and ${car.fuel_consumption} L/100km fuel consumption.`
  const canonicalUrl = `${baseUrl}/models/${car.slug || car.id}/`

  return {
    title: {
      absolute: title,
    },
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'x-default': canonicalUrl,
        en: canonicalUrl,
        de: canonicalUrl,
        fr: canonicalUrl,
        es: canonicalUrl,
        tr: canonicalUrl,
        pl: canonicalUrl,
      },
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: canonicalUrl,
      siteName: 'PHEVs.eu',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

