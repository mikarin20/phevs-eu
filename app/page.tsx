'use client'

import { useState, useEffect, useMemo } from 'react'
import { MagnifyingGlassIcon, ArrowsUpDownIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import carsData from '@/data/cars.json'

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

export default function Home() {
  const [cars, setCars] = useState<Car[]>(carsData)
  const [selectedCars, setSelectedCars] = useState<Car[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [brandSearchTerm, setBrandSearchTerm] = useState('')
  const [isBrandDropdownOpen, setIsBrandDropdownOpen] = useState(false)
  const [filters, setFilters] = useState({
    segment: '',
    priceRange: [0, 150000],
    rangeRange: [0, 100],
    fuelConsumption: [0, 10]
  })

  // LocalStorage'dan filtreleri yükle
  useEffect(() => {
    const savedFilters = localStorage.getItem('phevs-filters')
    const savedBrands = localStorage.getItem('phevs-selected-brands')
    
    if (savedFilters) {
      try {
        setFilters(JSON.parse(savedFilters))
      } catch (e) {
        console.error('Error loading filters:', e)
      }
    }
    
    if (savedBrands) {
      try {
        setSelectedBrands(JSON.parse(savedBrands))
      } catch (e) {
        console.error('Error loading brands:', e)
      }
    }
  }, [])

  // Filtreleri localStorage'a kaydet
  useEffect(() => {
    localStorage.setItem('phevs-filters', JSON.stringify(filters))
  }, [filters])

  useEffect(() => {
    localStorage.setItem('phevs-selected-brands', JSON.stringify(selectedBrands))
  }, [selectedBrands])

  // Filtreleme ve arama - useMemo ile optimize edildi
  const filteredCars = useMemo(() => {
    return cars.filter(car => {
      const matchesSearch = car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           car.model.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(car.brand)
      const matchesSegment = !filters.segment || car.segment === filters.segment
      const matchesPrice = car.price_eur >= filters.priceRange[0] && car.price_eur <= filters.priceRange[1]
      const matchesRange = car.ev_range_km >= filters.rangeRange[0] && car.ev_range_km <= filters.rangeRange[1]
      const matchesFuel = car.fuel_consumption >= filters.fuelConsumption[0] && car.fuel_consumption <= filters.fuelConsumption[1]
      
      return matchesSearch && matchesBrand && matchesSegment && matchesPrice && matchesRange && matchesFuel
    })
  }, [searchTerm, filters, cars, selectedBrands])

  const handleCarSelect = (car: Car) => {
    if (selectedCars.find(c => c.id === car.id)) {
      setSelectedCars(selectedCars.filter(c => c.id !== car.id))
    } else if (selectedCars.length < 3) {
      setSelectedCars([...selectedCars, car])
    }
  }

  const removeCar = (carId: string) => {
    setSelectedCars(selectedCars.filter(c => c.id !== carId))
  }

  const brands = Array.from(new Set(cars.map(car => car.brand))).sort()
  const segments = Array.from(new Set(cars.map(car => car.segment))).sort()

  // Marka seçimi toggle
  const toggleBrand = (brand: string) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter(b => b !== brand))
    } else {
      setSelectedBrands([...selectedBrands, brand])
    }
  }

  // Tüm markaları temizle
  const clearAllBrands = () => {
    setSelectedBrands([])
  }

  // Marka arama filtresi
  const filteredBrands = brands.filter(brand => 
    brand.toLowerCase().includes(brandSearchTerm.toLowerCase())
  )

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
                onClick={() => {}}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center space-x-2"
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
          {/* Left Panel - Filters */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <div className="flex items-center space-x-2 mb-6">
                <h3 className="text-lg font-semibold">Filters</h3>
              </div>

              <div className="space-y-6">
                {/* Brand Filter - Multi Select with Search */}
                <div className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Brands {selectedBrands.length > 0 && `(${selectedBrands.length})`}
                    </label>
                    {selectedBrands.length > 0 && (
                      <button
                        onClick={clearAllBrands}
                        className="text-xs text-red-600 hover:text-red-700"
                      >
                        Clear All
                      </button>
                    )}
                  </div>
                  
                  {/* Selected Brands Pills */}
                  {selectedBrands.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {selectedBrands.map((brand) => (
                        <span
                          key={brand}
                          className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
                        >
                          {brand}
                          <button
                            onClick={() => toggleBrand(brand)}
                            className="ml-1 hover:text-blue-900"
                          >
                            <XMarkIcon className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Brand Search Input */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search brands..."
                      value={brandSearchTerm}
                      onChange={(e) => setBrandSearchTerm(e.target.value)}
                      onFocus={() => setIsBrandDropdownOpen(true)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <MagnifyingGlassIcon className="h-4 w-4 text-gray-400 absolute right-3 top-3" />
                  </div>

                  {/* Brand Dropdown */}
                  {isBrandDropdownOpen && (
                    <>
                      {/* Overlay to close dropdown */}
                      <div 
                        className="fixed inset-0 z-10"
                        onClick={() => setIsBrandDropdownOpen(false)}
                      />
                      
                      <div className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {filteredBrands.length > 0 ? (
                          filteredBrands.map((brand) => (
                            <label
                              key={brand}
                              className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={selectedBrands.includes(brand)}
                                onChange={() => toggleBrand(brand)}
                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                              />
                              <span className="ml-2 text-sm text-gray-700">{brand}</span>
                            </label>
                          ))
                        ) : (
                          <div className="px-3 py-2 text-sm text-gray-500">
                            No brands found
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>

                {/* Segment Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Segment
                  </label>
                  <select
                    value={filters.segment}
                    onChange={(e) => setFilters({ ...filters, segment: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Segments</option>
                    {segments.map((segment) => (
                      <option key={segment} value={segment}>
                        {segment}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range (€)
                  </label>
                  <div className="space-y-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.priceRange[0]}
                      onChange={(e) => setFilters({ ...filters, priceRange: [parseInt(e.target.value) || 0, filters.priceRange[1]] })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.priceRange[1]}
                      onChange={(e) => setFilters({ ...filters, priceRange: [filters.priceRange[0], parseInt(e.target.value) || 150000] })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Electric Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Electric Range (km)
                  </label>
                  <div className="space-y-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.rangeRange[0]}
                      onChange={(e) => setFilters({ ...filters, rangeRange: [parseInt(e.target.value) || 0, filters.rangeRange[1]] })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.rangeRange[1]}
                      onChange={(e) => setFilters({ ...filters, rangeRange: [filters.rangeRange[0], parseInt(e.target.value) || 100] })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Clear Filters */}
                <button
                  onClick={() => {
                    setFilters({
                      segment: '',
                      priceRange: [0, 150000],
                      rangeRange: [0, 100],
                      fuelConsumption: [0, 10]
                    })
                    setSelectedBrands([])
                    setBrandSearchTerm('')
                  }}
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          </div>

          {/* Middle Panel - Vehicle List */}
          <div className="lg:w-1/2">
            {/* Search Bar */}
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

            {/* Result Count */}
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                {filteredCars.length} vehicles found
              </p>
            </div>

            {/* Vehicle Cards */}
            <div className="space-y-4">
              {filteredCars.map((car) => (
                <div
                  key={car.id}
                  className={`bg-white rounded-lg shadow-md border border-gray-200 p-6 transition-all duration-200 hover:shadow-lg ${
                    selectedCars.find(c => c.id === car.id) ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    {/* Vehicle Image */}
                    <div className="flex-shrink-0">
                      <div className="w-24 h-16 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                        <img
                          src={car.image_url}
                          alt={`${car.brand} ${car.model}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                            const nextElement = e.currentTarget.nextElementSibling as HTMLElement
                            if (nextElement) {
                              nextElement.style.display = 'flex'
                            }
                          }}
                        />
                        <div className="hidden w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-600 text-xs font-medium">
                          {car.brand.charAt(0)}
                        </div>
                      </div>
                    </div>

                    {/* Vehicle Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <Link 
                          href={`/models/${car.id}`}
                          className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                        >
                          {car.brand} {car.model}
                        </Link>
                        <span className="text-sm text-gray-500">{car.year}</span>
                      </div>

                      <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Electric Range:</span>
                          <span className="ml-1 font-medium">{car.ev_range_km} km</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Consumption:</span>
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

                    {/* Selection Button */}
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

          {/* Right Panel - Comparison */}
          <div className="lg:w-1/4">
            {selectedCars.length > 0 ? (
              <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Comparison</h3>
                  <span className="text-sm text-gray-500">{selectedCars.length} vehicles</span>
                </div>

                <div className="space-y-4">
                  {selectedCars.map((car) => (
                    <div key={car.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <img
                        src={car.image_url}
                        alt={`${car.brand} ${car.model}`}
                        className="w-12 h-8 object-cover rounded"
                        onError={(e) => {
                          e.currentTarget.src = '/images/placeholder-car.jpg'
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {car.brand} {car.model}
                        </p>
                        <p className="text-xs text-gray-500">
                          €{car.price_eur.toLocaleString()}
                        </p>
                      </div>
                      <button
                        onClick={() => removeCar(car.id)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
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