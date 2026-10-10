'use client'

import React, { useState, useEffect, useMemo, useRef } from 'react'
import dynamic from 'next/dynamic'
import {
  MapPinIcon,
  BoltIcon,
  FireIcon,
  SparklesIcon,
  ArrowPathIcon,
  AdjustmentsHorizontalIcon,
  CheckBadgeIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import type { PHEVModel, LocationWaypoint, RouteSimulationResult } from '@/lib/phev-simulator-types'
import { getAllPHEVModels } from '@/lib/phev-models'
import { simulatePHEVRoute } from '@/lib/phev-route-engine'

// Dynamic import for Leaflet map to guarantee zero SSR hydration mismatch
const PHEVRouteMap = dynamic(() => import('@/components/PHEVRouteMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[520px] rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 animate-pulse flex flex-col items-center justify-center text-slate-400 space-y-3">
      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-sm font-medium">Initializing Real-World Interactive Route Map...</p>
    </div>
  )
})

interface PHEVRouteSimulatorProps {
  initialCarId?: string
  locale?: string
}

const PRESET_ROUTES: Array<{ name: string; origin: LocationWaypoint; dest: LocationWaypoint }> = [
  {
    name: 'Berlin → Leipzig (190 km)',
    origin: { name: 'Berlin', displayName: 'Berlin, Germany', lat: 52.5200, lon: 13.4050 },
    dest: { name: 'Leipzig', displayName: 'Leipzig, Germany', lat: 51.3397, lon: 12.3731 }
  },
  {
    name: 'Munich → Salzburg (145 km)',
    origin: { name: 'Munich', displayName: 'Munich, Germany', lat: 48.1351, lon: 11.5820 },
    dest: { name: 'Salzburg', displayName: 'Salzburg, Austria', lat: 47.8095, lon: 13.0550 }
  },
  {
    name: 'Warszawa → Łódź (130 km)',
    origin: { name: 'Warszawa', displayName: 'Warszawa, Polska', lat: 52.2297, lon: 21.0122 },
    dest: { name: 'Łódź', displayName: 'Łódź, Polska', lat: 51.7592, lon: 19.4560 }
  },
  {
    name: 'Paris → Reims (145 km)',
    origin: { name: 'Paris', displayName: 'Paris, France', lat: 48.8566, lon: 2.3522 },
    dest: { name: 'Reims', displayName: 'Reims, France', lat: 49.2583, lon: 4.0317 }
  },
  {
    name: 'Istanbul → Kocaeli (95 km)',
    origin: { name: 'Istanbul', displayName: 'İstanbul, Türkiye', lat: 41.0082, lon: 28.9784 },
    dest: { name: 'Kocaeli', displayName: 'İzmit, Kocaeli, Türkiye', lat: 40.7654, lon: 29.9408 }
  }
]

const I18N: Record<string, {
  quickTrips: string
  originLabel: string
  originPlaceholder: string
  destLabel: string
  destPlaceholder: string
  selectModel: string
  specsTitle: string
  usableBattery: string
  bufferSoC: string
  maxEvSpeed: string
  heatPump: string
  equipped: string
  notEquipped: string
  batteryCell: string
  iceDraw: string
  departureSoC: string
  bufferReserve: string
  usableEnergy: string
  ambientTemp: string
  liveWeatherFor: string
  optimalTemp: string
  subZeroPenalty: string
  mildCoolPenalty: string
  simulateBtn: string
  calculating: string
  evDriving: string
  hevDriving: string
  ofTotalTrip: string
  totalTrip: string
  energyUsed: string
  electricity: string
  petrol: string
  efficiency: string
  coldWarningTitle: string
  heatPumpBenefit: string
  ptcWarning: string
  mapTitle: string
  mapLegendEv: string
  mapLegendHev: string
  engineStartPoint: string
  bufferReached: string
  segmentTitle: string
  showSegments: string
  hideSegments: string
  colStep: string
  colSpeed: string
  colType: string
  colMode: string
  colSoC: string
  colDraw: string
  urban: string
  suburban: string
  highway: string
  blended: string
  noRouteFound: string
  searchError: string
}> = {
  en: {
    quickTrips: 'Quick European Route Presets',
    originLabel: 'Origin (Start Point A)',
    originPlaceholder: 'Enter city, street, house no or zip code...',
    destLabel: 'Destination (Endpoint B)',
    destPlaceholder: 'Enter destination city, street or address...',
    selectModel: 'Select PHEV Model',
    specsTitle: 'Powertrain & Battery Specifications',
    usableBattery: 'Usable Battery',
    bufferSoC: 'Hybrid Buffer SoC',
    maxEvSpeed: 'Max Pure EV Speed',
    heatPump: 'Heat Pump',
    equipped: 'Equipped',
    notEquipped: 'Standard PTC',
    batteryCell: 'Battery Cell',
    iceDraw: 'Highway Depleted Draw',
    departureSoC: 'Departure Battery SoC (Start)',
    bufferReserve: 'hybrid threshold buffer',
    usableEnergy: 'Usable Net EV Energy',
    ambientTemp: 'Ambient Temperature',
    liveWeatherFor: 'Live weather for',
    optimalTemp: 'Optimal (no HVAC loss)',
    subZeroPenalty: 'Sub-zero freezing penalty',
    mildCoolPenalty: 'Cool weather heating draw',
    simulateBtn: 'Simulate Route & Hybrid Energy Flow',
    calculating: 'Calculating Route & Energy Flow...',
    evDriving: 'Pure Electric (EV)',
    hevDriving: 'Hybrid / Petrol (ICE)',
    ofTotalTrip: 'of total journey',
    totalTrip: 'Total Trip',
    energyUsed: 'Total Energy Consumed',
    electricity: 'electricity',
    petrol: 'petrol',
    efficiency: 'Average Consumption',
    coldWarningTitle: 'Cold Weather & Cabin Heating Range Penalty',
    heatPumpBenefit: 'Heat pump limits total efficiency penalty to:',
    ptcWarning: 'Standard PTC resistance heater causes range loss of:',
    mapTitle: 'Interactive Route Map & Hybrid Transition Corridor',
    mapLegendEv: 'Pure Electric (EV)',
    mapLegendHev: 'Petrol Combustion (HEV)',
    engineStartPoint: 'Engine Start Point',
    bufferReached: 'buffer reached',
    segmentTitle: 'Step-by-step Highway & Urban Segment Telemetry',
    showSegments: 'Show Segment Details',
    hideSegments: 'Hide Segment Details',
    colStep: 'Step / Road',
    colSpeed: 'Speed',
    colType: 'Road Type',
    colMode: 'Mode',
    colSoC: 'Remaining SoC',
    colDraw: 'Energy Draw',
    urban: 'Urban (< 50 km/h)',
    suburban: 'Suburban (50-90 km/h)',
    highway: 'Motorway (> 90 km/h)',
    blended: 'Parallel Hybrid Assist',
    noRouteFound: 'No driving route could be calculated between these coordinates.',
    searchError: 'An error occurred while calculating the route.'
  },
  tr: {
    quickTrips: 'Popüler Rota Örnekleri',
    originLabel: 'Kalkış Noktası (A)',
    originPlaceholder: 'Şehir, sokak, kapı no veya posta kodu...',
    destLabel: 'Varış Noktası (B)',
    destPlaceholder: 'Varış şehri, sokak veya adresi...',
    selectModel: 'PHEV Modelini Seçin',
    specsTitle: 'Güç Aktarımı ve Batarya Mimarisi',
    usableBattery: 'Net Kullanılabilir Batarya',
    bufferSoC: 'Hibrit Eşik Tamponu',
    maxEvSpeed: 'Maks. Saf EV Hızı',
    heatPump: 'Isı Pompası',
    equipped: 'Mevcut (Verimli)',
    notEquipped: 'Standart PTC',
    batteryCell: 'Hücre Kimyası',
    iceDraw: 'Boş Batarya Tüketimi',
    departureSoC: 'Kalkış Batarya Doluluğu (SoC)',
    bufferReserve: 'zorunlu hibrit tamponu',
    usableEnergy: 'Kullanılabilir Net EV Enerjisi',
    ambientTemp: 'Dış Ortam Sıcaklığı',
    liveWeatherFor: 'Anlık hava durumu:',
    optimalTemp: 'Optimal (Isıtma kaybı yok)',
    subZeroPenalty: 'Sıfır altı dondurucu soğuk kaybı',
    mildCoolPenalty: 'Serin hava kabin ısıtma yükü',
    simulateBtn: 'Rotayı ve Hibrit Enerji Akışını Simüle Et',
    calculating: 'Rota & Enerji Tüketimi Hesaplanıyor...',
    evDriving: 'Saf Elektrikli Sürüş (EV)',
    hevDriving: 'Hibrit / Benzinli Sürüş (HEV)',
    ofTotalTrip: 'toplam yolculuğun',
    totalTrip: 'Toplam Rota',
    energyUsed: 'Tüketilen Toplam Enerji',
    electricity: 'elektrik',
    petrol: 'benzin',
    efficiency: 'Ortalama Enerji Tüketimi',
    coldWarningTitle: 'Soğuk Hava & Kabin Isıtma Menzil Kaybı',
    heatPumpBenefit: 'Isı pompası sayesinde menzil kaybı sınırlandı:',
    ptcWarning: 'Standart rezistanslı ısıtıcı nedeniyle menzil kaybı:',
    mapTitle: 'Etkileşimli Rota Haritası & Hibrit Geçiş Koridoru',
    mapLegendEv: 'Saf Elektrikli Sürüş (EV)',
    mapLegendHev: 'Benzin Motoru / Hibrit (HEV)',
    engineStartPoint: 'Benzin Motorunun Devreye Girdiği Nokta',
    bufferReached: 'tamponuna ulaşıldı',
    segmentTitle: 'Adım Adım Otoyol & Şehir İçi Segment Telemetrisi',
    showSegments: 'Segment Detaylarını Göster',
    hideSegments: 'Segment Detaylarını Gizle',
    colStep: 'Adım / Yol',
    colSpeed: 'Ort. Hız',
    colType: 'Yol Tipi',
    colMode: 'Çalışma Modu',
    colSoC: 'Kalan SoC',
    colDraw: 'Segment Enerjisi',
    urban: 'Şehir İçi (< 50 km/s)',
    suburban: 'Çevre Yolu (50-90 km/s)',
    highway: 'Otoyol (> 90 km/s)',
    blended: 'Paralel Hibrit Destek',
    noRouteFound: 'Bu koordinatlar arasında sürüş rotası hesaplanamadı.',
    searchError: 'Rota hesaplanırken bir hata oluştu.'
  },
  pl: {
    quickTrips: 'Popularne trasy europejskie',
    originLabel: 'Punkt startowy (A)',
    originPlaceholder: 'Wpisz miasto, ulicę, numer domu lub kod...',
    destLabel: 'Punkt docelowy (B)',
    destPlaceholder: 'Wpisz miasto docelowe lub adres...',
    selectModel: 'Wybierz model PHEV',
    specsTitle: 'Specyfikacja napędu i baterii',
    usableBattery: 'Użyteczna bateria',
    bufferSoC: 'Bufor hybrydowy SoC',
    maxEvSpeed: 'Maks. prędkość EV',
    heatPump: 'Pompa ciepła',
    equipped: 'Wyposażona',
    notEquipped: 'Standardowy PTC',
    batteryCell: 'Chemia ogniw',
    iceDraw: 'Spalanie po rozładowaniu',
    departureSoC: 'Poziom naładowania przy starcie (SoC)',
    bufferReserve: 'bufor trybu hybrydowego',
    usableEnergy: 'Dostępna energia elektryczna',
    ambientTemp: 'Temperatura zewnętrzna',
    liveWeatherFor: 'Pogoda na żywo dla:',
    optimalTemp: 'Optymalna (brak strat na ogrzewanie)',
    subZeroPenalty: 'Spadek wydajności przez mróz',
    mildCoolPenalty: 'Pobór energii na dogrzewanie',
    simulateBtn: 'Symuluj trasę i zużycie energii',
    calculating: 'Obliczanie trasy i zużycia energii...',
    evDriving: 'Czysty napęd elektryczny (EV)',
    hevDriving: 'Tryb hybrydowy / benzynowy (HEV)',
    ofTotalTrip: 'całej trasy',
    totalTrip: 'Długość trasy',
    energyUsed: 'Całkowite zużycie energii',
    electricity: 'prąd',
    petrol: 'benzyna',
    efficiency: 'Średnie zużycie',
    coldWarningTitle: 'Spadek zasięgu przez niską temperaturę i ogrzewanie',
    heatPumpBenefit: 'Pompa ciepła ogranicza straty zasięgu do:',
    ptcWarning: 'Standardowa grzałka PTC powoduje utratę zasięgu:',
    mapTitle: 'Interaktywna mapa trasy i punkt uruchomienia silnika',
    mapLegendEv: 'Tryb elektryczny (EV)',
    mapLegendHev: 'Silnik spalinowy / Hybryda (HEV)',
    engineStartPoint: 'Punkt startu silnika spalinowego',
    bufferReached: 'osiągnięto bufor SoC',
    segmentTitle: 'Szczegółowa telemetria odcinków trasy',
    showSegments: 'Pokaż szczegóły odcinków',
    hideSegments: 'Ukryj szczegóły odcinków',
    colStep: 'Odcinek / Droga',
    colSpeed: 'Śr. prędkość',
    colType: 'Typ drogi',
    colMode: 'Tryb napędu',
    colSoC: 'Końcowy SoC',
    colDraw: 'Zużycie energii',
    urban: 'Miejski (< 50 km/h)',
    suburban: 'Podmiejski (50-90 km/h)',
    highway: 'Autostrada (> 90 km/h)',
    blended: 'Wspomaganie hybrydowe',
    noRouteFound: 'Nie udało się wyznaczyć trasy dla podanych punktów.',
    searchError: 'Wystąpił błąd podczas kalkulacji trasy.'
  },
  de: {
    quickTrips: 'Beliebte europäische Reiserouten',
    originLabel: 'Startort (A)',
    originPlaceholder: 'Stadt, Straße, Hausnummer oder PLZ...',
    destLabel: 'Zielort (B)',
    destPlaceholder: 'Zielstadt oder Adresse eingeben...',
    selectModel: 'PHEV-Modell auswählen',
    specsTitle: 'Antriebs- & Batteriespezifikationen',
    usableBattery: 'Nutzbare Batteriekapazität',
    bufferSoC: 'Hybrid-Puffer SoC',
    maxEvSpeed: 'Max. rein el. Tempo',
    heatPump: 'Wärmepumpe',
    equipped: 'Vorhanden',
    notEquipped: 'Standard PTC',
    batteryCell: 'Zellchemie',
    iceDraw: 'Verbrauch leer (ICE)',
    departureSoC: 'Start-Akkuladestand (SoC)',
    bufferReserve: 'Zwangshybrid-Puffer',
    usableEnergy: 'Nutzbare EV-Energie',
    ambientTemp: 'Außentemperatur',
    liveWeatherFor: 'Echtzeit-Wetter für:',
    optimalTemp: 'Optimal (kein Heizverlust)',
    subZeroPenalty: 'Reichweitenverlust durch Frost',
    mildCoolPenalty: 'Klimatisierungsaufwand bei Kühle',
    simulateBtn: 'Route & Energiefluss berechnen',
    calculating: 'Route und Energiefluss werden berechnet...',
    evDriving: 'Rein elektrisch (EV)',
    hevDriving: 'Hybrid / Benzinmotor (HEV)',
    ofTotalTrip: 'der Gesamtreise',
    totalTrip: 'Gesamtstrecke',
    energyUsed: 'Gesamtenergieverbrauch',
    electricity: 'Strom',
    petrol: 'Benzin',
    efficiency: 'Durchschnittsverbrauch',
    coldWarningTitle: 'Kälte- und Heizungsverlust-Warnung',
    heatPumpBenefit: 'Wärmepumpe begrenzt den Reichweitenverlust auf:',
    ptcWarning: 'Standard-PTC-Heizung verursacht Reichweitenverlust von:',
    mapTitle: 'Interaktive Routenkarte & Hybrid-Übergang',
    mapLegendEv: 'Rein elektrisch (EV)',
    mapLegendHev: 'Hybrid / Verbrenner (HEV)',
    engineStartPoint: 'Startpunkt Verbrennungsmotor',
    bufferReached: 'SoC-Puffer erreicht',
    segmentTitle: 'Detaillierte Strecken- & Segment-Telemetrie',
    showSegments: 'Segment-Details anzeigen',
    hideSegments: 'Segment-Details ausblenden',
    colStep: 'Abschnitt / Straße',
    colSpeed: 'Geschwindigkeit',
    colType: 'Straßentyp',
    colMode: 'Modus',
    colSoC: 'End-SoC',
    colDraw: 'Energieaufwand',
    urban: 'Stadt (< 50 km/h)',
    suburban: 'Überland (50-90 km/h)',
    highway: 'Autobahn (> 90 km/h)',
    blended: 'Parallele Unterstützung',
    noRouteFound: 'Keine Route zwischen diesen Koordinaten gefunden.',
    searchError: 'Fehler bei der Routenberechnung.'
  },
  fr: {
    quickTrips: 'Trajets européens rapides',
    originLabel: 'Point de départ (A)',
    originPlaceholder: 'Ville, rue, numéro ou code postal...',
    destLabel: 'Destination (Point B)',
    destPlaceholder: "Ville d'arrivée ou adresse...",
    selectModel: 'Sélectionner le modèle PHEV',
    specsTitle: 'Spécifications de la motorisation & batterie',
    usableBattery: 'Batterie utilisable',
    bufferSoC: 'Tampon hybride SoC',
    maxEvSpeed: 'Vitesse max 100% électrique',
    heatPump: 'Pompe à chaleur',
    equipped: 'Équipé',
    notEquipped: 'PTC standard',
    batteryCell: 'Chimie de cellule',
    iceDraw: 'Conso essence batterie vide',
    departureSoC: 'Niveau de charge au départ (SoC)',
    bufferReserve: 'réserve tampon hybride',
    usableEnergy: 'Énergie EV disponible',
    ambientTemp: 'Température extérieure',
    liveWeatherFor: 'Météo en direct pour :',
    optimalTemp: 'Optimal (pas de perte de chauffage)',
    subZeroPenalty: 'Perte grand froid négatif',
    mildCoolPenalty: 'Consommation chauffage par temps frais',
    simulateBtn: "Simuler l'itinéraire & l'énergie hybride",
    calculating: "Calcul de l'itinéraire et des flux d'énergie...",
    evDriving: '100% Électrique (EV)',
    hevDriving: 'Hybride / Essence (ICE)',
    ofTotalTrip: 'du trajet total',
    totalTrip: 'Distance totale',
    energyUsed: 'Énergie totale consommée',
    electricity: 'électricité',
    petrol: 'essence',
    efficiency: 'Consommation moyenne',
    coldWarningTitle: "Pertes d'autonomie dues au froid et au chauffage",
    heatPumpBenefit: "La pompe à chaleur limite la perte d'autonomie à :",
    ptcWarning: 'Le chauffage résistif PTC standard entraîne une perte de :',
    mapTitle: 'Carte interactive et point de transition hybride',
    mapLegendEv: '100% Électrique (EV)',
    mapLegendHev: 'Hybride / Essence (ICE)',
    engineStartPoint: 'Point de démarrage du moteur thermique',
    bufferReached: 'tampon SoC atteint',
    segmentTitle: 'Télémétrie détaillée segment par segment',
    showSegments: 'Afficher les détails des segments',
    hideSegments: 'Masquer les détails des segments',
    colStep: 'Étape / Route',
    colSpeed: 'Vitesse',
    colType: 'Type de route',
    colMode: 'Mode',
    colSoC: 'SoC final',
    colDraw: 'Énergie',
    urban: 'Urbain (< 50 km/h)',
    suburban: 'Périurbain (50-90 km/h)',
    highway: 'Autoroute (> 90 km/h)',
    blended: 'Assistance hybride',
    noRouteFound: "Aucun itinéraire routier n'a pu être calculé entre ces coordonnées.",
    searchError: "Une erreur est survenue lors du calcul de l'itinéraire."
  },
  es: {
    quickTrips: 'Rutas europeas rápidas',
    originLabel: 'Punto de partida (A)',
    originPlaceholder: 'Ciudad, calle, número o código postal...',
    destLabel: 'Destino (Punto B)',
    destPlaceholder: 'Ciudad de destino o dirección...',
    selectModel: 'Seleccionar modelo PHEV',
    specsTitle: 'Especificaciones de batería y propulsión',
    usableBattery: 'Batería útil',
    bufferSoC: 'Búfer híbrido SoC',
    maxEvSpeed: 'Velocidad máx. 100% eléctrica',
    heatPump: 'Bomba de calor',
    equipped: 'Equipado',
    notEquipped: 'PTC estándar',
    batteryCell: 'Química de celda',
    iceDraw: 'Consumo gasolina descargada',
    departureSoC: 'Nivel de batería al inicio (SoC)',
    bufferReserve: 'reserva de búfer híbrido',
    usableEnergy: 'Energía eléctrica utilizable',
    ambientTemp: 'Temperatura ambiente',
    liveWeatherFor: 'Clima en directo para:',
    optimalTemp: 'Óptimo (sin pérdida climatización)',
    subZeroPenalty: 'Pérdida por temperaturas bajo cero',
    mildCoolPenalty: 'Consumo de calefacción con frío suave',
    simulateBtn: 'Simular ruta y energía híbrida',
    calculating: 'Calculando ruta y flujo de energía...',
    evDriving: '100% Eléctrico (EV)',
    hevDriving: 'Híbrido / Gasolina (ICE)',
    ofTotalTrip: 'del viaje total',
    totalTrip: 'Viaje total',
    energyUsed: 'Energía total consumida',
    electricity: 'electricidad',
    petrol: 'gasolina',
    efficiency: 'Consumo medio',
    coldWarningTitle: 'Pérdida de autonomía por frío y climatización',
    heatPumpBenefit: 'La bomba de calor limita la pérdida a:',
    ptcWarning: 'El calefactor resistivo PTC estándar causa una pérdida de:',
    mapTitle: 'Mapa interactivo de ruta y punto de transición híbrida',
    mapLegendEv: '100% Eléctrico (EV)',
    mapLegendHev: 'Híbrido / Gasolina (ICE)',
    engineStartPoint: 'Punto de encendido del motor térmico',
    bufferReached: 'alcanzado búfer SoC',
    segmentTitle: 'Telemetría tramo a tramo (ciudad y autopista)',
    showSegments: 'Mostrar detalles de los tramos',
    hideSegments: 'Ocultar detalles de los tramos',
    colStep: 'Tramo / Vía',
    colSpeed: 'Velocidad',
    colType: 'Tipo de vía',
    colMode: 'Modo',
    colSoC: 'SoC final',
    colDraw: 'Consumo',
    urban: 'Urbano (< 50 km/h)',
    suburban: 'Suburbano (50-90 km/h)',
    highway: 'Autopista (> 90 km/h)',
    blended: 'Asistencia híbrida',
    noRouteFound: 'No se pudo calcular una ruta de conducción entre estas coordenadas.',
    searchError: 'Ocurrió un error al calcular la ruta.'
  }
}

export default function PHEVRouteSimulator({ initialCarId, locale = 'en' }: PHEVRouteSimulatorProps) {
  const models = useMemo(() => getAllPHEVModels(), [])

  // Sync with global language changes
  const [currentLocale, setCurrentLocale] = useState(locale || 'en')

  useEffect(() => {
    if (locale) setCurrentLocale(locale)
  }, [locale])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('phevs-language')
      if (stored) setCurrentLocale(stored)
    }

    const onLangChange = (e: any) => {
      if (e.detail?.language) {
        setCurrentLocale(e.detail.language)
      }
    }
    window.addEventListener('languageChanged', onLangChange)
    return () => window.removeEventListener('languageChanged', onLangChange)
  }, [])

  const t = I18N[currentLocale] || I18N.en

  // 1. Vehicle Selection State
  const [selectedModelId, setSelectedModelId] = useState<string>(() => {
    if (initialCarId && models.some(m => m.id === initialCarId || m.slug === initialCarId)) {
      return initialCarId
    }
    const rav4 = models.find(m => m.name.toLowerCase().includes('rav4') || m.slug?.includes('rav4'))
    return rav4 ? rav4.id : models[0]?.id || ''
  })

  const selectedVehicle = useMemo(() => {
    return models.find(m => m.id === selectedModelId || m.slug === selectedModelId) || models[0]
  }, [models, selectedModelId])

  // 2. Waypoints State
  const [originQuery, setOriginQuery] = useState('Berlin')
  const [destQuery, setDestQuery] = useState('Leipzig')
  const [originPoint, setOriginPoint] = useState<LocationWaypoint>(PRESET_ROUTES[0].origin)
  const [destPoint, setDestPoint] = useState<LocationWaypoint>(PRESET_ROUTES[0].dest)

  // Autocomplete Suggestions
  const [originSuggestions, setOriginSuggestions] = useState<LocationWaypoint[]>([])
  const [destSuggestions, setDestSuggestions] = useState<LocationWaypoint[]>([])
  const [isSearchingOrigin, setIsSearchingOrigin] = useState(false)
  const [isSearchingDest, setIsSearchingDest] = useState(false)

  const originContainerRef = useRef<HTMLDivElement>(null)
  const destContainerRef = useRef<HTMLDivElement>(null)

  // Close suggestions on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (originContainerRef.current && !originContainerRef.current.contains(e.target as Node)) {
        setOriginSuggestions([])
      }
      if (destContainerRef.current && !destContainerRef.current.contains(e.target as Node)) {
        setDestSuggestions([])
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // 3. Physical Parameters State
  const [startSoC, setStartSoC] = useState<number>(100) // %
  const [ambientTempC, setAmbientTempC] = useState<number>(12) // °C
  const [isFetchingWeather, setIsFetchingWeather] = useState(false)
  const [weatherFetchedCity, setWeatherFetchedCity] = useState<string>('')

  // 4. Simulation Execution State
  const [isSimulating, setIsSimulating] = useState(false)
  const [simulationResult, setSimulationResult] = useState<RouteSimulationResult | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [showSegmentBreakdown, setShowSegmentBreakdown] = useState(false)

  // Fetch live weather from Open-Meteo when origin changes
  const fetchWeatherForOrigin = async (point: LocationWaypoint) => {
    setIsFetchingWeather(true)
    try {
      const res = await fetch(`/api/simulator/weather?lat=${point.lat}&lon=${point.lon}`)
      if (res.ok) {
        const data = await res.json()
        if (typeof data.temperature === 'number') {
          setAmbientTempC(Math.round(data.temperature))
          setWeatherFetchedCity(point.name)
        }
      }
    } catch (e) {
      console.warn('Weather fetch warning:', e)
    } finally {
      setIsFetchingWeather(false)
    }
  }

  // Geocoding Search Helper
  const searchGeocoding = async (query: string, setResults: (w: LocationWaypoint[]) => void, setLoading: (b: boolean) => void) => {
    if (!query || query.trim().length < 2) {
      setResults([])
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`/api/simulator/geocode?q=${encodeURIComponent(query)}`)
      if (res.ok) {
        const data = await res.json()
        setResults(data.results || [])
      }
    } catch (e) {
      console.warn('Geocode fetch warning:', e)
    } finally {
      setLoading(false)
    }
  }

  // Debounced search for Origin
  useEffect(() => {
    const timer = setTimeout(() => {
      if (originQuery && originQuery !== originPoint.name) {
        searchGeocoding(originQuery, setOriginSuggestions, setIsSearchingOrigin)
      }
    }, 350)
    return () => clearTimeout(timer)
  }, [originQuery])

  // Debounced search for Destination
  useEffect(() => {
    const timer = setTimeout(() => {
      if (destQuery && destQuery !== destPoint.name) {
        searchGeocoding(destQuery, setDestSuggestions, setIsSearchingDest)
      }
    }, 350)
    return () => clearTimeout(timer)
  }, [destQuery])

  // Run initial simulation on mount
  useEffect(() => {
    handleRunSimulation()
    fetchWeatherForOrigin(originPoint)
  }, [])

  // Execute Route & Physics Simulation
  const handleRunSimulation = async (customOrigin?: LocationWaypoint, customDest?: LocationWaypoint) => {
    const orig = customOrigin || originPoint
    const dest = customDest || destPoint
    if (!orig || !dest || !selectedVehicle) return

    setIsSimulating(true)
    setErrorMessage(null)

    try {
      // 1. Fetch Driving Route & Steps from OSRM
      const res = await fetch(
        `/api/simulator/route?lon1=${orig.lon}&lat1=${orig.lat}&lon2=${dest.lon}&lat2=${dest.lat}`
      )

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.error || `Routing engine error (Status ${res.status})`)
      }

      const data = await res.json()
      if (!data.route) {
        throw new Error(t.noRouteFound)
      }

      // 2. Feed Route into Simulation Engine
      const result = simulatePHEVRoute(
        data.route,
        selectedVehicle,
        startSoC,
        ambientTempC,
        orig,
        dest
      )

      setSimulationResult(result)
    } catch (err: any) {
      console.error('Simulation error:', err)
      setErrorMessage(err.message || t.searchError)
    } finally {
      setIsSimulating(false)
    }
  }

  // Energy Calculation Preview Helpers
  const activeEvPercentage = Math.max(0, startSoC - selectedVehicle.hybridThresholdSoC)
  const usableEnergyKwh = Math.round((selectedVehicle.usableBatteryKwh * (activeEvPercentage / 100)) * 10) / 10

  return (
    <div className="space-y-8">
      {/* Control Panel Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-7 shadow-xl space-y-6">
        
        {/* Quick Corridor Presets Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {t.quickTrips}
            </span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
            {PRESET_ROUTES.map((preset, idx) => {
              const isSelected = originPoint.name === preset.origin.name && destPoint.name === preset.dest.name
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setOriginPoint(preset.origin)
                    setDestPoint(preset.dest)
                    setOriginQuery(preset.origin.name)
                    setDestQuery(preset.dest.name)
                    setOriginSuggestions([])
                    setDestSuggestions([])
                    fetchWeatherForOrigin(preset.origin)
                    handleRunSimulation(preset.origin, preset.dest)
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-400'
                  }`}
                >
                  {preset.name}
                </button>
              )
            })}
          </div>
        </div>

        {/* Input Grid: Origin & Destination + Vehicle */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          
          {/* Origin Input */}
          <div className="relative" ref={originContainerRef}>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
              <MapPinIcon className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{t.originLabel}</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={originQuery}
                onChange={(e) => setOriginQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && originSuggestions.length > 0) {
                    const top = originSuggestions[0]
                    setOriginPoint(top)
                    setOriginQuery(top.name)
                    setOriginSuggestions([])
                    fetchWeatherForOrigin(top)
                  }
                }}
                placeholder={t.originPlaceholder}
                className="w-full pl-4 pr-10 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500 focus:outline-hidden text-sm"
              />
              {originQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setOriginQuery('')
                    setOriginSuggestions([])
                  }}
                  className="absolute right-8 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              )}
              {isSearchingOrigin && (
                <div className="absolute right-3 top-3.5 w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
              )}
            </div>

            {/* Origin Autocomplete Dropdown */}
            {originSuggestions.length > 0 && (
              <ul className="absolute z-50 left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl max-h-56 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700/60">
                {originSuggestions.map((s, idx) => (
                  <li
                    key={idx}
                    onClick={() => {
                      setOriginPoint(s)
                      setOriginQuery(s.name)
                      setOriginSuggestions([])
                      fetchWeatherForOrigin(s)
                    }}
                    className="px-4 py-2.5 hover:bg-blue-50 dark:hover:bg-slate-700 cursor-pointer text-xs text-slate-700 dark:text-slate-200 transition-colors"
                  >
                    <div className="font-semibold text-slate-900 dark:text-white">{s.name}</div>
                    <div className="text-[11px] text-slate-500 truncate">{s.displayName}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Destination Input */}
          <div className="relative" ref={destContainerRef}>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
              <MapPinIcon className="w-4 h-4 text-blue-600 shrink-0" />
              <span>{t.destLabel}</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={destQuery}
                onChange={(e) => setDestQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && destSuggestions.length > 0) {
                    const top = destSuggestions[0]
                    setDestPoint(top)
                    setDestQuery(top.name)
                    setDestSuggestions([])
                  }
                }}
                placeholder={t.destPlaceholder}
                className="w-full pl-4 pr-10 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500 focus:outline-hidden text-sm"
              />
              {destQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setDestQuery('')
                    setDestSuggestions([])
                  }}
                  className="absolute right-8 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              )}
              {isSearchingDest && (
                <div className="absolute right-3 top-3.5 w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              )}
            </div>

            {/* Destination Autocomplete Dropdown */}
            {destSuggestions.length > 0 && (
              <ul className="absolute z-50 left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl max-h-56 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700/60">
                {destSuggestions.map((s, idx) => (
                  <li
                    key={idx}
                    onClick={() => {
                      setDestPoint(s)
                      setDestQuery(s.name)
                      setDestSuggestions([])
                    }}
                    className="px-4 py-2.5 hover:bg-blue-50 dark:hover:bg-slate-700 cursor-pointer text-xs text-slate-700 dark:text-slate-200 transition-colors"
                  >
                    <div className="font-semibold text-slate-900 dark:text-white">{s.name}</div>
                    <div className="text-[11px] text-slate-500 truncate">{s.displayName}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Vehicle Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
              <BoltIcon className="w-4 h-4 text-amber-500 shrink-0" />
              <span>{t.selectModel}</span>
            </label>
            <select
              value={selectedModelId}
              onChange={(e) => setSelectedModelId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-hidden text-sm"
            >
              {models.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.wltpRangeKm} km WLTP)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Selected Vehicle Architecture Specification Badges */}
        {selectedVehicle && (
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5 flex items-center gap-2">
              <CheckBadgeIcon className="w-4 h-4 text-emerald-600" />
              <span>{selectedVehicle.name} — {t.specsTitle}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-xs">
              
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/80">
                <span className="text-[10px] text-slate-500 block uppercase font-medium">{t.usableBattery}</span>
                <span className="font-bold text-slate-900 dark:text-white text-sm">
                  {selectedVehicle.usableBatteryKwh} <span className="text-xs font-normal text-slate-500">/ {selectedVehicle.grossBatteryKwh} kWh</span>
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/80">
                <span className="text-[10px] text-slate-500 block uppercase font-medium">{t.bufferSoC}</span>
                <span className="font-bold text-amber-600 dark:text-amber-400 text-sm">
                  %{selectedVehicle.hybridThresholdSoC}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/80">
                <span className="text-[10px] text-slate-500 block uppercase font-medium">{t.maxEvSpeed}</span>
                <span className="font-bold text-blue-600 dark:text-blue-400 text-sm">
                  {selectedVehicle.maxEvCruisingSpeed} <span className="text-xs font-normal">km/h</span>
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/80">
                <span className="text-[10px] text-slate-500 block uppercase font-medium">{t.heatPump}</span>
                <span className={`font-bold text-sm ${selectedVehicle.hasHeatPump ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'}`}>
                  {selectedVehicle.hasHeatPump ? `✓ ${t.equipped}` : `✕ ${t.notEquipped}`}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/80">
                <span className="text-[10px] text-slate-500 block uppercase font-medium">{t.batteryCell}</span>
                <span className="font-bold text-purple-600 dark:text-purple-400 text-sm">
                  {selectedVehicle.batteryChemistry}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/80">
                <span className="text-[10px] text-slate-500 block uppercase font-medium">{t.iceDraw}</span>
                <span className="font-bold text-rose-600 dark:text-rose-400 text-sm">
                  {selectedVehicle.depletedFuelLPer100km} <span className="text-xs font-normal">L/100km</span>
                </span>
              </div>

            </div>
          </div>
        )}

        {/* Sliders Section: SoC and Ambient Temperature */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-slate-100 dark:border-slate-800">
          
          {/* Departure SoC Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300">
                {t.departureSoC}
              </span>
              <span className="font-black text-sm text-emerald-600 dark:text-emerald-400">
                %{startSoC}
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              step="10"
              value={startSoC}
              onChange={(e) => setStartSoC(parseInt(e.target.value, 10))}
              className="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
            />
            <div className="flex justify-between text-[11px] text-slate-500 font-medium">
              <span>%{selectedVehicle.hybridThresholdSoC} {t.bufferReserve}</span>
              <span>{t.usableEnergy}: {usableEnergyKwh} kWh</span>
            </div>
          </div>

          {/* Ambient Temperature Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  {t.ambientTemp}
                </span>
                {weatherFetchedCity && (
                  <span className="text-[11px] text-blue-600 dark:text-blue-400 font-medium flex items-center gap-1">
                    {isFetchingWeather ? (
                      <ArrowPathIcon className="w-3 h-3 animate-spin" />
                    ) : (
                      `(${t.liveWeatherFor} ${weatherFetchedCity})`
                    )}
                  </span>
                )}
              </div>
              <span className={`font-black text-sm ${ambientTempC < 0 ? 'text-blue-600 dark:text-blue-400' : ambientTempC >= 20 ? 'text-amber-600' : 'text-slate-800 dark:text-white'}`}>
                {ambientTempC}°C
              </span>
            </div>
            <input
              type="range"
              min="-15"
              max="35"
              step="1"
              value={ambientTempC}
              onChange={(e) => setAmbientTempC(parseInt(e.target.value, 10))}
              className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
            />
            <div className="flex justify-between text-[11px] text-slate-500 font-medium">
              <span>-15°C (Extreme Winter)</span>
              <span>
                {ambientTempC >= 18 ? t.optimalTemp : ambientTempC < 0 ? t.subZeroPenalty : t.mildCoolPenalty}
              </span>
              <span>+35°C (Summer)</span>
            </div>
          </div>

        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => handleRunSimulation()}
            disabled={isSimulating}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-blue-500/25 hover:shadow-blue-500/35 transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
          >
            {isSimulating ? (
              <>
                <ArrowPathIcon className="w-5 h-5 animate-spin" />
                <span>{t.calculating}</span>
              </>
            ) : (
              <>
                <SparklesIcon className="w-5 h-5 text-amber-300" />
                <span>{t.simulateBtn}</span>
              </>
            )}
          </button>
        </div>

        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-xs sm:text-sm font-medium flex items-center gap-2">
            <ExclamationTriangleIcon className="w-5 h-5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

      </div>

      {/* Simulation Results Section */}
      {simulationResult && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* Telemetry Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* EV Range Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/5 dark:from-emerald-950/40 dark:to-teal-950/20 border border-emerald-500/20 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-700 dark:text-emerald-400">
                <span className="flex items-center gap-1.5">
                  <BoltIcon className="w-4 h-4 text-emerald-500" />
                  {t.evDriving}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-[11px] font-extrabold">
                  %{simulationResult.evPercentage} {t.ofTotalTrip}
                </span>
              </div>
              <div className="text-3xl font-black text-slate-900 dark:text-white pt-1">
                {simulationResult.evDistanceKm} <span className="text-sm font-semibold text-slate-500">km</span>
              </div>
              <div className="text-xs text-slate-500">
                WLTP: {selectedVehicle.wltpRangeKm} km
              </div>
            </div>

            {/* HEV Range Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/5 dark:from-amber-950/40 dark:to-orange-950/20 border border-amber-500/20 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-xs font-bold text-amber-700 dark:text-amber-400">
                <span className="flex items-center gap-1.5">
                  <FireIcon className="w-4 h-4 text-amber-500" />
                  {t.hevDriving}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-[11px] font-extrabold">
                  %{simulationResult.hevPercentage} {t.ofTotalTrip}
                </span>
              </div>
              <div className="text-3xl font-black text-slate-900 dark:text-white pt-1">
                {simulationResult.hevDistanceKm} <span className="text-sm font-semibold text-slate-500">km</span>
              </div>
              <div className="text-xs text-slate-500">
                {t.totalTrip}: {simulationResult.totalDistanceKm} km
              </div>
            </div>

            {/* Total Energy Used Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-500/10 to-indigo-500/5 dark:from-blue-950/40 dark:to-indigo-950/20 border border-blue-500/20 shadow-xs space-y-1">
              <div className="text-xs font-bold text-blue-700 dark:text-blue-400 flex items-center gap-1.5">
                <SparklesIcon className="w-4 h-4 text-blue-500" />
                {t.energyUsed}
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white pt-1">
                {simulationResult.totalElecKwh} <span className="text-xs font-semibold text-slate-500">kWh</span>
                <span className="text-sm font-normal text-slate-400 mx-1.5">+</span>
                {simulationResult.totalFuelLiters} <span className="text-xs font-semibold text-slate-500">L {t.petrol}</span>
              </div>
              <div className="text-xs text-slate-500">
                {simulationResult.totalDurationMinutes} min journey
              </div>
            </div>

            {/* Efficiency & Fuel Economy */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/5 dark:from-purple-950/40 dark:to-pink-950/20 border border-purple-500/20 shadow-xs space-y-1">
              <div className="text-xs font-bold text-purple-700 dark:text-purple-400 flex items-center gap-1.5">
                <ShieldCheckIcon className="w-4 h-4 text-purple-500" />
                {t.efficiency}
              </div>
              <div className="text-xl font-black text-slate-900 dark:text-white pt-1">
                {simulationResult.avgElecEfficiencyKwh100} <span className="text-xs font-semibold text-slate-500">kWh/100km</span>
              </div>
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {simulationResult.avgFuelEfficiencyL100} L/100km {t.petrol}
              </div>
            </div>

          </div>

          {/* Cold Weather Penalty Alert Banner */}
          {simulationResult.coldWeatherPenaltyPct > 0 && (
            <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 text-sky-900 dark:text-sky-200 text-xs sm:text-sm flex items-start gap-3">
              <div className="p-2 rounded-xl bg-sky-100 dark:bg-sky-900/60 text-sky-600 shrink-0 mt-0.5">
                ❄️
              </div>
              <div className="space-y-1">
                <div className="font-extrabold text-sm text-sky-950 dark:text-sky-100">
                  {t.coldWarningTitle}: -%{simulationResult.coldWeatherPenaltyPct}
                </div>
                <p className="text-xs text-sky-800 dark:text-sky-300 leading-relaxed">
                  {selectedVehicle.hasHeatPump ? (
                    <>
                      {t.heatPumpBenefit} <strong>%{simulationResult.coldWeatherPenaltyPct}</strong> ({simulationResult.ambientTempC}°C).
                    </>
                  ) : (
                    <>
                      {t.ptcWarning} <strong>%{simulationResult.coldWeatherPenaltyPct}</strong> ({simulationResult.ambientTempC}°C).
                    </>
                  )}
                </p>
              </div>
            </div>
          )}

          {/* Interactive Leaflet Map Visualizer */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                <MapPinIcon className="w-5 h-5 text-emerald-500" />
                <span>{t.mapTitle}</span>
              </h3>
              {simulationResult.transitionPoint && (
                <div className="text-xs font-bold px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 flex items-center gap-1.5">
                  <span>⚡→⛽</span>
                  <span>{t.engineStartPoint}: Km {simulationResult.transitionPoint.km} (%{simulationResult.transitionPoint.socBufferReached} {t.bufferReached})</span>
                </div>
              )}
            </div>

            <PHEVRouteMap simulation={simulationResult} height="540px" locale={currentLocale} />
          </div>

          {/* Segment-by-Segment Accordion */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 overflow-hidden">
            <button
              type="button"
              onClick={() => setShowSegmentBreakdown(!showSegmentBreakdown)}
              className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/40 text-left transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                <AdjustmentsHorizontalIcon className="w-4 h-4 text-blue-500" />
                <span>{t.segmentTitle} ({simulationResult.steps.length} {t.colStep.toLowerCase()})</span>
              </div>
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                {showSegmentBreakdown ? `▲ ${t.hideSegments}` : `▼ ${t.showSegments}`}
              </span>
            </button>

            {showSegmentBreakdown && (
              <div className="border-t border-slate-200 dark:border-slate-800 overflow-x-auto max-h-96">
                <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                  <thead className="bg-slate-50 dark:bg-slate-800/80 text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="px-4 py-3 font-bold">{t.colStep}</th>
                      <th className="px-3 py-3 font-bold">Mesafe</th>
                      <th className="px-3 py-3 font-bold">{t.colSpeed}</th>
                      <th className="px-3 py-3 font-bold">{t.colType}</th>
                      <th className="px-3 py-3 font-bold">{t.colMode}</th>
                      <th className="px-3 py-3 font-bold">{t.colSoC}</th>
                      <th className="px-4 py-3 font-bold">{t.colDraw}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-xs">
                    {simulationResult.steps.map((st) => (
                      <tr key={st.stepIndex} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="px-4 py-2.5 font-sans font-medium text-slate-900 dark:text-white max-w-[200px] truncate">
                          {st.roadName || `Segment #${st.stepIndex + 1}`}
                        </td>
                        <td className="px-3 py-2.5 whitespace-nowrap">{st.distanceKm} km</td>
                        <td className="px-3 py-2.5 whitespace-nowrap">{st.avgSpeedKmH} km/h</td>
                        <td className="px-3 py-2.5 whitespace-nowrap font-sans">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            st.roadType === 'urban' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                            st.roadType === 'suburban' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' :
                            'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                          }`}>
                            {st.roadType === 'urban' ? t.urban : st.roadType === 'suburban' ? t.suburban : t.highway}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 whitespace-nowrap font-sans">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold ${
                            st.mode === 'EV' ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300' :
                            st.mode === 'BLENDED' ? 'bg-blue-500/20 text-blue-700 dark:text-blue-300' :
                            'bg-amber-500/20 text-amber-700 dark:text-amber-300'
                          }`}>
                            {st.mode === 'EV' ? 'EV' : st.mode === 'BLENDED' ? t.blended : 'HEV'}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 whitespace-nowrap font-bold text-slate-900 dark:text-white">
                          %{st.endSoC}
                        </td>
                        <td className="px-4 py-2.5 whitespace-nowrap text-[11px]">
                          {st.elecConsumedKwh > 0 && <span className="text-emerald-600 font-bold">{st.elecConsumedKwh} kWh </span>}
                          {st.fuelConsumedLiters > 0 && <span className="text-amber-600 font-bold">{st.fuelConsumedLiters} L</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  )
}
