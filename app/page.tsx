'use client'

import { useState } from 'react'
import { MagnifyingGlassIcon, ArrowsUpDownIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'

interface Car {
  id: number
  brand: string
  model: string
  year: number
  ev_range_km: number
  fuel_consumption: number
  battery_kwh: number
  price_eur: number
  image_url: string
  power_hp: number
  co2_emission: number
  charge_time_ac: number
  charge_time_dc: number
}

export default function Home() {
  const [selectedCars, setSelectedCars] = useState<Car[]>([])
  const [showComparison, setShowComparison] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const cars: Car[] = [
    {
      id: 1,
      brand: "Peugeot",
      model: "3008 Hybrid4",
      year: 2025,
      ev_range_km: 59,
      fuel_consumption: 1.6,
      battery_kwh: 13.2,
      price_eur: 42900,
      image_url: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=300&fit=crop",
      power_hp: 180,
      co2_emission: 29,
      charge_time_ac: 3.5,
      charge_time_dc: 45
    },
    {
      id: 2,
      brand: "Kia",
      model: "Sportage PHEV",
      year: 2025,
      ev_range_km: 70,
      fuel_consumption: 1.4,
      battery_kwh: 13.8,
      price_eur: 38900,
      image_url: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop",
      power_hp: 195,
      co2_emission: 26,
      charge_time_ac: 3.2,
      charge_time_dc: 40
    }
  ]

  const filteredCars = cars.filter((car: Car) => 
    car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    car.model.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCarSelect = (car: Car) => {
    if (selectedCars.find(c => c.id === car.id)) {
      setSelectedCars(selectedCars.filter(c => c.id !== car.id))
    } else if (selectedCars.length < 3) {
      setSelectedCars([...selectedCars, car])
    }
  }

  const removeCar = (carId: number) => {
    setSelectedCars(selectedCars.filter(c => c.id !== carId))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">PHEVs.eu</h1>
              <span className="ml-2 text-sm text-gray-500">PHEV Comparison</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowComparison(!showComparison)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={selectedCars.length === 0}
              >
                <ArrowsUpDownIcon className="h-5 w-5" />
                <span>Compare ({selectedCars.length})</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sol Panel - Filtreler */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Filters</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                  <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">All Brands</option>
                    <option value="peugeot">Peugeot</option>
                    <option value="kia">Kia</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price Range (€)</label>
                  <div className="space-y-2">
                    <input type="number" placeholder="Min" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    <input type="number" placeholder="Max" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Electric Range (km)</label>
                  <div className="space-y-2">
                    <input type="number" placeholder="Min" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    <input type="number" placeholder="Max" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fuel Consumption (L/100km)</label>
                  <div className="space-y-2">
                    <input type="number" placeholder="Min" step="0.1" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    <input type="number" placeholder="Max" step="0.1" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                </div>
                <button className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors">
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {/* Orta Panel - Araç Listesi */}
          <div className="lg:w-1/2">
            {/* Arama Çubuğu */}
            <div className="mb-6">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by brand or model..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Sonuç Sayısı */}
            <div className="mb-4">
              <p className="text-sm text-gray-600">{filteredCars.length} vehicles found</p>
            </div>

            {/* Araç Kartları */}
            <div className="space-y-4">
              {filteredCars.map((car: Car) => (
                <div key={car.id} className={`bg-white rounded-lg shadow-md border border-gray-200 p-6 cursor-pointer transition-all duration-200 hover:shadow-lg ${selectedCars.find(c => c.id === car.id) ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}>
                  <div className="flex items-start space-x-4">
                    {/* Araç Resmi */}
                    <div className="flex-shrink-0">
                      <img
                        src={car.image_url}
                        alt={`${car.brand} ${car.model}`}
                        className="w-24 h-16 object-cover rounded-lg"
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/96x64/3B82F6/FFFFFF?text=PHEV'
                        }}
                      />
                    </div>

                    {/* Araç Bilgileri */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {car.brand} {car.model}
                        </h3>
                        <span className="text-sm text-gray-500">{car.year}</span>
                      </div>
                      
                      <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Electric Range:</span>
                          <span className="ml-1 font-medium text-green-600">{car.ev_range_km} km</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Fuel Consumption:</span>
                          <span className="ml-1 font-medium">{car.fuel_consumption} L/100km</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Battery:</span>
                          <span className="ml-1 font-medium">{car.battery_kwh} kWh</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Price:</span>
                          <span className="ml-1 font-medium text-blue-600">€{car.price_eur.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Seçim Butonu */}
                    <div className="flex-shrink-0">
                      <button
                        onClick={() => handleCarSelect(car)}
                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${
                          selectedCars.find(c => c.id === car.id)
                            ? 'bg-blue-600 border-blue-600 text-white'
                            : 'border-gray-300 hover:border-blue-500'
                        }`}
                      >
                        {selectedCars.find(c => c.id === car.id) && <CheckIcon className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sağ Panel - Karşılaştırma */}
          <div className="lg:w-1/4">
            {showComparison && selectedCars.length > 0 ? (
              <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Comparison</h3>
                  <span className="text-sm text-gray-500">{selectedCars.length} vehicles</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Feature</th>
                        {selectedCars.map((car: Car) => (
                          <th key={car.id} className="text-center py-2 relative">
                            <div className="flex flex-col items-center">
                              <img
                                src={car.image_url}
                                alt={`${car.brand} ${car.model}`}
                                className="w-12 h-8 object-cover rounded mb-1"
                                onError={(e) => {
                                  e.currentTarget.src = 'https://via.placeholder.com/48x32/3B82F6/FFFFFF?text=PHEV'
                                }}
                              />
                              <span className="font-medium text-xs">
                                {car.brand} {car.model}
                              </span>
                              <button
                                onClick={() => removeCar(car.id)}
                                className="absolute -top-1 -right-1 text-gray-400 hover:text-red-500"
                              >
                                <XMarkIcon className="h-4 w-4" />
                              </button>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2 font-medium text-gray-700">Electric Range (km)</td>
                        {selectedCars.map((car: Car) => (
                          <td key={car.id} className="py-2 text-center text-green-600 font-medium">
                            {car.ev_range_km}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 font-medium text-gray-700">Fuel Consumption (L/100km)</td>
                        {selectedCars.map((car: Car) => (
                          <td key={car.id} className="py-2 text-center">
                            {car.fuel_consumption}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 font-medium text-gray-700">Battery (kWh)</td>
                        {selectedCars.map((car: Car) => (
                          <td key={car.id} className="py-2 text-center">
                            {car.battery_kwh}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 font-medium text-gray-700">Power (HP)</td>
                        {selectedCars.map((car: Car) => (
                          <td key={car.id} className="py-2 text-center">
                            {car.power_hp}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 font-medium text-gray-700">CO₂ Emission (g/km)</td>
                        {selectedCars.map((car: Car) => (
                          <td key={car.id} className="py-2 text-center">
                            {car.co2_emission}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 font-medium text-gray-700">Price (€)</td>
                        {selectedCars.map((car: Car) => (
                          <td key={car.id} className="py-2 text-center text-blue-600 font-medium">
                            €{car.price_eur.toLocaleString()}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 text-xs text-gray-500">
                  Maximum 3 vehicles can be compared
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 text-center">
                <h3 className="text-lg font-semibold mb-2">Comparison</h3>
                <p className="text-gray-600 mb-4">
                  Select vehicles to compare
                </p>
                <div className="text-sm text-gray-500">
                  Maximum 3 vehicles
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}