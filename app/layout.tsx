import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PHEVs.eu - PHEV Comparison Site',
  description: 'Europe\'s most comprehensive PHEV comparison platform. Real-world test results, price comparison and country-specific incentive information.',
  keywords: 'PHEV, plug-in hybrid, electric vehicle, hybrid car, comparison, Europe',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          {children}
        </div>
      </body>
    </html>
  )
}
