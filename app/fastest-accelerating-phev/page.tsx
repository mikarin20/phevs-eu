import type { Metadata } from 'next'
import Link from 'next/link'
import carsData from '@/data/cars.json'
import { getImageUrl } from '@/lib/image-url'
import { BoltIcon, FireIcon, SparklesIcon, QuestionMarkCircleIcon, TrophyIcon } from '@heroicons/react/24/outline'
import CategoryHeader from '@/components/CategoryHeader'
import { COMMON_TRANSLATIONS, CATEGORY_TRANSLATIONS, getCategoryLang } from '@/lib/category-translations'

export const metadata: Metadata = {
  title: 'Fastest Accelerating PHEVs (2026) — 0-100 km/h Performance Ranking (Updated Specs)',
  description: 'Complete ranking of the fastest accelerating plug-in hybrid electric vehicles (PHEVs) in Europe. Compare 0-100 km/h sprint times, total system horsepower (up to 748 HP), and high-performance hybrid sports cars and SUVs.',
  alternates: {
    canonical: 'https://www.phevs.eu/fastest-accelerating-phev/',
    languages: {
      'x-default': 'https://www.phevs.eu/fastest-accelerating-phev/',
      en: 'https://www.phevs.eu/fastest-accelerating-phev/',
      de: 'https://www.phevs.eu/fastest-accelerating-phev/',
      tr: 'https://www.phevs.eu/fastest-accelerating-phev/',
      pl: 'https://www.phevs.eu/fastest-accelerating-phev/',
    }
  },
  openGraph: {
    title: 'Fastest Accelerating PHEVs (2026) — 0-100 km/h Performance Ranking | PHEVs.eu',
    description: 'Explore the quickest accelerating plug-in hybrids in Europe. 0-100 km/h times, horsepower rankings, and eAWD specs.',
    url: 'https://www.phevs.eu/fastest-accelerating-phev/',
    type: 'website',
    siteName: 'PHEVs.eu',
    images: [{ url: 'https://www.phevs.eu/images/og-image.jpg', width: 1200, height: 630, alt: 'Fastest Accelerating PHEVs' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fastest Accelerating PHEVs (2026) — 0-100 km/h Performance Ranking | PHEVs.eu',
    description: 'Ranked list of the quickest 0-100 km/h plug-in hybrids in Europe.',
    images: ['https://www.phevs.eu/images/og-image.jpg']
  }
}

export default function FastestAcceleratingPhevPage({ searchParams }: { searchParams?: { lang?: string } }) {
  const baseUrl = 'https://www.phevs.eu'
  const currentLang = getCategoryLang(searchParams?.lang)
  const common = COMMON_TRANSLATIONS[currentLang]
  const t = CATEGORY_TRANSLATIONS['fastest-accelerating-phev'][currentLang]
  
  // Filter models with acceleration_0_100 <= 6.8s or power_hp >= 270, sorted by acceleration ascending
  const models = (carsData as any[])
    .filter(c => (c.acceleration_0_100 && c.acceleration_0_100 > 2.0 && c.acceleration_0_100 <= 6.8) || (c.power_hp && c.power_hp >= 290))
    .sort((a, b) => {
      const aSec = a.acceleration_0_100 && a.acceleration_0_100 > 2.0 ? a.acceleration_0_100 : (1000 / (a.power_hp || 200));
      const bSec = b.acceleration_0_100 && b.acceleration_0_100 > 2.0 ? b.acceleration_0_100 : (1000 / (b.power_hp || 200));
      return aSec - bSec;
    })

  const fastestTime = models[0]?.acceleration_0_100 || 3.6
  const maxHorsepower = Math.max(...models.map(c => c.power_hp || 0))
  const sub5SecCount = models.filter(c => c.acceleration_0_100 && c.acceleration_0_100 < 5.0).length

  const faqs = [
    {
      question: 'Which is the fastest accelerating plug-in hybrid in Europe in 2026?',
      answer: `The fastest accelerating production PHEVs include the BMW M5 Touring (727 HP, 0-100 km/h in 3.6s), BMW XM Label Red (748 HP, 0-100 km/h in 3.8s), Mercedes-AMG E 53 Hybrid (585 HP, 0-100 km/h in 3.8s), and Porsche Panamera 4 E-Hybrid (470 HP, 4.1s). These models combine twin-turbo petrol engines with high-output electric motors for instant launch torque.`
    },
    {
      question: 'Why are modern plug-in hybrids so quick off the line?',
      answer: 'Electric motors produce 100% of their maximum torque instantly from zero RPM. When launching, the electric motor fills in the turbo-lag delay of the combustion engine, while electronic all-wheel drive (eAWD) eliminates wheelspin, producing supercar-level acceleration times.'
    },
    {
      question: 'Can performance PHEVs still drive quietly on pure electric power?',
      answer: 'Yes. Even a 700+ horsepower hybrid can cruise in silent EV mode through residential neighborhoods and low-emission city centers for 60 to 90 km, switching on its twin-turbo petrol engine only when you demand maximum acceleration or drive on the highway.'
    },
    {
      question: 'What is the most affordable fast plug-in hybrid with sub-6.5 second acceleration?',
      answer: 'Models like the Toyota RAV4 Plug-in Hybrid (306 HP, 0-100 in 6.0s), Volkswagen Golf GTE (272 HP, 0-100 in 6.6s), and Cupra Formentor VZ e-HYBRID (272 HP, 0-100 in 6.7s) offer genuine hot-hatch acceleration at mainstream family car price points.'
    }
  ]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${baseUrl}/fastest-accelerating-phev#page`,
        'url': `${baseUrl}/fastest-accelerating-phev`,
        'name': 'Fastest Accelerating PHEVs (2026) — 0-100 km/h Performance Ranking',
        'description': 'Comprehensive performance ranking of the fastest 0-100 km/h plug-in hybrid electric cars in Europe.',
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
          { '@type': 'ListItem', 'position': 2, 'name': 'Fastest PHEVs', 'item': `${baseUrl}/fastest-accelerating-phev` }
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
        <CategoryHeader currentLang={currentLang} basePath="/fastest-accelerating-phev" badgeText={common.curatedCategory} />

        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-rose-50/50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-950 py-16 sm:py-24 border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-semibold uppercase tracking-wider mb-6">
              <FireIcon className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              {t.badge}
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-tight">
              {t.heroTitle} <span className="bg-gradient-to-r from-rose-600 via-red-600 to-amber-600 bg-clip-text text-transparent">{t.heroTitleGradient}</span>
            </h1>

            <p className="mt-6 text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
              {t.heroSubtitle}
            </p>

            {/* Quick Stats Pills */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-6">
              <div className="px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-sm">
                {t.stat2Label}: <span className="font-bold text-rose-600 dark:text-rose-400">{fastestTime}s</span> (0–100 km/h)
              </div>
              <div className="px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-sm">
                {t.stat3Label}: <span className="font-bold text-rose-600 dark:text-rose-400">{maxHorsepower} HP</span>
              </div>
              <div className="px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-sm">
                <span className="font-bold text-rose-600 dark:text-rose-400">{sub5SecCount}</span> {t.stat1Label}
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
            {models.map((car, idx) => {
              const modelUrl = `/models/${car.slug || car.id}?lang=${currentLang}`
              const isSub4 = car.acceleration_0_100 && car.acceleration_0_100 < 4.0

              return (
                <div
                  key={car.id || car.slug}
                  className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-xl hover:border-rose-500/50 dark:hover:border-rose-500/50 transition-all duration-300 flex flex-col"
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

                    {/* Acceleration Badge */}
                    {car.acceleration_0_100 ? (
                      <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-black shadow-md flex items-center gap-1 ${
                        isSub4 
                          ? 'bg-rose-600 text-white' 
                          : 'bg-slate-900/90 backdrop-blur-md text-amber-300 border border-amber-500/30'
                      }`}>
                        <TrophyIcon className="w-3.5 h-3.5" />
                        {car.acceleration_0_100}s (0-100)
                      </div>
                    ) : (
                      <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-900/90 text-rose-300 text-xs font-black shadow-md">
                        {car.power_hp} HP Performance
                      </div>
                    )}

                    {/* Power Badge */}
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-rose-400 text-xs font-bold flex items-center gap-1">
                      <FireIcon className="w-3.5 h-3.5" />
                      {car.power_hp} HP
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        #{idx + 1} • {car.brand} • {car.year}
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                        {car.brand} {car.model}
                      </h3>

                      {/* Specs Row */}
                      <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
                        <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                          <div className="text-xs text-slate-500 dark:text-slate-400">{common.power}</div>
                          <div className="text-sm font-bold text-rose-600 dark:text-rose-400">{car.power_hp} HP</div>
                        </div>
                        <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                          <div className="text-xs text-slate-500 dark:text-slate-400">{common.acceleration}</div>
                          <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
                            {car.acceleration_0_100 ? `${car.acceleration_0_100}s` : 'Sport'}
                          </div>
                        </div>
                        <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                          <div className="text-xs text-slate-500 dark:text-slate-400">{common.electricRange}</div>
                          <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{car.ev_range_km} km</div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {car.segment || 'Performance PHEV'}
                      </span>
                      <Link
                        href={modelUrl}
                        className="inline-flex items-center text-xs font-bold text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 group-hover:translate-x-0.5 transition-transform"
                      >
                        {common.viewSpecs}
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Performance Technology Editorial */}
          <div className="mt-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 sm:p-10 shadow-sm">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs font-semibold mb-4">
              <SparklesIcon className="w-4 h-4" />
              Engineering Insight: The Instant Electric Boost
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              How Hybrid Technology Eliminates Turbo-Lag and Delivers Supercar Torque
            </h3>
            <p className="mt-4 text-slate-600 dark:text-slate-300 leading-relaxed">
              Traditional high-performance combustion engines suffer from brief turbo spool delays when stepping on the throttle. In performance plug-in hybrids, powerful electric traction motors deliver maximum torque in milliseconds. This electric torque-fill provides explosive acceleration off the line while maintaining all-weather traction via electronic all-wheel-drive (eAWD).
            </p>
          </div>

          {/* FAQ Section */}
          <section className="mt-16 border-t border-slate-200 dark:border-slate-800 pt-16">
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white text-center mb-10">
              Frequently Asked Questions About Fast PHEVs
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {faqs.map((faq, idx) => (
                <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <h4 className="font-bold text-slate-900 dark:text-white flex items-start gap-2">
                    <QuestionMarkCircleIcon className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
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
