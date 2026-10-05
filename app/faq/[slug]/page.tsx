import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeftIcon, ChevronRightIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline'
import { notFound } from 'next/navigation'
import { getFaqTranslations } from '@/lib/i18n'
import { getFaqData } from '@/lib/faq-data'
import LanguageSelector from '@/components/LanguageSelector'

interface FAQDetailProps {
  params: {
    slug: string
  }
  searchParams: {
    lang?: string
  }
}

export async function generateMetadata({ params, searchParams }: FAQDetailProps): Promise<Metadata> {
  const locale = (searchParams?.lang as 'en' | 'tr' | 'de' | 'pl') || 'en'
  const faq = getFaqData(params.slug, locale)
  
  if (!faq) {
    return {
      title: 'Page Not Found',
    }
  }

  return {
    title: faq.title,
    description: `Detailed PHEV guide: ${faq.title}. Expert-written comprehensive reference for plug-in hybrid electric vehicle owners and buyers.`,
    keywords: [
      'PHEV',
      'plug-in hybrid',
      faq.title.toLowerCase(),
      'hybrid car guide',
      'electric vehicle'
    ],
    openGraph: {
      title: `${faq.title} | PHEVs.eu`,
      description: `Detailed PHEV guide: ${faq.title}`,
      type: 'article',
    },
    alternates: {
      canonical: `https://www.phevs.eu/faq/${params.slug}/`,
      languages: {
        'x-default': `https://www.phevs.eu/faq/${params.slug}/`,
        en: `https://www.phevs.eu/faq/${params.slug}/`,
        tr: `https://www.phevs.eu/faq/${params.slug}/?lang=tr`,
        de: `https://www.phevs.eu/faq/${params.slug}/?lang=de`,
        pl: `https://www.phevs.eu/faq/${params.slug}/?lang=pl`,
      },
    },
  }
}

export default function FAQDetail({ params, searchParams }: FAQDetailProps) {
  const locale = (searchParams?.lang as 'en' | 'tr' | 'de' | 'pl') || 'en'
  const t = getFaqTranslations(locale)
  
  const faq = getFaqData(params.slug, locale)

  if (!faq) {
    notFound()
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": {
      "@type": "Question",
      "name": faq.title,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.content.overview
      }
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
        {/* Sticky Top Navigation & Language Bar */}
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 py-3 sticky top-0 z-40 shadow-xs">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
            <nav className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400 flex-wrap">
              <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                {locale === 'tr' ? 'Ana Sayfa' : locale === 'de' ? 'Startseite' : locale === 'pl' ? 'Strona główna' : 'Home'}
              </Link>
              <span>/</span>
              <Link href={`/faq${locale !== 'en' ? `?lang=${locale}` : ''}`} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                {locale === 'tr' ? 'Rehber' : locale === 'de' ? 'Ratgeber' : locale === 'pl' ? 'Przewodnik' : 'FAQ'}
              </Link>
              <span>/</span>
              <span className="text-slate-900 dark:text-white font-medium truncate max-w-[180px] sm:max-w-xs">{faq.category}</span>
            </nav>

            <div className="flex items-center justify-center sm:justify-end">
              <LanguageSelector currentLocale={locale} basePath={`/faq/${params.slug}`} />
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          {/* Back Button */}
          <Link
            href={`/faq${locale !== 'en' ? `?lang=${locale}` : ''}`}
            className="inline-flex items-center text-xs sm:text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mb-6 group"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            {locale === 'tr' ? '← Tüm Sorulara ve Konulara Dön' : 
             locale === 'de' ? '← Zurück zu allen Fragen' :
             locale === 'pl' ? '← Powrót do wszystkich pytań' : '← Back to All Guides'}
          </Link>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <QuestionMarkCircleIcon className="h-8 w-8 text-blue-600 dark:text-blue-400 mr-3" />
              <span className="text-sm text-gray-500 dark:text-gray-400 bg-blue-100 dark:bg-blue-900/30 px-3 py-1 rounded-full">
                {faq.category}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {faq.title}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              {faq.content.overview}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
              {locale === 'tr' ? 'Son güncelleme:' : 
               locale === 'de' ? 'Letzte Aktualisierung:' :
               locale === 'pl' ? 'Ostatnia aktualizacja:' : 'Last updated:'} {new Date(faq.lastUpdated).toLocaleDateString(locale === 'tr' ? 'tr-TR' : locale === 'de' ? 'de-DE' : locale === 'pl' ? 'pl-PL' : 'en-GB')}
            </p>
          </div>

          {/* Content */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700">
            <div className="p-8">
              <div className="prose prose-lg max-w-none dark:prose-invert">
                {faq.content.sections.map((section, index) => (
                  <div key={index} className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                      {section.title}
                    </h2>
                    <div 
                      dangerouslySetInnerHTML={{ __html: section.content }}
                      className="text-gray-700 dark:text-gray-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Related Questions */}
          {faq.relatedQuestions.length > 0 && (
            <div className="mt-12 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                {locale === 'tr' ? 'İlgili Sorular' : 
                 locale === 'de' ? 'Verwandte Themen' :
                 locale === 'pl' ? 'Powiązane tematy' : 'Related Topics'}
              </h3>
              <div className="space-y-3">
                {faq.relatedQuestions.map((relatedSlug) => {
                  const relatedFaq = getFaqData(relatedSlug, locale)
                  if (!relatedFaq) return null
                  
                  return (
                    <Link
                      key={relatedSlug}
                      href={`/faq/${relatedSlug}${locale !== 'en' ? `?lang=${locale}` : ''}`}
                      className="block p-4 rounded-lg border border-gray-200 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-lg font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                          {relatedFaq.title}
                        </h4>
                        <ChevronRightIcon className="h-5 w-5 text-gray-400 hover:text-blue-500 transition-colors" />
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="mt-12 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-8 text-center">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              {locale === 'tr' ? 'Hala Sorunuz mu Var?' : 
               locale === 'de' ? 'Haben Sie noch Fragen?' :
               locale === 'pl' ? 'Masz jeszcze pytania?' : 'Still Have Questions?'}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {locale === 'tr' ? 'Uzman ekibimiz size yardımcı olmaya hazır. Sorularınızı bize iletin.' : 
               locale === 'de' ? 'Unser Expertenteam ist bereit, Ihnen zu helfen.' :
               locale === 'pl' ? 'Nasz zespół ekspertów jest gotowy, aby Ci pomóc.' : 'Our expert team is ready to help you. Send us your questions.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                {locale === 'tr' ? 'İletişime Geçin' : 
                 locale === 'de' ? 'Kontakt aufnehmen' :
                 locale === 'pl' ? 'Skontaktuj się' : 'Contact Us'}
              </Link>
              <Link
                href="/compare"
                className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-slate-600 text-base font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
              >
                {locale === 'tr' ? 'Araç Karşılaştır' : 
                 locale === 'de' ? 'Fahrzeuge vergleichen' :
                 locale === 'pl' ? 'Porównaj pojazdy' : 'Compare Vehicles'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export async function generateStaticParams() {
  return [
    { slug: 'what-is-phev-how-it-works' },
    { slug: 'phev-vs-bev-differences' },
    { slug: 'phev-benefits-and-advantages' },
    { slug: 'phev-buying-guide' },
    { slug: 'phev-price-ranges' },
    { slug: 'phev-range-wltp-calculation' },
    { slug: 'phev-charging-times-ac-vs-dc' },
    { slug: 'phev-battery-life-degradation' },
    { slug: 'phev-charging-types-connectors' },
    { slug: 'phev-home-charging-wallbox-vs-outlet' },
    { slug: 'phev-find-charging-stations' },
    { slug: 'phev-maintenance-costs' },
  ]
}