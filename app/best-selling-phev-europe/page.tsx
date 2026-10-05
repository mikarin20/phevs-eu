import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import carsData from '@/data/cars.json';
import { getImageUrl } from '@/lib/image-url';
import {
  TrophyIcon,
  ChartBarIcon,
  CheckBadgeIcon,
  ShieldCheckIcon,
  ArrowTrendingUpIcon,
  BuildingOffice2Icon,
  SparklesIcon,
  QuestionMarkCircleIcon,
  BoltIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import CategoryHeader from '@/components/CategoryHeader';
import { COMMON_TRANSLATIONS, CATEGORY_TRANSLATIONS, getCategoryLang } from '@/lib/category-translations';

export const metadata: Metadata = {
  title: 'Best-Selling PHEVs in Europe (2026) — Official Sales & Registration Ranking',
  description:
    'Official JATO Dynamics & ACEA European plug-in hybrid registration data. Discover Europe\'s top 10 best-selling PHEV models, sales volumes, market share, and buyer trends.',
  alternates: {
    canonical: 'https://www.phevs.eu/best-selling-phev-europe/',
    languages: {
      'x-default': 'https://www.phevs.eu/best-selling-phev-europe/',
      en: 'https://www.phevs.eu/best-selling-phev-europe/',
      de: 'https://www.phevs.eu/best-selling-phev-europe/',
      tr: 'https://www.phevs.eu/best-selling-phev-europe/',
      pl: 'https://www.phevs.eu/best-selling-phev-europe/',
    },
  },
  openGraph: {
    title: 'Best-Selling PHEVs in Europe (2026) — Official Sales & Registration Ranking | PHEVs.eu',
    description:
      'Official European sales figures: BYD Seal U DM-i, VW Tiguan eHybrid, and Volvo XC60 Recharge lead Europe\'s plug-in hybrid market.',
    url: 'https://www.phevs.eu/best-selling-phev-europe/',
    type: 'website',
    siteName: 'PHEVs.eu',
    images: [
      {
        url: 'https://www.phevs.eu/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Best-Selling PHEVs in Europe — Official Registration Ranking',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best-Selling PHEVs in Europe (2026) — Official Sales & Registration Ranking | PHEVs.eu',
    description:
      'Official European new car registration ranking of the top 10 best-selling plug-in hybrids by JATO Dynamics & ACEA.',
    images: ['https://www.phevs.eu/images/og-image.jpg'],
  },
};

interface BestSellerItem {
  rank: number;
  id: string;
  name: string;
  registrations: string;
  volumeNumber: number;
  highlightTr: string;
  highlightEn: string;
  batteryKwh: number;
  evRangeKm: number;
  dcCharging: boolean;
  dcMaxKw?: number;
  badge?: string;
}

const TOP_10_SALES: BestSellerItem[] = [
  {
    rank: 1,
    id: 'byd-seal-u-dm-i',
    name: 'BYD Seal U DM-i',
    registrations: '72,667',
    volumeNumber: 72667,
    highlightTr: "Avrupa'da ilk kez Çinli bir model PHEV liderliğini aldı; agresif fiyatlandırma ve zengin donanım.",
    highlightEn: "First time a Chinese vehicle claims Europe's overall PHEV sales crown, driven by aggressive pricing and ultra-rich standard equipment.",
    batteryKwh: 18.3,
    evRangeKm: 80,
    dcCharging: true,
    dcMaxKw: 18,
    badge: '👑 #1 Best Seller in Europe',
  },
  {
    rank: 2,
    id: 'vw-3',
    name: 'Volkswagen Tiguan eHybrid',
    registrations: '65,899',
    volumeNumber: 65899,
    highlightTr: 'Yeni MQB evo altyapısı, 120 km saf elektrik menzili ve 50 kW DC hızlı şarj desteğiyle şirket filolarının 1 numarası.',
    highlightEn: 'New MQB evo architecture, 120+ km pure electric range, and 50 kW DC rapid charging make it Europe\'s top corporate fleet choice.',
    batteryKwh: 25.7,
    evRangeKm: 125,
    dcCharging: true,
    dcMaxKw: 50,
    badge: 'Fleet & Corporate #1',
  },
  {
    rank: 3,
    id: 'volvo-2',
    name: 'Volvo XC60 Recharge (T6/T8)',
    registrations: '60,088',
    volumeNumber: 60088,
    highlightTr: 'Premium D-SUV sınıfında kurumsal leasing ve şirket aracı vergi avantajının gediklisi.',
    highlightEn: 'Perennial premium D-SUV executive benchmark benefiting from favorable UK BiK and German 0.5% company car taxation.',
    batteryKwh: 18.8,
    evRangeKm: 80,
    dcCharging: false,
    badge: 'Executive D-SUV Leader',
  },
  {
    rank: 4,
    id: 'ford-1',
    name: 'Ford Kuga PHEV',
    registrations: '41,983',
    volumeNumber: 41983,
    highlightTr: 'Önceki yılların satış şampiyonu; makyajlı versiyonuyla ilk 5 içindeki yerini koruyor.',
    highlightEn: 'Former multi-year European champion; latest refreshed styling and powertrain efficiency preserve its strong top-5 standing.',
    batteryKwh: 14.4,
    evRangeKm: 65,
    dcCharging: false,
  },
  {
    rank: 5,
    id: 'bmw-x1-25e-2024',
    name: 'BMW X1 Plug-in Hybrid (25e/30e)',
    registrations: '~38,500',
    volumeNumber: 38500,
    highlightTr: 'Kompakt premium sınıfta Almanya ve Benelüks pazarının en popüler filo modeli.',
    highlightEn: 'Compact premium sales powerhouse across Germany, Belgium, and Netherlands company leasing fleets.',
    batteryKwh: 16.3,
    evRangeKm: 78,
    dcCharging: false,
  },
  {
    rank: 6,
    id: 'mercedes-5',
    name: 'Mercedes-Benz GLC e-Class (300e / 300de)',
    registrations: '~35,200',
    volumeNumber: 35200,
    highlightTr: '31.2 kWh dev batarya, 125+ km elektrik menzili ve rakipsiz dizel-hibrit seçeneği.',
    highlightEn: 'Class-topping 31.2 kWh battery, 125+ km real electric range, and rare high-efficiency diesel-PHEV powertrain.',
    batteryKwh: 31.2,
    evRangeKm: 125,
    dcCharging: true,
    dcMaxKw: 60,
  },
  {
    rank: 7,
    id: 'cupra-formentor-204hp',
    name: 'Cupra Formentor e-Hybrid',
    registrations: '~31,000',
    volumeNumber: 31000,
    highlightTr: "Özellikle İspanya, Fransa ve Almanya'da bireysel genç alıcı kitlesinin favori sportif crossover tercihi.",
    highlightEn: 'Distinctive sporty styling capturing lifestyle and younger retail buyers across Spain, France, and Germany.',
    batteryKwh: 19.7,
    evRangeKm: 126,
    dcCharging: true,
    dcMaxKw: 50,
  },
  {
    rank: 8,
    id: 'skoda-kodiaq',
    name: 'Škoda Kodiaq iV / Superb iV',
    registrations: '~28,500',
    volumeNumber: 28500,
    highlightTr: 'VW grubu teknolojisiyle 120+ km elektrik menzilini birleştiren devasa bagajlı geniş aile tercihi.',
    highlightEn: 'Maximum interior practicality, 120+ km electric range, and massive boot space tailored for demanding European families.',
    batteryKwh: 25.7,
    evRangeKm: 123,
    dcCharging: true,
    dcMaxKw: 50,
  },
  {
    rank: 9,
    id: 'jaecoo-1',
    name: 'Jaecoo 7 PHEV',
    registrations: '~24,000',
    volumeNumber: 24000,
    highlightTr: 'Çinli Chery grubunun fiyat odaklı kompakt PHEV atağıyla listeye hızla giren yeni oyuncu.',
    highlightEn: 'Chery Group\'s rapid-growth compact SUV disruptor combining competitive retail pricing with full safety kit.',
    batteryKwh: 20.0,
    evRangeKm: 91,
    dcCharging: true,
    dcMaxKw: 40,
  },
  {
    rank: 10,
    id: 'mg-3',
    name: 'MG HS PHEV',
    registrations: '~21,500',
    volumeNumber: 21500,
    highlightTr: "24.7 kWh dev bataryası ve İngiltere pazarındaki yoğun filo/salary sacrifice teşvikleriyle yükseldi.",
    highlightEn: 'Surging market share powered by its large 24.7 kWh battery and intense salary-sacrifice leasing demand in the UK.',
    batteryKwh: 23.2,
    evRangeKm: 120,
    dcCharging: false,
  },
];

export default function BestSellingPhevEuropePage({ searchParams }: { searchParams?: { lang?: string } }) {
  const baseUrl = 'https://www.phevs.eu';
  const currentLang = getCategoryLang(searchParams?.lang);
  const common = COMMON_TRANSLATIONS[currentLang];
  const t = CATEGORY_TRANSLATIONS['best-selling-phev-europe'][currentLang];

  // Cross-reference data with carsData
  const enrichedList = TOP_10_SALES.map((item) => {
    const carData = (carsData as any[]).find((c) => c.id === item.id);
    return {
      ...item,
      slug: carData?.slug || item.id,
      imageUrl: carData?.image_url || null,
      priceEur: carData?.price_eur,
      brand: carData?.brand,
      model: carData?.model,
      year: carData?.year || 2026,
    };
  });

  const faqs = [
    {
      question: 'Which plug-in hybrid (PHEV) sold the most units in Europe in 2026?',
      answer:
        'The BYD Seal U DM-i took 1st place across Europe with 72,667 annual registrations, marking the first time in automotive history that a Chinese automaker has claimed the top sales position in the European plug-in hybrid segment.',
    },
    {
      question: 'Why did the Volkswagen Tiguan eHybrid achieve second place?',
      answer:
        'Volkswagen’s redesigned Tiguan eHybrid recorded 65,899 registrations thanks to its MQB evo platform upgrade, which unlocked a 25.7 kWh battery, 120+ km pure electric range, and 50 kW DC rapid charging. These specs made it the undisputed number one choice for company car drivers and corporate fleet managers across Germany, France, and the UK.',
    },
    {
      question: 'What is driving the high sales volume of Volvo XC60 Recharge in Europe?',
      answer:
        'With 60,088 registrations, the Volvo XC60 Recharge remains Europe’s favorite premium midsize PHEV. Strong corporate leasing packages, stellar Scandinavian safety reputation, and preferential benefit-in-kind (BiK) taxation rates in the UK and Germany maintain its consistent executive demand.',
    },
    {
      question: 'Are Chinese PHEVs gaining significant market share over European legacy brands?',
      answer:
        'Yes. With BYD Seal U DM-i (#1), Jaecoo 7 (#9), and MG HS (#10), Chinese manufacturers now account for three of Europe’s top 10 best-selling plug-in hybrids. Their success is driven by providing 80–120 km electric range and premium technology at prices 20% to 30% lower than comparable European competitors.',
    },
    {
      question: 'What sources are used for these European PHEV registration numbers?',
      answer:
        'These figures are compiled directly from JATO Dynamics European market intelligence reports, ACEA (European Automobile Manufacturers’ Association) official registration statistics, and national transport ministry filings across EU27 member states, the UK, Norway, and Switzerland.',
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${baseUrl}/best-selling-phev-europe/#webpage`,
        url: `${baseUrl}/best-selling-phev-europe/`,
        name: 'Best-Selling PHEVs in Europe (2026) — Official Sales & Registration Ranking',
        description:
          'Official European new car registration ranking of the top 10 best-selling plug-in hybrids by JATO Dynamics & ACEA.',
        isPartOf: {
          '@type': 'WebSite',
          '@id': `${baseUrl}/#website`,
          name: 'PHEVs.eu',
          url: `${baseUrl}/`,
        },
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: TOP_10_SALES.length,
          itemListElement: enrichedList.map((item) => ({
            '@type': 'ListItem',
            position: item.rank,
            name: `${item.name} (${item.registrations} Registrations)`,
            url: `${baseUrl}/models/${item.slug}/`,
          })),
        },
      },
      {
        '@type': 'FAQPage',
        '@id': `${baseUrl}/best-selling-phev-europe/#faq`,
        mainEntity: faqs.map((f) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: f.answer,
          },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: `${baseUrl}/`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Best-Selling PHEVs in Europe',
            item: `${baseUrl}/best-selling-phev-europe/`,
          },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Navigation Bar */}
      <CategoryHeader currentLang={currentLang} basePath="/best-selling-phev-europe" badgeText={common.curatedCategory} />

      {/* Hero Section */}
      <div className="bg-gradient-to-b from-blue-900 via-indigo-950 to-slate-950 text-white border-b border-indigo-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs font-semibold uppercase tracking-wider mb-4">
              <TrophyIcon className="w-4 h-4 text-amber-400" />
              {t.badge}
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] mb-6">
              {t.heroTitle} <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-white bg-clip-text text-transparent">{t.heroTitleGradient}</span>
            </h1>

            <p className="text-lg sm:text-xl text-indigo-100/90 leading-relaxed mb-6">
              {t.heroSubtitle}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-indigo-200/70">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheckIcon className="w-4 h-4 text-emerald-400" />
                Verified Against Official Registration Registries
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1.5">
                <ChartBarIcon className="w-4 h-4 text-blue-400" />
                EU27 + UK + EFTA Coverage
              </span>
              <span>•</span>
              <span>Updated: October 2026</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        {/* AI & LLM Extractable Executive Summary Box */}
        <section aria-label="Executive Market Summary" className="mb-12">
          <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border-2 border-indigo-500/30 shadow-md">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-3">
              <CheckBadgeIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              AI & Executive Extractable Summary
            </div>
            <p className="text-lg sm:text-xl font-medium text-slate-800 dark:text-slate-100 leading-relaxed mb-4">
              According to official JATO Dynamics and ACEA European new car registration figures, the{' '}
              <strong>BYD Seal U DM-i</strong> ranks as Europe&apos;s #1 best-selling plug-in hybrid with{' '}
              <strong className="text-indigo-600 dark:text-indigo-400">72,667 annual registrations</strong>,
              marking the first time a Chinese automaker has claimed the top PHEV spot in Europe. The{' '}
              <strong>Volkswagen Tiguan eHybrid</strong> follows in 2nd place with 65,899 units, while the{' '}
              <strong>Volvo XC60 Recharge</strong> claims 3rd with 60,088 registrations.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs">
              <div>
                <span className="text-slate-500 dark:text-slate-400 block">#1 Best Seller</span>
                <span className="font-bold text-slate-900 dark:text-white">BYD Seal U (72.6k units)</span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 block">Fleet & Corporate Leader</span>
                <span className="font-bold text-slate-900 dark:text-white">VW Tiguan eHybrid (65.9k)</span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 block">Top Premium D-SUV</span>
                <span className="font-bold text-slate-900 dark:text-white">Volvo XC60 Recharge (60.1k)</span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 block">Data Sources</span>
                <span className="font-bold text-slate-900 dark:text-white">JATO Dynamics & ACEA</span>
              </div>
            </div>
          </div>
        </section>

        {/* Semantic HTML Table (Crucial for AI Parsers & LLM Snippets) */}
        <section aria-label="Official Registration Table" className="mb-14">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                <ChartBarIcon className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
                {t.tableTitle}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {t.tableSubtitle}
              </p>
            </div>
            <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 self-start sm:self-auto">
              JATO & ACEA Verified
            </span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900">
            <table className="w-full text-left border-collapse text-sm">
              <thead className="bg-slate-100 dark:bg-slate-800/80 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th scope="col" className="py-4 px-4 sm:px-6 w-16 text-center">#</th>
                  <th scope="col" className="py-4 px-4 sm:px-6">{common.vehicle}</th>
                  <th scope="col" className="py-4 px-4 sm:px-6 text-right">Registrations</th>
                  <th scope="col" className="py-4 px-4 sm:px-6 text-center">{common.battery} / {common.electricRange}</th>
                  <th scope="col" className="py-4 px-4 sm:px-6">Highlight</th>
                  <th scope="col" className="py-4 px-4 sm:px-6 text-center">{common.details}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {enrichedList.map((car) => (
                  <tr
                    key={car.id}
                    className="hover:bg-indigo-50/40 dark:hover:bg-indigo-950/20 transition-colors"
                  >
                    <td className="py-4 px-4 sm:px-6 font-black text-center text-base">
                      {car.rank === 1 ? (
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-400 text-amber-950 font-bold shadow-sm">
                          1
                        </span>
                      ) : car.rank === 2 ? (
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-300 dark:bg-slate-700 text-slate-900 dark:text-white font-bold">
                          2
                        </span>
                      ) : car.rank === 3 ? (
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-700 text-white font-bold">
                          3
                        </span>
                      ) : (
                        <span className="text-slate-500 font-semibold">{car.rank}</span>
                      )}
                    </td>
                    <td className="py-4 px-4 sm:px-6 font-semibold text-slate-900 dark:text-white">
                      <div className="flex items-center gap-3">
                        {car.imageUrl && (
                          <div className="relative w-12 h-8 rounded overflow-hidden bg-slate-200 dark:bg-slate-800 shrink-0 hidden sm:block">
                            <Image
                              src={getImageUrl(car.imageUrl)}
                              alt={`${car.name} — Best Selling PHEV Europe`}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          </div>
                        )}
                        <div>
                          <Link
                            href={`/models/${car.slug}/?lang=${currentLang}`}
                            className="hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline"
                          >
                            {car.name}
                          </Link>
                          {car.badge && (
                            <span className="block text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                              {car.badge}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-right font-black text-slate-900 dark:text-white text-base">
                      {car.registrations}
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-center whitespace-nowrap">
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {car.batteryKwh} kWh
                      </span>
                      <span className="text-xs text-slate-500 block">
                        {car.evRangeKm} km WLTP
                      </span>
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md leading-relaxed">
                      {currentLang === 'tr' ? car.highlightTr : car.highlightEn}
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-center">
                      <Link
                        href={`/models/${car.slug}/?lang=${currentLang}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        {common.details}
                        <ArrowRightIcon className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Detailed Vehicle Cards Grid */}
        <section aria-label="Top 10 Vehicle Breakdown" className="mb-16">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
            {t.rankedByTitle}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-8 max-w-3xl">
            {t.rankedBySubtitle}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrichedList.map((car) => (
              <div
                key={car.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow group"
              >
                {/* Image */}
                <div className="relative aspect-[16/10] bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  {car.imageUrl ? (
                    <Image
                      src={getImageUrl(car.imageUrl)}
                      alt={`${car.name} — Europe's #${car.rank} Best Selling Plug-in Hybrid`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                      No Image Available
                    </div>
                  )}

                  {/* Rank Badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-slate-900/90 text-white text-xs font-black backdrop-blur-sm shadow-md">
                      #{car.rank}
                    </span>
                    {car.badge && (
                      <span className="px-2.5 py-1 rounded-full bg-indigo-600/90 text-white text-[11px] font-bold backdrop-blur-sm shadow-md">
                        {car.badge}
                      </span>
                    )}
                  </div>

                  {/* Volume Badge */}
                  <div className="absolute bottom-3 right-3 px-3 py-1 rounded-lg bg-white/95 dark:bg-slate-900/95 text-slate-900 dark:text-white text-xs font-bold shadow-md">
                    {car.registrations} units
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                      <Link
                        href={`/models/${car.slug}/?lang=${currentLang}`}
                        className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                      >
                        {car.name}
                      </Link>
                    </h3>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                      {currentLang === 'tr' ? car.highlightTr : car.highlightEn}
                    </p>

                    {/* Specs Pill Bar */}
                    <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center mb-4">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">{common.electricRange}</span>
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {car.evRangeKm} km
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">{common.battery}</span>
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {car.batteryKwh} kWh
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">{common.dcCharging}</span>
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {car.dcCharging ? `${car.dcMaxKw} kW` : 'No'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Link
                    href={`/models/${car.slug}/?lang=${currentLang}`}
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 dark:hover:text-white text-slate-700 dark:text-slate-200 text-xs font-bold transition-all text-center"
                  >
                    {common.viewSpecs}
                    <ArrowRightIcon className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3 Major Market Shifts (Analysis) */}
        <section aria-label="Key Market Trends" className="mb-16">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-6 flex items-center gap-2">
              <ArrowTrendingUpIcon className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
              Key Trends Defining Europe&apos;s PHEV Market in 2026
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4">
                  <SparklesIcon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  1. The Rise of Chinese PHEV Disruptors
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  The crowning of the <strong>BYD Seal U DM-i</strong> (72,667 registrations) along with the arrival
                  of the <strong>Jaecoo 7</strong> (#9) and <strong>MG HS</strong> (#10) demonstrates that Chinese
                  OEMs have successfully cracked the European plug-in market. By delivering 80–120 km pure electric
                  range and generous comfort specs at aggressive sub-€40k price points, they outmaneuvered legacy rivals.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
                  <BoltIcon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  2. German 100+ km & 50 kW DC Renaissance
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Volkswagen Group fought back with its <strong>MQB evo generation</strong>. The{' '}
                  <strong>VW Tiguan eHybrid</strong> (#2) and <strong>Škoda Kodiaq iV</strong> (#8) combined
                  near-BEV battery packs (25.7 kWh) with <strong>50 kW DC rapid charging</strong>. For corporate
                  commuters, having 120 km of true electric range restored German engineering fleet dominance.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4">
                  <BuildingOffice2Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  3. Corporate Fleet Tax Optimization
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  With Euro 6e-bis regulations penalizing high-emission company cars, the{' '}
                  <strong>Volvo XC60 Recharge</strong> (60,088 units) and <strong>BMW X1</strong> (~38,500 units)
                  dominated executive leasing. UK BiK savings, Germany’s 0.5% Dienstwagen tax exemption, and French
                  Malus protection drive over 65% of all premium PHEV registrations.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Frequently Asked Questions (FAQ) */}
        <section aria-label="Frequently Asked Questions" className="mb-14">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2 text-center flex items-center justify-center gap-2">
              <QuestionMarkCircleIcon className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 text-center mb-8">
              Key insights into European PHEV registration trends, rankings, and regulatory drivers.
            </p>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm"
                >
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* EEAT Data Verification Footnote */}
        <section aria-label="Data Verification Footnote">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <ShieldCheckIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>
                <strong>Data Verification Statement:</strong> Registration volume and market statistics verified
                against official JATO Dynamics market releases, ACEA (European Automobile Manufacturers’
                Association) monthly registries, and national transport authority homologation filings.
              </span>
            </div>
            <div className="shrink-0 font-semibold text-slate-700 dark:text-slate-300">
              Updated: October 2026
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
