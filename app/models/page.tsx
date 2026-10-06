import type { Metadata } from 'next'
import Link from 'next/link'
import carsData from '@/data/cars.json'
import ModelsCatalogClient from '@/components/ModelsCatalogClient'
import {
  BoltIcon,
  Battery100Icon,
  SparklesIcon,
  CalculatorIcon,
  ArrowTopRightOnSquareIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline'

export const metadata: Metadata = {
  title: 'All Plug-in Hybrid Models (2026) — Complete European PHEV Catalog | PHEVs.eu',
  description: 'Explore the complete database of 2026 Plug-in Hybrid (PHEV) vehicles in Europe. Filter by electric range, battery kWh, CCS2 DC fast charging, and simulate commute efficiency.',
  alternates: {
    canonical: 'https://www.phevs.eu/models/',
    languages: {
      'x-default': 'https://www.phevs.eu/models/',
      en: 'https://www.phevs.eu/models/',
      de: 'https://www.phevs.eu/models/',
      tr: 'https://www.phevs.eu/models/',
      pl: 'https://www.phevs.eu/models/',
      fr: 'https://www.phevs.eu/models/',
      es: 'https://www.phevs.eu/models/',
    }
  },
  openGraph: {
    title: 'All Plug-in Hybrid Models (2026) — European PHEV Catalog | PHEVs.eu',
    description: 'Complete European directory of Plug-in Hybrids (PHEVs). Filter by real range, DC charging speed, powertrain architectures, and calculate winter commute range.',
    url: 'https://www.phevs.eu/models/',
    type: 'website',
    siteName: 'PHEVs.eu',
    images: [{ url: 'https://www.phevs.eu/images/og-image.jpg', width: 1200, height: 630, alt: 'European PHEV Models Catalog' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'All Plug-in Hybrid Models (2026) — Complete Catalog | PHEVs.eu',
    description: 'Filter and compare all 2026 European plug-in hybrids by electric range, battery chemistry, and DC charging support.',
    images: ['https://www.phevs.eu/images/og-image.jpg']
  }
}

export default function ModelsPage() {
  const cars = carsData as any[]

  // Aggregated metrics
  const totalModels = cars.length
  const dcCapableCount = cars.filter(c => c.dc_charging_supported || (c.charging_capabilities?.dc_power && c.charging_capabilities.dc_power > 0)).length
  const maxRangeCar = [...cars].sort((a, b) => (b.ev_range_km || 0) - (a.ev_range_km || 0))[0]
  const avgRange = Math.round(cars.reduce((acc, c) => acc + (c.ev_range_km || 0), 0) / (cars.length || 1))

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": "https://www.phevs.eu/models/#webpage",
        "url": "https://www.phevs.eu/models/",
        "name": "All Plug-in Hybrid Models (2026) — Complete European PHEV Catalog",
        "description": "Comprehensive directory and technical specifications of all plug-in hybrid electric vehicles available in the European market.",
        "isPartOf": {
          "@type": "WebSite",
          "@id": "https://www.phevs.eu/#website",
          "name": "PHEVs.eu",
          "url": "https://www.phevs.eu/"
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://www.phevs.eu/models/#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://www.phevs.eu/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "PHEV Models",
            "item": "https://www.phevs.eu/models/"
          }
        ]
      },
      {
        "@type": "ItemList",
        "@id": "https://www.phevs.eu/models/#itemlist",
        "name": "European Plug-in Hybrid Models",
        "numberOfItems": cars.length,
        "itemListElement": cars.map((car, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "name": `${car.brand} ${car.model} (${car.year})`,
          "url": `https://www.phevs.eu/models/${car.slug || car.id}/`
        }))
      }
    ]
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-8 sm:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Breadcrumb nav */}
        <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Home
          </Link>
          <ChevronRightIcon className="w-3.5 h-3.5" />
          <span className="text-slate-800 dark:text-slate-200 font-medium">Models Catalog</span>
        </nav>

        {/* Page Header */}
        <header className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            <SparklesIcon className="w-4 h-4" />
            <span>2026 European Market Catalog</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            European Plug-in Hybrid <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">PHEV Models</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-4xl leading-relaxed">
            Browse Europe&apos;s most exhaustive database of plug-in hybrid electric vehicles. Analyze real battery capacities, AC/DC charging curves, WLTP electric ranges, and corporate tax compliance across {totalModels} verified vehicles.
          </p>

          {/* KPI Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-4">
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">Catalog Models</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white mt-1 block">{totalModels}</span>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">Max WLTP Range</span>
              <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 block">
                {maxRangeCar?.ev_range_km || 143} km
              </span>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">Average Electric Range</span>
              <span className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1 block">{avgRange} km</span>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">CCS2 DC Fast Charging</span>
              <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1 block">{dcCapableCount} Models</span>
            </div>
          </div>
        </header>

        {/* Featured Tools Banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-200 uppercase tracking-wider">
              <CalculatorIcon className="w-4 h-4" />
              <span>Simulate Real-World Driving</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold">
              Planning winter motorway trips or daily commutes?
            </h2>
            <p className="text-sm text-blue-100 max-w-2xl">
              WLTP figures drop up to 35% in freezing temperatures or at 130 km/h highway speeds. Test any model in our interactive range simulator with temperature, HVAC, and speed profiles.
            </p>
          </div>
          <Link
            href="/range-calculator/"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-blue-700 font-bold text-sm shadow hover:bg-blue-50 transition-colors whitespace-nowrap self-stretch md:self-auto justify-center"
          >
            <span>Launch Range Calculator</span>
            <ArrowTopRightOnSquareIcon className="w-4 h-4" />
          </Link>
        </div>

        {/* Client-side Catalog with Search, Brand Pills, and Sorting */}
        <section aria-label="Vehicle Catalog Grid">
          <ModelsCatalogClient cars={cars} />
        </section>

        {/* SEO Editorial Content Pillar */}
        <section className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 text-slate-700 dark:text-slate-300">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Navigating Modern Plug-in Hybrids (PHEVs) in Europe
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm leading-relaxed">
            <div className="space-y-3">
              <h3 className="font-semibold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Battery100Icon className="w-5 h-5 text-blue-600" />
                Next-Gen Battery Chemistries: LFP vs NMC
              </h3>
              <p>
                European 2026 PHEVs now feature usable battery capacities exceeding 20 kWh, matching early pure EVs. Chinese models (BYD, Jaecoo, Chery) predominantly deploy <strong>Lithium Iron Phosphate (LFP)</strong> Blade packs for high cycle longevity and safety, while European architectures (Volkswagen Group MQB evo, BMW, Mercedes-Benz) favor <strong>Nickel Manganese Cobalt (NMC)</strong> for superior winter discharge rates and gravimetric energy density.
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <BoltIcon className="w-5 h-5 text-indigo-600" />
                The Revolution of DC Fast Charging (CCS2)
              </h3>
              <p>
                Historically restricted to slow 3.7 kW or 7.4 kW single-phase AC charging taking 4-6 hours, newer generation PHEVs like the VW Passat eHybrid, Skoda Superb iV, and Mercedes C 300 e offer up to <strong>50 kW CCS2 DC fast charging</strong>. This allows a 10% to 80% recharge in under 25 minutes, making pure-electric long-distance commuting truly feasible without relying on petrol engines.
              </p>
            </div>
          </div>
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap gap-4 text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>Related portals:</span>
            <Link href="/longest-range-phev/" className="text-blue-600 dark:text-blue-400 hover:underline">
              Longest Range PHEVs (100+ km) →
            </Link>
            <Link href="/range-calculator/" className="text-blue-600 dark:text-blue-400 hover:underline">
              Interactive Range Simulator →
            </Link>
            <Link href="/blog/" className="text-blue-600 dark:text-blue-400 hover:underline">
              Automotive Technology & BiK Tax Guides →
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
