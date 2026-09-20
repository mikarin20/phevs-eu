import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import carsData from '@/data/cars.json'
import { getImageUrl } from '@/lib/image-url'
import { ArrowLeftIcon, BoltIcon, Battery100Icon, SparklesIcon, CheckCircleIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline'

export const metadata: Metadata = {
  title: 'Longest Range PHEVs (100+ km) — Best Electric Range 2026 | PHEVs.eu',
  description: 'Explore all plug-in hybrid electric vehicles (PHEVs) offering over 100 km of official WLTP electric range. Compare battery size, charging speeds, and real-world efficiency.',
  alternates: {
    canonical: 'https://www.phevs.eu/longest-range-phev/',
    languages: {
      'x-default': 'https://www.phevs.eu/longest-range-phev/',
      en: 'https://www.phevs.eu/longest-range-phev/',
      de: 'https://www.phevs.eu/longest-range-phev/',
      tr: 'https://www.phevs.eu/longest-range-phev/',
      pl: 'https://www.phevs.eu/longest-range-phev/',
    }
  },
  openGraph: {
    title: 'Longest Range PHEVs (100+ km) | PHEVs.eu',
    description: 'Compare all plug-in hybrid models with 100+ km pure electric range in Europe. Full specs, battery capacities, and charging performance.',
    url: 'https://www.phevs.eu/longest-range-phev/',
    type: 'website',
    siteName: 'PHEVs.eu',
    images: [{ url: '/images/og-image.jpg', width: 1200, height: 630, alt: 'Longest Range PHEVs' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Longest Range PHEVs (100+ km) | PHEVs.eu',
    description: 'Plug-in hybrids with over 100 km pure electric range. Real WLTP data and specs.',
    images: ['/images/og-image.jpg']
  }
}

export default function LongestRangePhevPage() {
  const baseUrl = 'https://www.phevs.eu'
  
  // Filter models with >= 100 km electric range, sorted descending by range
  const models = (carsData as any[])
    .filter(c => c.ev_range_km >= 100)
    .sort((a, b) => b.ev_range_km - a.ev_range_km)

  const topRange = models[0]?.ev_range_km || 145

  const faqs = [
    {
      question: 'Which PHEV has the longest electric range in Europe?',
      answer: `Currently, models like the Omoda 9 (${topRange} km), Volkswagen Golf eHybrid (143 km), Audi A3 Sportback (133 km), and Volkswagen Passat Variant (133 km) lead the market with WLTP electric ranges exceeding 130 km on a single charge.`
    },
    {
      question: 'Can a PHEV with 100+ km electric range replace a pure EV for daily driving?',
      answer: 'Yes. With typical European daily commutes averaging 30–50 km, a 100+ km electric range allows most drivers to complete their daily journeys 100% on electric power without using any petrol, while retaining the unlimited highway road-trip flexibility of the combustion engine.'
    },
    {
      question: 'How large are the batteries in these long-range plug-in hybrids?',
      answer: 'Long-range PHEVs typically feature battery capacities between 19.7 kWh net (25.7 kWh gross in Volkswagen Group MQB evo models) and 31.2 kWh (in Mercedes-Benz GLC and GLE models).'
    },
    {
      question: 'Do long-range PHEVs support DC fast charging?',
      answer: 'Many modern 100+ km PHEVs support DC rapid charging (up to 50 kW or 60 kW), including models from Mercedes-Benz, Volkswagen, Audi, Škoda, and Mitsubishi, allowing an 10–80% battery recharge in about 25 minutes.'
    }
  ]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${baseUrl}/longest-range-phev#page`,
        'url': `${baseUrl}/longest-range-phev`,
        'name': 'PHEV Models with Longest Electric Range (100+ km)',
        'description': 'Comprehensive catalogue of plug-in hybrid cars exceeding 100 km of WLTP electric range.',
        'mainEntity': {
          '@type': 'ItemList',
          'numberOfItems': models.length,
          'itemListElement': models.map((car, idx) => ({
            '@type': 'ListItem',
            'position': idx + 1,
            'name': `${car.brand} ${car.model} (${car.year})`,
            'url': `${baseUrl}/models/${car.slug || car.id}`
          }))
        }
      },
      {
        '@type': 'FAQPage',
        'mainEntity': faqs.map(f => ({
          '@type': 'Question',
          'name': f.question,
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': f.answer
          }
        }))
      },
      {
        '@type': 'BreadcrumbList',
        'itemListElement': [
          { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': baseUrl },
          { '@type': 'ListItem', 'position': 2, 'name': 'Longest Range PHEVs', 'item': `${baseUrl}/longest-range-phev` }
        ]
      }
    ]
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">
        {/* Navigation Bar */}
        <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/80 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Link href="/" className="inline-flex items-center space-x-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
              <ArrowLeftIcon className="h-4 w-4" />
              <span className="text-sm font-medium">All PHEVs</span>
            </Link>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              Curated Category
            </span>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-950 py-16 sm:py-24 border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-6">
              <Battery100Icon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              100+ KM Electric Range
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-tight">
              PHEVs with the <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">Longest Electric Range</span>
            </h1>

            <p className="mt-6 text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Explore Europe&apos;s longest-range plug-in hybrids offering over 100 km of pure electric driving. Daily commutes with zero tailpipe emissions, backed by petrol engines for unlimited road trip range.
            </p>

            {/* Quick Stats Pills */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-6">
              <div className="px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-sm">
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{models.length}</span> Models Available
              </div>
              <div className="px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-sm">
                Up to <span className="font-bold text-emerald-600 dark:text-emerald-400">{topRange} km</span> WLTP Range
              </div>
              <div className="px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-sm">
                Batteries up to <span className="font-bold text-emerald-600 dark:text-emerald-400">31.2 kWh</span>
              </div>
            </div>
          </div>
        </section>

        {/* Vehicles Grid */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Ranked by Pure Electric Range (WLTP)
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Showing all {models.length} homologated plug-in hybrids delivering 100 km or more
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {models.map((car) => {
              const modelUrl = `/models/${car.slug || car.id}`
              const dcPower = car.charging_capabilities?.dc_power || car.dc_max_power_kw

              return (
                <div
                  key={car.id || car.slug}
                  className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-xl hover:border-emerald-500/50 dark:hover:border-emerald-500/50 transition-all duration-300 flex flex-col"
                >
                  {/* Image Container */}
                  <div className="relative aspect-[16/10] bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    {car.image_url ? (
                      <img
                        src={getImageUrl(car.image_url)}
                        alt={`${car.brand} ${car.model}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">No Image</div>
                    )}

                    {/* Range Badge */}
                    <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-bold shadow-md flex items-center gap-1">
                      <BoltIcon className="w-3.5 h-3.5" />
                      {car.ev_range_km} km EV
                    </div>

                    {/* DC Badge if available */}
                    {dcPower && (
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-cyan-300 text-xs font-medium">
                        {dcPower} kW DC
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        {car.brand} • {car.year}
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {car.brand} {car.model}
                      </h3>

                      {/* Specs Row */}
                      <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
                        <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                          <div className="text-xs text-slate-500 dark:text-slate-400">Battery</div>
                          <div className="text-sm font-bold text-slate-800 dark:text-slate-200">{car.battery_kwh} kWh</div>
                        </div>
                        <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                          <div className="text-xs text-slate-500 dark:text-slate-400">Power</div>
                          <div className="text-sm font-bold text-slate-800 dark:text-slate-200">{car.power_hp} HP</div>
                        </div>
                        <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                          <div className="text-xs text-slate-500 dark:text-slate-400">Fuel</div>
                          <div className="text-sm font-bold text-slate-800 dark:text-slate-200">{car.fuel_consumption} L</div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <Link
                        href={modelUrl}
                        className="w-full inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-medium text-sm hover:bg-emerald-600 dark:hover:bg-emerald-400 transition-colors shadow-sm"
                      >
                        View Full Specifications →
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Clean Overview Table for GEO & AI Bots */}
          <section className="mt-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2">
              100+ km Electric Range PHEV Comparison Table
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              Side-by-side technical comparison of European plug-in hybrids sorted by WLTP electric range.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm divide-y divide-slate-200 dark:divide-slate-800">
                <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 text-xs uppercase font-semibold">
                  <tr>
                    <th className="px-4 py-3">Vehicle</th>
                    <th className="px-4 py-3">EV Range</th>
                    <th className="px-4 py-3">Battery</th>
                    <th className="px-4 py-3">System Power</th>
                    <th className="px-4 py-3">WLTP Fuel</th>
                    <th className="px-4 py-3">DC Fast Charge</th>
                    <th className="px-4 py-3 text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {models.map((car) => (
                    <tr key={car.id || car.slug} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">
                        {car.brand} {car.model}
                      </td>
                      <td className="px-4 py-3 font-bold text-emerald-600 dark:text-emerald-400">
                        {car.ev_range_km} km
                      </td>
                      <td className="px-4 py-3">{car.battery_kwh} kWh</td>
                      <td className="px-4 py-3">{car.power_hp} HP</td>
                      <td className="px-4 py-3">{car.fuel_consumption} L/100km</td>
                      <td className="px-4 py-3">
                        {car.dc_charging_supported || car.charging_capabilities?.dc_power ? (
                          <span className="text-emerald-600 font-medium">Yes ({car.charging_capabilities?.dc_power || car.dc_max_power_kw || 'Yes'} kW)</span>
                        ) : (
                          <span className="text-slate-400">No</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link href={`/models/${car.slug || car.id}`} className="text-emerald-600 hover:underline font-medium">
                          Specs →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Frequently Asked Questions */}
          <section className="mt-16 max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                Frequently Asked Questions
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                Everything you need to know about long-range plug-in hybrid electric vehicles
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <QuestionMarkCircleIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                    {faq.question}
                  </h3>
                  <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed pl-7">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </>
  )
}
