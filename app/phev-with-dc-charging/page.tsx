import type { Metadata } from 'next'
import Link from 'next/link'
import carsData from '@/data/cars.json'
import { getImageUrl } from '@/lib/image-url'
import { ArrowLeftIcon, BoltIcon, SparklesIcon, CheckCircleIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline'

export const metadata: Metadata = {
  title: 'PHEVs with DC Fast Charging (CCS & CHAdeMO) | PHEVs.eu',
  description: 'Complete database of all plug-in hybrid electric vehicles (PHEVs) supporting DC fast charging in Europe. Compare 22 kW, 40 kW, 50 kW, and 60 kW DC rapid charging times and specs.',
  alternates: {
    canonical: 'https://www.phevs.eu/phev-with-dc-charging/',
    languages: {
      'x-default': 'https://www.phevs.eu/phev-with-dc-charging/',
      en: 'https://www.phevs.eu/phev-with-dc-charging/',
      de: 'https://www.phevs.eu/phev-with-dc-charging/',
      tr: 'https://www.phevs.eu/phev-with-dc-charging/',
      pl: 'https://www.phevs.eu/phev-with-dc-charging/',
    }
  },
  openGraph: {
    title: 'PHEVs with DC Fast Charging | PHEVs.eu',
    description: 'Find every plug-in hybrid car that can fast charge at public highway DC rapid chargers (10–80% in ~25 min).',
    url: 'https://www.phevs.eu/phev-with-dc-charging/',
    type: 'website',
    siteName: 'PHEVs.eu',
    images: [{ url: '/images/og-image.jpg', width: 1200, height: 630, alt: 'PHEVs with DC Fast Charging' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PHEVs with DC Fast Charging | PHEVs.eu',
    description: 'Compare DC fast-charging plug-in hybrids. Full specifications, charging curves, and speed ratings.',
    images: ['/images/og-image.jpg']
  }
}

export default function PhevWithDcChargingPage() {
  const baseUrl = 'https://www.phevs.eu'

  // Filter models supporting DC fast charging, sorted by DC power (descending) then brand
  const models = (carsData as any[])
    .filter(c => c.dc_charging_supported || (c.charging_capabilities && c.charging_capabilities.dc_power > 0) || (c.charging_port && c.charging_port.dc_type))
    .sort((a, b) => {
      const pA = a.charging_capabilities?.dc_power || a.dc_max_power_kw || 20
      const pB = b.charging_capabilities?.dc_power || b.dc_max_power_kw || 20
      return pB - pA
    })

  const maxDcPower = Math.max(...models.map(c => c.charging_capabilities?.dc_power || c.dc_max_power_kw || 50))

  const faqs = [
    {
      question: 'Can all plug-in hybrid cars use DC fast chargers?',
      answer: 'No. The vast majority of older or entry-level PHEVs only support AC destination charging (usually 3.7 kW or 7.4 kW Type 2). Only select, modern plug-in hybrids equipped with a CCS Combo 2 or CHAdeMO port can plug into high-speed DC rapid chargers.'
    },
    {
      question: 'Which plug-in hybrids offer the fastest DC charging speed?',
      answer: 'The Mercedes-Benz GLC and GLE lead with up to 60 kW DC charging power, followed closely by the Volkswagen Group models (Volkswagen Golf, Passat, Tiguan, Audi Q3, Škoda Superb, Kodiaq) supporting up to 50 kW DC.'
    },
    {
      question: 'How fast does a DC-capable PHEV charge from 10% to 80%?',
      answer: 'On a 50 kW or higher DC rapid charger, most DC-capable PHEVs can recharge from 10% to 80% state-of-charge in approximately 20 to 26 minutes, making them convenient for a quick coffee break on longer journeys.'
    },
    {
      question: 'Is DC rapid charging safe for plug-in hybrid batteries?',
      answer: 'Yes. Manufacturers incorporate sophisticated liquid thermal management systems and active battery management (BMS) to regulate cell temperatures and charging curves, preserving battery longevity.'
    }
  ]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${baseUrl}/phev-with-dc-charging#page`,
        'url': `${baseUrl}/phev-with-dc-charging`,
        'name': 'PHEV Models with DC Fast Charging (CCS & CHAdeMO)',
        'description': 'Comprehensive directory of all plug-in hybrid vehicles supporting DC rapid charging in Europe.',
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
          { '@type': 'ListItem', 'position': 2, 'name': 'DC Fast Charging PHEVs', 'item': `${baseUrl}/phev-with-dc-charging` }
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
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-cyan-100 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-800">
              High-Demand Category
            </span>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-cyan-50/50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-950 py-16 sm:py-24 border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-50 dark:bg-cyan-950/50 border border-cyan-200 dark:border-cyan-800 text-cyan-700 dark:text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-6">
              <BoltIcon className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              CCS & CHAdeMO Compatible
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-tight">
              PHEVs with <span className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">DC Fast Charging</span>
            </h1>

            <p className="mt-6 text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Never wait hours for your battery to charge. Discover all rare plug-in hybrids equipped with DC rapid charging ports, enabling 10% to 80% charge in ~25 minutes at highway motorway stations.
            </p>

            {/* Quick Stats Pills */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-6">
              <div className="px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-sm">
                <span className="font-bold text-cyan-600 dark:text-cyan-400">{models.length}</span> DC-Capable Models
              </div>
              <div className="px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-sm">
                Up to <span className="font-bold text-cyan-600 dark:text-cyan-400">{maxDcPower} kW</span> DC Power
              </div>
              <div className="px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-sm">
                10–80% in <span className="font-bold text-cyan-600 dark:text-cyan-400">~25 min</span>
              </div>
            </div>
          </div>
        </section>

        {/* Vehicles Grid */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                All DC Fast Charging Plug-in Hybrids
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Showing all {models.length} vehicles supporting DC rapid charging protocols
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {models.map((car) => {
              const modelUrl = `/models/${car.slug || car.id}`
              const dcPower = car.charging_capabilities?.dc_power || car.dc_max_power_kw || 'Yes'

              return (
                <div
                  key={car.id || car.slug}
                  className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-xl hover:border-cyan-500/50 dark:hover:border-cyan-500/50 transition-all duration-300 flex flex-col"
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

                    {/* DC Badge */}
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-cyan-600 text-white text-xs font-bold shadow-md flex items-center gap-1">
                      <BoltIcon className="w-3.5 h-3.5" />
                      {dcPower} kW DC Rapid
                    </div>

                    {/* Range Badge */}
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-emerald-300 text-xs font-medium">
                      {car.ev_range_km} km EV
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        {car.brand} • {car.year}
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                        {car.brand} {car.model}
                      </h3>

                      {/* Specs Row */}
                      <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
                        <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                          <div className="text-xs text-slate-500 dark:text-slate-400">Battery</div>
                          <div className="text-sm font-bold text-slate-800 dark:text-slate-200">{car.battery_kwh} kWh</div>
                        </div>
                        <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                          <div className="text-xs text-slate-500 dark:text-slate-400">EV Range</div>
                          <div className="text-sm font-bold text-slate-800 dark:text-slate-200">{car.ev_range_km} km</div>
                        </div>
                        <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                          <div className="text-xs text-slate-500 dark:text-slate-400">Power</div>
                          <div className="text-sm font-bold text-slate-800 dark:text-slate-200">{car.power_hp} HP</div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <Link
                        href={modelUrl}
                        className="w-full inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-medium text-sm hover:bg-cyan-600 dark:hover:bg-cyan-400 transition-colors shadow-sm"
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
              DC Fast Charging PHEV Specifications Table
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              Complete technical breakdown of DC power ratings, plug types, and battery capacities.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm divide-y divide-slate-200 dark:divide-slate-800">
                <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 text-xs uppercase font-semibold">
                  <tr>
                    <th className="px-4 py-3">Vehicle</th>
                    <th className="px-4 py-3">Max DC Power</th>
                    <th className="px-4 py-3">EV Range</th>
                    <th className="px-4 py-3">Battery</th>
                    <th className="px-4 py-3">Plug Standard</th>
                    <th className="px-4 py-3">Power</th>
                    <th className="px-4 py-3 text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {models.map((car) => {
                    const dcP = car.charging_capabilities?.dc_power || car.dc_max_power_kw || 'Supported'
                    const dcType = car.charging_port?.dc_type || 'CCS Combo 2'
                    return (
                      <tr key={car.id || car.slug} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                        <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">
                          {car.brand} {car.model}
                        </td>
                        <td className="px-4 py-3 font-bold text-cyan-600 dark:text-cyan-400">
                          {dcP} kW DC
                        </td>
                        <td className="px-4 py-3 font-semibold">{car.ev_range_km} km</td>
                        <td className="px-4 py-3">{car.battery_kwh} kWh</td>
                        <td className="px-4 py-3 text-slate-500">{dcType}</td>
                        <td className="px-4 py-3">{car.power_hp} HP</td>
                        <td className="px-4 py-3 text-right">
                          <Link href={`/models/${car.slug || car.id}`} className="text-cyan-600 hover:underline font-medium">
                            Specs →
                          </Link>
                        </td>
                      </tr>
                    )
                  })}
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
                Learn how DC rapid charging operates in modern plug-in hybrid cars
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <QuestionMarkCircleIcon className="w-5 h-5 text-cyan-600 dark:text-cyan-400 flex-shrink-0" />
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
