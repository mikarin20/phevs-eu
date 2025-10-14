'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { ArrowLeftIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import carsData from '@/data/cars.json'
import catalogImagesData from '@/data/catalog-images.json'

interface Car {
  id: string
  brand: string
  model: string
  year: number
  segment: string
  ev_range_km: number
  fuel_consumption: number
  battery_kwh: number
  price_eur: number
  image_url: string
  power_hp: number
  co2_emission: number
  charge_time_ac: number
  charge_time_dc: number
  trunk_volume: number
  seats: number
  warranty_years: number
  country_availability: string
}

export default function ModelDetail() {
  const params = useParams()
  const [car, setCar] = useState<Car | null>(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const carId = params.id as string
    const foundCar = carsData.find(c => c.id === carId)
    setCar(foundCar || null)
    setIsLoading(false)
  }, [params.id])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Model Not Found</h1>
          <Link href="/" className="text-blue-600 hover:text-blue-700">
            ← Back to Home
          </Link>
        </div>
      </div>
    )
  }

  // Model için katalog fotoğrafları
  const catalogImages = catalogImagesData[car.id as keyof typeof catalogImagesData] || [
    car.image_url,
    "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1549317336-206569e8475c?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&h=600&fit=crop"
  ]

  const specifications = [
    { label: 'Brand', value: car.brand },
    { label: 'Model', value: car.model },
    { label: 'Year', value: car.year },
    { label: 'Segment', value: car.segment },
    { label: 'Electric Range', value: `${car.ev_range_km} km` },
    { label: 'Fuel Consumption', value: `${car.fuel_consumption} L/100km` },
    { label: 'Battery Capacity', value: `${car.battery_kwh} kWh` },
    { label: 'Power', value: `${car.power_hp} HP` },
    { label: 'CO₂ Emission', value: `${car.co2_emission} g/km` },
    { label: 'AC Charge Time', value: `${car.charge_time_ac} hours` },
    { label: 'DC Charge Time', value: `${car.charge_time_dc} minutes` },
    { label: 'Trunk Volume', value: `${car.trunk_volume} L` },
    { label: 'Seats', value: car.seats },
    { label: 'Warranty', value: `${car.warranty_years} years` },
    { label: 'Availability', value: car.country_availability }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Back to Comparison
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel - Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg overflow-hidden">
              <img
                src={catalogImages[selectedImage]}
                alt={`${car.brand} ${car.model}`}
                className="w-full h-96 object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/images/placeholder-car.jpg'
                }}
              />
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-5 gap-2">
              {catalogImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg overflow-hidden ${
                    selectedImage === index ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  <img
                    src={image}
                    alt={`${car.brand} ${car.model} ${index + 1}`}
                    className="w-full h-20 object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/images/placeholder-car.jpg'
                    }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Panel - Details */}
          <div className="space-y-6">
            {/* Title and Price */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {car.brand} {car.model}
              </h1>
              <p className="text-lg text-gray-600 mt-2">{car.year} • {car.segment}</p>
              <div className="mt-4">
                <span className="text-4xl font-bold text-blue-600">
                  €{car.price_eur.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Key Features */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="text-sm text-gray-600">Electric Range</div>
                <div className="text-2xl font-bold text-green-600">{car.ev_range_km} km</div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="text-sm text-gray-600">Fuel Consumption</div>
                <div className="text-2xl font-bold text-blue-600">{car.fuel_consumption} L/100km</div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="text-sm text-gray-600">Battery</div>
                <div className="text-2xl font-bold text-purple-600">{car.battery_kwh} kWh</div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="text-sm text-gray-600">Power</div>
                <div className="text-2xl font-bold text-red-600">{car.power_hp} HP</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors">
                Compare with Others
              </button>
              <button className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-6 rounded-lg transition-colors">
                Find Dealers
              </button>
            </div>

            {/* Specifications */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Technical Specifications</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {specifications.map((spec, index) => (
                  <div key={index} className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">{spec.label}</span>
                    <span className="font-medium">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Availability</h3>
              <div className="flex flex-wrap gap-2">
                {car.country_availability.split(',').map((country, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                  >
                    {country.trim()}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
