import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import carsData from '@/data/cars.json'

export const metadata: Metadata = {
  title: 'Lexus ES 300h vs UX 300e Karşılaştırması | PHEVs.eu',
  description: 'Lexus ES 300h ve UX 300e PHEV modellerini detaylı karşılaştırın. Fiyat, menzil, performans ve özellikler.',
  keywords: [
    'Lexus ES 300h',
    'Lexus UX 300e',
    'Lexus PHEV karşılaştırması',
    'lüks sedan PHEV',
    'Lexus hibrit'
  ],
  openGraph: {
    title: 'Lexus ES vs UX PHEV Karşılaştırması',
    description: 'Lexus ES 300h ve UX 300e PHEV modellerini karşılaştırın.',
    type: 'website',
  },
}

export default function ComparePage() {
  const es = carsData.find(car => car.id === 'lexus-es-300h-phev')
  const ux = carsData.find(car => car.id === 'lexus-ux-300e-phev')

  if (!es || !ux) {
    notFound()
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Lexus ES vs UX PHEV Comparison",
    "description": "Detailed comparison between Lexus ES 300h and UX 300e PHEV models",
    "brand": "Lexus",
    "category": "PHEV Comparison"
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Lexus ES 300h vs UX 300e Karşılaştırması
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              İki farklı Lexus PHEV modelini detaylı karşılaştırın
            </p>
          </div>

          {/* Cars Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* ES */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden">
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={es.image_url}
                  alt={es.model}
                  className="w-full h-64 object-cover"
                />
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {es.model}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {es.ev_range_km}km elektrik menzili • €{es.price_eur?.toLocaleString()}
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Elektrik Menzili:</span>
                    <span className="font-semibold">{es.ev_range_km} km</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Güç:</span>
                    <span className="font-semibold">{es.power_hp} HP</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Batarya:</span>
                    <span className="font-semibold">{es.battery_kwh} kWh</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Yakıt Tüketimi:</span>
                    <span className="font-semibold">{es.fuel_consumption} L/100km</span>
                  </div>
                </div>
              </div>
            </div>

            {/* UX */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden">
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={ux.image_url}
                  alt={ux.model}
                  className="w-full h-64 object-cover"
                />
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {ux.model}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {ux.ev_range_km}km elektrik menzili • €{ux.price_eur?.toLocaleString()}
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Elektrik Menzili:</span>
                    <span className="font-semibold">{ux.ev_range_km} km</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Güç:</span>
                    <span className="font-semibold">{ux.power_hp} HP</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Batarya:</span>
                    <span className="font-semibold">{ux.battery_kwh} kWh</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Yakıt Tüketimi:</span>
                    <span className="font-semibold">{ux.fuel_consumption} L/100km</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Detaylı Karşılaştırma
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-slate-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Özellik
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {es.model}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {ux.model}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      Fiyat
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      €{es.price_eur?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      €{ux.price_eur?.toLocaleString()}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      Elektrik Menzili
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {es.ev_range_km} km
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {ux.ev_range_km} km
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      Güç
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {es.power_hp} HP
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {ux.power_hp} HP
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      Batarya Kapasitesi
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {es.battery_kwh} kWh
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {ux.battery_kwh} kWh
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      Yakıt Tüketimi
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {es.fuel_consumption} L/100km
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {ux.fuel_consumption} L/100km
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      CO2 Emisyonu
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {es.co2_emission} g/km
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {ux.co2_emission} g/km
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
