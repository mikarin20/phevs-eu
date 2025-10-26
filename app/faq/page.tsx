import { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRightIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline'
import { getFaqTranslations } from '@/lib/i18n'

export const metadata: Metadata = {
  title: 'All You Need to Know About PHEV - Complete Guide | PHEVs.eu',
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
    title: 'All You Need to Know About PHEV - Complete Guide',
    description: 'Complete guide to Plug-in Hybrid Electric Vehicles (PHEV). Everything you need to know about PHEV technology, benefits, and buying guide.',
    type: 'website',
  },
}

// guideCategories will be generated dynamically based on locale

export default function PHEVGuidePage({ 
  searchParams 
}: { 
  searchParams: { lang?: string } 
}) {
  const locale = (searchParams?.lang as 'en' | 'tr' | 'de' | 'pl') || 'en'
  const t = getFaqTranslations(locale)
  
  // Generate guide categories dynamically based on locale
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
          id: 'phev-nedir',
          title: t.topics['phev-nedir'].title,
          shortDescription: t.topics['phev-nedir'].description,
          slug: 'phev-nedir-nasil-calisir'
        },
        {
          id: 'phev-bev-fark',
          title: t.topics['phev-bev-fark'].title,
          shortDescription: t.topics['phev-bev-fark'].description,
          slug: 'phev-bev-farki-nedir'
        },
        {
          id: 'phev-avantajlari',
          title: t.topics['phev-avantajlari'].title,
          shortDescription: t.topics['phev-avantajlari'].description,
          slug: 'phev-avantajlari-nelerdir'
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
          id: 'phev-satin-alma-rehberi',
          title: 'Complete PHEV Buying Guide',
          shortDescription: 'Everything to consider when buying a PHEV',
          slug: 'phev-satin-alma-rehberi'
        },
        {
          id: 'phev-fiyat-araligi',
          title: 'PHEV Price Ranges & Budget Planning',
          shortDescription: 'Understanding PHEV pricing and financing options',
          slug: 'phev-fiyat-araligi-nedir'
        },
        {
          id: 'phev-teşvikler',
          title: 'Government Incentives & Tax Benefits',
          shortDescription: 'Available incentives and tax benefits for PHEV buyers',
          slug: 'phev-tesvikler-hangi-ulkelerde'
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
          id: 'phev-menzil-hesaplama',
          title: 'PHEV Range Calculation & WLTP Standards',
          shortDescription: 'How PHEV range is calculated and what WLTP means',
          slug: 'phev-menzil-hesaplama-nasil'
        },
        {
          id: 'phev-sarj-sureleri',
          title: 'Charging Times & Speed Comparison',
          shortDescription: 'AC vs DC charging times and speed differences',
          slug: 'phev-sarj-sureleri-ne-kadar'
        },
        {
          id: 'phev-batarya-omru',
          title: 'Battery Life & Degradation',
          shortDescription: 'Understanding PHEV battery lifespan and maintenance',
          slug: 'phev-batarya-omru-ne-kadar'
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
          id: 'phev-sarj-tipleri',
          title: 'Charging Types & Connectors',
          shortDescription: 'Type 2, CCS, and home charging options explained',
          slug: 'phev-sarj-tipleri-nelerdir'
        },
        {
          id: 'ev-sarj-cihazi',
          title: 'Home Charging Solutions',
          shortDescription: 'Do you need a home charging station?',
          slug: 'ev-phev-sarj-cihazi-gerekli-mi'
        },
        {
          id: 'sarj-istasyonu-bulma',
          title: 'Finding Charging Stations',
          shortDescription: 'Apps and tools to locate charging stations',
          slug: 'phev-sarj-istasyonu-nasil-bulunur'
        }
      ]
    },
    {
      id: 'maintenance',
      title: t.categories.maintenance.title,
      icon: '🔧',
      description: t.categories.maintenance.description,
      color: 'bg-red-50 dark:bg-red-900/20',
      textColor: 'text-red-700 dark:text-red-300',
      borderColor: 'border-red-200 dark:border-red-700',
      topics: [
        {
          id: 'phev-bakim-maliyeti',
          title: 'Maintenance Costs & Savings',
          shortDescription: 'Understanding PHEV maintenance costs vs traditional cars',
          slug: 'phev-bakim-maliyeti-nedir'
        },
        {
          id: 'phev-garanti-suresi',
          title: 'Warranty Coverage & Terms',
          shortDescription: 'PHEV warranty coverage and battery guarantees',
          slug: 'phev-garanti-suresi-ne-kadar'
        },
        {
          id: 'phev-servis-aglari',
          title: 'Service Network & Support',
          shortDescription: 'PHEV service network availability and support',
          slug: 'phev-servis-aglari-yeterli-mi'
        }
      ]
    }
  ]
  
  // Guide Structured Data
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
                        href={`/faq/${topic.slug}${locale !== 'tr' ? `?lang=${locale}` : ''}`}
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
              Aradığınızı Bulamadınız mı?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Uzman ekibimiz size yardımcı olmaya hazır. Sorularınızı bize iletin.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                İletişime Geçin
              </Link>
              <Link
                href="/compare"
                className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-slate-600 text-base font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
              >
                Araç Karşılaştır
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}