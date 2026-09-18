import { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRightIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline'
import { getFaqTranslations } from '@/lib/i18n'

export const metadata: Metadata = {
  title: 'PHEV Guide — Everything You Need to Know | PHEVs.eu',
  description: 'Complete guide to Plug-in Hybrid Electric Vehicles (PHEV). Everything you need to know about PHEV technology, buying guide, charging, range, benefits, and more.',
  keywords: [
    'PHEV guide',
    'plug-in hybrid complete guide',
    'PHEV everything you need to know',
    'hybrid car guide',
    'PHEV technology explained',
    'plug-in hybrid benefits',
    'PHEV buying guide',
    'hybrid vehicle guide'
  ],
  openGraph: {
    title: 'PHEV Guide — Everything You Need to Know',
    description: 'Complete guide to Plug-in Hybrid Electric Vehicles (PHEV). Everything you need to know about PHEV technology, benefits, and buying guide.',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.phevs.eu/faq',
    languages: {
      'x-default': 'https://www.phevs.eu/faq',
      en: 'https://www.phevs.eu/faq',
      tr: 'https://www.phevs.eu/faq',
      de: 'https://www.phevs.eu/faq',
      pl: 'https://www.phevs.eu/faq',
    },
  },
}

export default function PHEVGuidePage({ 
  searchParams 
}: { 
  searchParams: { lang?: string } 
}) {
  const locale = (searchParams?.lang as 'en' | 'tr' | 'de' | 'pl') || 'en'
  const t = getFaqTranslations(locale)
  
  const guideCategories = [
    {
      id: 'basics',
      title: t.categories.basics.title,
      icon: '🔧',
      description: t.categories.basics.description,
      color: 'bg-blue-50 dark:bg-blue-900/20',
      textColor: 'text-blue-700 dark:text-blue-300',
      borderColor: 'border-blue-200 dark:border-blue-700',
      topics: [
        {
          id: 'what-is-phev',
          title: locale === 'tr' ? 'PHEV nedir ve nasıl çalışır?' : locale === 'de' ? 'Was ist PHEV und wie funktioniert er?' : locale === 'pl' ? 'Czym jest PHEV i jak działa?' : 'What is PHEV and How Does It Work?',
          shortDescription: locale === 'tr' ? 'Elektrik ve benzin motorlarının birlikte çalışma prensipleri' : locale === 'de' ? 'Elektromotor, Benzinmotor und drei Fahrmodi erklärt' : locale === 'pl' ? 'Jak współpracują silnik elektryczny i benzynowy?' : 'Electric motor, petrol engine, and three driving modes explained',
          slug: 'what-is-phev-how-it-works'
        },
        {
          id: 'phev-vs-bev',
          title: locale === 'tr' ? 'PHEV ile BEV arasındaki fark nedir?' : locale === 'de' ? 'PHEV vs. BEV: Was ist der Unterschied?' : locale === 'pl' ? 'PHEV vs BEV: jaka jest różnica?' : 'PHEV vs BEV: What is the Difference?',
          shortDescription: locale === 'tr' ? 'Menzil, şarj süresi ve yakıt esnekliği farkları' : locale === 'de' ? 'Reichweite, Ladezeiten und Kraftstoffflexibilität im Vergleich' : locale === 'pl' ? 'Zasięg, czas ładowania i elastyczność paliwa' : 'Range, charging time, and fuel flexibility differences',
          slug: 'phev-vs-bev-differences'
        },
        {
          id: 'phev-benefits',
          title: locale === 'tr' ? 'PHEV avantajları nelerdir?' : locale === 'de' ? 'PHEV-Vorteile und Nachteile' : locale === 'pl' ? 'Zalety i wady PHEV' : 'PHEV Benefits & Advantages Explained',
          shortDescription: locale === 'tr' ? 'Şehir içi sıfır emisyon, yakıt tasarrufu ve menzil esnekliği' : locale === 'de' ? 'Emissionsfreies Pendeln, Kraftstoffeinsparung und Reichweite' : locale === 'pl' ? 'Zeroemisyjne dojazdy, oszczędność paliwa i zasięg' : 'Zero-emission commuting, fuel savings, and range flexibility',
          slug: 'phev-benefits-and-advantages'
        }
      ]
    },
    {
      id: 'buying',
      title: t.categories.buying.title,
      icon: '💰',
      description: t.categories.buying.description,
      color: 'bg-green-50 dark:bg-green-900/20',
      textColor: 'text-green-700 dark:text-green-300',
      borderColor: 'border-green-200 dark:border-green-700',
      topics: [
        {
          id: 'buying-guide',
          title: locale === 'tr' ? 'Kapsamlı PHEV Satın Alma Rehberi' : locale === 'de' ? 'Der vollständige PHEV-Kaufberater' : locale === 'pl' ? 'Kompleksowy przewodnik zakupu PHEV' : 'Complete PHEV Buying Guide',
          shortDescription: locale === 'tr' ? 'Günlük mesafe, şarj erişimi ve gerçek menzil beklentileri' : locale === 'de' ? 'Pendelstrecke, Lademöglichkeiten und Reichweiteerwartungen' : locale === 'pl' ? 'Dojazdy, dostęp do ładowania i rzeczywisty zasięg' : 'Daily commute, charging access, and real-world range expectations',
          slug: 'phev-buying-guide'
        },
        {
          id: 'price-ranges',
          title: locale === 'tr' ? 'PHEV Fiyat Aralıkları ve Bütçe Planlaması' : locale === 'de' ? 'PHEV-Preissegmente und Budgetplanung' : locale === 'pl' ? 'Przedziały cenowe PHEV i planowanie budżetu' : 'PHEV Price Ranges & Budget Planning',
          shortDescription: locale === 'tr' ? 'Kompaktten lükse Avrupa PHEV fiyat kategorileri' : locale === 'de' ? 'Von Kompakt bis Luxus — Preiskategorien in Europa' : locale === 'pl' ? 'Od aut kompaktowych po luksusowe — kategorie cenowe w Europie' : 'Compact to luxury PHEV pricing categories across Europe',
          slug: 'phev-price-ranges'
        }
      ]
    },
    {
      id: 'technical',
      title: t.categories.technical.title,
      icon: '⚙️',
      description: t.categories.technical.description,
      color: 'bg-purple-50 dark:bg-purple-900/20',
      textColor: 'text-purple-700 dark:text-purple-300',
      borderColor: 'border-purple-200 dark:border-purple-700',
      topics: [
        {
          id: 'range-wltp',
          title: locale === 'tr' ? 'PHEV Menzil ve WLTP Standartları' : locale === 'de' ? 'PHEV-Reichweite, WLTP und Realverbrauch' : locale === 'pl' ? 'Zasięg PHEV i standardy WLTP' : 'PHEV Range, WLTP & Real-World Calculation',
          shortDescription: locale === 'tr' ? 'WLTP değerleri ve gerçek dünya menzil farkları' : locale === 'de' ? 'WLTP-Werte und reale Reichweite im Vergleich' : locale === 'pl' ? 'Wartości WLTP a rzeczywisty zasięg' : 'WLTP figures versus real-world range and influencing factors',
          slug: 'phev-range-wltp-calculation'
        },
        {
          id: 'charging-times',
          title: locale === 'tr' ? 'Şarj Süreleri ve Hız Karşılaştırması' : locale === 'de' ? 'PHEV-Ladezeiten: AC vs. DC Vergleich' : locale === 'pl' ? 'Czas ładowania PHEV: AC vs DC' : 'Charging Times: AC vs DC Speed Comparison',
          shortDescription: locale === 'tr' ? 'Ev prizi, Wallbox ve DC hızlı şarj süreleri' : locale === 'de' ? 'Haushaltssteckdose, Wallbox und DC-Schnelllader im Vergleich' : locale === 'pl' ? 'Gniazdko domowe, Wallbox i szybka ładowarka DC' : 'Home socket, Wallbox, and DC fast charger durations compared',
          slug: 'phev-charging-times-ac-vs-dc'
        },
        {
          id: 'battery-life',
          title: locale === 'tr' ? 'Batarya Ömrü ve Degradasyon' : locale === 'de' ? 'Batterie-Lebensdauer und Degradation' : locale === 'pl' ? 'Żywotność baterii i degradacja' : 'Battery Life & Degradation',
          shortDescription: locale === 'tr' ? 'PHEV batarya ömrü ve uzun ömür için bakım tavsiyeleri' : locale === 'de' ? 'Lebensdauer, Garantie und Pflege von PHEV-Akkus' : locale === 'pl' ? 'Żywotność, gwarancja i pielęgnacja akumulatorów PHEV' : 'Lifespan expectations, warranty coverage, and care tips',
          slug: 'phev-battery-life-degradation'
        }
      ]
    },
    {
      id: 'charging',
      title: t.categories.charging.title,
      icon: '🔌',
      description: t.categories.charging.description,
      color: 'bg-orange-50 dark:bg-orange-900/20',
      textColor: 'text-orange-700 dark:text-orange-300',
      borderColor: 'border-orange-200 dark:border-orange-700',
      topics: [
        {
          id: 'charging-types',
          title: locale === 'tr' ? 'Şarj Tipleri ve Konnektör Standartları' : locale === 'de' ? 'Ladetypen und Steckersysteme' : locale === 'pl' ? 'Typy ładowania i złącza' : 'Charging Types & Connector Standards',
          shortDescription: locale === 'tr' ? 'Type 2, CCS ve ev şarjı seçenekleri' : locale === 'de' ? 'Typ 2, CCS Combo 2 und Haushaltsstecker erklärt' : locale === 'pl' ? 'Type 2, CCS Combo 2 i gniazdka domowe' : 'Type 2, CCS Combo 2, and home socket options explained',
          slug: 'phev-charging-types-connectors'
        },
        {
          id: 'home-charging',
          title: locale === 'tr' ? 'Ev Şarj Çözümleri: Wallbox vs Priz' : locale === 'de' ? 'Heimladen: Wallbox vs. Haushaltssteckdose' : locale === 'pl' ? 'Ładowanie domowe: Wallbox vs gniazdko' : 'Home Charging: Wallbox vs Domestic Outlet',
          shortDescription: locale === 'tr' ? 'Ev tipi şarj için priz yeterli mi yoksa Wallbox şart mı?' : locale === 'de' ? 'Reicht eine Steckdose oder lohnt sich eine Wallbox?' : locale === 'pl' ? 'Czy gniazdko wystarczy, czy warto kupić Wallbox?' : 'Do you need a Wallbox or is a standard outlet enough?',
          slug: 'phev-home-charging-wallbox-vs-outlet'
        },
        {
          id: 'find-stations',
          title: locale === 'tr' ? 'Şarj İstasyonu Bulma Rehberi' : locale === 'de' ? 'Ladestationen finden: Apps und Tipps' : locale === 'pl' ? 'Wyszukiwanie stacji ładowania' : 'Finding Charging Stations: Apps & Tips',
          shortDescription: locale === 'tr' ? 'Avrupa\'da şarj noktası bulmak için uygulamalar ve ipuçları' : locale === 'de' ? 'Apps und Strategien für das Finden von Ladestationen in Europa' : locale === 'pl' ? 'Aplikacje i porady do znajdowania stacji ładowania w Europie' : 'Apps and strategies for locating public charging across Europe',
          slug: 'phev-find-charging-stations'
        }
      ]
    },
    {
      id: 'maintenance',
      title: t.categories.maintenance.title,
      icon: '🛠️',
      description: t.categories.maintenance.description,
      color: 'bg-red-50 dark:bg-red-900/20',
      textColor: 'text-red-700 dark:text-red-300',
      borderColor: 'border-red-200 dark:border-red-700',
      topics: [
        {
          id: 'maintenance-costs',
          title: locale === 'tr' ? 'PHEV Bakım Maliyeti ve Tasarruf' : locale === 'de' ? 'PHEV-Wartungskosten und Einsparungen' : locale === 'pl' ? 'Koszty utrzymania PHEV i oszczędności' : 'PHEV Maintenance Costs & Long-Term Savings',
          shortDescription: locale === 'tr' ? 'Azalan fren aşınması, motor bakımı ve yıllık tasarruf' : locale === 'de' ? 'Geringerer Bremsverschleiß, Motorwartung und jährliche Einsparungen' : locale === 'pl' ? 'Mniejsze zużycie hamulców, serwis silnika i roczne oszczędności' : 'Reduced brake wear, engine servicing, and annual savings breakdown',
          slug: 'phev-maintenance-costs'
        }
      ]
    }
  ]
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Guide",
    "name": t.title,
    "description": t.subtitle,
    "author": {
      "@type": "Organization",
      "name": "PHEVs.eu"
    },
    "about": {
      "@type": "Thing",
      "name": "Plug-in Hybrid Electric Vehicles"
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-full">
                <QuestionMarkCircleIcon className="h-12 w-12 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t.title}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-6">
              {t.subtitle}
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4 max-w-2xl mx-auto">
              <p className="text-blue-800 dark:text-blue-200 font-medium">
                📚 Comprehensive PHEV Guide • 🔧 Technical Details • 💰 Buying Tips • 🔌 Charging Solutions
              </p>
            </div>
          </div>

          {/* FAQ Categories */}
          <div className="space-y-8">
            {guideCategories.map((category) => (
              <div key={category.id} className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700">
                <div className="p-6 border-b border-gray-200 dark:border-slate-700">
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white flex items-center">
                    <span className="text-3xl mr-3">{category.icon}</span>
                    {category.title}
                  </h2>
                </div>
                
                <div className="p-6">
                  <div className="grid gap-4">
                    {category.topics.map((topic) => (
                      <Link
                        key={topic.id}
                        href={`/faq/${topic.slug}${locale !== 'en' ? `?lang=${locale}` : ''}`}
                        className="group block p-4 rounded-lg border border-gray-200 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {topic.title}
                            </h3>
                            <p className="mt-2 text-gray-600 dark:text-gray-300 text-sm">
                              {topic.shortDescription}
                            </p>
                          </div>
                          <ChevronRightIcon className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors ml-4 flex-shrink-0" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="mt-12 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-8 text-center">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              {locale === 'de' ? 'Nicht gefunden, was Sie suchen?' : locale === 'pl' ? 'Nie znalazłeś tego, czego szukasz?' : locale === 'tr' ? 'Aradığınızı Bulamadınız mı?' : "Can't Find What You're Looking For?"}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {locale === 'de' ? 'Unser Expertenteam hilft Ihnen gerne weiter.' : locale === 'pl' ? 'Nasz zespół ekspertów chętnie pomoże.' : locale === 'tr' ? 'Uzman ekibimiz size yardımcı olmaya hazır.' : 'Our expert team is ready to help you with any PHEV questions.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                {locale === 'de' ? 'Kontakt aufnehmen' : locale === 'pl' ? 'Skontaktuj się' : locale === 'tr' ? 'İletişime Geçin' : 'Contact Us'}
              </Link>
              <Link
                href="/compare"
                className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-slate-600 text-base font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
              >
                {locale === 'de' ? 'Fahrzeuge vergleichen' : locale === 'pl' ? 'Porównaj pojazdy' : locale === 'tr' ? 'Araç Karşılaştır' : 'Compare Vehicles'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}