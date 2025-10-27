'use client'

import { useState, useEffect, useRef } from 'react'
import { ArrowLeftIcon, XMarkIcon, CheckIcon, XCircleIcon, InformationCircleIcon, ShareIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline'
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
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en')
  const [isClient, setIsClient] = useState(false)
  const comparisonRef = useRef<HTMLDivElement>(null)

  // Çeviri sistemi
  const translations = {
    en: {
      backToHome: 'Back to Home',
      saveComparison: 'Save Comparison',
      shareComparison: 'Share Comparison',
      noVehiclesSelected: 'No Vehicles Selected',
      notEnoughVehicles: 'Not Enough Vehicles Selected',
      selectVehiclesMessage: 'Please select at least 2 vehicles (up to 3) from the home page to compare them',
      goToHomePage: 'Go to Home Page',
      remove: 'Remove',
      addVehicle: 'Add Vehicle',
      downloadImage: 'Download Image',
      shareImage: 'Share Image',
      price: 'Price',
      electricRange: 'Electric Range',
      batteryCapacity: 'Battery Capacity',
      power: 'Power',
      co2Emission: 'CO₂ Emission',
      chargeTimeAC: 'AC Charge Time',
      chargeTimeDC: 'DC Charge Time',
      trunkVolume: 'Trunk Volume',
      seats: 'Seats',
      warranty: 'Warranty',
      realWorldRange: 'Real World Range',
      testDate: 'Test',
      update: 'Update',
      dataNotFound: 'Data not found',
      selectToCompare: 'Please select a vehicle to compare',
      priceEur: 'Price (EUR)',
      electricRangeKm: 'Electric Range (km)',
      batteryCapacityKwh: 'Battery Capacity (kWh)',
      powerHp: 'Power (HP)',
      co2EmissionGkm: 'CO₂ Emission (g/km)',
      chargeTimeACHours: 'AC Charge Time (hours)',
      chargeTimeDCHours: 'DC Charge Time (hours)',
      trunkVolumeL: 'Trunk Volume (L)',
      seatsCount: 'Seats',
      warrantyYears: 'Warranty (years)',
      engineDisplacementL: 'Engine Displacement (L)',
      batteryChemistry: 'Battery Chemistry',
      batteryArchitecture: 'Battery Architecture',
      chargingPortLocation: 'Charging Port Location',
      acPortType: 'AC Port Type',
      brand: 'Brand',
      model: 'Model',
      year: 'Year',
      segment: 'Segment',
      dcChargeTimeMinutes: 'DC Charge Time (minutes)',
      fuelConsumptionL100km: 'Fuel Consumption (L/100km)',
      overallRating: 'Overall Rating',
      adultOccupantProtection: 'Adult Occupant Protection',
      childOccupantProtection: 'Child Occupant Protection',
      pedestrianProtection: 'Pedestrian Protection',
      safetyAssist: 'Safety Assist',
      countryAvailability: 'Country Availability',
      strongPoints: 'Strong Points',
      bestPrice: 'Best Price',
      highestElectricRange: 'Highest Electric Range',
      largestBatteryCapacity: 'Largest Battery Capacity',
      highestPower: 'Highest Power',
      lowestFuelConsumption: 'Lowest Fuel Consumption',
      lowestCO2Emission: 'Lowest CO₂ Emission',
      largestTrunkVolume: 'Largest Trunk Volume',
      fastestACCharging: 'Fastest AC Charging',
      fastestDCCharging: 'Fastest DC Charging',
      longestWarranty: 'Longest Warranty'
    },
    de: {
      backToHome: 'Zurück zur Startseite',
      saveComparison: 'Vergleich speichern',
      shareComparison: 'Vergleich teilen',
      noVehiclesSelected: 'Keine Fahrzeuge ausgewählt',
      notEnoughVehicles: 'Nicht genügend Fahrzeuge ausgewählt',
      selectVehiclesMessage: 'Bitte wählen Sie mindestens 2 Fahrzeuge (bis zu 3) von der Startseite aus, um sie zu vergleichen',
      goToHomePage: 'Zur Startseite gehen',
      remove: 'Entfernen',
      addVehicle: 'Fahrzeug hinzufügen',
      downloadImage: 'Bild herunterladen',
      shareImage: 'Bild teilen',
      price: 'Preis',
      electricRange: 'Elektrische Reichweite',
      batteryCapacity: 'Batteriekapazität',
      power: 'Leistung',
      co2Emission: 'CO₂-Emission',
      chargeTimeAC: 'AC-Ladezeit',
      chargeTimeDC: 'DC-Ladezeit',
      trunkVolume: 'Kofferraumvolumen',
      seats: 'Sitze',
      warranty: 'Garantie',
      realWorldRange: 'Reale Reichweite',
      testDate: 'Test',
      update: 'Aktualisierung',
      dataNotFound: 'Daten nicht gefunden',
      selectToCompare: 'Bitte wählen Sie ein Fahrzeug zum Vergleichen',
      priceEur: 'Preis (EUR)',
      electricRangeKm: 'Elektrische Reichweite (km)',
      batteryCapacityKwh: 'Batteriekapazität (kWh)',
      powerHp: 'Leistung (PS)',
      co2EmissionGkm: 'CO₂-Emission (g/km)',
      chargeTimeACHours: 'AC-Ladezeit (Stunden)',
      chargeTimeDCHours: 'DC-Ladezeit (Stunden)',
      trunkVolumeL: 'Kofferraumvolumen (L)',
      seatsCount: 'Sitze',
      warrantyYears: 'Garantie (Jahre)',
      engineDisplacementL: 'Hubraum (L)',
      batteryChemistry: 'Batteriechemie',
      batteryArchitecture: 'Batteriearchitektur',
      chargingPortLocation: 'Ladeanschluss-Position',
      acPortType: 'AC-Anschlusstyp',
      brand: 'Marke',
      model: 'Modell',
      year: 'Jahr',
      segment: 'Segment',
      dcChargeTimeMinutes: 'DC-Ladezeit (Minuten)',
      fuelConsumptionL100km: 'Kraftstoffverbrauch (L/100km)',
      overallRating: 'Gesamtbewertung',
      adultOccupantProtection: 'Erwachsenenschutz',
      childOccupantProtection: 'Kinderschutz',
      pedestrianProtection: 'Fußgängerschutz',
      safetyAssist: 'Sicherheitsassistent',
      countryAvailability: 'Länderverfügbarkeit',
      strongPoints: 'Stärken',
      bestPrice: 'Bester Preis',
      highestElectricRange: 'Höchste Elektrische Reichweite',
      largestBatteryCapacity: 'Größte Batteriekapazität',
      highestPower: 'Höchste Leistung',
      lowestFuelConsumption: 'Niedrigster Kraftstoffverbrauch',
      lowestCO2Emission: 'Niedrigste CO₂-Emission',
      largestTrunkVolume: 'Größtes Kofferraumvolumen',
      fastestACCharging: 'Schnellstes AC-Laden',
      fastestDCCharging: 'Schnellstes DC-Laden',
      longestWarranty: 'Längste Garantie'
    },
    tr: {
      backToHome: 'Ana Sayfaya Dön',
      saveComparison: 'Karşılaştırmayı Kaydet',
      shareComparison: 'Karşılaştırmayı Paylaş',
      noVehiclesSelected: 'Araç Seçilmedi',
      notEnoughVehicles: 'Yeterli Araç Seçilmedi',
      selectVehiclesMessage: 'Lütfen karşılaştırmak için ana sayfadan en az 2 araç (en fazla 3) seçin',
      goToHomePage: 'Ana Sayfaya Git',
      remove: 'Kaldır',
      addVehicle: 'Araç Ekle',
      downloadImage: 'Görseli İndir',
      shareImage: 'Görseli Paylaş',
      price: 'Fiyat',
      electricRange: 'Elektrik Menzili',
      batteryCapacity: 'Batarya Kapasitesi',
      power: 'Güç',
      co2Emission: 'CO₂ Emisyonu',
      chargeTimeAC: 'AC Şarj Süresi',
      chargeTimeDC: 'DC Şarj Süresi',
      trunkVolume: 'Bagaj Hacmi',
      seats: 'Koltuk',
      warranty: 'Garanti',
      realWorldRange: 'Gerçek Menzil',
      testDate: 'Test',
      update: 'Güncelleme',
      dataNotFound: 'Veri bulunamadı',
      selectToCompare: 'Lütfen önce karşılaştırmak için araç seçin',
      priceEur: 'Fiyat (EUR)',
      electricRangeKm: 'Elektrik Menzili (km)',
      batteryCapacityKwh: 'Batarya Kapasitesi (kWh)',
      powerHp: 'Güç (HP)',
      co2EmissionGkm: 'CO₂ Emisyonu (g/km)',
      chargeTimeACHours: 'AC Şarj Süresi (saat)',
      chargeTimeDCHours: 'DC Şarj Süresi (saat)',
      trunkVolumeL: 'Bagaj Hacmi (L)',
      seatsCount: 'Koltuk',
      warrantyYears: 'Garanti (yıl)',
      engineDisplacementL: 'Motor Hacmi (L)',
      batteryChemistry: 'Batarya Kimyası',
      batteryArchitecture: 'Batarya Mimarisi',
      chargingPortLocation: 'Şarj Portu Konumu',
      acPortType: 'AC Port Tipi',
      brand: 'Marka',
      model: 'Model',
      year: 'Yıl',
      segment: 'Segment',
      dcChargeTimeMinutes: 'DC Şarj Süresi (dakika)',
      fuelConsumptionL100km: 'Yakıt Tüketimi (L/100km)',
      overallRating: 'Genel Değerlendirme',
      adultOccupantProtection: 'Yetişkin Koruma',
      childOccupantProtection: 'Çocuk Koruma',
      pedestrianProtection: 'Yaya Koruma',
      safetyAssist: 'Güvenlik Asistanı',
      countryAvailability: 'Ülke Mevcudiyeti',
      strongPoints: 'Güçlü Yönler',
      bestPrice: 'En Uygun Fiyat',
      highestElectricRange: 'En Yüksek Elektrik Menzili',
      largestBatteryCapacity: 'En Büyük Batarya Kapasitesi',
      highestPower: 'En Yüksek Güç',
      lowestFuelConsumption: 'En Düşük Yakıt Tüketimi',
      lowestCO2Emission: 'En Düşük CO₂ Emisyonu',
      largestTrunkVolume: 'En Büyük Bagaj Hacmi',
      fastestACCharging: 'En Hızlı AC Şarj',
      fastestDCCharging: 'En Hızlı DC Şarj',
      longestWarranty: 'En Uzun Garanti Süresi'
    },
    pl: {
      backToHome: 'Powrót do strony głównej',
      saveComparison: 'Zapisz porównanie',
      shareComparison: 'Udostępnij porównanie',
      noVehiclesSelected: 'Nie wybrano pojazdów',
      notEnoughVehicles: 'Nie wybrano wystarczającej liczby pojazdów',
      selectVehiclesMessage: 'Proszę wybrać co najmniej 2 pojazdy (maksymalnie 3) ze strony głównej, aby je porównać',
      goToHomePage: 'Przejdź do strony głównej',
      remove: 'Usuń',
      addVehicle: 'Dodaj pojazd',
      downloadImage: 'Pobierz obraz',
      shareImage: 'Udostępnij obraz',
      price: 'Cena',
      electricRange: 'Zasięg elektryczny',
      batteryCapacity: 'Pojemność baterii',
      power: 'Moc',
      co2Emission: 'Emisja CO₂',
      chargeTimeAC: 'Czas ładowania AC',
      chargeTimeDC: 'Czas ładowania DC',
      trunkVolume: 'Pojemność bagażnika',
      seats: 'Miejsca',
      warranty: 'Gwarancja',
      realWorldRange: 'Rzeczywisty Zasięg',
      testDate: 'Test',
      update: 'Aktualizacja',
      dataNotFound: 'Nie znaleziono danych',
      selectToCompare: 'Wybierz pojazd do porównania',
      priceEur: 'Cena (EUR)',
      electricRangeKm: 'Zasięg elektryczny (km)',
      batteryCapacityKwh: 'Pojemność baterii (kWh)',
      powerHp: 'Moc (KM)',
      co2EmissionGkm: 'Emisja CO₂ (g/km)',
      chargeTimeACHours: 'Czas ładowania AC (godziny)',
      chargeTimeDCHours: 'Czas ładowania DC (godziny)',
      trunkVolumeL: 'Pojemność bagażnika (L)',
      seatsCount: 'Miejsca',
      warrantyYears: 'Gwarancja (lata)',
      engineDisplacementL: 'Pojemność silnika (L)',
      batteryChemistry: 'Chemia baterii',
      batteryArchitecture: 'Architektura baterii',
      chargingPortLocation: 'Lokalizacja portu ładowania',
      acPortType: 'Typ portu AC',
      brand: 'Marka',
      model: 'Model',
      year: 'Rok',
      segment: 'Segment',
      dcChargeTimeMinutes: 'Czas ładowania DC (minuty)',
      fuelConsumptionL100km: 'Zużycie paliwa (L/100km)',
      overallRating: 'Ogólna ocena',
      adultOccupantProtection: 'Ochrona dorosłych',
      childOccupantProtection: 'Ochrona dzieci',
      pedestrianProtection: 'Ochrona pieszych',
      safetyAssist: 'Asystent bezpieczeństwa',
      countryAvailability: 'Dostępność w krajach',
      strongPoints: 'Mocne strony',
      bestPrice: 'Najlepsza Cena',
      highestElectricRange: 'Najwyższy Zasięg Elektryczny',
      largestBatteryCapacity: 'Największa Pojemność Baterii',
      highestPower: 'Najwyższa Moc',
      lowestFuelConsumption: 'Najniższe Zużycie Paliwa',
      lowestCO2Emission: 'Najniższa Emisja CO₂',
      largestTrunkVolume: 'Największa Pojemność Bagażnika',
      fastestACCharging: 'Najszybsze Ładowanie AC',
      fastestDCCharging: 'Najszybsze Ładowanie DC',
      longestWarranty: 'Najdłuższa Gwarancja'
    }
  }

  const t = isClient ? translations[selectedLanguage as keyof typeof translations] : translations['en']

  // URL'yi güncelle
  const updateUrl = (cars: Car[]) => {
    if (cars.length >= 2) {
      const carSlugs = cars.map(car => car.slug).join('-vs-')
      const newUrl = `/compare/${carSlugs}`
      window.history.pushState({}, '', newUrl)
    } else if (cars.length === 1) {
      window.history.pushState({}, '', '/compare')
    }
  }

  useEffect(() => {
    // URL'den araç slug'larını al
    const carSlugs = params.cars.split('-vs-')
    console.log('Car slugs from URL:', carSlugs)
    console.log('carsData length:', carsData.length)
    console.log('First few cars:', carsData.slice(0, 3).map(car => ({ id: car.id, slug: car.slug })))
    
    // Slug'lardan araçları bul
    const carsFromUrl = carSlugs.map(slug => {
      const found = carsData.find(car => car.slug === slug)
      console.log(`Looking for slug "${slug}":`, found ? 'FOUND' : 'NOT FOUND')
      return found
    }).filter(Boolean) as Car[]
    
    console.log('Cars found from URL:', carsFromUrl.length, carsFromUrl.map(car => car.slug))
    
    if (carsFromUrl.length > 0) {
      setSelectedCars(carsFromUrl)
      console.log('Cars loaded from URL:', carsFromUrl)
    } else {
      // Fallback: LocalStorage'dan seçili arabaları yükle
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
    }
  }, [params.cars])

  // Client-side hydration kontrolü
  useEffect(() => {
    setIsClient(true)
    
    // Dropdown dışına tıklanınca kapat
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (target && !target.closest('#shareDropdown') && !target.closest('#shareDropdownMobile')) {
        document.getElementById('shareDropdown')?.classList.add('hidden')
        document.getElementById('shareDropdownMobile')?.classList.add('hidden')
      }
    }
    
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  // Dil algılama - client-side'da çalışır
  useEffect(() => {
    if (!isClient) return

    const savedLanguage = localStorage.getItem('phevs-language') || 'en'
    console.log('Language from localStorage:', savedLanguage)
    setSelectedLanguage(savedLanguage)

    // Dil değişikliklerini dinle
    const handleLanguageChange = () => {
      const newLanguage = localStorage.getItem('phevs-language') || 'en'
      console.log('Language changed to:', newLanguage)
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

  const removeCar = (carId: string) => {
    const updated = selectedCars.filter(c => c.id !== carId)
    setSelectedCars(updated)
    localStorage.setItem('phevs-selected-cars', JSON.stringify(updated.map(c => c.id)))
    updateUrl(updated)
  }

  // Görüntü paylaşım fonksiyonları
  const captureComparison = async () => {
    if (!comparisonRef.current) return null

    try {
      // Tüm karşılaştırma içeriğini yakala (radar chart dahil)
      const comparisonCanvas = await html2canvas(comparisonRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        allowTaint: true,
        scrollX: 0,
        scrollY: 0,
        width: comparisonRef.current.scrollWidth,
        height: comparisonRef.current.scrollHeight
      })

      // Yeni canvas oluştur (header + comparison + footer)
      const finalCanvas = document.createElement('canvas')
      const ctx = finalCanvas.getContext('2d')
      if (!ctx) return null

      // Canvas boyutlarını hesapla
      const headerHeight = 120
      const footerHeight = 100
      const padding = 40
      const totalWidth = comparisonCanvas.width + (padding * 2)
      const totalHeight = headerHeight + comparisonCanvas.height + footerHeight + (padding * 2)

      finalCanvas.width = totalWidth
      finalCanvas.height = totalHeight

      // Beyaz arka plan
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, totalWidth, totalHeight)

      // Header ekle
      ctx.fillStyle = '#1e293b'
      ctx.fillRect(0, 0, totalWidth, headerHeight)

      // Site logosu ve başlık
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 24px Arial'
      ctx.textAlign = 'center'
      ctx.fillText('phevs.eu', totalWidth / 2, 35)
      
      ctx.font = '16px Arial'
      ctx.fillText('Plug-in Hybrid Electric Vehicle Comparison', totalWidth / 2, 60)
      
      ctx.font = '14px Arial'
      ctx.fillText(`${selectedCars.map(c => `${c.brand} ${c.model}`).join(' vs ')}`, totalWidth / 2, 85)

      // Karşılaştırma içeriğini ekle
      ctx.drawImage(comparisonCanvas, padding, headerHeight + padding)

      // Footer ekle
      const footerY = headerHeight + comparisonCanvas.height + padding + 20
      ctx.fillStyle = '#64748b'
      ctx.font = '12px Arial'
      ctx.textAlign = 'center'
      
      // URL'yi al ve kısalt
      const currentUrl = window.location.href
      const urlText = currentUrl.length > 70 ? currentUrl.substring(0, 67) + '...' : currentUrl
      
      ctx.fillText(`Generated on ${new Date().toLocaleDateString('tr-TR')} at phevs.eu`, totalWidth / 2, footerY)
      ctx.fillText('Compare PHEV vehicles and find your perfect match', totalWidth / 2, footerY + 20)
      ctx.fillStyle = '#3b82f6'
      ctx.fillText(urlText, totalWidth / 2, footerY + 40)
      ctx.fillStyle = '#64748b'
      ctx.fillText('Visit phevs.eu for more comparisons', totalWidth / 2, footerY + 60)
      
      return finalCanvas.toDataURL('image/png', 1.0)
    } catch (error) {
      console.error('Error capturing comparison:', error)
      return null
    }
  }

  const shareAsImage = async () => {
    const dataUrl = await captureComparison()
    if (!dataUrl) {
      const errorMessages: Record<string, string> = {
        en: 'Could not create image. Please try again.',
        tr: 'Görüntü oluşturulamadı. Lütfen tekrar deneyin.',
        de: 'Bild konnte nicht erstellt werden. Bitte versuchen Sie es erneut.',
        pl: 'Nie można utworzyć obrazu. Spróbuj ponownie.'
      }
      alert(errorMessages[selectedLanguage] || errorMessages.en)
      return
    }

    // Web Share API kullan
    if (navigator.share && navigator.canShare) {
      try {
        // Data URL'i blob'a çevir
        const response = await fetch(dataUrl)
        const blob = await response.blob()
        const file = new File([blob], 'car-comparison.png', { type: 'image/png' })

        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: 'Araç Karşılaştırması',
            text: `${selectedCars.map(c => `${c.brand} ${c.model}`).join(' vs ')} karşılaştırması`,
            files: [file]
          })
        } else {
          // Fallback: URL paylaşımı
          const comparisonUrl = `${window.location.origin}${window.location.pathname}`
          await navigator.share({
            title: 'Araç Karşılaştırması',
            text: `${selectedCars.map(c => `${c.brand} ${c.model}`).join(' vs ')} karşılaştırması`,
            url: comparisonUrl
          })
        }
      } catch (error) {
        console.error('Error sharing:', error)
        downloadImage(dataUrl)
      }
    } else {
      // Fallback: İndirme
      downloadImage(dataUrl)
    }
  }

  const shareToFacebook = () => {
    const currentUrl = window.location.href
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`
    console.log('Facebook Share URL:', shareUrl)
    console.log('Original URL:', currentUrl)
    window.open(shareUrl, '_blank', 'width=600,height=400')
  }

  const shareToTwitter = () => {
    const comparisonText = encodeURIComponent(`${selectedCars.map(c => `${c.brand} ${c.model}`).join(' vs ')} PHEV Comparison`)
    const currentUrl = encodeURIComponent(window.location.href)
    const shareUrl = `https://twitter.com/intent/tweet?text=${comparisonText}&url=${currentUrl}`
    window.open(shareUrl, '_blank', 'width=600,height=400')
  }

  const copyToClipboard = () => {
    const currentUrl = window.location.href
    const successMessages: Record<string, string> = {
      en: 'URL copied to clipboard!',
      tr: 'URL panoya kopyalandı!',
      de: 'URL in die Zwischenablage kopiert!',
      pl: 'URL skopiowano do schowka!'
    }
    const errorMessages: Record<string, string> = {
      en: 'Could not copy URL',
      tr: 'URL kopyalanamadı',
      de: 'URL konnte nicht kopiert werden',
      pl: 'Nie można skopiować URL'
    }
    
    navigator.clipboard.writeText(currentUrl).then(() => {
      alert(successMessages[selectedLanguage] || successMessages.en)
    }).catch(err => {
      console.error('Failed to copy:', err)
      alert(errorMessages[selectedLanguage] || errorMessages.en)
    })
  }

  const downloadImage = (dataUrl: string) => {
    const link = document.createElement('a')
    link.download = `car-comparison-${selectedCars.map(c => c.brand).join('-')}-${new Date().toISOString().split('T')[0]}.png`
    link.href = dataUrl
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Karşılaştırma kategorileri
  const comparisonCategories = [
    {
      title: 'General Information',
      rows: [
        { label: t.brand, getValue: (car: Car) => car.brand },
        { label: t.model, getValue: (car: Car) => car.model },
        { label: t.year, getValue: (car: Car) => car.year },
        { label: t.segment, getValue: (car: Car) => car.segment },
      ]
    },
    {
      title: 'Pricing',
      rows: [
        { 
          label: t.priceEur, 
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
          label: t.electricRangeKm, 
          getValue: (car: Car) => `${car.ev_range_km} km`,
          highlight: true,
          getBest: (cars: Car[]) => Math.max(...cars.map(c => c.ev_range_km))
        },
        { 
          label: t.batteryCapacityKwh, 
          getValue: (car: Car) => `${car.battery_kwh} kWh`,
          highlight: true,
          getBest: (cars: Car[]) => Math.max(...cars.map(c => c.battery_kwh))
        },
        { 
          label: t.chargeTimeACHours, 
          getValue: (car: Car) => `${car.charge_time_ac} hours`,
          getBest: (cars: Car[]) => Math.min(...cars.map(c => c.charge_time_ac))
        },
        { 
          label: t.dcChargeTimeMinutes, 
          getValue: (car: Car) => car.charge_time_dc ? `${car.charge_time_dc} minutes` : 'N/A',
          getBest: (cars: Car[]) => Math.min(...cars.map(c => c.charge_time_dc || Infinity).filter(v => v !== Infinity))
        },
        { 
          label: t.chargingPortLocation, 
          getValue: (car: Car) => car.charging_port ? car.charging_port.ac_location : 'N/A',
          highlight: false
        },
        { 
          label: t.acPortType, 
          getValue: (car: Car) => car.charging_port ? car.charging_port.ac_type : 'N/A',
          highlight: false
        },
      ]
    },
    {
      title: 'Engine & Performance',
      rows: [
        { 
          label: t.powerHp, 
          getValue: (car: Car) => `${car.power_hp} HP`,
          highlight: true,
          getBest: (cars: Car[]) => Math.max(...cars.map(c => c.power_hp))
        },
        { 
          label: t.fuelConsumptionL100km, 
          getValue: (car: Car) => `${car.fuel_consumption} L/100km`,
          getBest: (cars: Car[]) => Math.min(...cars.map(c => c.fuel_consumption))
        },
        { 
          label: t.co2EmissionGkm, 
          getValue: (car: Car) => `${car.co2_emission} g/km`,
          getBest: (cars: Car[]) => Math.min(...cars.map(c => c.co2_emission))
        },
      ]
    },
    {
      title: 'Comfort & Space',
      rows: [
        { 
          label: t.trunkVolumeL, 
          getValue: (car: Car) => `${car.trunk_volume} L`,
          getBest: (cars: Car[]) => Math.max(...cars.map(c => c.trunk_volume))
        },
        { 
          label: t.seatsCount, 
          getValue: (car: Car) => car.seats.toString(),
          getBest: (cars: Car[]) => Math.max(...cars.map(c => c.seats))
        },
      ]
    },
    {
      title: 'Safety (Euro NCAP)',
      rows: [
        { 
          label: t.overallRating, 
          getValue: (car: Car) => car.euroncap_rating ? `${car.euroncap_rating.stars}/5 stars` : 'N/A',
          highlight: true,
          getBest: (cars: Car[]) => Math.max(...cars.filter(c => c.euroncap_rating).map(c => c.euroncap_rating!.stars))
        },
        { 
          label: t.adultOccupantProtection, 
          getValue: (car: Car) => car.euroncap_rating ? `${car.euroncap_rating.adult_occupant}%` : 'N/A',
          getBest: (cars: Car[]) => Math.max(...cars.filter(c => c.euroncap_rating).map(c => c.euroncap_rating!.adult_occupant))
        },
        { 
          label: t.childOccupantProtection, 
          getValue: (car: Car) => car.euroncap_rating ? `${car.euroncap_rating.child_occupant}%` : 'N/A',
          getBest: (cars: Car[]) => Math.max(...cars.filter(c => c.euroncap_rating).map(c => c.euroncap_rating!.child_occupant))
        },
        { 
          label: t.pedestrianProtection, 
          getValue: (car: Car) => car.euroncap_rating ? `${car.euroncap_rating.pedestrian_protection}%` : 'N/A',
          getBest: (cars: Car[]) => Math.max(...cars.filter(c => c.euroncap_rating).map(c => c.euroncap_rating!.pedestrian_protection))
        },
        { 
          label: t.safetyAssist, 
          getValue: (car: Car) => car.euroncap_rating ? `${car.euroncap_rating.safety_assist}%` : 'N/A',
          getBest: (cars: Car[]) => Math.max(...cars.filter(c => c.euroncap_rating).map(c => c.euroncap_rating!.safety_assist))
        },
      ]
    },
    {
      title: 'Warranty & Availability',
      rows: [
        { 
          label: t.warrantyYears, 
          getValue: (car: Car) => `${car.warranty_years} years`,
          getBest: (cars: Car[]) => Math.max(...cars.map(c => c.warranty_years))
        },
        { 
          label: t.countryAvailability, 
          getValue: (car: Car) => car.country_availability,
        },
      ]
    },
  ]


  const getCarStrengths = (car: Car, allCars: Car[]) => {
    const strengths: string[] = []
    
    // Price advantage - sadece tek bir araç en uygun fiyatlı ise göster
    const minPrice = Math.min(...allCars.map(c => c.price_eur))
    const carsWithMinPrice = allCars.filter(c => c.price_eur === minPrice)
    if (car.price_eur === minPrice && carsWithMinPrice.length === 1) {
      strengths.push(t.bestPrice)
    }
    
    // Range advantage - sadece tek bir araç en yüksek menzilli ise göster
    const maxRange = Math.max(...allCars.map(c => c.ev_range_km))
    const carsWithMaxRange = allCars.filter(c => c.ev_range_km === maxRange)
    if (car.ev_range_km === maxRange && carsWithMaxRange.length === 1) {
      strengths.push(t.highestElectricRange)
    }
    
    // Battery capacity advantage - sadece tek bir araç en büyük bataryalı ise göster
    const maxBattery = Math.max(...allCars.map(c => c.battery_kwh))
    const carsWithMaxBattery = allCars.filter(c => c.battery_kwh === maxBattery)
    if (car.battery_kwh === maxBattery && carsWithMaxBattery.length === 1) {
      strengths.push(t.largestBatteryCapacity)
    }
    
    // Power advantage - sadece tek bir araç en güçlü ise göster
    const maxPower = Math.max(...allCars.map(c => c.power_hp))
    const carsWithMaxPower = allCars.filter(c => c.power_hp === maxPower)
    if (car.power_hp === maxPower && carsWithMaxPower.length === 1) {
      strengths.push(t.highestPower)
    }
    
    // Fuel consumption advantage - sadece tek bir araç en düşük tüketimli ise göster
    const minConsumption = Math.min(...allCars.map(c => c.fuel_consumption))
    const carsWithMinConsumption = allCars.filter(c => c.fuel_consumption === minConsumption)
    if (car.fuel_consumption === minConsumption && carsWithMinConsumption.length === 1) {
      strengths.push(t.lowestFuelConsumption)
    }
    
    // CO2 advantage - sadece tek bir araç en düşük CO2'li ise göster
    const minCO2 = Math.min(...allCars.map(c => c.co2_emission))
    const carsWithMinCO2 = allCars.filter(c => c.co2_emission === minCO2)
    if (car.co2_emission === minCO2 && carsWithMinCO2.length === 1) {
      strengths.push(t.lowestCO2Emission)
    }
    
    // Trunk volume advantage - sadece tek bir araç en büyük bagajlı ise göster
    const maxTrunk = Math.max(...allCars.map(c => c.trunk_volume))
    const carsWithMaxTrunk = allCars.filter(c => c.trunk_volume === maxTrunk)
    if (car.trunk_volume === maxTrunk && carsWithMaxTrunk.length === 1) {
      strengths.push(t.largestTrunkVolume)
    }
    
    // Charge time advantage (AC) - sadece tek bir araç en hızlı AC şarjlı ise göster
    const minChargeAC = Math.min(...allCars.map(c => c.charge_time_ac))
    const carsWithMinChargeAC = allCars.filter(c => c.charge_time_ac === minChargeAC)
    if (car.charge_time_ac === minChargeAC && carsWithMinChargeAC.length === 1) {
      strengths.push(t.fastestACCharging)
    }
    
    // Charge time advantage (DC) - sadece tek bir araç en hızlı DC şarjlı ise göster
    const carsWithDC = allCars.filter(c => c.charge_time_dc !== undefined)
    if (carsWithDC.length > 0) {
      const minChargeDC = Math.min(...carsWithDC.map(c => c.charge_time_dc!))
      const carsWithMinChargeDC = carsWithDC.filter(c => c.charge_time_dc === minChargeDC)
      if (car.charge_time_dc === minChargeDC && carsWithMinChargeDC.length === 1) {
        strengths.push(t.fastestDCCharging)
      }
    }
    
    // Warranty advantage - sadece tek bir araç en uzun garantili ise göster
    const maxWarranty = Math.max(...allCars.map(c => c.warranty_years))
    const carsWithMaxWarranty = allCars.filter(c => c.warranty_years === maxWarranty)
    if (car.warranty_years === maxWarranty && carsWithMaxWarranty.length === 1) {
      strengths.push(t.longestWarranty)
    }
    
    return strengths
  }

  const isBestValue = (car: Car, row: any) => {
    if (!row.getBest || selectedCars.length < 2) return false
    
    const bestValue = row.getBest(selectedCars)
    
    // Get the raw value for comparison (not the formatted string)
    let currentValue: any
    if (row.label.includes('Price')) {
      currentValue = car.price_eur
    } else if (row.label.includes('Electric Range')) {
      currentValue = car.ev_range_km
    } else if (row.label.includes('Battery Capacity')) {
      currentValue = car.battery_kwh
    } else if (row.label.includes('AC Charge Time')) {
      currentValue = car.charge_time_ac
    } else if (row.label.includes('DC Charge Time')) {
      currentValue = car.charge_time_dc
    } else if (row.label.includes('Power')) {
      currentValue = car.power_hp
    } else if (row.label.includes('Fuel Consumption')) {
      currentValue = car.fuel_consumption
    } else if (row.label.includes('CO₂ Emission')) {
      currentValue = car.co2_emission
    } else if (row.label.includes('Trunk Volume')) {
      currentValue = car.trunk_volume
    } else if (row.label.includes('Seats')) {
      currentValue = car.seats
    } else if (row.label.includes('Overall Rating')) {
      currentValue = car.euroncap_rating?.stars
    } else if (row.label.includes('Adult Occupant Protection')) {
      currentValue = car.euroncap_rating?.adult_occupant
    } else if (row.label.includes('Child Occupant Protection')) {
      currentValue = car.euroncap_rating?.child_occupant
    } else if (row.label.includes('Pedestrian Protection')) {
      currentValue = car.euroncap_rating?.pedestrian_protection
    } else if (row.label.includes('Safety Assist')) {
      currentValue = car.euroncap_rating?.safety_assist
    } else if (row.label.includes('Warranty')) {
      currentValue = car.warranty_years
    } else {
      return false
    }
    
    // Only highlight if this car has the best value AND it's the first occurrence
    if (currentValue === bestValue) {
      const carsWithBestValue = selectedCars.filter(c => {
        let cValue: any
        if (row.label.includes('Price')) {
          cValue = c.price_eur
        } else if (row.label.includes('Electric Range')) {
          cValue = c.ev_range_km
        } else if (row.label.includes('Battery Capacity')) {
          cValue = c.battery_kwh
        } else if (row.label.includes('AC Charge Time')) {
          cValue = c.charge_time_ac
        } else if (row.label.includes('DC Charge Time')) {
          cValue = c.charge_time_dc
        } else if (row.label.includes('Power')) {
          cValue = c.power_hp
        } else if (row.label.includes('Fuel Consumption')) {
          cValue = c.fuel_consumption
        } else if (row.label.includes('CO₂ Emission')) {
          cValue = c.co2_emission
        } else if (row.label.includes('Trunk Volume')) {
          cValue = c.trunk_volume
        } else if (row.label.includes('Seats')) {
          cValue = c.seats
        } else if (row.label.includes('Overall Rating')) {
          cValue = c.euroncap_rating?.stars
        } else if (row.label.includes('Adult Occupant Protection')) {
          cValue = c.euroncap_rating?.adult_occupant
        } else if (row.label.includes('Child Occupant Protection')) {
          cValue = c.euroncap_rating?.child_occupant
        } else if (row.label.includes('Pedestrian Protection')) {
          cValue = c.euroncap_rating?.pedestrian_protection
        } else if (row.label.includes('Safety Assist')) {
          cValue = c.euroncap_rating?.safety_assist
        } else if (row.label.includes('Warranty')) {
          cValue = c.warranty_years
        } else {
          cValue = null
        }
        return cValue === bestValue
      })
      return carsWithBestValue[0].id === car.id
    }
    
    return false
  }

  if (selectedCars.length < 2) {
    return (
      <div className="bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100">
        <header className="header-metallic">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <Link href="/" className="flex items-center text-slate-400 hover:text-white transition-colors">
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                {t.backToHome}
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
                  {t.saveComparison}
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
                  {t.shareComparison}
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="card text-center py-20">
            <div className="text-8xl mb-6">⚔️</div>
            <h1 className="text-xl font-bold text-slate-800 mb-4">
              {selectedCars.length === 0 ? t.noVehiclesSelected : t.notEnoughVehicles}
            </h1>
            <p className="text-sm text-slate-600 mb-8">
              {t.selectVehiclesMessage}
            </p>
            <Link href="/" className="btn-primary inline-flex items-center space-x-2">
              <ArrowLeftIcon className="h-5 w-5" />
              <span>{t.goToHomePage}</span>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100">
      {/* Header */}
      <header className="header-metallic sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Desktop Header */}
          <div className="hidden sm:flex items-center justify-between h-20">
            <Link href="/" className="flex items-center text-slate-400 hover:text-white transition-colors group">
              <ArrowLeftIcon className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              <span className="font-semibold">{t.backToHome}</span>
            </Link>
            
            <div className="flex items-center space-x-6">
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-blue-200 bg-clip-text text-transparent">
                  Vehicle Comparison
                </h1>
                <p className="text-xs text-slate-400 text-right">Comparing {selectedCars.length} vehicles</p>
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
                
                <div className="relative group">
                  <button
                    onClick={() => document.getElementById('shareDropdown')?.classList.toggle('hidden')}
                    className="btn-primary text-sm flex items-center space-x-1"
                  >
                    <ShareIcon className="h-4 w-4" />
                    <span>Share</span>
                  </button>
                  <div id="shareDropdown" className="absolute right-0 top-full mt-2 hidden group-hover:block hover:block bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-gray-200 dark:border-slate-700 min-w-[180px] z-50">
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
                      <span>Copy Link</span>
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
                  className="btn-secondary text-sm flex items-center space-x-1"
                >
                  <ArrowDownTrayIcon className="h-4 w-4" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Header */}
          <div className="sm:hidden">
            {/* Top Row - Back and Title */}
            <div className="flex items-center justify-between h-16 px-2">
              <Link href="/" className="flex items-center text-slate-400 hover:text-white transition-colors">
                <ArrowLeftIcon className="h-5 w-5 mr-1" />
                <span className="text-sm font-medium">Back</span>
              </Link>
              
              <div className="text-center flex-1 mx-4">
                <h1 className="text-sm font-bold bg-gradient-to-r from-blue-400 to-blue-200 bg-clip-text text-transparent">
                  Vehicle Comparison
                </h1>
                <p className="text-xs text-slate-400">Comparing {selectedCars.length} vehicles</p>
              </div>
              
              <div className="w-16"></div> {/* Spacer for balance */}
            </div>
            
            {/* Bottom Row - Action Buttons */}
            <div className="flex items-center justify-center space-x-2 pb-3 px-2">
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
                className="btn-secondary text-xs px-3 py-2"
              >
                Save
              </button>
              
              <div className="relative">
                <button
                  onClick={() => document.getElementById('shareDropdownMobile')?.classList.toggle('hidden')}
                  className="btn-primary text-xs px-3 py-2 flex items-center space-x-1"
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
                    <span>Copy Link</span>
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
                className="btn-secondary text-xs px-3 py-2 flex items-center space-x-1"
              >
                <ArrowDownTrayIcon className="h-3 w-3" />
                <span>Download</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div ref={comparisonRef}>
        {/* Vehicle Cards Header */}
        <div className={`grid gap-4 sm:gap-6 mb-8 ${
          selectedCars.length === 2 
            ? 'grid-cols-1 sm:grid-cols-2' 
            : 'grid-cols-1 sm:grid-cols-3'
        }`}>
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
                <div className="aspect-[16/9] w-full max-h-32 sm:max-h-40">
                  <img
                    src={car.image_url}
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
                <h2 className="text-sm font-bold text-slate-800 mb-1">
                  {car.brand}
                </h2>
                <p className="text-xs text-slate-600 mb-2">{car.model}</p>
                {car.euroncap_rating && (
                  <div className="mb-3 flex justify-center">
                    <EuroNCAPStars rating={car.euroncap_rating} size="sm" />
                  </div>
                )}
                <div className="flex items-center justify-center space-x-2">
                  <div className="text-sm font-bold text-blue-600">
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


        {/* Strengths Summary */}
        {selectedCars.length >= 2 && (
          <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
            {selectedCars.map((car, index) => {
              const strengths = getCarStrengths(car, selectedCars)
              return (
                <div key={car.id} className="card-steel relative overflow-hidden">
                  {/* Gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 opacity-60"></div>
                  
                  {/* Content */}
                  <div className="relative z-10">
                    <div className="mb-6">
                      <h3 className="text-xl font-bold text-slate-800 mb-2 border-b-2 border-green-200 pb-3">
                        {car.brand} {car.model} - {t.strongPoints}
                      </h3>
                    </div>
                    
                    <div className="space-y-3">
                      {strengths.map((strength, idx) => (
                        <div key={idx} className="flex items-start space-x-3 p-2 rounded-lg bg-white/70 backdrop-blur-sm border border-green-100 hover:bg-white/90 transition-all duration-200">
                          <div className="w-5 h-5 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <CheckIcon className="h-3 w-3 text-white" />
                          </div>
                          <span className="text-sm text-slate-700 font-medium leading-relaxed">{strength}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-200/30 to-emerald-200/30 rounded-full -translate-y-10 translate-x-10"></div>
                  <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-teal-200/30 to-green-200/30 rounded-full translate-y-8 -translate-x-8"></div>
                </div>
              )
            })}
          </div>
        )}

        {/* Comparison Table */}
        <div className="space-y-6">
          {comparisonCategories.map((category) => (
            <div key={category.title} className="card">
              <h3 className="text-sm font-bold text-slate-800 mb-2 pb-1 border-b-2 border-slate-200">
                {category.title}
              </h3>
              
              <div className="overflow-x-auto max-h-[70vh] overflow-y-auto">
                <div className="space-y-1 min-w-[400px] sm:min-w-[600px]">
                {category.rows.map((row, rowIndex) => (
                  <div
                    key={rowIndex}
                    className={`grid gap-4 py-4 px-4 rounded-xl transition-colors ${
                      rowIndex % 2 === 0 ? 'bg-slate-50/50' : 'bg-transparent'
                    }`}
                    style={{ 
                      gridTemplateColumns: selectedCars.length === 2 
                        ? '150px repeat(2, 1fr)' 
                        : '150px repeat(3, 1fr)' 
                    }}
                  >
                    {/* Label */}
                    <div className="flex items-center">
                      <span className="font-medium text-xs sm:text-sm text-slate-700">{row.label}</span>
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
                            <div className={`font-bold text-xs sm:text-sm ${isBest && (row as any).highlight ? 'text-green-700' : 'text-slate-800'}`}>
                              {value}
                            </div>
                            {isBest && (row as any).highlight && (
                              <div className="flex items-center justify-center mt-1 text-green-600 text-xs font-medium">
                                <CheckIcon className="h-3 w-3 mr-1" />
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
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
          <Link href="/" className="btn-primary text-center">
            Compare More Vehicles
          </Link>
          <button
            onClick={() => {
              setSelectedCars([])
              localStorage.removeItem('phevs-selected-cars')
            }}
            className="btn-secondary text-center"
          >
            Clear Comparison
          </button>
        </div>


        {/* Legend */}
        <div className="mt-8 card-steel">
          <div className="flex items-start space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded"></div>
              <span className="text-xs font-medium text-slate-700">Best Value</span>
            </div>
            <p className="text-xs text-slate-600 flex-1">
              Highlighted cells indicate the best value in each category. Lower values are better for price, consumption, and emissions. Higher values are better for range, power, and capacity.
            </p>
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}

