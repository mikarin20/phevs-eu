import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Page Not Found (404) | PHEVs.eu',
  description: 'The requested plug-in hybrid page or vehicle model could not be found. Explore our complete PHEV database, comparison tool, and buyer guides.',
  robots: {
    index: false,
    follow: true,
  },
}

export default function NotFound() {
  const popularModels = [
    { name: 'BMW 2 Series Active Tourer', href: '/models/bmw-2-series-active-tourer-phev' },
    { name: 'Jeep Wrangler 4xe Rubicon', href: '/models/jeep-wrangler-4xe-rubicon-phev' },
    { name: 'Audi A6 Limousine PHEV', href: '/models/audi-a6-limousine-phev' },
    { name: 'Renault Rafale E-Tech', href: '/models/renault-rafale-phev' },
    { name: 'Omoda 9 PHEV', href: '/models/omoda-9-phev' },
    { name: 'MG HS II 1.5T PHEV', href: '/models/mg-hs-ii-1-5t' },
  ]

  const popularGuides = [
    { title: 'Longest Range PHEVs (100+ km)', href: '/longest-range-phev', badge: 'Top Range' },
    { title: 'PHEVs with DC Fast Charging', href: '/phev-with-dc-charging', badge: 'Fast Charge' },
    { title: '7-Seater Family Plug-in Hybrids', href: '/7-seater-phev', badge: '3-Row SUVs' },
    { title: 'PHEV Vehicle Comparison Tool', href: '/compare', badge: 'Side-by-Side' },
    { title: 'PHEV Buyer & Technology Guide', href: '/faq', badge: 'FAQ & Help' },
  ]

  return (
    <div className="min-h-[80vh] bg-slate-950 text-slate-100 flex items-center justify-center px-4 py-16">
      <div className="max-w-2xl w-full text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-semibold mb-6">
          <span>Error 404</span>
          <span>•</span>
          <span>Page Not Found</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-4">
          Looking for a <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">PHEV?</span>
        </h1>
        <p className="text-slate-400 text-base sm:text-lg mb-8 max-w-lg mx-auto">
          The page or vehicle model you requested might have been moved, updated, or does not exist. Explore our most popular models and guides below:
        </p>

        {/* Popular Categories */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 text-left mb-8 shadow-xl">
          <h2 className="text-xs uppercase tracking-wider font-semibold text-emerald-400 mb-4">
            Popular Guides &amp; Categories
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {popularGuides.map((guide) => (
              <Link
                key={guide.href}
                href={guide.href}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900 transition-all text-sm group"
              >
                <span className="font-medium text-slate-200 group-hover:text-emerald-300">{guide.title}</span>
                <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  {guide.badge}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Popular Vehicle Links */}
        <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-6 text-left mb-8">
          <h2 className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-3">
            Trending PHEV Models
          </h2>
          <div className="flex flex-wrap gap-2">
            {popularModels.map((car) => (
              <Link
                key={car.href}
                href={car.href}
                className="text-xs px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-emerald-500/20 hover:text-emerald-300 border border-slate-700/80 text-slate-300 transition-colors"
              >
                {car.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Primary Action Button */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-3 font-semibold text-white shadow-lg shadow-emerald-500/20 hover:from-emerald-600 hover:to-teal-700 transition-all"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  )
}
