import type { Metadata } from 'next'
import Link from 'next/link'
import carsData from '@/data/cars.json'
import RangeCalculatorPageClient from '@/components/RangeCalculatorPageClient'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'

export const metadata: Metadata = {
  title: 'PHEV Range Calculator (2026) — Real-World vs WLTP Simulator',
  description: 'Calculate real-world electric range for Plug-in Hybrids based on temperature, heating/AC, driving speed, and heavy traffic conditions.',
  keywords: [
    'phev range calculator',
    'plug-in hybrid real world range',
    'phev electric range simulator',
    'phev charging cost calculator',
    'real world ev range',
    'skoda phev range',
    'menzil hesaplayıcı hibrit',
    'reichweitenrechner plug-in-hybrid',
    'kalkulator zasiegu phev',
    'phev winter range penalty',
    'phev fuel savings calculator'
  ],
  alternates: {
    canonical: 'https://www.phevs.eu/range-calculator/',
    languages: {
      'x-default': 'https://www.phevs.eu/range-calculator/',
      en: 'https://www.phevs.eu/range-calculator/',
      de: 'https://www.phevs.eu/range-calculator/',
      fr: 'https://www.phevs.eu/range-calculator/',
      es: 'https://www.phevs.eu/range-calculator/',
      tr: 'https://www.phevs.eu/range-calculator/',
      pl: 'https://www.phevs.eu/range-calculator/',
    }
  },
  openGraph: {
    title: 'PHEV Range Calculator (2026) — Real-World vs WLTP Simulator | PHEVs.eu',
    description: 'Calculate real-world electric range for Plug-in Hybrids based on temperature, heating/AC, driving speed, and heavy traffic conditions.',
    url: 'https://www.phevs.eu/range-calculator/',
    type: 'website',
    siteName: 'PHEVs.eu',
    images: [{
      url: 'https://www.phevs.eu/images/phev-range-calculator-og.jpg',
      width: 1200,
      height: 630,
      alt: 'PHEV Range Calculator (2026) — Real-World vs WLTP Simulator'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PHEV Range Calculator (2026) — Real-World vs WLTP Simulator | PHEVs.eu',
    description: 'Calculate real-world electric range for Plug-in Hybrids based on temperature, heating/AC, driving speed, and heavy traffic conditions.',
    images: ['https://www.phevs.eu/images/phev-range-calculator-og.jpg']
  }
}

export default function RangeCalculatorPage({ searchParams }: { searchParams?: { car?: string } }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "PHEV Range Calculator (2026) — Real-World vs WLTP Simulator",
    "description": "Calculate real-world electric range for Plug-in Hybrids based on temperature, heating/AC, driving speed, and heavy traffic conditions.",
    "url": "https://www.phevs.eu/range-calculator/",
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "All",
    "browserRequirements": "Requires JavaScript",
    "image": "https://www.phevs.eu/images/phev-range-calculator-og.jpg",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "EUR"
    },
    "featureList": [
      "Real-world range simulation based on WLTP test data",
      "Sub-zero winter and summer heatwave temperature degradation curves",
      "Aerodynamic drag penalty modeling at 100, 120, and 140 km/h",
      "Home electricity tariff vs petrol pump savings in local currencies (EUR, GBP, TRY, PLN)",
      "Battery State of Health (SOH) degradation modeling for used PHEVs",
      "Pre-conditioning recovery on grid power",
      "Dynamic DC and AC charging duration estimations"
    ]
  }

  const breadcrumbsJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.phevs.eu/" },
      { "@type": "ListItem", "position": 2, "name": "Tools", "item": "https://www.phevs.eu/#tools" },
      { "@type": "ListItem", "position": 3, "name": "PHEV Range Calculator", "item": "https://www.phevs.eu/range-calculator/" }
    ]
  }

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How accurate is this PHEV Range Simulator compared to official WLTP ratings?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our simulator builds upon official UNECE WLTP test-bench data and applies validated thermodynamic and aerodynamic equations (temperature efficiency curves, quadratic aerodynamic drag, PTC cabin heating draw, and battery SOH degradation). While actual driving varies by terrain and traffic, our simulator matches real-world European highway and commuting tests within ±5-8%."
        }
      },
      {
        "@type": "Question",
        "name": "How much money do I save on fuel by charging a PHEV at home?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Charging at home is typically 2.5 to 3.5 times cheaper per kilometer than petrol. For example, fully charging a 15 kWh battery at €0.28/kWh costs ~€4.20, providing ~60 km of range. Driving the same distance on petrol in a 7.5 L/100km SUV costs ~€8.00. This delivers net savings of €3.80 per full charge and over €950 annually for daily commuters."
        }
      },
      {
        "@type": "Question",
        "name": "Why does electric range drop significantly in winter temperatures?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Lithium-ion batteries operate via liquid electrolyte chemical transfers that slow down below 10°C, increasing internal resistance. Additionally, unlike petrol engines which produce copious waste heat, electric powertrains must heat the passenger cabin using high-voltage PTC resistance heaters or heat pumps drawing 2,000 to 4,000 Watts continuously."
        }
      },
      {
        "@type": "Question",
        "name": "Can I charge a plug-in hybrid using a standard household 2.3 kW socket?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! All PHEVs in Europe can be charged safely from a standard 230V household Schuko socket (using the manufacturer-supplied Mode 2 emergency cable). Because PHEV batteries range between 12 kWh and 25 kWh, a full charge takes 6 to 10 hours—ideal for overnight charging while sleeping."
        }
      }
    ]
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-slate-800 dark:text-slate-100">
        {/* Sticky Header */}
        <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/70 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <Link
                href="/"
                className="inline-flex items-center space-x-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors group"
              >
                <ArrowLeftIcon className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium text-sm">Back to Home</span>
              </Link>
              <div className="text-center flex-1 px-4">
                <span className="text-lg sm:text-2xl font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 bg-clip-text text-transparent truncate block">
                  PHEV Real-World Range & Savings Calculator
                </span>
                <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                  Simulate temperature, highway drag, cabin climate, charging costs and fuel savings
                </p>
              </div>
              <div className="w-16 sm:w-24"></div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <RangeCalculatorPageClient cars={carsData as any[]} initialCarId={searchParams?.car} />
        </main>
      </div>
    </>
  )
}
