# English version app files
Write-Host "Creating English version app files..." -ForegroundColor Green

# app/layout.tsx (English)
$layoutTsx = @'
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
'@

$layoutTsx | Out-File -FilePath "app\layout.tsx" -Encoding UTF8
Write-Host "app/layout.tsx (English) created" -ForegroundColor Green

# app/page.tsx (English)
$pageTsx = @'
export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">PHEVs.eu</h1>
              <span className="ml-2 text-sm text-gray-500">PHEV Comparison</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            PHEV Comparison Site
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Europe's most comprehensive PHEV comparison platform
          </p>
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold mb-4">Coming Soon!</h2>
            <p className="text-gray-600">
              Site is under development. Coming very soon!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
'@

$pageTsx | Out-File -FilePath "app\page.tsx" -Encoding UTF8
Write-Host "app/page.tsx (English) created" -ForegroundColor Green

Write-Host "English version app files created!" -ForegroundColor Green
Write-Host "Now commit to GitHub Desktop." -ForegroundColor Cyan