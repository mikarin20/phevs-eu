import type { Metadata } from 'next';
import Link from 'next/link';
import {
  CheckBadgeIcon,
  DocumentCheckIcon,
  ShieldCheckIcon,
  CpuChipIcon,
  BeakerIcon,
  ClockIcon,
  EnvelopeIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

export const metadata: Metadata = {
  title: 'About PHEVs.eu — European Plug-in Hybrid Technical Data & Benchmark Platform',
  description:
    'Learn about PHEVs.eu: Europe\'s independent engineering and data analysis initiative tracking plug-in hybrid electric vehicles. Verified against official WLTP test sheets and European regulatory filings.',
  alternates: {
    canonical: 'https://www.phevs.eu/about/',
  },
  openGraph: {
    title: 'About PHEVs.eu — Technical Data & Verification Platform',
    description:
      'Rigorous automotive data analysis, real-world WLTP benchmarking, DC fast-charging telemetry, and corporate tax compliance across Europe.',
    url: 'https://www.phevs.eu/about/',
    type: 'website',
    siteName: 'PHEVs.eu',
    images: [
      {
        url: 'https://www.phevs.eu/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'About PHEVs.eu — European Plug-in Hybrid Technical Data Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About PHEVs.eu — Technical Data & Verification Platform',
    description:
      'Europe\'s independent engineering and data analysis platform tracking plug-in hybrid electric vehicles.',
    images: ['https://www.phevs.eu/images/og-image.jpg'],
  },
};

export default function AboutPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'AboutPage',
        '@id': 'https://www.phevs.eu/about/#webpage',
        url: 'https://www.phevs.eu/about/',
        name: 'About PHEVs.eu — European Plug-in Hybrid Technical Data & Benchmark Platform',
        description:
          'Europe\'s independent engineering and data analysis initiative tracking plug-in hybrid electric vehicles. Verified against official WLTP test sheets and European regulatory filings.',
        inLanguage: 'en',
        isPartOf: {
          '@type': 'WebSite',
          '@id': 'https://www.phevs.eu/#website',
          name: 'PHEVs.eu',
          url: 'https://www.phevs.eu/',
        },
      },
      {
        '@type': 'Organization',
        '@id': 'https://www.phevs.eu/#organization',
        name: 'PHEVs.eu',
        url: 'https://www.phevs.eu/',
        logo: 'https://www.phevs.eu/logo.png',
        description:
          'Independent automotive research and technical benchmarking platform focused on Plug-in Hybrid Electric Vehicles (PHEVs) across the European market.',
        publishingPrinciples: 'https://www.phevs.eu/about/#methodology',
        knowsAbout: [
          'Plug-in Hybrid Electric Vehicles',
          'WLTP Test Cycles and Utility Factors',
          'CCS Combo 2 and CHAdeMO DC Fast Charging Architecture',
          'Euro 6e-bis Emissions Compliance',
          'European Company Car Tax Regulations (UK BiK, German 0.5% Rule, French Malus)',
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

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Breadcrumb Header */}
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-4">
          <Link href="/" className="hover:underline">Home</Link>
          <span>/</span>
          <span>About & Methodology</span>
        </div>

        {/* Hero Title */}
        <div className="border-b border-slate-200 dark:border-slate-800 pb-8 mb-10">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4">
            About PHEVs.eu
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
            Europe&apos;s independent automotive data analysis project dedicated exclusively to
            <span className="text-slate-900 dark:text-white font-semibold"> Plug-in Hybrid Electric Vehicles (PHEVs)</span>.
            We provide verified technical telemetry, official WLTP benchmarking, and corporate tax analytics.
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-6 text-xs text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 font-medium">
              <CheckBadgeIcon className="w-4 h-4" />
              Independent Data Initiative
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 font-medium">
              <DocumentCheckIcon className="w-4 h-4" />
              Verified Regulatory Filings
            </span>
            <span className="inline-flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
              <ClockIcon className="w-4 h-4" />
              Updated: October 2026
            </span>
          </div>
        </div>

        {/* Main Content Sections */}
        <div className="space-y-12">
          {/* Mission & Purpose */}
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <CpuChipIcon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              Our Core Purpose: Technical Transparency in the PHEV Sector
            </h2>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
              As the European automotive landscape undergoes rapid decarbonization, Plug-in Hybrids serve as
              a crucial bridge technology. However, prospective buyers, fleet managers, and automotive engineers
              frequently encounter fragmented marketing figures, inconsistent battery buffer metrics, and
              confusing charging standards.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              <strong>PHEVs.eu</strong> was created to solve this problem by providing a single, standardized,
              and rigorously curated database of every PHEV sold across the 27 EU member states, the UK, Norway,
              and Switzerland.
            </p>
          </section>

          {/* Methodology & Verification */}
          <section id="methodology" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-2xl font-bold mb-3 flex items-center gap-2 text-slate-900 dark:text-white">
              <BeakerIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              Data Collection & Verification Methodology (EEAT)
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
              Our editorial and data team applies strict cross-validation protocols before publishing any vehicle specification:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/50">
                <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white mb-2">
                  <DocumentCheckIcon className="w-5 h-5 text-emerald-600" />
                  1. Official EC-WVTA & Homologation Filings
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Data points including electric range (EAER), CO2 emissions (g/km), and electrical consumption
                  (Wh/km) are cross-checked against European Whole Vehicle Type Approval certificates and UNECE
                  Regulation 101/154 official test reports.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/50">
                <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white mb-2">
                  <ChartBarIcon className="w-5 h-5 text-blue-600" />
                  2. Gross vs. Usable Battery Buffer Analysis
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  We distinguish between gross installed battery pack size and actual usable net kWh capacity.
                  We monitor cell chemistry (NMC, LFP, Blade) and pack thermal management architectures
                  (liquid cooling vs. passive).
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/50">
                <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white mb-2">
                  <ShieldCheckIcon className="w-5 h-5 text-purple-600" />
                  3. Euro NCAP & Safety Benchmarks
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Crash safety scores, adult/child occupant protection metrics, and ADAS assistance packages
                  are linked directly from official Euro NCAP and partner ANCAP laboratory test protocols.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/50">
                <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white mb-2">
                  <CheckBadgeIcon className="w-5 h-5 text-amber-600" />
                  4. Regulatory & Tax Modeling (Euro 6e-bis)
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Company car tax calculators (UK Benefit-in-Kind, German 0.5% Dienstwagen privilege, French Malus
                  thresholds, Belgian corporate deductibility) strictly reflect active 2025/2026 European fiscal codes
                  and newly enacted Utility Factor revisions.
                </p>
              </div>
            </div>

            {/* Verification Footnote */}
            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <strong>Data Verification Statement:</strong> Sourced from official manufacturer WLTP test sheets,
                European Commission homologation databases, and UNECE regulatory filings.
              </div>
              <div className="font-semibold text-slate-700 dark:text-slate-300 shrink-0">
                Verified: October 2026
              </div>
            </div>
          </section>

          {/* Independence & Editorial Standards */}
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <ShieldCheckIcon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              Editorial Integrity & Zero Commercial Bias
            </h2>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
              PHEVs.eu is 100% editorially independent. We do not accept paid vehicle placements, sponsored ranking
              boosts, or manufacturer compensation to alter specifications. Every calculation—from 0-100 km/h
              acceleration rankings to total electric range and charging speed ratings—is generated strictly by
              objective mathematical ranking algorithms.
            </p>
          </section>

          {/* Contact / Editorial Corrections */}
          <section className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 rounded-2xl p-6 sm:p-8">
            <h2 className="text-xl font-bold mb-2 text-blue-900 dark:text-blue-100 flex items-center gap-2">
              <EnvelopeIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Manufacturer Inquiries & Technical Peer Review
            </h2>
            <p className="text-sm text-blue-800 dark:text-blue-200 mb-4 leading-relaxed">
              Are you an automotive manufacturer, OEM engineer, or fleet researcher with updated homologation
              sheets or press documentation for an upcoming 2026 or 2027 PHEV release?
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
              <span className="text-slate-600 dark:text-slate-400">Editorial Desk:</span>
              <a
                href="mailto:editor@phevs.eu"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                editor@phevs.eu
              </a>
              <span className="text-slate-300 dark:text-slate-700">|</span>
              <span className="text-slate-600 dark:text-slate-400">Data Correction Submissions:</span>
              <a
                href="mailto:data@phevs.eu"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                data@phevs.eu
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
