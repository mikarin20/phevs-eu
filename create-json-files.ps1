# App klasörü dosyalarını oluşturan script
Write-Host "App klasörü dosyaları oluşturuluyor..." -ForegroundColor Green

# app/layout.tsx
$layoutTsx = @'
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
'@

$layoutTsx | Out-File -FilePath "app\layout.tsx" -Encoding UTF8
Write-Host "app/layout.tsx oluşturuldu" -ForegroundColor Green

# app/page.tsx
$pageTsx = @'
export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">PHEVs.eu</h1>
              <span className="ml-2 text-sm text-gray-500">PHEV Karşılaştırma</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            PHEV Karşılaştırma Sitesi
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Avrupa'nın en kapsamlı PHEV karşılaştırma platformu
          </p>
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold mb-4">Yakında!</h2>
            <p className="text-gray-600">
              Site geliştirme aşamasında. Çok yakında yayında!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
'@

$pageTsx | Out-File -FilePath "app\page.tsx" -Encoding UTF8
Write-Host "app/page.tsx oluşturuldu" -ForegroundColor Green

# app/globals.css
$globalsCss = @'
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    font-family: 'Inter', system-ui, sans-serif;
  }
}

@layer components {
  .btn-primary {
    @apply bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors;
  }
  
  .btn-secondary {
    @apply bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors;
  }
  
  .card {
    @apply bg-white rounded-lg shadow-md border border-gray-200 p-6;
  }
}
'@

$globalsCss | Out-File -FilePath "app\globals.css" -Encoding UTF8
Write-Host "app/globals.css oluşturuldu" -ForegroundColor Green

Write-Host "Tüm app dosyaları oluşturuldu!" -ForegroundColor Green
Write-Host "Şimdi GitHub Desktop'da commit yapın." -ForegroundColor Cyan