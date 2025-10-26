import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeftIcon, ChevronRightIcon, QuestionMarkCircleIcon, GlobeAltIcon } from '@heroicons/react/24/outline'
import { notFound } from 'next/navigation'
import { getFaqTranslations } from '@/lib/i18n'
import { getFaqData } from '@/lib/faq-data'

interface FAQDetailProps {
  params: {
    slug: string
  }
  searchParams: {
    lang?: string
  }
}

export async function generateMetadata({ params }: FAQDetailProps): Promise<Metadata> {
  const faq = getFaqData(params.slug, 'tr') // Varsayılan olarak Türkçe metadata
  
  if (!faq) {
    return {
      title: 'Sayfa Bulunamadı | PHEVs.eu',
    }
  }

  return {
    title: `${faq.title} | PHEVs.eu`,
    description: `PHEV hakkında detaylı bilgi: ${faq.title}. Uzman ekibimiz tarafından hazırlanan kapsamlı rehber.`,
    keywords: [
      'PHEV',
      'plug-in hibrit',
      faq.title.toLowerCase(),
      'hibrit araç',
      'elektrikli araç'
    ],
    openGraph: {
      title: `${faq.title} | PHEVs.eu`,
      description: `PHEV hakkında detaylı bilgi: ${faq.title}`,
      type: 'article',
    },
  }
}

export default function FAQDetail({ params, searchParams }: FAQDetailProps) {
  // Dil algılama ve varsayılan dil ayarı
  const locale = (searchParams?.lang as 'en' | 'tr' | 'de' | 'pl') || 'tr'
  const t = getFaqTranslations(locale)
  
  // FAQ verisini dil desteği ile al
  const faq = getFaqData(params.slug, locale)

  if (!faq) {
    notFound()
  }

  // Dil seçenekleri
  const languageOptions = [
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'pl', name: 'Polski', flag: '🇵🇱' }
  ]

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
      
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-8">
            <Link href="/" className="hover:text-gray-700 dark:hover:text-gray-300">
              {locale === 'tr' ? 'Ana Sayfa' : 
               locale === 'en' ? 'Home' :
               locale === 'de' ? 'Startseite' :
               locale === 'pl' ? 'Strona główna' : 'Ana Sayfa'}
            </Link>
            <ChevronRightIcon className="h-4 w-4" />
            <Link href={`/faq${locale !== 'tr' ? `?lang=${locale}` : ''}`} className="hover:text-gray-700 dark:hover:text-gray-300">
              {locale === 'tr' ? 'SSS' : 
               locale === 'en' ? 'FAQ' :
               locale === 'de' ? 'FAQ' :
               locale === 'pl' ? 'FAQ' : 'SSS'}
            </Link>
            <ChevronRightIcon className="h-4 w-4" />
            <span className="text-gray-900 dark:text-white">{faq.category}</span>
          </nav>

          {/* Language Selector */}
          <div className="flex justify-end mb-6">
            <div className="relative">
              <select 
                value={locale}
                onChange={(e) => {
                  const newLang = e.target.value
                  const currentUrl = new URL(window.location.href)
                  currentUrl.searchParams.set('lang', newLang)
                  window.location.href = currentUrl.toString()
                }}
                className="appearance-none bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-blue-500 dark:hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {languageOptions.map((option) => (
                  <option key={option.code} value={option.code}>
                    {option.flag} {option.name}
                  </option>
                ))}
              </select>
              <GlobeAltIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Back Button */}
          <Link
            href={`/faq${locale !== 'tr' ? `?lang=${locale}` : ''}`}
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mb-8"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            {locale === 'tr' ? 'Tüm Sorulara Dön' : 
             locale === 'en' ? 'Back to All Questions' :
             locale === 'de' ? 'Zurück zu allen Fragen' :
             locale === 'pl' ? 'Powrót do wszystkich pytań' : 'Tüm Sorulara Dön'}
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
               locale === 'en' ? 'Last updated:' :
               locale === 'de' ? 'Letzte Aktualisierung:' :
               locale === 'pl' ? 'Ostatnia aktualizacja:' : 'Son güncelleme:'} {new Date(faq.lastUpdated).toLocaleDateString(locale === 'tr' ? 'tr-TR' : locale === 'de' ? 'de-DE' : locale === 'pl' ? 'pl-PL' : 'en-US')}
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
                 locale === 'en' ? 'Related Questions' :
                 locale === 'de' ? 'Verwandte Fragen' :
                 locale === 'pl' ? 'Powiązane pytania' : 'İlgili Sorular'}
              </h3>
              <div className="space-y-3">
                {faq.relatedQuestions.map((relatedSlug) => {
                  const relatedFaq = getFaqData(relatedSlug, locale)
                  if (!relatedFaq) return null
                  
                  return (
                    <Link
                      key={relatedSlug}
                      href={`/faq/${relatedSlug}${locale !== 'tr' ? `?lang=${locale}` : ''}`}
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
               locale === 'en' ? 'Still Have Questions?' :
               locale === 'de' ? 'Haben Sie noch Fragen?' :
               locale === 'pl' ? 'Masz jeszcze pytania?' : 'Hala Sorunuz mu Var?'}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {locale === 'tr' ? 'Uzman ekibimiz size yardımcı olmaya hazır. Sorularınızı bize iletin.' : 
               locale === 'en' ? 'Our expert team is ready to help you. Send us your questions.' :
               locale === 'de' ? 'Unser Expertenteam ist bereit, Ihnen zu helfen. Senden Sie uns Ihre Fragen.' :
               locale === 'pl' ? 'Nasz zespół ekspertów jest gotowy, aby Ci pomóc. Wyślij nam swoje pytania.' : 'Uzman ekibimiz size yardımcı olmaya hazır. Sorularınızı bize iletin.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                {locale === 'tr' ? 'İletişime Geçin' : 
                 locale === 'en' ? 'Contact Us' :
                 locale === 'de' ? 'Kontakt aufnehmen' :
                 locale === 'pl' ? 'Skontaktuj się' : 'İletişime Geçin'}
              </Link>
              <Link
                href="/compare"
                className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-slate-600 text-base font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
              >
                {locale === 'tr' ? 'Araç Karşılaştır' : 
                 locale === 'en' ? 'Compare Vehicles' :
                 locale === 'de' ? 'Fahrzeuge vergleichen' :
                 locale === 'pl' ? 'Porównaj pojazdy' : 'Araç Karşılaştır'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

// Static generation için gerekli
export async function generateStaticParams() {
  return [
    { slug: 'phev-nedir-nasil-calisir' },
    { slug: 'phev-bev-farki-nedir' },
    { slug: 'phev-avantajlari-nelerdir' },
    { slug: 'phev-satin-alma-rehberi' },
    { slug: 'phev-fiyat-araligi-nedir' },
    { slug: 'phev-tesvikler-hangi-ulkelerde' },
    { slug: 'phev-menzil-hesaplama-nasil' },
    { slug: 'phev-sarj-sureleri-ne-kadar' },
    { slug: 'phev-batarya-omru-ne-kadar' },
    { slug: 'phev-sarj-tipleri-nelerdir' },
    { slug: 'ev-phev-sarj-cihazi-gerekli-mi' },
    { slug: 'phev-sarj-istasyonu-nasil-bulunur' },
    { slug: 'phev-bakim-maliyeti-nedir' },
    { slug: 'phev-garanti-suresi-ne-kadar' },
    { slug: 'phev-servis-aglari-yeterli-mi' }
  ]
}