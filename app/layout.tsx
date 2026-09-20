import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  fallback: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', 'sans-serif'],
  adjustFontFallback: true,
  variable: '--font-inter'
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1e40af',
}

export const metadata: Metadata = {
  metadataBase: new URL('https://www.phevs.eu'),
  alternates: {
    canonical: 'https://www.phevs.eu/',
    languages: {
      'x-default': 'https://www.phevs.eu/',
      en: 'https://www.phevs.eu/',
      tr: 'https://www.phevs.eu/',
      de: 'https://www.phevs.eu/',
      pl: 'https://www.phevs.eu/',
    },
  },
  // Open Graph configuration is defined below with full details
  title: {
    default: 'PHEV Database & Comparison Platform 2026 | PHEVs.eu',
    template: '%s | PHEVs.eu'
  },
  description: 'Europe\'s largest PHEV database. Browse and compare plug-in hybrid electric vehicles with real-world specs, battery capacity, and electric range.',
  keywords: [
    'PHEV database',
    'PHEV comparison',
    'plug-in hybrid database',
    'plug-in hybrid',
    'electric vehicle',
    'hybrid car comparison',
    'EV range',
    'Europe PHEV',
    'best PHEV 2026',
    'best PHEV 2025',
    'plug-in hybrid cars',
    'hybrid vehicle specs'
  ],
  authors: [{ name: 'PHEVs.eu Team' }],
  creator: 'PHEVs.eu',
  publisher: 'PHEVs.eu',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_EU',
    url: 'https://www.phevs.eu',
    title: 'PHEV Database & Comparison Platform 2026 | PHEVs.eu',
    description: 'Europe\'s largest PHEV database. Browse and compare plug-in hybrid electric vehicles with real-world specs, battery capacity, and electric range.',
    siteName: 'PHEVs.eu',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'PHEV database - compare plug-in hybrid electric vehicles - PHEVs.eu',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PHEV Database & Comparison Platform 2026 | PHEVs.eu',
    description: 'Europe\'s largest PHEV database. Browse and compare plug-in hybrid electric vehicles with real-world specs, battery capacity, and electric range.',
    images: ['/images/og-image.jpg'],
    creator: '@phevs_eu',
    site: '@phevs_eu',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'MiBl_KrtsZLX8SAjRd78wq5NBtC-WJOrHcIY1ptplcE',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          // Organization schema
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "PHEVs.eu",
            "url": "https://www.phevs.eu",
            "logo": "https://www.phevs.eu/favicon.svg",
            "sameAs": [
              "https://twitter.com/phevs_eu",
              "https://www.linkedin.com/company/phevs-eu/"
            ]
          }) }}
        />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* next/font already preloads fonts; explicit preload removed */}
        
        {/* Flag Icons CSS - preconnect + stylesheet */}
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/lipis/flag-icons@7.2.3/css/flag-icons.min.css"
        />
        
        {/* AdSense Script */}
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2031503694387888"
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />
        
        {/* Google Analytics 4 (GA4) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-KBE5R47P25"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-KBE5R47P25');
          `}
        </Script>
      </head>
      <body className={`${inter.className} ${inter.variable}`}>
        {children}
        
        {/* Footer */}
        <footer className="bg-slate-900 text-white py-8 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="mb-4">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <svg
                    viewBox="0 0 64 64"
                    className="w-6 h-6 text-white"
                    fill="currentColor"
                  >
                    {/* Gas Pump Body */}
                    <rect x="20" y="8" width="24" height="40" rx="2" fill="currentColor" />
                    
                    {/* Gas Pump Screen */}
                    <rect x="24" y="12" width="16" height="8" rx="1" fill="white" />
                    
                    {/* Fuel Drop Icon */}
                    <path d="M28 16 L30 18 L32 16 L30 14 Z" fill="currentColor" />
                    
                    {/* Lightning Icon */}
                    <path d="M36 16 L38 18 L36 20 L38 22 L36 20 L34 18 Z" fill="currentColor" />
                    
                    {/* Fuel Hose */}
                    <path d="M20 20 Q16 20 12 24 Q8 28 8 32" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
                    
                    {/* Fuel Nozzle */}
                    <rect x="6" y="30" width="6" height="4" rx="1" fill="currentColor" />
                    
                    {/* Electric Cable */}
                    <path d="M44 20 Q48 20 52 24 Q56 28 56 32" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
                    
                    {/* Electric Plug */}
                    <rect x="54" y="30" width="6" height="4" rx="1" fill="currentColor" />
                    <rect x="55" y="28" width="4" height="2" fill="currentColor" />
                    
                    {/* Base */}
                    <rect x="16" y="48" width="32" height="8" rx="4" fill="currentColor" />
                  </svg>
                  <h3 className="text-lg font-semibold">PHEVs.eu</h3>
                </div>
                <p className="text-slate-300 text-sm">
                  Europe's most comprehensive plug-in hybrid vehicle comparison platform
                </p>
              </div>
              
              <div className="border-t border-slate-700 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-3">About</h4>
                    <ul className="space-y-2 text-xs text-slate-400">
                      <li><a href="/about" className="hover:text-white transition-colors" title="About Us">About Us</a></li>
                      <li><a href="/blog" className="hover:text-white transition-colors" title="PHEV News">PHEV News</a></li>
                      <li><a href="/videos" className="hover:text-white transition-colors" title="PHEV Videos">Videos</a></li>
                      <li><a href="/demo" className="hover:text-white transition-colors" title="Demo">Demo</a></li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-3">Legal</h4>
                    <ul className="space-y-2 text-xs text-slate-400">
                      <li><a href="/privacy" className="hover:text-white transition-colors" title="Privacy Policy">Privacy Policy</a></li>
                      <li><a href="/terms" className="hover:text-white transition-colors" title="Terms of Service">Terms of Service</a></li>
                      <li><a href="/cookies" className="hover:text-white transition-colors" title="Cookie Policy">Cookie Policy</a></li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-3">Resources</h4>
                    <ul className="space-y-2 text-xs text-slate-400">
                      <li><a href="/longest-range-phev" className="hover:text-white transition-colors" title="Longest Range PHEVs (100+ km)">Longest Range PHEVs (100+ km)</a></li>
                      <li><a href="/phev-with-dc-charging" className="hover:text-white transition-colors" title="PHEVs with DC Fast Charging">DC Fast Charging PHEVs</a></li>
                      <li><a href="/7-seater-phev" className="hover:text-white transition-colors" title="7-Seater Family PHEVs">7-Seater Family PHEVs</a></li>
                      <li><a href="/tax-simulator" className="hover:text-white transition-colors text-emerald-400 font-medium" title="Euro 6e-bis & Company Car (BiK) Tax Simulator">Euro 6e-bis & Tax Simulator</a></li>
                      <li><a href="/compare" className="hover:text-white transition-colors" title="Compare Vehicles">Compare Vehicles</a></li>
                      <li><a href="/videos" className="hover:text-white transition-colors" title="Comparison & Review Videos">Comparison Videos</a></li>
                      <li><a href="/faq" className="hover:text-white transition-colors" title="All You Need to Know About PHEV">All You Need to Know About PHEV</a></li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-3">Connect</h4>
                    <ul className="space-y-2 text-xs text-slate-400">
                      <li><a href="https://twitter.com/phevs_eu" className="hover:text-white transition-colors" title="Twitter" rel="nofollow">Twitter</a></li>
                      <li><a href="https://linkedin.com/company/phevs-eu" className="hover:text-white transition-colors" title="LinkedIn" rel="nofollow">LinkedIn</a></li>
                      <li><a href="mailto:info@phevs.eu" className="hover:text-white transition-colors" title="Email">Email</a></li>
                    </ul>
                  </div>
                </div>
                
                <div className="border-t border-slate-700 pt-4">
                  <p className="text-slate-400 text-xs">
                    Data sources: EV-Database, Euro NCAP, manufacturer specifications, WLTP testing
                  </p>
                  <p className="text-slate-500 text-xs mt-2">
                    © 2025 PHEVs.eu. All rights reserved.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
