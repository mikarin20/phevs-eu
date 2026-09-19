'use client'

import React, { useState, useEffect } from 'react'
import { ArrowLeftIcon, BoltIcon, SparklesIcon, CurrencyEuroIcon, InformationCircleIcon, MapIcon, HomeIcon, SunIcon, ClockIcon } from '@heroicons/react/24/outline'
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
  usable_battery_kwh?: number
  price_eur?: number
  image_url: string
  gallery_images?: string[]
  power_hp: number
  engine_displacement?: number
  ac_max_power_kw?: number
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
    ac_power_max?: number
    ac_power_note?: string
    dc_power?: number
    charging_curve?: {
      soc: number[]
      power: number[]
    }
  }
  dc_charging_supported?: boolean
  dc_max_power_kw?: number | null
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
  // Accept numeric/string id, SEO slug, or slug without -phev
  const normalizedId = decodeURIComponent(params.id || '').toLowerCase().trim()
  const car = typedCarsData.find(c => {
    if (c.id?.toLowerCase() === normalizedId) return true
    if (c.slug?.toLowerCase() === normalizedId) return true
    const slugNoPhev = (c.slug || '').toLowerCase().replace(/-phev$/, '')
    const idNoPhev = normalizedId.replace(/-phev$/, '')
    if (slugNoPhev && slugNoPhev === idNoPhev) return true
    return false
  }) as Car
  const dcMaxPowerKw = car.dc_max_power_kw ?? car.charging_capabilities?.dc_power ?? null
  const dcChargingSupported = car.dc_charging_supported ?? Boolean(dcMaxPowerKw || car.charging_port?.dc_type)
  const dcConnector = car.charging_port?.dc_type
  const dcChargingLabel = dcChargingSupported
    ? `${dcMaxPowerKw ? `${dcMaxPowerKw} kW DC` : 'DC'}${dcConnector ? ` (${dcConnector})` : ''}`
    : null
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
      estimatedEU: 'Est. EU',
      // Charging specifications
      battery: 'BATTERY',
      batteryDescription: 'Battery size in kilowatt hours',
      range: 'RANGE (KM)',
      rangeDescription: 'Mileage in kilometers according to the WLTP/EPA standard',
      onboardChargerAC: 'ON-BOARD CHARGER (AC)',
      onboardChargerACDescription: 'Maximum charging power AC',
      maxChargingPowerDC: 'MAX CHARGING POWER (DC)',
      maxChargingPowerDCDescription: 'Maximum charging power with fast charging/lightning charging',
      chargingSocketAC: 'CHARGING SOCKET (AC)',
      chargingSocketACDescription: 'Charging socket in the car for normal charging',
      fastChargingDC: 'FAST CHARGING (DC)',
      fastChargingDCDescription: 'Charging socket in the car for fast charging',
      notSupported: 'Not supported',
      canBeUpgradedTo11kW: 'Can be upgraded to 11 kW'
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
      estimatedEU: 'Geschätzt EU',
      // Charging specifications
      battery: 'BATTERIE',
      batteryDescription: 'Batteriegröße in Kilowattstunden',
      range: 'REICHWEITE (KM)',
      rangeDescription: 'Reichweite in Kilometern nach WLTP/EPA-Standard',
      onboardChargerAC: 'BORDBRECHER (AC)',
      onboardChargerACDescription: 'Maximale Ladeleistung AC',
      maxChargingPowerDC: 'MAX. LADELEISTUNG (DC)',
      maxChargingPowerDCDescription: 'Maximale Ladeleistung beim Schnellladen/Blitzladen',
      chargingSocketAC: 'LADESOCKEL (AC)',
      chargingSocketACDescription: 'Ladesockel im Fahrzeug für normales Laden',
      fastChargingDC: 'SCHNELLLADEN (DC)',
      fastChargingDCDescription: 'Ladesockel im Fahrzeug für Schnellladen',
      notSupported: 'Nicht unterstützt',
      canBeUpgradedTo11kW: 'Bis zu 11 kW erhöhbar'
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
      estimatedEU: 'Tahmini AB',
      // Charging specifications
      battery: 'BATARYA',
      batteryDescription: 'Kilovatsaat cinsinden batarya boyutu',
      range: 'MENZİL (KM)',
      rangeDescription: 'WLTP/EPA standardına göre kilometre cinsinden menzil',
      onboardChargerAC: 'ARAÇ İÇİ ŞARJ CİHAZI (AC)',
      onboardChargerACDescription: 'Maksimum AC şarj gücü',
      maxChargingPowerDC: 'MAKSİMUM ŞARJ GÜCÜ (DC)',
      maxChargingPowerDCDescription: 'Hızlı şarj/şimşek şarj ile maksimum şarj gücü',
      chargingSocketAC: 'ŞARJ SOKETİ (AC)',
      chargingSocketACDescription: 'Normal şarj için araçtaki şarj soketi',
      fastChargingDC: 'HIZLI ŞARJ (DC)',
      fastChargingDCDescription: 'Hızlı şarj için araçtaki şarj soketi',
      notSupported: 'Desteklenmiyor',
      canBeUpgradedTo11kW: '11 kW\'a kadar yükseltilebilir'
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
      estimatedEU: 'Szac. UE',
      // Charging specifications
      battery: 'BATERIA',
      batteryDescription: 'Pojemność baterii w kilowatogodzinach',
      range: 'ZASIĘG (KM)',
      rangeDescription: 'Zasięg w kilometrach według standardu WLTP/EPA',
      onboardChargerAC: 'ŁADOWARKA POKŁADOWA (AC)',
      onboardChargerACDescription: 'Maksymalna moc ładowania AC',
      maxChargingPowerDC: 'MAKSYMALNA MOC ŁADOWANIA (DC)',
      maxChargingPowerDCDescription: 'Maksymalna moc ładowania przy szybkim ładowaniu/błyskawicznym ładowaniu',
      chargingSocketAC: 'GNIAZDO ŁADOWANIA (AC)',
      chargingSocketACDescription: 'Gniazdo ładowania w samochodzie do normalnego ładowania',
      fastChargingDC: 'SZYBKIE ŁADOWANIE (DC)',
      fastChargingDCDescription: 'Gniazdo ładowania w samochodzie do szybkiego ładowania',
      notSupported: 'Nieobsługiwane',
      canBeUpgradedTo11kW: 'Można zwiększyć do 11 kW'
    }
  }

  const t = isClient ? translations[selectedLanguage as keyof typeof translations] : translations['en']

  // Translate common AC power notes
  const translateACPowerNote = (note: string | undefined): string => {
    if (!note) return ''
    
    const noteTranslations: { [key: string]: { [lang: string]: string } } = {
      '11 kW üç fazlı AC şarj (Avrupa pazarlarında standart)': {
        en: '11 kW three-phase AC charging (standard in European markets)',
        de: '11 kW Dreiphasen-AC-Ladung (Standard auf europäischen Märkten)',
        tr: '11 kW üç fazlı AC şarj (Avrupa pazarlarında standart)',
        pl: '11 kW ładowanie AC trójfazowe (standard na rynkach europejskich)'
      },
      '3.7 kW standart, 7.4 kW opsiyonel': {
        en: '3.7 kW standard, 7.4 kW optional',
        de: '3.7 kW Standard, 7.4 kW optional',
        tr: '3.7 kW standart, 7.4 kW opsiyonel',
        pl: '3.7 kW standardowe, 7.4 kW opcjonalne'
      },
      '2024 ve sonrası modellerde 6.4 kW (iki/üç fazlı şarj), eski modellerde 3.6 kW': {
        en: '6.4 kW in 2024 and later models (two/three-phase charging), 3.6 kW in older models',
        de: '6.4 kW in Modellen ab 2024 (Zwei-/Dreiphasenladung), 3.6 kW in älteren Modellen',
        tr: '2024 ve sonrası modellerde 6.4 kW (iki/üç fazlı şarj), eski modellerde 3.6 kW',
        pl: '6.4 kW w modelach 2024 i późniejszych (ładowanie dwu/trójfazowe), 3.6 kW w starszych modelach'
      },
      '6.6 kW AC on-board charger, 0-100% yaklaşık 3 saat': {
        en: '6.6 kW AC on-board charger, approximately 3 hours for 0-100%',
        de: '6.6 kW AC Bordlader, ca. 3 Stunden für 0-100%',
        tr: '6.6 kW AC on-board charger, 0-100% yaklaşık 3 saat',
        pl: '6.6 kW ładowarka pokładowa AC, około 3 godziny dla 0-100%'
      },
      '6.6 kW AC on-board charger': {
        en: '6.6 kW AC on-board charger',
        de: '6.6 kW AC Bordlader',
        tr: '6.6 kW AC on-board charger',
        pl: '6.6 kW ładowarka pokładowa AC'
      },
      '6.6 kW AC şarj (30-80% yaklaşık 3 saat). Standart ev şarjı: 3.3 kW (0-100% yaklaşık 8.5 saat). DC hızlı şarj: 40 kW (30-80% 20 dakika)': {
        en: '6.6 kW AC charging (approximately 3 hours for 30-80%). Standard home charging: 3.3 kW (approximately 8.5 hours for 0-100%). DC fast charging: 40 kW (30-80% in 20 minutes)',
        de: '6.6 kW AC-Ladung (ca. 3 Stunden für 30-80%). Standard-Hausladung: 3.3 kW (ca. 8.5 Stunden für 0-100%). DC-Schnellladung: 40 kW (30-80% in 20 Minuten)',
        tr: '6.6 kW AC şarj (30-80% yaklaşık 3 saat). Standart ev şarjı: 3.3 kW (0-100% yaklaşık 8.5 saat). DC hızlı şarj: 40 kW (30-80% 20 dakika)',
        pl: '6.6 kW ładowanie AC (około 3 godziny dla 30-80%). Standardowe ładowanie domowe: 3.3 kW (około 8.5 godziny dla 0-100%). Szybkie ładowanie DC: 40 kW (30-80% w 20 minutach)'
      },
      '3.6 kW — 16A / 230V 1-faz. Fast charging (DC) desteklenmiyor': {
        en: '3.6 kW — 16A / 230V single-phase. Fast charging (DC) not supported',
        de: '3.6 kW — 16A / 230V einphasig. Schnellladung (DC) nicht unterstützt',
        tr: '3.6 kW — 16A / 230V 1-faz. Fast charging (DC) desteklenmiyor',
        pl: '3.6 kW — 16A / 230V jednofazowe. Szybkie ładowanie (DC) nieobsługiwane'
      },
      'RAV4 Plug-in Hybrid: 6.6 kW AC onboard charger. Not: RAV4 Prime SE (2022) 3.3 kW kullanır': {
        en: 'RAV4 Plug-in Hybrid: 6.6 kW AC onboard charger. Note: RAV4 Prime SE (2022) uses 3.3 kW',
        de: 'RAV4 Plug-in Hybrid: 6.6 kW AC Bordlader. Hinweis: RAV4 Prime SE (2022) verwendet 3.3 kW',
        tr: 'RAV4 Plug-in Hybrid: 6.6 kW AC onboard charger. Not: RAV4 Prime SE (2022) 3.3 kW kullanır',
        pl: 'RAV4 Plug-in Hybrid: 6.6 kW ładowarka pokładowa AC. Uwaga: RAV4 Prime SE (2022) używa 3.3 kW'
      },
      'C-HR Plug-in Hybrid: 6.6 kW AC onboard charger': {
        en: 'C-HR Plug-in Hybrid: 6.6 kW AC onboard charger',
        de: 'C-HR Plug-in Hybrid: 6.6 kW AC Bordlader',
        tr: 'C-HR Plug-in Hybrid: 6.6 kW AC onboard charger',
        pl: 'C-HR Plug-in Hybrid: 6.6 kW ładowarka pokładowa AC'
      },
      '6.6 kW onboard AC charger. Not: Tam elektrikli RZ 450e 11 kW kullanır': {
        en: '6.6 kW onboard AC charger. Note: Full electric RZ 450e uses 11 kW',
        de: '6.6 kW AC Bordlader. Hinweis: Voll-elektrisch RZ 450e verwendet 11 kW',
        tr: '6.6 kW onboard AC charger. Not: Tam elektrikli RZ 450e 11 kW kullanır',
        pl: '6.6 kW ładowarka pokładowa AC. Uwaga: W pełni elektryczny RZ 450e używa 11 kW'
      }
    }
    
    const translated = noteTranslations[note]?.[selectedLanguage]
    return translated || note
  }

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
  const [catalogImages, setCatalogImages] = useState<string[]>([car.image_url])
  
  useEffect(() => {
    // If explicitly defined gallery images exist, use them directly
    if (Array.isArray(car.gallery_images) && car.gallery_images.length > 0) {
      const allImages = [car.image_url, ...car.gallery_images].filter(Boolean)
      setCatalogImages(Array.from(new Set(allImages)))
      return
    }

    const urlParts = car.image_url.split('/')
    const brandFromUrl = urlParts[4]
    const modelFromUrl = urlParts[5]
    
    if (!brandFromUrl || !modelFromUrl) {
      setCatalogImages([car.image_url])
      return
    }
    
    const basePath = `/images/cars/brands/${brandFromUrl}/${modelFromUrl}`
    
    // Mevcut resim dosyalarını kontrol et ve sadece var olanları ekle
    const commonImageFiles = [
      '002.jpg', '003.jpg', '004.jpg', '005.jpg', '006.jpg', '007.jpg', 
      '008.jpg', '009.jpg', '010.jpg', '011.jpg', '012.jpg', '013.jpg', 
      '014.jpg', '015.jpg', '016.jpg', '017.jpg', '018.jpg', '019.jpg', 
      '020.jpg', '021.jpg', '1.jpg', 'main.jpg'
    ]
    
    // Ana resim dosyasının adını al
    const mainImageFile = car.image_url.split('/').pop()
    
    // Sadece mevcut olan resimler için URL listesi oluştur
    const imageList: string[] = [car.image_url]
    
    // Diğer resim dosyalarını ekle (ana resim dosyasını tekrar ekleme)
    commonImageFiles.forEach(file => {
      if (file !== mainImageFile) {
        imageList.push(`${basePath}/${file}`)
      }
    })
    
    setCatalogImages(imageList)
  }, [car.image_url, car.gallery_images])

  const specifications = [
    {
      category: t.general,
      items: [
        { label: t.brand, value: car.brand },
        { label: t.model, value: car.model },
        { label: t.year, value: car.year },
        { label: t.segment, value: car.segment },
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
        { 
          label: t.batteryCapacityLabel, 
          value: car.usable_battery_kwh 
            ? `${car.battery_kwh} kWh (${selectedLanguage === 'tr' ? 'Net' : selectedLanguage === 'de' ? 'Netto' : selectedLanguage === 'pl' ? 'Netto' : 'Net'}: ${car.usable_battery_kwh} kWh)` 
            : `${car.battery_kwh} kWh`, 
          icon: SparklesIcon, 
          highlight: true 
        },
        ...((car.ac_max_power_kw || car.charging_capabilities?.ac_power_max || car.charging_capabilities?.ac_power) ? [
          {
            label: selectedLanguage === 'tr' ? 'Maks. AC Şarj Gücü' : selectedLanguage === 'de' ? 'Max. AC-Ladeleistung' : selectedLanguage === 'pl' ? 'Maks. moc ładowania AC' : 'Max AC Charge Power',
            value: `${car.ac_max_power_kw || car.charging_capabilities?.ac_power_max || car.charging_capabilities?.ac_power} kW`
          }
        ] : [] as any),
        { label: t.acChargeTime, value: `${car.charge_time_ac} ${selectedLanguage === 'tr' ? 'saat' : selectedLanguage === 'de' ? 'Stunden' : selectedLanguage === 'pl' ? 'godziny' : 'hours'}` },
        { label: t.dcChargeTime, value: `${car.charge_time_dc || 'N/A'} ${selectedLanguage === 'tr' ? 'dakika' : selectedLanguage === 'de' ? 'Minuten' : selectedLanguage === 'pl' ? 'minuty' : 'minutes'}` },
        { label: t.dcCharging, value: dcChargingLabel || t.notSupported },
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
          { 
            label: t.acCharging, 
            value: `${car.charging_port.ac_type} (${car.charging_port.ac_location})${car.charging_capabilities?.ac_power ? ` • ${car.charging_capabilities.ac_power}kW` : ''}${car.charging_port.ac_phases ? ` • ${car.charging_port.ac_phases}ph` : ''}`,
            hasInfo: car.charging_capabilities?.ac_power_max !== undefined || car.charging_capabilities?.ac_power_note !== undefined,
            infoText: translateACPowerNote(car.charging_capabilities?.ac_power_note) || (car.charging_capabilities?.ac_power_max ? t.canBeUpgradedTo11kW : undefined)
          }
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.phevs.eu/" },
            { "@type": "ListItem", "position": 2, "name": "Models", "item": "https://www.phevs.eu/models/" },
            { "@type": "ListItem", "position": 3, "name": `${car.brand} ${car.model}`, "item": `https://www.phevs.eu/models/${car.id}` }
          ]
        }) }}
      />
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

        {/* Key Metrics - Three Column */}
        <div className="mb-12 bg-white rounded-xl border border-slate-200 shadow-sm p-8">
          <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <p className="text-xs text-slate-500 uppercase tracking-widest mb-2 font-light">{t.electricRange}</p>
              <p className="text-4xl font-semibold text-slate-900 mb-1">{car.ev_range_km}</p>
              <span className="text-sm text-slate-500">km</span>
            </div>
            
            <div className="text-center">
              <p className="text-xs text-slate-500 uppercase tracking-widest mb-2 font-light">{t.batteryCapacity}</p>
              <p className="text-4xl font-semibold text-slate-900 mb-1">{car.battery_kwh}</p>
              <span className="text-sm text-slate-500">kWh</span>
            </div>
            
            <div className="text-center">
              <p className="text-xs text-slate-500 uppercase tracking-widest mb-2 font-light">{t.powerOutput}</p>
              <p className="text-4xl font-semibold text-slate-900 mb-1">{car.power_hp}</p>
              <span className="text-sm text-slate-500">HP</span>
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

        {/* Charging Specifications - Elbilgrossisten Style */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Battery Capacity */}
            <div className="border-b border-emerald-200 pb-6">
              <div className="flex items-center mb-3">
                <SparklesIcon className="h-6 w-6 text-emerald-600 mr-3" />
                <h3 className="font-bold text-slate-900 uppercase text-xs tracking-wide">{t.battery}</h3>
              </div>
              <p className="text-2xl font-semibold text-slate-900 mb-1">{car.battery_kwh} kWh</p>
              <p className="text-xs text-slate-500">{t.batteryDescription}</p>
            </div>

            {/* Electric Range */}
            <div className="border-b border-emerald-200 pb-6">
              <div className="flex items-center mb-3">
                <MapIcon className="h-6 w-6 text-emerald-600 mr-3" />
                <h3 className="font-bold text-slate-900 uppercase text-xs tracking-wide">{t.range}</h3>
              </div>
              <p className="text-2xl font-semibold text-slate-900 mb-1">{car.ev_range_km} km (WLTP)</p>
              <p className="text-xs text-slate-500">{t.rangeDescription}</p>
            </div>

            {/* AC Charging */}
            <div className="border-b border-emerald-200 pb-6">
              <div className="flex items-center mb-3">
                <BoltIcon className="h-6 w-6 text-emerald-600 mr-3" />
                <h3 className="font-bold text-slate-900 uppercase text-xs tracking-wide">{t.onboardChargerAC}</h3>
                {(car.charging_capabilities?.ac_power_max || car.charging_capabilities?.ac_power_note) && (
                  <div className="relative group ml-2">
                    <InformationCircleIcon className="h-4 w-4 text-slate-400 cursor-help hover:text-slate-500 transition-colors" />
                    <div className="absolute bottom-full right-0 mb-2 w-max max-w-xs px-3 py-2 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                      {translateACPowerNote(car.charging_capabilities?.ac_power_note) || (car.charging_capabilities?.ac_power_max ? t.canBeUpgradedTo11kW : '')}
                    </div>
                  </div>
                )}
              </div>
              <p className="text-2xl font-semibold text-slate-900 mb-1">
                {car.charging_capabilities?.ac_power ? `${car.charging_capabilities.ac_power.toFixed(1).replace('.', ',')} kW${car.charging_port?.ac_current ? ` – ${car.charging_port.ac_current}A` : ''}${car.charging_port?.ac_phases === 1 ? (selectedLanguage === 'tr' ? ' / 230V 1-faz' : selectedLanguage === 'de' ? ' / 230V einphasig' : selectedLanguage === 'pl' ? ' / 230V jednofazowe' : ' / 230V single-phase') : car.charging_port?.ac_phases === 3 ? (selectedLanguage === 'tr' ? ' / 400V 3-faz' : selectedLanguage === 'de' ? ' / 400V dreiphasig' : selectedLanguage === 'pl' ? ' / 400V trójfazowe' : ' / 400V three-phase') : ''}` : '—'}
              </p>
              <p className="text-xs text-slate-500">{t.onboardChargerACDescription}</p>
            </div>

            {/* DC Fast Charging */}
            <div className="border-b border-emerald-200 pb-6">
              <div className="flex items-center mb-3">
                <BoltIcon className="h-6 w-6 text-emerald-600 mr-3" />
                <h3 className="font-bold text-slate-900 uppercase text-xs tracking-wide">{t.maxChargingPowerDC}</h3>
              </div>
              <p className="text-2xl font-semibold text-slate-900 mb-1">{dcChargingLabel || t.notSupported}</p>
              <p className="text-xs text-slate-500">{t.maxChargingPowerDCDescription}</p>
            </div>

            {/* Charging Socket (AC) */}
            {car.charging_port?.ac_type && (
              <div className="border-b border-emerald-200 pb-6">
                <div className="flex items-center mb-3">
                  <SparklesIcon className="h-6 w-6 text-emerald-600 mr-3" />
                  <h3 className="font-bold text-slate-900 uppercase text-xs tracking-wide">{t.chargingSocketAC}</h3>
                </div>
                <p className="text-2xl font-semibold text-slate-900 mb-1">{car.charging_port.ac_type.replace('AC ', '').replace(' (', '').replace(')', '')}</p>
                <p className="text-xs text-slate-500">{t.chargingSocketACDescription}</p>
              </div>
            )}

            {/* Fast Charging (DC) */}
            <div className="border-b border-emerald-200 pb-6">
              <div className="flex items-center mb-3">
                <BoltIcon className="h-6 w-6 text-emerald-600 mr-3" />
                <h3 className="font-bold text-slate-900 uppercase text-xs tracking-wide">{t.fastChargingDC}</h3>
              </div>
              <p className="text-2xl font-semibold text-slate-900 mb-1">
                {dcChargingLabel || t.notSupported}
              </p>
              <p className="text-xs text-slate-500">{t.fastChargingDCDescription}</p>
            </div>
          </div>
        </div>

        {/* Other Specifications - Clean Table Layout */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-12">
            {specifications.map((spec, index) => {
              const filteredItems = spec.items.filter(item => {
                // Şarj bilgilerini zaten gösterdik, filtrele
                const chargingLabels = [t.electricRangeLabel, t.batteryCapacityLabel, t.acCharging, t.dcCharging];
                return !chargingLabels.includes(item.label);
              });

              if (filteredItems.length === 0) return null;

              return (
                <div key={index}>
                  <h3 className="text-xs text-slate-500 uppercase tracking-[0.2em] mb-6 font-light border-b border-slate-200 pb-2">
                    {spec.category}
                  </h3>
                  <div className="space-y-4">
                    {filteredItems.map((item, itemIndex) => (
                      <div 
                        key={itemIndex} 
                        className={`flex justify-between items-start py-2.5 ${
                          (item as any).highlight ? 'border-b border-slate-900 pb-3 mb-1' : 'border-b border-slate-100'
                        }`}
                      >
                        <div className="flex items-start space-x-2.5 flex-1 min-w-0">
                          {(item as any).icon && React.createElement((item as any).icon, { className: `h-4 w-4 mt-0.5 flex-shrink-0 ${(item as any).highlight ? 'text-slate-900' : 'text-slate-400'}` })}
                          <span className={`text-sm ${(item as any).highlight ? 'font-semibold text-slate-900' : 'font-normal text-slate-700'}`}>{item.label}</span>
                        </div>
                        <div className="flex items-center space-x-2 ml-4 flex-shrink-0">
                          <span className={`text-sm text-right ${(item as any).highlight ? 'font-semibold text-slate-900' : 'font-normal text-slate-900'}`}>
                            {item.value}
                          </span>
                          {(item as any).hasInfo && (item as any).infoText && (
                            <div className="relative group flex-shrink-0">
                              <InformationCircleIcon className="h-4 w-4 text-slate-400 cursor-help hover:text-slate-500 transition-colors" />
                              <div className="absolute bottom-full right-0 mb-2 w-max max-w-xs px-3 py-2 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                {(item as any).infoText}
                              </div>
                            </div>
                          )}
                          {(item as any).hasSimulator && (
                            <button
                              onClick={() => setIsRangeSimulatorOpen(true)}
                              className="p-1 hover:text-slate-900 transition-colors flex-shrink-0"
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
              );
            })}
          </div>
        </div>

        {/* GEO & AI Optimized Semantic Key Specs Table */}
        <section id="key-specs" className="mt-12 bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Key Technical Specifications — {car.brand} {car.model} ({car.year})
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Official manufacturer and WLTP homologated technical data sheet for {car.brand} {car.model} plug-in hybrid.
            </p>
          </div>

          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-left text-sm divide-y divide-slate-200">
              <caption className="sr-only">
                Technical specifications sheet for {car.brand} {car.model} ({car.year}) Plug-in Hybrid
              </caption>
              <thead className="bg-slate-50 text-slate-700 text-xs uppercase font-semibold tracking-wider">
                <tr>
                  <th scope="col" className="px-4 py-3 sm:px-6">Specification Parameter</th>
                  <th scope="col" className="px-4 py-3 sm:px-6">Official Value</th>
                  <th scope="col" className="px-4 py-3 sm:px-6 hidden sm:table-cell">Standard / Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white text-slate-800">
                <tr className="hover:bg-slate-50/50">
                  <th scope="row" className="px-4 py-3 sm:px-6 font-medium text-slate-900">Vehicle Model</th>
                  <td className="px-4 py-3 sm:px-6 font-semibold">{car.brand} {car.model}</td>
                  <td className="px-4 py-3 sm:px-6 text-slate-500 hidden sm:table-cell">{car.year} Model Year • {car.segment}</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <th scope="row" className="px-4 py-3 sm:px-6 font-medium text-slate-900">WLTP Electric Range</th>
                  <td className="px-4 py-3 sm:px-6 font-semibold text-emerald-600">{car.ev_range_km} km</td>
                  <td className="px-4 py-3 sm:px-6 text-slate-500 hidden sm:table-cell">WLTP EAER (Combined pure electric)</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <th scope="row" className="px-4 py-3 sm:px-6 font-medium text-slate-900">Battery Capacity</th>
                  <td className="px-4 py-3 sm:px-6 font-semibold">
                    {car.usable_battery_kwh ? `${car.battery_kwh} kWh (Net: ${car.usable_battery_kwh} kWh)` : `${car.battery_kwh} kWh`}
                  </td>
                  <td className="px-4 py-3 sm:px-6 text-slate-500 hidden sm:table-cell">{car.battery_chemistry || 'Lithium-ion (Li-ion)'}</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <th scope="row" className="px-4 py-3 sm:px-6 font-medium text-slate-900">WLTP Fuel Consumption</th>
                  <td className="px-4 py-3 sm:px-6 font-semibold">{car.fuel_consumption} L / 100 km</td>
                  <td className="px-4 py-3 sm:px-6 text-slate-500 hidden sm:table-cell">WLTP Weighted Combined</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <th scope="row" className="px-4 py-3 sm:px-6 font-medium text-slate-900">CO₂ Emissions</th>
                  <td className="px-4 py-3 sm:px-6 font-semibold">{car.co2_emission} g / km</td>
                  <td className="px-4 py-3 sm:px-6 text-slate-500 hidden sm:table-cell">{car.emission_standard || 'Euro 6'} homologation</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <th scope="row" className="px-4 py-3 sm:px-6 font-medium text-slate-900">System Power Output</th>
                  <td className="px-4 py-3 sm:px-6 font-semibold">{car.power_hp} HP ({Math.round(car.power_hp * 0.7457)} kW)</td>
                  <td className="px-4 py-3 sm:px-6 text-slate-500 hidden sm:table-cell">ICE + Electric Combined</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <th scope="row" className="px-4 py-3 sm:px-6 font-medium text-slate-900">Combustion Engine</th>
                  <td className="px-4 py-3 sm:px-6 font-semibold">{car.engine_displacement ? `${car.engine_displacement} L` : 'Turbo Petrol'}</td>
                  <td className="px-4 py-3 sm:px-6 text-slate-500 hidden sm:table-cell">Internal Combustion Engine (ICE)</td>
                </tr>
                {car.electric_motor_power_hp && (
                  <tr className="hover:bg-slate-50/50">
                    <th scope="row" className="px-4 py-3 sm:px-6 font-medium text-slate-900">Electric Motor Output</th>
                    <td className="px-4 py-3 sm:px-6 font-semibold">{car.electric_motor_power_hp} HP ({Math.round(car.electric_motor_power_hp * 0.7457)} kW)</td>
                    <td className="px-4 py-3 sm:px-6 text-slate-500 hidden sm:table-cell">Synchronous electric motor</td>
                  </tr>
                )}
                <tr className="hover:bg-slate-50/50">
                  <th scope="row" className="px-4 py-3 sm:px-6 font-medium text-slate-900">AC Charging</th>
                  <td className="px-4 py-3 sm:px-6 font-semibold">
                    {car.ac_max_power_kw || car.charging_capabilities?.ac_power_max || car.charging_capabilities?.ac_power
                      ? `${car.ac_max_power_kw || car.charging_capabilities?.ac_power_max || car.charging_capabilities?.ac_power} kW${car.charge_time_ac ? ` (~${car.charge_time_ac} h)` : ''}`
                      : (car.charge_time_ac ? `~${car.charge_time_ac} h` : 'Type 2')}
                  </td>
                  <td className="px-4 py-3 sm:px-6 text-slate-500 hidden sm:table-cell">Type 2 (Mennekes) AC onboard charger</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <th scope="row" className="px-4 py-3 sm:px-6 font-medium text-slate-900">DC Fast Charging</th>
                  <td className="px-4 py-3 sm:px-6 font-semibold">
                    {car.dc_charging_supported || car.charging_capabilities?.dc_power ? (
                      <span className="text-emerald-600 font-semibold">
                        Yes ({car.charging_capabilities?.dc_power || car.dc_max_power_kw || 'Supported'} kW{car.charge_time_dc ? `, ~${car.charge_time_dc} min` : ''})
                      </span>
                    ) : (
                      <span className="text-slate-400">Not supported</span>
                    )}
                  </td>
                  <td className="px-4 py-3 sm:px-6 text-slate-500 hidden sm:table-cell">
                    {car.dc_charging_supported || car.charging_capabilities?.dc_power ? 'CCS / CHAdeMO DC rapid charge' : 'AC Charging only'}
                  </td>
                </tr>
                {car.acceleration_0_100 && (
                  <tr className="hover:bg-slate-50/50">
                    <th scope="row" className="px-4 py-3 sm:px-6 font-medium text-slate-900">Acceleration (0–100 km/h)</th>
                    <td className="px-4 py-3 sm:px-6 font-semibold">{car.acceleration_0_100} s</td>
                    <td className="px-4 py-3 sm:px-6 text-slate-500 hidden sm:table-cell">Official sprint time</td>
                  </tr>
                )}
                <tr className="hover:bg-slate-50/50">
                  <th scope="row" className="px-4 py-3 sm:px-6 font-medium text-slate-900">Seating Capacity</th>
                  <td className="px-4 py-3 sm:px-6 font-semibold">{car.seats} Seats</td>
                  <td className="px-4 py-3 sm:px-6 text-slate-500 hidden sm:table-cell">{car.seats >= 7 ? '3-Row Family Vehicle' : 'Standard 2-Row Layout'}</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <th scope="row" className="px-4 py-3 sm:px-6 font-medium text-slate-900">Luggage / Boot Capacity</th>
                  <td className="px-4 py-3 sm:px-6 font-semibold">
                    {car.trunk_volume} L {car.max_trunk_volume ? `(Max: ${car.max_trunk_volume} L)` : ''}
                  </td>
                  <td className="px-4 py-3 sm:px-6 text-slate-500 hidden sm:table-cell">VDA measurement method</td>
                </tr>
                {(car.length_mm && car.width_mm && car.height_mm) && (
                  <tr className="hover:bg-slate-50/50">
                    <th scope="row" className="px-4 py-3 sm:px-6 font-medium text-slate-900">Dimensions (L × W × H)</th>
                    <td className="px-4 py-3 sm:px-6 font-semibold">{car.length_mm} × {car.width_mm} × {car.height_mm} mm</td>
                    <td className="px-4 py-3 sm:px-6 text-slate-500 hidden sm:table-cell">Wheelbase: {car.wheelbase_mm || '-'} mm</td>
                  </tr>
                )}
                {car.weight_kg && (
                  <tr className="hover:bg-slate-50/50">
                    <th scope="row" className="px-4 py-3 sm:px-6 font-medium text-slate-900">Curb Weight</th>
                    <td className="px-4 py-3 sm:px-6 font-semibold">{car.weight_kg} kg</td>
                    <td className="px-4 py-3 sm:px-6 text-slate-500 hidden sm:table-cell">Unladen weight EU</td>
                  </tr>
                )}
                {car.euroncap_rating && (
                  <tr className="hover:bg-slate-50/50">
                    <th scope="row" className="px-4 py-3 sm:px-6 font-medium text-slate-900">Euro NCAP Safety</th>
                    <td className="px-4 py-3 sm:px-6 font-semibold text-amber-600">
                      {'★'.repeat(car.euroncap_rating.stars || 5)} ({car.euroncap_rating.stars || 5} Stars)
                    </td>
                    <td className="px-4 py-3 sm:px-6 text-slate-500 hidden sm:table-cell">
                      Adult: {car.euroncap_rating.adult_occupant}% • Child: {car.euroncap_rating.child_occupant}%
                    </td>
                  </tr>
                )}
                <tr className="hover:bg-slate-50/50">
                  <th scope="row" className="px-4 py-3 sm:px-6 font-medium text-slate-900">Manufacturer Warranty</th>
                  <td className="px-4 py-3 sm:px-6 font-semibold">{car.warranty_years} Years</td>
                  <td className="px-4 py-3 sm:px-6 text-slate-500 hidden sm:table-cell">Official European warranty coverage</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

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
