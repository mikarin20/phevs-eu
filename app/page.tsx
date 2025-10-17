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
  WrenchScrewdriverIcon,
  InformationCircleIcon,
  EyeIcon,
  PlusIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'
import carsData from '@/data/cars.json'
import { CarCardSkeleton } from '@/components/LoadingSkeleton'
import EuroNCAPStars from '@/components/EuroNCAPStars'
import RangeSimulator from '@/components/RangeSimulator'
import Tooltip from '@/components/Tooltip'
import SuggestModelForm from '@/components/SuggestModelForm'

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
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [sortBy, setSortBy] = useState<SortOption>('name-asc')
  const [isLoading, setIsLoading] = useState(true)
  const [isRangeSimulatorOpen, setIsRangeSimulatorOpen] = useState(false)
  const [selectedCarForSimulator, setSelectedCarForSimulator] = useState<Car | null>(null)
  const [selectedTheme, setSelectedTheme] = useState('light')
  const [selectedLanguage, setSelectedLanguage] = useState('en')
  const [isSuggestFormOpen, setIsSuggestFormOpen] = useState(false)

  // Otomatik dil algılama
  useEffect(() => {
    const detectLanguage = () => {
      const browserLang = navigator.language || navigator.languages?.[0] || 'en'
      const langCode = browserLang.split('-')[0].toLowerCase()
      
      const supportedLangs = ['en', 'de', 'tr', 'pl']
      if (supportedLangs.includes(langCode)) {
        setSelectedLanguage(langCode)
      }
    }
    
    detectLanguage()
  }, [])
  
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

  // Özel karakterleri normalize eden fonksiyon
  const normalizeText = (text: string) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Diacritics kaldır
      .replace(/[š]/g, 's') // Š -> s
      .replace(/[č]/g, 'c') // Č -> c
      .replace(/[ž]/g, 'z') // Ž -> z
      .replace(/[ć]/g, 'c') // Ć -> c
      .replace(/[đ]/g, 'd') // Đ -> d
      .replace(/[ł]/g, 'l') // Ł -> l
      .replace(/[ń]/g, 'n') // Ń -> n
      .replace(/[ą]/g, 'a') // Ą -> a
      .replace(/[ę]/g, 'e') // Ę -> e
      .replace(/[ó]/g, 'o') // Ó -> o
      .replace(/[ś]/g, 's') // Ś -> s
      .replace(/[ź]/g, 'z') // Ź -> z
      .replace(/[ż]/g, 'z') // Ż -> z
  }

  // Filtreleme ve sıralama
  const filteredAndSortedCars = useMemo(() => {
    let filtered = cars.filter(car => {
      const normalizedSearchTerm = normalizeText(searchTerm)
      const normalizedBrand = normalizeText(car.brand)
      const normalizedModel = normalizeText(car.model)
      
      const matchesSearch = normalizedBrand.includes(normalizedSearchTerm) ||
                           normalizedModel.includes(normalizedSearchTerm)
      
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
    return brands.filter(brand => {
      const normalizedBrand = normalizeText(brand)
      const normalizedSearchTerm = normalizeText(brandSearchTerm)
      return normalizedBrand.includes(normalizedSearchTerm)
    })
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
      localStorage.setItem('phevs-selected-cars', JSON.stringify(newSelected.map(c => c.id)))
    } else if (selectedCars.length < 3) {
      const newSelected = [...selectedCars, car]
      setSelectedCars(newSelected)
      localStorage.setItem('phevs-selected-cars', JSON.stringify(newSelected.map(c => c.id)))
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

  // Tema ve çeviri objeleri
  const themes = {
    light: {
      name: 'Light',
      background: 'bg-gray-200',
      headerBg: 'bg-gray-300',
      headerText: 'text-gray-700',
      cardBg: 'bg-gray-200',
      cardBorder: 'border-gray-400',
      textPrimary: 'text-gray-700',
      textSecondary: 'text-gray-400',
      filterBg: 'bg-gray-300',
      filterBorder: 'border-gray-400',
      filterText: 'text-gray-700',
      inputBg: 'bg-gray-200',
      inputBorder: 'border-gray-400',
      inputText: 'text-gray-700',
      iconColor: 'text-gray-600'
    },
    dark: {
      name: 'Dark',
      background: 'bg-slate-500',
      headerBg: 'bg-slate-400',
      headerText: 'text-slate-100',
      cardBg: 'bg-slate-500',
      cardBorder: 'border-slate-300',
      textPrimary: 'text-slate-100',
      textSecondary: 'text-slate-100',
      filterBg: 'bg-slate-500',
      filterBorder: 'border-slate-300',
      filterText: 'text-slate-100',
      inputBg: 'bg-slate-500',
      inputBorder: 'border-slate-300',
      inputText: 'text-slate-100',
      iconColor: 'text-slate-200'
    }
  }

  const translations = {
    en: {
      searchPlaceholder: 'Search by brand or model...',
      allBrands: 'All Brands',
      allSegments: 'All Segments',
      clearFilters: 'Clear all filters',
      rangeSimulator: 'Range Simulator',
      compare: 'Compare',
      favorites: 'Favorites',
      added: 'Added',
      view: 'View',
      vehiclesFound: 'vehicles found',
      noVehiclesFound: 'No vehicles found',
      tryAdjustingFilters: 'Try adjusting your filters or search terms',
      estimatedEU: 'Est. EU',
      estimatedEUPrice: 'Estimated EU price',
      evRange: 'EV Range',
      battery: 'Battery',
      fuelConsumption: 'Fuel Consumption',
      totalPower: 'Total Power',
      chargeTime: 'Charge Time',
      co2: 'CO₂',
      trunk: 'Trunk',
      year: 'Year',
      segment: 'Segment',
      price: 'Price',
      power: 'Power',
      range: 'Range',
      consumption: 'Consumption',
      charge: 'Charge',
      emission: 'Emission',
      volume: 'Volume',
      trySimulator: 'Try Range Simulator',
      selectVehicle: 'Select Vehicle',
      selectVehicleFirst: 'Please select a vehicle first to use Range Simulator',
      discoverRange: 'Discover your real-world electric range based on temperature, climate control, and driving conditions'
    },
    de: {
      searchPlaceholder: 'Nach Marke oder Modell suchen...',
      allBrands: 'Alle Marken',
      allSegments: 'Alle Segmente',
      clearFilters: 'Alle Filter löschen',
      rangeSimulator: 'Reichweiten-Simulator',
      compare: 'Vergleichen',
      favorites: 'Favoriten',
      added: 'Hinzugefügt',
      view: 'Ansehen',
      vehiclesFound: 'Fahrzeuge gefunden',
      noVehiclesFound: 'Keine Fahrzeuge gefunden',
      tryAdjustingFilters: 'Versuchen Sie, Ihre Filter oder Suchbegriffe anzupassen',
      estimatedEU: 'Geschätzt EU',
      estimatedEUPrice: 'Geschätzter EU-Preis',
      evRange: 'E-Reichweite',
      battery: 'Batterie',
      fuelConsumption: 'Kraftstoffverbrauch',
      totalPower: 'Gesamtleistung',
      chargeTime: 'Ladezeit',
      co2: 'CO₂',
      trunk: 'Kofferraum',
      year: 'Jahr',
      segment: 'Segment',
      price: 'Preis',
      power: 'Leistung',
      range: 'Reichweite',
      consumption: 'Verbrauch',
      charge: 'Laden',
      emission: 'Emission',
      volume: 'Volumen',
      trySimulator: 'Reichweiten-Simulator testen',
      selectVehicle: 'Fahrzeug auswählen',
      selectVehicleFirst: 'Bitte wählen Sie zuerst ein Fahrzeug aus, um den Reichweiten-Simulator zu verwenden',
      discoverRange: 'Entdecken Sie Ihre realistische elektrische Reichweite basierend auf Temperatur, Klimaanlage und Fahrbedingungen'
    },
    tr: {
      searchPlaceholder: 'Marka veya model ara...',
      allBrands: 'Tüm Markalar',
      allSegments: 'Tüm Segmentler',
      clearFilters: 'Tüm filtreleri temizle',
      rangeSimulator: 'Menzil Simülatörü',
      compare: 'Karşılaştır',
      favorites: 'Favoriler',
      added: 'Eklendi',
      view: 'Görüntüle',
      vehiclesFound: 'araç bulundu',
      noVehiclesFound: 'Araç bulunamadı',
      tryAdjustingFilters: 'Filtrelerinizi veya arama terimlerinizi ayarlamayı deneyin',
      estimatedEU: 'Tahmini AB',
      estimatedEUPrice: 'Tahmini AB fiyatı',
      evRange: 'Elektrik Menzili',
      battery: 'Batarya',
      fuelConsumption: 'Yakıt Tüketimi',
      totalPower: 'Toplam Güç',
      chargeTime: 'Şarj Süresi',
      co2: 'CO₂',
      trunk: 'Bagaj',
      year: 'Yıl',
      segment: 'Segment',
      price: 'Fiyat',
      power: 'Güç',
      range: 'Menzil',
      consumption: 'Tüketim',
      charge: 'Şarj',
      emission: 'Emisyon',
      volume: 'Hacim',
      trySimulator: 'Menzil Simülatörünü Dene',
      selectVehicle: 'Araç Seç',
      selectVehicleFirst: 'Menzil Simülatörünü kullanmak için lütfen önce bir araç seçin',
      discoverRange: 'Sıcaklık, iklim kontrolü ve sürüş koşullarına göre gerçek dünya elektrik menzilinizi keşfedin'
    },
    pl: {
      searchPlaceholder: 'Szukaj według marki lub modelu...',
      allBrands: 'Wszystkie Marki',
      allSegments: 'Wszystkie Segmenty',
      clearFilters: 'Wyczyść wszystkie filtry',
      rangeSimulator: 'Symulator Zasięgu',
      compare: 'Porównaj',
      favorites: 'Ulubione',
      added: 'Dodano',
      view: 'Zobacz',
      vehiclesFound: 'pojazdów znaleziono',
      noVehiclesFound: 'Nie znaleziono pojazdów',
      tryAdjustingFilters: 'Spróbuj dostosować filtry lub terminy wyszukiwania',
      estimatedEU: 'Szac. UE',
      estimatedEUPrice: 'Szacowana cena UE',
      evRange: 'Zasięg EV',
      battery: 'Bateria',
      fuelConsumption: 'Zużycie Paliwa',
      totalPower: 'Całkowita Moc',
      chargeTime: 'Czas Ładowania',
      co2: 'CO₂',
      trunk: 'Bagażnik',
      year: 'Rok',
      segment: 'Segment',
      price: 'Cena',
      power: 'Moc',
      range: 'Zasięg',
      consumption: 'Zużycie',
      charge: 'Ładowanie',
      emission: 'Emisja',
      volume: 'Objętość',
      trySimulator: 'Wypróbuj Symulator Zasięgu',
      selectVehicle: 'Wybierz Pojazd',
      selectVehicleFirst: 'Najpierw wybierz pojazd, aby użyć Symulatora Zasięgu',
      discoverRange: 'Odkryj swój rzeczywisty zasięg elektryczny na podstawie temperatury, klimatyzacji i warunków jazdy'
    }
  }

  const currentTheme = themes[selectedTheme as keyof typeof themes]
  const t = translations[selectedLanguage as keyof typeof translations]

  if (isLoading) {
    return (
      <div className={`min-h-screen ${currentTheme.background}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            <CarCardSkeleton count={6} viewMode="list" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${currentTheme.background}`}>
      {/* Header */}
      <header className={`${currentTheme.headerBg} border-b ${currentTheme.cardBorder} sticky top-0 z-50`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo, Başlık ve Tema Seçici - Mobilde kompakt */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm sm:text-lg">P</span>
                </div>
                <div>
                  <h1 className={`text-lg sm:text-2xl font-bold ${currentTheme.headerText}`}>PHEVs.eu</h1>
                  <span className={`text-xs sm:text-sm ${currentTheme.textSecondary} hidden sm:block`}>Compare the best PHEVs in Europe</span>
                </div>
              </div>
              
              {/* Tema Seçici - Mobilde gizli, tablet+ görünür */}
              <div className="hidden sm:flex items-center space-x-2 ml-4">
                <div className="flex space-x-1">
                  {Object.entries(themes).map(([key, theme]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedTheme(key)}
                      className={`p-2 rounded-lg transition-all duration-300 ${
                        selectedTheme === key
                          ? selectedTheme === 'dark' 
                            ? 'bg-slate-600 text-white shadow-lg'
                            : 'bg-gray-800 text-white shadow-lg'
                          : selectedTheme === 'dark'
                            ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                      title={theme.name}
                    >
                      <span className="text-base">{key === 'light' ? '☀️' : '🌙'}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Dil Seçici - Compare'in solunda */}
              <div className="flex space-x-1">
                {[
                  { 
                    code: 'en', 
                    name: 'EN', 
                    flag: 'gb'
                  },
                  { 
                    code: 'de', 
                    name: 'DE', 
                    flag: 'de'
                  },
                  { 
                    code: 'tr', 
                    name: 'TR', 
                    flag: 'tr'
                  },
                  { 
                    code: 'pl', 
                    name: 'PL', 
                    flag: 'pl'
                  }
                ].map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setSelectedLanguage(lang.code)}
                    className={`p-1.5 sm:p-2 rounded-lg transition-all duration-300 ${
                      selectedLanguage === lang.code
                        ? selectedTheme === 'dark' 
                          ? 'bg-slate-600 shadow-lg'
                          : 'bg-gray-800 shadow-lg'
                        : selectedTheme === 'dark'
                          ? 'bg-slate-700 hover:bg-slate-600'
                          : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                    title={lang.code.toUpperCase()}
                  >
                    <span className={`fi fi-${lang.flag} text-sm sm:text-lg`} title={lang.name}></span>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setIsSuggestFormOpen(true)}
                className="hidden sm:inline-flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-semibold transition-all duration-200 bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                <span className="text-sm sm:text-base">Suggest Model</span>
              </button>
              <Link 
                href="/compare" 
                className={`inline-flex items-center space-x-1 sm:space-x-2 px-3 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-all duration-200 ${
                  selectedCars.length < 2 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                }`}
                onClick={(e) => selectedCars.length < 2 && e.preventDefault()}
              >
                <ArrowsUpDownIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-sm sm:text-base">Compare ({selectedCars.length}/3)</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Range Simulator Banner */}
      <div className={`${currentTheme.filterBg} border-b ${currentTheme.cardBorder}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 ${currentTheme.cardBg} rounded-xl flex items-center justify-center`}>
                <SparklesIcon className={`h-6 w-6 ${currentTheme.textPrimary}`} />
              </div>
              <div>
                <h3 className={`text-lg font-semibold ${currentTheme.textPrimary}`}>Range Simulator</h3>
                <p className={`text-sm ${currentTheme.textSecondary}`}>Discover your real-world electric range based on temperature, climate control, and driving conditions</p>
              </div>
            </div>
            <button
              onClick={() => {
                if (selectedCars.length === 0) {
                  alert('Please select a vehicle first to use Range Simulator')
                  return
                }
                setSelectedCarForSimulator(selectedCars[0])
                setIsRangeSimulatorOpen(true)
              }}
              className={`inline-flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                selectedCars.length === 0 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
              }`}
              disabled={selectedCars.length === 0}
            >
              <SparklesIcon className="h-5 w-5" />
              <span>Try Range Simulator {selectedCars.length > 0 ? `(${selectedCars[0].brand} ${selectedCars[0].model})` : '(Select Vehicle)'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Bar - EV Database Style */}
      <div className="filter-bar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="flex-1 min-w-64">
              <div className="relative">
                <MagnifyingGlassIcon className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${currentTheme.textSecondary}`} />
                <input
                  type="text"
                  placeholder={t.searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 py-2 px-3 rounded-lg border ${currentTheme.inputBg} ${currentTheme.inputBorder} ${currentTheme.inputText} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>
                  </div>
                  
            {/* Brand Filter */}
            <div className="relative brand-dropdown">
                          <button
                onClick={() => setIsBrandDropdownOpen(!isBrandDropdownOpen)}
                className={`min-w-32 text-left flex items-center justify-between py-2 px-3 rounded-lg border ${currentTheme.filterBg} ${currentTheme.filterBorder} ${currentTheme.filterText} hover:bg-opacity-80 transition-colors`}
                          >
                <span>{selectedBrands.length === 0 ? 'All Brands' : `${selectedBrands.length} selected`}</span>
                <ChevronDownIcon className="h-4 w-4" />
                          </button>

              {isBrandDropdownOpen && (
                <div className={`absolute top-full left-0 mt-1 w-64 ${currentTheme.filterBg} border ${currentTheme.filterBorder} rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto`}>
                  <div className="p-2">
                    <input
                      type="text"
                      placeholder="Search brands..."
                      value={brandSearchTerm}
                      onChange={(e) => setBrandSearchTerm(e.target.value)}
                      className={`w-full mb-2 py-1 px-2 rounded border ${currentTheme.inputBg} ${currentTheme.inputBorder} ${currentTheme.inputText} focus:outline-none focus:ring-1 focus:ring-blue-500`}
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
              className={`min-w-24 py-2 px-3 rounded-lg border ${currentTheme.filterBg} ${currentTheme.filterBorder} ${currentTheme.filterText} focus:outline-none focus:ring-2 focus:ring-blue-500`}
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
              className={`min-w-32 py-2 px-3 rounded-lg border ${currentTheme.filterBg} ${currentTheme.filterBorder} ${currentTheme.filterText} focus:outline-none focus:ring-2 focus:ring-blue-500`}
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
              className={`min-w-32 py-2 px-3 rounded-lg border ${currentTheme.filterBg} ${currentTheme.filterBorder} ${currentTheme.filterText} focus:outline-none focus:ring-2 focus:ring-blue-500`}
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
              className={`min-w-32 py-2 px-3 rounded-lg border ${currentTheme.filterBg} ${currentTheme.filterBorder} ${currentTheme.filterText} focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <option value="name-asc">Name (A-Z)</option>
              <option value="price-asc">Price (Low-High)</option>
              <option value="price-desc">Price (High-Low)</option>
              <option value="range-desc">Range (High-Low)</option>
              <option value="range-asc">Range (Low-High)</option>
              <option value="power-desc">Power (High-Low)</option>
              <option value="power-asc">Power (Low-High)</option>
            </select>

            {/* View Toggle - Hidden on mobile */}
            <div className="hidden sm:flex border border-[#E2E8F0] rounded-lg overflow-hidden">
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
              {filteredAndSortedCars.length} {t.vehiclesFound}
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
            Brands: [{selectedBrands.join(', ')}] (Count: {selectedBrands.length}), Segment: {filters.segment || 'All'}, Search: "{searchTerm}", Battery: {filters.batteryArchitecture || 'All'}/{filters.batteryChemistry || 'All'}, Filtered Count: {filteredAndSortedCars.length}, Total Cars: {cars.length}
              </div>
            </div>

        {/* Cars List/Grid */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredAndSortedCars.map((car) => (
              <Link key={car.id} href={`/models/${car.id}`} className={`${currentTheme.cardBg} border ${currentTheme.cardBorder} rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-xl hover:scale-102 transition-all duration-300 block group`}>
                {/* Car Image */}
                <div className="mb-4">
                  <div className="aspect-[16/9] w-full max-h-40 rounded-lg overflow-hidden">
                    <img
                      src={car.image_url}
                      alt={`${car.brand} ${car.model}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      fetchPriority="low"
                      onError={(e) => {
                        e.currentTarget.src = '/images/placeholder-car.jpg'
                      }}
                    />
                  </div>
                </div>

                {/* Car Info */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className={`text-lg font-semibold ${currentTheme.textPrimary}`}>
                      {car.brand} {car.model}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <div className={`text-xl font-bold ${currentTheme.textPrimary}`}>
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
                        <Tooltip content="WLTP (Worldwide Harmonized Light Vehicles Test Procedure) - Official EU test standard for electric range">
                          <span className={`${currentTheme.textPrimary} cursor-help`}>{t.evRange}:</span>
                        </Tooltip>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`font-semibold ${currentTheme.textPrimary}`}>{car.ev_range_km} km</span>
                      </div>
                    </div>
                      <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <CpuChipIcon className="h-4 w-4 text-[#4F7C82]" />
                        <Tooltip content="Battery capacity in kilowatt-hours (kWh) - Higher capacity means longer electric range">
                          <span className={`${currentTheme.textPrimary} cursor-help`}>{t.battery}:</span>
                        </Tooltip>
                      </div>
                      <span className={`font-semibold ${currentTheme.textPrimary}`}>{car.battery_kwh} kWh</span>
                        </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <CurrencyEuroIcon className="h-4 w-4 text-[#4F7C82]" />
                        <Tooltip content="Fuel consumption in liters per 100km - Lower values mean better fuel efficiency">
                          <span className={`${currentTheme.textPrimary} cursor-help`}>{t.fuelConsumption}:</span>
                        </Tooltip>
                        </div>
                      <span className={`font-semibold ${currentTheme.textPrimary}`}>{car.fuel_consumption} L/100km</span>
                        </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <WrenchScrewdriverIcon className="h-4 w-4 text-[#4F7C82]" />
                        <Tooltip content="Total power output in horsepower (HP) - Combined electric and combustion engine power">
                          <span className={`${currentTheme.textPrimary} cursor-help`}>{t.totalPower}:</span>
                        </Tooltip>
                      </div>
                      <span className={`font-semibold ${currentTheme.textPrimary}`}>{car.power_hp} HP</span>
                        </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <BoltIcon className="h-4 w-4 text-[#4F7C82]" />
                        <Tooltip content="AC charging time in hours - Time to fully charge the battery using home/office charger">
                          <span className={`${currentTheme.textPrimary} cursor-help`}>{t.chargeTime}:</span>
                        </Tooltip>
                      </div>
                      <span className={`font-semibold ${currentTheme.textPrimary}`}>{car.charge_time_ac}h AC</span>
                        </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Tooltip content="CO₂ emissions in grams per kilometer - Lower values mean better environmental performance">
                          <span className={`${currentTheme.textPrimary} cursor-help`}>{t.co2}:</span>
                        </Tooltip>
                      </div>
                      <span className={`font-semibold ${currentTheme.textPrimary}`}>{car.co2_emission} g/km</span>
                        </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Tooltip content="Trunk volume in liters - Cargo space capacity with all seats in normal position">
                          <span className={`${currentTheme.textPrimary} cursor-help`}>Trunk:</span>
                        </Tooltip>
                      </div>
                      <span className={`font-semibold ${currentTheme.textPrimary}`}>{car.trunk_volume}L</span>
                        </div>
                    </div>

                  {/* Actions */}
                  <div className={`flex items-center justify-center pt-4 border-t ${currentTheme.cardBorder}`}>
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        toggleFavorite(car.id)
                      }}
                      className={`p-2 hover:bg-opacity-20 rounded-lg transition-colors ${currentTheme.cardBg}`}
                    >
                      {favorites.includes(car.id) ? (
                        <HeartSolidIcon className="h-5 w-5 text-red-500" />
                      ) : (
                        <HeartIcon className="h-5 w-5 text-[#93B1B5] hover:text-red-500" />
                      )}
                    </button>
                    <div className="flex flex-row justify-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          toggleCarSelection(car)
                        }}
                        className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                          selectedCars.find(c => c.id === car.id)
                          ? 'bg-blue-600 text-white'
                          : `${currentTheme.cardBg} ${currentTheme.textPrimary} hover:bg-blue-600 hover:text-white`
                        }`}
                      >
                        <PlusIcon className="h-3 w-3 sm:h-4 sm:w-4 inline mr-1" />
                        {selectedCars.find(c => c.id === car.id) ? t.added : t.compare}
                      </button>
                      <Link
                        href={`/models/${car.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium ${currentTheme.cardBg} ${currentTheme.textPrimary} hover:bg-blue-600 hover:text-white transition-colors`}
                      >
                        <EyeIcon className="h-3 w-3 sm:h-4 sm:w-4 inline mr-1" />
                        {t.view}
                      </Link>
                    </div>
                  </div>
                </div>
              </Link>
              ))}
          </div>
        ) : (
                <div className="space-y-4">
            {filteredAndSortedCars.map((car) => (
              <Link key={car.id} href={`/models/${car.id}`} className={`${currentTheme.cardBg} border ${currentTheme.cardBorder} rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-xl hover:scale-102 transition-all duration-300 block group`}>
                <div className="flex items-start space-x-4">
                  {/* Car Image */}
                  <div className="flex-shrink-0">
                    <div className="aspect-[16/9] w-32 h-20 rounded-lg overflow-hidden">
                      <img
                        src={car.image_url}
                        alt={`${car.brand} ${car.model}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        fetchPriority="low"
                        onError={(e) => {
                          e.currentTarget.src = '/images/placeholder-car.jpg'
                        }}
                      />
                    </div>
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
                        <div className="flex items-center justify-end space-x-2">
                          <div className={`text-xl font-bold ${currentTheme.textPrimary}`}>
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

                    {/* Specifications */}
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                      <div className="flex items-center space-x-2">
                        <BoltIcon className={`h-4 w-4 ${currentTheme.iconColor}`} />
                        <span className={`${currentTheme.textPrimary}`}>{t.evRange}:</span>
                        <span className={`font-semibold ${currentTheme.textPrimary}`}>{car.ev_range_km} km</span>
                      <button
                          onClick={() => {
                            setSelectedCarForSimulator(car)
                            setIsRangeSimulatorOpen(true)
                          }}
                          className="p-1 hover:bg-[#E2E8F0] rounded transition-colors"
                          title="Range Simulator"
                        >
                          <SparklesIcon className="h-4 w-4 text-[#4F7C82]" />
                      </button>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CpuChipIcon className={`h-4 w-4 ${currentTheme.iconColor}`} />
                        <span className={`${currentTheme.textPrimary}`}>{t.battery}:</span>
                        <span className={`font-semibold ${currentTheme.textPrimary}`}>{car.battery_kwh} kWh</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CurrencyEuroIcon className={`h-4 w-4 ${currentTheme.iconColor}`} />
                        <span className={`${currentTheme.textPrimary}`}>{t.fuelConsumption}:</span>
                        <span className={`font-semibold ${currentTheme.textPrimary}`}>{car.fuel_consumption} L/100km</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <WrenchScrewdriverIcon className={`h-4 w-4 ${currentTheme.iconColor}`} />
                        <span className={`${currentTheme.textPrimary}`}>{t.totalPower}:</span>
                        <span className={`font-semibold ${currentTheme.textPrimary}`}>{car.power_hp} HP</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <BoltIcon className={`h-4 w-4 ${currentTheme.iconColor}`} />
                        <span className={`${currentTheme.textPrimary}`}>{t.chargeTime}:</span>
                        <span className={`font-semibold ${currentTheme.textPrimary}`}>{car.charge_time_ac}h AC</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`${currentTheme.textPrimary}`}>{t.co2}:</span>
                        <span className={`font-semibold ${currentTheme.textPrimary}`}>{car.co2_emission} g/km</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`${currentTheme.textPrimary}`}>Trunk:</span>
                        <span className={`font-semibold ${currentTheme.textPrimary}`}>{car.trunk_volume}L</span>
                      </div>
                    </div>
                </div>

                  {/* Actions */}
                  <div className="flex-shrink-0 flex items-center justify-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        toggleFavorite(car.id)
                      }}
                      className={`p-2 hover:bg-opacity-20 rounded-lg transition-colors ${currentTheme.cardBg}`}
                    >
                      {favorites.includes(car.id) ? (
                        <HeartSolidIcon className="h-5 w-5 text-red-500" />
                      ) : (
                        <HeartIcon className="h-5 w-5 text-[#93B1B5] hover:text-red-500" />
                      )}
                    </button>
                    <div className="flex flex-row justify-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          toggleCarSelection(car)
                        }}
                        className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                          selectedCars.find(c => c.id === car.id)
                          ? 'bg-blue-600 text-white'
                          : `${currentTheme.cardBg} ${currentTheme.textPrimary} hover:bg-blue-600 hover:text-white`
                        }`}
                      >
                        <PlusIcon className="h-3 w-3 sm:h-4 sm:w-4 inline mr-1" />
                        {selectedCars.find(c => c.id === car.id) ? t.added : t.compare}
                      </button>
                      <Link
                        href={`/models/${car.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium ${currentTheme.cardBg} ${currentTheme.textPrimary} hover:bg-blue-600 hover:text-white transition-colors`}
                      >
                        <EyeIcon className="h-3 w-3 sm:h-4 sm:w-4 inline mr-1" />
                        {t.view}
                      </Link>
                    </div>
              </div>
                </div>
              </Link>
            ))}
              </div>
            )}

        {filteredAndSortedCars.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🚗</div>
            <h3 className="text-xl font-semibold text-[#0B2E33] mb-2">{t.noVehiclesFound}</h3>
            <p className="text-[#4F7C82] mb-4">{t.tryAdjustingFilters}</p>
            <button
              onClick={clearFilters}
              className="btn-primary"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Range Simulator Modal */}
      <RangeSimulator
        baseRange={selectedCarForSimulator?.ev_range_km || 100}
        batteryCapacity={selectedCarForSimulator?.battery_kwh || 15}
        isOpen={isRangeSimulatorOpen}
        onClose={() => setIsRangeSimulatorOpen(false)}
        simulatorData={selectedCarForSimulator?.simulator_data}
      />

      {/* Suggest Model Form */}
      <SuggestModelForm
        isOpen={isSuggestFormOpen}
        onClose={() => setIsSuggestFormOpen(false)}
      />

    </div>
  )
}