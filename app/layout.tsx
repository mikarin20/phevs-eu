import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://phevs.eu'),
  title: {
    default: 'PHEVs.eu - Compare 87 Plug-in Hybrid Vehicles from 28 Brands',
    template: '%s | PHEVs.eu'
  },
  description: 'Compare 87 plug-in hybrid electric vehicles (PHEVs) from 28 premium brands. Find the best PHEV for your needs with detailed specifications, pricing, electric range, and real-world performance data across Europe.',
  keywords: [
    'PHEV comparison',
    'plug-in hybrid',
    'electric vehicle',
    'hybrid car comparison',
    'EV range',
    'Europe PHEV',
    'best PHEV 2025',
    'PHEV price comparison',
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
    url: 'https://phevs.eu',
    title: 'PHEVs.eu - Compare 87 Plug-in Hybrid Vehicles',
    description: 'Europe\'s most comprehensive PHEV comparison platform. Compare 87 plug-in hybrid vehicles from 28 brands with detailed specs, pricing, and performance data.',
    siteName: 'PHEVs.eu',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'PHEVs.eu - PHEV Comparison Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PHEVs.eu - Compare 87 Plug-in Hybrid Vehicles',
    description: 'Compare 87 plug-in hybrid vehicles from 28 brands. Find the best PHEV for your needs.',
    images: ['/images/og-image.jpg'],
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
    // Google Search Console verification code eklenecek
    google: 'your-google-verification-code',
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
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1e40af" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        {/* Flag Icons CDN */}
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/lipis/flag-icons@7.2.3/css/flag-icons.min.css" />
      </head>
      <body className={inter.className}>
        {children}
        
        {/* Footer */}
        <footer className="bg-slate-900 text-white py-8 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="mb-4">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" viewBox="0 0 64 64" fill="none">
                      <rect x="20" y="32" width="24" height="20" rx="2" fill="currentColor" opacity="0.8"/>
                      <rect x="22" y="8" width="20" height="20" rx="2" fill="currentColor" opacity="0.9"/>
                      <path d="M28 16C28 14.5 29 13 30.5 13C32 13 33 14.5 33 16C33 17.5 30.5 20 30.5 20C30.5 20 28 17.5 28 16Z" fill="white"/>
                      <path d="M36 14L34 18H37L35 22L36 14Z" fill="white"/>
                      <path d="M20 36C16 36 12 40 12 44C12 48 16 52 20 52" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round"/>
                      <rect x="8" y="50" width="8" height="4" rx="1" fill="currentColor"/>
                      <rect x="10" y="48" width="4" height="6" rx="1" fill="currentColor"/>
                      <path d="M44 36C48 36 52 40 52 44C52 48 48 52 44 52" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round"/>
                      <rect x="48" y="50" width="8" height="4" rx="1" fill="currentColor"/>
                      <rect x="50" y="48" width="4" height="6" rx="1" fill="currentColor"/>
                      <rect x="51" y="46" width="2" height="8" rx="0.5" fill="currentColor"/>
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold">PHEVs.eu</h3>
                </div>
                <p className="text-slate-300 text-sm">
                  Europe's most comprehensive plug-in hybrid vehicle comparison platform
                </p>
              </div>
              
              <div className="border-t border-slate-700 pt-4">
                <p className="text-slate-400 text-xs">
                  Data sources: EV-Database, Euro NCAP, manufacturer specifications, WLTP testing
                </p>
                <p className="text-slate-500 text-xs mt-1">
                  Prices are estimated EU market values. Actual prices may vary by country and configuration.
                </p>
                <p className="text-slate-500 text-xs mt-2">
                  © 2025 PHEVs.eu. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
