import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import carsData from '@/data/cars.json'

export const metadata: Metadata = {
  title: 'Lexus NX 450h+ vs RX 450h+ Karşılaştırması | PHEVs.eu',
  description: 'Lexus NX 450h+ ve RX 450h+ PHEV modellerini detaylı karşılaştırın. Fiyat, menzil, performans ve özellikler.',
  keywords: [
    'Lexus NX 450h+',
    'Lexus RX 450h+',
    'Lexus PHEV karşılaştırması',
    'lüks SUV PHEV',
    'Lexus hibrit'
  ],
  openGraph: {
    title: 'Lexus NX vs RX PHEV Karşılaştırması',
    description: 'Lexus NX 450h+ ve RX 450h+ PHEV modellerini karşılaştırın.',
    type: 'website',
  },
}

export default function ComparePage() {
  const nx = carsData.find(car => car.id === 'lexus-nx-450h-plus-phev')
  const rx = carsData.find(car => car.id === 'lexus-rx-450h-plus-phev')

  if (!nx || !rx) {
    notFound()
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Lexus NX vs RX PHEV Comparison",
    "description": "Detailed comparison between Lexus NX 450h+ and RX 450h+ PHEV models",
    "brand": "Lexus",
    "category": "PHEV SUV Comparison"
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
              Lexus NX 450h+ vs RX 450h+ Karşılaştırması
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              İki lüks Lexus PHEV SUV modelini detaylı karşılaştırın
            </p>
          </div>

          {/* Cars Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* NX */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden">
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={nx.image_url}
                  alt={nx.model}
                  className="w-full h-64 object-cover"
                />
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {nx.model}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {nx.ev_range_km}km elektrik menzili • €{nx.price_eur?.toLocaleString()}
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Elektrik Menzili:</span>
                    <span className="font-semibold">{nx.ev_range_km} km</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Güç:</span>
                    <span className="font-semibold">{nx.power_hp} HP</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Batarya:</span>
                    <span className="font-semibold">{nx.battery_kwh} kWh</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Yakıt Tüketimi:</span>
                    <span className="font-semibold">{nx.fuel_consumption} L/100km</span>
                  </div>
                </div>
              </div>
            </div>

            {/* RX */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden">
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={rx.image_url}
                  alt={rx.model}
                  className="w-full h-64 object-cover"
                />
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {rx.model}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {rx.ev_range_km}km elektrik menzili • €{rx.price_eur?.toLocaleString()}
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Elektrik Menzili:</span>
                    <span className="font-semibold">{rx.ev_range_km} km</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Güç:</span>
                    <span className="font-semibold">{rx.power_hp} HP</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Batarya:</span>
                    <span className="font-semibold">{rx.battery_kwh} kWh</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Yakıt Tüketimi:</span>
                    <span className="font-semibold">{rx.fuel_consumption} L/100km</span>
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
                      {nx.model}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {rx.model}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      Fiyat
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      €{nx.price_eur?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      €{rx.price_eur?.toLocaleString()}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      Elektrik Menzili
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {nx.ev_range_km} km
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {rx.ev_range_km} km
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      Güç
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {nx.power_hp} HP
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {rx.power_hp} HP
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      Batarya Kapasitesi
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {nx.battery_kwh} kWh
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {rx.battery_kwh} kWh
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      Yakıt Tüketimi
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {nx.fuel_consumption} L/100km
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {rx.fuel_consumption} L/100km
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      CO2 Emisyonu
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {nx.co2_emission} g/km
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {rx.co2_emission} g/km
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
