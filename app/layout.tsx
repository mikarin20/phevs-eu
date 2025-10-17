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
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1e40af" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body className={inter.className}>
        {children}
        
        {/* Footer */}
        <footer className="bg-slate-900 text-white py-8 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">PHEVs.eu</h3>
                <p className="text-slate-300 text-sm">
                  Europe's most comprehensive plug-in hybrid vehicle comparison platform
                </p>
              </div>
              
              <div className="border-t border-slate-700 pt-4">
                <p className="text-slate-400 text-xs">
                  Data sources: Euro NCAP, manufacturer specifications, WLTP testing
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
