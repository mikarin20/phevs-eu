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
  CurrencyEuroIcon,
  UserGroupIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'
import carsData from '@/data/cars.json' assert { type: 'json' }
const typedCarsData = carsData as Car[]
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
  price_eur: number
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
type SortOption = 'price-asc' | 'price-desc' | 'range-asc' | 'range-desc' | 'power-asc' | 'power-desc' | 'name-asc'
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

  // Quick Compare karşılaştırmaları
  const comparisons = [
    {
      id: 'tiguan-3008',
      href: '/compare/volkswagen-tiguan-phev-vs-peugeot-3008-phev',
      leftCar: { name: 'VW Tiguan (2025)', image: '/images/cars/brands/volkswagen/tiguan/main.jpg', alt: 'Volkswagen Tiguan', specs: '60km • €40,000' },
      rightCar: { name: 'Peugeot 3008 (2025)', image: '/images/cars/brands/peugeot/3008-plug-in-hybrid/main.jpg', alt: 'Peugeot 3008', specs: '59km • €35,000' }
    },
    {
      id: 'c5-kuga',
      href: '/compare/citroen-c5-aircross-ii-phev-vs-ford-kuga-phev',
      leftCar: { name: 'Citroën C5 Aircross (2025)', image: '/images/cars/brands/citroen/c5-aircross-ii-phev/main.jpg', alt: 'Citroën C5 Aircross', specs: '81km • €35,000' },
      rightCar: { name: 'Ford Kuga (2025)', image: '/images/cars/brands/ford/kuga/main.jpg', alt: 'Ford Kuga', specs: '65km • €40,000' }
    },
    {
      id: 'kodiaq-tiguan',
      href: '/compare/koda-kodiaq-phev-vs-volkswagen-tiguan-phev',
      leftCar: { name: 'Skoda Kodiaq iV (2025)', image: '/images/cars/brands/skoda/kodiaq-phev/main.jpg', alt: 'Skoda Kodiaq iV', specs: '60km • €38,000' },
      rightCar: { name: 'VW Tiguan (2025)', image: '/images/cars/brands/volkswagen/tiguan/main.jpg', alt: 'Volkswagen Tiguan', specs: '60km • €40,000' }
    },
    {
      id: 'mg-3008',
      href: '/compare/mg-hs-ii-1-5t-vs-peugeot-3008-phev',
      leftCar: { name: 'MG HS (2025)', image: '/images/cars/brands/mg/hs-plug-in-hybrid-2025/main.jpg', alt: 'MG HS', specs: '75km • €32,000' },
      rightCar: { name: 'Peugeot 3008 (2025)', image: '/images/cars/brands/peugeot/3008-plug-in-hybrid/main.jpg', alt: 'Peugeot 3008', specs: '59km • €35,000' }
    },
    {
      id: 'golf-308',
      href: '/compare/volkswagen-golf-phev-vs-peugeot-308-phev',
      leftCar: { name: 'VW Golf GTE (2025)', image: '/images/cars/brands/volkswagen/golf/main.jpg', alt: 'Volkswagen Golf GTE', specs: '70km • €35,000' },
      rightCar: { name: 'Peugeot 308 (2025)', image: '/images/cars/brands/peugeot/308-plug-in-hybrid/main.jpg', alt: 'Peugeot 308', specs: '85km • €37,400' }
    },
    {
      id: 'golf-a3',
      href: '/compare/volkswagen-golf-phev-vs-audi-a3-sportback-phev',
      leftCar: { name: 'VW Golf GTE (2025)', image: '/images/cars/brands/volkswagen/golf/main.jpg', alt: 'Volkswagen Golf GTE', specs: '70km • €35,000' },
      rightCar: { name: 'Audi A3 Sportback (2025)', image: '/images/cars/brands/audi/a3-sportback-tfsi-e/main.jpg', alt: 'Audi A3 Sportback', specs: '130km • €44,200' }
    },
    {
      id: 'renault-mg',
      href: '/compare/renault-rafale-phev-vs-mg-hs-ii-1-5t',
      leftCar: { name: 'Renault Rafale (2025)', image: '/images/cars/brands/renault/rafale-plug-in-hybrid/main.png', alt: 'Renault Rafale', specs: '65km • €35,000' },
      rightCar: { name: 'MG HS (2025)', image: '/images/cars/brands/mg/hs-plug-in-hybrid-2025/main.jpg', alt: 'MG HS', specs: '75km • €32,000' }
    },
    {
      id: 'jeep-wrangler-compass',
      href: '/compare/jeep-wrangler-4xe-rubicon-phev-vs-jeep-compass-4xe-240hp-phev',
      leftCar: { name: 'Jeep Wrangler 4xe (2025)', image: '/images/cars/brands/jeep/wrangler-4xe-rubicon/main.jpeg', alt: 'Jeep Wrangler 4xe', specs: '45km • €65,000' },
      rightCar: { name: 'Jeep Compass 4xe (2025)', image: '/images/cars/brands/jeep/compass-4xe/main.jpg', alt: 'Jeep Compass 4xe', specs: '56km • €42,000' }
    },
    {
      id: 'jeep-compass-renegade',
      href: '/compare/jeep-compass-4xe-240hp-phev-vs-jeep-renegade-4xe-240hp-phev',
      leftCar: { name: 'Jeep Compass 4xe (2025)', image: '/images/cars/brands/jeep/compass-4xe/main.jpg', alt: 'Jeep Compass 4xe', specs: '56km • €42,000' },
      rightCar: { name: 'Jeep Renegade 4xe (2025)', image: '/images/cars/brands/jeep/renegade-4xe-240hp/main.jpeg', alt: 'Jeep Renegade 4xe', specs: '42km • €35,000' }
    },
    {
      id: 'kia-mg',
      href: '/compare/kia-niro-ii-2025-vs-mg-hs-ii-1-5t',
      leftCar: { name: 'Kia Niro (2025)', image: '/images/cars/brands/kia/niro-ii-2025/main.jpg', alt: 'Kia Niro', specs: '57km • €40,000' },
      rightCar: { name: 'MG HS (2025)', image: '/images/cars/brands/mg/hs-plug-in-hybrid-2025/main.jpg', alt: 'MG HS', specs: '75km • €32,000' }
    },
    {
      id: 'mg-cupra',
      href: '/compare/mg-hs-ii-1-5t-vs-cupra-formentor-204hp-phev',
      leftCar: { name: 'MG HS (2025)', image: '/images/cars/brands/mg/nowy-hs-plug-in-hybrid/main.jpg', alt: 'MG HS', specs: '75km • €32,000' },
      rightCar: { name: 'Cupra Formentor (2025)', image: '/images/cars/brands/cupra/formentor-204hp-e-hybrid/main.jpg', alt: 'Cupra Formentor', specs: '65km • €42,000' }
    },
    {
      id: 'land-rover-evoque-velar',
      href: '/compare/land-rover-range-rover-evoque-phev-vs-land-rover-range-rover-velar-phev',
      leftCar: { name: 'Range Rover Evoque (2025)', image: '/images/cars/brands/land-rover/range-rover-evoque/main.jpg', alt: 'Range Rover Evoque', specs: '55km • €58,000' },
      rightCar: { name: 'Range Rover Velar (2025)', image: '/images/cars/brands/land-rover/range-rover-velar/main.jpg', alt: 'Range Rover Velar', specs: '53km • €72,000' }
    },
    {
      id: 'land-rover-defender-discovery',
      href: '/compare/land-rover-defender-110-phev-vs-land-rover-discovery-sport-phev',
      leftCar: { name: 'Land Rover Defender (2025)', image: '/images/cars/brands/land-rover/defender-110/main.jpg', alt: 'Land Rover Defender', specs: '43km • €75,000' },
      rightCar: { name: 'Discovery Sport (2025)', image: '/images/cars/brands/land-rover/discovery-sport/main.jpg', alt: 'Discovery Sport', specs: '55km • €52,000' }
    },
    {
      id: 'lexus-nx-rx',
      href: '/compare/lexus-nx-450h-plus-phev-vs-lexus-rx-450h-plus-phev',
      leftCar: { name: 'Lexus NX 450h+ (2025)', image: '/images/cars/brands/lexus/nx-450h-plus-phev/main.jpg', alt: 'Lexus NX 450h+', specs: '76km • €52,000' },
      rightCar: { name: 'Lexus RX 450h+ (2025)', image: '/images/cars/brands/lexus/rx-450h-plus-phev/main.jpg', alt: 'Lexus RX 450h+', specs: '65km • €68,000' }
    },
    {
      id: 'lexus-es-ux',
      href: '/compare/lexus-es-300h-phev-vs-lexus-ux-300e-phev',
      leftCar: { name: 'Lexus ES 300h (2025)', image: '/images/cars/brands/lexus/es-300h-phev/main.jpg', alt: 'Lexus ES 300h', specs: '70km • €55,000' },
      rightCar: { name: 'Lexus UX 300e (2025)', image: '/images/cars/brands/lexus/ux-300e-phev/main.jpg', alt: 'Lexus UX 300e', specs: '55km • €45,000' }
    },
    {
      id: 'peugeot-508-308',
      href: '/compare/peugeot-508-phev-vs-peugeot-308-phev',
      leftCar: { name: 'Peugeot 508 (2025)', image: '/images/cars/brands/peugeot/508-plug-in-hybrid/main.jpg', alt: 'Peugeot 508', specs: '64km • €42,000' },
      rightCar: { name: 'Peugeot 308 (2025)', image: '/images/cars/brands/peugeot/308-plug-in-hybrid/main.jpg', alt: 'Peugeot 308', specs: '85km • €37,400' }
    },
    {
      id: 'peugeot-508-sw-308-sw',
      href: '/compare/peugeot-508-sw-phev-vs-peugeot-308-sw-phev',
      leftCar: { name: 'Peugeot 508 SW (2025)', image: '/images/cars/brands/peugeot/508-sw-plug-in-hybrid/main.jpg', alt: 'Peugeot 508 SW', specs: '64km • €44,000' },
      rightCar: { name: 'Peugeot 308 SW (2025)', image: '/images/cars/brands/peugeot/308-sw-plug-in-hybrid/main.jpg', alt: 'Peugeot 308 SW', specs: '85km • €39,000' }
    },
    {
      id: 'peugeot-508-audi-a3',
      href: '/compare/peugeot-508-phev-vs-audi-a3-sportback-phev',
      leftCar: { name: 'Peugeot 508 (2025)', image: '/images/cars/brands/peugeot/508-plug-in-hybrid/main.jpg', alt: 'Peugeot 508', specs: '64km • €42,000' },
      rightCar: { name: 'Audi A3 Sportback (2025)', image: '/images/cars/brands/audi/a3-sportback-tfsi-e/main.jpg', alt: 'Audi A3 Sportback', specs: '130km • €44,200' }
    },
    {
      id: 'porsche-panamera-cayenne',
      href: '/compare/porsche-panamera-4-phev-vs-porsche-cayenne-phev',
      leftCar: { name: 'Porsche Panamera (2025)', image: '/images/cars/brands/porsche/panamera-panamera-4-e-hybrid/main.jpg', alt: 'Porsche Panamera', specs: '50km • €107,780' },
      rightCar: { name: 'Porsche Cayenne (2025)', image: '/images/cars/brands/porsche/cayenne-cayenne-e-hybrid/main.jpg', alt: 'Porsche Cayenne', specs: '44km • €136,000' }
    },
    {
      id: 'porsche-cayenne-macan',
      href: '/compare/porsche-cayenne-phev-vs-porsche-macan-phev',
      leftCar: { name: 'Porsche Cayenne (2025)', image: '/images/cars/brands/porsche/cayenne-cayenne-e-hybrid/main.jpg', alt: 'Porsche Cayenne', specs: '44km • €136,000' },
      rightCar: { name: 'Porsche Macan (2024)', image: '/images/cars/brands/porsche/macan-macan-e-hybrid/main.jpg', alt: 'Porsche Macan', specs: '61km • €89,000' }
    },
    {
      id: 'renault-rafale-captur',
      href: '/compare/renault-rafale-phev-vs-renault-captur-e-tech-phev',
      leftCar: { name: 'Renault Rafale (2025)', image: '/images/cars/brands/renault/rafale-plug-in-hybrid/main.png', alt: 'Renault Rafale', specs: '65km • €35,000' },
      rightCar: { name: 'Renault Captur E-TECH (2022)', image: '/images/cars/brands/renault/captur-e-tech-phev/main.jpg', alt: 'Renault Captur E-TECH', specs: '50km • €32,000' }
    },
    {
      id: 'seat-leon-sportstourer-hatchback',
      href: '/compare/seat-leon-sportstourer-1-4-e-hybrid-vs-seat-leon-1-5-tsi',
      leftCar: { name: 'SEAT Leon Sportstourer (2025)', image: '/images/cars/brands/seat/leon-iv-sportstourer-14-e-hybrid/main.jpg', alt: 'SEAT Leon Sportstourer', specs: '65km • €35,000' },
      rightCar: { name: 'SEAT Leon Hatchback (2025)', image: '/images/cars/brands/seat/leon-iv-14-e-hybrid/main.jpg', alt: 'SEAT Leon Hatchback', specs: '65km • €33,000' }
    },
   
  
    {
      id: 'skoda-kodiaq-superb',
      href: '/compare/koda-kodiaq-phev-vs-koda-superb-combi-phev',
      leftCar: { name: 'Skoda Kodiaq (2025)', image: '/images/cars/brands/skoda/kodiaq-phev/main.jpg', alt: 'Skoda Kodiaq', specs: '60km • €38,000' },
      rightCar: { name: 'Skoda Superb (2025)', image: '/images/cars/brands/skoda/superb-sedan-phev/main.jpg', alt: 'Skoda Superb', specs: '68km • €35,000' }
    },
    {
      id: 'skoda-superb-combi-sedan',
      href: '/compare/koda-superb-combi-phev-vs-koda-superb-sedan-phev',
      leftCar: { name: 'Skoda Superb Combi (2025)', image: '/images/cars/brands/skoda/superb-combi-phev/main.png', alt: 'Skoda Superb Combi', specs: '65km • €36,000' },
      rightCar: { name: 'Skoda Superb (2025)', image: '/images/cars/brands/skoda/superb-sedan-phev/main.jpg', alt: 'Skoda Superb', specs: '68km • €35,000' }
    },
    {
      id: 'skoda-kodiaq-vw-tiguan',
      href: '/compare/koda-kodiaq-phev-vs-volkswagen-tiguan-phev',
      leftCar: { name: 'Skoda Kodiaq (2025)', image: '/images/cars/brands/skoda/kodiaq-phev/main.jpg', alt: 'Skoda Kodiaq', specs: '60km • €38,000' },
      rightCar: { name: 'VW Tiguan (2025)', image: '/images/cars/brands/volkswagen/tiguan/main.jpg', alt: 'Volkswagen Tiguan', specs: '60km • €40,000' }
    },
    {
      id: 'suzuki-across-toyota-rav4',
      href: '/compare/suzuki-across-phev-vs-toyota-rav4-phev',
      leftCar: { name: 'Suzuki Across (2025)', image: '/images/cars/brands/suzuki/across-phev/main.jpg', alt: 'Suzuki Across', specs: '75km • €45,000' },
      rightCar: { name: 'Toyota RAV4 (2025)', image: '/images/cars/brands/toyota/rav4-plug-in-hybrid/main.jpg', alt: 'Toyota RAV4', specs: '65km • €42,000' }
    },
    {
      id: 'suzuki-across-hyundai-tucson',
      href: '/compare/suzuki-across-phev-vs-hyundai-tucson-iv-facelift-268hp-phev',
      leftCar: { name: 'Suzuki Across (2025)', image: '/images/cars/brands/suzuki/across-phev/main.jpg', alt: 'Suzuki Across', specs: '75km • €45,000' },
      rightCar: { name: 'Hyundai Tucson (2025)', image: '/images/cars/brands/hyundai/tucson-iv-facelift-2024-268hp-phev/main.jpg', alt: 'Hyundai Tucson', specs: '65km • €45,000' }
    },
    {
      id: 'toyota-rav4-c-hr',
      href: '/compare/toyota-rav4-phev-vs-toyota-c-hr-phev',
      leftCar: { name: 'Toyota RAV4 (2025)', image: '/images/cars/brands/toyota/rav4-plug-in-hybrid/main.jpg', alt: 'Toyota RAV4', specs: '75km • €42,000' },
      rightCar: { name: 'Toyota C-HR (2025)', image: '/images/cars/brands/toyota/c-hr-plug-in-hybrid/main.jpg', alt: 'Toyota C-HR', specs: '66km • €32,000' }
    },
    {
      id: 'toyota-prius-crown',
      href: '/compare/toyota-prius-phev-vs-toyota-crown-phev',
      leftCar: { name: 'Toyota Prius (2025)', image: '/images/cars/brands/toyota/prius-plug-in-hybrid/main.jpg', alt: 'Toyota Prius', specs: '65km • €35,000' },
      rightCar: { name: 'Toyota Crown (2025)', image: '/images/cars/brands/toyota/crown-phev/main.jpg', alt: 'Toyota Crown', specs: '70km • €55,000' }
    },
    {
      id: 'toyota-rav4-suzuki-across',
      href: '/compare/toyota-rav4-phev-vs-suzuki-across-phev',
      leftCar: { name: 'Toyota RAV4 (2025)', image: '/images/cars/brands/toyota/rav4-plug-in-hybrid/main.jpg', alt: 'Toyota RAV4', specs: '75km • €42,000' },
      rightCar: { name: 'Suzuki Across (2025)', image: '/images/cars/brands/suzuki/across-phev/main.jpg', alt: 'Suzuki Across', specs: '75km • €45,000' }
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
    yearRange: [2020, 2025],
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
    yearRange: [2020, 2025],
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
      sortBy: (['price-asc','price-desc','range-asc','range-desc','power-asc','power-desc','name-asc'] as SortOption[]).includes(raw.sortBy)
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

    const [minPrice, maxPrice] = getPair(filters?.priceRange as number[], [0, 150000])
    const [minRange, maxRange] = getPair(filters?.rangeRange as number[], [0, 200])
    const [minFuel, maxFuel] = getPair(filters?.fuelConsumption as number[], [0, 10])
    const [minPower, maxPower] = getPair(filters?.powerRange as number[], [0, 500])
    const [minYear, maxYear] = getPair(filters?.yearRange as number[], [2020, 2025])
    const [minEmission, maxEmission] = getPair(filters?.emissionRange as number[], [0, 150])

    let filtered = cars.filter(car => {
      const normalizedSearchTerm = normalizeText(searchTerm)
      const normalizedBrand = normalizeText(car.brand)
      const normalizedModel = normalizeText(car.model)
      
      const matchesSearch = normalizedSearchTerm === '' || 
        normalizedBrand.includes(normalizedSearchTerm) || 
        normalizedModel.includes(normalizedSearchTerm)
      
      const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(car.brand)
      
      const matchesSegment = !filters.segment || car.segment === filters.segment
      
      const matchesPrice = car.price_eur >= minPrice && car.price_eur <= maxPrice
      
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
      


      return matchesSearch && matchesBrand && matchesSegment && matchesPrice && matchesRange && 
        matchesFuel && matchesBatteryArchitecture && matchesBatteryChemistry && matchesChargingType && 
        matchesPowerRange && matchesYearRange && matchesEmissionRange
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
      yearRange: [2020, 2025],
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
      heroTitle: "Europe's Most Comprehensive PHEV Comparison Platform",
      heroDescription: 'Compare 124 plug-in hybrid electric vehicles from 30 premium brands. Find the perfect PHEV for your lifestyle.',
      phevModels: 'PHEV Models',
      premiumBrands: 'Premium Brands',
      vehicleSegments: 'Vehicle Segments',
      realWorldRangeData: 'Real-world Range Data',
      priceComparison: 'Price Comparison',
      technicalSpecifications: 'Technical Specifications',
      quickCompareTitle: 'Quick Compare Popular Models',
      quickCompareDescription: 'Compare the most popular PHEV models side by side',
      faq: {
        title: 'All You Need to Know About PHEV'
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
      heroTitle: 'Europas umfassendste PHEV-Vergleichsplattform',
      heroDescription: 'Vergleichen Sie 124 Plug-in-Hybrid-Elektrofahrzeuge von 30 Premium-Marken. Finden Sie das perfekte PHEV für Ihren Lebensstil.',
      phevModels: 'PHEV-Modelle',
      premiumBrands: 'Premium-Marken',
      vehicleSegments: 'Fahrzeugsegmente',
      realWorldRangeData: 'Realistische Reichweitendaten',
      priceComparison: 'Preisvergleich',
      technicalSpecifications: 'Technische Spezifikationen',
      quickCompareTitle: 'Schnellvergleich beliebter Modelle',
      quickCompareDescription: 'Vergleichen Sie die beliebtesten PHEV-Modelle nebeneinander',
      faq: {
        title: 'Alles was Sie über PHEV wissen müssen'
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
      heroTitle: 'Avrupa\'nın En Kapsamlı PHEV Karşılaştırma Platformu',
      heroDescription: '30 premium markadan 124 plug-in hibrit elektrikli aracı karşılaştırın. Yaşam tarzınıza uygun mükemmel PHEV\'i bulun.',
      phevModels: 'PHEV Modelleri',
      premiumBrands: 'Premium Markalar',
      vehicleSegments: 'Araç Segmentleri',
      realWorldRangeData: 'Gerçek Dünya Menzil Verileri',
      priceComparison: 'Fiyat Karşılaştırması',
      technicalSpecifications: 'Teknik Özellikler',
      quickCompareTitle: 'Popüler Modelleri Hızlı Karşılaştır',
      quickCompareDescription: 'En popüler PHEV modellerini yan yana karşılaştırın',
      faq: {
        title: 'PHEV Hakkında Bilmeniz Gereken Her Şey'
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
      heroTitle: 'Najbardziej kompleksowa europejska platforma porównawcza PHEV',
      heroDescription: 'Porównaj 124 hybrydowych pojazdów elektrycznych plug-in od 30 premium marek. Znajdź idealny PHEV dla swojego stylu życia.',
      phevModels: 'Modele PHEV',
      premiumBrands: 'Marki Premium',
      vehicleSegments: 'Segmenty Pojazdów',
      realWorldRangeData: 'Dane rzeczywistego zasięgu',
      priceComparison: 'Porównanie cen',
      technicalSpecifications: 'Specyfikacje techniczne',
      quickCompareTitle: 'Szybkie porównanie popularnych modeli',
      quickCompareDescription: 'Porównaj najpopularniejsze modele PHEV obok siebie',
      faq: {
        title: 'Wszystko co musisz wiedzieć o PHEV'
      }
    }
  }

  const currentTheme = themes[selectedTheme as keyof typeof themes]
  const t = translations[selectedLanguage as keyof typeof translations]

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
    "url": "https://phevs.eu",
    "description": "Europe's most comprehensive plug-in hybrid vehicle comparison platform. Compare 124 PHEV models from 30 brands.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://phevs.eu?search={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "PHEVs.eu",
      "url": "https://phevs.eu",
      "logo": {
        "@type": "ImageObject",
        "url": "https://phevs.eu/images/logo.png",
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
          "offers": {
            "@type": "Offer",
            "price": car.price_eur,
            "priceCurrency": "EUR",
            "availability": "https://schema.org/InStock",
            "seller": {
              "@type": "Organization",
              "name": car.brand
            },
            "validFrom": new Date().toISOString().split('T')[0],
            "priceValidUntil": new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0]
          },
          "url": `https://phevs.eu/models/${car.slug || car.id}`,
          "image": car.image_url,
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
    <div className={`min-h-screen ${selectedTheme === 'dark' ? 'bg-slate-900' : 'bg-gray-200'}`}>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {/* Header */}
      <header className={`${currentTheme.headerBg} border-b ${currentTheme.cardBorder} sticky top-0 z-50 backdrop-blur-md bg-opacity-95`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo ve Brand */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <HybridLogo size="md" className="text-slate-700 dark:text-slate-200" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                </div>
                <div className="flex flex-col">
                  <h1 className={`text-3xl font-bold ${currentTheme.headerText} tracking-tight`}>PHEVs.eu</h1>
                  <span className={`text-sm ${currentTheme.textSecondary} font-medium`}>Europe's PHEV Comparison Platform</span>
                </div>
              </div>
            </div>

            {/* Center Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <a href="/compare" className={`text-sm font-semibold ${currentTheme.textPrimary} hover:text-blue-600 transition-colors`}>
                Compare Vehicles
              </a>
              <a href="/brands" className={`text-sm font-semibold ${currentTheme.textPrimary} hover:text-blue-600 transition-colors`}>
                Brands
              </a>
              <a href="/segments" className={`text-sm font-semibold ${currentTheme.textPrimary} hover:text-blue-600 transition-colors`}>
                Segments
              </a>
              <a href="/faq" className={`text-sm font-semibold ${currentTheme.textPrimary} hover:text-blue-600 transition-colors`}>
                FAQ
              </a>
            </div>

            {/* Right Side Controls */}
            <div className="flex items-center space-x-3">
              {/* Language Selector */}
              <div className="flex items-center space-x-1 bg-gray-100 dark:bg-slate-800 rounded-lg p-1">
                {[
                  { code: 'en', name: 'English', flag: 'gb' },
                  { code: 'de', name: 'Deutsch', flag: 'de' },
                  { code: 'tr', name: 'Türkçe', flag: 'tr' },
                  { code: 'pl', name: 'Polski', flag: 'pl' }
                ].map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setSelectedLanguage(lang.code)
                      localStorage.setItem('phevs-language', lang.code)
                      window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang.code } }))
                    }}
                    className={`p-2 rounded-md transition-all duration-200 ${
                      selectedLanguage === lang.code
                        ? 'bg-white dark:bg-slate-700 shadow-sm'
                        : 'hover:bg-white/50 dark:hover:bg-slate-700/50'
                    }`}
                    title={lang.name}
                    aria-label={lang.name}
                  >
                    <span className={`fi fi-${lang.flag}`} style={{ fontSize: '0.875rem' }}></span>
                  </button>
                ))}
              </div>

              {/* Theme Toggle */}
              <div className="flex items-center bg-gray-100 dark:bg-slate-800 rounded-lg p-1">
                {Object.entries(themes).map(([key, theme]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedTheme(key)}
                    className={`p-2 rounded-md transition-all duration-200 ${
                      selectedTheme === key
                        ? 'bg-white dark:bg-slate-700 shadow-sm'
                        : 'hover:bg-white/50 dark:hover:bg-slate-700/50'
                    }`}
                    title={theme.name}
                  >
                    <span className="text-sm">{key === 'light' ? '☀️' : '🌙'}</span>
                  </button>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="hidden sm:flex items-center space-x-2">
                <button
                  onClick={() => setIsSuggestFormOpen(true)}
                  className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Suggest Model
                </button>
                <a
                  href="/faq"
                  className="px-6 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                >
                  PHEV Guide
                </a>
              </div>

              {/* Mobile Menu Button */}
              <button className="lg:hidden p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Modern Design */}
      <section className={`py-12 ${selectedTheme === 'dark' ? 'bg-slate-900' : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span>Europe's Most Comprehensive PHEV Platform</span>
            </div>
            
            <h2 className={`text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 ${selectedTheme === 'dark' ? 'text-white' : 'text-gray-900'} tracking-tight`}>
              {t.heroTitle}
            </h2>
            <p className={`text-lg sm:text-xl mb-8 max-w-3xl mx-auto ${selectedTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
              {t.heroDescription}
            </p>
            
            {/* Modern Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
              <div className={`text-center p-6 rounded-2xl ${selectedTheme === 'dark' ? 'bg-slate-800/50 backdrop-blur-sm border border-slate-700' : 'bg-white/70 backdrop-blur-sm border border-white/20'} shadow-xl`}>
                <div className={`text-3xl sm:text-4xl font-bold mb-2 ${selectedTheme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>87</div>
                <div className={`text-sm font-semibold ${selectedTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{t.phevModels}</div>
                <div className={`text-xs mt-1 ${selectedTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Plug-in Hybrid Models</div>
              </div>
              <div className={`text-center p-6 rounded-2xl ${selectedTheme === 'dark' ? 'bg-slate-800/50 backdrop-blur-sm border border-slate-700' : 'bg-white/70 backdrop-blur-sm border border-white/20'} shadow-xl`}>
                <div className={`text-3xl sm:text-4xl font-bold mb-2 ${selectedTheme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>28</div>
                <div className={`text-sm font-semibold ${selectedTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{t.premiumBrands}</div>
                <div className={`text-xs mt-1 ${selectedTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Premium Brands</div>
              </div>
              <div className={`text-center p-6 rounded-2xl ${selectedTheme === 'dark' ? 'bg-slate-800/50 backdrop-blur-sm border border-slate-700' : 'bg-white/70 backdrop-blur-sm border border-white/20'} shadow-xl`}>
                <div className={`text-3xl sm:text-4xl font-bold mb-2 ${selectedTheme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`}>7</div>
                <div className={`text-sm font-semibold ${selectedTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{t.vehicleSegments}</div>
                <div className={`text-xs mt-1 ${selectedTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Vehicle Segments</div>
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

      {/* Quick Compare Section */}
      <section className={`py-6 ${selectedTheme === 'dark' ? 'bg-slate-800' : 'bg-white'}`}>
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
            
            <div id="compare-slider" className="overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory">
              <div className="flex space-x-6 pb-4" style={{ width: 'max-content' }}>
              {shuffledComparisons.map((comparison) => (
                <Link key={comparison.id} href={comparison.href} className="group flex-shrink-0">
                  <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200 dark:border-slate-700 overflow-hidden w-80 snap-start">
                    <div className="grid grid-cols-2 gap-0">
                      <div className="relative h-32">
                        <img
                          src={comparison.leftCar.image}
                          alt={comparison.leftCar.alt}
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
                          loading="lazy"
                          onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/images/placeholder-car.jpg' }}
                        />
                      </div>
                      <div className="relative h-32">
                        <img
                          src={comparison.rightCar.image}
                          alt={comparison.rightCar.alt}
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
                          loading="lazy"
                          onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/images/placeholder-car.jpg' }}
                        />
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold text-sm text-gray-900 dark:text-white">{comparison.leftCar.name}</h4>
                        <h4 className="font-semibold text-sm text-gray-900 dark:text-white">{comparison.rightCar.name}</h4>
                      </div>
                      <div className="flex justify-between items-center text-xs text-gray-600 dark:text-gray-300 mb-3">
                        <span>{comparison.leftCar.specs}</span>
                        <span>{comparison.rightCar.specs}</span>
                      </div>
                      <div className="flex items-center justify-center text-xs text-blue-600 dark:text-blue-400">
                        <span>Compare These Models</span>
                        <ArrowsUpDownIcon className="h-3 w-3 ml-1" />
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
      <div className="fixed top-0 left-0 right-0 z-50 sm:hidden bg-white border-b border-gray-200 shadow-lg">
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
                onClick={() => setIsMobileLanguageDropdownOpen(!isMobileLanguageDropdownOpen)}
                className="flex items-center justify-center space-x-1 py-2 px-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors w-full"
                aria-label="Dil seçici"
              >
                <span className={`fi fi-${selectedLanguage === 'en' ? 'gb' : selectedLanguage === 'de' ? 'de' : selectedLanguage === 'tr' ? 'tr' : 'pl'}`} style={{ fontSize: '0.875rem' }}></span>
                <ChevronDownIcon className="h-3 w-3" />
              </button>
              
              {isMobileLanguageDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-32">
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
                      onClick={() => {
                        setSelectedLanguage(lang.code)
                        localStorage.setItem('phevs-language', lang.code)
                        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang.code } }))
                        setIsMobileLanguageDropdownOpen(false)
                      }}
                      className={`w-full flex items-center space-x-2 px-3 py-2 text-left hover:bg-gray-50 transition-colors ${
                        selectedLanguage === lang.code ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                      }`}
                      aria-label={lang.name}
                    >
                      <span className={`fi fi-${lang.flag}`} style={{ fontSize: '0.875rem' }}></span>
                      <span className="text-xs">{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={() => setIsSuggestFormOpen(true)}
              className="flex items-center justify-center space-x-1 py-2 px-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <PlusIcon className="h-4 w-4" />
              <span className="text-xs">{t.suggestModel}</span>
            </button>
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
              <span className="text-xs">Karşılaştır ({selectedCars.length})</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 z-50 sm:hidden bg-white border-t border-gray-200 shadow-lg">
        <div className="grid grid-cols-2 gap-1 p-2">
          <button
            onClick={() => setIsFilterModalOpen(true)}
            className="flex items-center justify-center space-x-1 py-2 px-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <FunnelIcon className="h-4 w-4" />
            <span className="text-sm">Filtrele</span>
          </button>
          <button
            onClick={() => {
              if (selectedCars.length === 0) {
                alert('Lütfen önce karşılaştırmak için araç seçin')
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
            <span className="text-sm">Karşılaştır ({selectedCars.length})</span>
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
              <span className="font-medium">Filtrele</span>
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
                <option value="price-asc">{t.priceAsc}</option>
                <option value="price-desc">{t.priceDesc}</option>
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
        </div>
      </div>


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
          <div className={`text-xs ${selectedTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            Brands: [{selectedBrands.join(', ')}] (Count: {selectedBrands.length}), Segment: {filters.segment || 'All'}, Search: "{searchTerm}", Battery: {filters.batteryArchitecture || 'All'}/{filters.batteryChemistry || 'All'}, Filtered Count: {filteredAndSortedCars.length}, Total Cars: {cars.length}
              </div>
            </div>

        {/* Cars List/Grid */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3">
            {filteredAndSortedCars.map((car, index) => {
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
                        src={car.image_url}
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
                          e.currentTarget.src = '/images/placeholder-car.jpg'
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
                    <div className="flex items-center space-x-2">
                      {car.data_status?.price === 'verified' && car.price_eur ? (
                        <div className={`text-xl font-bold ${currentTheme.textPrimary}`}>
                          From €{car.price_eur.toLocaleString()}
                        </div>
                      ) : null}
                      {car.data_status?.price === 'verified' && (
                        <div className="relative group">
                          <InformationCircleIcon className="h-4 w-4 text-slate-400 cursor-help" />
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-3 py-1 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                            Verified price
                          </div>
                        </div>
                      )}
                    </div>
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
                            {car.data_status.price === 'verified' && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                {selectedLanguage==='tr'?'Doğrulanmış Fiyat':'Verified Price'}
                              </span>
                            )}
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
                  <div className="hidden sm:block space-y-1 text-xs mb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <BoltIcon className="h-3 w-3 text-[#4F7C82]" />
                        <span className={`${currentTheme.textPrimary}`}>{t.evRange}:</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`font-semibold ${currentTheme.textPrimary}`}>{car.ev_range_km} km</span>
                      </div>
                    </div>

                    {/* Update date moved to very bottom under action buttons */}
                      <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <CpuChipIcon className="h-3 w-3 text-[#4F7C82]" />
                        <span className={`${currentTheme.textPrimary}`}>{t.battery}:</span>
                      </div>
                      <span className={`font-semibold ${currentTheme.textPrimary}`}>{car.battery_kwh} kWh</span>
                        </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <WrenchScrewdriverIcon className="h-3 w-3 text-[#4F7C82]" />
                        <span className={`${currentTheme.textPrimary}`}>{t.totalPower}:</span>
                      </div>
                      <span className={`font-semibold ${currentTheme.textPrimary}`}>{car.power_hp} HP</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <BoltIcon className="h-3 w-3 text-[#4F7C82]" />
                        <span className={`${currentTheme.textPrimary}`}>{t.chargeTime}:</span>
                      </div>
                      <span className={`font-semibold ${currentTheme.textPrimary}`}>{car.charge_time_ac}h AC</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <ScaleIcon className="h-3 w-3 text-[#4F7C82]" />
                        <span className={`${currentTheme.textPrimary}`}>Weight:</span>
                      </div>
                      <span className={`font-semibold ${currentTheme.textPrimary}`}>{car.weight_kg} kg</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Cog6ToothIcon className="h-3 w-3 text-[#4F7C82]" />
                        <span className={`${currentTheme.textPrimary}`}>Engine:</span>
                      </div>
                      <span className={`font-semibold ${currentTheme.textPrimary}`}>{car.engine_displacement}L</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <WrenchScrewdriverIcon className="h-3 w-3 text-[#4F7C82]" />
                        <span className={`${currentTheme.textPrimary}`}>ICE Power:</span>
                      </div>
                      <span className={`font-semibold ${currentTheme.textPrimary}`}>{car.power_hp - (car.electric_motor_power_hp || 0)} HP</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <BoltIcon className="h-3 w-3 text-[#4F7C82]" />
                        <span className={`${currentTheme.textPrimary}`}>Fuel Consumption:</span>
                      </div>
                      <span className={`font-semibold ${currentTheme.textPrimary}`}>{car.fuel_consumption}L/100km</span>
                    </div>

                    </div>

                  {/* Mobile Accordions */}
                  <div className="sm:hidden mb-4 space-y-2">
                    <MobileAccordion title="Key Features" defaultOpen={true} textColor={currentTheme.textPrimary} iconColor={currentTheme.iconColor}>
                      <div className="space-y-3 text-sm">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <BoltIcon className="h-3 w-3 text-[#4F7C82]" />
                            <span className={`${currentTheme.textPrimary}`}>{t.evRange}:</span>
                          </div>
                          <span className={`font-semibold ${currentTheme.textPrimary}`}>{car.ev_range_km} km</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <CpuChipIcon className="h-3 w-3 text-[#4F7C82]" />
                            <span className={`${currentTheme.textPrimary}`}>{t.battery}:</span>
                          </div>
                          <span className={`font-semibold ${currentTheme.textPrimary}`}>{car.battery_kwh} kWh</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <WrenchScrewdriverIcon className="h-3 w-3 text-[#4F7C82]" />
                            <span className={`${currentTheme.textPrimary}`}>{t.totalPower}:</span>
                          </div>
                          <span className={`font-semibold ${currentTheme.textPrimary}`}>{car.power_hp} HP</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <BoltIcon className="h-3 w-3 text-[#4F7C82]" />
                            <span className={`${currentTheme.textPrimary}`}>{t.chargeTime}:</span>
                          </div>
                          <span className={`font-semibold ${currentTheme.textPrimary}`}>{car.charge_time_ac}h AC</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Cog6ToothIcon className="h-3 w-3 text-[#4F7C82]" />
                            <span className={`${currentTheme.textPrimary}`}>Engine:</span>
                          </div>
                          <span className={`font-semibold ${currentTheme.textPrimary}`}>{car.engine_displacement}L</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <WrenchScrewdriverIcon className="h-3 w-3 text-[#4F7C82]" />
                            <span className={`${currentTheme.textPrimary}`}>ICE Power:</span>
                          </div>
                          <span className={`font-semibold ${currentTheme.textPrimary}`}>{car.power_hp - (car.electric_motor_power_hp || 0)} HP</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <BoltIcon className="h-3 w-3 text-[#4F7C82]" />
                            <span className={`${currentTheme.textPrimary}`}>Fuel Consumption:</span>
                          </div>
                          <span className={`font-semibold ${currentTheme.textPrimary}`}>{car.fuel_consumption}L/100km</span>
                        </div>
                      </div>
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
            {filteredAndSortedCars.map((car, index) => {
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
                        src={car.image_url}
                        alt={`${car.brand} ${car.model} - ${car.year} model PHEV with ${car.ev_range_km}km electric range and ${car.power_hp}HP total power`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        fetchPriority="low"
                        onError={(e) => {
                          e.currentTarget.src = '/images/placeholder-car.jpg'
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
                      <div className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          {car.data_status?.price === 'verified' && car.price_eur ? (
                            <div className={`text-xl font-bold ${currentTheme.textPrimary}`}>
                              From €{car.price_eur.toLocaleString()}
                            </div>
                          ) : null}
                          {car.data_status?.price === 'verified' && (
                            <div className="relative group">
                              <InformationCircleIcon className="h-4 w-4 text-slate-400 cursor-help" />
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-3 py-1 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                                Verified price
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Specifications - Desktop */}
                    <div className="hidden sm:block mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 text-sm">
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
                          <SparklesIcon className="h-3 w-3 text-[#4F7C82]" />
                      </button>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CpuChipIcon className={`h-4 w-4 ${currentTheme.iconColor}`} />
                        <span className={`${currentTheme.textPrimary}`}>{t.battery}:</span>
                        <span className={`font-semibold ${currentTheme.textPrimary}`}>{car.battery_kwh} kWh</span>
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
                        <CurrencyEuroIcon className={`h-4 w-4 ${currentTheme.iconColor}`} />
                        <span className={`${currentTheme.textPrimary}`}>{t.price}:</span>
                        <span className={`font-semibold ${currentTheme.textPrimary}`}>€{car.price_eur?.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <UserGroupIcon className={`h-4 w-4 ${currentTheme.iconColor}`} />
                        <span className={`${currentTheme.textPrimary}`}>Seats:</span>
                        <span className={`font-semibold ${currentTheme.textPrimary}`}>{car.seats}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <ShieldCheckIcon className={`h-4 w-4 ${currentTheme.iconColor}`} />
                        <span className={`${currentTheme.textPrimary}`}>Warranty:</span>
                        <span className={`font-semibold ${currentTheme.textPrimary}`}>{car.warranty_years} years</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <ScaleIcon className={`h-4 w-4 ${currentTheme.iconColor}`} />
                        <span className={`${currentTheme.textPrimary}`}>Weight:</span>
                        <span className={`font-semibold ${currentTheme.textPrimary}`}>{car.weight_kg} kg</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Cog6ToothIcon className={`h-4 w-4 ${currentTheme.iconColor}`} />
                        <span className={`${currentTheme.textPrimary}`}>Engine:</span>
                        <span className={`font-semibold ${currentTheme.textPrimary}`}>{car.engine_displacement}L</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <WrenchScrewdriverIcon className={`h-4 w-4 ${currentTheme.iconColor}`} />
                        <span className={`${currentTheme.textPrimary}`}>ICE Power:</span>
                        <span className={`font-semibold ${currentTheme.textPrimary}`}>{car.power_hp - (car.electric_motor_power_hp || 0)} HP</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <BoltIcon className={`h-4 w-4 ${currentTheme.iconColor}`} />
                        <span className={`${currentTheme.textPrimary}`}>Fuel Consumption:</span>
                        <span className={`font-semibold ${currentTheme.textPrimary}`}>{car.fuel_consumption}L/100km</span>
                      </div>
                    </div>

                    {/* Mobile Accordions */}
                    <div className="sm:hidden mt-4 space-y-2">
                      <MobileAccordion title="Key Features" defaultOpen={true} textColor={currentTheme.textPrimary} iconColor={currentTheme.iconColor}>
                        <div className="space-y-3 text-sm">
                          <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                              <BoltIcon className={`h-4 w-4 ${currentTheme.iconColor}`} />
                              <span className={`${currentTheme.textPrimary}`}>{t.evRange}:</span>
                      </div>
                            <span className={`font-semibold ${currentTheme.textPrimary}`}>{car.ev_range_km} km</span>
                    </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <CpuChipIcon className={`h-4 w-4 ${currentTheme.iconColor}`} />
                              <span className={`${currentTheme.textPrimary}`}>{t.battery}:</span>
                            </div>
                            <span className={`font-semibold ${currentTheme.textPrimary}`}>{car.battery_kwh} kWh</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <WrenchScrewdriverIcon className={`h-4 w-4 ${currentTheme.iconColor}`} />
                              <span className={`${currentTheme.textPrimary}`}>{t.totalPower}:</span>
                            </div>
                            <span className={`font-semibold ${currentTheme.textPrimary}`}>{car.power_hp} HP</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <BoltIcon className={`h-4 w-4 ${currentTheme.iconColor}`} />
                              <span className={`${currentTheme.textPrimary}`}>{t.chargeTime}:</span>
                            </div>
                            <span className={`font-semibold ${currentTheme.textPrimary}`}>{car.charge_time_ac}h AC</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <CurrencyEuroIcon className={`h-4 w-4 ${currentTheme.iconColor}`} />
                              <span className={`${currentTheme.textPrimary}`}>{t.price}:</span>
                            </div>
                            <span className={`font-semibold ${currentTheme.textPrimary}`}>€{car.price_eur?.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <UserGroupIcon className={`h-4 w-4 ${currentTheme.iconColor}`} />
                              <span className={`${currentTheme.textPrimary}`}>Seats:</span>
                            </div>
                            <span className={`font-semibold ${currentTheme.textPrimary}`}>{car.seats}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Cog6ToothIcon className={`h-4 w-4 ${currentTheme.iconColor}`} />
                              <span className={`${currentTheme.textPrimary}`}>Engine:</span>
                            </div>
                            <span className={`font-semibold ${currentTheme.textPrimary}`}>{car.engine_displacement}L</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <WrenchScrewdriverIcon className={`h-4 w-4 ${currentTheme.iconColor}`} />
                              <span className={`${currentTheme.textPrimary}`}>ICE Power:</span>
                            </div>
                            <span className={`font-semibold ${currentTheme.textPrimary}`}>{car.power_hp - (car.electric_motor_power_hp || 0)} HP</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <BoltIcon className={`h-4 w-4 ${currentTheme.iconColor}`} />
                              <span className={`${currentTheme.textPrimary}`}>Fuel Consumption:</span>
                            </div>
                            <span className={`font-semibold ${currentTheme.textPrimary}`}>{car.fuel_consumption}L/100km</span>
                          </div>
                        </div>
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
                      src={car.image_url}
                      alt={`${car.brand} ${car.model}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      loading="lazy"
                    />
                  </div>
                  <div className={`text-xs font-medium ${currentTheme.textPrimary} truncate`}>
                    {car.brand} {car.model}
                  </div>
                  {car.data_status?.price === 'verified' && car.price_eur ? (
                    <div className={`text-xs ${currentTheme.textSecondary}`}>
                      From €{car.price_eur.toLocaleString()}
                    </div>
                  ) : null}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* FAQ Section - SEO Content */}
      <section className={`${currentTheme.background} py-16`}>
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