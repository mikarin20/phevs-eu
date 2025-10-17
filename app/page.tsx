'use client'

import { useState, useEffect, useMemo } from 'react'
import { 
  MagnifyingGlassIcon, 
  ArrowsUpDownIcon, 
  CheckIcon, 
  XMarkIcon,
  Squares2X2Icon,
  ListBulletIcon,
  HeartIcon,
  FunnelIcon,
  ChevronDownIcon,
  SparklesIcon,
  BoltIcon,
  CurrencyEuroIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'
import carsData from '@/data/cars.json'
import { CarCardSkeleton } from '@/components/LoadingSkeleton'

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

type ViewMode = 'grid' | 'list'
type SortOption = 'price-asc' | 'price-desc' | 'range-asc' | 'range-desc' | 'power-asc' | 'power-desc' | 'name-asc'

export default function Home() {
  const [cars, setCars] = useState<Car[]>(carsData)
  const [selectedCars, setSelectedCars] = useState<Car[]>([])
  const [favorites, setFavorites] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [brandSearchTerm, setBrandSearchTerm] = useState('')
  const [isBrandDropdownOpen, setIsBrandDropdownOpen] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [sortBy, setSortBy] = useState<SortOption>('name-asc')
  const [isLoading, setIsLoading] = useState(true)
  
  const [filters, setFilters] = useState({
    segment: '',
    priceRange: [0, 150000],
    rangeRange: [0, 100],
    fuelConsumption: [0, 10]
  })

  // LocalStorage'dan verileri yükle
  useEffect(() => {
    // Simulate loading delay for skeleton
    const timer = setTimeout(() => {
      const savedFilters = localStorage.getItem('phevs-filters')
      const savedBrands = localStorage.getItem('phevs-selected-brands')
      const savedFavorites = localStorage.getItem('phevs-favorites')
      const savedViewMode = localStorage.getItem('phevs-view-mode')
      const savedSort = localStorage.getItem('phevs-sort')
      
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

      if (savedFavorites) {
        try {
          setFavorites(JSON.parse(savedFavorites))
        } catch (e) {
          console.error('Error loading favorites:', e)
        }
      }

      if (savedViewMode) {
        setViewMode(savedViewMode as ViewMode)
      }

      if (savedSort) {
        setSortBy(savedSort as SortOption)
      }
      
      setIsLoading(false)
    }, 500)
    
    return () => clearTimeout(timer)
  }, [])

  // LocalStorage'a kaydet
  useEffect(() => {
    localStorage.setItem('phevs-filters', JSON.stringify(filters))
  }, [filters])

  useEffect(() => {
    localStorage.setItem('phevs-selected-brands', JSON.stringify(selectedBrands))
  }, [selectedBrands])

  useEffect(() => {
    localStorage.setItem('phevs-favorites', JSON.stringify(favorites))
  }, [favorites])

  useEffect(() => {
    localStorage.setItem('phevs-view-mode', viewMode)
  }, [viewMode])

  useEffect(() => {
    localStorage.setItem('phevs-sort', sortBy)
  }, [sortBy])

  // Favori toggle
  const toggleFavorite = (carId: string) => {
    if (favorites.includes(carId)) {
      setFavorites(favorites.filter(id => id !== carId))
    } else {
      setFavorites([...favorites, carId])
    }
  }

  // Filtreleme, sıralama - useMemo ile optimize
  const filteredAndSortedCars = useMemo(() => {
    // Önce filtrele
    let result = cars.filter(car => {
      const matchesSearch = car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           car.model.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(car.brand)
      const matchesSegment = !filters.segment || car.segment === filters.segment
      const matchesPrice = car.price_eur >= filters.priceRange[0] && car.price_eur <= filters.priceRange[1]
      const matchesRange = car.ev_range_km >= filters.rangeRange[0] && car.ev_range_km <= filters.rangeRange[1]
      const matchesFuel = car.fuel_consumption >= filters.fuelConsumption[0] && car.fuel_consumption <= filters.fuelConsumption[1]
      
      return matchesSearch && matchesBrand && matchesSegment && matchesPrice && matchesRange && matchesFuel
    })

    // Sonra sırala
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price_eur - b.price_eur)
        break
      case 'price-desc':
        result.sort((a, b) => b.price_eur - a.price_eur)
        break
      case 'range-asc':
        result.sort((a, b) => a.ev_range_km - b.ev_range_km)
        break
      case 'range-desc':
        result.sort((a, b) => b.ev_range_km - a.ev_range_km)
        break
      case 'power-asc':
        result.sort((a, b) => a.power_hp - b.power_hp)
        break
      case 'power-desc':
        result.sort((a, b) => b.power_hp - a.power_hp)
        break
      case 'name-asc':
      default:
        result.sort((a, b) => `${a.brand} ${a.model}`.localeCompare(`${b.brand} ${b.model}`))
        break
    }

    return result
  }, [searchTerm, filters, cars, selectedBrands, sortBy])

  const handleCarSelect = (car: Car) => {
    let updated: Car[]
    if (selectedCars.find(c => c.id === car.id)) {
      updated = selectedCars.filter(c => c.id !== car.id)
    } else if (selectedCars.length < 3) {
      updated = [...selectedCars, car]
    } else {
      return
    }
    setSelectedCars(updated)
    localStorage.setItem('phevs-selected-cars', JSON.stringify(updated.map(c => c.id)))
  }

  const removeCar = (carId: string) => {
    const updated = selectedCars.filter(c => c.id !== carId)
    setSelectedCars(updated)
    localStorage.setItem('phevs-selected-cars', JSON.stringify(updated.map(c => c.id)))
  }

  const brands = Array.from(new Set(cars.map(car => car.brand))).sort()
  const segments = Array.from(new Set(cars.map(car => car.segment))).sort()

  const toggleBrand = (brand: string) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter(b => b !== brand))
    } else {
      setSelectedBrands([...selectedBrands, brand])
    }
  }

  const clearAllBrands = () => {
    setSelectedBrands([])
  }

  const filteredBrands = brands.filter(brand => 
    brand.toLowerCase().includes(brandSearchTerm.toLowerCase())
  )

  const clearAllFilters = () => {
    setFilters({
      segment: '',
      priceRange: [0, 150000],
      rangeRange: [0, 100],
      fuelConsumption: [0, 10]
    })
    setSelectedBrands([])
    setBrandSearchTerm('')
    setSearchTerm('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100">
      {/* Metalik Header */}
      <header className="header-metallic sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                  <BoltIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-200 bg-clip-text text-transparent">
                    PHEVs.eu
                  </h1>
                  <p className="text-xs text-slate-400">Hybrid Vehicle Comparison</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Favorites Count */}
              <button 
                onClick={() => {
                  // Favori filtresi eklenebilir
                }}
                className="relative btn-ghost flex items-center space-x-2"
              >
                <HeartIcon className="h-5 w-5" />
                {favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {favorites.length}
                  </span>
                )}
              </button>

              {/* Compare Button */}
              <Link
                href="/compare"
                className={`btn-primary flex items-center space-x-2 ${selectedCars.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={(e) => selectedCars.length === 0 && e.preventDefault()}
              >
                <ArrowsUpDownIcon className="h-5 w-5" />
                <span>Compare ({selectedCars.length})</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-gradient hero-pattern py-16 px-4 sm:px-6 lg:px-8 shadow-2xl">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold text-white mb-4 flex items-center justify-center space-x-3">
              <SparklesIcon className="h-12 w-12 text-blue-300" />
              <span>Find Your Perfect PHEV</span>
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Compare {carsData.length} plug-in hybrid vehicles from {brands.length} premium brands
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="stat-card">
              <div className="text-4xl font-bold text-white mb-2">{carsData.length}</div>
              <div className="text-blue-200 text-sm font-medium">Total Models</div>
            </div>
            <div className="stat-card">
              <div className="text-4xl font-bold text-white mb-2">{brands.length}</div>
              <div className="text-blue-200 text-sm font-medium">Brands</div>
            </div>
            <div className="stat-card">
              <div className="text-4xl font-bold text-white mb-2">{Math.max(...carsData.map(c => c.ev_range_km))}</div>
              <div className="text-blue-200 text-sm font-medium">Max Range (km)</div>
            </div>
            <div className="stat-card">
              <div className="text-4xl font-bold text-white mb-2">€{Math.min(...carsData.map(c => c.price_eur)).toLocaleString()}</div>
              <div className="text-blue-200 text-sm font-medium">Starting From</div>
            </div>
          </div>

          {/* Main Search Bar */}
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-5 top-1/2 transform -translate-y-1/2 h-6 w-6 text-slate-400" />
              <input
                type="text"
                placeholder="Search by brand or model..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-14 pr-6 py-5 bg-white/90 backdrop-blur-md border-2 border-white/50 rounded-2xl 
                         text-lg focus:border-blue-400 focus:ring-4 focus:ring-blue-400/20 
                         transition-all duration-200 outline-none shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Filters Bar - Horizontal at Top */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="filter-bar mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <FunnelIcon className="h-6 w-6 text-slate-600" />
              <h3 className="text-lg font-bold text-slate-800">Filters</h3>
              {(selectedBrands.length > 0 || filters.segment) && (
                <span className="badge-primary">
                  {selectedBrands.length + (filters.segment ? 1 : 0)} active
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="btn-ghost flex items-center space-x-2"
              >
                <span>{isFilterOpen ? 'Hide' : 'Show'} Filters</span>
                <ChevronDownIcon className={`h-4 w-4 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {(selectedBrands.length > 0 || filters.segment || searchTerm) && (
                <button
                  onClick={clearAllFilters}
                  className="btn-secondary text-sm"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>

          {isFilterOpen && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-6 border-t border-slate-200">
              {/* Brand Filter */}
              <div className="relative">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Brands {selectedBrands.length > 0 && `(${selectedBrands.length})`}
                </label>
                
                {selectedBrands.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {selectedBrands.slice(0, 3).map((brand) => (
                      <span key={brand} className="badge-primary">
                        {brand}
                        <button
                          onClick={() => toggleBrand(brand)}
                          className="ml-1 hover:text-blue-900"
                        >
                          <XMarkIcon className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                    {selectedBrands.length > 3 && (
                      <span className="badge-steel">
                        +{selectedBrands.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search brands..."
                    value={brandSearchTerm}
                    onChange={(e) => setBrandSearchTerm(e.target.value)}
                    onFocus={() => setIsBrandDropdownOpen(true)}
                    className="input-metallic w-full"
                  />
                  <MagnifyingGlassIcon className="h-4 w-4 text-slate-400 absolute right-3 top-3.5" />
                </div>

                {isBrandDropdownOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-10"
                      onClick={() => setIsBrandDropdownOpen(false)}
                    />
                    
                    <div className="absolute z-20 mt-2 w-full bg-white border-2 border-slate-200 rounded-xl shadow-2xl max-h-60 overflow-y-auto">
                      {filteredBrands.length > 0 ? (
                        filteredBrands.map((brand) => (
                          <label
                            key={brand}
                            className="flex items-center px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={selectedBrands.includes(brand)}
                              onChange={() => toggleBrand(brand)}
                              className="h-5 w-5 text-blue-600 border-slate-300 rounded-lg focus:ring-blue-500"
                            />
                            <span className="ml-3 text-sm font-medium text-slate-700">{brand}</span>
                          </label>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-sm text-slate-500">
                          No brands found
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Segment Filter */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Segment
                </label>
                <select
                  value={filters.segment}
                  onChange={(e) => setFilters({ ...filters, segment: e.target.value })}
                  className="input-metallic w-full"
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
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Price Range (€)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.priceRange[0]}
                    onChange={(e) => setFilters({ ...filters, priceRange: [parseInt(e.target.value) || 0, filters.priceRange[1]] })}
                    className="input-metallic"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.priceRange[1]}
                    onChange={(e) => setFilters({ ...filters, priceRange: [filters.priceRange[0], parseInt(e.target.value) || 150000] })}
                    className="input-metallic"
                  />
                </div>
              </div>

              {/* Electric Range */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Electric Range (km)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.rangeRange[0]}
                    onChange={(e) => setFilters({ ...filters, rangeRange: [parseInt(e.target.value) || 0, filters.rangeRange[1]] })}
                    className="input-metallic"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.rangeRange[1]}
                    onChange={(e) => setFilters({ ...filters, rangeRange: [filters.rangeRange[0], parseInt(e.target.value) || 100] })}
                    className="input-metallic"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Toolbar - Sort and View Options */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
          <div className="flex items-center space-x-4">
            <p className="text-sm font-medium text-slate-600">
              <span className="text-2xl font-bold text-blue-600">{filteredAndSortedCars.length}</span> vehicles found
            </p>
          </div>

          <div className="flex items-center space-x-3">
            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="input-metallic text-sm"
            >
              <option value="name-asc">Name (A-Z)</option>
              <option value="price-asc">Price (Low to High)</option>
              <option value="price-desc">Price (High to Low)</option>
              <option value="range-asc">Range (Low to High)</option>
              <option value="range-desc">Range (High to Low)</option>
              <option value="power-asc">Power (Low to High)</option>
              <option value="power-desc">Power (High to Low)</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex bg-slate-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'list' 
                    ? 'bg-white shadow-md text-blue-600' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <ListBulletIcon className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'grid' 
                    ? 'bg-white shadow-md text-blue-600' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Squares2X2Icon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Loading Skeleton */}
        {isLoading && (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <CarCardSkeleton key={i} viewMode={viewMode} />
            ))}
          </div>
        )}

        {/* Vehicle Cards - List View */}
        {!isLoading && viewMode === 'list' && (
          <div className="space-y-4">
            {filteredAndSortedCars.map((car) => (
              <div
                key={car.id}
                className={`card ${
                  selectedCars.find(c => c.id === car.id) ? 'ring-2 ring-blue-500 bg-blue-50/50' : ''
                }`}
              >
                <div className="flex items-start space-x-6">
                  {/* Vehicle Image */}
                  <Link href={`/models/${car.id}`} className="flex-shrink-0 group">
                    <div className="w-32 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center overflow-hidden shadow-md group-hover:shadow-xl transition-all duration-300">
                      <img
                        src={car.image_url}
                        alt={`${car.brand} ${car.model}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                          const nextElement = e.currentTarget.nextElementSibling as HTMLElement
                          if (nextElement) {
                            nextElement.style.display = 'flex'
                          }
                        }}
                      />
                      <div className="hidden w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-600 text-2xl font-bold">
                        {car.brand.charAt(0)}
                      </div>
                    </div>
                  </Link>

                  {/* Vehicle Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <Link 
                          href={`/models/${car.id}`}
                          className="text-xl font-bold text-slate-800 hover:text-blue-600 transition-colors"
                        >
                          {car.brand} {car.model}
                        </Link>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="badge-steel">{car.year}</span>
                          <span className="badge-steel">{car.segment}</span>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-3xl font-bold text-blue-600">
                          €{car.price_eur.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <BoltIcon className="h-5 w-5 text-green-600" />
                        <div>
                          <div className="text-slate-500">Electric Range</div>
                          <div className="font-bold text-slate-800">{car.ev_range_km} km</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <SparklesIcon className="h-5 w-5 text-purple-600" />
                        <div>
                          <div className="text-slate-500">Battery</div>
                          <div className="font-bold text-slate-800">{car.battery_kwh} kWh</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CurrencyEuroIcon className="h-5 w-5 text-orange-600" />
                        <div>
                          <div className="text-slate-500">Consumption</div>
                          <div className="font-bold text-slate-800">{car.fuel_consumption} L/100km</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <BoltIcon className="h-5 w-5 text-red-600" />
                        <div>
                          <div className="text-slate-500">Power</div>
                          <div className="font-bold text-slate-800">{car.power_hp} HP</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex-shrink-0 flex flex-col items-center space-y-2">
                    {/* Favorite Button */}
                    <button
                      onClick={() => toggleFavorite(car.id)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        favorites.includes(car.id)
                          ? 'bg-red-100 text-red-600 hover:bg-red-200'
                          : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                      }`}
                    >
                      {favorites.includes(car.id) ? (
                        <HeartSolidIcon className="h-6 w-6" />
                      ) : (
                        <HeartIcon className="h-6 w-6" />
                      )}
                    </button>

                    {/* Selection Button */}
                    <button
                      onClick={() => handleCarSelect(car)}
                      className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
                        selectedCars.find(c => c.id === car.id)
                          ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/50'
                          : 'border-slate-300 hover:border-blue-500 hover:bg-blue-50'
                      }`}
                      title="Select for comparison"
                    >
                      {selectedCars.find(c => c.id === car.id) && <CheckIcon className="h-6 w-6" />}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Vehicle Cards - Grid View */}
        {!isLoading && viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedCars.map((car) => (
              <div
                key={car.id}
                className={`card ${
                  selectedCars.find(c => c.id === car.id) ? 'ring-2 ring-blue-500 bg-blue-50/50' : ''
                }`}
              >
                {/* Image */}
                <Link href={`/models/${car.id}`} className="block mb-4 group">
                  <div className="w-full h-48 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl overflow-hidden shadow-md group-hover:shadow-xl transition-all duration-300">
                    <img
                      src={car.image_url}
                      alt={`${car.brand} ${car.model}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                        const nextElement = e.currentTarget.nextElementSibling as HTMLElement
                        if (nextElement) {
                          nextElement.style.display = 'flex'
                        }
                      }}
                    />
                    <div className="hidden w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-600 text-5xl font-bold">
                      {car.brand.charAt(0)}
                    </div>
                  </div>
                </Link>

                {/* Info */}
                <div className="space-y-4">
                  <div>
                    <Link 
                      href={`/models/${car.id}`}
                      className="text-lg font-bold text-slate-800 hover:text-blue-600 transition-colors block"
                    >
                      {car.brand} {car.model}
                    </Link>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="badge-steel">{car.year}</span>
                      <span className="badge-steel">{car.segment}</span>
                    </div>
                  </div>

                  <div className="text-2xl font-bold text-blue-600">
                    €{car.price_eur.toLocaleString()}
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <div className="text-slate-500">Range</div>
                      <div className="font-bold text-slate-800">{car.ev_range_km} km</div>
                    </div>
                    <div>
                      <div className="text-slate-500">Battery</div>
                      <div className="font-bold text-slate-800">{car.battery_kwh} kWh</div>
                    </div>
                    <div>
                      <div className="text-slate-500">Power</div>
                      <div className="font-bold text-slate-800">{car.power_hp} HP</div>
                    </div>
                    <div>
                      <div className="text-slate-500">Consumption</div>
                      <div className="font-bold text-slate-800">{car.fuel_consumption} L</div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 pt-2">
                    <button
                      onClick={() => toggleFavorite(car.id)}
                      className={`flex-1 py-2 rounded-xl font-semibold transition-all ${
                        favorites.includes(car.id)
                          ? 'bg-red-100 text-red-600 hover:bg-red-200'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {favorites.includes(car.id) ? 'Favorited' : 'Favorite'}
                    </button>
                    
                    <button
                      onClick={() => handleCarSelect(car)}
                      className={`flex-1 py-2 rounded-xl font-semibold transition-all ${
                        selectedCars.find(c => c.id === car.id)
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50'
                          : 'bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-600'
                      }`}
                    >
                      {selectedCars.find(c => c.id === car.id) ? 'Selected' : 'Select'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {!isLoading && filteredAndSortedCars.length === 0 && (
          <div className="card text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">No vehicles found</h3>
            <p className="text-slate-600 mb-6">Try adjusting your filters or search terms</p>
            <button
              onClick={clearAllFilters}
              className="btn-primary"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* Floating Comparison Panel */}
      {selectedCars.length > 0 && (
        <div className="fixed bottom-8 right-8 z-40">
          <div className="card-steel w-80 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-800">Selected for Comparison</h3>
              <span className="badge-primary">{selectedCars.length}/3</span>
            </div>

            <div className="space-y-3 mb-4">
              {selectedCars.map((car) => (
                <div key={car.id} className="flex items-center space-x-3 p-3 bg-white rounded-xl shadow-sm">
                  <img
                    src={car.image_url}
                    alt={`${car.brand} ${car.model}`}
                    className="w-16 h-10 object-cover rounded-lg"
                    onError={(e) => {
                      e.currentTarget.src = '/images/placeholder-car.jpg'
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-800 truncate">
                      {car.brand} {car.model}
                    </p>
                    <p className="text-xs text-slate-500">
                      €{car.price_eur.toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => removeCar(car.id)}
                    className="text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>

            <Link
              href="/compare"
              className="btn-primary w-full text-center block"
            >
              Compare Now
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
