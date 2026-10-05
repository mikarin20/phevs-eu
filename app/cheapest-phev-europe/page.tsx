import type { Metadata } from 'next'
import Link from 'next/link'
import carsData from '@/data/cars.json'
import { getImageUrl } from '@/lib/image-url'
import { BoltIcon, BanknotesIcon, SparklesIcon, QuestionMarkCircleIcon, TagIcon } from '@heroicons/react/24/outline'
import CategoryHeader from '@/components/CategoryHeader'
import { COMMON_TRANSLATIONS, CATEGORY_TRANSLATIONS, getCategoryLang } from '@/lib/category-translations'

export const metadata: Metadata = {
  title: 'Cheapest PHEVs in Europe (2026) — Most Affordable Plug-in Hybrids (Updated Specs)',
  description: 'Complete guide and price ranking of the cheapest plug-in hybrid electric vehicles (PHEVs) in Europe under €45,000. Compare starting MSRP, electric range, running costs, and budget PHEV value.',
  alternates: {
    canonical: 'https://www.phevs.eu/cheapest-phev-europe/',
    languages: {
      'x-default': 'https://www.phevs.eu/cheapest-phev-europe/',
      en: 'https://www.phevs.eu/cheapest-phev-europe/',
      de: 'https://www.phevs.eu/cheapest-phev-europe/',
      tr: 'https://www.phevs.eu/cheapest-phev-europe/',
      pl: 'https://www.phevs.eu/cheapest-phev-europe/',
    }
  },
  openGraph: {
    title: 'Cheapest PHEVs in Europe (2026) — Most Affordable Plug-in Hybrids | PHEVs.eu',
    description: 'Find the most budget-friendly plug-in hybrid cars in Europe under €45k. Compare prices, battery sizes, and EV range.',
    url: 'https://www.phevs.eu/cheapest-phev-europe/',
    type: 'website',
    siteName: 'PHEVs.eu',
    images: [{ url: 'https://www.phevs.eu/images/og-image.jpg', width: 1200, height: 630, alt: 'Cheapest PHEVs in Europe' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cheapest PHEVs in Europe (2026) — Most Affordable Plug-in Hybrids | PHEVs.eu',
    description: 'Ranked list of the most affordable plug-in hybrids under €45,000 in Europe.',
    images: ['https://www.phevs.eu/images/og-image.jpg']
  }
}

export default function CheapestPhevEuropePage({ searchParams }: { searchParams?: { lang?: string } }) {
  const baseUrl = 'https://www.phevs.eu'
  const currentLang = getCategoryLang(searchParams?.lang)
  const common = COMMON_TRANSLATIONS[currentLang]
  const t = CATEGORY_TRANSLATIONS['cheapest-phev-europe'][currentLang]
  
  // Filter models with price_eur <= 45000 or known entry budget models, sorted ascending by price
  const models = (carsData as any[])
    .filter(c => c.price_eur && c.price_eur <= 45000)
    .sort((a, b) => (a.price_eur || 99999) - (b.price_eur || 99999))

  const minPrice = models[0]?.price_eur || 24500
  const under30kCount = models.filter(c => c.price_eur <= 30000).length

  const faqs = [
    {
      question: 'What is the cheapest new plug-in hybrid (PHEV) in Europe in 2026?',
      answer: `Currently, the most affordable new PHEVs in Europe are the BYD Atto 2 DM-i Active (starting at approximately €24,500), BYD Seal 5 DM-i (~€27,990), and MG HS II 1.5T PHEV (~€32,990). These models deliver between 60 km and 103 km of pure electric range at prices significantly lower than established legacy rivals.`
    },
    {
      question: 'Is a cheap PHEV worth buying compared to a conventional petrol or self-charging hybrid?',
      answer: 'Yes. An affordable PHEV offers the lowest total cost of ownership (TCO) if you charge regularly at home or work. With electricity running costs roughly 60% lower than petrol, commuting 40–70 km daily on battery power pays back the initial purchase premium within 2 to 3 years.'
    },
    {
      question: 'Do affordable PHEVs qualify for tax exemptions and subsidies in European countries?',
      answer: 'Yes. Most cheap PHEVs emit under 30 g/km of CO2, qualifying for reduced company car taxation (such as 0.5% in Germany or low BiK brackets in the UK), local parking discounts, and full exemption from environmental penalty taxes (like the French Malus écologique).'
    },
    {
      question: 'Can budget plug-in hybrids fast charge on the motorway?',
      answer: 'Some modern affordable models, such as the Jaecoo 7 and Omoda 7, support DC rapid charging (up to 40 kW). However, many entry-level vehicles use 3.7 kW or 6.6 kW AC charging, meaning they are best suited for overnight home wallbox charging or destination charging.'
    }
  ]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${baseUrl}/cheapest-phev-europe#page`,
        'url': `${baseUrl}/cheapest-phev-europe`,
        'name': 'Cheapest PHEVs in Europe (2026) — Most Affordable Plug-in Hybrids',
        'description': 'Price-ranked catalogue of Europe\'s most affordable plug-in hybrid cars under €45,000.',
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
          { '@type': 'ListItem', 'position': 2, 'name': 'Cheapest PHEVs', 'item': `${baseUrl}/cheapest-phev-europe` }
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
        <CategoryHeader currentLang={currentLang} basePath="/cheapest-phev-europe" badgeText={common.curatedCategory} />

        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-amber-50/50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-950 py-16 sm:py-24 border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-xs font-semibold uppercase tracking-wider mb-6">
              <BanknotesIcon className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              {t.badge}
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-tight">
              {t.heroTitle} <span className="bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 bg-clip-text text-transparent">{t.heroTitleGradient}</span>
            </h1>

            <p className="mt-6 text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
              {t.heroSubtitle}
            </p>

            {/* Quick Stats Pills */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-6">
              <div className="px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-sm">
                {t.stat1Label}: <span className="font-bold text-amber-600 dark:text-amber-400">€{minPrice.toLocaleString()}</span>
              </div>
              <div className="px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-sm">
                <span className="font-bold text-amber-600 dark:text-amber-400">{under30kCount}</span> {t.stat2Label}
              </div>
              <div className="px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-sm">
                <span className="font-bold text-amber-600 dark:text-amber-400">{models.length}</span> {common.modelsAvailable}
              </div>
            </div>
          </div>
        </section>

        {/* Vehicles Grid */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                {t.rankedByTitle}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {t.rankedBySubtitle}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {models.map((car) => {
              const modelUrl = `/models/${car.slug || car.id}?lang=${currentLang}`
              const dcPower = car.charging_capabilities?.dc_power || car.dc_max_power_kw

              return (
                <div
                  key={car.id || car.slug}
                  className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-xl hover:border-amber-500/50 dark:hover:border-amber-500/50 transition-all duration-300 flex flex-col"
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

                    {/* Price Tag Badge */}
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-amber-500 text-slate-950 text-xs font-black shadow-md flex items-center gap-1">
                      <TagIcon className="w-3.5 h-3.5" />
                      From €{car.price_eur?.toLocaleString()}
                    </div>

                    {/* Range Badge */}
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-emerald-400 text-xs font-bold flex items-center gap-1">
                      <BoltIcon className="w-3.5 h-3.5" />
                      {car.ev_range_km} km EV
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        {car.brand} • {car.year}
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                        {car.brand} {car.model}
                      </h3>

                      {/* Specs Row */}
                      <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
                        <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                          <div className="text-xs text-slate-500 dark:text-slate-400">{common.battery}</div>
                          <div className="text-sm font-bold text-slate-800 dark:text-slate-200">{car.battery_kwh} kWh</div>
                        </div>
                        <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                          <div className="text-xs text-slate-500 dark:text-slate-400">{common.power}</div>
                          <div className="text-sm font-bold text-slate-800 dark:text-slate-200">{car.power_hp} HP</div>
                        </div>
                        <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                          <div className="text-xs text-slate-500 dark:text-slate-400">{common.fuel}</div>
                          <div className="text-sm font-bold text-slate-800 dark:text-slate-200">{car.fuel_consumption} L</div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {car.segment || 'PHEV'}
                      </span>
                      <Link
                        href={modelUrl}
                        className="inline-flex items-center text-xs font-bold text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 group-hover:translate-x-0.5 transition-transform"
                      >
                        {common.viewSpecs}
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Value Guide Editorial */}
          <div className="mt-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 sm:p-10 shadow-sm">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 text-xs font-semibold mb-4">
              <SparklesIcon className="w-4 h-4" />
              Buyer Guide: True Cost of Ownership
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              Why an Affordable PHEV is the Smartest Financial Compromise in 2026
            </h3>
            <p className="mt-4 text-slate-600 dark:text-slate-300 leading-relaxed">
              Pure electric vehicles (BEVs) with equivalent range and size often command price tags well beyond €45,000–€55,000. Meanwhile, conventional petrol SUVs incur punishing European CO2 penalty taxes. Budget-friendly plug-in hybrids strike the ideal balance: you gain 50 to 100+ km of zero-emission daily commuting for as low as €24,500, with no charging anxiety on longer journeys.
            </p>
          </div>

          {/* FAQ Section */}
          <section className="mt-16 border-t border-slate-200 dark:border-slate-800 pt-16">
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white text-center mb-10">
              Frequently Asked Questions About Affordable PHEVs
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {faqs.map((faq, idx) => (
                <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <h4 className="font-bold text-slate-900 dark:text-white flex items-start gap-2">
                    <QuestionMarkCircleIcon className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <span>{faq.question}</span>
                  </h4>
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
