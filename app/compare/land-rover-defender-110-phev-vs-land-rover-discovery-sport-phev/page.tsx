import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import carsData from '@/data/cars.json'

export const metadata: Metadata = {
  title: 'Land Rover Defender 110 vs Discovery Sport PHEV Karşılaştırması | PHEVs.eu',
  description: 'Land Rover Defender 110 P400e ve Discovery Sport P300e PHEV modellerini detaylı karşılaştırın. Fiyat, menzil, performans ve özellikler.',
  keywords: [
    'Land Rover Defender 110 P400e',
    'Discovery Sport P300e',
    'Land Rover PHEV karşılaştırması',
    'SUV PHEV',
    'Land Rover hibrit'
  ],
  openGraph: {
    title: 'Land Rover Defender vs Discovery Sport PHEV Karşılaştırması',
    description: 'Land Rover Defender 110 P400e ve Discovery Sport P300e PHEV modellerini karşılaştırın.',
    type: 'website',
  },
  alternates: {
    canonical: 'https://phevs.eu/compare/land-rover-defender-110-phev-vs-land-rover-discovery-sport-phev',
  },
}

export default function ComparePage() {
  const defender = carsData.find(car => car.id === 'land-rover-defender-110-phev')
  const discovery = carsData.find(car => car.id === 'land-rover-discovery-sport-phev')

  if (!defender || !discovery) {
    notFound()
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Land Rover Defender vs Discovery Sport PHEV Comparison",
    "description": "Detailed comparison between Land Rover Defender 110 P400e and Discovery Sport P300e PHEV models",
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
              Land Rover Defender vs Discovery Sport PHEV Karşılaştırması
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              İki güçlü Land Rover PHEV modelini detaylı olarak karşılaştırın
            </p>
          </div>

          {/* Comparison Cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Defender */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Land Rover Defender 110 P400e
                </h2>
                <div className="aspect-w-16 aspect-h-9 mb-6">
                  <img
                    src={defender.image_url}
                    alt={defender.model}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Fiyat:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">€{defender.price_eur.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Elektrik Menzili:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{defender.ev_range_km} km</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Toplam Güç:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{defender.power_hp} HP</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Yakıt Tüketimi:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{defender.fuel_consumption} L/100km</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Bagaj Hacmi:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{defender.trunk_volume}L</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Discovery Sport */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Discovery Sport P300e
                </h2>
                <div className="aspect-w-16 aspect-h-9 mb-6">
                  <img
                    src={discovery.image_url}
                    alt={discovery.model}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Fiyat:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">€{discovery.price_eur.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Elektrik Menzili:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{discovery.ev_range_km} km</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Toplam Güç:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{discovery.power_hp} HP</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Yakıt Tüketimi:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{discovery.fuel_consumption} L/100km</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Bagaj Hacmi:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{discovery.trunk_volume}L</span>
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
                      <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Defender 110 P400e</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Discovery Sport P300e</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-slate-600">
                    <tr>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-300">Fiyat</td>
                      <td className="py-3 px-4 font-semibold text-gray-900 dark:text-white">€{defender.price_eur.toLocaleString()}</td>
                      <td className="py-3 px-4 font-semibold text-gray-900 dark:text-white">€{discovery.price_eur.toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-300">Elektrik Menzili</td>
                      <td className="py-3 px-4 text-gray-900 dark:text-white">{defender.ev_range_km} km</td>
                      <td className="py-3 px-4 text-gray-900 dark:text-white">{discovery.ev_range_km} km</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-300">Toplam Güç</td>
                      <td className="py-3 px-4 text-gray-900 dark:text-white">{defender.power_hp} HP</td>
                      <td className="py-3 px-4 text-gray-900 dark:text-white">{discovery.power_hp} HP</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-300">Elektrik Motor Gücü</td>
                      <td className="py-3 px-4 text-gray-900 dark:text-white">{defender.electric_motor_power_hp} HP</td>
                      <td className="py-3 px-4 text-gray-900 dark:text-white">{discovery.electric_motor_power_hp} HP</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-300">Batarya Kapasitesi</td>
                      <td className="py-3 px-4 text-gray-900 dark:text-white">{defender.battery_kwh} kWh</td>
                      <td className="py-3 px-4 text-gray-900 dark:text-white">{discovery.battery_kwh} kWh</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-300">Yakıt Tüketimi</td>
                      <td className="py-3 px-4 text-gray-900 dark:text-white">{defender.fuel_consumption} L/100km</td>
                      <td className="py-3 px-4 text-gray-900 dark:text-white">{discovery.fuel_consumption} L/100km</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-300">CO2 Emisyonu</td>
                      <td className="py-3 px-4 text-gray-900 dark:text-white">{defender.co2_emission} g/km</td>
                      <td className="py-3 px-4 text-gray-900 dark:text-white">{discovery.co2_emission} g/km</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-300">AC Şarj Süresi</td>
                      <td className="py-3 px-4 text-gray-900 dark:text-white">{defender.charge_time_ac} saat</td>
                      <td className="py-3 px-4 text-gray-900 dark:text-white">{discovery.charge_time_ac} saat</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-300">Bagaj Hacmi</td>
                      <td className="py-3 px-4 text-gray-900 dark:text-white">{defender.trunk_volume}L</td>
                      <td className="py-3 px-4 text-gray-900 dark:text-white">{discovery.trunk_volume}L</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-300">Koltuk Sayısı</td>
                      <td className="py-3 px-4 text-gray-900 dark:text-white">{defender.seats}</td>
                      <td className="py-3 px-4 text-gray-900 dark:text-white">{discovery.seats}</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-300">Ağırlık</td>
                      <td className="py-3 px-4 text-gray-900 dark:text-white">{defender.weight_kg} kg</td>
                      <td className="py-3 px-4 text-gray-900 dark:text-white">{discovery.weight_kg} kg</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Conclusion */}
          <div className="mt-12 bg-green-50 dark:bg-green-900/20 rounded-lg p-8">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Sonuç
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">
                  Land Rover Defender 110 P400e
                </h4>
                <p className="text-green-700 dark:text-green-300">
                  Daha güçlü motor ve büyük bagaj hacmi ile off-road ve aile kullanımı için ideal. 
                  Yüksek fiyatına rağmen premium özellikler sunar.
                </p>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">
                  Discovery Sport P300e
                </h4>
                <p className="text-green-700 dark:text-green-300">
                  Daha uygun fiyat ve kompakt boyutu ile günlük kullanım için ideal. 
                  Aynı elektrik menzili ile ekonomik seçenek.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

