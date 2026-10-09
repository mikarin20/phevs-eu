import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllReports } from '@/lib/community-telemetry'
import TelemetryHubClient from '@/components/TelemetryHubClient'
import {
  ShieldCheck,
  Zap,
  Snowflake,
  Fuel,
  Calculator,
  ChevronRight,
  ArrowRight
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Real-World PHEV Electric Range & Fuel Consumption Benchmarks (2026) | PHEVs.eu',
  description: 'Verifiable real-world PHEV owner telemetry from European drivers. Compare actual summer vs winter electric range loss, depleted-battery highway fuel consumption (L/100km), and long-term reliability.',
  alternates: {
    canonical: 'https://www.phevs.eu/real-world-telemetry/',
    languages: {
      'x-default': 'https://www.phevs.eu/real-world-telemetry/',
      en: 'https://www.phevs.eu/real-world-telemetry/',
      de: 'https://www.phevs.eu/real-world-telemetry/',
      tr: 'https://www.phevs.eu/real-world-telemetry/',
      pl: 'https://www.phevs.eu/real-world-telemetry/',
      fr: 'https://www.phevs.eu/real-world-telemetry/',
      es: 'https://www.phevs.eu/real-world-telemetry/',
    }
  },
  openGraph: {
    title: 'Real-World PHEV Electric Range & Fuel Consumption Benchmarks | PHEVs.eu',
    description: 'Actual driver telemetries from verified plug-in hybrid owners across Europe: winter EV range penalty, empty battery highway consumption, and lifetime efficiency.',
    url: 'https://www.phevs.eu/real-world-telemetry/',
    type: 'website',
    siteName: 'PHEVs.eu',
    images: [{ url: 'https://www.phevs.eu/images/og-image.jpg', width: 1200, height: 630, alt: 'PHEV Real-World Telemetry & Consumption Benchmarks' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Real-World PHEV Electric Range & Fuel Consumption | PHEVs.eu',
    description: 'Verified real-world plug-in hybrid owner data: summer vs winter EV range, highway consumption with empty battery.',
    images: ['https://www.phevs.eu/images/og-image.jpg']
  }
}

export default function RealWorldTelemetryPage() {
  const reports = getAllReports()

  // Generate aggregate structured dataset
  const totalKmLogged = reports.reduce((acc, r) => acc + r.odometerKm, 0)
  const avgSummer = Math.round(reports.reduce((acc, r) => acc + r.realEvRangeSummerKm, 0) / (reports.length || 1))
  const avgWinter = Math.round(reports.reduce((acc, r) => acc + r.realEvRangeWinterKm, 0) / (reports.length || 1))
  const avgEmptyFuel = Number((reports.reduce((acc, r) => acc + r.emptyBatteryFuelL100, 0) / (reports.length || 1)).toFixed(1))

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": "https://www.phevs.eu/real-world-telemetry/#webpage",
        "url": "https://www.phevs.eu/real-world-telemetry/",
        "name": "Real-World PHEV Electric Range & Fuel Consumption Benchmarks",
        "description": "Comprehensive community-verified database of real-world plug-in hybrid electric range and depleted battery fuel consumption.",
        "breadcrumb": {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.phevs.eu/" },
            { "@type": "ListItem", "position": 2, "name": "Models", "item": "https://www.phevs.eu/models/" },
            { "@type": "ListItem", "position": 3, "name": "Real-World Telemetry", "item": "https://www.phevs.eu/real-world-telemetry/" }
          ]
        }
      },
      {
        "@type": "Dataset",
        "@id": "https://www.phevs.eu/real-world-telemetry/#dataset",
        "name": "European Plug-in Hybrid Real-World Owner Telemetry Dataset",
        "description": `Crowdsourced and verified owner telemetry covering ${reports.length} driver submissions logging ${totalKmLogged.toLocaleString('en-GB')} km across European and global PHEVs.`,
        "url": "https://www.phevs.eu/real-world-telemetry/",
        "creator": { "@type": "Organization", "name": "PHEVs.eu", "url": "https://www.phevs.eu" },
        "variableMeasured": [
          "Real-World Warm EV Range (km)",
          "Real-World Winter EV Range (km)",
          "Empty-Battery Charge-Sustaining Fuel Consumption (L/100 km)",
          "Electric Consumption Efficiency (kWh/100 km)",
          "Lifetime Blended Fuel Economy (L/100 km)"
        ]
      },
      {
        "@type": "FAQPage",
        "@id": "https://www.phevs.eu/real-world-telemetry/#faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How much electric range do PHEVs lose during winter in real-world driving?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `According to verified driver telemetry logging over ${totalKmLogged.toLocaleString('en-GB')} km, European PHEV drivers experience an average electric range drop of 25% to 35% in sub-zero or cold winter conditions (averaging ${avgWinter} km in winter vs ${avgSummer} km in warm weather), primarily due to cabin HVAC heating and lithium-ion electrochemical internal resistance.`
            }
          },
          {
            "@type": "Question",
            "name": "What is the fuel consumption of a Plug-in Hybrid when the battery is completely depleted?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `In charge-sustaining hybrid mode (with 0% displayed electric range), owner-verified fuel consumption averages ${avgEmptyFuel} L/100 km on mixed highway and secondary roads across tested European models.`
            }
          },
          {
            "@type": "Question",
            "name": "Does a heat pump improve PHEV winter electric range?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes. Models equipped with heat pumps (such as the Mitsubishi Outlander PHEV and Toyota RAV4 Prime) preserve 15% to 20% more electric range below 5°C compared to models without heat pumps (like the Kia Sorento or Jeep Wrangler), which are forced to idle the petrol combustion engine to provide cabin heating."
            }
          }
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

      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
        {/* Navigation Breadcrumb Bar */}
        <div className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between text-xs">
            <nav className="flex items-center space-x-1.5 text-slate-500 dark:text-slate-400">
              <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Home</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link href="/models/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Models</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="font-semibold text-slate-900 dark:text-white">Real-World Telemetry</span>
            </nav>

            <div className="flex items-center space-x-3">
              <Link
                href="/range-calculator/"
                className="hidden sm:inline-flex items-center space-x-1 font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                <Calculator className="w-3.5 h-3.5" />
                <span>Range Simulator</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Hero Header */}
        <section className="border-b border-slate-200 dark:border-slate-800 bg-gradient-to-b from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-950 py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60 mb-4">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Verified Owner Telemetry Database</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                Real-World PHEV Electric Range &amp; Fuel Consumption
              </h1>
              <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                Official WLTP brochure numbers rarely match daily reality. Explore crowdsourced, verified driver telemetries from European and global plug-in hybrid owners: winter range loss, empty-battery highway fuel economy, and real-world durability.
              </p>
            </div>
          </div>
        </section>

        {/* Interactive Hub Client Component */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <TelemetryHubClient initialReports={reports} />
        </main>
      </div>
    </>
  )
}
