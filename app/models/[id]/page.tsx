'use client'

import React, { useState } from 'react'
import { ArrowLeftIcon, BoltIcon, SparklesIcon, CurrencyEuroIcon, InformationCircleIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import carsData from '@/data/cars.json'
import ImageGallery from '@/components/ImageGallery'
import EuroNCAPStars from '@/components/EuroNCAPStars'
import RangeSimulator from '@/components/RangeSimulator'

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
  euroncap_rating?: {
    stars: number
    adult_occupant: number
    child_occupant: number
    pedestrian_protection: number
    safety_assist: number
    overall_rating: number
    test_year?: number
  }
  simulator_data?: {
    base_range_km: number
    temperature_efficiency: {
      optimal_temp: number
      cold_weather_factor: number
      hot_weather_factor: number
      mild_cold_factor: number
      mild_hot_factor: number
    }
    ac_impact: number
    highway_efficiency: {
      city_factor: number
      mixed_factor: number
      highway_factor: number
    }
    driving_style: {
      eco_factor: number
      normal_factor: number
      sport_factor: number
    }
  }
}

interface ModelDetailProps {
  params: {
    id: string
  }
}

export default function ModelDetail({ params }: ModelDetailProps) {
  const car = carsData.find(c => c.id === params.id) as Car
  const [isRangeSimulatorOpen, setIsRangeSimulatorOpen] = useState(false)

  if (!car) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 flex items-center justify-center">
        <div className="card text-center max-w-lg">
          <div className="text-8xl mb-4">🚗</div>
          <h1 className="text-3xl font-bold text-slate-800 mb-4">Model Not Found</h1>
          <p className="text-slate-600 mb-6">The vehicle you're looking for doesn't exist or has been removed.</p>
          <Link href="/" className="btn-primary inline-flex items-center space-x-2">
            <ArrowLeftIcon className="h-5 w-5" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    )
  }

  // Model için lokal fotoğrafları al
  const getCatalogImages = (carId: string, brand: string) => {
    const urlParts = car.image_url.split('/')
    const brandFromUrl = urlParts[4]
    const modelFromUrl = urlParts[5]
    
    if (!brandFromUrl || !modelFromUrl) {
      return ['/images/placeholder-car.jpg']
    }
    
    const basePath = `/images/cars/brands/${brandFromUrl}/${modelFromUrl}`
    const images: string[] = []
    
    // Main görsel (doğru uzantıyla)
    images.push(car.image_url)
    
    // Numaralı görseller
    for (let i = 1; i <= 20; i++) {
      const num = i.toString().padStart(3, '0')
      images.push(`${basePath}/${num}.jpg`)
      images.push(`${basePath}/${num}.png`)
    }
    
    return images
  }

  const catalogImages = getCatalogImages(car.id, car.brand)

  const specifications = [
    { 
      category: 'Electric Performance',
      items: [
        { label: 'Electric Range', value: `${car.ev_range_km} km`, icon: BoltIcon, highlight: true, hasSimulator: true },
        { label: 'Battery Capacity', value: `${car.battery_kwh} kWh`, icon: SparklesIcon, highlight: true },
        { label: 'AC Charge Time', value: `${car.charge_time_ac} hours` },
        { label: 'DC Charge Time', value: `${car.charge_time_dc} minutes` },
      ]
    },
    {
      category: 'Engine & Performance',
      items: [
        { label: 'Power', value: `${car.power_hp} HP`, highlight: true },
        { label: 'Fuel Consumption', value: `${car.fuel_consumption} L/100km` },
        { label: 'CO₂ Emission', value: `${car.co2_emission} g/km` },
        { label: 'Segment', value: car.segment },
      ]
    },
    {
      category: 'Comfort & Space',
      items: [
        { label: 'Trunk Volume', value: `${car.trunk_volume} L` },
        { label: 'Seats', value: car.seats },
        { label: 'Warranty', value: `${car.warranty_years} years` },
        { label: 'Country Availability', value: car.country_availability },
      ]
    },
    {
      category: 'General',
      items: [
        { label: 'Brand', value: car.brand },
        { label: 'Model', value: car.model },
        { label: 'Year', value: car.year },
        { label: 'Price', value: `€${car.price_eur.toLocaleString()} (Est. EU)` },
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-[#F8FAFB]">
      {/* Header */}
      <header className="header-solid sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="btn-secondary inline-flex items-center space-x-2">
              <ArrowLeftIcon className="h-5 w-5" />
              <span>Back to Models</span>
            </Link>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-[#0B2E33]">{car.brand} {car.model}</h1>
              <p className="text-[#4F7C82]">{car.year} • {car.segment}</p>
            </div>
            <div className="w-24"></div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Images Section */}
        <div className="mb-8">
          <ImageGallery images={catalogImages} alt={`${car.brand} ${car.model} gallery`} />
        </div>

        {/* Price Card */}
        <div className="mb-8">
          <div className="card-elevated p-6 text-center max-w-md mx-auto">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <CurrencyEuroIcon className="h-8 w-8 text-[#4F7C82]" />
              <span className="text-3xl font-bold text-[#0B2E33]">€{car.price_eur.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <p className="text-[#4F7C82]">Starting Price</p>
              <div className="relative group">
                <InformationCircleIcon className="h-4 w-4 text-slate-400 cursor-help" />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-3 py-1 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                  Estimated EU market value
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Euro NCAP Section */}
        {car.euroncap_rating && (
          <div className="mb-8">
            <div className="card p-6 text-center max-w-md mx-auto">
              <h3 className="text-lg font-semibold text-[#0B2E33] mb-4">Safety Rating</h3>
              <div className="flex justify-center mb-2">
                <EuroNCAPStars rating={car.euroncap_rating} size="lg" showDetails={true} />
              </div>
              <a 
                href={`https://www.euroncap.com/en/results/${car.brand.toLowerCase().replace(/\s+/g, '-')}/${car.model.toLowerCase().replace(/\s+/g, '-')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[#4F7C82] hover:text-[#0B2E33] transition-colors underline"
              >
                Source: Euro NCAP
              </a>
            </div>
          </div>
        )}

        {/* Specifications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {specifications.map((spec, index) => (
            <div key={index} className="card p-6">
              <h3 className="text-xl font-bold text-[#0B2E33] mb-4 pb-3 border-b-2 border-[#E2E8F0]">
                {spec.category}
              </h3>
              <div className="space-y-3">
                {spec.items.map((item, itemIndex) => (
                  <div 
                    key={itemIndex} 
                    className={`flex justify-between items-center py-3 px-4 rounded-lg transition-all ${
                      (item as any).highlight 
                        ? 'bg-gradient-to-r from-[#B8E3E9] to-[#F1F5F9] border border-[#4F7C82]' 
                        : 'bg-[#F8FAFB]'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      {(item as any).icon && React.createElement((item as any).icon, { className: "h-5 w-5 text-[#4F7C82]" })}
                      <span className="text-[#0B2E33] font-medium">{item.label}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`font-bold ${(item as any).highlight ? 'text-[#0B2E33] text-lg' : 'text-[#4F7C82]'}`}>
                        {item.value}
                      </span>
                      {(item as any).hasSimulator && (
                        <button
                          onClick={() => setIsRangeSimulatorOpen(true)}
                          className="p-1 hover:bg-[#E2E8F0] rounded transition-colors"
                          title="Range Simulator"
                        >
                          <SparklesIcon className="h-4 w-4 text-[#4F7C82]" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Battery Simulator Section - Always Visible */}
        <div className="mb-8">
          <div className="card p-8 text-center">
            <h3 className="text-2xl font-bold text-[#0B2E33] mb-6">Battery Range Simulator</h3>
            <p className="text-[#4F7C82] mb-6">
              Simulate your electric range based on real-world conditions
            </p>
            <button
              onClick={() => setIsRangeSimulatorOpen(true)}
              className="btn-primary inline-flex items-center space-x-2 px-8 py-4 text-lg"
            >
              <SparklesIcon className="h-6 w-6" />
              <span>Open Range Simulator</span>
            </button>
          </div>
        </div>
      </div>

      {/* Range Simulator Modal */}
      <RangeSimulator
        baseRange={car.ev_range_km}
        batteryCapacity={car.battery_kwh}
        isOpen={isRangeSimulatorOpen}
        onClose={() => setIsRangeSimulatorOpen(false)}
        simulatorData={car.simulator_data}
      />
    </div>
  )
}
