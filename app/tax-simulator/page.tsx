import type { Metadata } from 'next'
import Link from 'next/link'
import carsData from '@/data/cars.json'
import CompanyCarTaxSimulatorPageClient from '@/components/CompanyCarTaxSimulatorPageClient'
import { ArrowLeftIcon, SparklesIcon, ShieldCheckIcon, ScaleIcon } from '@heroicons/react/24/outline'

export const metadata: Metadata = {
  title: 'Euro 6e-bis & Company Car (BiK) Tax Simulator 2026 | PHEVs.eu',
  description: 'Interactive company car tax calculator for plug-in hybrids across Europe. Calculate UK BiK rates (2%-5%), German 0.5% Dienstwagen taxation, France Malus exemptions, and Euro 6e-bis Utility Factor risk.',
  alternates: {
    canonical: 'https://phevs.eu/tax-simulator',
    languages: {
      'x-default': 'https://phevs.eu/tax-simulator',
      en: 'https://phevs.eu/tax-simulator',
      de: 'https://phevs.eu/tax-simulator',
      fr: 'https://phevs.eu/tax-simulator',
      es: 'https://phevs.eu/tax-simulator',
      tr: 'https://phevs.eu/tax-simulator',
      pl: 'https://phevs.eu/tax-simulator',
    }
  },
  openGraph: {
    title: 'Euro 6e-bis & Company Car (BiK) Tax Simulator | PHEVs.eu',
    description: 'Calculate European plug-in hybrid company car tax savings: UK BiK, Germany 0.5% rule, France Malus, Belgium corporate deductibility, and Euro 6e-bis regulation.',
    url: 'https://phevs.eu/tax-simulator',
    type: 'website',
    siteName: 'PHEVs.eu'
  }
}

export default function TaxSimulatorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Euro 6e-bis & Company Car (BiK) Tax Simulator",
    "url": "https://phevs.eu/tax-simulator",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "All",
    "description": "Calculate UK Benefit-in-Kind (BiK) brackets, German 0.5% company car taxation, French Malus exemptions, and Euro 6e-bis Utility Factor compliance for plug-in hybrid electric vehicles."
  }

  const breadcrumbsJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://phevs.eu/" },
      { "@type": "ListItem", "position": 2, "name": "Tools", "item": "https://phevs.eu/#tools" },
      { "@type": "ListItem", "position": 3, "name": "Euro 6e-bis & BiK Tax Simulator", "item": "https://phevs.eu/tax-simulator" }
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

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/20 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-slate-800 dark:text-slate-100">
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
                <h1 className="text-lg sm:text-2xl font-black bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 bg-clip-text text-transparent truncate">
                  Euro 6e-bis & Company Car (BiK) Tax Simulator
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                  Calculate European Corporate Fleet Taxation, National Savings & 2026/2027 Regulatory Compliance
                </p>
              </div>
              <div className="w-16 sm:w-24"></div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <CompanyCarTaxSimulatorPageClient cars={carsData as any[]} />
        </main>
      </div>
    </>
  )
}
