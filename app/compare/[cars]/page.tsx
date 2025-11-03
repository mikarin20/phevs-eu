'use client'

import { useState, useEffect, useRef } from 'react'
import { ArrowLeftIcon, XMarkIcon, CheckIcon, ShareIcon, ArrowDownTrayIcon, InformationCircleIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import carsData from '@/data/cars.json'
import EuroNCAPStars from '@/components/EuroNCAPStars'
import html2canvas from 'html2canvas'

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
  charge_time_dc?: number
  trunk_volume: number
  seats: number
  warranty_years: number
  country_availability: string
  slug: string
  engine_displacement?: number
  battery_chemistry?: string
  battery_architecture?: string
  charging_port?: {
    ac_type: string
    ac_location: string
    dc_type: string
    dc_location: string
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
}

interface ComparePageProps {
  params: {
    cars: string
  }
}

export default function ComparePage({ params }: ComparePageProps) {
  const [selectedCars, setSelectedCars] = useState<Car[]>([])
  const [selectedLanguage, setSelectedLanguage] = useState('en')
  const comparisonRef = useRef<HTMLDivElement>(null)

  const translations = {
    en: {
      backToHome: 'Back to Home',
      noVehiclesSelected: 'No vehicles selected',
      notEnoughVehicles: 'Not enough vehicles to compare',
      selectVehiclesMessage: 'Please select at least 2 vehicles to start comparison',
      goToHomePage: 'Go to Home Page',
      saveComparison: 'Save Comparison',
      shareComparison: 'Share Comparison',
      vehicleComparison: 'Vehicle Comparison',
      comparingVehicles: 'Comparing {count} vehicles',
      strengths: 'Strengths',
      weaknesses: 'Weaknesses',
      bestValue: 'Best Value',
      legendDescription: 'Highlighted cells indicate the best value in each category. Lower values are better for price, consumption, and emissions. Higher values are better for range, power, and capacity.'
    },
    tr: {
      backToHome: 'Ana Sayfaya Dön',
      noVehiclesSelected: 'Araç seçilmedi',
      notEnoughVehicles: 'Karşılaştırma için yeterli araç yok',
      selectVehiclesMessage: 'Karşılaştırma başlatmak için en az 2 araç seçin',
      goToHomePage: 'Ana Sayfaya Git',
      saveComparison: 'Karşılaştırmayı Kaydet',
      shareComparison: 'Karşılaştırmayı Paylaş',
      vehicleComparison: 'Araç Karşılaştırması',
      comparingVehicles: '{count} araç karşılaştırılıyor',
      strengths: 'Güçlü Yönler',
      weaknesses: 'Zayıf Yönler',
      bestValue: 'En İyi Değer',
      legendDescription: 'Vurgulanan hücreler her kategorideki en iyi değeri gösterir. Fiyat, tüketim ve emisyon için düşük değerler daha iyidir. Menzil, güç ve kapasite için yüksek değerler daha iyidir.'
    },
    de: {
      backToHome: 'Zurück zur Startseite',
      noVehiclesSelected: 'Keine Fahrzeuge ausgewählt',
      notEnoughVehicles: 'Nicht genügend Fahrzeuge zum Vergleichen',
      selectVehiclesMessage: 'Bitte wählen Sie mindestens 2 Fahrzeuge für den Vergleich',
      goToHomePage: 'Zur Startseite gehen',
      saveComparison: 'Vergleich speichern',
      shareComparison: 'Vergleich teilen',
      vehicleComparison: 'Fahrzeugvergleich',
      comparingVehicles: '{count} Fahrzeuge werden verglichen',
      strengths: 'Stärken',
      weaknesses: 'Schwächen',
      bestValue: 'Bester Wert',
      legendDescription: 'Hervorgehobene Zellen zeigen den besten Wert in jeder Kategorie. Niedrigere Werte sind besser für Preis, Verbrauch und Emissionen. Höhere Werte sind besser für Reichweite, Leistung und Kapazität.'
    },
    pl: {
      backToHome: 'Powrót do strony głównej',
      noVehiclesSelected: 'Nie wybrano pojazdów',
      notEnoughVehicles: 'Za mało pojazdów do porównania',
      selectVehiclesMessage: 'Wybierz co najmniej 2 pojazdy, aby rozpocząć porównanie',
      goToHomePage: 'Przejdź do strony głównej',
      saveComparison: 'Zapisz porównanie',
      shareComparison: 'Udostępnij porównanie',
      vehicleComparison: 'Porównanie pojazdów',
      comparingVehicles: 'Porównywanie {count} pojazdów',
      strengths: 'Mocne strony',
      weaknesses: 'Słabe strony',
      bestValue: 'Najlepsza wartość',
      legendDescription: 'Podświetlone komórki wskazują najlepszą wartość w każdej kategorii. Niższe wartości są lepsze dla ceny, zużycia i emisji. Wyższe wartości są lepsze dla zasięgu, mocy i pojemności.'
    }
  }

  const t = translations[selectedLanguage as keyof typeof translations] || translations.en

  useEffect(() => {
    const savedLanguage = localStorage.getItem('phevs-language') || 'en'
    setSelectedLanguage(savedLanguage)

    // Parse URL - handle both comma and -vs- formats
    let carIds: string[]
    if (params.cars.includes('-vs-')) {
      carIds = params.cars.split('-vs-')
    } else {
      carIds = params.cars.split(',')
    }
    
    // removed noisy logs in production
    
    const cars = carIds.map(id => {
      // Try exact ID match first
      let car = carsData.find(car => car.id === id)
      
      // If not found, try to find by slug or partial match
      if (!car) {
        car = carsData.find(car => 
          car.slug === id || 
          car.slug?.includes(id) ||
          id.includes(car.slug || '')
        )
      }
      
      return car
    }).filter(Boolean) as Car[]
    
    setSelectedCars(cars)
  }, [params.cars])

  const removeCar = (carId: string) => {
    const updatedCars = selectedCars.filter(car => car.id !== carId)
    setSelectedCars(updatedCars)
    
    if (updatedCars.length > 0) {
      const newUrl = `/compare/${updatedCars.map(car => car.id).join(',')}`
      window.history.pushState({}, '', newUrl)
    } else {
      window.location.href = '/'
    }
  }

  const shareToFacebook = () => {
    const url = encodeURIComponent(window.location.href)
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`
    window.open(facebookUrl, '_blank', 'width=600,height=400')
    console.log('Facebook share URL:', facebookUrl)
  }

  const shareToTwitter = () => {
    const url = encodeURIComponent(window.location.href)
    const text = encodeURIComponent('Check out this vehicle comparison!')
    const twitterUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`
    window.open(twitterUrl, '_blank', 'width=600,height=400')
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      const successMessages: Record<string, string> = {
        en: 'Comparison URL copied to clipboard!',
        tr: 'Karşılaştırma URL\'si panoya kopyalandı!',
        de: 'Vergleichs-URL in die Zwischenablage kopiert!',
        pl: 'URL porównania skopiowana do schowka!'
      }
      alert(successMessages[selectedLanguage] || successMessages.en)
    } catch (err) {
      const errorMessages: Record<string, string> = {
        en: 'Failed to copy URL to clipboard',
        tr: 'URL panoya kopyalanamadı',
        de: 'URL konnte nicht in die Zwischenablage kopiert werden',
        pl: 'Nie udało się skopiować URL do schowka'
      }
      alert(errorMessages[selectedLanguage] || errorMessages.en)
    }
  }

  const shareAsImage = async () => {
    if (!comparisonRef.current) return

    try {
      const canvas = await html2canvas(comparisonRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true
      })
      
      const dataUrl = canvas.toDataURL('image/png')
      
      if (navigator.share) {
        const blob = await fetch(dataUrl).then(res => res.blob())
        const file = new File([blob], 'vehicle-comparison.png', { type: 'image/png' })
        
        try {
          await navigator.share({
            title: 'Vehicle Comparison',
            text: 'Check out this vehicle comparison!',
            files: [file]
          })
        } catch (shareError) {
          // Fallback to download if share fails
          downloadImage(dataUrl)
        }
      } else {
        downloadImage(dataUrl)
      }
    } catch (error) {
      const errorMessages: Record<string, string> = {
        en: 'Could not create image. Please try again.',
        tr: 'Görüntü oluşturulamadı. Lütfen tekrar deneyin.',
        de: 'Bild konnte nicht erstellt werden. Bitte versuchen Sie es erneut.',
        pl: 'Nie można utworzyć obrazu. Spróbuj ponownie.'
      }
      alert(errorMessages[selectedLanguage] || errorMessages.en)
    }
  }

  const downloadImage = (dataUrl: string) => {
    const link = document.createElement('a')
    link.download = 'vehicle-comparison.png'
    link.href = dataUrl
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    const successMessages: Record<string, string> = {
      en: 'Image downloaded successfully!',
      tr: 'Görüntü başarıyla indirildi!',
      de: 'Bild erfolgreich heruntergeladen!',
      pl: 'Obraz został pomyślnie pobrany!'
    }
    alert(successMessages[selectedLanguage] || successMessages.en)
  }

  const captureComparison = async () => {
    if (!comparisonRef.current) return null

    try {
      const canvas = await html2canvas(comparisonRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true
      })
      return canvas.toDataURL('image/png')
    } catch (error) {
      console.error('Error capturing comparison:', error)
      return null
    }
  }

  const getBestValue = (cars: Car[], key: keyof Car) => {
    if (cars.length === 0) return null
    
    const values = cars.map(car => car[key]).filter(val => val !== null && val !== undefined)
    if (values.length === 0) return null
    
    // Handle special cases for non-numeric values
    if (key === 'euroncap_rating') {
      const ratings = values.filter(val => val && typeof val === 'object' && 'stars' in val) as any[]
      if (ratings.length === 0) return null
      return ratings.reduce((best, current) => current.stars > best.stars ? current : best)
    }
    
    if (key === 'price_eur' || key === 'fuel_consumption' || key === 'co2_emission' || key === 'charge_time_ac') {
      return Math.min(...values as number[])
    } else {
      return Math.max(...values as number[])
    }
  }

  const isBestValue = (car: Car, key: keyof Car, bestValue: any) => {
    return car[key] === bestValue
  }

  const comparisonRows = [
    { label: 'Starting Price', key: 'price_eur' as keyof Car, format: (val: any) => typeof val === 'number' ? `€${val.toLocaleString()}` : 'N/A', highlight: true },
    { label: 'Electric Range', key: 'ev_range_km' as keyof Car, format: (val: any) => typeof val === 'number' ? `${val} km` : 'N/A', highlight: true },
    { label: 'Fuel Consumption', key: 'fuel_consumption' as keyof Car, format: (val: any) => typeof val === 'number' ? `${val} L/100km` : 'N/A', highlight: true },
    { label: 'Battery Capacity', key: 'battery_kwh' as keyof Car, format: (val: any) => typeof val === 'number' ? `${val} kWh` : 'N/A', highlight: true },
    { label: 'Power', key: 'power_hp' as keyof Car, format: (val: any) => typeof val === 'number' ? `${val} HP` : 'N/A', highlight: true },
    { label: 'Engine Displacement', key: 'engine_displacement' as keyof Car, format: (val: any) => typeof val === 'number' ? `${val} L` : 'N/A', highlight: false },
    { label: 'CO₂ Emissions', key: 'co2_emission' as keyof Car, format: (val: any) => typeof val === 'number' ? `${val} g/km` : 'N/A', highlight: true },
    { label: 'AC Charge Time', key: 'charge_time_ac' as keyof Car, format: (val: any) => typeof val === 'number' ? `${val}h` : 'N/A', highlight: true },
    { label: 'DC Charge Time', key: 'charge_time_dc' as keyof Car, format: (val: any) => typeof val === 'number' ? `${val}h` : 'N/A', highlight: true },
    { label: 'Trunk Volume', key: 'trunk_volume' as keyof Car, format: (val: any) => typeof val === 'number' ? `${val} L` : 'N/A', highlight: true },
    { label: 'Seats', key: 'seats' as keyof Car, format: (val: any) => typeof val === 'number' ? `${val}` : 'N/A', highlight: false },
    { label: 'Warranty', key: 'warranty_years' as keyof Car, format: (val: any) => typeof val === 'number' ? `${val} years` : 'N/A', highlight: true },
    { label: 'Euro NCAP Rating', key: 'euroncap_rating' as keyof Car, format: (val: any) => val && typeof val === 'object' && 'stars' in val ? `${val.stars}/5` : 'N/A', highlight: true }
  ]

  if (selectedCars.length < 2) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100">
        <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-slate-200/50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <Link href="/" className="inline-flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-colors">
                <ArrowLeftIcon className="h-5 w-5" />
                <span className="font-medium text-sm">{t.backToHome}</span>
              </Link>
              <div className="w-20"></div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-12 text-center">
            <div className="text-8xl mb-6">⚔️</div>
            <h1 className="text-2xl font-bold text-slate-900 mb-4">
              {selectedCars.length === 0 ? t.noVehiclesSelected : t.notEnoughVehicles}
            </h1>
            <p className="text-base text-slate-600 mb-8 max-w-2xl mx-auto">
              {t.selectVehiclesMessage}
            </p>
            <Link href="/" className="inline-flex items-center space-x-2 px-6 py-3 font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
              <ArrowLeftIcon className="h-5 w-5" />
              <span>{t.goToHomePage}</span>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-slate-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mobile Header */}
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Back Button - Mobilde sadece ikon, desktop'ta ikon + metin */}
            <Link href="/" className="inline-flex items-center space-x-1 sm:space-x-2 text-slate-600 hover:text-slate-900 transition-colors group min-w-0 flex-shrink-0">
              <ArrowLeftIcon className="h-5 w-5 group-hover:-translate-x-1 transition-transform flex-shrink-0" />
              <span className="font-medium text-xs sm:text-sm hidden sm:inline whitespace-nowrap">{t.backToHome}</span>
            </Link>
            
            {/* Center Title - Mobilde daha kompakt */}
            <div className="text-center flex-1 px-2 min-w-0">
              <h1 className="text-base sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent truncate">
                {t.vehicleComparison}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 truncate">{t.comparingVehicles.replace('{count}', selectedCars.length.toString())}</p>
            </div>
            
            {/* Action Buttons - Mobilde daha kompakt */}
            <div className="flex items-center space-x-1.5 sm:space-x-3 min-w-0 flex-shrink-0">
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
                className="px-2.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap"
              >
                <span className="hidden sm:inline">Save</span>
                <ArrowDownTrayIcon className="h-4 w-4 sm:hidden" />
              </button>
              
              <div className="relative group">
                <button
                  onClick={() => document.getElementById('shareDropdown')?.classList.toggle('hidden')}
                  className="px-2.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-1 whitespace-nowrap"
                >
                  <ShareIcon className="h-4 w-4 flex-shrink-0" />
                  <span className="hidden sm:inline">Share</span>
                </button>
                <div id="shareDropdown" className="absolute right-0 top-full mt-2 hidden bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-gray-200 dark:border-slate-700 min-w-[180px] z-50">
                  <button
                    onClick={() => {
                      shareToFacebook()
                      document.getElementById('shareDropdown')?.classList.add('hidden')
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-slate-700 rounded-t-lg flex items-center space-x-2"
                  >
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                    <span>Facebook</span>
                  </button>
                  <button
                    onClick={() => {
                      shareToTwitter()
                      document.getElementById('shareDropdown')?.classList.add('hidden')
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-slate-700 flex items-center space-x-2"
                  >
                    <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                    <span>Twitter</span>
                  </button>
                  <button
                    onClick={() => {
                      copyToClipboard()
                      document.getElementById('shareDropdown')?.classList.add('hidden')
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-slate-700 flex items-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                    <span>Copy URL</span>
                  </button>
                  <button
                    onClick={() => {
                      shareAsImage()
                      document.getElementById('shareDropdown')?.classList.add('hidden')
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-slate-700 rounded-b-lg flex items-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                    <span>Share as Image</span>
                  </button>
                </div>
              </div>

              <button
                onClick={async () => {
                  const dataUrl = await captureComparison()
                  if (dataUrl) {
                    downloadImage(dataUrl)
                  } else {
                    const errorMessages: Record<string, string> = {
                      en: 'Could not create image. Please try again.',
                      tr: 'Görüntü oluşturulamadı. Lütfen tekrar deneyin.',
                      de: 'Bild konnte nicht erstellt werden. Bitte versuchen Sie es erneut.',
                      pl: 'Nie można utworzyć obrazu. Spróbuj ponownie.'
                    }
                    alert(errorMessages[selectedLanguage] || errorMessages.en)
                  }
                }}
                className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center space-x-1"
              >
                <ArrowDownTrayIcon className="h-4 w-4" />
                <span>Download</span>
              </button>
            </div>
          </div>

          {/* Mobile Header */}
          <div className="hidden">
            <div className="flex items-center justify-between h-20 px-4">
              <Link href="/" className="inline-flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-colors">
                <ArrowLeftIcon className="h-5 w-5" />
                <span className="font-medium text-sm">{t.backToHome}</span>
              </Link>
              
              <div className="text-center flex-1 px-2">
                <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Comparison
                </h1>
                <p className="text-xs text-slate-500">{selectedCars.length} vehicles</p>
              </div>
              
              <div className="w-20"></div>
            </div>
            
            {/* Bottom Row - Action Buttons */}
            <div className="flex items-center justify-center space-x-2 pb-4 px-4">
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
                className="px-3 py-2 text-xs font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Save
              </button>
              
              <div className="relative">
                <button
                  onClick={() => document.getElementById('shareDropdownMobile')?.classList.toggle('hidden')}
                  className="px-3 py-2 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-1"
                >
                  <ShareIcon className="h-3 w-3" />
                  <span>Share</span>
                </button>
                <div id="shareDropdownMobile" className="absolute right-0 top-full mt-1 hidden bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-gray-200 dark:border-slate-700 min-w-[160px] z-50">
                  <button
                    onClick={() => {
                      shareToFacebook()
                      document.getElementById('shareDropdownMobile')?.classList.add('hidden')
                    }}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-gray-100 dark:hover:bg-slate-700 rounded-t-lg flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                    <span>Facebook</span>
                  </button>
                  <button
                    onClick={() => {
                      shareToTwitter()
                      document.getElementById('shareDropdownMobile')?.classList.add('hidden')
                    }}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-gray-100 dark:hover:bg-slate-700 flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                    <span>Twitter</span>
                  </button>
                  <button
                    onClick={() => {
                      copyToClipboard()
                      document.getElementById('shareDropdownMobile')?.classList.add('hidden')
                    }}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-gray-100 dark:hover:bg-slate-700 flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                    <span>Copy URL</span>
                  </button>
                  <button
                    onClick={() => {
                      shareAsImage()
                      document.getElementById('shareDropdownMobile')?.classList.add('hidden')
                    }}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-gray-100 dark:hover:bg-slate-700 rounded-b-lg flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                    <span>Share as Image</span>
                  </button>
                </div>
              </div>

              <button
                onClick={async () => {
                  const dataUrl = await captureComparison()
                  if (dataUrl) {
                    downloadImage(dataUrl)
                  } else {
                    const errorMessages: Record<string, string> = {
                      en: 'Could not create image. Please try again.',
                      tr: 'Görüntü oluşturulamadı. Lütfen tekrar deneyin.',
                      de: 'Bild konnte nicht erstellt werden. Bitte versuchen Sie es erneut.',
                      pl: 'Nie można utworzyć obrazu. Spróbuj ponownie.'
                    }
                    alert(errorMessages[selectedLanguage] || errorMessages.en)
                  }
                }}
                className="px-3 py-2 text-xs font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center space-x-1"
              >
                <ArrowDownTrayIcon className="h-3 w-3" />
                <span>Download</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div ref={comparisonRef}>
          {/* Vehicle Cards */}
          <div className={`grid gap-6 sm:gap-8 mb-12 ${
            selectedCars.length === 2 
              ? 'grid-cols-1 sm:grid-cols-2' 
              : 'grid-cols-1 sm:grid-cols-3'
          }`}>
            {selectedCars.map((car) => (
              <div key={car.id} className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden relative">
                {/* Remove Button */}
                <button
                  onClick={() => removeCar(car.id)}
                  className="absolute top-4 right-4 w-8 h-8 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-full flex items-center justify-center transition-all z-10"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>

                {/* Car Image */}
                <div className="aspect-[16/9] w-full bg-gradient-to-br from-slate-100 to-slate-200">
                  <img
                    src={car.image_url}
                    alt={`${car.brand} ${car.model}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      console.log('Karşılaştırma sayfası resim yüklenemedi:', car.image_url)
                      e.currentTarget.src = '/images/placeholder-car.jpg'
                    }}
                  />
                </div>

                {/* Car Info */}
                <div className="p-6">
                  <div className="text-center mb-4">
                    <h2 className="text-lg font-bold text-slate-900 mb-1">
                      {car.brand} {car.model}
                    </h2>
                    <p className="text-sm text-slate-600 mb-3">{car.year} • {car.segment}</p>
                    {car.euroncap_rating && (
                      <div className="mb-4 flex justify-center">
                        <EuroNCAPStars rating={car.euroncap_rating} size="sm" />
                      </div>
                    )}
                  </div>
                  
                  {/* Price */}
                  <div className="text-center">
                    <p className="text-xs text-slate-500 uppercase tracking-widest mb-2">Starting Price</p>
                    <div className="flex items-baseline justify-center space-x-2">
                      <span className="text-2xl font-light text-slate-900">€{car.price_eur.toLocaleString()}</span>
                      <div className="relative group">
                        <InformationCircleIcon className="h-3 w-3 text-slate-400 cursor-help" />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                          Estimated EU market value
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Comparison Table */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="px-4 sm:px-6 py-4 bg-slate-50 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">Detailed Comparison</h2>
            </div>
            
            {/* Desktop: Table View */}
            <div className="hidden md:block overflow-x-auto">
              <div className="min-w-full">
                {/* Header Row */}
                <div className="flex bg-slate-50 border-b border-slate-200">
                  <div className="w-48 px-6 py-4 text-sm font-medium text-slate-700 border-r border-slate-200">
                    Specification
                  </div>
                  {selectedCars.map((car) => (
                    <div key={car.id} className="flex-1 px-6 py-4 text-center">
                      <div className="text-sm font-medium text-slate-900">{car.brand}</div>
                      <div className="text-xs text-slate-600">{car.model}</div>
                    </div>
                  ))}
                </div>

                {/* Data Rows */}
                {comparisonRows.map((row) => {
                  const bestValue = getBestValue(selectedCars, row.key)
                  return (
                    <div key={row.label} className="flex border-b border-slate-200 hover:bg-slate-50/50">
                      <div className="w-48 px-6 py-4 text-sm font-medium text-slate-700 border-r border-slate-200 flex items-center">
                        {row.label}
                      </div>
                      {selectedCars.map((car) => {
                        const value = car[row.key]
                        const isBest = row.highlight && isBestValue(car, row.key, bestValue)
                        return (
                          <div key={car.id} className="flex-1 px-6 py-4 text-center border-r border-slate-200 last:border-r-0">
                            <div className={`font-bold text-sm ${isBest ? 'text-green-700' : 'text-slate-800'}`}>
                              {row.format(value)}
                            </div>
                            {isBest && (
                              <div className="flex items-center justify-center mt-2 bg-green-50 border border-green-200 rounded-lg px-2 py-1 text-green-700 text-xs font-medium">
                                <CheckIcon className="h-3 w-3 mr-1" />
                                {t.bestValue}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Mobile: Card View */}
            <div className="md:hidden divide-y divide-slate-200">
              {comparisonRows.map((row) => {
                const bestValue = getBestValue(selectedCars, row.key)
                return (
                  <div key={row.label} className="p-4 hover:bg-slate-50/50">
                    {/* Specification Label */}
                    <div className="mb-3">
                      <h3 className="text-sm font-semibold text-slate-700">{row.label}</h3>
                    </div>
                    
                    {/* Car Values - Stacked */}
                    <div className="space-y-3">
                      {selectedCars.map((car) => {
                        const value = car[row.key]
                        const isBest = row.highlight && isBestValue(car, row.key, bestValue)
                        return (
                          <div 
                            key={car.id} 
                            className={`flex items-center justify-between p-3 rounded-lg border-2 ${
                              isBest 
                                ? 'bg-green-50 border-green-300' 
                                : 'bg-slate-50 border-slate-200'
                            }`}
                          >
                            <div className="flex-1 min-w-0">
                              <div className="text-xs text-slate-600 mb-1 truncate">
                                {car.brand} {car.model}
                              </div>
                              <div className={`text-lg font-bold ${isBest ? 'text-green-700' : 'text-slate-800'}`}>
                                {row.format(value)}
                              </div>
                            </div>
                            {isBest && (
                              <div className="ml-2 flex-shrink-0 flex items-center bg-green-100 border border-green-300 rounded-full px-2.5 py-1 text-green-700 text-xs font-semibold">
                                <CheckIcon className="h-3.5 w-3.5 mr-1" />
                                {t.bestValue}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Strengths Summary */}
          {selectedCars.length >= 2 && (
            <div className="mt-12 grid gap-6 sm:gap-8 md:grid-cols-2">
              {/* Strengths */}
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckIcon className="h-5 w-5 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">{t.strengths}</h3>
                </div>
                <div className="space-y-3">
                  {selectedCars.map((car) => {
                    const strengths: string[] = []
                    
                    // Find strengths for this car
                    comparisonRows.forEach(row => {
                      if (row.highlight) {
                        const bestValue = getBestValue(selectedCars, row.key)
                        if (isBestValue(car, row.key, bestValue)) {
                          strengths.push(row.label)
                        }
                      }
                    })
                    
                    return (
                      <div key={car.id} className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-slate-900 text-sm">{car.brand} {car.model}</div>
                          <div className="text-xs text-slate-600 mt-1">
                            {strengths.length > 0 ? strengths.join(', ') : 'No specific strengths'}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Weaknesses */}
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                    <XMarkIcon className="h-5 w-5 text-red-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">{t.weaknesses}</h3>
                </div>
                <div className="space-y-3">
                  {selectedCars.map((car) => {
                    const weaknesses: string[] = []
                    
                    // Find weaknesses for this car
                    comparisonRows.forEach(row => {
                      if (row.highlight) {
                        const bestValue = getBestValue(selectedCars, row.key)
                        if (!isBestValue(car, row.key, bestValue)) {
                          weaknesses.push(row.label)
                        }
                      }
                    })
                    
                    return (
                      <div key={car.id} className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-slate-900 text-sm">{car.brand} {car.model}</div>
                          <div className="text-xs text-slate-600 mt-1">
                            {weaknesses.length > 0 ? weaknesses.join(', ') : 'No specific weaknesses'}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Legend */}
          <div className="mt-12 bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
            <div className="flex items-start space-x-6">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg"></div>
                <span className="text-sm font-medium text-slate-700">{t.bestValue}</span>
              </div>
              <p className="text-sm text-slate-600 flex-1">
                {t.legendDescription}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}