'use client'

import { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
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
  AdjustmentsHorizontalIcon,
  PlusIcon,
  SparklesIcon,
  BoltIcon,
  CpuChipIcon,
  WrenchScrewdriverIcon,
  ScaleIcon,
  Cog6ToothIcon,
  EyeIcon,
  CalculatorIcon,
  InformationCircleIcon,
  UserGroupIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'
import { getImageUrl } from '@/lib/image-url'
import carsData from '@/data/cars.json' assert { type: 'json' }
const typedCarsData = carsData as Car[]
import blogData from '@/data/blog.json' assert { type: 'json' }
import { getTranslations, type Locale } from '@/lib/i18n'
import { CarCardSkeleton } from '@/components/LoadingSkeleton'
import EuroNCAPStars from '@/components/EuroNCAPStars'
import PHEVGuidePopup from '@/components/PHEVGuidePopup'
import dynamic from 'next/dynamic'

// Statik importlar
import HybridLogo from '@/components/HybridLogo'

// Dinamik importlar
const RangeSimulator = dynamic(() => import('@/components/RangeSimulator'), {
  loading: () => <div className="animate-pulse bg-gray-200 rounded-lg h-96"></div>,
  ssr: false
})

const SuggestModelForm = dynamic(() => import('@/components/SuggestModelForm'), {
  loading: () => <div className="animate-pulse bg-gray-200 rounded-lg h-96"></div>,
  ssr: false
})

const FilterModal = dynamic(() => import('@/components/FilterModal'), {
  loading: () => <div className="animate-pulse bg-gray-200 rounded-lg h-96"></div>,
  ssr: false
})

const MobileAccordion = dynamic(() => import('@/components/MobileAccordion'))

const CompareInfoBar = dynamic(() => import('@/components/CompareInfoBar'), {
  ssr: false
})

interface Car {
  id: string
  brand: string
  model: string
  year: number
  segment: string
  ev_range_km: number
  fuel_consumption: number
  battery_kwh: number
  price_eur?: number
  image_url: string
  power_hp: number
  electric_motor_power_hp?: number
  engine_displacement?: number
  co2_emission: number
  charge_time_ac: number
  charge_time_dc?: number
  trunk_volume: number
  seats: number
  warranty_years: number
  weight_kg: number
  battery_chemistry: string
  country_availability: string
  slug: string
  last_updated?: string
  dominant_color?: string
  data_status?: {
    technical_specs: 'complete' | 'partial' | 'pending'
    price: 'verified' | 'estimated' | 'outdated'
    range_data: 'wltp' | 'real_world' | 'estimated'
  }
  battery_details?: {
    chemistry: string
    architecture: string
    cycles: number
    degradation_rate: number
    warranty_capacity: number
    thermal_management: string
  }
  charging_capabilities?: {
    ac_power: number
    dc_power: number
    charging_curve: {
      soc: number[]
      power: number[]
    }
  }
  charging_port?: {
    ac_type: string
    ac_location: string
    dc_type?: string
    dc_location?: string
    ac_phases?: number
    ac_current?: number
  }
  real_world_data?: {
    winter_range_km: number
    summer_range_km: number
    mixed_range_km: number
    city_consumption: number
    highway_consumption: number
    measured_date: string
    test_conditions: string
  }
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
type SortOption = 'range-asc' | 'range-desc' | 'power-asc' | 'power-desc' | 'name-asc'
type FiltersState = {
  segment: string
  priceRange: [number, number]
  rangeRange: [number, number]
  fuelConsumption: [number, number]
  batteryArchitecture: string
  batteryChemistry: string
  chargingType: string
  powerRange: [number, number]
  yearRange: [number, number]
  emissionRange: [number, number]
  sortBy: SortOption
}

export default function Home() {
  const [cars, setCars] = useState<Car[]>(typedCarsData)
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
  const [isMobileLanguageDropdownOpen, setIsMobileLanguageDropdownOpen] = useState(false)
  const [isSuggestFormOpen, setIsSuggestFormOpen] = useState(false)
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [recentlyViewed, setRecentlyViewed] = useState<Car[]>([])
  const [isPHEVGuidePopupOpen, setIsPHEVGuidePopupOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Quick Compare karşılaştırmaları
  const comparisons = [
    {
      id: 'tiguan-3008',
      href: '/compare/volkswagen-tiguan-phev-vs-peugeot-3008-phev',
      leftCar: { name: 'VW Tiguan (2025)', image: '/images/cars/brands/volkswagen/tiguan/main.jpg', alt: 'Volkswagen Tiguan', specs: '125 km' },
      rightCar: { name: 'Peugeot 3008 (2025)', image: '/images/cars/brands/peugeot/3008-plug-in-hybrid/main.jpg', alt: 'Peugeot 3008', specs: '59 km' }
    },
    {
      id: 'c5-kuga',
      href: '/compare/citroen-c5-aircross-ii-phev-vs-ford-kuga-phev',
      leftCar: { name: 'Citroën C5 Aircross (2025)', image: '/images/cars/brands/citroen/c5-aircross-ii-phev/main.jpg', alt: 'Citroën C5 Aircross', specs: '81 km' },
      rightCar: { name: 'Ford Kuga (2025)', image: '/images/cars/brands/ford/kuga/main.jpg', alt: 'Ford Kuga', specs: '65 km' }
    },
    {
      id: 'kodiaq-tiguan',
      href: '/compare/koda-kodiaq-phev-vs-volkswagen-tiguan-phev',
      leftCar: { name: 'Skoda Kodiaq iV (2025)', image: '/images/cars/brands/skoda/kodiaq-phev/main.jpg', alt: 'Skoda Kodiaq iV', specs: '120 km' },
      rightCar: { name: 'VW Tiguan (2025)', image: '/images/cars/brands/volkswagen/tiguan/main.jpg', alt: 'Volkswagen Tiguan', specs: '125 km' }
    },
    {
      id: 'mg-3008',
      href: '/compare/mg-hs-ii-1-5t-vs-peugeot-3008-phev',
      leftCar: { name: 'MG HS (2025)', image: '/images/cars/brands/mg/hs-plug-in-hybrid-2025/main.jpg', alt: 'MG HS', specs: '75 km' },
      rightCar: { name: 'Peugeot 3008 (2025)', image: '/images/cars/brands/peugeot/3008-plug-in-hybrid/main.jpg', alt: 'Peugeot 3008', specs: '59 km' }
    },
    {
      id: 'golf-308',
      href: '/compare/volkswagen-golf-phev-vs-peugeot-308-phev',
      leftCar: { name: 'VW Golf GTE (2025)', image: '/images/cars/brands/volkswagen/golf/main.jpg', alt: 'Volkswagen Golf GTE', specs: '143 km' },
      rightCar: { name: 'Peugeot 308 (2025)', image: '/images/cars/brands/peugeot/308-plug-in-hybrid/main.jpg', alt: 'Peugeot 308', specs: '85 km' }
    },
    {
      id: 'golf-a3',
      href: '/compare/volkswagen-golf-phev-vs-audi-a3-sportback-phev',
      leftCar: { name: 'VW Golf GTE (2025)', image: '/images/cars/brands/volkswagen/golf/main.jpg', alt: 'Volkswagen Golf GTE', specs: '143 km' },
      rightCar: { name: 'Audi A3 Sportback (2025)', image: '/images/cars/brands/audi/a3-sportback-tfsi-e/main.jpg', alt: 'Audi A3 Sportback', specs: '133 km' }
    },
    {
      id: 'passat-superb',
      href: '/compare/volkswagen-passat-phev-vs-skoda-superb-combi-phev',
      leftCar: { name: 'VW Passat (2025)', image: '/images/cars/brands/volkswagen/passat/main.jpg', alt: 'Volkswagen Passat', specs: '133 km' },
      rightCar: { name: 'Skoda Superb Combi (2025)', image: '/images/cars/brands/skoda/superb-combi-phev/main.jpg', alt: 'Skoda Superb Combi', specs: '120 km' }
    },
    {
      id: 'kuga-tucson',
      href: '/compare/ford-kuga-phev-vs-hyundai-tucson-phev',
      leftCar: { name: 'Ford Kuga (2025)', image: '/images/cars/brands/ford/kuga/main.jpg', alt: 'Ford Kuga', specs: '65 km' },
      rightCar: { name: 'Hyundai Tucson (2025)', image: '/images/cars/brands/hyundai/tucson-iv-facelift-2024-268hp-phev/main.jpg', alt: 'Hyundai Tucson', specs: '65 km' }
    },
    {
      id: 'mg-byd',
      href: '/compare/mg-hs-ii-vs-byd-seal-u-dm-i',
      leftCar: { name: 'MG HS II (2025)', image: '/images/cars/brands/mg/hs-plug-in-hybrid-2025/main.jpg', alt: 'MG HS II', specs: '120 km' },
      rightCar: { name: 'BYD Seal U DM-i (2025)', image: '/images/cars/brands/byd/seal-u-dm-i/main.jpg', alt: 'BYD Seal U DM-i', specs: '60 km' }
    },
    {
      id: 'bmw-mercedes',
      href: '/compare/bmw-3-series-sedan-phev-vs-mercedes-benz-c-class-phev',
      leftCar: { name: 'BMW 3 Series (2025)', image: '/images/cars/brands/bmw/bmw-3-series-sedan-2024-2025/main.jpg', alt: 'BMW 3 Series', specs: '80 km' },
      rightCar: { name: 'Mercedes-Benz C-Class (2025)', image: '/images/cars/brands/mercedes-benz/c-class-phev/main.jpg', alt: 'Mercedes-Benz C-Class', specs: '102 km' }
    },
    {
      id: 'audi-bmw',
      href: '/compare/audi-q5-phev-vs-bmw-x3-30e',
      leftCar: { name: 'Audi Q5 (2025)', image: '/images/cars/brands/audi/q5-tfsi-e/main.jpg', alt: 'Audi Q5', specs: '107 km' },
      rightCar: { name: 'BMW X3 30e (2025)', image: '/images/cars/brands/bmw/bmw-x3-30e-2024/main.jpg', alt: 'BMW X3 30e', specs: '90 km' }
    },
    {
      id: 'jeep-compass-renegade',
      href: '/compare/jeep-compass-4xe-240hp-phev-vs-jeep-renegade-4xe-240hp-phev',
      leftCar: { name: 'Jeep Compass 4xe (2025)', image: '/images/cars/brands/jeep/compass-4xe/main.jpg', alt: 'Jeep Compass 4xe', specs: '56 km' },
      rightCar: { name: 'Jeep Renegade 4xe (2025)', image: '/images/cars/brands/jeep/renegade-4xe-240hp/main.jpeg', alt: 'Jeep Renegade 4xe', specs: '42 km' }
    },
    {
      id: 'kia-mg',
      href: '/compare/kia-niro-ii-2025-vs-mg-hs-ii-1-5t',
      leftCar: { name: 'Kia Niro (2025)', image: '/images/cars/brands/kia/niro-ii-2025/main.jpg', alt: 'Kia Niro', specs: '57 km' },
      rightCar: { name: 'MG HS (2025)', image: '/images/cars/brands/mg/hs-plug-in-hybrid-2025/main.jpg', alt: 'MG HS', specs: '75 km' }
    },
    {
      id: 'mg-cupra',
      href: '/compare/mg-hs-ii-1-5t-vs-cupra-formentor-204hp-phev',
      leftCar: { name: 'MG HS (2025)', image: '/images/cars/brands/mg/nowy-hs-plug-in-hybrid/main.jpg', alt: 'MG HS', specs: '75 km' },
      rightCar: { name: 'Cupra Formentor (2025)', image: '/images/cars/brands/cupra/formentor-204hp-e-hybrid/main.jpg', alt: 'Cupra Formentor', specs: '65 km' }
    },
    {
      id: 'land-rover-evoque-velar',
      href: '/compare/land-rover-range-rover-evoque-phev-vs-land-rover-range-rover-velar-phev',
      leftCar: { name: 'Range Rover Evoque (2025)', image: '/images/cars/brands/land-rover/range-rover-evoque/main.jpg', alt: 'Range Rover Evoque', specs: '55 km' },
      rightCar: { name: 'Range Rover Velar (2025)', image: '/images/cars/brands/land-rover/range-rover-velar/main.jpg', alt: 'Range Rover Velar', specs: '53 km' }
    },
    {
      id: 'lexus-nx-rx',
      href: '/compare/lexus-nx-450h-plus-phev-vs-lexus-rx-450h-plus-phev',
      leftCar: { name: 'Lexus NX 450h+ (2025)', image: '/images/cars/brands/lexus/nx-450h-plus-phev/main.jpg', alt: 'Lexus NX 450h+', specs: '76 km' },
      rightCar: { name: 'Lexus RX 450h+ (2025)', image: '/images/cars/brands/lexus/rx-450h-plus-phev/main.jpg', alt: 'Lexus RX 450h+', specs: '65 km' }
    },
    {
      id: 'peugeot-508-sw-308-sw',
      href: '/compare/peugeot-508-sw-phev-vs-peugeot-308-sw-phev',
      leftCar: { name: 'Peugeot 508 SW (2025)', image: '/images/cars/brands/peugeot/508-sw-plug-in-hybrid/main.jpg', alt: 'Peugeot 508 SW', specs: '64 km' },
      rightCar: { name: 'Peugeot 308 SW (2025)', image: '/images/cars/brands/peugeot/308-sw-plug-in-hybrid/main.jpg', alt: 'Peugeot 308 SW', specs: '85 km' }
    },
    {
      id: 'porsche-panamera-cayenne',
      href: '/compare/porsche-panamera-4-phev-vs-porsche-cayenne-phev',
      leftCar: { name: 'Porsche Panamera (2025)', image: '/images/cars/brands/porsche/panamera-panamera-4-e-hybrid/main.jpg', alt: 'Porsche Panamera', specs: '91 km' },
      rightCar: { name: 'Porsche Cayenne (2025)', image: '/images/cars/brands/porsche/cayenne-cayenne-e-hybrid/main.jpg', alt: 'Porsche Cayenne', specs: '74 km' }
    },
    {
      id: 'seat-leon-sportstourer-hatchback',
      href: '/compare/seat-leon-sportstourer-1-4-e-hybrid-vs-seat-leon-1-5-tsi',
      leftCar: { name: 'SEAT Leon Sportstourer (2025)', image: '/images/cars/brands/seat/leon-iv-sportstourer-14-e-hybrid/main.jpg', alt: 'SEAT Leon Sportstourer', specs: '65 km' },
      rightCar: { name: 'SEAT Leon Hatchback (2025)', image: '/images/cars/brands/seat/leon-iv-14-e-hybrid/main.jpg', alt: 'SEAT Leon Hatchback', specs: '65 km' }
    },
    {
      id: 'skoda-kodiaq-superb',
      href: '/compare/koda-kodiaq-phev-vs-koda-superb-combi-phev',
      leftCar: { name: 'Skoda Kodiaq (2025)', image: '/images/cars/brands/skoda/kodiaq-phev/main.jpg', alt: 'Skoda Kodiaq', specs: '120 km' },
      rightCar: { name: 'Skoda Superb (2025)', image: '/images/cars/brands/skoda/superb-sedan-phev/main.jpg', alt: 'Skoda Superb', specs: '120 km' }
    },
    {
      id: 'skoda-superb-combi-sedan',
      href: '/compare/koda-superb-combi-phev-vs-koda-superb-sedan-phev',
      leftCar: { name: 'Skoda Superb Combi (2025)', image: '/images/cars/brands/skoda/superb-combi-phev/main.jpg', alt: 'Skoda Superb Combi', specs: '120 km' },
      rightCar: { name: 'Skoda Superb (2025)', image: '/images/cars/brands/skoda/superb-sedan-phev/main.jpg', alt: 'Skoda Superb', specs: '120 km' }
    },
    {
      id: 'suzuki-across-toyota-rav4',
      href: '/compare/suzuki-across-phev-vs-toyota-rav4-phev',
      leftCar: { name: 'Suzuki Across (2025)', image: '/images/cars/brands/suzuki/across-phev/main.jpg', alt: 'Suzuki Across', specs: '75 km' },
      rightCar: { name: 'Toyota RAV4 (2025)', image: '/images/cars/brands/toyota/rav4-plug-in-hybrid/main.jpg', alt: 'Toyota RAV4', specs: '75 km' }
    },
    {
      id: 'suzuki-across-hyundai-tucson',
      href: '/compare/suzuki-across-phev-vs-hyundai-tucson-iv-facelift-268hp-phev',
      leftCar: { name: 'Suzuki Across (2025)', image: '/images/cars/brands/suzuki/across-phev/main.jpg', alt: 'Suzuki Across', specs: '75 km' },
      rightCar: { name: 'Hyundai Tucson (2025)', image: '/images/cars/brands/hyundai/tucson-iv-facelift-2024-268hp-phev/main.jpg', alt: 'Hyundai Tucson', specs: '65 km' }
    },
    {
      id: 'toyota-rav4-c-hr',
      href: '/compare/toyota-rav4-phev-vs-toyota-c-hr-phev',
      leftCar: { name: 'Toyota RAV4 (2025)', image: '/images/cars/brands/toyota/rav4-plug-in-hybrid/main.jpg', alt: 'Toyota RAV4', specs: '75 km' },
      rightCar: { name: 'Toyota C-HR (2025)', image: '/images/cars/brands/toyota/c-hr-plug-in-hybrid/main.jpg', alt: 'Toyota C-HR', specs: '66 km' }
    },
    {
      id: 'toyota-prius-crown',
      href: '/compare/toyota-prius-phev-vs-toyota-crown-phev',
      leftCar: { name: 'Toyota Prius (2025)', image: '/images/cars/brands/toyota/prius-plug-in-hybrid/main.jpg', alt: 'Toyota Prius', specs: '86 km' },
      rightCar: { name: 'Toyota Crown (2025)', image: '/images/cars/brands/toyota/crown-phev/main.jpg', alt: 'Toyota Crown', specs: '70 km' }
    },
    {
      id: 'toyota-rav4-suzuki-across',
      href: '/compare/toyota-rav4-phev-vs-suzuki-across-phev',
      leftCar: { name: 'Toyota RAV4 (2025)', image: '/images/cars/brands/toyota/rav4-plug-in-hybrid/main.jpg', alt: 'Toyota RAV4', specs: '75 km' },
      rightCar: { name: 'Suzuki Across (2025)', image: '/images/cars/brands/suzuki/across-phev/main.jpg', alt: 'Suzuki Across', specs: '75 km' }
    }
  ]

  // Quick Compare: aynı marka modelleri birbirleriyle karşılaştır
  const getBrandFromImage = (imgPath: string) => {
    const match = imgPath.match(/\/brands\/([^\/]+)/)
    return match ? match[1] : ''
  }

  const crossBrandComparisons = useMemo(() => {
    return comparisons.filter((c) => {
      const leftBrand = getBrandFromImage(c.leftCar.image)
      const rightBrand = getBrandFromImage(c.rightCar.image)
      return leftBrand && rightBrand && leftBrand !== rightBrand
    })
  }, [])

  // Random sıralama (aynı marka filtrelendikten sonra)
  const shuffledComparisons = useMemo(() => {
    return [...crossBrandComparisons].sort(() => Math.random() - 0.5)
  }, [crossBrandComparisons])

  // Dil algılama - localStorage'dan oku, yoksa browser dilini kullan
  useEffect(() => {
    const detectLanguage = () => {
      // Önce localStorage'dan oku
      const savedLanguage = localStorage.getItem('phevs-language')
      if (savedLanguage) {
        console.log('Main page - Language from localStorage:', savedLanguage)
        setSelectedLanguage(savedLanguage)
        return
      }
      
      // Yoksa browser dilini algıla
      const browserLang = navigator.language || navigator.languages?.[0] || 'en'
      const langCode = browserLang.split('-')[0].toLowerCase()
      
      const supportedLangs = ['en', 'de', 'tr', 'pl']
      if (supportedLangs.includes(langCode)) {
        console.log('Main page - Browser language detected:', langCode)
        setSelectedLanguage(langCode)
        localStorage.setItem('phevs-language', langCode)
      }
    }
    
    detectLanguage()
  }, [])
  
  const [filters, setFilters] = useState<FiltersState>({
    segment: '',
    priceRange: [0, 150000],
    rangeRange: [0, 200],
    fuelConsumption: [0, 10],
    batteryArchitecture: '',
    batteryChemistry: '',
    chargingType: '',
    powerRange: [0, 500],
    yearRange: [2020, 2030],
    emissionRange: [0, 150],
    sortBy: 'name-asc'
  })

  const defaultFilters: FiltersState = {
    segment: '',
    priceRange: [0, 150000],
    rangeRange: [0, 200],
    fuelConsumption: [0, 10],
    batteryArchitecture: '',
    batteryChemistry: '',
    chargingType: '',
    powerRange: [0, 500],
    yearRange: [2020, 2030],
    emissionRange: [0, 150],
    sortBy: 'name-asc'
  }

  const normalizePair = (val: any, def: [number, number]): [number, number] => {
    return Array.isArray(val) && val.length === 2
      ? [Number(val[0]) || def[0], Number(val[1]) || def[1]]
      : def
  }

  const normalizeFilters = (raw: any): FiltersState => {
    if (!raw || typeof raw !== 'object') return defaultFilters
    return {
      segment: typeof raw.segment === 'string' ? raw.segment : '',
      priceRange: normalizePair(raw.priceRange, defaultFilters.priceRange),
      rangeRange: normalizePair(raw.rangeRange, defaultFilters.rangeRange),
      fuelConsumption: normalizePair(raw.fuelConsumption, defaultFilters.fuelConsumption),
      batteryArchitecture: typeof raw.batteryArchitecture === 'string' ? raw.batteryArchitecture : '',
      batteryChemistry: typeof raw.batteryChemistry === 'string' ? raw.batteryChemistry : '',
      chargingType: typeof raw.chargingType === 'string' ? raw.chargingType : '',
      powerRange: normalizePair(raw.powerRange, defaultFilters.powerRange),
      yearRange: normalizePair(raw.yearRange, defaultFilters.yearRange),
      emissionRange: normalizePair(raw.emissionRange, defaultFilters.emissionRange),
      sortBy: (['range-asc','range-desc','power-asc','power-desc','name-asc'] as SortOption[]).includes(raw.sortBy)
        ? raw.sortBy
        : 'name-asc'
    }
  }

  // PHEV Guide popup kontrolü
  useEffect(() => {
    const hasSeenPopup = localStorage.getItem('phevs-guide-popup-seen')
    if (!hasSeenPopup) {
      // 3 saniye sonra popup'ı göster
      const timer = setTimeout(() => {
        setIsPHEVGuidePopupOpen(true)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [])

  // LocalStorage'dan verileri yükle
  useEffect(() => {
    const timer = setTimeout(() => {
    const savedFilters = localStorage.getItem('phevs-filters')
    const savedBrands = localStorage.getItem('phevs-selected-brands')
      const savedFavorites = localStorage.getItem('phevs-favorites')
      const savedViewMode = localStorage.getItem('phevs-view-mode')
      const savedSort = localStorage.getItem('phevs-sort')
      const savedRecentlyViewed = localStorage.getItem('phevs-recently-viewed')
    
    if (savedFilters) {
      try {
        setFilters(normalizeFilters(JSON.parse(savedFilters)))
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
      
      if (savedRecentlyViewed) {
        try {
          const viewedIds = JSON.parse(savedRecentlyViewed)
          const viewedCars = cars.filter(car => viewedIds.includes(car.id))
          setRecentlyViewed(viewedCars)
        } catch (e) {
          console.error('Error loading recently viewed:', e)
        }
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

  // Dropdown'ları dışına tıklandığında kapat
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      
      if (isBrandDropdownOpen && !target.closest('.brand-dropdown')) {
        setIsBrandDropdownOpen(false)
      }
      
      if (isMobileLanguageDropdownOpen && !target.closest('.mobile-language-dropdown')) {
        setIsMobileLanguageDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isBrandDropdownOpen, isMobileLanguageDropdownOpen])

  // Özel karakterleri normalize eden fonksiyon
  const normalizeText = (text: string | null | undefined) => {
    const safe = (text ?? '').toString()
    return safe
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
    const getPair = (val: number[] | undefined, def: [number, number]): [number, number] => {
      if (Array.isArray(val) && val.length === 2) {
        const a = Number(val[0])
        const b = Number(val[1])
        return [isNaN(a) ? def[0] : a, isNaN(b) ? def[1] : b]
      }
      return def
    }

    const [minRange, maxRange] = getPair(filters?.rangeRange as number[], [0, 200])
    const [minFuel, maxFuel] = getPair(filters?.fuelConsumption as number[], [0, 10])
    const [minPower, maxPower] = getPair(filters?.powerRange as number[], [0, 500])
    const [minYear, maxYear] = getPair(filters?.yearRange as number[], [2020, 2030])
    const [minEmission, maxEmission] = getPair(filters?.emissionRange as number[], [0, 150])

    let filtered = cars.filter(car => {
      const normalizedSearchTerm = normalizeText(searchTerm)
      const normalizedBrand = normalizeText(car.brand)
      const normalizedModel = normalizeText(car.model)
      
      const matchesSearch = normalizedSearchTerm === '' || 
        normalizedBrand.includes(normalizedSearchTerm) || 
        normalizedModel.includes(normalizedSearchTerm)
      
      const matchesBrand = selectedBrands.length === 0 || selectedBrands.some(
        (b) => b.trim().toLowerCase() === (car.brand || '').trim().toLowerCase()
      )

      const matchesSegment = !filters.segment || car.segment === filters.segment
      
      const matchesRange = car.ev_range_km >= minRange && car.ev_range_km <= maxRange
      
      const matchesFuel = car.fuel_consumption >= minFuel && car.fuel_consumption <= maxFuel
      
      // Placeholder değerler - gerçek veri yapısına göre güncellenecek
      const matchesBatteryArchitecture = !filters.batteryArchitecture || 
        (car.battery_details?.architecture === filters.batteryArchitecture)
      
      const matchesBatteryChemistry = !filters.batteryChemistry || 
        (car.battery_details?.chemistry === filters.batteryChemistry)
      
      const matchesChargingType = !filters.chargingType || 
        (filters.chargingType === 'ac' && car.charging_port?.ac_type) ||
        (filters.chargingType === 'dc' && car.charging_port?.dc_type)
      
      const matchesPowerRange = car.power_hp >= minPower && car.power_hp <= maxPower
      
      const matchesYearRange = car.year >= minYear && car.year <= maxYear
      
      const matchesEmissionRange = car.co2_emission >= minEmission && car.co2_emission <= maxEmission
      


      return matchesSearch && matchesBrand && matchesSegment && matchesRange && 
        matchesFuel && matchesBatteryArchitecture && matchesBatteryChemistry && matchesChargingType && 
        matchesPowerRange && matchesYearRange && matchesEmissionRange
    })

    // Sıralama
    filtered.sort((a, b) => {
      switch (sortBy) {
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

  // Option 1: Load More pagination (24 cars initial display for fast LCP & clean layout)
  const INITIAL_VISIBLE_CARS = 24
  const [visibleCarsCount, setVisibleCarsCount] = useState(INITIAL_VISIBLE_CARS)

  // Reset pagination count when user changes filters, search, or sorting
  useEffect(() => {
    setVisibleCarsCount(INITIAL_VISIBLE_CARS)
  }, [searchTerm, selectedBrands, filters, sortBy])

  const displayedCars = useMemo(() => {
    return filteredAndSortedCars.slice(0, visibleCarsCount)
  }, [filteredAndSortedCars, visibleCarsCount])

  // Markaları al (Case-insensitive & trimmed unique map)
  const brands = useMemo(() => {
    const brandMap = new Map<string, string>()
    cars.forEach((car) => {
      if (car.brand && car.brand.trim()) {
        const key = car.brand.trim().toLowerCase()
        if (!brandMap.has(key)) {
          brandMap.set(key, car.brand.trim())
        }
      }
    })
    return Array.from(brandMap.values()).sort((a, b) => a.localeCompare(b))
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

  // Recently viewed'ı güncelle
  const updateRecentlyViewed = (car: Car) => {
    const currentViewed = recentlyViewed.filter(c => c.id !== car.id)
    const newViewed = [car, ...currentViewed].slice(0, 6) // Son 6 araç
    setRecentlyViewed(newViewed)
    localStorage.setItem('phevs-recently-viewed', JSON.stringify(newViewed.map(c => c.id)))
  }

  // PHEV Guide popup'ını kapat
  const closePHEVGuidePopup = () => {
    setIsPHEVGuidePopupOpen(false)
    localStorage.setItem('phevs-guide-popup-seen', 'true')
  }

  // Filtreleri temizle
  const clearFilters = () => {
    setSearchTerm('')
    setSelectedBrands([])
    setFilters({
      segment: '',
      priceRange: [0, 150000],
      rangeRange: [0, 200],
      fuelConsumption: [0, 10],
      batteryArchitecture: '',
      batteryChemistry: '',
      chargingType: '',
      powerRange: [0, 500],
      yearRange: [2020, 2030],
      emissionRange: [0, 150],
      sortBy: 'name-asc'
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
      background: 'bg-slate-900',
      headerBg: 'bg-slate-800',
      headerText: 'text-white',
      cardBg: 'bg-slate-800',
      cardBorder: 'border-slate-600',
      textPrimary: 'text-white',
      textSecondary: 'text-gray-300',
      filterBg: 'bg-slate-800',
      filterBorder: 'border-slate-600',
      filterText: 'text-white',
      inputBg: 'bg-slate-600',
      inputBorder: 'border-slate-500',
      inputText: 'text-white',
      iconColor: 'text-gray-300'
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
      discoverRange: 'Discover your real-world electric range based on temperature, climate control, and driving conditions',
      allArchitectures: 'All Architectures',
      allChemistries: 'All Chemistries',
      modular: 'Modular',
      integrated: 'Integrated',
      skateboard: 'Skateboard',
      lithiumIon: 'Lithium-Ion',
      lfp: 'LFP',
      ncm: 'NCM',
      nca: 'NCA',
      nameAsc: 'Name (A-Z)',
      priceAsc: 'Price (Low-High)',
      priceDesc: 'Price (High-Low)',
      rangeDesc: 'Range (High-Low)',
      rangeAsc: 'Range (Low-High)',
      powerDesc: 'Power (High-Low)',
      powerAsc: 'Power (Low-High)',
      engine: 'Engine',
      charging: 'Charging',
      suggestModel: 'Suggest Model',
      advancedFilters: 'Advanced Filters',
      active: 'Active',
      filter: 'Filter',
      manufacturerPending: 'Manufacturer data pending',
      testResultsPending: 'Test results pending',
      batteryType: 'Battery Type',
      warranty: 'Warranty',
      realWorldRange: 'Real World Range',
      testDate: 'Test',
      update: 'Update',
      dataNotFound: 'Data not found',
      selectToCompare: 'Please select a vehicle to compare',
      heroTitle: "Compare Europe's Leading Plug-in Hybrid (PHEV) Vehicles (2026)",
      heroDescription: 'Compare 125+ plug-in hybrid electric vehicles (PHEVs) from 30 premium brands. Find the perfect PHEV for your lifestyle.',
      heroBadge: "Europe's Most Comprehensive Plug-in Hybrid Platform",
      phevModels: 'PHEV Models',
      phevModelsSubtitle: 'Plug-in Hybrid Models',
      premiumBrands: 'Premium Brands',
      premiumBrandsSubtitle: 'Premium Brands',
      vehicleSegments: 'Vehicle Segments',
      vehicleSegmentsSubtitle: 'Vehicle Segments',
      realWorldRangeData: 'Real-world Range Data',
      priceComparison: 'Price Comparison',
      technicalSpecifications: 'Technical Specifications',
      quickCompareTitle: 'Quick Compare Popular Models',
      quickCompareDescription: 'Compare the most popular PHEV models side by side',
      faq: {
        title: 'All You Need to Know About PHEV'
      },
      navigation: {
        phevNews: 'PHEV News',
        faq: 'FAQ',
        videos: 'Videos'
      }
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
      discoverRange: 'Entdecken Sie Ihre realistische elektrische Reichweite basierend auf Temperatur, Klimaanlage und Fahrbedingungen',
      allArchitectures: 'Alle Architekturen',
      allChemistries: 'Alle Chemien',
      modular: 'Modular',
      integrated: 'Integriert',
      skateboard: 'Skateboard',
      lithiumIon: 'Lithium-Ion',
      lfp: 'LFP',
      ncm: 'NCM',
      nca: 'NCA',
      nameAsc: 'Name (A-Z)',
      priceAsc: 'Preis (Niedrig-Hoch)',
      priceDesc: 'Preis (Hoch-Niedrig)',
      rangeDesc: 'Reichweite (Hoch-Niedrig)',
      rangeAsc: 'Reichweite (Niedrig-Hoch)',
      powerDesc: 'Leistung (Hoch-Niedrig)',
      powerAsc: 'Leistung (Niedrig-Hoch)',
      engine: 'Motor',
      charging: 'Laden',
      suggestModel: 'Modell vorschlagen',
      advancedFilters: 'Erweiterte Filter',
      active: 'Aktiv',
      filter: 'Filter',
      manufacturerPending: 'Herstellerdaten ausstehend',
      testResultsPending: 'Testergebnisse ausstehend',
      batteryType: 'Batterietyp',
      warranty: 'Garantie',
      realWorldRange: 'Reale Reichweite',
      testDate: 'Test',
      update: 'Aktualisierung',
      dataNotFound: 'Daten nicht gefunden',
      selectToCompare: 'Bitte wählen Sie ein Fahrzeug zum Vergleichen',
      heroTitle: 'Europas umfassendste Plug-in-Hybrid (PHEV) Vergleichsplattform',
      heroDescription: 'Vergleichen Sie über 125 Plug-in-Hybrid-Fahrzeuge (PHEVs) von 30 Premium-Marken. Finden Sie das perfekte PHEV für Ihren Lebensstil.',
      heroBadge: 'Europas umfassendste Plug-in-Hybrid-Plattform',
      phevModels: 'PHEV-Modelle',
      phevModelsSubtitle: 'Plug-in-Hybrid-Modelle',
      premiumBrands: 'Premium-Marken',
      premiumBrandsSubtitle: 'Premium-Marken',
      vehicleSegments: 'Fahrzeugsegmente',
      vehicleSegmentsSubtitle: 'Fahrzeugsegmente',
      realWorldRangeData: 'Realistische Reichweitendaten',
      priceComparison: 'Preisvergleich',
      technicalSpecifications: 'Technische Spezifikationen',
      quickCompareTitle: 'Schnellvergleich beliebter Modelle',
      quickCompareDescription: 'Vergleichen Sie die beliebtesten PHEV-Modelle nebeneinander',
      faq: {
        title: 'Alles was Sie über PHEV wissen müssen'
      },
      navigation: {
        phevNews: 'PHEV News',
        faq: 'FAQ',
        videos: 'Videos'
      }
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
      discoverRange: 'Sıcaklık, iklim kontrolü ve sürüş koşullarına göre gerçek dünya elektrik menzilinizi keşfedin',
      allArchitectures: 'Tüm Mimariler',
      allChemistries: 'Tüm Kimyalar',
      modular: 'Modüler',
      integrated: 'Entegre',
      skateboard: 'Skateboard',
      lithiumIon: 'Lityum-İyon',
      lfp: 'LFP',
      ncm: 'NCM',
      nca: 'NCA',
      nameAsc: 'İsim (A-Z)',
      priceAsc: 'Fiyat (Düşük-Yüksek)',
      priceDesc: 'Fiyat (Yüksek-Düşük)',
      rangeDesc: 'Menzil (Yüksek-Düşük)',
      rangeAsc: 'Menzil (Düşük-Yüksek)',
      powerDesc: 'Güç (Yüksek-Düşük)',
      powerAsc: 'Güç (Düşük-Yüksek)',
      engine: 'Motor',
      charging: 'Şarj',
      suggestModel: 'Model Öner',
      advancedFilters: 'Gelişmiş Filtreler',
      active: 'Aktif',
      filter: 'Filtrele',
      manufacturerPending: 'Üretici verisi bekleniyor',
      testResultsPending: 'Test sonuçları hazırlanıyor',
      batteryType: 'Batarya Tipi',
      warranty: 'Garanti',
      realWorldRange: 'Gerçek Menzil',
      testDate: 'Test',
      update: 'Güncelleme',
      dataNotFound: 'Veri bulunamadı',
      selectToCompare: 'Lütfen önce karşılaştırmak için araç seçin',
      heroTitle: 'Avrupa\'nın En Kapsamlı Plug-in Hybrid (PHEV) Karşılaştırma Platformu',
      heroDescription: '30 premium markadan 125+ plug-in hibrit (fişli hibrit) elektrikli aracı karşılaştırın. Yaşam tarzınıza uygun mükemmel PHEV\'i bulun.',
      heroBadge: 'Avrupa\'nın En Kapsamlı Plug-in Hybrid Platformu',
      phevModels: 'PHEV Modelleri',
      phevModelsSubtitle: 'Plug-in Hibrit (Fişli Hibrit) Modeller',
      premiumBrands: 'Premium Markalar',
      premiumBrandsSubtitle: 'Premium Markalar',
      vehicleSegments: 'Araç Segmentleri',
      vehicleSegmentsSubtitle: 'Araç Segmentleri',
      realWorldRangeData: 'Gerçek Dünya Menzil Verileri',
      priceComparison: 'Fiyat Karşılaştırması',
      technicalSpecifications: 'Teknik Özellikler',
      quickCompareTitle: 'Popüler Modelleri Hızlı Karşılaştır',
      quickCompareDescription: 'En popüler PHEV modellerini yan yana karşılaştırın',
      faq: {
        title: 'PHEV Hakkında Bilmeniz Gereken Her Şey'
      },
      navigation: {
        phevNews: 'PHEV News',
        faq: 'FAQ',
        videos: 'Kıyaslama Videoları'
      }
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
      discoverRange: 'Odkryj swój rzeczywisty zasięg elektryczny na podstawie temperatury, klimatyzacji i warunków jazdy',
      allArchitectures: 'Wszystkie Architektury',
      allChemistries: 'Wszystkie Chemie',
      modular: 'Modularny',
      integrated: 'Zintegrowany',
      skateboard: 'Skateboard',
      lithiumIon: 'Litowo-Jonowy',
      lfp: 'LFP',
      ncm: 'NCM',
      nca: 'NCA',
      nameAsc: 'Nazwa (A-Z)',
      priceAsc: 'Cena (Niska-Wysoka)',
      priceDesc: 'Cena (Wysoka-Niska)',
      rangeDesc: 'Zasięg (Wysoki-Niski)',
      rangeAsc: 'Zasięg (Niski-Wysoki)',
      powerDesc: 'Moc (Wysoka-Niska)',
      powerAsc: 'Moc (Niska-Wysoka)',
      engine: 'Silnik',
      charging: 'Ładowanie',
      suggestModel: 'Zaproponuj Model',
      advancedFilters: 'Zaawansowane Filtry',
      active: 'Aktywny',
      filter: 'Filtruj',
      manufacturerPending: 'Oczekiwanie na dane producenta',
      testResultsPending: 'Oczekiwanie na wyniki testów',
      batteryType: 'Typ Baterii',
      warranty: 'Gwarancja',
      realWorldRange: 'Rzeczywisty Zasięg',
      testDate: 'Test',
      update: 'Aktualizacja',
      dataNotFound: 'Nie znaleziono danych',
      selectToCompare: 'Wybierz pojazd do porównania',
      heroTitle: 'Najbardziej kompleksowa platforma hybryd plug-in (PHEV) w Europie',
      heroDescription: 'Porównaj ponad 125 hybrydowych pojazdów elektrycznych plug-in (PHEV) 30 wiodących marek. Znajdź idealny PHEV dla swojego stylu życia.',
      heroBadge: 'Najbardziej kompleksowa platforma hybryd plug-in w Europie',
      phevModels: 'Modele PHEV',
      phevModelsSubtitle: 'Modele Plug-in Hybrid',
      premiumBrands: 'Marki Premium',
      premiumBrandsSubtitle: 'Marki Premium',
      vehicleSegments: 'Segmenty Pojazdów',
      vehicleSegmentsSubtitle: 'Segmenty Pojazdów',
      realWorldRangeData: 'Dane rzeczywistego zasięgu',
      priceComparison: 'Porównanie cen',
      technicalSpecifications: 'Specyfikacje techniczne',
      quickCompareTitle: 'Szybkie porównanie popularnych modeli',
      quickCompareDescription: 'Porównaj najpopularniejsze modele PHEV obok siebie',
      faq: {
        title: 'Wszystko co musisz wiedzieć o PHEV'
      },
      navigation: {
        phevNews: 'PHEV News',
        faq: 'FAQ',
        videos: 'Wideo'
      }
    },
    fr: {
      searchPlaceholder: 'Rechercher par marque ou modèle...',
      allBrands: 'Toutes les Marques',
      allSegments: 'Tous les Segments',
      clearFilters: 'Effacer tous les filtres',
      rangeSimulator: "Simulateur d'Autonomie",
      compare: 'Comparer',
      favorites: 'Favoris',
      added: 'Ajouté',
      view: 'Voir',
      vehiclesFound: 'véhicules trouvés',
      noVehiclesFound: 'Aucun véhicule trouvé',
      tryAdjustingFilters: 'Essayez de modifier vos filtres ou termes de recherche',
      estimatedEU: 'Est. UE',
      estimatedEUPrice: 'Prix estimé UE',
      evRange: 'Autonomie EV',
      battery: 'Batterie',
      fuelConsumption: 'Consommation',
      totalPower: 'Puissance Totale',
      chargeTime: 'Temps de Charge',
      co2: 'CO₂',
      trunk: 'Coffre',
      year: 'Année',
      segment: 'Segment',
      price: 'Prix',
      power: 'Puissance',
      range: 'Autonomie',
      consumption: 'Consommation',
      charge: 'Charge',
      emission: 'Émission',
      volume: 'Volume',
      trySimulator: "Essayer le Simulateur d'Autonomie",
      selectVehicle: 'Sélectionner un Véhicule',
      selectVehicleFirst: "Veuillez d'abord sélectionner un véhicule pour utiliser le simulateur",
      discoverRange: "Découvrez votre autonomie réelle selon la température, la climatisation et les conditions de conduite",
      allArchitectures: 'Toutes les Architectures',
      allChemistries: 'Toutes les Chimies',
      modular: 'Modulaire',
      integrated: 'Intégré',
      skateboard: 'Skateboard',
      lithiumIon: 'Lithium-Ion',
      lfp: 'LFP',
      ncm: 'NCM',
      nca: 'NCA',
      nameAsc: 'Nom (A-Z)',
      priceAsc: 'Prix (Croissant)',
      priceDesc: 'Prix (Décroissant)',
      rangeDesc: 'Autonomie (Décroissant)',
      rangeAsc: 'Autonomie (Croissant)',
      powerDesc: 'Puissance (Décroissant)',
      powerAsc: 'Puissance (Croissant)',
      engine: 'Moteur',
      charging: 'Recharge',
      suggestModel: 'Suggérer un Modèle',
      advancedFilters: 'Filtres Avancés',
      active: 'Actif',
      filter: 'Filtrer',
      manufacturerPending: 'Données constructeur en attente',
      testResultsPending: 'Résultats de tests en attente',
      batteryType: 'Type de Batterie',
      warranty: 'Garantie',
      realWorldRange: 'Autonomie Réelle',
      testDate: 'Test',
      update: 'Mise à jour',
      dataNotFound: 'Données non trouvées',
      selectToCompare: 'Veuillez sélectionner un véhicule à comparer',
      heroTitle: "Comparez les meilleurs véhicules hybrides rechargeables (2026)",
      heroDescription: 'Comparez plus de 125 véhicules hybrides rechargeables (PHEV) de 30 marques leaders. Trouvez le PHEV idéal pour votre style de vie.',
      heroBadge: 'La plateforme de référence PHEV en Europe',
      phevModels: 'Modèles PHEV',
      phevModelsSubtitle: 'Modèles Hybrides Rechargeables',
      premiumBrands: 'Marques Premium',
      premiumBrandsSubtitle: 'Marques Premium',
      vehicleSegments: 'Segments de Véhicules',
      vehicleSegmentsSubtitle: 'Segments de Véhicules',
      realWorldRangeData: 'Données d’autonomie réelle',
      priceComparison: 'Comparateur de prix',
      technicalSpecifications: 'Fiches techniques complètes',
      quickCompareTitle: 'Comparaisons rapides populaires',
      quickCompareDescription: 'Comparez côte à côte les modèles PHEV les plus populaires',
      faq: {
        title: 'Tout savoir sur le PHEV'
      },
      navigation: {
        phevNews: 'Actualités PHEV',
        faq: 'FAQ',
        videos: 'Vidéos'
      }
    },
    es: {
      searchPlaceholder: 'Buscar por marca o modelo...',
      allBrands: 'Todas las Marcas',
      allSegments: 'Todos los Segmentos',
      clearFilters: 'Borrar todos los filtros',
      rangeSimulator: 'Simulador de Autonomía',
      compare: 'Comparar',
      favorites: 'Favoritos',
      added: 'Añadido',
      view: 'Ver',
      vehiclesFound: 'vehículos encontrados',
      noVehiclesFound: 'No se encontraron vehículos',
      tryAdjustingFilters: 'Prueba a cambiar los filtros o términos de búsqueda',
      estimatedEU: 'Est. UE',
      estimatedEUPrice: 'Precio estimado UE',
      evRange: 'Autonomía EV',
      battery: 'Batería',
      fuelConsumption: 'Consumo de Combustible',
      totalPower: 'Potencia Total',
      chargeTime: 'Tiempo de Carga',
      co2: 'CO₂',
      trunk: 'Maletero',
      year: 'Año',
      segment: 'Segmento',
      price: 'Precio',
      power: 'Potencia',
      range: 'Autonomía',
      consumption: 'Consumo',
      charge: 'Carga',
      emission: 'Emisión',
      volume: 'Volumen',
      trySimulator: 'Probar Simulador de Autonomía',
      selectVehicle: 'Seleccionar Vehículo',
      selectVehicleFirst: 'Selecciona primero un vehículo para usar el simulador',
      discoverRange: 'Descubre tu autonomía real según temperatura, climatización y estilo de conducción',
      allArchitectures: 'Todas las Arquitecturas',
      allChemistries: 'Todas las Químicas',
      modular: 'Modular',
      integrated: 'Integrada',
      skateboard: 'Skateboard',
      lithiumIon: 'Iones de Litio',
      lfp: 'LFP',
      ncm: 'NCM',
      nca: 'NCA',
      nameAsc: 'Nombre (A-Z)',
      priceAsc: 'Precio (Menor-Mayor)',
      priceDesc: 'Precio (Mayor-Menor)',
      rangeDesc: 'Autonomía (Mayor-Menor)',
      rangeAsc: 'Autonomía (Menor-Mayor)',
      powerDesc: 'Potencia (Mayor-Menor)',
      powerAsc: 'Potencia (Menor-Mayor)',
      engine: 'Motor',
      charging: 'Recarga',
      suggestModel: 'Sugerir Modelo',
      advancedFilters: 'Filtros Avanzados',
      active: 'Activo',
      filter: 'Filtrar',
      manufacturerPending: 'Datos del fabricante pendientes',
      testResultsPending: 'Resultados de pruebas pendientes',
      batteryType: 'Tipo de Batería',
      warranty: 'Garantía',
      realWorldRange: 'Autonomía Real',
      testDate: 'Prueba',
      update: 'Actualización',
      dataNotFound: 'Datos no encontrados',
      selectToCompare: 'Selecciona un vehículo para comparar',
      heroTitle: 'Compara los mejores vehículos híbridos enchufables (2026)',
      heroDescription: 'Compara más de 125 vehículos híbridos enchufables (PHEV) de 30 marcas destacadas. Encuentra el PHEV perfecto para ti.',
      heroBadge: 'La plataforma líder de híbridos enchufables en Europa',
      phevModels: 'Modelos PHEV',
      phevModelsSubtitle: 'Modelos Híbridos Enchufables',
      premiumBrands: 'Marcas Destacadas',
      premiumBrandsSubtitle: 'Marcas Destacadas',
      vehicleSegments: 'Segmentos de Vehículos',
      vehicleSegmentsSubtitle: 'Segmentos de Vehículos',
      realWorldRangeData: 'Datos de autonomía real',
      priceComparison: 'Comparador de precios',
      technicalSpecifications: 'Especificaciones técnicas',
      quickCompareTitle: 'Comparativas populares',
      quickCompareDescription: 'Compara los modelos PHEV más buscados cara a cara',
      faq: {
        title: 'Todo lo que necesitas saber sobre PHEV'
      },
      navigation: {
        phevNews: 'Noticias PHEV',
        faq: 'FAQ',
        videos: 'Vídeos'
      }
    }
  }

  const currentTheme = themes[selectedTheme as keyof typeof themes]
  const t = translations[selectedLanguage as keyof typeof translations] || translations.en

  if (isLoading) {
    return (
      <div className={`min-h-screen ${selectedTheme === 'dark' ? 'bg-slate-900' : 'bg-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            <CarCardSkeleton count={6} viewMode="list" />
          </div>
        </div>
      </div>
    )
  }

  // JSON-LD Structured Data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "PHEVs.eu",
    "url": "https://www.phevs.eu",
    "description": "Europe's most comprehensive plug-in hybrid vehicle comparison platform. Compare 124 PHEV models from 30 brands.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://www.phevs.eu/?search={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "PHEVs.eu",
      "url": "https://www.phevs.eu",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.phevs.eu/images/logo.png",
        "width": "180",
        "height": "60"
      }
    },
    "mainEntity": {
      "@type": "ItemList",
      "name": "Plug-in Hybrid Electric Vehicles",
      "description": "Complete list of PHEV models available in Europe",
      "numberOfItems": filteredAndSortedCars.length,
      "itemListElement": filteredAndSortedCars.slice(0, 10).map((car, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Vehicle",
          "name": `${car.brand} ${car.model}`,
          "description": `${car.brand} ${car.model} (${car.year}) plug-in hybrid: ${car.ev_range_km} km electric range, ${car.battery_kwh} kWh battery, ${car.power_hp} HP.`,
          "brand": {
            "@type": "Brand",
            "name": car.brand
          },
          "manufacturer": {
            "@type": "Organization",
            "name": car.brand
          },
          "model": car.model,
          "modelDate": car.year.toString(),
          "vehicleConfiguration": car.segment,
          "fuelType": ["Gasoline", "Electric"],
          "vehicleSeatingCapacity": car.seats,
          "cargoVolume": {
            "@type": "QuantitativeValue",
            "value": car.trunk_volume,
            "unitCode": "LTR"
          },
          "driveWheelConfiguration": "AWD",
          "fuelEfficiency": {
            "@type": "QuantitativeValue",
            "value": car.fuel_consumption,
            "unitCode": "L/100km"
          },
          "emissionsCO2": {
            "@type": "QuantitativeValue",
            "value": car.co2_emission,
            "unitCode": "g/km"
          },
          "vehicleEngine": {
            "@type": "EngineSpecification",
            "engineDisplacement": {
              "@type": "QuantitativeValue",
              "value": car.engine_displacement || 1.5,
              "unitCode": "LTR"
            },
            "enginePower": {
              "@type": "QuantitativeValue",
              "value": car.power_hp,
              "unitCode": "BHP"
            },
            "engineType": "Plug-in Hybrid"
          },
          "vehicleTransmission": "Automatic",
          "batteryCapacity": {
            "@type": "QuantitativeValue",
            "value": car.battery_kwh,
            "unitCode": "KWH"
          },
          "electricRange": {
            "@type": "QuantitativeValue",
            "value": car.ev_range_km,
            "unitCode": "KMT"
          },
          "chargingTime": {
            "@type": "QuantitativeValue",
            "value": car.charge_time_ac,
            "unitCode": "HUR",
            "description": "AC charging time"
          },
          "url": `https://www.phevs.eu/models/${car.slug || car.id}`,
          "image": getImageUrl(car.image_url),
          "review": car.euroncap_rating ? {
            "@type": "Review",
            "reviewRating": {
              "@type": "Rating",
              "ratingValue": car.euroncap_rating.stars,
              "bestRating": "5",
              "worstRating": "0"
            },
            "author": {
              "@type": "Organization",
              "name": "Euro NCAP"
            },
            "reviewBody": `Euro NCAP Safety Rating: ${car.euroncap_rating.stars} stars. Adult Occupant: ${car.euroncap_rating.adult_occupant}%, Child Occupant: ${car.euroncap_rating.child_occupant}%, Pedestrian Protection: ${car.euroncap_rating.pedestrian_protection}%, Safety Assist: ${car.euroncap_rating.safety_assist}%`
          } : null
        }
      }))
    }
  }

  return (
    <div className={`min-h-screen w-full max-w-full overflow-x-hidden ${selectedTheme === 'dark' ? 'bg-slate-900' : 'bg-gray-200'}`}>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {/* Header */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/90 dark:bg-slate-900/90 border-b border-slate-200/80 dark:border-slate-800/80 shadow-xs transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo ve Brand */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <HybridLogo size="md" className="text-slate-800 dark:text-slate-100 group-hover:scale-105 transition-transform" />
                <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-sm shadow-emerald-500/50"></div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-baseline space-x-1">
                  <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">PHEVs</span>
                  <span className="text-2xl font-light text-blue-600 dark:text-blue-400">.eu</span>
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium tracking-wide -mt-0.5">Europe&apos;s PHEV Comparison Platform</span>
              </div>
            </Link>

            {/* Center Navigation - Sleek Modern Pill Capsule */}
            <nav className="hidden lg:flex items-center p-1 bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 rounded-full backdrop-blur-md shadow-xs space-x-1">
              <a 
                href="/videos" 
                className="text-xs font-semibold px-4 py-2 rounded-full transition-all duration-200 flex items-center space-x-1.5 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700 hover:shadow-xs group"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                <span>{t.navigation.videos}</span>
              </a>
              <a 
                href="/blog" 
                className="text-xs font-semibold px-4 py-2 rounded-full transition-all duration-200 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700 hover:shadow-xs"
              >
                {t.navigation.phevNews}
              </a>
              <a 
                href="/faq" 
                className="text-xs font-semibold px-4 py-2 rounded-full transition-all duration-200 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700 hover:shadow-xs"
              >
                {t.navigation.faq}
              </a>
            </nav>

            {/* Right Side Controls */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Language Selector & Theme Toggle Group */}
              <div className="flex items-center bg-slate-100/90 dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700/80 rounded-full p-1 shadow-2xs">
                {/* Language Selector (Flags intact with original design & behavior) */}
                <div className="flex items-center space-x-0.5">
                  {[
                    { code: 'en', name: 'EN', flag: 'gb' },
                    { code: 'de', name: 'DE', flag: 'de' },
                    { code: 'fr', name: 'FR', flag: 'fr' },
                    { code: 'es', name: 'ES', flag: 'es' },
                    { code: 'tr', name: 'TR', flag: 'tr' },
                    { code: 'pl', name: 'PL', flag: 'pl' }
                  ].map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setSelectedLanguage(lang.code)
                        localStorage.setItem('phevs-language', lang.code)
                        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang.code } }))
                      }}
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                        selectedLanguage === lang.code
                          ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs ring-1 ring-slate-900/5 dark:ring-white/10 scale-105'
                          : 'opacity-70 hover:opacity-100 hover:bg-white/60 dark:hover:bg-slate-700/50'
                      }`}
                      title={lang.name}
                    >
                      <span className={`fi fi-${lang.flag} text-sm`}></span>
                    </button>
                  ))}
                </div>

                {/* Subtle Divider */}
                <div className="h-4 w-px bg-slate-300 dark:bg-slate-700 mx-1"></div>

                {/* Theme Toggle */}
                <div className="flex items-center space-x-0.5">
                  {Object.entries(themes).map(([key, theme]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedTheme(key)}
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                        selectedTheme === key
                          ? 'bg-white dark:bg-slate-700 shadow-xs ring-1 ring-slate-900/5 dark:ring-white/10'
                          : 'opacity-60 hover:opacity-100 hover:bg-white/60 dark:hover:bg-slate-700/50'
                      }`}
                      title={theme.name}
                    >
                      <span className="text-xs sm:text-sm">{key === 'light' ? '☀️' : '🌙'}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="hidden sm:flex items-center space-x-2">
                <button
                  onClick={() => setIsSuggestFormOpen(true)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 transition-all"
                >
                  Suggest Model
                </button>
                <a
                  href="/faq"
                  className="px-4.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-full shadow-sm shadow-blue-500/25 hover:shadow-md hover:shadow-blue-500/30 transition-all flex items-center gap-1.5"
                >
                  <span>PHEV Guide</span>
                  <span className="text-[10px] opacity-80">→</span>
                </a>
              </div>

              {/* Mobile Menu Button */}
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                aria-label="Mobile menüyü aç/kapat"
              >
                {isMobileMenuOpen ? (
                  <XMarkIcon className="w-6 h-6" />
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-20 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 shadow-xl w-full max-w-full overflow-x-hidden animate-in fade-in duration-200">
          <div className="px-4 py-4 space-y-2">
            <Link
              href="/videos"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center space-x-2 px-4 py-3 rounded-xl transition-all duration-200 font-semibold text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/80 border border-slate-200/80 dark:border-slate-700"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <span>{t.navigation.videos}</span>
            </Link>
            <Link
              href="/blog"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-4 py-3 rounded-xl transition-all duration-200 font-semibold text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/80 border border-slate-200/80 dark:border-slate-700"
            >
              {t.navigation.phevNews}
            </Link>
            <Link
              href="/faq"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-4 py-3 rounded-xl transition-all duration-200 font-semibold text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/80 border border-slate-200/80 dark:border-slate-700"
            >
              {t.navigation.faq}
            </Link>
            <div className="pt-2 flex flex-col gap-2 sm:hidden">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false)
                  setIsSuggestFormOpen(true)
                }}
                className="w-full text-center px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              >
                Suggest Model
              </button>
              <a
                href="/faq"
                className="w-full text-center px-4 py-2.5 bg-blue-600 text-white text-xs font-semibold rounded-xl shadow-sm"
              >
                PHEV Guide →
              </a>
            </div>
          </div>
        </div>
      )}


      {/* Hero Section - Modern Design */}
      <section className={`py-12 w-full max-w-full overflow-x-hidden ${selectedTheme === 'dark' ? 'bg-slate-900' : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span>{t.heroBadge}</span>
            </div>
            
            <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 ${selectedTheme === 'dark' ? 'text-white' : 'text-gray-900'} tracking-tight`}>
              {t.heroTitle}
            </h1>
            <p className={`text-lg sm:text-xl mb-8 max-w-3xl mx-auto ${selectedTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
              {t.heroDescription}
            </p>
            
            {/* Modern Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
              <div className={`text-center p-6 rounded-2xl ${selectedTheme === 'dark' ? 'bg-slate-800/50 backdrop-blur-sm border border-slate-700' : 'bg-white/70 backdrop-blur-sm border border-white/20'} shadow-xl`}>
                <div className={`text-3xl sm:text-4xl font-bold mb-2 ${selectedTheme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>87</div>
                <div className={`text-sm font-semibold ${selectedTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{t.phevModels}</div>
                <div className={`text-xs mt-1 ${selectedTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{t.phevModelsSubtitle}</div>
              </div>
              <div className={`text-center p-6 rounded-2xl ${selectedTheme === 'dark' ? 'bg-slate-800/50 backdrop-blur-sm border border-slate-700' : 'bg-white/70 backdrop-blur-sm border border-white/20'} shadow-xl`}>
                <div className={`text-3xl sm:text-4xl font-bold mb-2 ${selectedTheme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>28</div>
                <div className={`text-sm font-semibold ${selectedTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{t.premiumBrands}</div>
                <div className={`text-xs mt-1 ${selectedTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{t.premiumBrandsSubtitle}</div>
              </div>
              <div className={`text-center p-6 rounded-2xl ${selectedTheme === 'dark' ? 'bg-slate-800/50 backdrop-blur-sm border border-slate-700' : 'bg-white/70 backdrop-blur-sm border border-white/20'} shadow-xl`}>
                <div className={`text-3xl sm:text-4xl font-bold mb-2 ${selectedTheme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`}>7</div>
                <div className={`text-sm font-semibold ${selectedTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{t.vehicleSegments}</div>
                <div className={`text-xs mt-1 ${selectedTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{t.vehicleSegmentsSubtitle}</div>
              </div>
            </div>
            
            {/* Modern Feature Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
              <div className={`flex items-center justify-center space-x-3 p-4 rounded-xl ${selectedTheme === 'dark' ? 'bg-slate-800/30 border border-slate-700' : 'bg-white/50 border border-white/30'} backdrop-blur-sm`}>
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <CheckIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <span className={`text-sm font-medium ${selectedTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{t.realWorldRangeData}</span>
              </div>
              <div className={`flex items-center justify-center space-x-3 p-4 rounded-xl ${selectedTheme === 'dark' ? 'bg-slate-800/30 border border-slate-700' : 'bg-white/50 border border-white/30'} backdrop-blur-sm`}>
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <CheckIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <span className={`text-sm font-medium ${selectedTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{t.priceComparison}</span>
              </div>
              <div className={`flex items-center justify-center space-x-3 p-4 rounded-xl ${selectedTheme === 'dark' ? 'bg-slate-800/30 border border-slate-700' : 'bg-white/50 border border-white/30'} backdrop-blur-sm`}>
                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <CheckIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <span className={`text-sm font-medium ${selectedTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{t.technicalSpecifications}</span>
              </div>
              <div className={`flex items-center justify-center space-x-3 p-4 rounded-xl ${selectedTheme === 'dark' ? 'bg-slate-800/30 border border-slate-700' : 'bg-white/50 border border-white/30'} backdrop-blur-sm`}>
                <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                  <CheckIcon className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
                <span className={`text-sm font-medium ${selectedTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{t.rangeSimulator}</span>
              </div>
            </div>
            
            {/* Mobil PHEV Guide Button - Hero Section'da */}
            <div className="mt-4 sm:hidden">
              <a
                href="/faq"
                className="inline-flex items-center px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-200 dark:hover:bg-green-800"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                {t.faq.title}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Curated PHEV Collections - Programmatic SEO Guides */}
      <section className={`py-8 w-full max-w-full overflow-x-hidden border-y ${selectedTheme === 'dark' ? 'bg-slate-950/60 border-slate-800/80' : 'bg-gradient-to-r from-blue-50/50 via-indigo-50/30 to-emerald-50/50 border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-500">Popular Guides & Filters</span>
              <h3 className={`text-xl sm:text-2xl font-bold mt-1 ${selectedTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Explore Specific PHEV Categories
              </h3>
            </div>
            <span className="text-xs text-slate-400">Curated rankings based on official WLTP specifications</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Collection 1: Longest Range */}
            <Link
              href="/longest-range-phev"
              className={`group relative flex flex-col justify-between p-5 rounded-2xl border transition-all duration-300 hover:-translate-y-1 shadow-md hover:shadow-xl ${
                selectedTheme === 'dark'
                  ? 'bg-slate-900/80 border-slate-800 hover:border-emerald-500/60 hover:shadow-emerald-500/10'
                  : 'bg-white border-slate-200 hover:border-emerald-500 hover:shadow-emerald-500/15'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center font-bold text-lg">
                    ⚡
                  </div>
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    100+ km Range
                  </span>
                </div>
                <h4 className={`text-lg font-bold group-hover:text-emerald-400 transition-colors ${selectedTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Longest Range PHEVs
                </h4>
                <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                  Discover plug-in hybrids that can easily cover all weekly commutes without ever touching the petrol engine.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs font-semibold text-emerald-400">
                <span>View 20+ Models</span>
                <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
              </div>
            </Link>

            {/* Collection 2: DC Fast Charging */}
            <Link
              href="/phev-with-dc-charging"
              className={`group relative flex flex-col justify-between p-5 rounded-2xl border transition-all duration-300 hover:-translate-y-1 shadow-md hover:shadow-xl ${
                selectedTheme === 'dark'
                  ? 'bg-slate-900/80 border-slate-800 hover:border-amber-500/60 hover:shadow-amber-500/10'
                  : 'bg-white border-slate-200 hover:border-amber-500 hover:shadow-amber-500/15'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center font-bold text-lg">
                    🔌
                  </div>
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                    CCS &amp; Fast Charge
                  </span>
                </div>
                <h4 className={`text-lg font-bold group-hover:text-amber-400 transition-colors ${selectedTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  DC Fast Charging PHEVs
                </h4>
                <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                  Charge from 10% to 80% in 20-30 minutes at motorway DC rapid stations. Rare models with high demand.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs font-semibold text-amber-400">
                <span>View 35+ Models</span>
                <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
              </div>
            </Link>

            {/* Collection 3: 7-Seater Family */}
            <Link
              href="/7-seater-phev"
              className={`group relative flex flex-col justify-between p-5 rounded-2xl border transition-all duration-300 hover:-translate-y-1 shadow-md hover:shadow-xl ${
                selectedTheme === 'dark'
                  ? 'bg-slate-900/80 border-slate-800 hover:border-teal-500/60 hover:shadow-teal-500/10'
                  : 'bg-white border-slate-200 hover:border-teal-500 hover:shadow-teal-500/15'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/15 text-teal-400 flex items-center justify-center font-bold text-lg">
                    👨‍👩‍👧‍👦
                  </div>
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/30">
                    3-Row Seating
                  </span>
                </div>
                <h4 className={`text-lg font-bold group-hover:text-teal-400 transition-colors ${selectedTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  7-Seater Family PHEVs
                </h4>
                <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                  Spacious 3-row SUVs and MPVs with 7 seats, zero range anxiety, and cavernous cargo capacity for family trips.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs font-semibold text-teal-400">
                <span>View Family Models</span>
                <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Compare Section */}
      <section className={`py-6 w-full max-w-full overflow-x-hidden ${selectedTheme === 'dark' ? 'bg-slate-800' : 'bg-white'}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <h3 className={`text-lg font-semibold mb-2 ${selectedTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {t.quickCompareTitle}
            </h3>
            <p className={`text-sm ${selectedTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              {t.quickCompareDescription}
            </p>
          </div>
          
          {/* Quick Compare Slider */}
          <div className="relative">
            <button 
              className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white dark:bg-slate-800 rounded-full p-2 shadow-lg border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
              aria-label="Quick Compare kaydırıcıyı sola kaydır"
              onClick={() => {
                const container = document.getElementById('compare-slider');
                if (container) {
                  const cardWidth = 320; // w-80 = 320px
                  const scrollAmount = Math.min(cardWidth, container.scrollLeft);
                  container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
                }
              }}
            >
              <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button 
              className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white dark:bg-slate-800 rounded-full p-2 shadow-lg border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
              aria-label="Quick Compare kaydırıcıyı sağa kaydır"
              onClick={() => {
                const container = document.getElementById('compare-slider');
                if (container) {
                  const cardWidth = 320; // w-80 = 320px
                  const maxScroll = container.scrollWidth - container.clientWidth;
                  const scrollAmount = Math.min(cardWidth, maxScroll - container.scrollLeft);
                  container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
                }
              }}
            >
              <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            
            <div id="compare-slider" className="overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory w-full max-w-full">
              <div className="flex space-x-6 pb-4" style={{ width: 'max-content' }}>
              {shuffledComparisons.map((comparison) => (
                <Link key={comparison.id} href={comparison.href} className="group flex-shrink-0">
                  <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200 dark:border-slate-700 overflow-hidden w-80 snap-start">
                    <div className="grid grid-cols-2 gap-0">
                      <div className="relative h-32">
                        <img
                          src={getImageUrl(comparison.leftCar.image)}
                          alt={comparison.leftCar.alt}
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
                          loading="lazy"
                          onError={(e) => { const el = e.currentTarget as HTMLImageElement; el.onerror = null; el.src = getImageUrl(null) }}
                        />
                      </div>
                      <div className="relative h-32">
                        <img
                          src={getImageUrl(comparison.rightCar.image)}
                          alt={comparison.rightCar.alt}
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
                          loading="lazy"
                          onError={(e) => { const el = e.currentTarget as HTMLImageElement; el.onerror = null; el.src = getImageUrl(null) }}
                        />
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold text-sm text-gray-900 dark:text-white truncate">{comparison.leftCar.name}</h4>
                        <span className="text-[11px] font-bold text-gray-400 uppercase mx-1">vs</span>
                        <h4 className="font-semibold text-sm text-gray-900 dark:text-white truncate text-right">{comparison.rightCar.name}</h4>
                      </div>
                      <div className="flex justify-between items-center text-xs text-gray-600 dark:text-gray-300 mb-3 border-y border-gray-100 dark:border-slate-700/60 py-1.5">
                        <span className="font-medium">{comparison.leftCar.specs}</span>
                        <span className="font-medium">{comparison.rightCar.specs}</span>
                      </div>
                      <div className="flex items-center justify-center text-xs font-semibold text-blue-600 dark:text-blue-400 pt-0.5" aria-label={`Compare ${comparison.leftCar.name} and ${comparison.rightCar.name}`}>
                        <span>View Comparison</span>
                        <ArrowsUpDownIcon className="h-3.5 w-3.5 ml-1.5" aria-hidden="true" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}


              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Search and Actions */}
      <div className="fixed top-0 left-0 right-0 z-50 sm:hidden bg-white border-b border-gray-200 shadow-lg w-full max-w-full overflow-x-hidden">
        <div className="p-2">
          <div className="relative mb-2">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="grid grid-cols-3 gap-1">
            {/* Mobil Dil Seçici - Dropdown */}
            <div className="relative mobile-language-dropdown">
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setIsMobileLanguageDropdownOpen(!isMobileLanguageDropdownOpen)
                }}
                className="flex items-center justify-center space-x-1 py-2 px-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors w-full"
              >
                <span className={`fi fi-${selectedLanguage === 'en' ? 'gb' : selectedLanguage === 'de' ? 'de' : selectedLanguage === 'fr' ? 'fr' : selectedLanguage === 'es' ? 'es' : selectedLanguage === 'tr' ? 'tr' : 'pl'} text-xs`}></span>
                <ChevronDownIcon className="h-3 w-3" />
              </button>
              
              {isMobileLanguageDropdownOpen && (
                <div 
                  className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-[9999] min-w-32"
                  onClick={(e) => e.stopPropagation()}
                >
                  {[
                    { 
                      code: 'en', 
                      name: 'English', 
                      flag: 'gb'
                    },
                    { 
                      code: 'de', 
                      name: 'Deutsch', 
                      flag: 'de'
                    },
                    { 
                      code: 'fr', 
                      name: 'Français', 
                      flag: 'fr'
                    },
                    { 
                      code: 'es', 
                      name: 'Español', 
                      flag: 'es'
                    },
                    { 
                      code: 'tr', 
                      name: 'Türkçe', 
                      flag: 'tr'
                    },
                    { 
                      code: 'pl', 
                      name: 'Polski', 
                      flag: 'pl'
                    }
                  ].map((lang) => (
                    <button
                      key={lang.code}
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        setSelectedLanguage(lang.code)
                        localStorage.setItem('phevs-language', lang.code)
                        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang.code } }))
                        setIsMobileLanguageDropdownOpen(false)
                      }}
                      className={`w-full flex items-center space-x-2 px-3 py-2 text-left hover:bg-gray-50 transition-colors ${
                        selectedLanguage === lang.code ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                      }`}
                    >
                      <span className={`fi fi-${lang.flag} text-sm`}></span>
                      <span className="text-xs">{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <Link
              href="/blog"
              className="flex items-center justify-center space-x-1 py-2 px-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              <span className="text-xs">{t.navigation.phevNews}</span>
            </Link>
            <button
              onClick={() => {
                if (selectedCars.length === 0) {
                  alert(t.selectToCompare)
                  return
                }
                window.location.href = '/compare/' + selectedCars.map(car => car.id).join('-')
              }}
              className={`flex items-center justify-center space-x-1 py-2 px-2 rounded-lg transition-colors ${
                selectedCars.length > 0
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <ArrowsUpDownIcon className="h-4 w-4" />
              <span className="text-xs">{t.compare} ({selectedCars.length})</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 z-50 sm:hidden bg-white border-t border-gray-200 shadow-lg w-full max-w-full overflow-x-hidden">
        <div className="grid grid-cols-2 gap-1 p-2">
          <button
            onClick={() => setIsFilterModalOpen(true)}
            className="flex items-center justify-center space-x-1 py-2 px-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <FunnelIcon className="h-4 w-4" />
            <span className="text-sm">{t.filter}</span>
          </button>
          <button
            onClick={() => {
              if (selectedCars.length === 0) {
                alert(t.selectToCompare)
                return
              }
              window.location.href = '/compare/' + selectedCars.map(car => car.id).join('-')
            }}
            className={`flex items-center justify-center space-x-1 py-2 px-3 rounded-lg transition-colors ${
              selectedCars.length > 0
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            <ArrowsUpDownIcon className="h-4 w-4" />
            <span className="text-sm">{t.compare} ({selectedCars.length})</span>
          </button>
        </div>
      </div>

      {/* Filter Bar - EV Database Style */}
      <div className="filter-bar mb-16 sm:mb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mobile Filter Section */}
          <div className="sm:hidden mb-4 space-y-3">
            {/* Mobile Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border-0 bg-slate-50 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>
            
            {/* Mobile Filter Button */}
            <button
              onClick={() => setIsFilterModalOpen(true)}
              className="w-full flex items-center justify-center space-x-2 py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
            >
              <FunnelIcon className="h-5 w-5" />
              <span className="font-medium">{t.filter}</span>
            </button>
          </div>
          
          {/* Modern Filter Bar */}
          <div className="hidden sm:flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-slate-200/50">
            {/* Search */}
            <div className="flex-1 min-w-64">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  placeholder={t.searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-0 bg-slate-50 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
              </div>
            </div>
                  
            {/* Brand Filter */}
            <div className="relative brand-dropdown">
              <button
                onClick={() => setIsBrandDropdownOpen(!isBrandDropdownOpen)}
                className="min-w-36 text-left flex items-center justify-between py-3 px-4 rounded-xl bg-slate-50 text-slate-700 hover:bg-slate-100 transition-all border-0 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <span className="font-medium">
                  {selectedBrands.length === 0 ? 'All Brands' : `${selectedBrands.length} selected`}
                </span>
                <ChevronDownIcon className="h-4 w-4 text-slate-500" />
              </button>

              {isBrandDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 max-h-80 overflow-y-auto">
                  <div className="p-4">
                    <input
                      type="text"
                      placeholder="Search brands..."
                      value={brandSearchTerm}
                      onChange={(e) => setBrandSearchTerm(e.target.value)}
                      className="w-full mb-3 py-2 px-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div className="space-y-2">
                      {filteredBrands.map(brand => (
                        <label
                          key={brand}
                          className="flex items-center space-x-3 p-3 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors"
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
                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm font-medium text-slate-700">{brand}</span>
                        </label>
                      ))}
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-200">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedBrands([])
                        }}
                        className="text-sm text-slate-500 hover:text-slate-700 font-medium"
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
              className="min-w-28 py-3 px-4 rounded-xl bg-slate-50 text-slate-700 border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-slate-100 transition-all"
            >
              <option value="">{t.allSegments}</option>
              {segments.map(segment => (
                <option key={segment} value={segment}>{segment}</option>
              ))}
            </select>

            {/* Advanced Filters Button */}
            <button
              onClick={() => setIsFilterModalOpen(true)}
              className="flex items-center space-x-2 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
            >
              <AdjustmentsHorizontalIcon className="h-5 w-5" />
              <span className="font-medium">Advanced</span>
            </button>
          </div>

          {/* Sort and View Controls */}
          <div className="hidden sm:flex items-center justify-between mt-4">
            <div className="flex items-center gap-3">
              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value as SortOption)}
                className="py-2 px-3 rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="name-asc">{t.nameAsc}</option>
                <option value="range-desc">{t.rangeDesc}</option>
                <option value="range-asc">{t.rangeAsc}</option>
                <option value="power-desc">{t.powerDesc}</option>
                <option value="power-asc">{t.powerAsc}</option>
              </select>

              {/* View Toggle */}
              <div className="flex border border-slate-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-slate-700 hover:bg-slate-50'}`}
                >
                  <ListBulletIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => toggleViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-slate-700 hover:bg-slate-50'}`}
                >
                  <Squares2X2Icon className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Clear Filters */}
            <button
              onClick={clearFilters}
              className="text-sm text-slate-500 hover:text-slate-700 font-medium"
            >
              Clear Filters
            </button>
          </div>

          {/* Brand Metadata Tag Chips */}
          <div className="mt-4 pt-3 border-t border-slate-200/60 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 mr-1">
              Popular Brands:
            </span>
            <button
              onClick={() => setSelectedBrands([])}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                selectedBrands.length === 0
                  ? 'bg-blue-600 text-white shadow-sm font-semibold'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
              }`}
            >
              All ({cars.length})
            </button>
            {brands.map((brand) => {
              const isSelected = selectedBrands.some(
                (b) => b.trim().toLowerCase() === brand.trim().toLowerCase()
              )
              const brandCarCount = cars.filter(
                (c) => (c.brand || '').trim().toLowerCase() === brand.trim().toLowerCase()
              ).length
              return (
                <button
                  key={brand}
                  onClick={() => {
                    if (isSelected) {
                      setSelectedBrands(
                        selectedBrands.filter(
                          (b) => b.trim().toLowerCase() !== brand.trim().toLowerCase()
                        )
                      )
                    } else {
                      setSelectedBrands([...selectedBrands, brand])
                    }
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center space-x-1.5 ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-400'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  <span>{brand}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isSelected
                        ? 'bg-blue-700 text-blue-100'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {brandCarCount}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>


      {/* Interactive Simulators Banner */}
      <div className={`${currentTheme.filterBg} border-b ${currentTheme.cardBorder}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 ${currentTheme.cardBg} rounded-xl flex items-center justify-center shrink-0`}>
                <SparklesIcon className={`h-6 w-6 ${currentTheme.textPrimary}`} />
              </div>
              <div>
                <h3 className={`text-lg font-semibold ${currentTheme.textPrimary}`}>Interactive PHEV Simulators</h3>
                <p className={`text-sm ${currentTheme.textSecondary}`}>Test real-world electric range & calculate Euro 6e-bis / Company Car (BiK) tax savings across Europe</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              <Link
                href="/tax-simulator"
                className="inline-flex items-center justify-center space-x-2 px-5 py-3 rounded-lg font-semibold transition-all duration-200 bg-teal-700 hover:bg-teal-800 text-white shadow hover:shadow-lg text-sm"
              >
                <span>Euro 6e-bis & Tax Simulator</span>
              </Link>
              <button
                onClick={() => {
                  if (selectedCars.length === 0) {
                    alert('Please select a vehicle first to use Range Simulator')
                    return
                  }
                  setSelectedCarForSimulator(selectedCars[0])
                  setIsRangeSimulatorOpen(true)
                }}
                className={`inline-flex items-center justify-center space-x-2 px-5 py-3 rounded-lg font-semibold transition-all duration-200 text-sm ${
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
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold text-[#0B2E33] dark:text-white flex items-center gap-2">
              <span>{filteredAndSortedCars.length} {t.vehiclesFound}</span>
              {filteredAndSortedCars.length > visibleCarsCount && (
                <span className="text-xs font-normal text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-full">
                  Showing 1–{displayedCars.length}
                </span>
              )}
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
          <div className={`text-xs ${selectedTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            Brands: [{selectedBrands.join(', ')}] (Count: {selectedBrands.length}), Segment: {filters.segment || 'All'}, Search: "{searchTerm}", Battery: {filters.batteryArchitecture || 'All'}/{filters.batteryChemistry || 'All'}, Filtered Count: {filteredAndSortedCars.length}, Total Cars: {cars.length}
              </div>
            </div>

        {/* Cars List/Grid */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3">
            {displayedCars.map((car, index) => {
              // Tüm kartları koyu renk (Tonale stili) yap
              const cardStyle = `${currentTheme.cardBg} border ${currentTheme.cardBorder}`
              
              // Tüm butonları koyu renk (Tonale stili) yap
              const buttonStyle = `${currentTheme.cardBg} ${currentTheme.textPrimary} hover:bg-blue-600 hover:text-white`
              
              return (
              <Link 
                key={car.id} 
                href={`/models/${car.slug || car.id}`} 
                onClick={() => updateRecentlyViewed(car)}
                className={`${cardStyle} rounded-xl p-3 sm:p-4 shadow-sm hover:shadow-xl hover:scale-105 transition-all duration-300 block group`}
              >
                {/* Car Image */}
                <div className="mb-4">
                  <div className="aspect-[16/9] w-full max-h-32 rounded-lg overflow-hidden">
                    <div className="relative w-full h-full">
                      {/* Placeholder/Blur Effect */}
                      <div 
                        className="absolute inset-0 bg-gray-200 animate-pulse"
                        style={{
                          backgroundColor: car.dominant_color || '#f3f4f6'
                        }}
                      />
                      
                      {/* Main Image */}
                      <Image
                        src={getImageUrl(car.image_url)}
                        alt={`${car.brand} ${car.model} - ${car.year} model PHEV`}
                        className="w-full h-full object-cover"
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        quality={85}
                        priority={index < 8}
                        loading={index < 8 ? "eager" : "lazy"}
                        placeholder="blur"
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                        onError={(e) => {
                          e.currentTarget.onerror = null
                          e.currentTarget.src = getImageUrl(null)
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Car Info */}
                <div className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className={`text-base font-semibold ${currentTheme.textPrimary} line-clamp-2 h-12 flex items-center`}>
                      {car.brand} {car.model}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="badge-secondary">{car.year}</span>
                      <span className="badge-accent">{car.segment}</span>
                      {car.data_status && (
                          <div className="flex items-center space-x-1">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                              car.data_status.technical_specs === 'complete'
                                ? 'bg-green-100 text-green-800'
                                : car.data_status.technical_specs === 'partial'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {car.data_status.technical_specs === 'complete'
                                ? (selectedLanguage==='tr'?'Tam Veri':'Complete')
                                : car.data_status.technical_specs === 'partial'
                                ? (selectedLanguage==='tr'?'Kısmi Veri':'Partial')
                                : (selectedLanguage==='tr'?'Veri Bekleniyor':'Pending')
                              }
                            </span>
                            {car.data_status.range_data === 'real_world' && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                                {selectedLanguage==='tr'?'Gerçek Menzil':'Real Range'}
                              </span>
                            )}
                          </div>
                        )}
                    </div>
                    {car.euroncap_rating && (
                      <div className="w-24 flex justify-end">
                        <EuroNCAPStars rating={car.euroncap_rating} size="sm" />
                      </div>
                    )}
                    </div>

                  {/* Specifications - Desktop */}
                  <dl className="hidden sm:block space-y-1 text-xs mb-3">
                    <div className="flex items-center justify-between">
                      <dt className="flex items-center space-x-2">
                        <BoltIcon className="h-3 w-3 text-[#4F7C82]" aria-hidden="true" />
                        <span className={`${currentTheme.textPrimary}`}>{t.evRange}:</span>
                      </dt>
                      <dd className={`font-semibold ${currentTheme.textPrimary}`}>{car.ev_range_km} km</dd>
                    </div>

                    <div className="flex items-center justify-between">
                      <dt className="flex items-center space-x-2">
                        <CpuChipIcon className="h-3 w-3 text-[#4F7C82]" aria-hidden="true" />
                        <span className={`${currentTheme.textPrimary}`}>{t.battery}:</span>
                      </dt>
                      <dd className={`font-semibold ${currentTheme.textPrimary}`}>{car.battery_kwh} kWh</dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="flex items-center space-x-2">
                        <WrenchScrewdriverIcon className="h-3 w-3 text-[#4F7C82]" aria-hidden="true" />
                        <span className={`${currentTheme.textPrimary}`}>{t.totalPower}:</span>
                      </dt>
                      <dd className={`font-semibold ${currentTheme.textPrimary}`}>{car.power_hp} HP</dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="flex items-center space-x-2">
                        <BoltIcon className="h-3 w-3 text-[#4F7C82]" aria-hidden="true" />
                        <span className={`${currentTheme.textPrimary}`}>{t.chargeTime}:</span>
                      </dt>
                      <dd className={`font-semibold ${currentTheme.textPrimary}`}>{car.charge_time_ac}h AC</dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="flex items-center space-x-2">
                        <ScaleIcon className="h-3 w-3 text-[#4F7C82]" aria-hidden="true" />
                        <span className={`${currentTheme.textPrimary}`}>Weight:</span>
                      </dt>
                      <dd className={`font-semibold ${currentTheme.textPrimary}`}>{car.weight_kg} kg</dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="flex items-center space-x-2">
                        <Cog6ToothIcon className="h-3 w-3 text-[#4F7C82]" aria-hidden="true" />
                        <span className={`${currentTheme.textPrimary}`}>Engine:</span>
                      </dt>
                      <dd className={`font-semibold ${currentTheme.textPrimary}`}>{car.engine_displacement}L</dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="flex items-center space-x-2">
                        <WrenchScrewdriverIcon className="h-3 w-3 text-[#4F7C82]" aria-hidden="true" />
                        <span className={`${currentTheme.textPrimary}`}>ICE Power:</span>
                      </dt>
                      <dd className={`font-semibold ${currentTheme.textPrimary}`}>{car.power_hp - (car.electric_motor_power_hp || 0)} HP</dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="flex items-center space-x-2">
                        <BoltIcon className="h-3 w-3 text-[#4F7C82]" aria-hidden="true" />
                        <span className={`${currentTheme.textPrimary}`}>Consumption:</span>
                      </dt>
                      <dd className={`font-semibold ${currentTheme.textPrimary}`}>{car.fuel_consumption} L/100km</dd>
                    </div>
                  </dl>

                  {/* Mobile Accordions */}
                  <div className="sm:hidden mb-4 space-y-2">
                    <MobileAccordion title="Key Features" defaultOpen={true} textColor={currentTheme.textPrimary} iconColor={currentTheme.iconColor}>
                      <dl className="space-y-3 text-sm">
                        <div className="flex items-center justify-between">
                          <dt className="flex items-center space-x-2">
                            <BoltIcon className="h-3 w-3 text-[#4F7C82]" aria-hidden="true" />
                            <span className={`${currentTheme.textPrimary}`}>{t.evRange}:</span>
                          </dt>
                          <dd className={`font-semibold ${currentTheme.textPrimary}`}>{car.ev_range_km} km</dd>
                        </div>
                        <div className="flex items-center justify-between">
                          <dt className="flex items-center space-x-2">
                            <CpuChipIcon className="h-3 w-3 text-[#4F7C82]" aria-hidden="true" />
                            <span className={`${currentTheme.textPrimary}`}>{t.battery}:</span>
                          </dt>
                          <dd className={`font-semibold ${currentTheme.textPrimary}`}>{car.battery_kwh} kWh</dd>
                        </div>
                        <div className="flex items-center justify-between">
                          <dt className="flex items-center space-x-2">
                            <WrenchScrewdriverIcon className="h-3 w-3 text-[#4F7C82]" aria-hidden="true" />
                            <span className={`${currentTheme.textPrimary}`}>{t.totalPower}:</span>
                          </dt>
                          <dd className={`font-semibold ${currentTheme.textPrimary}`}>{car.power_hp} HP</dd>
                        </div>
                        <div className="flex items-center justify-between">
                          <dt className="flex items-center space-x-2">
                            <BoltIcon className="h-3 w-3 text-[#4F7C82]" aria-hidden="true" />
                            <span className={`${currentTheme.textPrimary}`}>{t.chargeTime}:</span>
                          </dt>
                          <dd className={`font-semibold ${currentTheme.textPrimary}`}>{car.charge_time_ac}h AC</dd>
                        </div>
                        <div className="flex items-center justify-between">
                          <dt className="flex items-center space-x-2">
                            <Cog6ToothIcon className="h-3 w-3 text-[#4F7C82]" aria-hidden="true" />
                            <span className={`${currentTheme.textPrimary}`}>Engine:</span>
                          </dt>
                          <dd className={`font-semibold ${currentTheme.textPrimary}`}>{car.engine_displacement}L</dd>
                        </div>
                        <div className="flex items-center justify-between">
                          <dt className="flex items-center space-x-2">
                            <WrenchScrewdriverIcon className="h-3 w-3 text-[#4F7C82]" aria-hidden="true" />
                            <span className={`${currentTheme.textPrimary}`}>ICE Power:</span>
                          </dt>
                          <dd className={`font-semibold ${currentTheme.textPrimary}`}>{car.power_hp - (car.electric_motor_power_hp || 0)} HP</dd>
                        </div>
                        <div className="flex items-center justify-between">
                          <dt className="flex items-center space-x-2">
                            <BoltIcon className="h-3 w-3 text-[#4F7C82]" aria-hidden="true" />
                            <span className={`${currentTheme.textPrimary}`}>Consumption:</span>
                          </dt>
                          <dd className={`font-semibold ${currentTheme.textPrimary}`}>{car.fuel_consumption} L/100km</dd>
                        </div>
                      </dl>
                    </MobileAccordion>

                    <MobileAccordion title="Performance & Efficiency" textColor={currentTheme.textPrimary} iconColor={currentTheme.iconColor}>
                      <div className="space-y-3 text-sm">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <BoltIcon className="h-3 w-3 text-[#4F7C82]" />
                            <span className={`${currentTheme.textPrimary}`}>{t.chargeTime}:</span>
                          </div>
                          <span className={`font-semibold ${currentTheme.textPrimary}`}>{car.charge_time_ac}h AC</span>
                        </div>
                      </div>
                    </MobileAccordion>
                    </div>

                  {/* Actions */}
                  <div className={`pt-4 border-t ${currentTheme.cardBorder}`}>
                    <div className="grid grid-cols-2 gap-2">
                      {/* Top Row */}
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          toggleCarSelection(car)
                        }}
                        className={`px-3 py-2 rounded-full text-xs font-medium transition-colors ${
                          selectedCars.find(c => c.id === car.id)
                          ? 'bg-blue-600 text-white'
                          : buttonStyle
                        }`}
                        aria-label={selectedCars.find(c => c.id === car.id) 
                          ? `Remove ${car.brand} ${car.model} from comparison` 
                          : `Add ${car.brand} ${car.model} to comparison`}
                        role="button"
                        tabIndex={0}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            toggleCarSelection(car)
                          }
                        }}
                      >
                        <PlusIcon className="h-3 w-3 inline mr-1" aria-hidden="true" />
                        {selectedCars.find(c => c.id === car.id) ? t.added : t.compare}
                      </button>
                      <Link
                        href={`/models/${car.slug || car.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className={`px-3 py-2 rounded-full text-xs font-medium ${buttonStyle} transition-colors text-center block`}
                        aria-label={`View details of ${car.brand} ${car.model}`}
                      >
                        <EyeIcon className="h-3 w-3 inline mr-1" aria-hidden="true" />
                        {t.view}
                      </Link>
                      
                      {/* Bottom Row */}
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        toggleFavorite(car.id)
                      }}
                      className="p-2 hover:bg-opacity-20 rounded-lg transition-colors flex items-center justify-center"
                      aria-label={favorites.includes(car.id) 
                        ? `Remove ${car.brand} ${car.model} from favorites` 
                        : `Add ${car.brand} ${car.model} to favorites`}
                      role="button"
                      tabIndex={0}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          toggleFavorite(car.id)
                        }
                      }}
                    >
                      {favorites.includes(car.id) ? (
                        <HeartSolidIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                      ) : (
                        <HeartIcon className="h-5 w-5 text-[#93B1B5] hover:text-red-500" aria-hidden="true" />
                      )}
                    </button>
                      <button
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                          setSelectedCarForSimulator(car)
                          setIsRangeSimulatorOpen(true)
                        }}
                        className={`px-3 py-2 rounded-full text-xs font-medium ${buttonStyle.replace('hover:bg-blue-600', 'hover:bg-green-600')} transition-colors`}
                        aria-label={`Open range simulator for ${car.brand} ${car.model}`}
                        role="button"
                        tabIndex={0}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            setSelectedCarForSimulator(car)
                            setIsRangeSimulatorOpen(true)
                          }
                        }}
                      >
                        <CalculatorIcon className="h-3 w-3 inline mr-1" aria-hidden="true" />
                        Range
                      </button>
                    </div>
                    {/* Update date at very bottom of the card */}
                    <div className={`col-span-2 mt-2 text-[11px] ${selectedTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      {t.update}: {car.last_updated
                        ? new Date(car.last_updated).toLocaleDateString(
                            selectedLanguage === 'de' ? 'de-DE' : selectedLanguage === 'tr' ? 'tr-TR' : selectedLanguage === 'pl' ? 'pl-PL' : 'en-US',
                            { day: '2-digit', month: '2-digit', year: 'numeric' }
                          )
                        : t.dataNotFound}
                    </div>
                  </div>
                </div>
              </Link>
              )
            })}
          </div>
        ) : (
                <div className="space-y-4">
            {displayedCars.map((car, index) => {
              const buttonVariants = [
                `${currentTheme.cardBg} ${currentTheme.textPrimary} hover:bg-blue-600 hover:text-white`,
                `bg-blue-100 text-blue-700 hover:bg-blue-600 hover:text-white dark:bg-blue-900/30 dark:text-blue-300`,
                `bg-green-100 text-green-700 hover:bg-green-600 hover:text-white dark:bg-green-900/30 dark:text-green-300`,
                `bg-cyan-100 text-cyan-700 hover:bg-cyan-600 hover:text-white dark:bg-cyan-900/30 dark:text-cyan-300`
              ]
              const buttonStyle = buttonVariants[index % 4]
              
              // Tüm kartları koyu renk (Tonale stili) yap
              const cardStyle = `${currentTheme.cardBg} border ${currentTheme.cardBorder}`
              
              return (
              <Link key={car.id} href={`/models/${car.slug || car.id}`} className={`${cardStyle} rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-xl hover:scale-102 transition-all duration-300 block group`}>
                <div className="flex items-start space-x-4">
                  {/* Car Image */}
                  <div className="flex-shrink-0">
                    <div className="aspect-[16/9] w-32 h-20 rounded-lg overflow-hidden">
                      <img
                        src={getImageUrl(car.image_url)}
                        alt={`${car.brand} ${car.model} - ${car.year} model PHEV with ${car.ev_range_km}km electric range and ${car.power_hp}HP total power`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        fetchPriority="low"
                        onError={(e) => {
                          e.currentTarget.onerror = null
                          e.currentTarget.src = getImageUrl(null)
                          e.currentTarget.alt = 'Placeholder image for vehicle'
                        }}
                      />
                    </div>
                  </div>

                  {/* Car Info */}
                      <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-[#0B2E33] line-clamp-2 h-14 flex items-center">
                          {car.brand} {car.model} ({car.year})
                        </h3>
                        <div className="flex items-center justify-between mt-1">
                          <div className="flex items-center space-x-2">
                            <span className="badge-secondary">{car.year}</span>
                            <span className="badge-accent">{car.segment}</span>
                            <span className={`text-xs ${selectedTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                              Güncelleme: {new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                            </span>
                          </div>
                          {car.euroncap_rating && (
                            <EuroNCAPStars rating={car.euroncap_rating} size="sm" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Specifications - Desktop */}
                    <dl className="hidden sm:block mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 text-sm">
                      <div className="flex items-center space-x-2">
                        <dt className="flex items-center space-x-2">
                          <BoltIcon className={`h-4 w-4 ${currentTheme.iconColor}`} aria-hidden="true" />
                          <span className={`${currentTheme.textPrimary}`}>{t.evRange}:</span>
                        </dt>
                        <dd className={`font-semibold ${currentTheme.textPrimary}`}>{car.ev_range_km} km</dd>
                        <button
                          onClick={() => {
                            setSelectedCarForSimulator(car)
                            setIsRangeSimulatorOpen(true)
                          }}
                          className="p-1 hover:bg-[#E2E8F0] rounded transition-colors"
                          title="Range Simulator"
                        >
                          <SparklesIcon className="h-3 w-3 text-[#4F7C82]" />
                        </button>
                      </div>
                      <div className="flex items-center space-x-2">
                        <dt className="flex items-center space-x-2">
                          <CpuChipIcon className={`h-4 w-4 ${currentTheme.iconColor}`} aria-hidden="true" />
                          <span className={`${currentTheme.textPrimary}`}>{t.battery}:</span>
                        </dt>
                        <dd className={`font-semibold ${currentTheme.textPrimary}`}>{car.battery_kwh} kWh</dd>
                      </div>
                      <div className="flex items-center space-x-2">
                        <dt className="flex items-center space-x-2">
                          <WrenchScrewdriverIcon className={`h-4 w-4 ${currentTheme.iconColor}`} aria-hidden="true" />
                          <span className={`${currentTheme.textPrimary}`}>{t.totalPower}:</span>
                        </dt>
                        <dd className={`font-semibold ${currentTheme.textPrimary}`}>{car.power_hp} HP</dd>
                      </div>
                      <div className="flex items-center space-x-2">
                        <dt className="flex items-center space-x-2">
                          <BoltIcon className={`h-4 w-4 ${currentTheme.iconColor}`} aria-hidden="true" />
                          <span className={`${currentTheme.textPrimary}`}>{t.chargeTime}:</span>
                        </dt>
                        <dd className={`font-semibold ${currentTheme.textPrimary}`}>{car.charge_time_ac}h AC</dd>
                      </div>
                      <div className="flex items-center space-x-2">
                        <dt className="flex items-center space-x-2">
                          <UserGroupIcon className={`h-4 w-4 ${currentTheme.iconColor}`} aria-hidden="true" />
                          <span className={`${currentTheme.textPrimary}`}>Seats:</span>
                        </dt>
                        <dd className={`font-semibold ${currentTheme.textPrimary}`}>{car.seats}</dd>
                      </div>
                      <div className="flex items-center space-x-2">
                        <dt className="flex items-center space-x-2">
                          <ShieldCheckIcon className={`h-4 w-4 ${currentTheme.iconColor}`} aria-hidden="true" />
                          <span className={`${currentTheme.textPrimary}`}>Warranty:</span>
                        </dt>
                        <dd className={`font-semibold ${currentTheme.textPrimary}`}>{car.warranty_years} years</dd>
                      </div>
                      <div className="flex items-center space-x-2">
                        <dt className="flex items-center space-x-2">
                          <ScaleIcon className={`h-4 w-4 ${currentTheme.iconColor}`} aria-hidden="true" />
                          <span className={`${currentTheme.textPrimary}`}>Weight:</span>
                        </dt>
                        <dd className={`font-semibold ${currentTheme.textPrimary}`}>{car.weight_kg} kg</dd>
                      </div>
                      <div className="flex items-center space-x-2">
                        <dt className="flex items-center space-x-2">
                          <Cog6ToothIcon className={`h-4 w-4 ${currentTheme.iconColor}`} aria-hidden="true" />
                          <span className={`${currentTheme.textPrimary}`}>Engine:</span>
                        </dt>
                        <dd className={`font-semibold ${currentTheme.textPrimary}`}>{car.engine_displacement}L</dd>
                      </div>
                      <div className="flex items-center space-x-2">
                        <dt className="flex items-center space-x-2">
                          <WrenchScrewdriverIcon className={`h-4 w-4 ${currentTheme.iconColor}`} aria-hidden="true" />
                          <span className={`${currentTheme.textPrimary}`}>ICE Power:</span>
                        </dt>
                        <dd className={`font-semibold ${currentTheme.textPrimary}`}>{car.power_hp - (car.electric_motor_power_hp || 0)} HP</dd>
                      </div>
                      <div className="flex items-center space-x-2">
                        <dt className="flex items-center space-x-2">
                          <BoltIcon className={`h-4 w-4 ${currentTheme.iconColor}`} aria-hidden="true" />
                          <span className={`${currentTheme.textPrimary}`}>Consumption:</span>
                        </dt>
                        <dd className={`font-semibold ${currentTheme.textPrimary}`}>{car.fuel_consumption} L/100km</dd>
                      </div>
                    </dl>

                    {/* Mobile Accordions */}
                    <div className="sm:hidden mt-4 space-y-2">
                      <MobileAccordion title="Key Features" defaultOpen={true} textColor={currentTheme.textPrimary} iconColor={currentTheme.iconColor}>
                        <dl className="space-y-3 text-sm">
                          <div className="flex items-center justify-between">
                            <dt className="flex items-center space-x-2">
                              <BoltIcon className={`h-4 w-4 ${currentTheme.iconColor}`} aria-hidden="true" />
                              <span className={`${currentTheme.textPrimary}`}>{t.evRange}:</span>
                            </dt>
                            <dd className={`font-semibold ${currentTheme.textPrimary}`}>{car.ev_range_km} km</dd>
                          </div>
                          <div className="flex items-center justify-between">
                            <dt className="flex items-center space-x-2">
                              <CpuChipIcon className={`h-4 w-4 ${currentTheme.iconColor}`} aria-hidden="true" />
                              <span className={`${currentTheme.textPrimary}`}>{t.battery}:</span>
                            </dt>
                            <dd className={`font-semibold ${currentTheme.textPrimary}`}>{car.battery_kwh} kWh</dd>
                          </div>
                          <div className="flex items-center justify-between">
                            <dt className="flex items-center space-x-2">
                              <WrenchScrewdriverIcon className={`h-4 w-4 ${currentTheme.iconColor}`} aria-hidden="true" />
                              <span className={`${currentTheme.textPrimary}`}>{t.totalPower}:</span>
                            </dt>
                            <dd className={`font-semibold ${currentTheme.textPrimary}`}>{car.power_hp} HP</dd>
                          </div>
                          <div className="flex items-center justify-between">
                            <dt className="flex items-center space-x-2">
                              <BoltIcon className={`h-4 w-4 ${currentTheme.iconColor}`} aria-hidden="true" />
                              <span className={`${currentTheme.textPrimary}`}>{t.chargeTime}:</span>
                            </dt>
                            <dd className={`font-semibold ${currentTheme.textPrimary}`}>{car.charge_time_ac}h AC</dd>
                          </div>
                          <div className="flex items-center justify-between">
                            <dt className="flex items-center space-x-2">
                              <UserGroupIcon className={`h-4 w-4 ${currentTheme.iconColor}`} aria-hidden="true" />
                              <span className={`${currentTheme.textPrimary}`}>Seats:</span>
                            </dt>
                            <dd className={`font-semibold ${currentTheme.textPrimary}`}>{car.seats}</dd>
                          </div>
                          <div className="flex items-center justify-between">
                            <dt className="flex items-center space-x-2">
                              <Cog6ToothIcon className={`h-4 w-4 ${currentTheme.iconColor}`} aria-hidden="true" />
                              <span className={`${currentTheme.textPrimary}`}>Engine:</span>
                            </dt>
                            <dd className={`font-semibold ${currentTheme.textPrimary}`}>{car.engine_displacement}L</dd>
                          </div>
                          <div className="flex items-center justify-between">
                            <dt className="flex items-center space-x-2">
                              <WrenchScrewdriverIcon className={`h-4 w-4 ${currentTheme.iconColor}`} aria-hidden="true" />
                              <span className={`${currentTheme.textPrimary}`}>ICE Power:</span>
                            </dt>
                            <dd className={`font-semibold ${currentTheme.textPrimary}`}>{car.power_hp - (car.electric_motor_power_hp || 0)} HP</dd>
                          </div>
                          <div className="flex items-center justify-between">
                            <dt className="flex items-center space-x-2">
                              <BoltIcon className={`h-4 w-4 ${currentTheme.iconColor}`} aria-hidden="true" />
                              <span className={`${currentTheme.textPrimary}`}>Consumption:</span>
                            </dt>
                            <dd className={`font-semibold ${currentTheme.textPrimary}`}>{car.fuel_consumption} L/100km</dd>
                          </div>
                        </dl>
                      </MobileAccordion>

                      <MobileAccordion title="Performance & Efficiency" textColor={currentTheme.textPrimary} iconColor={currentTheme.iconColor}>
                        <div className="space-y-3 text-sm">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <BoltIcon className={`h-4 w-4 ${currentTheme.iconColor}`} />
                              <span className={`${currentTheme.textPrimary}`}>{t.chargeTime}:</span>
                            </div>
                            <span className={`font-semibold ${currentTheme.textPrimary}`}>{car.charge_time_ac}h AC</span>
                          </div>
                        </div>
                      </MobileAccordion>
                    </div>
                </div>

                  {/* Actions */}
                  <div className="flex-shrink-0 flex items-center justify-center">
                    <div className="grid grid-cols-2 gap-2">
                      {/* Top Row */}
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          toggleCarSelection(car)
                        }}
                        className={`px-3 py-2 rounded-full text-xs font-medium transition-colors ${
                          selectedCars.find(c => c.id === car.id)
                          ? 'bg-blue-600 text-white'
                          : buttonStyle
                        }`}
                      >
                        <PlusIcon className="h-3 w-3 inline mr-1" />
                        {selectedCars.find(c => c.id === car.id) ? t.added : t.compare}
                      </button>
                      <Link
                        href={`/models/${car.slug || car.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className={`px-3 py-2 rounded-full text-xs font-medium ${buttonStyle} transition-colors text-center block`}
                      >
                        <EyeIcon className="h-3 w-3 inline mr-1" />
                        {t.view}
                      </Link>
                      
                      {/* Bottom Row */}
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        toggleFavorite(car.id)
                      }}
                        className="p-2 hover:bg-opacity-20 rounded-lg transition-colors flex items-center justify-center"
                    >
                      {favorites.includes(car.id) ? (
                        <HeartSolidIcon className="h-5 w-5 text-red-500" />
                      ) : (
                        <HeartIcon className="h-5 w-5 text-[#93B1B5] hover:text-red-500" />
                      )}
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                          setSelectedCarForSimulator(car)
                          setIsRangeSimulatorOpen(true)
                        }}
                        className={`px-3 py-2 rounded-full text-xs font-medium ${buttonStyle.replace('hover:bg-blue-600', 'hover:bg-green-600')} transition-colors`}
                      >
                        <CalculatorIcon className="h-3 w-3 inline mr-1" />
                        Range
                    </button>
                    </div>
              </div>
                </div>
              </Link>
              )
            })}
              </div>
            )}

        {/* Load More Pagination Controls (Option 1) */}
        {filteredAndSortedCars.length > visibleCarsCount && (
          <div className="mt-8 mb-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setVisibleCarsCount((prev) => prev + 24)}
              className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2 group cursor-pointer"
            >
              <span>
                {selectedLanguage === 'tr' ? 'Daha Fazla Araç Göster (+24)' : selectedLanguage === 'de' ? 'Mehr Fahrzeuge anzeigen (+24)' : selectedLanguage === 'pl' ? 'Pokaż więcej pojazdów (+24)' : 'Show More Vehicles (+24)'}
              </span>
              <span className="text-xs font-normal opacity-85 px-2 py-0.5 rounded-full bg-blue-700 text-white ml-1">
                {displayedCars.length} / {filteredAndSortedCars.length}
              </span>
            </button>
            <button
              onClick={() => setVisibleCarsCount(filteredAndSortedCars.length)}
              className="w-full sm:w-auto px-6 py-3.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition-all duration-200 text-sm cursor-pointer"
            >
              {selectedLanguage === 'tr' ? `Tümünü Göster (${filteredAndSortedCars.length} Araç)` : selectedLanguage === 'de' ? `Alle anzeigen (${filteredAndSortedCars.length} Fahrzeuge)` : selectedLanguage === 'pl' ? `Pokaż wszystkie (${filteredAndSortedCars.length})` : `Show All (${filteredAndSortedCars.length} Vehicles)`}
            </button>
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

      {/* Recently Viewed Section */}
      {recentlyViewed.length > 0 && (
        <div className={`${currentTheme.background} py-12`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className={`text-2xl font-bold ${currentTheme.textPrimary} mb-6`}>
              Recently Viewed
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {recentlyViewed.map((car) => (
                <Link
                  key={car.id}
                  href={`/models/${car.slug || car.id}`}
                  onClick={() => updateRecentlyViewed(car)}
                  className={`${currentTheme.cardBg} border ${currentTheme.cardBorder} rounded-lg p-3 hover:shadow-lg transition-all duration-200 group`}
                >
                  <div className="aspect-[16/9] w-full rounded-lg overflow-hidden mb-2">
                    <img
                      src={getImageUrl(car.image_url)}
                      alt={`${car.brand} ${car.model}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      loading="lazy"
                    />
                  </div>
                  <div className={`text-xs font-medium ${currentTheme.textPrimary} truncate`}>
                    {car.brand} {car.model}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Latest News Section */}
      <section className={`${currentTheme.background} py-16 w-full max-w-full overflow-x-hidden`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {selectedLanguage === 'tr' ? 'Son PHEV Haberleri' : selectedLanguage === 'de' ? 'Neueste PHEV-Nachrichten' : selectedLanguage === 'pl' ? 'Najnowsze wiadomości PHEV' : 'Latest PHEV News'}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                {selectedLanguage === 'tr' ? 'Avrupa\'daki en güncel plug-in hibrit araç haberleri, incelemeler ve pazar analizleri' : selectedLanguage === 'de' ? 'Neueste Plug-in-Hybrid-Fahrzeugnachrichten, Testberichte und Marktanalysen aus Europa' : selectedLanguage === 'pl' ? 'Najnowsze wiadomości o pojazdach hybrydowych typu plug-in, recenzje i analizy rynkowe z Europy' : 'Latest plug-in hybrid vehicle news, reviews and market analysis from Europe'}
              </p>
            </div>
            <Link
              href={`/blog?lang=${selectedLanguage || 'en'}`}
              className="hidden md:flex items-center text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
            >
              {selectedLanguage === 'tr' ? 'Tüm Haberler' : selectedLanguage === 'de' ? 'Alle Nachrichten' : selectedLanguage === 'pl' ? 'Wszystkie wiadomości' : 'All News'}
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...(blogData as any[])].sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime()).slice(0, 4).map((post) => {
              const blogLocale = selectedLanguage || 'en'
              const postTitle = blogLocale === 'en' ? post.title_en : blogLocale === 'de' ? (post.title_de || post.title_en || post.title) : blogLocale === 'pl' ? (post.title_pl || post.title_en || post.title) : post.title
              const postExcerpt = blogLocale === 'en' ? post.excerpt_en : blogLocale === 'de' ? (post.excerpt_de || post.excerpt_en || post.excerpt) : blogLocale === 'pl' ? (post.excerpt_pl || post.excerpt_en || post.excerpt) : post.excerpt
              const postCategory = blogLocale === 'en' ? post.category_en : blogLocale === 'de' ? (post.category_de || post.category_en || post.category) : blogLocale === 'pl' ? (post.category_pl || post.category_en || post.category) : post.category
              const dateLocale = blogLocale === 'tr' ? 'tr-TR' : blogLocale === 'de' ? 'de-DE' : blogLocale === 'pl' ? 'pl-PL' : 'en-GB'
              
              return (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}?lang=${blogLocale}`}
                  className="group block bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all"
                >
                  <div className="relative h-48">
                    <img
                      src={getImageUrl(post.featured_image)}
                      alt={postTitle}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.onerror = null
                        e.currentTarget.src = getImageUrl(null)
                      }}
                    />
                    <div className="absolute top-3 left-3">
                      <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        {postCategory}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-3">
                      <span>
                        {new Date(post.published_at).toLocaleDateString(dateLocale, {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                      <span className="mx-2">•</span>
                      <span>{post.read_time} {blogLocale === 'tr' ? 'dk' : blogLocale === 'de' ? 'Min' : blogLocale === 'pl' ? 'min' : 'min'} {blogLocale === 'tr' ? 'okuma' : blogLocale === 'de' ? 'Lesen' : blogLocale === 'pl' ? 'czytania' : 'read'}</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                      {postTitle}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 mb-4">
                      {postExcerpt}
                    </p>
                    <div className="flex items-center text-blue-600 dark:text-blue-400 text-sm font-semibold">
                      {blogLocale === 'tr' ? 'Devamını Oku' : blogLocale === 'de' ? 'Weiterlesen' : blogLocale === 'pl' ? 'Czytaj więcej' : 'Read More'}
                      <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>

          <div className="text-center mt-8 md:hidden">
            <Link
              href={`/blog?lang=${selectedLanguage || 'en'}`}
              className="inline-flex items-center text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
            >
              {selectedLanguage === 'tr' ? 'Tüm Haberler' : selectedLanguage === 'de' ? 'Alle Nachrichten' : selectedLanguage === 'pl' ? 'Wszystkie wiadomości' : 'All News'}
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section - SEO Content */}
      <section className={`${currentTheme.background} py-16 w-full max-w-full overflow-x-hidden`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Everything you need to know about plug-in hybrid electric vehicles
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                What is a Plug-in Hybrid Electric Vehicle (PHEV)?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                A PHEV combines a traditional internal combustion engine with an electric motor and a rechargeable battery. 
                You can drive on electric power alone for short distances, then switch to the gasoline engine for longer trips.
              </p>
            </div>
            
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                How far can I drive on electric power alone?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Most PHEVs offer 30-100 km of electric range, depending on the model and battery size. Our range simulator 
                helps you understand real-world performance based on driving conditions and temperature.
              </p>
            </div>
            
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                How long does it take to charge a PHEV?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Charging times vary by model and charger type. Most PHEVs can be fully charged in 2-4 hours using a 
                home wallbox, or 30-60 minutes at a public DC fast charger.
              </p>
            </div>
            
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Are PHEVs more expensive than regular cars?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                PHEVs typically cost more upfront than conventional vehicles, but you can save money on fuel costs and 
                may qualify for government incentives. Our price comparison tool helps you find the best value.
              </p>
            </div>
            
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Which PHEV brands are available in Europe?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                We compare PHEVs from 30 premium brands including BMW, Mercedes-Benz, Audi, Volkswagen, Toyota, 
                Volvo, and many more. All models are available in European markets.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Range Simulator Modal */}
      <RangeSimulator
        baseRange={selectedCarForSimulator?.ev_range_km || 100}
        batteryCapacity={selectedCarForSimulator?.battery_kwh || 15}
        isOpen={isRangeSimulatorOpen}
        onClose={() => setIsRangeSimulatorOpen(false)}
        selectedCar={selectedCarForSimulator}
        simulatorData={selectedCarForSimulator?.simulator_data}
      />

      {/* Suggest Model Form */}
      <SuggestModelForm
        isOpen={isSuggestFormOpen}
        onClose={() => setIsSuggestFormOpen(false)}
      />

      {/* Filter Modal */}
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        filters={filters}
        setFilters={setFilters}
        brands={brands}
        segments={segments}
        onApplyFilters={() => {
          saveFilters()
          setIsFilterModalOpen(false)
        }}
        onClearFilters={clearFilters}
      />

      {/* Compare Info Bar */}
      <CompareInfoBar
        selectedCars={selectedCars}
        onRemoveCar={(carId) => {
          const newSelected = selectedCars.filter(car => car.id !== carId)
          setSelectedCars(newSelected)
          localStorage.setItem('phevs-selected-cars', JSON.stringify(newSelected.map(c => c.id)))
        }}
        onClearAll={() => {
          setSelectedCars([])
          localStorage.removeItem('phevs-selected-cars')
        }}
        isVisible={selectedCars.length > 0}
        language={selectedLanguage as 'en' | 'tr' | 'de' | 'pl'}
      />

      {/* PHEV Guide Popup */}
      <PHEVGuidePopup
        isOpen={isPHEVGuidePopupOpen}
        onClose={closePHEVGuidePopup}
        theme={selectedTheme}
        language={selectedLanguage}
      />

    </div>
  )
}