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
  params,
}: {
  children: React.ReactNode
  params: { id: string }
}) {
  const id = params.id
  const baseUrl = 'https://www.phevs.eu'
  const car = (carsData as any[]).find((c) => c.id === id || c.slug === id)

  if (!car) {
    return <>{children}</>
  }

  const modelUrl = `${baseUrl}/models/${car.slug || car.id}`
  const imageUrl = car.image_url?.startsWith('http') ? car.image_url : `${baseUrl}${car.image_url || ''}`

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

