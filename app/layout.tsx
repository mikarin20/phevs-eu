import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PHEVs.eu - PHEV Karşılaştırma Sitesi',
  description: 'Avrupa\'nın en kapsamlı PHEV karşılaştırma platformu. Gerçek dünya test sonuçları, fiyat karşılaştırması ve ülke bazlı teşvik bilgileri.',
  keywords: 'PHEV, plug-in hybrid, elektrikli araç, hibrit araç, karşılaştırma',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          {children}
        </div>
      </body>
    </html>
  )
}
