import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import carsData from '@/data/cars.json'

export const metadata: Metadata = {
  title: 'Range Rover Evoque P300e vs Range Rover Velar P400e Karşılaştırması | PHEVs.eu',
  description: 'Range Rover Evoque P300e ve Range Rover Velar P400e PHEV modellerini detaylı karşılaştırın. Fiyat, menzil, performans ve özellikler.',
  keywords: [
    'Range Rover Evoque P300e',
    'Range Rover Velar P400e',
    'Land Rover PHEV karşılaştırması',
    'lüks SUV PHEV',
    'Range Rover hibrit'
  ],
  openGraph: {
    title: 'Range Rover Evoque vs Velar PHEV Karşılaştırması',
    description: 'Range Rover Evoque P300e ve Range Rover Velar P400e PHEV modellerini karşılaştırın.',
    type: 'website',
  },
  alternates: {
    canonical: 'https://phevs.eu/compare/land-rover-range-rover-evoque-phev-vs-land-rover-range-rover-velar-phev',
  },
}

export default function ComparePage() {
  const evoque = carsData.find(car => car.id === 'land-rover-range-rover-evoque-phev')
  const velar = carsData.find(car => car.id === 'land-rover-range-rover-velar-phev')

  if (!evoque || !velar) {
    notFound()
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Range Rover Evoque vs Velar PHEV Comparison",
    "description": "Detailed comparison between Range Rover Evoque P300e and Range Rover Velar P400e PHEV models",
    "brand": "Land Rover",
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
              Range Rover Evoque vs Velar PHEV Karşılaştırması
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              İki lüks Land Rover PHEV modelini detaylı olarak karşılaştırın
            </p>
          </div>

          {/* Comparison Cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Evoque */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Range Rover Evoque P300e
                </h2>
                <div className="aspect-w-16 aspect-h-9 mb-6">
                  <img
                    src={evoque.image_url}
                    alt={evoque.model}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Fiyat:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">€{evoque.price_eur.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Elektrik Menzili:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{evoque.ev_range_km} km</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Toplam Güç:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{evoque.power_hp} HP</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Yakıt Tüketimi:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{evoque.fuel_consumption} L/100km</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Bagaj Hacmi:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{evoque.trunk_volume}L</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Velar */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Range Rover Velar P400e
                </h2>
                <div className="aspect-w-16 aspect-h-9 mb-6">
                  <img
                    src={velar.image_url}
                    alt={velar.model}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Fiyat:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">€{velar.price_eur.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Elektrik Menzili:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{velar.ev_range_km} km</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Toplam Güç:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{velar.power_hp} HP</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Yakıt Tüketimi:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{velar.fuel_consumption} L/100km</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Bagaj Hacmi:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{velar.trunk_volume}L</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Comparison Table */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Detaylı Karşılaştırma
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-slate-600">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Özellik</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Evoque P300e</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Velar P400e</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-slate-600">
                    <tr>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-300">Fiyat</td>
                      <td className="py-3 px-4 font-semibold text-gray-900 dark:text-white">€{evoque.price_eur.toLocaleString()}</td>
                      <td className="py-3 px-4 font-semibold text-gray-900 dark:text-white">€{velar.price_eur.toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-300">Elektrik Menzili</td>
                      <td className="py-3 px-4 text-gray-900 dark:text-white">{evoque.ev_range_km} km</td>
                      <td className="py-3 px-4 text-gray-900 dark:text-white">{velar.ev_range_km} km</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-300">Toplam Güç</td>
                      <td className="py-3 px-4 text-gray-900 dark:text-white">{evoque.power_hp} HP</td>
                      <td className="py-3 px-4 text-gray-900 dark:text-white">{velar.power_hp} HP</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-300">Elektrik Motor Gücü</td>
                      <td className="py-3 px-4 text-gray-900 dark:text-white">{evoque.electric_motor_power_hp} HP</td>
                      <td className="py-3 px-4 text-gray-900 dark:text-white">{velar.electric_motor_power_hp} HP</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-300">Batarya Kapasitesi</td>
                      <td className="py-3 px-4 text-gray-900 dark:text-white">{evoque.battery_kwh} kWh</td>
                      <td className="py-3 px-4 text-gray-900 dark:text-white">{velar.battery_kwh} kWh</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-300">Yakıt Tüketimi</td>
                      <td className="py-3 px-4 text-gray-900 dark:text-white">{evoque.fuel_consumption} L/100km</td>
                      <td className="py-3 px-4 text-gray-900 dark:text-white">{velar.fuel_consumption} L/100km</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-300">CO2 Emisyonu</td>
                      <td className="py-3 px-4 text-gray-900 dark:text-white">{evoque.co2_emission} g/km</td>
                      <td className="py-3 px-4 text-gray-900 dark:text-white">{velar.co2_emission} g/km</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-300">AC Şarj Süresi</td>
                      <td className="py-3 px-4 text-gray-900 dark:text-white">{evoque.charge_time_ac} saat</td>
                      <td className="py-3 px-4 text-gray-900 dark:text-white">{velar.charge_time_ac} saat</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-300">Bagaj Hacmi</td>
                      <td className="py-3 px-4 text-gray-900 dark:text-white">{evoque.trunk_volume}L</td>
                      <td className="py-3 px-4 text-gray-900 dark:text-white">{velar.trunk_volume}L</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-300">Koltuk Sayısı</td>
                      <td className="py-3 px-4 text-gray-900 dark:text-white">{evoque.seats}</td>
                      <td className="py-3 px-4 text-gray-900 dark:text-white">{velar.seats}</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-300">Ağırlık</td>
                      <td className="py-3 px-4 text-gray-900 dark:text-white">{evoque.weight_kg} kg</td>
                      <td className="py-3 px-4 text-gray-900 dark:text-white">{velar.weight_kg} kg</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Conclusion */}
          <div className="mt-12 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-8">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Sonuç
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">
                  Range Rover Evoque P300e
                </h4>
                <p className="text-blue-700 dark:text-blue-300">
                  Daha kompakt boyutu ve uygun fiyatı ile şehir kullanımı için ideal. 
                  Aynı elektrik menzili ile günlük kullanımda yeterli.
                </p>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">
                  Range Rover Velar P400e
                </h4>
                <p className="text-blue-700 dark:text-blue-300">
                  Daha güçlü motor ve lüks özellikler ile premium deneyim sunar. 
                  Daha büyük bagaj hacmi ile aile kullanımı için uygun.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

