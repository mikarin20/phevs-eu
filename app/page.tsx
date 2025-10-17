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
  CurrencyEuroIcon,
  CpuChipIcon,
  WrenchScrewdriverIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'
import carsData from '@/data/cars.json'
import { CarCardSkeleton } from '@/components/LoadingSkeleton'
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
  }
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
    fuelConsumption: [0, 10],
    batteryArchitecture: '',
    batteryChemistry: ''
  })

  // LocalStorage'dan verileri yükle
  useEffect(() => {
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
    }, 800)

    return () => clearTimeout(timer)
  }, [])

  // Filtreleri otomatik kaydet
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('phevs-filters', JSON.stringify(filters))
      localStorage.setItem('phevs-selected-brands', JSON.stringify(selectedBrands))
    }
  }, [filters, selectedBrands, isLoading])

  // Dropdown'ı dışına tıklandığında kapat
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isBrandDropdownOpen) {
        const target = event.target as HTMLElement
        if (!target.closest('.brand-dropdown')) {
          setIsBrandDropdownOpen(false)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isBrandDropdownOpen])

  // Filtreleme ve sıralama
  const filteredAndSortedCars = useMemo(() => {
    let filtered = cars.filter(car => {
      const matchesSearch = car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           car.model.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(car.brand)
      
      const matchesSegment = !filters.segment || car.segment === filters.segment
      
      const matchesPrice = car.price_eur >= filters.priceRange[0] && car.price_eur <= filters.priceRange[1]
      
      const matchesRange = car.ev_range_km >= filters.rangeRange[0] && car.ev_range_km <= filters.rangeRange[1]
      
      const matchesFuel = car.fuel_consumption >= filters.fuelConsumption[0] && car.fuel_consumption <= filters.fuelConsumption[1]
      
      // Placeholder değerler - gerçek veri yapısına göre güncellenecek
      const matchesBatteryArchitecture = !filters.batteryArchitecture || true // Şimdilik her zaman true
      const matchesBatteryChemistry = !filters.batteryChemistry || true // Şimdilik her zaman true

      return matchesSearch && matchesBrand && matchesSegment && matchesPrice && matchesRange && matchesFuel && matchesBatteryArchitecture && matchesBatteryChemistry
    })

    // Sıralama
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price_eur - b.price_eur
        case 'price-desc':
          return b.price_eur - a.price_eur
        case 'range-asc':
          return a.ev_range_km - b.ev_range_km
        case 'range-desc':
          return b.ev_range_km - a.ev_range_km
        case 'power-asc':
          return a.power_hp - b.power_hp
        case 'power-desc':
          return b.power_hp - a.power_hp
        case 'name-asc':
          return a.brand.localeCompare(b.brand) || a.model.localeCompare(b.model)
        default:
          return 0
      }
    })

    return filtered
  }, [cars, searchTerm, selectedBrands, filters, sortBy])

  // Markaları al
  const brands = useMemo(() => {
    const uniqueBrands = [...new Set(cars.map(car => car.brand))].sort()
    return uniqueBrands
  }, [cars])

  // Filtrelenmiş markalar
  const filteredBrands = useMemo(() => {
    return brands.filter(brand => 
      brand.toLowerCase().includes(brandSearchTerm.toLowerCase())
    )
  }, [brands, brandSearchTerm])

  // Segments
  const segments = useMemo(() => {
    const uniqueSegments = [...new Set(cars.map(car => car.segment))].sort()
    return uniqueSegments
  }, [cars])

  // Favori ekle/çıkar
  const toggleFavorite = (carId: string) => {
    const newFavorites = favorites.includes(carId)
      ? favorites.filter(id => id !== carId)
      : [...favorites, carId]
    
    setFavorites(newFavorites)
    localStorage.setItem('phevs-favorites', JSON.stringify(newFavorites))
  }

  // Karşılaştırma için araç seç
  const toggleCarSelection = (car: Car) => {
    if (selectedCars.find(c => c.id === car.id)) {
      const newSelected = selectedCars.filter(c => c.id !== car.id)
      setSelectedCars(newSelected)
      localStorage.setItem('phevs-selected-cars', JSON.stringify(newSelected))
    } else if (selectedCars.length < 2) {
      const newSelected = [...selectedCars, car]
      setSelectedCars(newSelected)
      localStorage.setItem('phevs-selected-cars', JSON.stringify(newSelected))
    }
  }

  // Filtreleri temizle
  const clearFilters = () => {
    setSearchTerm('')
    setSelectedBrands([])
    setFilters({
      segment: '',
      priceRange: [0, 150000],
      rangeRange: [0, 100],
      fuelConsumption: [0, 10],
      batteryArchitecture: '',
      batteryChemistry: ''
    })
    localStorage.removeItem('phevs-filters')
    localStorage.removeItem('phevs-selected-brands')
  }

  // Filtreleri kaydet
  const saveFilters = () => {
    localStorage.setItem('phevs-filters', JSON.stringify(filters))
    localStorage.setItem('phevs-selected-brands', JSON.stringify(selectedBrands))
  }

  // View mode değiştir
  const toggleViewMode = (mode: ViewMode) => {
    setViewMode(mode)
    localStorage.setItem('phevs-view-mode', mode)
  }

  // Sort değiştir
  const handleSortChange = (newSort: SortOption) => {
    setSortBy(newSort)
    localStorage.setItem('phevs-sort', newSort)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            <CarCardSkeleton count={6} viewMode="list" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8FAFB]">
      {/* Header */}
      <header className="header-solid sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-[#0B2E33]">PHEVs.eu</h1>
              <span className="text-sm text-[#4F7C82]">Plug-in Hybrid Comparison</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/compare" 
                className={`btn-primary inline-flex items-center space-x-2 ${
                  selectedCars.length < 2 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={(e) => selectedCars.length < 2 && e.preventDefault()}
              >
                <ArrowsUpDownIcon className="h-5 w-5" />
                <span>Compare ({selectedCars.length}/2)</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Filter Bar - EV Database Style */}
      <div className="filter-bar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="flex-1 min-w-64">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#93B1B5]" />
                <input
                  type="text"
                  placeholder="Search by brand or model..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-clean w-full pl-10"
                />
              </div>
            </div>

            {/* Brand Filter */}
            <div className="relative brand-dropdown">
              <button
                onClick={() => setIsBrandDropdownOpen(!isBrandDropdownOpen)}
                className="filter-select min-w-32 text-left flex items-center justify-between"
              >
                <span>{selectedBrands.length === 0 ? 'All Brands' : `${selectedBrands.length} selected`}</span>
                <ChevronDownIcon className="h-4 w-4" />
              </button>
              
              {isBrandDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-[#E2E8F0] rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                  <div className="p-2">
                    <input
                      type="text"
                      placeholder="Search brands..."
                      value={brandSearchTerm}
                      onChange={(e) => setBrandSearchTerm(e.target.value)}
                      className="input-clean w-full mb-2"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div className="space-y-1">
                      {filteredBrands.map(brand => (
                        <label 
                          key={brand} 
                          className="flex items-center space-x-2 p-2 hover:bg-[#F1F5F9] rounded cursor-pointer"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            type="checkbox"
                            checked={selectedBrands.includes(brand)}
                            onChange={(e) => {
                              e.stopPropagation()
                              if (e.target.checked) {
                                setSelectedBrands([...selectedBrands, brand])
                              } else {
                                setSelectedBrands(selectedBrands.filter(b => b !== brand))
                              }
                            }}
                            className="rounded border-[#E2E8F0] text-[#4F7C82] focus:ring-[#4F7C82]"
                          />
                          <span className="text-sm text-[#0B2E33]">{brand}</span>
                        </label>
                      ))}
                    </div>
                    <div className="mt-2 pt-2 border-t border-[#E2E8F0]">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedBrands([])
                        }}
                        className="text-xs text-[#4F7C82] hover:text-[#3A5D63]"
                      >
                        Clear all brands
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Segment Filter */}
            <select
              value={filters.segment}
              onChange={(e) => setFilters({...filters, segment: e.target.value})}
              className="filter-select min-w-24"
            >
              <option value="">All Segments</option>
              {segments.map(segment => (
                <option key={segment} value={segment}>{segment}</option>
              ))}
            </select>

            {/* Battery Architecture Filter */}
            <select
              value={filters.batteryArchitecture}
              onChange={(e) => setFilters({...filters, batteryArchitecture: e.target.value})}
              className="filter-select min-w-32"
            >
              <option value="">All Architectures</option>
              <option value="modular">Modular</option>
              <option value="integrated">Integrated</option>
              <option value="skateboard">Skateboard</option>
            </select>

            {/* Battery Chemistry Filter */}
            <select
              value={filters.batteryChemistry}
              onChange={(e) => setFilters({...filters, batteryChemistry: e.target.value})}
              className="filter-select min-w-32"
            >
              <option value="">All Chemistries</option>
              <option value="lithium-ion">Lithium-Ion</option>
              <option value="lithium-iron-phosphate">LFP</option>
              <option value="nickel-cobalt-manganese">NCM</option>
              <option value="nickel-cobalt-aluminum">NCA</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value as SortOption)}
              className="filter-select min-w-32"
            >
              <option value="name-asc">Name (A-Z)</option>
              <option value="price-asc">Price (Low-High)</option>
              <option value="price-desc">Price (High-Low)</option>
              <option value="range-desc">Range (High-Low)</option>
              <option value="range-asc">Range (Low-High)</option>
              <option value="power-desc">Power (High-Low)</option>
              <option value="power-asc">Power (Low-High)</option>
            </select>

            {/* View Toggle */}
            <div className="flex border border-[#E2E8F0] rounded-lg overflow-hidden">
              <button
                onClick={() => toggleViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-[#4F7C82] text-white' : 'bg-white text-[#4F7C82] hover:bg-[#F1F5F9]'}`}
              >
                <ListBulletIcon className="h-5 w-5" />
              </button>
              <button
                onClick={() => toggleViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-[#4F7C82] text-white' : 'bg-white text-[#4F7C82] hover:bg-[#F1F5F9]'}`}
              >
                <Squares2X2Icon className="h-5 w-5" />
              </button>
            </div>

            {/* Clear Filters */}
            <button
              onClick={clearFilters}
              className="btn-ghost text-sm"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold text-[#0B2E33]">
              {filteredAndSortedCars.length} vehicles found
            </h2>
            {(selectedBrands.length > 0 || filters.segment || searchTerm) && (
              <button
                onClick={clearFilters}
                className="text-sm text-[#4F7C82] hover:text-[#3A5D63]"
              >
                Clear all filters
              </button>
            )}
          </div>
          {/* Debug Info */}
          <div className="text-xs text-[#93B1B5]">
            Brands: [{selectedBrands.join(', ')}], Segment: {filters.segment || 'All'}, Search: "{searchTerm}", Battery: {filters.batteryArchitecture || 'All'}/{filters.batteryChemistry || 'All'}
          </div>
        </div>

        {/* Cars List/Grid */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedCars.map((car) => (
              <div key={car.id} className="card hover:shadow-md transition-all duration-200">
                {/* Car Image */}
                <div className="aspect-w-16 aspect-h-9 mb-4">
                  <img
                    src={car.image_url}
                    alt={`${car.brand} ${car.model}`}
                    className="w-full h-48 object-cover rounded-lg"
                    loading="lazy"
                  />
                </div>

                {/* Car Info */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-[#0B2E33]">
                      {car.brand} {car.model}
                    </h3>
                    <div className="text-xl font-bold text-[#4F7C82]">
                      €{car.price_eur.toLocaleString()}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="badge-secondary">{car.year}</span>
                      <span className="badge-accent">{car.segment}</span>
                    </div>
                    {car.euroncap_rating && (
                      <EuroNCAPStars rating={car.euroncap_rating} size="sm" />
                    )}
                  </div>

                  {/* Specifications */}
                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <BoltIcon className="h-4 w-4 text-[#4F7C82]" />
                        <span className="text-[#0B2E33]">EV Range:</span>
                      </div>
                      <span className="font-semibold text-[#4F7C82]">{car.ev_range_km} km</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <CpuChipIcon className="h-4 w-4 text-[#4F7C82]" />
                        <span className="text-[#0B2E33]">Battery:</span>
                      </div>
                      <span className="font-semibold text-[#4F7C82]">{car.battery_kwh} kWh</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <CurrencyEuroIcon className="h-4 w-4 text-[#4F7C82]" />
                        <span className="text-[#0B2E33]">Fuel Consumption:</span>
                      </div>
                      <span className="font-semibold text-[#4F7C82]">{car.fuel_consumption} L/100km</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <WrenchScrewdriverIcon className="h-4 w-4 text-[#4F7C82]" />
                        <span className="text-[#0B2E33]">Total Power:</span>
                      </div>
                      <span className="font-semibold text-[#4F7C82]">{car.power_hp} HP</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-[#E2E8F0]">
                    <button
                      onClick={() => toggleFavorite(car.id)}
                      className="p-2 hover:bg-[#F1F5F9] rounded-lg transition-colors"
                    >
                      {favorites.includes(car.id) ? (
                        <HeartSolidIcon className="h-5 w-5 text-red-500" />
                      ) : (
                        <HeartIcon className="h-5 w-5 text-[#93B1B5] hover:text-red-500" />
                      )}
                    </button>
                    <button
                      onClick={() => toggleCarSelection(car)}
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${
                        selectedCars.find(c => c.id === car.id)
                          ? 'border-[#4F7C82] bg-[#4F7C82] text-white'
                          : 'border-[#E2E8F0] hover:border-[#4F7C82]'
                      }`}
                    >
                      {selectedCars.find(c => c.id === car.id) && (
                        <CheckIcon className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAndSortedCars.map((car) => (
              <div key={car.id} className="card hover:shadow-md transition-all duration-200">
                <div className="flex items-start space-x-4">
                  {/* Car Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={car.image_url}
                      alt={`${car.brand} ${car.model}`}
                      className="w-24 h-16 object-cover rounded-lg"
                      loading="lazy"
                    />
                  </div>

                  {/* Car Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-[#0B2E33]">
                          {car.brand} {car.model}
                        </h3>
                        <div className="flex items-center justify-between mt-1">
                          <div className="flex items-center space-x-2">
                            <span className="badge-secondary">{car.year}</span>
                            <span className="badge-accent">{car.segment}</span>
                          </div>
                          {car.euroncap_rating && (
                            <EuroNCAPStars rating={car.euroncap_rating} size="sm" />
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-[#4F7C82]">
                          €{car.price_eur.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    {/* Specifications */}
                    <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <BoltIcon className="h-4 w-4 text-[#4F7C82]" />
                        <span className="text-[#0B2E33]">EV Range:</span>
                        <span className="font-semibold text-[#4F7C82]">{car.ev_range_km} km</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CpuChipIcon className="h-4 w-4 text-[#4F7C82]" />
                        <span className="text-[#0B2E33]">Battery:</span>
                        <span className="font-semibold text-[#4F7C82]">{car.battery_kwh} kWh</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CurrencyEuroIcon className="h-4 w-4 text-[#4F7C82]" />
                        <span className="text-[#0B2E33]">Fuel Consumption:</span>
                        <span className="font-semibold text-[#4F7C82]">{car.fuel_consumption} L/100km</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <WrenchScrewdriverIcon className="h-4 w-4 text-[#4F7C82]" />
                        <span className="text-[#0B2E33]">Total Power:</span>
                        <span className="font-semibold text-[#4F7C82]">{car.power_hp} HP</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex-shrink-0 flex items-center space-x-2">
                    <button
                      onClick={() => toggleFavorite(car.id)}
                      className="p-2 hover:bg-[#F1F5F9] rounded-lg transition-colors"
                    >
                      {favorites.includes(car.id) ? (
                        <HeartSolidIcon className="h-5 w-5 text-red-500" />
                      ) : (
                        <HeartIcon className="h-5 w-5 text-[#93B1B5] hover:text-red-500" />
                      )}
                    </button>
                    <button
                      onClick={() => toggleCarSelection(car)}
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${
                        selectedCars.find(c => c.id === car.id)
                          ? 'border-[#4F7C82] bg-[#4F7C82] text-white'
                          : 'border-[#E2E8F0] hover:border-[#4F7C82]'
                      }`}
                    >
                      {selectedCars.find(c => c.id === car.id) && (
                        <CheckIcon className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredAndSortedCars.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🚗</div>
            <h3 className="text-xl font-semibold text-[#0B2E33] mb-2">No vehicles found</h3>
            <p className="text-[#4F7C82] mb-4">Try adjusting your filters or search terms</p>
            <button
              onClick={clearFilters}
              className="btn-primary"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}