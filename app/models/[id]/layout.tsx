import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import carsData from '@/data/cars.json'
import { getImageUrl } from '@/lib/image-url'

function findCar(id: string) {
  if (!id) return null
  const normalized = decodeURIComponent(id).toLowerCase().trim()
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
  const baseUrl = 'https://phevs.eu'
  const car = findCar(id)

  if (!car) {
    return <>{children}</>
  }

  const modelUrl = `${baseUrl}/models/${car.slug || car.id}`
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
        "emissionsCO2": car.co2_emission ? `${car.co2_emission} g/km` : undefined,
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
  const baseUrl = 'https://phevs.eu'

  const car = findCar(id)

  // Eğer araç bulunamazsa 404 döndür
  if (!car) {
    notFound()
  }

  const title = `${car.brand} ${car.model} (${car.year}) Plug-in Hybrid (PHEV) Specs & Range | PHEVs.eu`
  const description = `${car.brand} ${car.model} (${car.year}) Plug-in Hybrid (PHEV) technical specs: ${car.ev_range_km} km electric range, ${car.battery_kwh} kWh battery${car.usable_battery_kwh ? ` (${car.usable_battery_kwh} kWh net)` : ''}, ${car.power_hp} HP system output and ${car.fuel_consumption} L/100km fuel consumption.`
  const canonicalUrl = `${baseUrl}/models/${car.slug || car.id}`

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
        tr: canonicalUrl,
        de: canonicalUrl,
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

