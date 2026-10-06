'use client'

import { useState, useEffect, useMemo } from 'react'
import { 
  SunIcon, 
  InformationCircleIcon,
  XMarkIcon,
  SparklesIcon,
  BoltIcon,
  Cog6ToothIcon,
  ArrowsRightLeftIcon
} from '@heroicons/react/24/outline'
import { getImageUrl } from '@/lib/image-url'

interface Car {
  id: string
  brand: string
  model: string
  year: number
  image_url: string
  ev_range_km: number
  battery_kwh: number
  price_eur?: number
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

interface RangeSimulatorProps {
  baseRange: number
  batteryCapacity: number
  isOpen: boolean
  onClose: () => void
  selectedCar?: any
  simulatorData?: any
  locale?: string
  allCars?: any[]
  onSelectCar?: (car: any) => void
}

const TRANSLATIONS: Record<string, {
  title: string
  subtitle: string
  realtimeCalc: string
  officialParams: string
  kilometers: string
  wltpBase: string
  simulated: string
  externalTemp: string
  currentSetting: string
  optimal: string
  climateControl: string
  acEnabled: string
  acDisabled: string
  acImpact: string
  turnOffAc: string
  turnOnAc: string
  highwayShare: string
  highwayDriving: string
  city: string
  mixed: string
  highway: string
  cityEff: string
  hwyEff: string
  selectVehicle: string
  selectedVehicle: string
  switchVehicle: string
  allVehicles: string
  baseRangeLabel: string
  batteryLabel: string
  simulatedLabel: string
  noVehicleSelected: string
  selectVehiclePrompt: string
  howCalculatedTitle: string
  howCalculatedDesc: string
}> = {
  en: {
    title: 'Range Simulator & Calculator',
    subtitle: 'Discover your real-world electric range based on temperature, climate control, and driving conditions',
    realtimeCalc: 'Real-time Calculation',
    officialParams: 'Official WLTP Parameters',
    kilometers: 'kilometers',
    wltpBase: 'WLTP Base',
    simulated: 'Simulated Range',
    externalTemp: 'External Temperature',
    currentSetting: 'Current setting',
    optimal: 'Optimal',
    climateControl: 'Climate Control',
    acEnabled: 'AC / Heating On',
    acDisabled: 'AC / Heating Off',
    acImpact: 'range reduction',
    turnOffAc: 'Turn Off Climate',
    turnOnAc: 'Turn On Climate',
    highwayShare: 'Highway Share',
    highwayDriving: 'Highway driving',
    city: 'City',
    mixed: 'Mixed',
    highway: 'Highway',
    cityEff: 'City efficiency',
    hwyEff: 'Highway efficiency',
    selectVehicle: 'Select Vehicle',
    selectedVehicle: 'Selected Vehicle',
    switchVehicle: 'Switch Vehicle',
    allVehicles: 'All Vehicles',
    baseRangeLabel: 'Base Range',
    batteryLabel: 'Battery',
    simulatedLabel: 'Simulated',
    noVehicleSelected: 'No vehicle selected',
    selectVehiclePrompt: 'Select a vehicle from the list above to calculate its real-world range.',
    howCalculatedTitle: 'How Range is Calculated',
    howCalculatedDesc: 'Your real-world electric range depends on ambient temperature, heating/AC usage, and highway speeds. Cold winter temperatures reduce battery capacity, while high speeds increase aerodynamic drag. This simulator uses vehicle-specific WLTP test data and thermodynamic algorithms to give you accurate driving estimates.'
  },
  de: {
    title: 'Reichweiten-Simulator & Rechner',
    subtitle: 'Ermitteln Sie Ihre reale elektrische Reichweite basierend auf Temperatur, Klima und Fahrweise',
    realtimeCalc: 'Echtzeit-Berechnung',
    officialParams: 'Offizielle WLTP-Parameter',
    kilometers: 'Kilometer',
    wltpBase: 'WLTP-Basis',
    simulated: 'Simulierte Reichweite',
    externalTemp: 'Außentemperatur',
    currentSetting: 'Aktuelle Einstellung',
    optimal: 'Optimal',
    climateControl: 'Klimatisierung & Heizung',
    acEnabled: 'Klima / Heizung An',
    acDisabled: 'Klima / Heizung Aus',
    acImpact: 'Reichweitenverlust',
    turnOffAc: 'Klima ausschalten',
    turnOnAc: 'Klima einschalten',
    highwayShare: 'Autobahnanteil',
    highwayDriving: 'Autobahnfahrt',
    city: 'Stadt',
    mixed: 'Gemischt',
    highway: 'Autobahn',
    cityEff: 'Stadt-Effizienz',
    hwyEff: 'Autobahn-Effizienz',
    selectVehicle: 'Fahrzeug wählen',
    selectedVehicle: 'Ausgewähltes Fahrzeug',
    switchVehicle: 'Fahrzeug wechseln',
    allVehicles: 'Alle Fahrzeuge',
    baseRangeLabel: 'Basisreichweite',
    batteryLabel: 'Batterie',
    simulatedLabel: 'Simuliert',
    noVehicleSelected: 'Kein Fahrzeug ausgewählt',
    selectVehiclePrompt: 'Wählen Sie oben ein Modell aus, um die reale elektrische Reichweite zu berechnen.',
    howCalculatedTitle: 'Wie wird die Reichweite berechnet?',
    howCalculatedDesc: 'Die reale elektrische Reichweite hängt von der Außentemperatur, der Klimaanlagennutzung und dem Autobahntempo ab. Frostige Wintertemperaturen verringern die Batterieeffizienz, während hohes Tempo den Luftwiderstand steigert. Dieser Simulator nutzt modellspezifische WLTP-Werte für realistische Prognosen.'
  },
  tr: {
    title: 'Menzil Hesaplayıcı & Simülatör',
    subtitle: 'Hava sıcaklığı, klima kullanımı ve sürüş hızınıza göre gerçek elektrikli menzilinizi anında hesaplayın',
    realtimeCalc: 'Gerçek Zamanlı Hesaplama',
    officialParams: 'Resmi WLTP Parametreleri',
    kilometers: 'kilometre',
    wltpBase: 'Fabrika WLTP',
    simulated: 'Hesaplanan Menzil',
    externalTemp: 'Dış Hava Sıcaklığı',
    currentSetting: 'Mevcut ayar',
    optimal: 'İdeal',
    climateControl: 'Klima & Isıtma',
    acEnabled: 'Klima / Isıtma Açık',
    acDisabled: 'Klima / Isıtma Kapalı',
    acImpact: 'menzil etkisi',
    turnOffAc: 'Klimayı Kapat',
    turnOnAc: 'Klimayı Aç',
    highwayShare: 'Otoyol Sürüş Oranı',
    highwayDriving: 'Otoyol sürüşü',
    city: 'Şehir İçi',
    mixed: 'Karma',
    highway: 'Otoyol',
    cityEff: 'Şehir içi verimi',
    hwyEff: 'Otoyol verimi',
    selectVehicle: 'Araç Seç',
    selectedVehicle: 'Hesaplanan Araç',
    switchVehicle: 'Farklı Bir Araç Seç',
    allVehicles: 'Tüm Araçlar',
    baseRangeLabel: 'Fabrika Menzili',
    batteryLabel: 'Batarya Kapasitesi',
    simulatedLabel: 'Gerçek Menzil',
    noVehicleSelected: 'Araç seçilmedi',
    selectVehiclePrompt: 'Gerçek sürüş menzilini simüle etmek için yukarıdaki listeden bir model seçin.',
    howCalculatedTitle: 'Menzil Nasıl Hesaplanır?',
    howCalculatedDesc: 'Plug-in hibrit araçların gerçek elektrikli menzili; dış hava sıcaklığına, klima/ısıtma kullanımına ve seyir hızına doğrudan bağlıdır. Dondurucu kış şartları batarya kimyasını zorlar, yüksek otoyol hızları ise aerodinamik direnci artırır. Bu simülatör, resmi WLTP test verileri ve gerçek kullanım verimlilik katsayılarını kullanarak size en gerçekçi tahminleri sunar.'
  },
  pl: {
    title: 'Symulator Zasięgu & Kalkulator',
    subtitle: 'Oblicz swój rzeczywisty zasięg elektryczny w zmiennych warunkach drogowych',
    realtimeCalc: 'Obliczenia w czasie rzeczywistym',
    officialParams: 'Oficjalne parametry WLTP',
    kilometers: 'kilometrów',
    wltpBase: 'Baza WLTP',
    simulated: 'Szacowany zasięg',
    externalTemp: 'Temperatura zewnętrzna',
    currentSetting: 'Aktualne ustawienie',
    optimal: 'Optymalna',
    climateControl: 'Klimatyzacja i Ogrzewanie',
    acEnabled: 'Klima / Ogrzewanie wł.',
    acDisabled: 'Klima / Ogrzewanie wył.',
    acImpact: 'spadek zasięgu',
    turnOffAc: 'Wyłącz klimatyzację',
    turnOnAc: 'Włącz klimatyzację',
    highwayShare: 'Udział jazdy autostradowej',
    highwayDriving: 'Jazda autostradowa',
    city: 'Miasto',
    mixed: 'Mieszany',
    highway: 'Autostrada',
    cityEff: 'Wydajność miejska',
    hwyEff: 'Wydajność autostradowa',
    selectVehicle: 'Wybierz pojazd',
    selectedVehicle: 'Wybrany pojazd',
    switchVehicle: 'Zmień pojazd',
    allVehicles: 'Wszystkie pojazdy',
    baseRangeLabel: 'Zasięg katalogowy',
    batteryLabel: 'Bateria',
    simulatedLabel: 'Zasięg realny',
    noVehicleSelected: 'Nie wybrano pojazdu',
    selectVehiclePrompt: 'Wybierz model powyżej, aby obliczyć jego rzeczywisty zasięg elektryczny.',
    howCalculatedTitle: 'Jak obliczany jest zasięg?',
    howCalculatedDesc: 'Rzeczywisty zasięg hybrydy plug-in zależy od temperatury zewnętrznej, pracy klimatyzacji oraz prędkości. Mroźna zima obniża wydajność chemiczną baterii, a prędkości autostradowe podnoszą opór aerodynamiczny. Kalkulator korzysta ze współczynników WLTP, dostarczając precyzyjne symulacje.'
  },
  fr: {
    title: "Simulateur d'Autonomie & Calculateur",
    subtitle: 'Découvrez votre autonomie électrique réelle selon vos conditions de conduite et le climat',
    realtimeCalc: 'Calcul en temps réel',
    officialParams: 'Paramètres officiels WLTP',
    kilometers: 'kilomètres',
    wltpBase: 'Base WLTP',
    simulated: 'Autonomie estimée',
    externalTemp: 'Température extérieure',
    currentSetting: 'Réglage actuel',
    optimal: 'Optimal',
    climateControl: 'Climatisation & Chauffage',
    acEnabled: 'Climatisation / Chauffage activé',
    acDisabled: 'Climatisation désactivée',
    acImpact: "de perte d'autonomie",
    turnOffAc: 'Éteindre la clim',
    turnOnAc: 'Allumer la clim',
    highwayShare: "Part d'autoroute",
    highwayDriving: 'Conduite sur autoroute',
    city: 'Ville',
    mixed: 'Mixte',
    highway: 'Autoroute',
    cityEff: 'Efficacité urbaine',
    hwyEff: 'Efficacité autoroute',
    selectVehicle: 'Sélectionner un véhicule',
    selectedVehicle: 'Véhicule sélectionné',
    switchVehicle: 'Changer de véhicule',
    allVehicles: 'Tous les véhicules',
    baseRangeLabel: 'Autonomie de base',
    batteryLabel: 'Batterie',
    simulatedLabel: 'Autonomie estimée',
    noVehicleSelected: 'Aucun véhicule sélectionné',
    selectVehiclePrompt: 'Sélectionnez un modèle ci-dessus pour simuler son autonomie réelle.',
    howCalculatedTitle: "Comment l'autonomie est-elle calculée ?",
    howCalculatedDesc: "L'autonomie électrique dépend directement de la température extérieure, de la climatisation et de la vitesse de roulage. Le froid hivernal ralentit la chimie des cellules et l'autoroute accroît la traînée aérodynamique. Ce simulateur intègre les données officielles WLTP pour une estimation réaliste."
  },
  es: {
    title: 'Simulador de Autonomía y Calculadora',
    subtitle: 'Calcula tu autonomía eléctrica real según la temperatura, climatizador y estilo de conducción',
    realtimeCalc: 'Cálculo en tiempo real',
    officialParams: 'Parámetros oficiales WLTP',
    kilometers: 'kilómetros',
    wltpBase: 'Base WLTP',
    simulated: 'Autonomía estimada',
    externalTemp: 'Temperatura exterior',
    currentSetting: 'Ajuste actual',
    optimal: 'Óptima',
    climateControl: 'Climatizador y Calefacción',
    acEnabled: 'Clima / Calefacción activada',
    acDisabled: 'Clima desactivado',
    acImpact: 'de reducción de autonomía',
    turnOffAc: 'Apagar climatizador',
    turnOnAc: 'Encender climatizador',
    highwayShare: 'Proporción de autopista',
    highwayDriving: 'Conducción en autopista',
    city: 'Ciudad',
    mixed: 'Mixto',
    highway: 'Autopista',
    cityEff: 'Eficiencia en ciudad',
    hwyEff: 'Eficiencia en autopista',
    selectVehicle: 'Seleccionar vehículo',
    selectedVehicle: 'Vehículo seleccionado',
    switchVehicle: 'Cambiar vehículo',
    allVehicles: 'Todos los vehículos',
    baseRangeLabel: 'Autonomía base',
    batteryLabel: 'Batería',
    simulatedLabel: 'Autonomía calculada',
    noVehicleSelected: 'Ningún vehículo seleccionado',
    selectVehiclePrompt: 'Elige un modelo arriba para calcular su autonomía eléctrica en condiciones reales.',
    howCalculatedTitle: '¿Cómo se calcula la autonomía?',
    howCalculatedDesc: 'La autonomía eléctrica depende de la temperatura exterior, el uso del climatizador y la velocidad en carretera. Las bajas temperaturas reducen el rendimiento de la batería y las altas velocidades aumentan el arrastre aerodinámico. Este simulador calcula estimaciones precisas basadas en el ciclo WLTP.'
  }
}

function RangeSimulator({ 
  baseRange, 
  batteryCapacity, 
  isOpen, 
  onClose,
  selectedCar,
  simulatorData,
  locale = 'en',
  allCars = [],
  onSelectCar
}: RangeSimulatorProps) {
  const [temperature, setTemperature] = useState(20) // °C
  const [acEnabled, setAcEnabled] = useState(true)
  const [highwayShare, setHighwayShare] = useState(35) // %
  const [calculatedRange, setCalculatedRange] = useState(baseRange)
  const [internalCar, setInternalCar] = useState<any>(selectedCar || null)

  const t = TRANSLATIONS[locale] || TRANSLATIONS.en

  useEffect(() => {
    if (selectedCar) {
      setInternalCar(selectedCar)
    }
  }, [selectedCar])

  // Active vehicle reference
  const currentCar = internalCar || selectedCar
  const activeBaseRange = currentCar?.ev_range_km || baseRange || 100
  const activeBattery = currentCar?.battery_kwh || batteryCapacity || 15
  const activeSimData = currentCar?.simulator_data || simulatorData

  // Sorted vehicle list for clean selector
  const sortedCars = useMemo(() => {
    if (!allCars || allCars.length === 0) return []
    return [...allCars].sort((a, b) => {
      const nameA = `${a.brand} ${a.model}`.toLowerCase()
      const nameB = `${b.brand} ${b.model}`.toLowerCase()
      return nameA.localeCompare(nameB)
    })
  }, [allCars])

  // Range calculation effect
  useEffect(() => {
    let range = activeBaseRange

    const tempEfficiency = activeSimData?.temperature_efficiency || {
      optimal_temp: 20,
      cold_weather_factor: 0.7,
      hot_weather_factor: 0.8,
      mild_cold_factor: 0.85,
      mild_hot_factor: 0.9
    }

    const acImpact = activeSimData?.ac_impact || 0.85
    const highwayEfficiency = activeSimData?.highway_efficiency || {
      city_factor: 1.1,
      mixed_factor: 1.0,
      highway_factor: 0.9
    }

    // Temperature effect
    if (temperature < 0) {
      range *= tempEfficiency.cold_weather_factor
    } else if (temperature < 10) {
      range *= tempEfficiency.mild_cold_factor
    } else if (temperature > 30) {
      range *= tempEfficiency.hot_weather_factor
    } else if (temperature > 25) {
      range *= tempEfficiency.mild_hot_factor
    }

    // AC / Heating effect
    if (acEnabled) {
      range *= acImpact
    }

    // Highway driving effect
    if (highwayShare > 80) {
      range *= highwayEfficiency.highway_factor
    } else if (highwayShare > 50) {
      range *= highwayEfficiency.mixed_factor
    } else {
      range *= highwayEfficiency.city_factor
    }

    setCalculatedRange(Math.max(1, Math.round(range)))
  }, [activeBaseRange, temperature, acEnabled, highwayShare, activeSimData])

  const handleCarChange = (carId: string) => {
    const found = allCars.find(c => c.id === carId)
    if (found) {
      setInternalCar(found)
      if (onSelectCar) {
        onSelectCar(found)
      }
    }
  }

  if (!isOpen) return null

  const optimalTemp = activeSimData?.temperature_efficiency?.optimal_temp || 20
  const acLossPercent = activeSimData ? Math.round((1 - activeSimData.ac_impact) * 100) : 15

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
      <div className="flex min-h-screen items-center justify-center p-3 sm:p-4 lg:p-6">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-md transition-opacity" 
          onClick={onClose}
          aria-hidden="true"
        />
        
        {/* Modal Window */}
        <div className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 z-10 my-8">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 text-white p-6 sm:p-8 border-b border-slate-800">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-500/10 border border-blue-400/20 rounded-2xl flex items-center justify-center text-blue-400 backdrop-blur-sm shrink-0">
                  <SparklesIcon className="h-6 w-6 sm:h-8 sm:w-8" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white">
                    {t.title}
                  </h2>
                  <p className="text-slate-300 text-xs sm:text-sm mt-0.5 max-w-2xl">
                    {t.subtitle}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                aria-label="Close range simulator"
                className="p-2 sm:p-3 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors shrink-0"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-5 sm:p-8 bg-slate-50/70 dark:bg-slate-900/90 max-h-[calc(100vh-10rem)] overflow-y-auto">
            {/* Vehicle Selector Bar (if cars list available) */}
            {sortedCars.length > 0 && (
              <div className="mb-6 p-4 bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider shrink-0">
                  <ArrowsRightLeftIcon className="h-4 w-4 text-blue-500" />
                  <span>{t.switchVehicle}</span>
                </div>
                <div className="flex-1 max-w-xl">
                  <select
                    value={currentCar?.id || ''}
                    onChange={(e) => handleCarChange(e.target.value)}
                    aria-label={t.selectVehicle}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-semibold bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 rounded-xl shadow-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden transition-colors"
                  >
                    <option value="" disabled>-- {t.allVehicles} --</option>
                    {sortedCars.map((car) => (
                      <option key={car.id} value={car.id}>
                        {car.brand} {car.model} ({car.year}) — {car.ev_range_km} km WLTP
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
              {/* Left Column - Simulator Controls */}
              <div className="lg:col-span-2 space-y-6">
                {/* Status Badges */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                  <div className="inline-flex items-center space-x-2 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 px-3.5 py-1.5 rounded-full text-xs font-semibold border border-emerald-200 dark:border-emerald-800">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                    <span>{t.realtimeCalc}</span>
                  </div>
                  
                  {activeSimData && (
                    <div className="inline-flex items-center space-x-1.5 bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 px-3.5 py-1.5 rounded-full text-xs font-semibold border border-blue-200 dark:border-blue-800">
                      <InformationCircleIcon className="h-3.5 w-3.5" />
                      <span>{t.officialParams}</span>
                    </div>
                  )}
                </div>

                {/* Main Hero Range Display Card */}
                <div className="text-center relative">
                  <div className="relative bg-white dark:bg-slate-800/90 rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <div className="absolute -top-12 -right-12 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>
                    <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>

                    <div className="text-6xl sm:text-7xl lg:text-8xl font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 bg-clip-text text-transparent mb-2 tracking-tight">
                      {calculatedRange}
                    </div>
                    <div className="text-lg sm:text-xl text-slate-500 dark:text-slate-400 font-medium mb-6">
                      {t.kilometers}
                    </div>
                    
                    {/* Comparison Pill */}
                    <div className="inline-flex items-center justify-center space-x-6 sm:space-x-8 px-6 py-3 bg-slate-50 dark:bg-slate-900/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 text-xs sm:text-sm">
                      <div className="text-center">
                        <div className="font-medium text-slate-500 dark:text-slate-400 mb-0.5">{t.wltpBase}</div>
                        <div className="text-slate-900 dark:text-white font-bold">{activeBaseRange} km</div>
                      </div>
                      <div className="w-px h-8 bg-slate-300 dark:bg-slate-700"></div>
                      <div className="text-center">
                        <div className="font-medium text-slate-500 dark:text-slate-400 mb-0.5">{t.simulated}</div>
                        <div className="text-emerald-600 dark:text-emerald-400 font-extrabold text-base sm:text-lg">
                          {calculatedRange} km
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Interactive Controls Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                  {/* Temperature Control */}
                  <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-xs border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center space-x-2 mb-4">
                        <SunIcon className="h-5 w-5 text-amber-500 shrink-0" />
                        <h3 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white">{t.externalTemp}</h3>
                      </div>
                      
                      <div className="text-center my-3">
                        <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                          {temperature > 0 ? `+${temperature}` : temperature}°C
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">{t.currentSetting}</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2 pt-2">
                      <input
                        type="range"
                        min="-10"
                        max="40"
                        value={temperature}
                        onChange={(e) => setTemperature(Number(e.target.value))}
                        aria-label={t.externalTemp}
                        className="w-full h-2 bg-gradient-to-r from-blue-300 via-amber-200 to-rose-400 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                      <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                        <span>-10°C</span>
                        <span className="text-amber-600 dark:text-amber-400 font-semibold">{t.optimal}: {optimalTemp}°C</span>
                        <span>40°C</span>
                      </div>
                    </div>
                  </div>

                  {/* Climate / AC Control */}
                  <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-xs border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center space-x-2 mb-4">
                        <Cog6ToothIcon className="h-5 w-5 text-blue-500 shrink-0" />
                        <h3 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white">{t.climateControl}</h3>
                      </div>
                      
                      <div className="text-center my-3">
                        <div className={`text-lg sm:text-xl font-extrabold ${acEnabled ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`}>
                          {acEnabled ? t.acEnabled : t.acDisabled}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          {acEnabled ? `~${acLossPercent}% ${t.acImpact}` : '0%'}
                        </div>
                      </div>
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => setAcEnabled(!acEnabled)}
                      className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                        acEnabled 
                          ? 'bg-blue-100 hover:bg-blue-200 dark:bg-blue-950/70 dark:hover:bg-blue-900 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800' 
                          : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600'
                      }`}
                    >
                      {acEnabled ? t.turnOffAc : t.turnOnAc}
                    </button>
                  </div>

                  {/* Highway Share Control */}
                  <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-xs border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center space-x-2 mb-4">
                        <BoltIcon className="h-5 w-5 text-emerald-500 shrink-0" />
                        <h3 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white">{t.highwayShare}</h3>
                      </div>
                      
                      <div className="text-center my-3">
                        <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                          {highwayShare}%
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">{t.highwayDriving}</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2 pt-2">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={highwayShare}
                        onChange={(e) => setHighwayShare(Number(e.target.value))}
                        aria-label={t.highwayShare}
                        className="w-full h-2 bg-gradient-to-r from-emerald-300 via-blue-200 to-indigo-300 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                      />
                      <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
                        <span>{t.city}</span>
                        <span>{t.mixed}</span>
                        <span>{t.highway}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Vehicle Info & Overview */}
              <div className="lg:col-span-1">
                {currentCar ? (
                  <div className="bg-white dark:bg-slate-800 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-xs border border-slate-200 dark:border-slate-700 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        {t.selectedVehicle}
                      </h3>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
                        {currentCar.year}
                      </span>
                    </div>
                    
                    {/* Car Image */}
                    <div className="aspect-[16/10] w-full rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 relative">
                      <img
                        src={getImageUrl(currentCar.image_url)}
                        alt={`${currentCar.brand} ${currentCar.model}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = getImageUrl(null)
                        }}
                      />
                    </div>

                    {/* Car Details */}
                    <div>
                      <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                        {currentCar.brand} {currentCar.model}
                      </h4>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="bg-slate-50 dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60 text-center">
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">{t.baseRangeLabel}</div>
                        <div className="font-bold text-slate-900 dark:text-white mt-0.5">{currentCar.ev_range_km} km</div>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60 text-center">
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">{t.batteryLabel}</div>
                        <div className="font-bold text-slate-900 dark:text-white mt-0.5">{activeBattery} kWh</div>
                      </div>
                      <div className="bg-emerald-50 dark:bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-200/60 dark:border-emerald-800/60 text-center">
                        <div className="text-[11px] text-emerald-700 dark:text-emerald-400">{t.simulatedLabel}</div>
                        <div className="font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">{calculatedRange} km</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 text-center border border-slate-200 dark:border-slate-700">
                    <BoltIcon className="h-10 w-10 mx-auto mb-2 text-slate-400" />
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{t.noVehicleSelected}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{t.selectVehiclePrompt}</p>
                  </div>
                )}

                {/* Technical Efficiency Details */}
                {activeSimData && (
                  <div className="mt-4 p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs space-y-2 text-slate-600 dark:text-slate-300">
                    <div className="flex justify-between items-center">
                      <span>{t.cityEff}</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        +{Math.round((activeSimData.highway_efficiency.city_factor - 1) * 100)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>{t.hwyEff}</span>
                      <span className="font-bold text-rose-500 dark:text-rose-400">
                        {Math.round((activeSimData.highway_efficiency.highway_factor - 1) * 100)}%
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Information Section */}
            <div className="mt-8 bg-white dark:bg-slate-800 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-700 shadow-xs">
              <div className="flex items-start space-x-3 sm:space-x-4">
                <InformationCircleIcon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500 mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base mb-1">
                    {t.howCalculatedTitle}
                  </h4>
                  <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
                    {t.howCalculatedDesc}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RangeSimulator