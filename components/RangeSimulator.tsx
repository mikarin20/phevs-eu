'use client'

import { useState, useEffect, useMemo } from 'react'
import { 
  SunIcon, 
  InformationCircleIcon,
  XMarkIcon,
  SparklesIcon,
  BoltIcon,
  Cog6ToothIcon,
  ArrowsRightLeftIcon,
  BanknotesIcon,
  ClockIcon,
  UserGroupIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline'
import { getImageUrl } from '@/lib/image-url'

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
  costAndSavingsTitle: string
  homeFullCharge: string
  petrolEquivalent: string
  netSavingsPerCharge: string
  annualSavingsEst: string
  editPrices: string
  electricityTariff: string
  petrolPrice: string
  cruisingSpeed: string
  drivingMode: string
  batterySoh: string
  newCar: string
  usedCar: string
  secondHand: string
  preConditioning: string
  payloadLabel: string
  payloadDriver: string
  payloadFamily: string
  payloadCargo: string
  chargeTimesTitle: string
  homeSocket: string
  wallboxAc: string
  dcFast: string
  noDc: string
  hours: string
  minutes: string
}> = {
  en: {
    title: 'Range Simulator & Calculator',
    subtitle: 'Discover your real-world electric range, charging costs, and petrol savings based on driving conditions',
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
    howCalculatedDesc: 'Your real-world electric range depends on ambient temperature, heating/AC usage, and highway speeds. Cold winter temperatures reduce battery capacity, while high speeds increase aerodynamic drag. This simulator uses vehicle-specific WLTP test data, aerodynamic drag modeling, and thermodynamic factors to deliver accurate real-world estimates.',
    costAndSavingsTitle: 'Charging Cost & Petrol Savings',
    homeFullCharge: 'Home Full Charge',
    petrolEquivalent: 'Petrol Equivalent',
    netSavingsPerCharge: 'Net Savings / Charge',
    annualSavingsEst: 'Est. Annual Savings',
    editPrices: 'Edit Tariffs',
    electricityTariff: 'Electricity Price (€/kWh)',
    petrolPrice: 'Petrol Price (€/L)',
    cruisingSpeed: 'Highway Speed',
    drivingMode: 'Driving Mode',
    batterySoh: 'Battery Health (SOH)',
    newCar: '100% (New)',
    usedCar: '90% (3-4 Yrs)',
    secondHand: '80% (Used)',
    preConditioning: 'Pre-conditioned while plugged in',
    payloadLabel: 'Passengers & Cargo',
    payloadDriver: 'Driver Only',
    payloadFamily: 'Family (4 People)',
    payloadCargo: 'Loaded + Roof Rack',
    chargeTimesTitle: 'Estimated Charging Times',
    homeSocket: 'Home Socket (2.3 kW)',
    wallboxAc: 'Wallbox AC',
    dcFast: 'DC Fast Charge (10-80%)',
    noDc: 'No DC Support',
    hours: 'hrs',
    minutes: 'mins'
  },
  de: {
    title: 'Reichweiten-Simulator & Rechner',
    subtitle: 'Ermitteln Sie Ihre reale elektrische Reichweite, Ladekosten und Benzin-Ersparnis basierend auf Fahrbedingungen',
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
    howCalculatedDesc: 'Die reale elektrische Reichweite hängt von der Außentemperatur, der Klimaanlagennutzung und dem Autobahntempo ab. Frostige Wintertemperaturen verringern die Batterieeffizienz, während hohes Tempo den Luftwiderstand steigert. Dieser Simulator nutzt modellspezifische WLTP-Werte und aerodynamische Formeln für realistische Prognosen.',
    costAndSavingsTitle: 'Ladekosten & Benzin-Ersparnis',
    homeFullCharge: 'Vollladung Zuhause',
    petrolEquivalent: 'Benzin-Äquivalent',
    netSavingsPerCharge: 'Netto-Ersparnis / Ladung',
    annualSavingsEst: 'Geschätzte Jahresersparnis',
    editPrices: 'Tarife anpassen',
    electricityTariff: 'Strompreis (€/kWh)',
    petrolPrice: 'Benzinpreis (€/L)',
    cruisingSpeed: 'Autobahntempo',
    drivingMode: 'Fahrmodus',
    batterySoh: 'Batteriezustand (SOH)',
    newCar: '100% (Neuwagen)',
    usedCar: '90% (3-4 Jahre)',
    secondHand: '80% (Gebraucht)',
    preConditioning: 'Am Stromnetz vorklimatisiert',
    payloadLabel: 'Passagiere & Gepäck',
    payloadDriver: 'Nur Fahrer',
    payloadFamily: 'Familie (4 Pers.)',
    payloadCargo: 'Voll beladen + Dachbox',
    chargeTimesTitle: 'Geschätzte Ladezeiten',
    homeSocket: 'Haushaltssteckdose (2.3 kW)',
    wallboxAc: 'Wallbox AC',
    dcFast: 'DC-Schnellladen (10-80%)',
    noDc: 'Kein DC-Laden',
    hours: 'Std',
    minutes: 'Min'
  },
  tr: {
    title: 'Menzil Hesaplayıcı & Simülatör',
    subtitle: 'Hava sıcaklığı, sürüş hızı ve koşullara göre gerçek elektrikli menzilinizi, şarj maliyetinizi ve benzin tasarrufunuzu anında hesaplayın',
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
    howCalculatedDesc: 'Plug-in hibrit araçların gerçek elektrikli menzili; dış hava sıcaklığına, klima/ısıtma kullanımına ve seyir hızına doğrudan bağlıdır. Dondurucu kış şartları batarya kimyasını zorlar, yüksek otoyol hızları ise aerodinamik direnci katlar. Bu simülatör, resmi WLTP test verileri ve aerodinamik sürtünme katsayılarını kullanarak en gerçekçi tahminleri sunar.',
    costAndSavingsTitle: 'Şarj Maliyeti & Benzin Tasarrufu',
    homeFullCharge: 'Evde Tam Dolum',
    petrolEquivalent: 'Benzin Eşdeğeri',
    netSavingsPerCharge: 'Net Tasarruf / Dolum',
    annualSavingsEst: 'Yıllık Tahmini Tasarruf',
    editPrices: 'Fiyatları Düzenle',
    electricityTariff: 'Elektrik Fiyatı (€/kWh)',
    petrolPrice: 'Benzin Fiyatı (€/L)',
    cruisingSpeed: 'Otoyol Seyir Hızı',
    drivingMode: 'Sürüş Modu',
    batterySoh: 'Batarya Sağlığı (SOH)',
    newCar: '%100 (Sıfır)',
    usedCar: '%90 (3-4 Yaş)',
    secondHand: '%80 (2. El)',
    preConditioning: 'Kabloya takılıyken ön ısıtma yapıldı',
    payloadLabel: 'Yolcu & Yük Durumu',
    payloadDriver: 'Yalnız Sürücü',
    payloadFamily: 'Aile (4 Kişi)',
    payloadCargo: 'Yüklü + Tavan Bagajı',
    chargeTimesTitle: 'Tahmini Şarj Süreleri',
    homeSocket: 'Ev Prizi (2.3 kW Schuko)',
    wallboxAc: 'Wallbox AC İstasyonu',
    dcFast: 'DC Hızlı Şarj (%10-%80)',
    noDc: 'DC Desteklenmiyor',
    hours: 'saat',
    minutes: 'dk'
  },
  pl: {
    title: 'Symulator Zasięgu & Kalkulator',
    subtitle: 'Oblicz swój rzeczywisty zasięg elektryczny, koszty ładowania i oszczędności na benzynie w zależności od warunków',
    realtimeCalc: 'Obliczenia w czasie rzeczywistym',
    officialParams: 'Oficjalne parametry WLTP',
    kilometers: 'kilometrów',
    wltpBase: 'Baza WLTP',
    simulated: 'Szacowany zasięg',
    externalTemp: 'Temperatura zewnętrzna',
    currentSetting: 'Aktualna nastawa',
    optimal: 'Optymalna',
    climateControl: 'Klimatyzacja i Ogrzewanie',
    acEnabled: 'Klima / Ogrzewanie wł.',
    acDisabled: 'Klima / Ogrzewanie wył.',
    acImpact: 'spadek zasięgu',
    turnOffAc: 'Wyłącz klimatyzację',
    turnOnAc: 'Włącz klimatyzację',
    highwayShare: 'Udział autostrady',
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
    howCalculatedDesc: 'Rzeczywisty zasięg hybrydy plug-in zależy od temperatury zewnętrznej, pracy klimatyzacji oraz prędkości. Mroźna zima obniża wydajność chemiczną baterii, a prędkości autostradowe podnoszą opór aerodynamiczny. Kalkulator korzysta ze współczynników WLTP, dostarczając precyzyjne symulacje.',
    costAndSavingsTitle: 'Koszty ładowania i oszczędności',
    homeFullCharge: 'Pełne ładowanie w domu',
    petrolEquivalent: 'Odpowiednik benzyny',
    netSavingsPerCharge: 'Zysk na ładowanie',
    annualSavingsEst: 'Roczne oszczędności',
    editPrices: 'Edytuj stawki',
    electricityTariff: 'Cena prądu (€/kWh)',
    petrolPrice: 'Cena benzyny (€/L)',
    cruisingSpeed: 'Prędkość autostradowa',
    drivingMode: 'Tryb jazdy',
    batterySoh: 'Kondycja baterii (SOH)',
    newCar: '100% (Nowy)',
    usedCar: '90% (3-4 lata)',
    secondHand: '80% (Używany)',
    preConditioning: 'Wstępnie ogrzany z gniazdka',
    payloadLabel: 'Pasażerowie i bagaż',
    payloadDriver: 'Tylko kierowca',
    payloadFamily: 'Rodzina (4 os.)',
    payloadCargo: 'Pełne + Bagażnik dachowy',
    chargeTimesTitle: 'Szacowany czas ładowania',
    homeSocket: 'Gniazdko domowe (2.3 kW)',
    wallboxAc: 'Wallbox AC',
    dcFast: 'Szybkie ładowanie DC (10-80%)',
    noDc: 'Brak DC',
    hours: 'godz.',
    minutes: 'min'
  },
  fr: {
    title: "Simulateur d'Autonomie & Calculateur",
    subtitle: "Découvrez votre autonomie électrique réelle, vos coûts de recharge et vos économies de carburant",
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
    howCalculatedDesc: "L'autonomie électrique dépend directement de la température extérieure, de la climatisation et de la vitesse de roulage. Le froid hivernal ralentit la chimie des cellules et l'autoroute accroît la traînée aérodynamique. Ce simulateur intègre les données officielles WLTP pour une estimation réaliste.",
    costAndSavingsTitle: "Coût de recharge & Économies d'essence",
    homeFullCharge: 'Plein à domicile',
    petrolEquivalent: 'Équivalent essence',
    netSavingsPerCharge: 'Économie nette / charge',
    annualSavingsEst: 'Économie annuelle estimée',
    editPrices: 'Modifier tarifs',
    electricityTariff: "Prix électricité (€/kWh)",
    petrolPrice: 'Prix essence (€/L)',
    cruisingSpeed: 'Vitesse autoroute',
    drivingMode: 'Mode de conduite',
    batterySoh: 'Santé de la batterie (SOH)',
    newCar: '100% (Neuf)',
    usedCar: '90% (3-4 ans)',
    secondHand: '80% (Occasion)',
    preConditioning: 'Préconditionné sur secteur',
    payloadLabel: 'Passagers & Bagages',
    payloadDriver: 'Conducteur seul',
    payloadFamily: 'Famille (4 pers.)',
    payloadCargo: 'Chargé + Coffre de toit',
    chargeTimesTitle: 'Temps de charge estimés',
    homeSocket: 'Prise domestique (2.3 kW)',
    wallboxAc: 'Wallbox AC',
    dcFast: 'Charge rapide DC (10-80%)',
    noDc: 'Pas de charge DC',
    hours: 'h',
    minutes: 'min'
  },
  es: {
    title: 'Simulador de Autonomía y Calculadora',
    subtitle: 'Calcula tu autonomía eléctrica real, costes de carga y ahorro en gasolina según las condiciones de conducción',
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
    howCalculatedDesc: 'La autonomía eléctrica depende de la temperatura exterior, el uso del climatizador y la velocidad en carretera. Las bajas temperaturas reducen el rendimiento de la batería y las altas velocidades aumentan el arrastre aerodinámico. Este simulador calcula estimaciones precisas basadas en el ciclo WLTP.',
    costAndSavingsTitle: 'Coste de carga y Ahorro en gasolina',
    homeFullCharge: 'Carga completa en casa',
    petrolEquivalent: 'Equivalente gasolina',
    netSavingsPerCharge: 'Ahorro neto / carga',
    annualSavingsEst: 'Ahorro anual estimado',
    editPrices: 'Editar tarifas',
    electricityTariff: 'Precio electricidad (€/kWh)',
    petrolPrice: 'Precio gasolina (€/L)',
    cruisingSpeed: 'Velocidad autopista',
    drivingMode: 'Modo de conducción',
    batterySoh: 'Salud de batería (SOH)',
    newCar: '100% (Nuevo)',
    usedCar: '90% (3-4 años)',
    secondHand: '80% (Ocasión)',
    preConditioning: 'Preclimatizado enchufado',
    payloadLabel: 'Pasajeros y Carga',
    payloadDriver: 'Solo conductor',
    payloadFamily: 'Familia (4 pers.)',
    payloadCargo: 'Cargado + Cofre techo',
    chargeTimesTitle: 'Tiempos de carga estimados',
    homeSocket: 'Enchufe doméstico (2.3 kW)',
    wallboxAc: 'Wallbox AC',
    dcFast: 'Carga rápida DC (10-80%)',
    noDc: 'Sin soporte DC',
    hours: 'h',
    minutes: 'min'
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
  // Simulator Controls State
  const [temperature, setTemperature] = useState(20) // °C
  const [acEnabled, setAcEnabled] = useState(true)
  const [highwayShare, setHighwayShare] = useState(35) // %
  const [cruisingSpeed, setCruisingSpeed] = useState<100 | 120 | 140>(120) // km/h
  const [drivingMode, setDrivingMode] = useState<'eco' | 'normal' | 'sport'>('normal')
  const [batterySoh, setBatterySoh] = useState<100 | 90 | 80>(100) // % State of Health
  const [preConditioned, setPreConditioned] = useState(false)
  const [payloadMode, setPayloadMode] = useState<'driver' | 'family' | 'cargo'>('driver')
  
  // Cost & Savings State
  const [showPriceEditor, setShowPriceEditor] = useState(false)
  const [electricityPrice, setElectricityPrice] = useState(0.28) // €/kWh
  const [fuelPrice, setFuelPrice] = useState(1.80) // €/L
  const [fuelConsumptionL100, setFuelConsumptionL100] = useState(7.5) // L/100km

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

  // Comprehensive Range Calculation Effect
  useEffect(() => {
    // 1. Battery SOH impact
    const sohFactor = batterySoh / 100
    let range = activeBaseRange * sohFactor

    // 2. Temperature & Pre-conditioning
    const tempEfficiency = activeSimData?.temperature_efficiency || {
      optimal_temp: 20,
      cold_weather_factor: 0.70,
      hot_weather_factor: 0.80,
      mild_cold_factor: 0.85,
      mild_hot_factor: 0.90
    }

    let tempFactor = 1.0
    if (temperature < 0) {
      tempFactor = tempEfficiency.cold_weather_factor
    } else if (temperature < 10) {
      tempFactor = tempEfficiency.mild_cold_factor
    } else if (temperature > 30) {
      tempFactor = tempEfficiency.hot_weather_factor
    } else if (temperature > 25) {
      tempFactor = tempEfficiency.mild_hot_factor
    }

    // Pre-conditioning recovery in cold weather
    if (preConditioned && temperature <= 10) {
      tempFactor = tempFactor + (1.0 - tempFactor) * 0.55
    }
    range *= tempFactor

    // 3. Climate Control / AC
    if (acEnabled) {
      // If pre-heated while plugged in, thermal load on battery is lower
      const acFactor = preConditioned && temperature <= 10 ? 0.92 : (activeSimData?.ac_impact || 0.85)
      range *= acFactor
    }

    // 4. Highway Share & Cruising Speed Aerodynamic Drag
    const highwayRatio = highwayShare / 100
    const cityFactor = 1.08 // Regenerative braking benefit
    let speedFactor = 0.85 // Default 120 km/h

    if (cruisingSpeed === 100) {
      speedFactor = 0.98
    } else if (cruisingSpeed === 120) {
      speedFactor = 0.85
    } else if (cruisingSpeed === 140) {
      speedFactor = 0.68 // High aerodynamic penalty
    }

    const routeEfficiency = (1 - highwayRatio) * cityFactor + highwayRatio * speedFactor
    range *= routeEfficiency

    // 5. Driving Mode Factor
    if (drivingMode === 'eco') {
      range *= 1.06
    } else if (drivingMode === 'sport') {
      range *= 0.88
    }

    // 6. Payload & Cargo Factor
    if (payloadMode === 'family') {
      range *= 0.95
    } else if (payloadMode === 'cargo') {
      range *= 0.82 // Roof rack / bicycle drag penalty
    }

    setCalculatedRange(Math.max(1, Math.round(range)))
  }, [
    activeBaseRange, 
    temperature, 
    acEnabled, 
    highwayShare, 
    cruisingSpeed, 
    drivingMode, 
    batterySoh, 
    preConditioned, 
    payloadMode, 
    activeSimData
  ])

  // Charging Costs & Fuel Savings Calculations
  const effectiveCapacity = (activeBattery * (batterySoh / 100))
  const homeChargeCost = Number((effectiveCapacity * electricityPrice).toFixed(2))
  const petrolEquivalentCost = Number(((calculatedRange / 100) * fuelConsumptionL100 * fuelPrice).toFixed(2))
  const netSavingsPerCharge = Number(Math.max(0, petrolEquivalentCost - homeChargeCost).toFixed(2))
  // Estimated annual savings based on 15,000 km/year (70% electric)
  const annualSavings = Math.round((15000 * 0.70 / (calculatedRange || 60)) * netSavingsPerCharge)

  // Estimated Charging Times
  const homeChargeHours = Math.round(((activeBattery * 1.15) / 2.3) * 10) / 10
  const carAcPower = currentCar?.charging_capabilities?.ac_power || 7.4
  const wallboxHours = Math.round(((activeBattery * 1.10) / Math.min(carAcPower, 11)) * 10) / 10
  const dcPower = currentCar?.charging_capabilities?.dc_power

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
        <div className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 z-10 my-8 animate-in fade-in zoom-in-95 duration-200">
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
                className="p-2 sm:p-3 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors shrink-0 cursor-pointer"
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
              {/* Left Column - Simulator Controls & Cost Savings */}
              <div className="lg:col-span-2 space-y-6">
                {/* Status Badges */}
                <div className="flex flex-wrap items-center justify-between gap-2.5">
                  <div className="flex items-center space-x-2">
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

                  {/* Pre-Conditioning Toggle Pill */}
                  <button
                    type="button"
                    onClick={() => setPreConditioned(!preConditioned)}
                    className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
                      preConditioned
                        ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700 shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <span>{preConditioned ? '🔥' : '❄️'}</span>
                    <span>{t.preConditioning}</span>
                  </button>
                </div>

                {/* Main Hero Range Display Card */}
                <div className="text-center relative">
                  <div className="relative bg-white dark:bg-slate-800/90 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <div className="absolute -top-12 -right-12 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>
                    <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>

                    <div className="text-6xl sm:text-7xl lg:text-8xl font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 bg-clip-text text-transparent mb-1 tracking-tight">
                      {calculatedRange}
                    </div>
                    <div className="text-base sm:text-lg text-slate-500 dark:text-slate-400 font-medium mb-5">
                      {t.kilometers}
                    </div>
                    
                    {/* Comparison Pill */}
                    <div className="inline-flex items-center justify-center space-x-6 sm:space-x-8 px-6 py-2.5 bg-slate-50 dark:bg-slate-900/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 text-xs sm:text-sm mb-6">
                      <div className="text-center">
                        <div className="font-medium text-slate-500 dark:text-slate-400 mb-0.5">{t.wltpBase}</div>
                        <div className="text-slate-900 dark:text-white font-bold">{activeBaseRange} km</div>
                      </div>
                      <div className="w-px h-7 bg-slate-300 dark:bg-slate-700"></div>
                      <div className="text-center">
                        <div className="font-medium text-slate-500 dark:text-slate-400 mb-0.5">{t.simulated}</div>
                        <div className="text-emerald-600 dark:text-emerald-400 font-extrabold text-base sm:text-lg">
                          {calculatedRange} km
                        </div>
                      </div>
                    </div>

                    {/* FEATURE 1: Charging Cost & Savings Comparison Bar */}
                    <div className="pt-5 border-t border-slate-100 dark:border-slate-700/70">
                      <div className="flex items-center justify-between mb-3 px-1">
                        <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                          <BanknotesIcon className="h-4 w-4 text-emerald-500" />
                          <span>{t.costAndSavingsTitle}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowPriceEditor(!showPriceEditor)}
                          className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center space-x-1 cursor-pointer"
                        >
                          <AdjustmentsHorizontalIcon className="h-3.5 w-3.5" />
                          <span>{t.editPrices}</span>
                        </button>
                      </div>

                      {/* Collapsible Tariff Editor */}
                      {showPriceEditor && (
                        <div className="mb-4 p-3 bg-slate-50 dark:bg-slate-900/90 rounded-xl border border-slate-200 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-2 gap-3 text-left animate-in fade-in duration-150">
                          <div>
                            <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                              {t.electricityTariff}
                            </label>
                            <input
                              type="number"
                              step="0.01"
                              value={electricityPrice}
                              onChange={(e) => setElectricityPrice(Number(e.target.value) || 0.28)}
                              className="w-full px-2.5 py-1.5 text-xs font-semibold bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-lg"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                              {t.petrolPrice}
                            </label>
                            <input
                              type="number"
                              step="0.05"
                              value={fuelPrice}
                              onChange={(e) => setFuelPrice(Number(e.target.value) || 1.80)}
                              className="w-full px-2.5 py-1.5 text-xs font-semibold bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-lg"
                            />
                          </div>
                        </div>
                      )}

                      {/* Cost Comparison 3-Column Display */}
                      <div className="grid grid-cols-3 gap-2 sm:gap-3 text-center">
                        <div className="bg-slate-50 dark:bg-slate-900/60 p-2.5 sm:p-3 rounded-xl border border-slate-200/70 dark:border-slate-700/60">
                          <div className="text-[10px] sm:text-[11px] font-medium text-slate-500 dark:text-slate-400">
                            {t.homeFullCharge}
                          </div>
                          <div className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100 mt-0.5">
                            {homeChargeCost.toFixed(2)} €
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {effectiveCapacity.toFixed(1)} kWh
                          </div>
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-900/60 p-2.5 sm:p-3 rounded-xl border border-slate-200/70 dark:border-slate-700/60">
                          <div className="text-[10px] sm:text-[11px] font-medium text-slate-500 dark:text-slate-400">
                            {t.petrolEquivalent}
                          </div>
                          <div className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100 mt-0.5">
                            {petrolEquivalentCost.toFixed(2)} €
                          </div>
                          <div className="text-[10px] text-slate-400">
                            ~{fuelConsumptionL100} L/100km
                          </div>
                        </div>

                        <div className="bg-emerald-50 dark:bg-emerald-950/40 p-2.5 sm:p-3 rounded-xl border border-emerald-200 dark:border-emerald-800/60">
                          <div className="text-[10px] sm:text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                            {t.netSavingsPerCharge}
                          </div>
                          <div className="text-sm sm:text-base font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                            +{netSavingsPerCharge.toFixed(2)} €
                          </div>
                          <div className="text-[10px] font-semibold text-emerald-600/80 dark:text-emerald-400/80">
                            ~{annualSavings} € / {locale === 'tr' ? 'yıl' : locale === 'de' ? 'Jahr' : 'yr'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Interactive Controls Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                  {/* Control 1: External Temperature */}
                  <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-xs border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center space-x-2 mb-3">
                        <SunIcon className="h-5 w-5 text-amber-500 shrink-0" />
                        <h3 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white">{t.externalTemp}</h3>
                      </div>
                      
                      <div className="text-center my-2">
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

                  {/* Control 2: Climate & Driving Mode */}
                  <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-xs border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center space-x-2 mb-3">
                        <Cog6ToothIcon className="h-5 w-5 text-blue-500 shrink-0" />
                        <h3 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white">{t.climateControl}</h3>
                      </div>
                      
                      <button
                        type="button"
                        onClick={() => setAcEnabled(!acEnabled)}
                        className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                          acEnabled 
                            ? 'bg-blue-100 hover:bg-blue-200 dark:bg-blue-950/70 dark:hover:bg-blue-900 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800' 
                            : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600'
                        }`}
                      >
                        {acEnabled ? `${t.acEnabled} (-${acLossPercent}%)` : t.acDisabled}
                      </button>
                    </div>

                    {/* FEATURE 2 (Part A): Driving Mode Segmented Control */}
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 mt-3">
                      <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 text-center">
                        {t.drivingMode}
                      </div>
                      <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl">
                        {(['eco', 'normal', 'sport'] as const).map((mode) => (
                          <button
                            key={mode}
                            type="button"
                            onClick={() => setDrivingMode(mode)}
                            className={`py-1.5 text-[11px] font-bold rounded-lg transition-all capitalize cursor-pointer ${
                              drivingMode === mode
                                ? mode === 'eco'
                                  ? 'bg-emerald-600 text-white shadow-xs'
                                  : mode === 'sport'
                                  ? 'bg-rose-600 text-white shadow-xs'
                                  : 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                            }`}
                          >
                            {mode}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Control 3: Highway Share & Cruising Speed */}
                  <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-xs border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-1.5">
                          <BoltIcon className="h-5 w-5 text-emerald-500 shrink-0" />
                          <h3 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white">{t.highwayShare}</h3>
                        </div>
                        <span className="text-xs font-bold text-slate-900 dark:text-white">{highwayShare}%</span>
                      </div>
                      
                      <div className="space-y-1.5 py-1">
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

                    {/* FEATURE 2 (Part B): Cruising Speed Segmented Control */}
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 mt-2">
                      <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 text-center">
                        {t.cruisingSpeed}
                      </div>
                      <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl">
                        {([100, 120, 140] as const).map((speed) => (
                          <button
                            key={speed}
                            type="button"
                            onClick={() => setCruisingSpeed(speed)}
                            className={`py-1.5 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                              cruisingSpeed === speed
                                ? 'bg-blue-600 text-white shadow-xs'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                            }`}
                          >
                            {speed} km/h
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Vehicle Info, Degradation SOH, Payload, Charging Times */}
              <div className="lg:col-span-1 space-y-4">
                {currentCar ? (
                  <div className="bg-white dark:bg-slate-800 rounded-2xl sm:rounded-3xl p-5 shadow-xs border border-slate-200 dark:border-slate-700 space-y-4">
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

                    {/* 3 Stats Grid */}
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="bg-slate-50 dark:bg-slate-900 p-2 rounded-xl border border-slate-200/60 dark:border-slate-700/60 text-center">
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">{t.baseRangeLabel}</div>
                        <div className="font-bold text-slate-900 dark:text-white mt-0.5">{currentCar.ev_range_km} km</div>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-900 p-2 rounded-xl border border-slate-200/60 dark:border-slate-700/60 text-center">
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">{t.batteryLabel}</div>
                        <div className="font-bold text-slate-900 dark:text-white mt-0.5">{activeBattery} kWh</div>
                      </div>
                      <div className="bg-emerald-50 dark:bg-emerald-950/40 p-2 rounded-xl border border-emerald-200/60 dark:border-emerald-800/60 text-center">
                        <div className="text-[10px] text-emerald-700 dark:text-emerald-400">{t.simulatedLabel}</div>
                        <div className="font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">{calculatedRange} km</div>
                      </div>
                    </div>

                    {/* FEATURE 3: Battery Health (SOH) */}
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60">
                      <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                        {t.batterySoh}
                      </div>
                      <div className="grid grid-cols-3 gap-1 p-1 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-700/70">
                        {([
                          { val: 100, label: t.newCar },
                          { val: 90, label: t.usedCar },
                          { val: 80, label: t.secondHand }
                        ] as const).map(({ val, label }) => (
                          <button
                            key={val}
                            type="button"
                            onClick={() => setBatterySoh(val)}
                            className={`py-1.5 px-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer text-center ${
                              batterySoh === val
                                ? 'bg-blue-600 text-white shadow-xs'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                            }`}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* FEATURE 5: Passengers & Payload */}
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60">
                      <div className="flex items-center space-x-1 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                        <UserGroupIcon className="h-3.5 w-3.5 text-blue-500" />
                        <span>{t.payloadLabel}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-1 p-1 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-700/70">
                        {([
                          { key: 'driver', label: t.payloadDriver },
                          { key: 'family', label: t.payloadFamily },
                          { key: 'cargo', label: t.payloadCargo }
                        ] as const).map(({ key, label }) => (
                          <button
                            key={key}
                            type="button"
                            onClick={() => setPayloadMode(key)}
                            className={`py-1.5 px-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer text-center ${
                              payloadMode === key
                                ? 'bg-indigo-600 text-white shadow-xs'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                            }`}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* FEATURE 6: Estimated Charging Times */}
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60">
                      <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 mb-2.5">
                        <ClockIcon className="h-4 w-4 text-amber-500" />
                        <span>{t.chargeTimesTitle}</span>
                      </div>
                      
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-700/60">
                          <span className="text-slate-600 dark:text-slate-400">{t.homeSocket}</span>
                          <span className="font-bold text-slate-800 dark:text-slate-200">~{homeChargeHours} {t.hours}</span>
                        </div>
                        <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-700/60">
                          <span className="text-slate-600 dark:text-slate-400">
                            {t.wallboxAc} ({carAcPower} kW)
                          </span>
                          <span className="font-bold text-slate-800 dark:text-slate-200">~{wallboxHours} {t.hours}</span>
                        </div>
                        <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-700/60">
                          <span className="text-slate-600 dark:text-slate-400">{t.dcFast}</span>
                          <span className={`font-bold ${dcPower ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                            {dcPower ? `~25-30 ${t.minutes} (${dcPower} kW)` : t.noDc}
                          </span>
                        </div>
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