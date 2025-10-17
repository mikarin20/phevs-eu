'use client'

import { useState, useEffect } from 'react'
import { ArrowLeftIcon, XMarkIcon, CheckIcon, XCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import carsData from '@/data/cars.json'
import EuroNCAPStars from '@/components/EuroNCAPStars'

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
}

export default function ComparePage() {
  const [selectedCars, setSelectedCars] = useState<Car[]>([])

  useEffect(() => {
    // LocalStorage'dan seçili arabaları yükle
    const savedSelection = localStorage.getItem('phevs-selected-cars')
    console.log('Saved selection from localStorage:', savedSelection)
    
    if (savedSelection) {
      try {
        const carIds = JSON.parse(savedSelection)
        console.log('Parsed car IDs:', carIds)
        const cars = carsData.filter((car: any) => carIds.includes(car.id))
        console.log('Filtered cars:', cars)
        setSelectedCars(cars as Car[])
      } catch (e) {
        console.error('Error loading selected cars:', e)
      }
    } else {
      console.log('No saved selection found in localStorage')
    }
  }, [])

  const removeCar = (carId: string) => {
    const updated = selectedCars.filter(c => c.id !== carId)
    setSelectedCars(updated)
    localStorage.setItem('phevs-selected-cars', JSON.stringify(updated.map(c => c.id)))
  }

  // Karşılaştırma kategorileri
  const comparisonCategories = [
    {
      title: 'General Information',
      rows: [
        { label: 'Brand', getValue: (car: Car) => car.brand },
        { label: 'Model', getValue: (car: Car) => car.model },
        { label: 'Year', getValue: (car: Car) => car.year },
        { label: 'Segment', getValue: (car: Car) => car.segment },
      ]
    },
    {
      title: 'Pricing',
      rows: [
        { 
          label: 'Price (EUR)', 
          getValue: (car: Car) => `€${car.price_eur.toLocaleString()}`,
          highlight: true,
          getBest: (cars: Car[]) => Math.min(...cars.map(c => c.price_eur))
        },
      ]
    },
    {
      title: 'Electric Performance',
      rows: [
        { 
          label: 'Electric Range (km)', 
          getValue: (car: Car) => `${car.ev_range_km} km`,
          highlight: true,
          getBest: (cars: Car[]) => Math.max(...cars.map(c => c.ev_range_km))
        },
        { 
          label: 'Battery Capacity (kWh)', 
          getValue: (car: Car) => `${car.battery_kwh} kWh`,
          highlight: true,
          getBest: (cars: Car[]) => Math.max(...cars.map(c => c.battery_kwh))
        },
        { 
          label: 'AC Charge Time (hours)', 
          getValue: (car: Car) => `${car.charge_time_ac} hours`,
          getBest: (cars: Car[]) => Math.min(...cars.map(c => c.charge_time_ac))
        },
        { 
          label: 'DC Charge Time (minutes)', 
          getValue: (car: Car) => `${car.charge_time_dc} minutes`,
          getBest: (cars: Car[]) => Math.min(...cars.map(c => c.charge_time_dc))
        },
      ]
    },
    {
      title: 'Engine & Performance',
      rows: [
        { 
          label: 'Power (HP)', 
          getValue: (car: Car) => `${car.power_hp} HP`,
          highlight: true,
          getBest: (cars: Car[]) => Math.max(...cars.map(c => c.power_hp))
        },
        { 
          label: 'Fuel Consumption (L/100km)', 
          getValue: (car: Car) => `${car.fuel_consumption} L/100km`,
          getBest: (cars: Car[]) => Math.min(...cars.map(c => c.fuel_consumption))
        },
        { 
          label: 'CO₂ Emission (g/km)', 
          getValue: (car: Car) => `${car.co2_emission} g/km`,
          getBest: (cars: Car[]) => Math.min(...cars.map(c => c.co2_emission))
        },
      ]
    },
    {
      title: 'Comfort & Space',
      rows: [
        { 
          label: 'Trunk Volume (L)', 
          getValue: (car: Car) => `${car.trunk_volume} L`,
          getBest: (cars: Car[]) => Math.max(...cars.map(c => c.trunk_volume))
        },
        { 
          label: 'Seats', 
          getValue: (car: Car) => car.seats.toString(),
          getBest: (cars: Car[]) => Math.max(...cars.map(c => c.seats))
        },
      ]
    },
    {
      title: 'Safety (Euro NCAP)',
      rows: [
        { 
          label: 'Overall Rating', 
          getValue: (car: Car) => car.euroncap_rating ? `${car.euroncap_rating.stars}/5 stars` : 'N/A',
          highlight: true,
          getBest: (cars: Car[]) => Math.max(...cars.filter(c => c.euroncap_rating).map(c => c.euroncap_rating!.stars))
        },
        { 
          label: 'Adult Occupant Protection', 
          getValue: (car: Car) => car.euroncap_rating ? `${car.euroncap_rating.adult_occupant}%` : 'N/A',
          getBest: (cars: Car[]) => Math.max(...cars.filter(c => c.euroncap_rating).map(c => c.euroncap_rating!.adult_occupant))
        },
        { 
          label: 'Child Occupant Protection', 
          getValue: (car: Car) => car.euroncap_rating ? `${car.euroncap_rating.child_occupant}%` : 'N/A',
          getBest: (cars: Car[]) => Math.max(...cars.filter(c => c.euroncap_rating).map(c => c.euroncap_rating!.child_occupant))
        },
        { 
          label: 'Pedestrian Protection', 
          getValue: (car: Car) => car.euroncap_rating ? `${car.euroncap_rating.pedestrian_protection}%` : 'N/A',
          getBest: (cars: Car[]) => Math.max(...cars.filter(c => c.euroncap_rating).map(c => c.euroncap_rating!.pedestrian_protection))
        },
        { 
          label: 'Safety Assist', 
          getValue: (car: Car) => car.euroncap_rating ? `${car.euroncap_rating.safety_assist}%` : 'N/A',
          getBest: (cars: Car[]) => Math.max(...cars.filter(c => c.euroncap_rating).map(c => c.euroncap_rating!.safety_assist))
        },
      ]
    },
    {
      title: 'Warranty & Availability',
      rows: [
        { 
          label: 'Warranty (years)', 
          getValue: (car: Car) => `${car.warranty_years} years`,
          getBest: (cars: Car[]) => Math.max(...cars.map(c => c.warranty_years))
        },
        { 
          label: 'Country Availability', 
          getValue: (car: Car) => car.country_availability,
        },
      ]
    },
  ]

  const isBestValue = (car: Car, row: any) => {
    if (!row.getBest || selectedCars.length < 2) return false
    
    const bestValue = row.getBest(selectedCars)
    
    if (row.label.includes('Price') || row.label.includes('Consumption') || row.label.includes('CO₂') || row.label.includes('Charge Time')) {
      // Lower is better
      return car.price_eur === bestValue || 
             car.fuel_consumption === bestValue || 
             car.co2_emission === bestValue ||
             car.charge_time_ac === bestValue ||
             car.charge_time_dc === bestValue
    } else {
      // Higher is better
      return car.ev_range_km === bestValue || 
             car.battery_kwh === bestValue || 
             car.power_hp === bestValue ||
             car.trunk_volume === bestValue ||
             car.seats === bestValue ||
             car.warranty_years === bestValue
    }
  }

  if (selectedCars.length < 2) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100">
        <header className="header-metallic">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <Link href="/" className="flex items-center text-slate-400 hover:text-white transition-colors">
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Back to Home
              </Link>
              
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => {
                    const comparisonData = {
                      cars: selectedCars.map(car => ({
                        id: car.id,
                        brand: car.brand,
                        model: car.model,
                        year: car.year
                      })),
                      timestamp: new Date().toISOString()
                    }
                    localStorage.setItem('phevs-saved-comparison', JSON.stringify(comparisonData))
                    alert('Comparison saved successfully!')
                  }}
                  className="btn-secondary"
                >
                  Save Comparison
                </button>
                
                <button
                  onClick={() => {
                    const comparisonUrl = `${window.location.origin}/compare?cars=${selectedCars.map(c => c.id).join(',')}`
                    navigator.clipboard.writeText(comparisonUrl).then(() => {
                      alert('Comparison link copied to clipboard!')
                    })
                  }}
                  className="btn-primary"
                >
                  Share Comparison
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="card text-center py-20">
            <div className="text-8xl mb-6">⚔️</div>
            <h1 className="text-4xl font-bold text-slate-800 mb-4">
              {selectedCars.length === 0 ? 'No Vehicles Selected' : 'Not Enough Vehicles Selected'}
            </h1>
            <p className="text-lg text-slate-600 mb-8">
              Please select at least 2 vehicles (up to 3) from the home page to compare them
            </p>
            <Link href="/" className="btn-primary inline-flex items-center space-x-2">
              <ArrowLeftIcon className="h-5 w-5" />
              <span>Go to Home Page</span>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100">
      {/* Header */}
      <header className="header-metallic sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center text-slate-400 hover:text-white transition-colors group">
              <ArrowLeftIcon className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              <span className="font-semibold">Back to Home</span>
            </Link>
            
            <div className="flex items-center space-x-6">
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-200 bg-clip-text text-transparent">
                  Vehicle Comparison
                </h1>
                <p className="text-sm text-slate-400 text-right">Comparing {selectedCars.length} vehicles</p>
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => {
                    const comparisonData = {
                      cars: selectedCars.map(car => ({
                        id: car.id,
                        brand: car.brand,
                        model: car.model,
                        year: car.year
                      })),
                      timestamp: new Date().toISOString()
                    }
                    localStorage.setItem('phevs-saved-comparison', JSON.stringify(comparisonData))
                    alert('Comparison saved successfully!')
                  }}
                  className="btn-secondary text-sm"
                >
                  Save
                </button>
                
                <button
                  onClick={() => {
                    const comparisonUrl = `${window.location.origin}/compare?cars=${selectedCars.map(c => c.id).join(',')}`
                    navigator.clipboard.writeText(comparisonUrl).then(() => {
                      alert('Comparison link copied to clipboard!')
                    })
                  }}
                  className="btn-primary text-sm"
                >
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Vehicle Cards Header */}
        <div className="grid grid-cols-1 gap-6 mb-8" style={{ 
          gridTemplateColumns: selectedCars.length === 2 ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)' 
        }}>
          {selectedCars.map((car) => (
            <div key={car.id} className="card relative">
              {/* Remove Button */}
              <button
                onClick={() => removeCar(car.id)}
                className="absolute top-4 right-4 w-8 h-8 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-full flex items-center justify-center transition-all z-10"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>

              {/* Car Image */}
              <div className="w-full bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl overflow-hidden mb-4 shadow-lg">
                <div className="aspect-[16/9] w-full max-h-48">
                  <img
                    src={car.image_url}
                    srcSet={`${car.image_url} 1x, ${car.image_url.replace('.jpg', '@2x.jpg')} 2x`}
                    alt={`${car.brand} ${car.model}`}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.src = '/images/placeholder-car.jpg'
                    }}
                  />
                </div>
                <div className="hidden w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-600 text-6xl font-bold">
                  {car.brand.charAt(0)}
                </div>
              </div>

              {/* Car Info */}
              <div className="text-center">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">
                  {car.brand}
                </h2>
                <p className="text-lg text-slate-600 mb-2">{car.model}</p>
                {car.euroncap_rating && (
                  <div className="mb-3 flex justify-center">
                    <EuroNCAPStars rating={car.euroncap_rating} size="sm" />
                  </div>
                )}
                <div className="flex items-center justify-center space-x-2">
                  <div className="text-3xl font-bold text-blue-600">
                    €{car.price_eur.toLocaleString()}
                  </div>
                  <div className="relative group">
                    <InformationCircleIcon className="h-4 w-4 text-slate-400 cursor-help" />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-3 py-1 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                      Estimated EU price
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="space-y-6">
          {comparisonCategories.map((category) => (
            <div key={category.title} className="card">
              <h3 className="text-xl font-bold text-slate-800 mb-6 pb-3 border-b-2 border-slate-200">
                {category.title}
              </h3>
              
              <div className="space-y-1">
                {category.rows.map((row, rowIndex) => (
                  <div
                    key={rowIndex}
                    className={`grid gap-4 py-4 px-4 rounded-xl transition-colors ${
                      rowIndex % 2 === 0 ? 'bg-slate-50/50' : 'bg-transparent'
                    }`}
                    style={{ 
                      gridTemplateColumns: selectedCars.length === 2 ? '200px repeat(2, 1fr)' : '200px repeat(3, 1fr)' 
                    }}
                  >
                    {/* Label */}
                    <div className="flex items-center">
                      <span className="font-semibold text-slate-700">{row.label}</span>
                    </div>

                    {/* Values */}
                    {selectedCars.map((car) => {
                      const value = row.getValue(car)
                      const isBest = isBestValue(car, row)
                      
                      return (
                        <div 
                          key={car.id} 
                          className={`flex items-center justify-center text-center py-3 px-4 rounded-lg transition-all ${
                            isBest && (row as any).highlight
                              ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 shadow-md'
                              : ''
                          }`}
                        >
                          <div>
                            <div className={`font-bold ${isBest && (row as any).highlight ? 'text-green-700' : 'text-slate-800'}`}>
                              {value}
                            </div>
                            {isBest && (row as any).highlight && (
                              <div className="flex items-center justify-center mt-1 text-green-600 text-xs font-semibold">
                                <CheckIcon className="h-4 w-4 mr-1" />
                                Best Value
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center space-x-4">
          <Link href="/" className="btn-primary">
            Compare More Vehicles
          </Link>
          <button
            onClick={() => {
              setSelectedCars([])
              localStorage.removeItem('phevs-selected-cars')
            }}
            className="btn-secondary"
          >
            Clear Comparison
          </button>
        </div>

        {/* Legend */}
        <div className="mt-8 card-steel">
          <div className="flex items-start space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded"></div>
              <span className="text-sm font-medium text-slate-700">Best Value</span>
            </div>
            <p className="text-sm text-slate-600 flex-1">
              Highlighted cells indicate the best value in each category. Lower values are better for price, consumption, and emissions. Higher values are better for range, power, and capacity.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

