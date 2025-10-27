'use client'

import React, { useState, useEffect } from 'react'
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
  slug?: string
  ev_range_km: number
  fuel_consumption: number
  battery_kwh: number
  price_eur: number
  image_url: string
  power_hp: number
  engine_displacement?: number
  co2_emission: number
  charge_time_ac: number
  charge_time_dc?: number
  trunk_volume: number
  seats: number
  warranty_years: number
  country_availability: string
  // New properties
  weight_kg?: number
  length_mm?: number
  width_mm?: number
  height_mm?: number
  wheelbase_mm?: number
  max_trunk_volume?: number
  electric_motor_power_hp?: number
  battery_chemistry?: string
  battery_voltage?: number
  battery_architecture?: string
  emission_standard?: string
  drivetrain?: string
  transmission?: string
  acceleration_0_100?: number
  top_speed?: number
  battery_details?: {
    chemistry: string
    architecture: string
    cycles?: number
    degradation_rate?: number
    warranty_capacity?: number
    thermal_management?: string
  }
  charging_capabilities?: {
    ac_power?: number
    dc_power?: number
    charging_curve?: {
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
  const typedCarsData = carsData as Car[]
  // Accept both numeric/string id and SEO slug in the same dynamic route
  const car = typedCarsData.find(c => c.id === params.id || c.slug === (params.id as any)) as Car
  const [isRangeSimulatorOpen, setIsRangeSimulatorOpen] = useState(false)
  const [selectedTheme, setSelectedTheme] = useState('light')
  const [selectedLanguage, setSelectedLanguage] = useState('en')
  const [isClient, setIsClient] = useState(false)

  const translations = {
    en: {
      backToModels: 'Back to Models',
      lightTheme: 'Light Theme',
      darkTheme: 'Dark Theme',
      startingPrice: 'Starting Price',
      electricRange: 'Electric Range',
      batteryCapacity: 'Battery Capacity',
      powerOutput: 'Power Output',
      safetyRating: 'Safety Rating',
      sourceEuroNCAP: 'Source: Euro NCAP',
      electricPerformance: 'Electric Performance',
      enginePerformance: 'Engine & Performance',
      comfortSpace: 'Comfort & Space',
      general: 'General',
      electricRangeLabel: 'Electric Range',
      batteryCapacityLabel: 'Battery Capacity',
      acChargeTime: 'AC Charge Time',
      dcChargeTime: 'DC Charge Time',
      acCharging: 'AC Charging',
      dcCharging: 'DC Charging',
      batteryType: 'Battery Type',
      power: 'Power',
      engine: 'Engine',
      fuelConsumption: 'Fuel Consumption',
      co2Emission: 'CO₂ Emission',
      segment: 'Segment',
      trunkVolume: 'Trunk Volume',
      seats: 'Seats',
      warranty: 'Warranty',
      countryAvailability: 'Country Availability',
      brand: 'Brand',
      model: 'Model',
      year: 'Year',
      price: 'Price',
      estimatedEU: 'Est. EU'
    },
    de: {
      backToModels: 'Zurück zu Modellen',
      lightTheme: 'Helles Design',
      darkTheme: 'Dunkles Design',
      startingPrice: 'Grundpreis',
      electricRange: 'Elektrische Reichweite',
      batteryCapacity: 'Batteriekapazität',
      powerOutput: 'Leistung',
      safetyRating: 'Sicherheitsbewertung',
      sourceEuroNCAP: 'Quelle: Euro NCAP',
      electricPerformance: 'Elektrische Leistung',
      enginePerformance: 'Motor & Leistung',
      comfortSpace: 'Komfort & Platz',
      general: 'Allgemein',
      electricRangeLabel: 'Elektrische Reichweite',
      batteryCapacityLabel: 'Batteriekapazität',
      acChargeTime: 'AC-Ladezeit',
      dcChargeTime: 'DC-Ladezeit',
      acCharging: 'AC-Laden',
      dcCharging: 'DC-Laden',
      batteryType: 'Batterietyp',
      power: 'Leistung',
      engine: 'Motor',
      fuelConsumption: 'Kraftstoffverbrauch',
      co2Emission: 'CO₂-Emission',
      segment: 'Segment',
      trunkVolume: 'Kofferraumvolumen',
      seats: 'Sitze',
      warranty: 'Garantie',
      countryAvailability: 'Länderverfügbarkeit',
      brand: 'Marke',
      model: 'Modell',
      year: 'Jahr',
      price: 'Preis',
      estimatedEU: 'Geschätzt EU'
    },
    tr: {
      backToModels: 'Modellere Geri Dön',
      lightTheme: 'Açık Tema',
      darkTheme: 'Koyu Tema',
      startingPrice: 'Başlangıç Fiyatı',
      electricRange: 'Elektrik Menzili',
      batteryCapacity: 'Batarya Kapasitesi',
      powerOutput: 'Güç Çıkışı',
      safetyRating: 'Güvenlik Değerlendirmesi',
      sourceEuroNCAP: 'Kaynak: Euro NCAP',
      electricPerformance: 'Elektrik Performansı',
      enginePerformance: 'Motor & Performans',
      comfortSpace: 'Konfor & Alan',
      general: 'Genel',
      electricRangeLabel: 'Elektrik Menzili',
      batteryCapacityLabel: 'Batarya Kapasitesi',
      acChargeTime: 'AC Şarj Süresi',
      dcChargeTime: 'DC Şarj Süresi',
      acCharging: 'AC Şarj',
      dcCharging: 'DC Şarj',
      batteryType: 'Batarya Tipi',
      power: 'Güç',
      engine: 'Motor',
      fuelConsumption: 'Yakıt Tüketimi',
      co2Emission: 'CO₂ Emisyonu',
      segment: 'Segment',
      trunkVolume: 'Bagaj Hacmi',
      seats: 'Koltuk',
      warranty: 'Garanti',
      countryAvailability: 'Ülke Mevcudiyeti',
      brand: 'Marka',
      model: 'Model',
      year: 'Yıl',
      price: 'Fiyat',
      estimatedEU: 'Tahmini AB'
    },
    pl: {
      backToModels: 'Powrót do Modeli',
      lightTheme: 'Jasny Motyw',
      darkTheme: 'Ciemny Motyw',
      startingPrice: 'Cena Początkowa',
      electricRange: 'Zasięg Elektryczny',
      batteryCapacity: 'Pojemność Baterii',
      powerOutput: 'Moc',
      safetyRating: 'Ocena Bezpieczeństwa',
      sourceEuroNCAP: 'Źródło: Euro NCAP',
      electricPerformance: 'Wydajność Elektryczna',
      enginePerformance: 'Silnik & Wydajność',
      comfortSpace: 'Komfort & Przestrzeń',
      general: 'Ogólne',
      electricRangeLabel: 'Zasięg Elektryczny',
      batteryCapacityLabel: 'Pojemność Baterii',
      acChargeTime: 'Czas Ładowania AC',
      dcChargeTime: 'Czas Ładowania DC',
      acCharging: 'Ładowanie AC',
      dcCharging: 'Ładowanie DC',
      batteryType: 'Typ Baterii',
      power: 'Moc',
      engine: 'Silnik',
      fuelConsumption: 'Zużycie Paliwa',
      co2Emission: 'Emisja CO₂',
      segment: 'Segment',
      trunkVolume: 'Pojemność Bagażnika',
      seats: 'Miejsca',
      warranty: 'Gwarancja',
      countryAvailability: 'Dostępność Krajowa',
      brand: 'Marka',
      model: 'Model',
      year: 'Rok',
      price: 'Cena',
      estimatedEU: 'Szac. UE'
    }
  }

  const t = isClient ? translations[selectedLanguage as keyof typeof translations] : translations['en']

  // Client-side hydration kontrolü
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Dil algılama - client-side'da çalışır
  useEffect(() => {
    if (!isClient) return

    const savedLanguage = localStorage.getItem('phevs-language') || 'en'
    console.log('Model page - Language from localStorage:', savedLanguage)
    setSelectedLanguage(savedLanguage)

    // Dil değişikliklerini dinle
    const handleLanguageChange = () => {
      const newLanguage = localStorage.getItem('phevs-language') || 'en'
      console.log('Model page - Language changed to:', newLanguage)
      setSelectedLanguage(newLanguage)
    }

    // Storage event listener ekle
    window.addEventListener('storage', handleLanguageChange)
    
    // Custom event listener ekle (aynı tab içinde dil değişikliği için)
    window.addEventListener('languageChanged', handleLanguageChange)

    return () => {
      window.removeEventListener('storage', handleLanguageChange)
      window.removeEventListener('languageChanged', handleLanguageChange)
    }
  }, [isClient])

  const themes = {
    light: {
      name: 'Light Theme',
      background: 'bg-gray-200',
      headerBg: 'bg-gray-300',
      headerText: 'text-gray-700',
      headerSubtext: 'text-gray-400',
      linkText: 'text-gray-400',
      linkHover: 'hover:text-gray-700',
      cardBg: 'bg-gray-200',
      cardBorder: 'border-gray-400',
      textPrimary: 'text-gray-700',
      textSecondary: 'text-gray-400',
      priceBg: 'bg-gradient-to-r from-blue-200 to-indigo-200',
      priceBorder: 'border-blue-400',
      statBg: 'bg-gray-200',
      specBg: 'bg-gray-300',
      specHover: 'hover:bg-gray-400',
      highlightBg: 'bg-gradient-to-r from-blue-200 to-indigo-200',
      highlightBorder: 'border-blue-400',
      iconColor: 'text-gray-600'
    },
    dark: {
      name: 'Dark Theme',
      background: 'bg-slate-900',
      headerBg: 'bg-slate-800',
      headerText: 'text-white',
      headerSubtext: 'text-gray-300',
      linkText: 'text-gray-300',
      linkHover: 'hover:text-white',
      cardBg: 'bg-slate-700',
      cardBorder: 'border-slate-500',
      textPrimary: 'text-white',
      textSecondary: 'text-gray-300',
      priceBg: 'bg-gradient-to-r from-slate-600 to-slate-500',
      priceBorder: 'border-slate-400',
      statBg: 'bg-slate-700',
      specBg: 'bg-slate-600',
      specHover: 'hover:bg-slate-500',
      highlightBg: 'bg-gradient-to-r from-slate-600 to-slate-500',
      highlightBorder: 'border-slate-400',
      iconColor: 'text-gray-300'
    }
  }

  const currentTheme = themes[selectedTheme as keyof typeof themes]

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

  // Model için lokal fotoğrafları al - sadece mevcut dosyaları
  const getCatalogImages = (carId: string, brand: string) => {
    const urlParts = car.image_url.split('/')
    const brandFromUrl = urlParts[4]
    const modelFromUrl = urlParts[5]
    
    if (!brandFromUrl || !modelFromUrl) {
      return [car.image_url] // Placeholder yerine ana görseli döndür
    }
    
    const basePath = `/images/cars/brands/${brandFromUrl}/${modelFromUrl}`
    const images: string[] = []
    
    // Main görsel (doğru uzantıyla)
    images.push(car.image_url)
    
    // BMW XM 50e için özel görsel listesi
    if (car.slug === 'bmw-xm-50e-2024') {
      const bmwXmImages = [
        '002.jpg',
        'g05_carousel_columns_soundsystem.jpg',
        'g05_exterior_video_fb.jpg',
        'g05_interior_highlights_craftedclarity.jpg',
        'g05_interior_highlights_curveddisplay.jpg',
        'g05_plugin_hybrid_homecharging.jpg'
      ]
      
      bmwXmImages.forEach(img => {
        images.push(`${basePath}/${img}`)
      })
    } else {
      // Diğer araçlar için genel numaralı görselleri ekle
      const existingImages = [
        '002.jpg', '004.jpg', '006.jpg', '009.jpg', '010.jpg', 
        '011.jpg', '012.jpg', '013.jpg', '016.jpg', '017.jpg', 
        '018.jpg', '019.jpg', '021.jpg'
      ]
      
      existingImages.forEach(img => {
        images.push(`${basePath}/${img}`)
      })
    }
    
    return images
  }

  const catalogImages = getCatalogImages(car.id, car.brand)

  const specifications = [
    {
      category: t.general,
      items: [
        { label: t.brand, value: car.brand },
        { label: t.model, value: car.model },
        { label: t.year, value: car.year },
        { label: t.segment, value: car.segment },
        { label: t.price, value: `€${car.price_eur.toLocaleString()} (${t.estimatedEU})` },
        // Additional performance specs if available
        ...(car.acceleration_0_100 ? [
          { label: selectedLanguage === 'tr' ? '0-100 km/h' : selectedLanguage === 'de' ? '0-100 km/h' : selectedLanguage === 'pl' ? '0-100 km/h' : '0-100 km/h', value: `${car.acceleration_0_100} s` },
        ] : [] as any),
        ...(car.top_speed ? [
          { label: selectedLanguage === 'tr' ? 'Maks. Hız' : selectedLanguage === 'de' ? 'Höchstgeschwindigkeit' : selectedLanguage === 'pl' ? 'Prędkość maksymalna' : 'Top Speed', value: `${car.top_speed} km/h` },
        ] : [] as any),
        // Battery architecture if available
        ...(car.battery_architecture ? [
          { label: selectedLanguage === 'tr' ? 'Batarya Mimarisi' : selectedLanguage === 'de' ? 'Batteriearchitektur' : selectedLanguage === 'pl' ? 'Architektura baterii' : 'Battery Architecture', value: car.battery_architecture },
        ] : [] as any),
      ]
    },
    { 
      category: t.electricPerformance,
      items: [
        { label: t.electricRangeLabel, value: `${car.ev_range_km} km`, icon: BoltIcon, highlight: true, hasSimulator: true },
        { label: t.batteryCapacityLabel, value: `${car.battery_kwh} kWh`, icon: SparklesIcon, highlight: true },
        { label: t.acChargeTime, value: `${car.charge_time_ac} ${selectedLanguage === 'tr' ? 'saat' : selectedLanguage === 'de' ? 'Stunden' : selectedLanguage === 'pl' ? 'godziny' : 'hours'}` },
        { label: t.dcChargeTime, value: `${car.charge_time_dc || 'N/A'} ${selectedLanguage === 'tr' ? 'dakika' : selectedLanguage === 'de' ? 'Minuten' : selectedLanguage === 'pl' ? 'minuty' : 'minutes'}` },
        // Battery chemistry and voltage if available
        ...(car.battery_chemistry ? [
          { label: selectedLanguage === 'tr' ? 'Batarya Kimyası' : selectedLanguage === 'de' ? 'Batteriechemie' : selectedLanguage === 'pl' ? 'Chemia baterii' : 'Battery Chemistry', value: car.battery_chemistry },
        ] : [] as any),
        ...(car.battery_voltage ? [
          { label: selectedLanguage === 'tr' ? 'Batarya Voltajı' : selectedLanguage === 'de' ? 'Batteriespannung' : selectedLanguage === 'pl' ? 'Napięcie baterii' : 'Battery Voltage', value: `${car.battery_voltage}V` },
        ] : [] as any),
        // Battery details if available
        ...(car.battery_details ? [
          { label: t.batteryType, value: `${car.battery_details.chemistry} • ${car.battery_details.architecture}` },
        ] : [] as any),
        // Charging port and capabilities
        ...(car.charging_port ? [
          { label: t.acCharging, value: `${car.charging_port.ac_type} (${car.charging_port.ac_location})${car.charging_capabilities?.ac_power ? ` • ${car.charging_capabilities.ac_power}kW` : ''}${car.charging_port.ac_phases ? ` • ${car.charging_port.ac_phases}ph` : ''}` },
          ...(car.charging_port.dc_type ? [{ label: t.dcCharging, value: `${car.charging_port.dc_type} (${car.charging_port.dc_location})${car.charging_capabilities?.dc_power ? ` • ${car.charging_capabilities.dc_power}kW` : ''}` }] : [])
        ] : [] as any),
      ]
    },
    {
      category: t.enginePerformance,
      items: [
        { label: t.power, value: `${car.power_hp} HP`, highlight: true },
        { label: t.engine, value: car.engine_displacement ? `${car.engine_displacement}L` : 'N/A' },
        { label: t.fuelConsumption, value: `${car.fuel_consumption} L/100km` },
        { label: t.co2Emission, value: `${car.co2_emission} g/km` },
        // Electric motor power if available
        ...(car.electric_motor_power_hp ? [
          { label: selectedLanguage === 'tr' ? 'Elektrik Motor Gücü' : selectedLanguage === 'de' ? 'Elektromotor-Leistung' : selectedLanguage === 'pl' ? 'Moc silnika elektrycznego' : 'Electric Motor Power', value: `${car.electric_motor_power_hp} HP` },
        ] : [] as any),
        // Emission standard if available
        ...(car.emission_standard ? [
          { label: selectedLanguage === 'tr' ? 'Emisyon Standardı' : selectedLanguage === 'de' ? 'Abgasnorm' : selectedLanguage === 'pl' ? 'Norma emisji' : 'Emission Standard', value: car.emission_standard },
        ] : [] as any),
        // Drivetrain if available
        ...(car.drivetrain ? [
          { label: selectedLanguage === 'tr' ? 'Çekiş' : selectedLanguage === 'de' ? 'Antrieb' : selectedLanguage === 'pl' ? 'Napęd' : 'Drivetrain', value: car.drivetrain },
        ] : [] as any),
        // Transmission if available
        ...(car.transmission ? [
          { label: selectedLanguage === 'tr' ? 'Şanzıman' : selectedLanguage === 'de' ? 'Getriebe' : selectedLanguage === 'pl' ? 'Skrzynia biegów' : 'Transmission', value: car.transmission },
        ] : [] as any),
      ]
    },
    {
      category: t.comfortSpace,
      items: [
        { label: t.trunkVolume, value: `${car.trunk_volume} L` },
        { label: t.seats, value: car.seats },
        { label: t.warranty, value: `${car.warranty_years} ${selectedLanguage === 'tr' ? 'yıl' : selectedLanguage === 'de' ? 'Jahre' : selectedLanguage === 'pl' ? 'lata' : 'years'}` },
        { label: t.countryAvailability, value: car.country_availability },
        // Additional dimensions if available
        ...(car.weight_kg ? [
          { label: selectedLanguage === 'tr' ? 'Ağırlık' : selectedLanguage === 'de' ? 'Gewicht' : selectedLanguage === 'pl' ? 'Waga' : 'Weight', value: `${car.weight_kg} kg` },
        ] : [] as any),
        ...(car.length_mm ? [
          { label: selectedLanguage === 'tr' ? 'Uzunluk' : selectedLanguage === 'de' ? 'Länge' : selectedLanguage === 'pl' ? 'Długość' : 'Length', value: `${car.length_mm} mm` },
        ] : [] as any),
        ...(car.width_mm ? [
          { label: selectedLanguage === 'tr' ? 'Genişlik' : selectedLanguage === 'de' ? 'Breite' : selectedLanguage === 'pl' ? 'Szerokość' : 'Width', value: `${car.width_mm} mm` },
        ] : [] as any),
        ...(car.height_mm ? [
          { label: selectedLanguage === 'tr' ? 'Yükseklik' : selectedLanguage === 'de' ? 'Höhe' : selectedLanguage === 'pl' ? 'Wysokość' : 'Height', value: `${car.height_mm} mm` },
        ] : [] as any),
        ...(car.wheelbase_mm ? [
          { label: selectedLanguage === 'tr' ? 'Aks Mesafesi' : selectedLanguage === 'de' ? 'Radstand' : selectedLanguage === 'pl' ? 'Rozstaw osi' : 'Wheelbase', value: `${car.wheelbase_mm} mm` },
        ] : [] as any),
        ...(car.max_trunk_volume ? [
          { label: selectedLanguage === 'tr' ? 'Maks. Bagaj Hacmi' : selectedLanguage === 'de' ? 'Max. Kofferraumvolumen' : selectedLanguage === 'pl' ? 'Maks. objętość bagażnika' : 'Max Trunk Volume', value: `${car.max_trunk_volume} L` },
        ] : [] as any),
      ]
    }
  ]

  return (
    <>
      <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100`}>
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-slate-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="inline-flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-colors group">
              <ArrowLeftIcon className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium text-sm">{t.backToModels}</span>
            </Link>
            <div className="text-center flex-1 px-2">
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent truncate">{car.brand} {car.model}</h1>
              <p className="text-sm text-slate-500">{car.year} • {car.segment}</p>
            </div>
            <div className="w-16 sm:w-24"></div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Images Section */}
        <div className="mb-12">
          <ImageGallery images={catalogImages} alt={`${car.brand} ${car.model} gallery`} />
        </div>

        {/* Elegant Info Section */}
        <div className="mb-16">
          {/* Price - Center Elegant */}
          <div className="text-center mb-12">
            <p className="text-xs text-slate-500 uppercase tracking-[0.15em] mb-4 font-light">{t.startingPrice}</p>
            <div className="flex items-baseline justify-center space-x-4">
              <span className="text-6xl md:text-7xl font-extralight text-slate-900 tracking-tight">€{car.price_eur.toLocaleString()}</span>
              <div className="relative group">
                <InformationCircleIcon className="h-4 w-4 text-slate-400 cursor-help hover:text-slate-500 transition-colors" />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-3 py-2 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  {selectedLanguage === 'tr' ? 'Tahmini AB pazar değeri' : 
                   selectedLanguage === 'de' ? 'Geschätzter EU-Marktwert' :
                   selectedLanguage === 'pl' ? 'Szacowana wartość rynkowa UE' :
                   'Estimated EU market value'}
                </div>
              </div>
            </div>
          </div>

          {/* Stats - Elegant Split */}
          <div className="flex flex-wrap justify-center gap-x-16 gap-y-8 max-w-4xl mx-auto">
            <div className="text-center">
              <p className="text-xs text-slate-500 uppercase tracking-widest mb-3 font-light">{t.electricRange}</p>
              <p className="text-5xl font-extralight text-slate-900">{car.ev_range_km}</p>
              <span className="text-sm text-slate-400">km</span>
            </div>
            
            <div className="text-center">
              <p className="text-xs text-slate-500 uppercase tracking-widest mb-3 font-light">{t.batteryCapacity}</p>
              <p className="text-5xl font-extralight text-slate-900">{car.battery_kwh}</p>
              <span className="text-sm text-slate-400">kWh</span>
            </div>
            
            <div className="text-center">
              <p className="text-xs text-slate-500 uppercase tracking-widest mb-3 font-light">{t.powerOutput}</p>
              <p className="text-5xl font-extralight text-slate-900">{car.power_hp}</p>
              <span className="text-sm text-slate-400">HP</span>
            </div>
          </div>
        </div>

        {/* Range Simulator & Safety Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {/* Range Simulator */}
          <div className="bg-gradient-to-br from-emerald-50 to-white border border-slate-200 rounded-xl p-8 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center">
                <SparklesIcon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-medium text-slate-900">Range Simulator</h3>
            </div>
            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
              Test real-world range with different driving conditions and scenarios
            </p>
            <button
              onClick={() => setIsRangeSimulatorOpen(true)}
              className="w-full px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-all duration-200 text-sm font-medium flex items-center justify-center space-x-2"
            >
              <SparklesIcon className="h-4 w-4" />
              <span>Open Simulator</span>
            </button>
          </div>

          {/* Euro NCAP Section */}
          {car.euroncap_rating && (
            <div className="bg-gradient-to-br from-amber-50 to-white border border-slate-200 rounded-xl p-8 shadow-sm">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-amber-600 rounded-lg flex items-center justify-center">
                  <span className="text-xl">⭐</span>
                </div>
                <h3 className="text-xl font-medium text-slate-900">{t.safetyRating}</h3>
              </div>
              <div className="flex justify-start mb-6">
                <EuroNCAPStars rating={car.euroncap_rating} size="md" showDetails={false} />
              </div>
              <a 
                href={`https://www.euroncap.com/en/results/${car.brand.toLowerCase().replace(/\s+/g, '-')}/${car.model.toLowerCase().replace(/\s+/g, '-')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-slate-500 hover:text-slate-700 transition-colors underline inline-block"
              >
                {t.sourceEuroNCAP}
              </a>
            </div>
          )}
        </div>

        {/* Specifications Grid - Elegant */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-12">
          {specifications.map((spec, index) => (
            <div key={index}>
              <h3 className="text-xs text-slate-500 uppercase tracking-[0.2em] mb-8 font-light">
                {spec.category}
              </h3>
              <div className="space-y-6">
                {spec.items.map((item, itemIndex) => (
                  <div 
                    key={itemIndex} 
                    className={`flex justify-between items-start py-2 ${
                      (item as any).highlight ? 'border-b border-slate-900 pb-3' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      {(item as any).icon && React.createElement((item as any).icon, { className: `h-4 w-4 mt-0.5 ${(item as any).highlight ? 'text-slate-900' : 'text-slate-400'}` })}
                      <span className={`text-sm ${(item as any).highlight ? 'font-medium text-slate-900' : 'font-light text-slate-600'}`}>{item.label}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm ${(item as any).highlight ? 'font-medium text-slate-900' : 'font-light text-slate-900'}`}>
                        {item.value}
                      </span>
                      {(item as any).hasSimulator && (
                        <button
                          onClick={() => setIsRangeSimulatorOpen(true)}
                          className="p-1 hover:text-slate-900 transition-colors"
                          title="Range Simulator"
                        >
                          <SparklesIcon className="h-3 w-3 text-slate-400" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Range Simulator Modal */}
      <RangeSimulator
        baseRange={car.ev_range_km}
        batteryCapacity={car.battery_kwh}
        isOpen={isRangeSimulatorOpen}
        onClose={() => setIsRangeSimulatorOpen(false)}
        selectedCar={car}
        simulatorData={car.simulator_data}
      />
      </div>
    </>
  )
}
