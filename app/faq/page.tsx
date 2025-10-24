import { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRightIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline'

export const metadata: Metadata = {
  title: 'PHEV SSS - Sık Sorulan Sorular | PHEVs.eu',
  description: 'Plug-in hibrit elektrikli araçlar hakkında en sık sorulan sorular ve detaylı cevaplar. PHEV satın alma, şarj, menzil ve teknik özellikler hakkında bilmeniz gereken her şey.',
  keywords: [
    'PHEV SSS',
    'plug-in hibrit sorular',
    'PHEV satın alma rehberi',
    'hibrit araç soruları',
    'elektrikli araç SSS',
    'PHEV şarj soruları',
    'hibrit araç menzil'
  ],
  openGraph: {
    title: 'PHEV SSS - Sık Sorulan Sorular | PHEVs.eu',
    description: 'Plug-in hibrit elektrikli araçlar hakkında en sık sorulan sorular ve detaylı cevaplar.',
    type: 'website',
  },
}

const faqCategories = [
  {
    id: 'genel',
    title: 'Genel Sorular',
    icon: '🔍',
    questions: [
      {
        id: 'phev-nedir',
        question: 'PHEV nedir ve nasıl çalışır?',
        shortAnswer: 'Plug-in Hybrid Electric Vehicle (PHEV), hem elektrik motoru hem de benzin motoru bulunan hibrit araçlardır.',
        slug: 'phev-nedir-nasil-calisir'
      },
      {
        id: 'phev-bev-fark',
        question: 'PHEV ile BEV arasındaki fark nedir?',
        shortAnswer: 'PHEV hem elektrik hem benzin kullanırken, BEV sadece elektrikle çalışır.',
        slug: 'phev-bev-farki-nedir'
      },
      {
        id: 'phev-avantajlari',
        question: 'PHEV\'in avantajları nelerdir?',
        shortAnswer: 'Düşük yakıt tüketimi, uzun menzil, şarj altyapısı bağımsızlığı ve çevre dostu sürüş.',
        slug: 'phev-avantajlari-nelerdir'
      }
    ]
  },
  {
    id: 'satin-alma',
    title: 'Satın Alma Rehberi',
    icon: '💰',
    questions: [
      {
        id: 'phev-satin-alma-rehberi',
        question: 'PHEV satın alırken nelere dikkat etmeliyim?',
        shortAnswer: 'Menzil, şarj süresi, fiyat, garanti ve servis ağı gibi faktörleri değerlendirin.',
        slug: 'phev-satin-alma-rehberi'
      },
      {
        id: 'phev-fiyat-araligi',
        question: 'PHEV fiyat aralığı nedir?',
        shortAnswer: 'PHEV fiyatları 25.000€ ile 150.000€ arasında değişmektedir.',
        slug: 'phev-fiyat-araligi-nedir'
      },
      {
        id: 'phev-teşvikler',
        question: 'PHEV için hangi teşvikler mevcut?',
        shortAnswer: 'Ülkeye göre değişen devlet teşvikleri, vergi indirimleri ve şarj altyapı desteği.',
        slug: 'phev-tesvikler-hangi-ulkelerde'
      }
    ]
  },
  {
    id: 'teknik',
    title: 'Teknik Özellikler',
    icon: '⚙️',
    questions: [
      {
        id: 'phev-menzil-hesaplama',
        question: 'PHEV menzili nasıl hesaplanır?',
        shortAnswer: 'WLTP test döngüsü ile belirlenen elektrik menzili ve hibrit menzil toplamı.',
        slug: 'phev-menzil-hesaplama-nasil'
      },
      {
        id: 'phev-sarj-sureleri',
        question: 'PHEV şarj süreleri ne kadar?',
        shortAnswer: 'AC şarj 2-8 saat, DC hızlı şarj 30-60 dakika arasında değişir.',
        slug: 'phev-sarj-sureleri-ne-kadar'
      },
      {
        id: 'phev-batarya-omru',
        question: 'PHEV batarya ömrü ne kadar?',
        shortAnswer: 'Modern PHEV bataryaları 8-10 yıl veya 150.000-200.000 km dayanabilir.',
        slug: 'phev-batarya-omru-ne-kadar'
      }
    ]
  },
  {
    id: 'sarj',
    title: 'Şarj ve Altyapı',
    icon: '🔌',
    questions: [
      {
        id: 'phev-sarj-tipleri',
        question: 'PHEV şarj tipleri nelerdir?',
        shortAnswer: 'Type 2 AC şarj, CCS DC hızlı şarj ve ev tipi şarj cihazları.',
        slug: 'phev-sarj-tipleri-nelerdir'
      },
      {
        id: 'ev-sarj-cihazi',
        question: 'Evde PHEV şarj cihazı gerekli mi?',
        shortAnswer: 'Zorunlu değil ama daha hızlı ve güvenli şarj için önerilir.',
        slug: 'ev-phev-sarj-cihazi-gerekli-mi'
      },
      {
        id: 'sarj-istasyonu-bulma',
        question: 'PHEV şarj istasyonu nasıl bulunur?',
        shortAnswer: 'Mobil uygulamalar, harita servisleri ve araç içi navigasyon ile.',
        slug: 'phev-sarj-istasyonu-nasil-bulunur'
      }
    ]
  },
  {
    id: 'bakim',
    title: 'Bakım ve Servis',
    icon: '🔧',
    questions: [
      {
        id: 'phev-bakim-maliyeti',
        question: 'PHEV bakım maliyeti nedir?',
        shortAnswer: 'Geleneksel araçlara göre daha düşük bakım maliyeti, daha az fren ve motor bakımı.',
        slug: 'phev-bakim-maliyeti-nedir'
      },
      {
        id: 'phev-garanti-suresi',
        question: 'PHEV garanti süresi ne kadar?',
        shortAnswer: 'Genellikle 3-5 yıl veya 100.000 km, batarya için 8 yıl garanti.',
        slug: 'phev-garanti-suresi-ne-kadar'
      },
      {
        id: 'phev-servis-aglari',
        question: 'PHEV servis ağları yeterli mi?',
        shortAnswer: 'Ana markaların servis ağları PHEV bakımı için yeterli ekipmana sahip.',
        slug: 'phev-servis-aglari-yeterli-mi'
      }
    ]
  }
]

export default function FAQPage() {
  // FAQ Structured Data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqCategories.flatMap(category => 
      category.questions.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.shortAnswer
        }
      }))
    )
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
              <QuestionMarkCircleIcon className="h-12 w-12 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              PHEV Sık Sorulan Sorular
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Plug-in hibrit elektrikli araçlar hakkında merak ettiğiniz her şeyi detaylı cevaplarla bulun.
              Uzman ekibimiz tarafından hazırlanan kapsamlı rehberler.
            </p>
          </div>

          {/* FAQ Categories */}
          <div className="space-y-8">
            {faqCategories.map((category) => (
              <div key={category.id} className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700">
                <div className="p-6 border-b border-gray-200 dark:border-slate-700">
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white flex items-center">
                    <span className="text-3xl mr-3">{category.icon}</span>
                    {category.title}
                  </h2>
                </div>
                
                <div className="p-6">
                  <div className="grid gap-4">
                    {category.questions.map((faq) => (
                      <Link
                        key={faq.id}
                        href={`/faq/${faq.slug}`}
                        className="group block p-4 rounded-lg border border-gray-200 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {faq.question}
                            </h3>
                            <p className="mt-2 text-gray-600 dark:text-gray-300 text-sm">
                              {faq.shortAnswer}
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