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
  XMarkIcon,
  CalendarDaysIcon,
  ClockIcon,
  ShareIcon,
  ClipboardDocumentIcon,
  ClipboardDocumentCheckIcon,
  LinkIcon,
  CheckIcon,
  PhotoIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline'
import html2canvas from 'html2canvas'
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
  onSelectVehicle?: (vehicle: PHEVModel) => void
}

interface DailyForecastItem {
  date: string
  tempMin: number
  tempMax: number
  tempMean: number
  weatherCode: number
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
  departNow: string
  planFuture: string
  selectDay: string
  selectTime: string
  morning: string
  noon: string
  evening: string
  night: string
  forecastNotice: string
  today: string
  tomorrow: string
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
  resultsTitle: string
  shareBtn: string
  shareModalTitle: string
  shareModalDesc: string
  copySummary: string
  copyLink: string
  copiedSummary: string
  copiedLink: string
  shareWhatsApp: string
  shareTwitter: string
  shareDevice: string
  close: string
  shareImage: string
  downloadImage: string
  copyImage: string
  copiedImage: string
  downloadedImage: string
  generatingImage: string
  highwaySpeedLabel: string
  speedPresetEco: string
  speedPresetNormal: string
  speedPresetFast: string
  speedPresetAutobahn: string
  speedNoticeExceeds: string
  overallSpeedLabel: string
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
    departNow: 'Depart Now (Live Weather)',
    planFuture: 'Plan Trip (7-10 Day Forecast)',
    selectDay: 'Select Departure Day:',
    selectTime: 'Departure Time:',
    morning: 'Morning (08:00)',
    noon: 'Noon (13:00)',
    evening: 'Evening (18:00)',
    night: 'Night (22:00)',
    forecastNotice: 'Forecasted weather auto-applied to calculation',
    today: 'Today',
    tomorrow: 'Tomorrow',
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
    searchError: 'An error occurred while calculating the route.',
    resultsTitle: 'Real-World Simulation Results',
    shareBtn: 'Share Summary',
    shareModalTitle: 'Share Simulation Summary',
    shareModalDesc: 'Share your route results, pure electric range and fuel usage with others.',
    copySummary: 'Copy Text Summary',
    copyLink: 'Copy Direct Link',
    copiedSummary: 'Summary Copied! ✓',
    copiedLink: 'Link Copied! ✓',
    shareWhatsApp: 'WhatsApp',
    shareTwitter: 'X / Twitter',
    shareDevice: 'Share via Apps',
    close: 'Close',
    shareImage: 'Share / Download Image',
    downloadImage: 'Download Image (PNG)',
    copyImage: 'Copy Image',
    copiedImage: 'Image Copied! ✓',
    downloadedImage: 'Image Downloaded! ✓',
    generatingImage: 'Generating Image...',
    highwaySpeedLabel: 'Highway Cruising Speed & Pace',
    speedPresetEco: 'Eco (100 km/h)',
    speedPresetNormal: 'Normal (115 km/h)',
    speedPresetFast: 'Fast (130 km/h)',
    speedPresetAutobahn: 'Autobahn (140 km/h)',
    speedNoticeExceeds: 'Pure EV Speed Ceiling Exceeded',
    overallSpeedLabel: 'Avg Speed'
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
    departNow: 'Hemen Çıkış (Anlık Hava)',
    planFuture: 'Gelecek Tarihli Plan (7-10 Günlük Tahmin)',
    selectDay: 'Kalkış Gününü Seçin:',
    selectTime: 'Kalkış Saati:',
    morning: 'Sabah (08:00)',
    noon: 'Öğle (13:00)',
    evening: 'Akşam (18:00)',
    night: 'Gece (22:00)',
    forecastNotice: 'Tahmini hava durumu hesaplamaya otomatik uygulandı',
    today: 'Bugün',
    tomorrow: 'Yarın',
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
    searchError: 'Rota hesaplanırken bir hata oluştu.',
    resultsTitle: 'Gerçek Yolculuk Simülasyon Sonuçları',
    shareBtn: 'Özeti Paylaş',
    shareModalTitle: 'Simülasyon Özetini Paylaş',
    shareModalDesc: 'Rota analizi, saf elektrikli menzil ve yakıt tüketim özetini tek tıkla paylaşın.',
    copySummary: 'Metin Özetini Kopyala',
    copyLink: 'Doğrudan Linki Kopyala',
    copiedSummary: 'Özet Kopyalandı! ✓',
    copiedLink: 'Link Kopyalandı! ✓',
    shareWhatsApp: 'WhatsApp',
    shareTwitter: 'X / Twitter',
    shareDevice: 'Cihazda Paylaş',
    close: 'Kapat',
    shareImage: 'Görsel Olarak Paylaş / İndir',
    downloadImage: 'Görseli İndir (PNG)',
    copyImage: 'Görseli Kopyala',
    copiedImage: 'Görsel Kopyalandı! ✓',
    downloadedImage: 'Görsel İndirildi! ✓',
    generatingImage: 'Görsel Hazırlanıyor...',
    highwaySpeedLabel: 'Otoyol Seyir Hızı & Sürüş Temposu',
    speedPresetEco: 'Eko (100 km/s)',
    speedPresetNormal: 'Normal (115 km/s)',
    speedPresetFast: 'Hızlı (130 km/s)',
    speedPresetAutobahn: 'Otoyol (140 km/s)',
    speedNoticeExceeds: 'Saf Elektrik Hız Tavanı Aşıldı',
    overallSpeedLabel: 'Ort. Hız'
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
    departNow: 'Wyjazd teraz (Na żywo)',
    planFuture: 'Zaplanuj wyjazd (Prognoza 7-10 dni)',
    selectDay: 'Wybierz dzień wyjazdu:',
    selectTime: 'Godzina wyjazdu:',
    morning: 'Rano (08:00)',
    noon: 'Południe (13:00)',
    evening: 'Wieczór (18:00)',
    night: 'Noc (22:00)',
    forecastNotice: 'Prognoza pogody automatycznie zastosowana w symulacji',
    today: 'Dzisiaj',
    tomorrow: 'Jutro',
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
    searchError: 'Wystąpił błąd podczas kalkulacji trasy.',
    resultsTitle: 'Wyniki Realnej Symulacji Trasy',
    shareBtn: 'Udostępnij Podsumowanie',
    shareModalTitle: 'Udostępnij Podsumowanie Symulacji',
    shareModalDesc: 'Podziel się analizą trasy, zasięgiem elektrycznym i zużyciem paliwa.',
    copySummary: 'Kopiuj Podsumowanie',
    copyLink: 'Kopiuj Bezpośredni Link',
    copiedSummary: 'Podsumowanie skopiowane! ✓',
    copiedLink: 'Link skopiowany! ✓',
    shareWhatsApp: 'WhatsApp',
    shareTwitter: 'X / Twitter',
    shareDevice: 'Udostępnij przez aplikacje',
    close: 'Zamknij',
    shareImage: 'Udostępnij / Pobierz Obraz',
    downloadImage: 'Pobierz Obraz (PNG)',
    copyImage: 'Kopiuj Obraz',
    copiedImage: 'Obraz Skopiowany! ✓',
    downloadedImage: 'Obraz Pobrany! ✓',
    generatingImage: 'Generowanie obrazu...',
    highwaySpeedLabel: 'Prędkość przelotowa na autostradzie',
    speedPresetEco: 'Eko (100 km/h)',
    speedPresetNormal: 'Normalnie (115 km/h)',
    speedPresetFast: 'Szybko (130 km/h)',
    speedPresetAutobahn: 'Autostrada (140 km/h)',
    speedNoticeExceeds: 'Przekroczono limit prędkości czystego EV',
    overallSpeedLabel: 'Śr. prędkość'
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
    departNow: 'Jetzt losfahren (Live)',
    planFuture: 'Reise planen (7-10 Tage Vorhersage)',
    selectDay: 'Abfahrtstag wählen:',
    selectTime: 'Abfahrtszeit:',
    morning: 'Morgens (08:00)',
    noon: 'Mittags (13:00)',
    evening: 'Abends (18:00)',
    night: 'Nachts (22:00)',
    forecastNotice: 'Wettervorhersage automatisch auf Simulation angewendet',
    today: 'Heute',
    tomorrow: 'Morgen',
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
    searchError: 'Fehler bei der Routenberechnung.',
    resultsTitle: 'Reale Simulationsergebnisse',
    shareBtn: 'Zusammenfassung Teilen',
    shareModalTitle: 'Simulations-Zusammenfassung Teilen',
    shareModalDesc: 'Teilen Sie Streckenanalyse, rein elektrische Reichweite und Kraftstoffverbrauch.',
    copySummary: 'Zusammenfassung Kopieren',
    copyLink: 'Direktlink Kopieren',
    copiedSummary: 'Zusammenfassung kopiert! ✓',
    copiedLink: 'Link kopiert! ✓',
    shareWhatsApp: 'WhatsApp',
    shareTwitter: 'X / Twitter',
    shareDevice: 'Über Apps Teilen',
    close: 'Schließen',
    shareImage: 'Bild Teilen / Herunterladen',
    downloadImage: 'Bild Herunterladen (PNG)',
    copyImage: 'Bild Kopieren',
    copiedImage: 'Bild Kopiert! ✓',
    downloadedImage: 'Bild Heruntergeladen! ✓',
    generatingImage: 'Bild wird erstellt...',
    highwaySpeedLabel: 'Autobahn-Reisegeschwindigkeit & Fahrtempo',
    speedPresetEco: 'Öko (100 km/h)',
    speedPresetNormal: 'Normal (115 km/h)',
    speedPresetFast: 'Schnell (130 km/h)',
    speedPresetAutobahn: 'Autobahn (140 km/h)',
    speedNoticeExceeds: 'Elektrische Höchstgeschwindigkeit überschritten',
    overallSpeedLabel: 'Ø Tempo'
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
    departNow: 'Départ immédiat (En direct)',
    planFuture: 'Planifier le voyage (Prévisions 7-10 jours)',
    selectDay: 'Sélectionner le jour de départ :',
    selectTime: 'Heure de départ :',
    morning: 'Matin (08:00)',
    noon: 'Midi (13:00)',
    evening: 'Soir (18:00)',
    night: 'Nuit (22:00)',
    forecastNotice: 'Météo prévisionnelle appliquée au calcul',
    today: "Aujourd'hui",
    tomorrow: 'Demain',
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
    searchError: "Une erreur est survenue lors du calcul de l'itinéraire.",
    resultsTitle: 'Résultats de la simulation en conditions réelles',
    shareBtn: 'Partager le Résumé',
    shareModalTitle: 'Partager le Résumé de Simulation',
    shareModalDesc: 'Partagez votre analyse d’itinéraire, autonomie électrique et consommation de carburant.',
    copySummary: 'Copier le Résumé Texte',
    copyLink: 'Copier le Lien Direct',
    copiedSummary: 'Résumé copié ! ✓',
    copiedLink: 'Lien copié ! ✓',
    shareWhatsApp: 'WhatsApp',
    shareTwitter: 'X / Twitter',
    shareDevice: 'Partager via les applis',
    close: 'Fermer',
    shareImage: 'Partager / Télécharger l’Image',
    downloadImage: 'Télécharger l’Image (PNG)',
    copyImage: 'Copier l’Image',
    copiedImage: 'Image Copiée ! ✓',
    downloadedImage: 'Image Téléchargée ! ✓',
    generatingImage: 'Génération de l’image...',
    highwaySpeedLabel: 'Vitesse de croisière sur autoroute',
    speedPresetEco: 'Éco (100 km/h)',
    speedPresetNormal: 'Normal (115 km/h)',
    speedPresetFast: 'Rapide (130 km/h)',
    speedPresetAutobahn: 'Autoroute (140 km/h)',
    speedNoticeExceeds: 'Plafond de vitesse 100% électrique dépassé',
    overallSpeedLabel: 'Vitesse moy.'
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
    departNow: 'Salida ahora (En vivo)',
    planFuture: 'Planificar viaje (Pronóstico 7-10 días)',
    selectDay: 'Seleccionar día de salida:',
    selectTime: 'Hora de salida:',
    morning: 'Mañana (08:00)',
    noon: 'Mediodía (13:00)',
    evening: 'Tarde (18:00)',
    night: 'Noche (22:00)',
    forecastNotice: 'Pronóstico del tiempo aplicado al cálculo',
    today: 'Hoy',
    tomorrow: 'Mañana',
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
    searchError: 'Ocurrió un error al calcular la ruta.',
    resultsTitle: 'Resultados de la Simulación Real',
    shareBtn: 'Compartir Resumen',
    shareModalTitle: 'Compartir Resumen de Simulación',
    shareModalDesc: 'Comparte el análisis de ruta, autonomía eléctrica y consumo de combustible.',
    copySummary: 'Copiar Resumen de Texto',
    copyLink: 'Copiar Enlace Directo',
    copiedSummary: '¡Resumen copiado! ✓',
    copiedLink: '¡Enlace copiado! ✓',
    shareWhatsApp: 'WhatsApp',
    shareTwitter: 'X / Twitter',
    shareDevice: 'Compartir con Apps',
    close: 'Cerrar',
    shareImage: 'Compartir / Descargar Imagen',
    downloadImage: 'Descargar Imagen (PNG)',
    copyImage: 'Copiar Imagen',
    copiedImage: '¡Imagen Copiada! ✓',
    downloadedImage: '¡Imagen Descargada! ✓',
    generatingImage: 'Generando Imagen...',
    highwaySpeedLabel: 'Velocidad de crucero en autopista',
    speedPresetEco: 'Eco (100 km/h)',
    speedPresetNormal: 'Normal (115 km/h)',
    speedPresetFast: 'Rápido (130 km/h)',
    speedPresetAutobahn: 'Autovía (140 km/h)',
    speedNoticeExceeds: 'Límite de velocidad en modo 100% eléctrico superado',
    overallSpeedLabel: 'Vel. media'
  }
}

function getWeatherDetails(code: number, loc: string): { emoji: string; label: string } {
  if (code === 0) {
    const l: Record<string, string> = { en: 'Clear sky', tr: 'Açık gökyüzü', pl: 'Bezchmurnie', de: 'Klarer Himmel', fr: 'Ciel dégagé', es: 'Cielo despejado' }
    return { emoji: '☀️', label: l[loc] || l.en }
  }
  if (code <= 3) {
    const l: Record<string, string> = { en: 'Partly cloudy', tr: 'Parçalı bulutlu', pl: 'Częściowo pochmurno', de: 'Teils bewölkt', fr: 'Partiellement nuageux', es: 'Parcialmente nublado' }
    return { emoji: '⛅', label: l[loc] || l.en }
  }
  if (code === 45 || code === 48) {
    const l: Record<string, string> = { en: 'Fog', tr: 'Sisli', pl: 'Mgła', de: 'Nebel', fr: 'Brouillard', es: 'Niebla' }
    return { emoji: '🌫️', label: l[loc] || l.en }
  }
  if (code >= 51 && code <= 67) {
    const l: Record<string, string> = { en: 'Rainy', tr: 'Yağmurlu', pl: 'Deszcz', de: 'Regen', fr: 'Pluvieux', es: 'Lluvioso' }
    return { emoji: '🌧️', label: l[loc] || l.en }
  }
  if (code >= 71 && code <= 77) {
    const l: Record<string, string> = { en: 'Snowy', tr: 'Karlı', pl: 'Śnieg', de: 'Schnee', fr: 'Neigeux', es: 'Nieve' }
    return { emoji: '❄️', label: l[loc] || l.en }
  }
  if (code >= 80 && code <= 82) {
    const l: Record<string, string> = { en: 'Showers', tr: 'Sağanak yağış', pl: 'Przelotny deszcz', de: 'Regenschauer', fr: 'Averses', es: 'Chubascos' }
    return { emoji: '🌦️', label: l[loc] || l.en }
  }
  if (code >= 85 && code <= 86) {
    const l: Record<string, string> = { en: 'Snow showers', tr: 'Kar yağışlı', pl: 'Przelotny śnieg', de: 'Schneeschauer', fr: 'Averses de neige', es: 'Chubascos de nieve' }
    return { emoji: '🌨️', label: l[loc] || l.en }
  }
  if (code >= 95) {
    const l: Record<string, string> = { en: 'Thunderstorm', tr: 'Gök gürültülü fırtına', pl: 'Burza', de: 'Gewitter', fr: 'Orage', es: 'Tormenta' }
    return { emoji: '⛈️', label: l[loc] || l.en }
  }
  const l: Record<string, string> = { en: 'Fair', tr: 'Açık / Parçalı', pl: 'Umiarkowanie', de: 'Heiter', fr: 'Beau temps', es: 'Buen tiempo' }
  return { emoji: '🌤️', label: l[loc] || l.en }
}

function formatDayLabel(dateStr: string, loc: string, todayText: string, tomorrowText: string) {
  if (!dateStr) return ''
  const target = new Date(dateStr + 'T12:00:00')
  const now = new Date()
  const todayStr = now.toISOString().split('T')[0]
  const tomorrow = new Date(now)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const tomorrowStr = tomorrow.toISOString().split('T')[0]

  if (dateStr === todayStr) return todayText
  if (dateStr === tomorrowStr) return tomorrowText

  try {
    return target.toLocaleDateString(loc, { weekday: 'short', day: 'numeric', month: 'short' })
  } catch {
    return dateStr
  }
}

export default function PHEVRouteSimulator({ initialCarId, locale = 'en', onSelectVehicle }: PHEVRouteSimulatorProps) {
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
    if (initialCarId) {
      const targetP = initialCarId.toLowerCase()
      const found = models.find(m => 
        m.id.toLowerCase() === targetP || 
        (m.slug && m.slug.toLowerCase() === targetP) || 
        m.id.toLowerCase().includes(targetP) || 
        (m.slug && m.slug.toLowerCase().includes(targetP)) ||
        targetP.includes(m.id.toLowerCase())
      )
      if (found) return found.id
    }
    const rav4 = models.find(m => m.name.toLowerCase().includes('rav4') || m.slug?.includes('rav4'))
    return rav4 ? rav4.id : models[0]?.id || ''
  })

  const selectedVehicle = useMemo(() => {
    return models.find(m => m.id === selectedModelId || m.slug === selectedModelId) || models[0]
  }, [models, selectedModelId])

  // Synchronize URL query parameters with active simulation parameters
  const syncUrlWithState = (updates?: { car?: string; from?: string; to?: string; soc?: number; temp?: number; speed?: number }) => {
    if (typeof window === 'undefined') return
    try {
      const url = new URL(window.location.href)
      const c = updates?.car !== undefined ? updates.car : (selectedVehicle?.slug || selectedVehicle?.id)
      if (c) url.searchParams.set('car', c)
      const f = updates?.from !== undefined ? updates.from : (originPoint?.name || originQuery)
      if (f) url.searchParams.set('from', f)
      const t = updates?.to !== undefined ? updates.to : (destPoint?.name || destQuery)
      if (t) url.searchParams.set('to', t)
      const s = updates?.soc !== undefined ? updates.soc : startSoC
      if (s !== undefined) url.searchParams.set('soc', s.toString())
      const tmp = updates?.temp !== undefined ? updates.temp : ambientTempC
      if (tmp !== undefined) url.searchParams.set('temp', tmp.toString())
      const sp = updates?.speed !== undefined ? updates.speed : highwaySpeed
      if (sp !== undefined) url.searchParams.set('speed', sp.toString())
      window.history.replaceState(null, '', url.pathname + url.search)
    } catch (e) {
      console.warn('URL sync error:', e)
    }
  }

  // Handle vehicle dropdown selection and immediately sync URL
  const handleVehicleSelect = (modelId: string) => {
    setSelectedModelId(modelId)
    const veh = models.find(m => m.id === modelId || m.slug === modelId)
    if (veh) {
      if (onSelectVehicle) {
        onSelectVehicle(veh)
      }
      syncUrlWithState({ car: veh.slug || veh.id })
    }
  }

  // React to initialCarId prop changes from parent
  useEffect(() => {
    if (initialCarId) {
      const targetP = initialCarId.toLowerCase()
      const found = models.find(m => 
        m.id.toLowerCase() === targetP || 
        (m.slug && m.slug.toLowerCase() === targetP) || 
        m.id.toLowerCase().includes(targetP) || 
        (m.slug && m.slug.toLowerCase().includes(targetP)) ||
        targetP.includes(m.id.toLowerCase())
      )
      if (found && found.id !== selectedModelId) {
        setSelectedModelId(found.id)
      }
    }
  }, [initialCarId, models, selectedModelId])

  // Parse URL search parameters on mount if available
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const carP = params.get('car')
      const fromP = params.get('from')
      const toP = params.get('to')
      const socP = params.get('soc')
      const tempP = params.get('temp')
      const speedP = params.get('speed')

      if (carP) {
        const targetP = carP.toLowerCase()
        const matchedCar = models.find(m => 
          m.id.toLowerCase() === targetP || 
          (m.slug && m.slug.toLowerCase() === targetP) || 
          m.id.toLowerCase().includes(targetP) || 
          (m.slug && m.slug.toLowerCase().includes(targetP)) ||
          targetP.includes(m.id.toLowerCase())
        )
        if (matchedCar) {
          setSelectedModelId(matchedCar.id)
          if (onSelectVehicle) onSelectVehicle(matchedCar)
        }
      }

      if (socP && !isNaN(Number(socP))) {
        setStartSoC(Math.min(100, Math.max(10, Number(socP))))
      }
      if (tempP && !isNaN(Number(tempP))) {
        setAmbientTempC(Math.min(45, Math.max(-25, Number(tempP))))
      }
      if (speedP && !isNaN(Number(speedP))) {
        setHighwaySpeed(Math.min(160, Math.max(80, Number(speedP))))
      }
      if (fromP && fromP.trim()) {
        setOriginQuery(fromP)
      }
      if (toP && toP.trim()) {
        setDestQuery(toP)
      }
    }
  }, [models])

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

  // 3. Physical Parameters & Future Weather Planning State
  const [startSoC, setStartSoC] = useState<number>(100) // %
  const [ambientTempC, setAmbientTempC] = useState<number>(12) // °C
  const [highwaySpeed, setHighwaySpeed] = useState<number>(120) // km/h (Target Highway Cruising Speed)
  const cachedRouteRef = useRef<any>(null)
  const [isFetchingWeather, setIsFetchingWeather] = useState(false)
  const [weatherFetchedCity, setWeatherFetchedCity] = useState<string>('')

  // Multi-day Weather Forecast Planning State
  const [weatherMode, setWeatherMode] = useState<'now' | 'future'>('now')
  const [dailyForecasts, setDailyForecasts] = useState<DailyForecastItem[]>([])
  const [selectedTripDate, setSelectedTripDate] = useState<string>('')
  const [selectedTripHour, setSelectedTripHour] = useState<number>(8) // 08:00
  const [weatherCode, setWeatherCode] = useState<number>(0)

  // 4. Simulation Execution State
  const [isSimulating, setIsSimulating] = useState(false)
  const [simulationResult, setSimulationResult] = useState<RouteSimulationResult | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [showSegmentBreakdown, setShowSegmentBreakdown] = useState(false)

  // Fetch live or multi-day forecasted weather from Open-Meteo
  const fetchWeatherForOrigin = async (point: LocationWaypoint, targetDate?: string, targetHour?: number) => {
    setIsFetchingWeather(true)
    try {
      const qDate = targetDate !== undefined ? targetDate : (weatherMode === 'future' ? selectedTripDate : '')
      const qHour = targetHour !== undefined ? targetHour : selectedTripHour

      let url = `/api/simulator/weather?lat=${point.lat}&lon=${point.lon}`
      if (qDate) {
        url += `&date=${encodeURIComponent(qDate)}&hour=${qHour}`
      }

      const res = await fetch(url)
      if (res.ok) {
        const data = await res.json()
        if (typeof data.temperature === 'number') {
          setAmbientTempC(Math.round(data.temperature))
          setWeatherFetchedCity(point.name)
          if (typeof data.weatherCode === 'number') {
            setWeatherCode(data.weatherCode)
          }
          if (Array.isArray(data.daily) && data.daily.length > 0) {
            setDailyForecasts(data.daily)
            if (!qDate && data.daily[0]) {
              setSelectedTripDate(data.daily[0].date)
            }
          }
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
  const handleRunSimulation = async (
    customOrigin?: LocationWaypoint,
    customDest?: LocationWaypoint,
    customSpeed?: number
  ) => {
    const orig = customOrigin || originPoint
    const dest = customDest || destPoint
    const speed = customSpeed !== undefined ? customSpeed : highwaySpeed
    if (!orig || !dest || !selectedVehicle) return

    // Immediately keep the URL aligned with the simulated state
    syncUrlWithState({
      car: selectedVehicle.slug || selectedVehicle.id,
      from: orig.name || originQuery,
      to: dest.name || destQuery,
      soc: startSoC,
      temp: ambientTempC,
      speed: speed
    })

    setIsSimulating(true)
    setErrorMessage(null)

    try {
      let routeData = cachedRouteRef.current
      const isSameEndpoints = routeData &&
        orig.lat === originPoint.lat && orig.lon === originPoint.lon &&
        dest.lat === destPoint.lat && dest.lon === destPoint.lon

      if (!isSameEndpoints) {
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
        routeData = data.route
        cachedRouteRef.current = routeData
      }

      // 2. Feed Route into Simulation Engine
      const result = simulatePHEVRoute(
        routeData,
        selectedVehicle,
        startSoC,
        ambientTempC,
        orig,
        dest,
        speed
      )

      setSimulationResult(result)
    } catch (err: any) {
      console.error('Simulation error:', err)
      setErrorMessage(err.message || t.searchError)
    } finally {
      setIsSimulating(false)
    }
  }

  // Handle immediate Highway Cruising Speed change with live re-calculation
  const handleHighwaySpeedChange = (newSpeed: number) => {
    setHighwaySpeed(newSpeed)
    syncUrlWithState({ speed: newSpeed })
    if (cachedRouteRef.current && selectedVehicle) {
      const result = simulatePHEVRoute(
        cachedRouteRef.current,
        selectedVehicle,
        startSoC,
        ambientTempC,
        originPoint,
        destPoint,
        newSpeed
      )
      setSimulationResult(result)
    }
  }

  // Energy Calculation Preview Helpers
  const activeEvPercentage = Math.max(0, startSoC - selectedVehicle.hybridThresholdSoC)
  const usableEnergyKwh = Math.round((selectedVehicle.usableBatteryKwh * (activeEvPercentage / 100)) * 10) / 10
  const weatherInfo = getWeatherDetails(weatherCode, currentLocale)

  // 5. Dedicated Share Feature State & Helper Methods
  const summaryCardRef = useRef<HTMLDivElement>(null)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [copiedSummary, setCopiedSummary] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)
  const [copiedImage, setCopiedImage] = useState(false)
  const [downloadedImage, setDownloadedImage] = useState(false)

  const getShareUrl = () => {
    if (typeof window === 'undefined') return 'https://www.phevs.eu/range-calculator/'
    const url = new URL(window.location.origin + window.location.pathname)
    url.searchParams.set('car', selectedVehicle.slug || selectedVehicle.id)
    url.searchParams.set('from', originPoint.name || originQuery)
    url.searchParams.set('to', destPoint.name || destQuery)
    url.searchParams.set('soc', startSoC.toString())
    url.searchParams.set('temp', ambientTempC.toString())
    url.searchParams.set('speed', highwaySpeed.toString())
    return url.toString()
  }

  const generateShareText = () => {
    if (!simulationResult) return ''
    const shareUrl = getShareUrl()
    const coldPenaltyStr = simulationResult.coldWeatherPenaltyPct > 0 
      ? `\n❄️ ${selectedVehicle.hasHeatPump ? (currentLocale === 'tr' ? 'Isı Pompası Optimizasyonu' : 'Heat Pump Optimization') : (currentLocale === 'tr' ? 'Soğuk Hava Etkisi' : 'Cold Weather Penalty')}: -%${simulationResult.coldWeatherPenaltyPct}`
      : ''

    if (currentLocale === 'tr') {
      return `⚡ PHEVs.eu - Gerçek Yolculuk & Menzil Simülasyonu
🚗 Araç: ${selectedVehicle.name} (${selectedVehicle.usableBatteryKwh} kWh batarya / ${selectedVehicle.wltpRangeKm} km WLTP)
📍 Güzergah: ${originPoint.name} → ${destPoint.name} (${simulationResult.totalDistanceKm} km, ~${simulationResult.totalDurationMinutes} dk)
🌤️ Koşullar: ${ambientTempC}°C (${weatherInfo.label}) | Başlangıç Bataryası: %${startSoC}
🏎️ Sürüş Hızı: ${simulationResult.targetHighwaySpeedKmH} km/s Seyir (Ortalama Hız: ${simulationResult.overallAvgSpeedKmH} km/s)

🔋 Saf Elektrikli Sürüş (EV): ${simulationResult.evDistanceKm} km (%${simulationResult.evPercentage} rota payı)
⛽ Hibrit / Benzinli Sürüş (HEV): ${simulationResult.hevDistanceKm} km (%${simulationResult.hevPercentage} rota payı)
⚡ ICE Devreye Girme: ${simulationResult.transitionPoint ? `${simulationResult.transitionPoint.km}. km (%${simulationResult.transitionPoint.socBufferReached} tampon koruması)` : 'Devreye girmedi'}
⚡ Elektrik Tüketimi: ${simulationResult.totalElecKwh} kWh (${simulationResult.avgElecEfficiencyKwh100} kWh/100km)
⛽ Benzin Tüketimi: ${simulationResult.totalFuelLiters} L (${simulationResult.avgFuelEfficiencyL100} L/100km)${coldPenaltyStr}

👉 Canlı İnteraktif Simülasyon ve Harita:
${shareUrl}`
    }

    if (currentLocale === 'pl') {
      return `⚡ PHEVs.eu - Realna Symulacja Trasy i Zasięgu
🚗 Pojazd: ${selectedVehicle.name} (${selectedVehicle.usableBatteryKwh} kWh bateria / ${selectedVehicle.wltpRangeKm} km WLTP)
📍 Trasa: ${originPoint.name} → ${destPoint.name} (${simulationResult.totalDistanceKm} km, ~${simulationResult.totalDurationMinutes} min)
🌤️ Warunki: ${ambientTempC}°C (${weatherInfo.label}) | Startowy SoC: %${startSoC}
🏎️ Tempo jazdy: ${simulationResult.targetHighwaySpeedKmH} km/h na autostradzie (Średnia: ${simulationResult.overallAvgSpeedKmH} km/h)

🔋 Czysty napęd elektryczny (EV): ${simulationResult.evDistanceKm} km (%${simulationResult.evPercentage} trasy)
⛽ Napęd hybrydowy / benzynowy (HEV): ${simulationResult.hevDistanceKm} km (%${simulationResult.hevPercentage} trasy)
⚡ Uruchomienie silnika spalinowego: ${simulationResult.transitionPoint ? `${simulationResult.transitionPoint.km}. km (bufor %${simulationResult.transitionPoint.socBufferReached})` : 'Nie uruchomiono'}
⚡ Zużycie prądu: ${simulationResult.totalElecKwh} kWh (${simulationResult.avgElecEfficiencyKwh100} kWh/100km)
⛽ Zużycie benzyny: ${simulationResult.totalFuelLiters} L (${simulationResult.avgFuelEfficiencyL100} L/100km)${coldPenaltyStr}

👉 Otwórz interaktywną mapę i symulator:
${shareUrl}`
    }

    if (currentLocale === 'de') {
      return `⚡ PHEVs.eu - Reale Fahrt- und Reichweitensimulation
🚗 Modell: ${selectedVehicle.name} (${selectedVehicle.usableBatteryKwh} kWh Akku / ${selectedVehicle.wltpRangeKm} km WLTP)
📍 Route: ${originPoint.name} → ${destPoint.name} (${simulationResult.totalDistanceKm} km, ~${simulationResult.totalDurationMinutes} Min.)
🌤️ Wetter: ${ambientTempC}°C (${weatherInfo.label}) | Start-SoC: %${startSoC}
🏎️ Fahrtempo: ${simulationResult.targetHighwaySpeedKmH} km/h Reisetempo (Durchschnitt: ${simulationResult.overallAvgSpeedKmH} km/h)

🔋 Rein elektrisch (EV): ${simulationResult.evDistanceKm} km (%${simulationResult.evPercentage} der Strecke)
⛽ Hybrid / Benzin (HEV): ${simulationResult.hevDistanceKm} km (%${simulationResult.hevPercentage} der Strecke)
⚡ Verbrenner-Startpunkt: ${simulationResult.transitionPoint ? `Km ${simulationResult.transitionPoint.km} (%${simulationResult.transitionPoint.socBufferReached} Puffer)` : 'Nicht benötigt'}
⚡ Stromverbrauch: ${simulationResult.totalElecKwh} kWh (${simulationResult.avgElecEfficiencyKwh100} kWh/100km)
⛽ Benzinverbrauch: ${simulationResult.totalFuelLiters} L (${simulationResult.avgFuelEfficiencyL100} L/100km)${coldPenaltyStr}

👉 Interaktive Route & Simulation ansehen:
${shareUrl}`
    }

    return `⚡ PHEVs.eu - Real-World Route & Range Simulation
🚗 Vehicle: ${selectedVehicle.name} (${selectedVehicle.usableBatteryKwh} kWh battery / ${selectedVehicle.wltpRangeKm} km WLTP)
📍 Route: ${originPoint.name} → ${destPoint.name} (${simulationResult.totalDistanceKm} km, ~${simulationResult.totalDurationMinutes} min)
🌤️ Conditions: ${ambientTempC}°C (${weatherInfo.label}) | Departure SoC: %${startSoC}
🏎️ Driving Pace: ${simulationResult.targetHighwaySpeedKmH} km/h Cruising (Avg Speed: ${simulationResult.overallAvgSpeedKmH} km/h)

🔋 Pure EV Driving: ${simulationResult.evDistanceKm} km (${simulationResult.evPercentage}% of trip)
⛽ Hybrid / Petrol (HEV): ${simulationResult.hevDistanceKm} km (${simulationResult.hevPercentage}% of trip)
⚡ ICE Transition Point: ${simulationResult.transitionPoint ? `Km ${simulationResult.transitionPoint.km} (${simulationResult.transitionPoint.socBufferReached}% buffer reached)` : 'Pure EV only'}
⚡ Electricity Consumed: ${simulationResult.totalElecKwh} kWh (${simulationResult.avgElecEfficiencyKwh100} kWh/100km)
⛽ Petrol Consumed: ${simulationResult.totalFuelLiters} L (${simulationResult.avgFuelEfficiencyL100} L/100km)${coldPenaltyStr}

👉 View Interactive Route & Simulation:
${shareUrl}`
  }

  const handleCopySummary = async () => {
    const text = generateShareText()
    try {
      await navigator.clipboard.writeText(text)
      setCopiedSummary(true)
      setTimeout(() => setCopiedSummary(false), 2500)
    } catch (e) {
      console.warn('Clipboard copy failed:', e)
    }
  }

  const handleCopyLink = async () => {
    const url = getShareUrl()
    try {
      await navigator.clipboard.writeText(url)
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 2500)
    } catch (e) {
      console.warn('Clipboard copy failed:', e)
    }
  }

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share && simulationResult) {
      try {
        await navigator.share({
          title: `PHEVs.eu: ${selectedVehicle.name} Route Simulation`,
          text: generateShareText(),
          url: getShareUrl()
        })
      } catch (e) {
        // User cancelled
      }
    }
  }

  // Image Export & Share Helpers
  const generateCardCanvas = async (): Promise<HTMLCanvasElement | null> => {
    if (!summaryCardRef.current) return null
    setIsGeneratingImage(true)
    try {
      const canvas = await html2canvas(summaryCardRef.current, {
        scale: 3, // Ultra-sharp high-DPI capture
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false
      })
      return canvas
    } catch (e) {
      console.error('Canvas generation failed:', e)
      return null
    } finally {
      setIsGeneratingImage(false)
    }
  }

  const downloadImageFile = (dataUrl: string, fileName: string) => {
    const link = document.createElement('a')
    link.download = fileName
    link.href = dataUrl
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    setDownloadedImage(true)
    setTimeout(() => setDownloadedImage(false), 2500)
  }

  const handleShareOrDownloadImage = async () => {
    const canvas = await generateCardCanvas()
    if (!canvas) return

    const fileName = `phevs-eu-${selectedVehicle.slug || 'simulation'}-route.png`
    const dataUrl = canvas.toDataURL('image/png')

    // Try Web Share API with files if supported (e.g. mobile Safari, Android Chrome, Edge)
    if (typeof navigator !== 'undefined' && navigator.share && navigator.canShare) {
      try {
        const res = await fetch(dataUrl)
        const blob = await res.blob()
        const file = new File([blob], fileName, { type: 'image/png' })
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: `${selectedVehicle.name} - PHEVs.eu Route Simulation`,
            text: `${selectedVehicle.name}: ${originPoint.name} → ${destPoint.name} (${simulationResult?.totalDistanceKm} km)`,
            files: [file]
          })
          return
        }
      } catch (err: any) {
        if (err.name === 'AbortError') return
      }
    }

    // Direct download fallback
    downloadImageFile(dataUrl, fileName)
  }

  const handleCopyImageToClipboard = async () => {
    const canvas = await generateCardCanvas()
    if (!canvas) return
    const fileName = `phevs-eu-${selectedVehicle.slug || 'simulation'}-route.png`
    try {
      canvas.toBlob(async (blob) => {
        if (!blob) return
        if (typeof ClipboardItem !== 'undefined' && navigator.clipboard?.write) {
          try {
            await navigator.clipboard.write([
              new ClipboardItem({ 'image/png': blob })
            ])
            setCopiedImage(true)
            setTimeout(() => setCopiedImage(false), 2500)
            return
          } catch (writeErr) {
            console.warn('ClipboardItem write failed, downloading instead:', writeErr)
          }
        }
        // Fallback to download
        downloadImageFile(canvas.toDataURL('image/png'), fileName)
      }, 'image/png')
    } catch (e) {
      console.warn('Clipboard image write failed:', e)
      downloadImageFile(canvas.toDataURL('image/png'), fileName)
    }
  }

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
                    syncUrlWithState({
                      from: preset.origin.name,
                      to: preset.dest.name
                    })
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
              onChange={(e) => handleVehicleSelect(e.target.value)}
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

        {/* Departure Timing & Future Date Forecast Selection */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50/60 to-indigo-50/40 dark:from-slate-800/80 dark:to-indigo-950/20 border border-blue-200/60 dark:border-slate-700/80 space-y-3.5">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <CalendarDaysIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
                Trip Timing & Weather Forecasting
              </span>
            </div>

            {/* Mode Toggle: Depart Now vs Plan Trip Date */}
            <div className="inline-flex rounded-xl bg-white dark:bg-slate-900 p-1 border border-slate-200 dark:border-slate-700 shadow-xs self-start sm:self-auto">
              <button
                type="button"
                onClick={() => {
                  setWeatherMode('now')
                  fetchWeatherForOrigin(originPoint)
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  weatherMode === 'now'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                ⚡ {t.departNow}
              </button>

              <button
                type="button"
                onClick={() => {
                  setWeatherMode('future')
                  const targetD = selectedTripDate || dailyForecasts[0]?.date
                  if (targetD) {
                    setSelectedTripDate(targetD)
                    fetchWeatherForOrigin(originPoint, targetD, selectedTripHour)
                  }
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  weatherMode === 'future'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                📅 {t.planFuture}
              </button>
            </div>
          </div>

          {/* When Future Trip Mode is Active: 10-Day Strip & Hour Picker */}
          {weatherMode === 'future' && (
            <div className="space-y-3 pt-1 border-t border-blue-100 dark:border-slate-700/60 animate-in fade-in duration-200">
              
              {/* Day Selection Strip */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block uppercase tracking-wider">
                  {t.selectDay}
                </span>

                <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-thin">
                  {dailyForecasts.map((d) => {
                    const isSelected = selectedTripDate === d.date
                    const dayName = formatDayLabel(d.date, currentLocale, t.today, t.tomorrow)
                    const dayWeather = getWeatherDetails(d.weatherCode, currentLocale)

                    return (
                      <button
                        key={d.date}
                        type="button"
                        onClick={() => {
                          setSelectedTripDate(d.date)
                          fetchWeatherForOrigin(originPoint, d.date, selectedTripHour)
                        }}
                        className={`px-3 py-2 rounded-xl text-center shrink-0 border transition-all cursor-pointer min-w-[90px] ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-400/30'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-300'
                        }`}
                      >
                        <div className="text-[11px] font-extrabold truncate">{dayName}</div>
                        <div className="text-base my-0.5">{dayWeather.emoji}</div>
                        <div className="text-[10px] font-semibold opacity-90">
                          {d.tempMin}° / {d.tempMax}°C
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Departure Hour Pills */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  <ClockIcon className="w-3.5 h-3.5" />
                  <span>{t.selectTime}</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {[
                    { hour: 8, label: t.morning },
                    { hour: 13, label: t.noon },
                    { hour: 18, label: t.evening },
                    { hour: 22, label: t.night }
                  ].map((slot) => {
                    const isSelected = selectedTripHour === slot.hour
                    return (
                      <button
                        key={slot.hour}
                        type="button"
                        onClick={() => {
                          setSelectedTripHour(slot.hour)
                          fetchWeatherForOrigin(originPoint, selectedTripDate, slot.hour)
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-400'
                        }`}
                      >
                        {slot.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Selected Forecast Notice Badge */}
              <div className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-blue-200/70 dark:border-slate-700/70 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-base">{weatherInfo.emoji}</span>
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {weatherFetchedCity || originPoint.name}: {ambientTempC}°C
                    </span>
                    <span className="text-slate-500 ml-1.5">({weatherInfo.label})</span>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400">
                  ✓ {t.forecastNotice}
                </span>
              </div>

            </div>
          )}

        </div>

        {/* Sliders Section: SoC, Ambient Temperature, and Highway Cruising Speed */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-1 border-t border-slate-100 dark:border-slate-800">
          
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
              onChange={(e) => {
                const newSoC = parseInt(e.target.value, 10)
                setStartSoC(newSoC)
                if (cachedRouteRef.current && selectedVehicle) {
                  const result = simulatePHEVRoute(
                    cachedRouteRef.current,
                    selectedVehicle,
                    newSoC,
                    ambientTempC,
                    originPoint,
                    destPoint,
                    highwaySpeed
                  )
                  setSimulationResult(result)
                }
              }}
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
                      `(${weatherMode === 'now' ? t.liveWeatherFor : '📅'} ${weatherFetchedCity})`
                    )}
                  </span>
                )}
              </div>
              <span className={`font-black text-sm ${ambientTempC < 0 ? 'text-blue-600 dark:text-blue-400' : ambientTempC >= 20 ? 'text-amber-600' : 'text-slate-800 dark:text-white'}`}>
                {weatherInfo.emoji} {ambientTempC}°C
              </span>
            </div>
            <input
              type="range"
              min="-15"
              max="35"
              step="1"
              value={ambientTempC}
              onChange={(e) => {
                const newTemp = parseInt(e.target.value, 10)
                setAmbientTempC(newTemp)
                if (cachedRouteRef.current && selectedVehicle) {
                  const result = simulatePHEVRoute(
                    cachedRouteRef.current,
                    selectedVehicle,
                    startSoC,
                    newTemp,
                    originPoint,
                    destPoint,
                    highwaySpeed
                  )
                  setSimulationResult(result)
                }
              }}
              className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
            />
            <div className="flex justify-between text-[11px] text-slate-500 font-medium">
              <span>-15°C (Winter)</span>
              <span>
                {ambientTempC >= 18 ? t.optimalTemp : ambientTempC < 0 ? t.subZeroPenalty : t.mildCoolPenalty}
              </span>
              <span>+35°C (Summer)</span>
            </div>
          </div>

          {/* Highway Cruising Speed Slider & Presets */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <span>🏎️</span>
                <span>{t.highwaySpeedLabel}</span>
              </span>
              <span className="font-black text-sm text-indigo-600 dark:text-indigo-400">
                {highwaySpeed} km/h
              </span>
            </div>

            {/* Quick Speed Preset Pills */}
            <div className="grid grid-cols-4 gap-1.5 pt-0.5">
              {[
                { speed: 100, label: '100', desc: 'Eco' },
                { speed: 115, label: '115', desc: 'Normal' },
                { speed: 130, label: '130', desc: 'Fast' },
                { speed: 140, label: '140', desc: 'Max' }
              ].map((p) => {
                const isSelected = highwaySpeed === p.speed
                return (
                  <button
                    key={p.speed}
                    type="button"
                    onClick={() => handleHighwaySpeedChange(p.speed)}
                    className={`py-1.5 px-1 rounded-xl text-center border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-400'
                    }`}
                  >
                    <div className="text-xs font-black leading-tight">{p.label}</div>
                    <div className={`text-[9px] font-medium leading-tight ${isSelected ? 'text-indigo-100' : 'text-slate-400'}`}>
                      {p.desc}
                    </div>
                  </button>
                )
              })}
            </div>

            <input
              type="range"
              min="90"
              max="150"
              step="5"
              value={highwaySpeed}
              onChange={(e) => handleHighwaySpeedChange(parseInt(e.target.value, 10))}
              className="w-full accent-indigo-600 cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg mt-1"
            />
            <div className="flex justify-between text-[11px] font-medium">
              <span className="text-slate-500">90 km/h</span>
              <span className={highwaySpeed >= selectedVehicle.maxEvCruisingSpeed ? 'text-amber-600 dark:text-amber-400 font-bold' : highwaySpeed <= 100 ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-500'}>
                {highwaySpeed >= selectedVehicle.maxEvCruisingSpeed
                  ? `⚠️ >${selectedVehicle.maxEvCruisingSpeed} (ICE)`
                  : highwaySpeed <= 100
                  ? '🌱 Eko Seyir'
                  : `💨 +%${Math.round((Math.pow(highwaySpeed / 100, 1.45) - 1) * 100)} Direnç`}
              </span>
              <span className="text-slate-500">150 km/h</span>
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
          
          {/* Results Header with Dedicated Share Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200/80 dark:border-slate-800">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <SparklesIcon className="w-6 h-6 text-emerald-500 shrink-0" />
                <span>{t.resultsTitle}</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                {originPoint.name} → {destPoint.name} • <span className="font-bold text-slate-700 dark:text-slate-300">{selectedVehicle.name}</span>
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsShareModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white text-xs sm:text-sm font-extrabold shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 transition-all cursor-pointer self-start sm:self-auto shrink-0"
            >
              <ShareIcon className="w-4 h-4" />
              <span>{t.shareBtn}</span>
            </button>
          </div>

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
              <div className="flex items-center justify-between text-xs font-bold text-blue-700 dark:text-blue-400">
                <span className="flex items-center gap-1.5">
                  <SparklesIcon className="w-4 h-4 text-blue-500" />
                  {t.energyUsed}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-[10px] font-extrabold text-blue-700 dark:text-blue-300">
                  🏎️ {simulationResult.overallAvgSpeedKmH} km/h {t.overallSpeedLabel}
                </span>
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white pt-1">
                {simulationResult.totalElecKwh} <span className="text-xs font-semibold text-slate-500">kWh</span>
                <span className="text-sm font-normal text-slate-400 mx-1.5">+</span>
                {simulationResult.totalFuelLiters} <span className="text-xs font-semibold text-slate-500">L {t.petrol}</span>
              </div>
              <div className="text-xs text-slate-500 flex items-center justify-between">
                <span>⏱️ {simulationResult.totalDurationMinutes} min journey</span>
                <span className="font-semibold text-slate-600 dark:text-slate-400">
                  (Otoyol: {simulationResult.targetHighwaySpeedKmH} km/h)
                </span>
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

          {/* Pure EV Speed Ceiling Alert Banner */}
          {simulationResult.targetHighwaySpeedKmH >= selectedVehicle.maxEvCruisingSpeed && (
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs sm:text-sm flex items-start gap-3">
              <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-600 shrink-0 mt-0.5 font-bold text-sm">
                ⚡+⛽
              </div>
              <div className="space-y-1">
                <div className="font-extrabold text-sm text-amber-950 dark:text-amber-100 flex items-center gap-2">
                  <span>{t.speedNoticeExceeds}: {simulationResult.targetHighwaySpeedKmH} km/h &ge; {selectedVehicle.maxEvCruisingSpeed} km/h</span>
                </div>
                <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                  {currentLocale === 'tr' ? (
                    <>
                      {selectedVehicle.name} modelinin fabrika saf elektrik tavan hızı <strong>{selectedVehicle.maxEvCruisingSpeed} km/s</strong> seviyesindedir. Seçtiğiniz <strong>{simulationResult.targetHighwaySpeedKmH} km/s</strong> otoyol seyir hızında elektrik motoru aracı tek başına itemez; bu nedenle benzin motoru paralel devreye girerek (Blended / HEV) yakıt tüketimine başlamıştır.
                    </>
                  ) : currentLocale === 'de' ? (
                    <>
                      Die rein elektrische Höchstgeschwindigkeit des {selectedVehicle.name} liegt bei <strong>{selectedVehicle.maxEvCruisingSpeed} km/h</strong>. Bei Ihrem gewählten Autobahntempo von <strong>{simulationResult.targetHighwaySpeedKmH} km/h</strong> schaltet sich der Verbrennungsmotor zur Unterstützung automatisch zu (Blended-Modus).
                    </>
                  ) : currentLocale === 'pl' ? (
                    <>
                      Maksymalna prędkość czysto elektryczna dla {selectedVehicle.name} wynosi <strong>{selectedVehicle.maxEvCruisingSpeed} km/h</strong>. Przy wybranej prędkości autostradowej <strong>{simulationResult.targetHighwaySpeedKmH} km/h</strong> silnik spalinowy uruchamia się automatycznie w trybie równoległym (hybrydowym).
                    </>
                  ) : (
                    <>
                      The pure-EV top speed for {selectedVehicle.name} is <strong>{selectedVehicle.maxEvCruisingSpeed} km/h</strong>. At your chosen cruising speed of <strong>{simulationResult.targetHighwaySpeedKmH} km/h</strong>, the petrol combustion engine engages in parallel (Blended HEV mode).
                    </>
                  )}
                </p>
              </div>
            </div>
          )}

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

      {/* Dedicated Share Summary Modal Dialog */}
      {isShareModalOpen && simulationResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="fixed inset-0"
            onClick={() => setIsShareModalOpen(false)}
          />
          <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-5 sm:p-7 space-y-4 sm:space-y-5 z-10 max-h-[92vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3 sm:pb-4">
              <div className="space-y-0.5">
                <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <ShareIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
                  <span>{t.shareModalTitle}</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {t.shareModalDesc}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsShareModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label={t.close}
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Structured Summary Card Preview (Exportable as high-res Image) */}
            <div
              ref={summaryCardRef}
              className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/40 dark:from-slate-800/80 dark:to-indigo-950/30 border border-slate-200/80 dark:border-slate-700/80 space-y-3 shadow-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                <span className="font-extrabold text-slate-900 dark:text-white text-sm sm:text-base">
                  {selectedVehicle.name}
                </span>
                <span className="font-semibold text-blue-600 dark:text-blue-400 text-xs">
                  {selectedVehicle.usableBatteryKwh} kWh net / {selectedVehicle.wltpRangeKm} km WLTP
                </span>
              </div>
              
              <div className="text-xs text-slate-600 dark:text-slate-300 flex items-center justify-between border-t border-slate-200/60 dark:border-slate-700/60 pt-2 font-medium">
                <span>📍 {originPoint.name} → {destPoint.name}</span>
                <span className="font-bold">{simulationResult.totalDistanceKm} km (~{simulationResult.totalDurationMinutes} dk)</span>
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-1 text-xs">
                <div className="p-2.5 sm:p-3 rounded-xl bg-white dark:bg-slate-900 border border-emerald-500/20 shadow-2xs">
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block uppercase tracking-wide">
                    ⚡ {t.evDriving}
                  </span>
                  <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                    {simulationResult.evDistanceKm} km <span className="text-xs font-semibold text-emerald-600">(%{simulationResult.evPercentage})</span>
                  </span>
                </div>

                <div className="p-2.5 sm:p-3 rounded-xl bg-white dark:bg-slate-900 border border-amber-500/20 shadow-2xs">
                  <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold block uppercase tracking-wide">
                    ⛽ {t.hevDriving}
                  </span>
                  <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                    {simulationResult.hevDistanceKm} km <span className="text-xs font-semibold text-amber-600">(%{simulationResult.hevPercentage})</span>
                  </span>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 dark:text-slate-400 flex flex-wrap items-center justify-between gap-1 pt-1 border-t border-slate-200/50 dark:border-slate-700/50 font-medium">
                <span>⚡ {simulationResult.totalElecKwh} kWh + ⛽ {simulationResult.totalFuelLiters} L {t.petrol}</span>
                <span>🏎️ Ort. {simulationResult.overallAvgSpeedKmH} km/h (Seyir: {simulationResult.targetHighwaySpeedKmH} km/h)</span>
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
                <span>{weatherInfo.emoji} {ambientTempC}°C | %{startSoC} SoC</span>
                <span>⏱️ ~{simulationResult.totalDurationMinutes} dk</span>
              </div>

              {/* Watermark / Branding for exported image */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-200/40 dark:border-slate-700/40 text-[10px] text-slate-400 dark:text-slate-500 font-medium tracking-wide">
                <span>⚡ PHEVs.eu • Real-World Range Simulator</span>
                <span className="font-bold">phevs.eu</span>
              </div>
            </div>

            {/* Dedicated Image Share / Download & Copy Bar */}
            <div className="flex flex-col sm:flex-row items-center gap-2 pt-0.5">
              <button
                type="button"
                onClick={handleShareOrDownloadImage}
                disabled={isGeneratingImage}
                className={`w-full sm:flex-1 py-2.5 px-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer border shadow-xs ${
                  downloadedImage
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                    : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white border-transparent'
                } disabled:opacity-60`}
              >
                {isGeneratingImage ? (
                  <>
                    <ArrowPathIcon className="w-4 h-4 animate-spin" />
                    <span>{t.generatingImage}</span>
                  </>
                ) : downloadedImage ? (
                  <>
                    <CheckIcon className="w-4 h-4" />
                    <span>{t.downloadedImage}</span>
                  </>
                ) : (
                  <>
                    <PhotoIcon className="w-4 h-4 text-amber-300" />
                    <span>{t.shareImage}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleCopyImageToClipboard}
                disabled={isGeneratingImage}
                className={`w-full sm:w-auto py-2.5 px-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer border ${
                  copiedImage
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-blue-400 shadow-xs'
                } disabled:opacity-60`}
                title={t.copyImage}
              >
                {copiedImage ? (
                  <>
                    <CheckIcon className="w-4 h-4" />
                    <span>{t.copiedImage}</span>
                  </>
                ) : (
                  <>
                    <ClipboardDocumentIcon className="w-4 h-4" />
                    <span>{t.copyImage}</span>
                  </>
                )}
              </button>
            </div>

            {/* Formatted Text Box for Direct Copying / Pasting */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                {currentLocale === 'tr' ? 'Metin Özeti (Kopyalamaya Hazır)' : 'Summary Text (Ready to paste)'}
              </span>
              <pre className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] sm:text-xs font-mono text-slate-800 dark:text-slate-200 whitespace-pre-wrap select-all max-h-40 overflow-y-auto leading-relaxed">
                {generateShareText()}
              </pre>
            </div>

            {/* Quick Action Copy Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <button
                type="button"
                onClick={handleCopySummary}
                className={`w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer border ${
                  copiedSummary
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                    : 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600 shadow-sm'
                }`}
              >
                {copiedSummary ? (
                  <>
                    <CheckIcon className="w-4 h-4" />
                    <span>{t.copiedSummary}</span>
                  </>
                ) : (
                  <>
                    <ClipboardDocumentIcon className="w-4 h-4" />
                    <span>{t.copySummary}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleCopyLink}
                className={`w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer border ${
                  copiedLink
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-blue-400'
                }`}
              >
                {copiedLink ? (
                  <>
                    <CheckIcon className="w-4 h-4" />
                    <span>{t.copiedLink}</span>
                  </>
                ) : (
                  <>
                    <LinkIcon className="w-4 h-4" />
                    <span>{t.copyLink}</span>
                  </>
                )}
              </button>
            </div>

            {/* Social Share & App Buttons */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {/* WhatsApp */}
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(generateShareText())}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <span>💬</span>
                  <span>WhatsApp</span>
                </a>

                {/* X / Twitter */}
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`⚡ PHEVs.eu ${selectedVehicle.name} (${simulationResult.totalDistanceKm} km): %${simulationResult.evPercentage} Pure EV (${simulationResult.evDistanceKm} km) & %${simulationResult.hevPercentage} HEV (${simulationResult.hevDistanceKm} km)!\n`)}&url=${encodeURIComponent(getShareUrl())}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <span>𝕏</span>
                  <span>X / Twitter</span>
                </a>

                {/* Native Mobile Share */}
                {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
                  <button
                    type="button"
                    onClick={handleNativeShare}
                    className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                  >
                    <ShareIcon className="w-3.5 h-3.5" />
                    <span>{t.shareDevice}</span>
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => setIsShareModalOpen(false)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
              >
                {t.close}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}
