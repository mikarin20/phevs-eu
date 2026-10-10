'use client'

import React, { useEffect, useRef } from 'react'
import 'leaflet/dist/leaflet.css'
import type { RouteSimulationResult } from '@/lib/phev-simulator-types'

interface PHEVRouteMapProps {
  simulation: RouteSimulationResult | null
  height?: string
  locale?: string
}

const MAP_I18N: Record<string, {
  legendTitle: string
  pureEv: string
  hevMode: string
  engineStartLabel: string
  originLabel: string
  destLabel: string
  departureSoC: string
  totalTrip: string
  pureEvTitle: string
  distance: string
  ofTrip: string
  hevTitle: string
  estimatedFuel: string
  engineStartPopupTitle: string
  bufferReached: string
  iceEngagedText: string
}> = {
  en: {
    legendTitle: 'Route Legend',
    pureEv: 'Pure EV (Battery Only)',
    hevMode: 'HEV (Petrol Combustion)',
    engineStartLabel: 'Engine Start',
    originLabel: 'Origin',
    destLabel: 'Destination',
    departureSoC: 'Departure SoC',
    totalTrip: 'Total Trip',
    pureEvTitle: 'Pure Electric Range (EV)',
    distance: 'Distance',
    ofTrip: 'of trip',
    hevTitle: 'Hybrid / Combustion Mode (HEV)',
    estimatedFuel: 'Estimated Fuel',
    engineStartPopupTitle: 'Engine Start Point',
    bufferReached: 'buffer reached',
    iceEngagedText: 'ICE combustion engine engaged for remaining'
  },
  tr: {
    legendTitle: 'Rota Göstergesi',
    pureEv: 'Saf Elektrikli Sürüş (EV)',
    hevMode: 'Hibrit / Benzinli Sürüş (HEV)',
    engineStartLabel: 'Motor Başlangıcı',
    originLabel: 'Kalkış',
    destLabel: 'Varış',
    departureSoC: 'Kalkış SoC',
    totalTrip: 'Toplam Rota',
    pureEvTitle: 'Saf Elektrikli Sürüş (EV)',
    distance: 'Mesafe',
    ofTrip: 'rota payı',
    hevTitle: 'Hibrit / Benzin Motoru (HEV)',
    estimatedFuel: 'Tahmini Yakıt',
    engineStartPopupTitle: 'Benzin Motoru Devreye Girme Noktası',
    bufferReached: 'tamponuna ulaşıldı',
    iceEngagedText: 'Kalan mesafe için benzinli motor devreye girdi:'
  },
  pl: {
    legendTitle: 'Legenda trasy',
    pureEv: 'Czysty napęd elektryczny (EV)',
    hevMode: 'Tryb spalinowy (HEV)',
    engineStartLabel: 'Start silnika ICE',
    originLabel: 'Start',
    destLabel: 'Cel',
    departureSoC: 'Początkowy SoC',
    totalTrip: 'Długość trasy',
    pureEvTitle: 'Zasięg elektryczny (EV)',
    distance: 'Dystans',
    ofTrip: 'trasy',
    hevTitle: 'Tryb hybrydowy / spalinowy (HEV)',
    estimatedFuel: 'Szacowane paliwo',
    engineStartPopupTitle: 'Punkt uruchomienia silnika spalinowego',
    bufferReached: 'osiągnięto bufor',
    iceEngagedText: 'Silnik spalinowy uruchomiony na pozostałe'
  },
  de: {
    legendTitle: 'Routenlegende',
    pureEv: 'Rein elektrisch (EV)',
    hevMode: 'Hybrid / Verbrenner (HEV)',
    engineStartLabel: 'Motorstart',
    originLabel: 'Start',
    destLabel: 'Ziel',
    departureSoC: 'Start-SoC',
    totalTrip: 'Gesamtstrecke',
    pureEvTitle: 'Reine elektrische Reichweite (EV)',
    distance: 'Strecke',
    ofTrip: 'der Reise',
    hevTitle: 'Hybrid- / Verbrennermodus (HEV)',
    estimatedFuel: 'Geschätztes Benzin',
    engineStartPopupTitle: 'Startpunkt Verbrennungsmotor',
    bufferReached: 'Puffer erreicht',
    iceEngagedText: 'Verbrennungsmotor zugeschaltet für verbleibende'
  },
  fr: {
    legendTitle: 'Légende du trajet',
    pureEv: '100% Électrique (EV)',
    hevMode: 'Hybride / Thermique (HEV)',
    engineStartLabel: 'Démarrage moteur',
    originLabel: 'Départ',
    destLabel: 'Arrivée',
    departureSoC: 'SoC départ',
    totalTrip: 'Distance totale',
    pureEvTitle: 'Autonomie 100% électrique (EV)',
    distance: 'Distance',
    ofTrip: 'du trajet',
    hevTitle: 'Mode hybride / essence (HEV)',
    estimatedFuel: 'Carburant estimé',
    engineStartPopupTitle: 'Point de démarrage du moteur thermique',
    bufferReached: 'tampon atteint',
    iceEngagedText: 'Moteur thermique enclenché pour les'
  },
  es: {
    legendTitle: 'Leyenda de ruta',
    pureEv: '100% Eléctrico (EV)',
    hevMode: 'Híbrido / Combustión (HEV)',
    engineStartLabel: 'Encendido motor',
    originLabel: 'Origen',
    destLabel: 'Destino',
    departureSoC: 'SoC inicial',
    totalTrip: 'Viaje total',
    pureEvTitle: 'Autonomía 100% eléctrica (EV)',
    distance: 'Distancia',
    ofTrip: 'del viaje',
    hevTitle: 'Modo híbrido / gasolina (HEV)',
    estimatedFuel: 'Combustible estimado',
    engineStartPopupTitle: 'Punto de encendido del motor térmico',
    bufferReached: 'búfer alcanzado',
    iceEngagedText: 'Motor térmico activado para los restantes'
  }
}

export default function PHEVRouteMap({ simulation, height = '520px', locale = 'en' }: PHEVRouteMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const layersGroupRef = useRef<any>(null)

  const t = MAP_I18N[locale] || MAP_I18N.en

  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainerRef.current) return

    // Lazy load Leaflet on client side
    import('leaflet').then((L) => {
      if (!mapContainerRef.current) return

      if (!mapInstanceRef.current) {
        // Initialize Leaflet map
        const initialCenter: [number, number] = simulation?.origin
          ? [simulation.origin.lat, simulation.origin.lon]
          : [52.52, 13.405] // Default Berlin

        const map = L.map(mapContainerRef.current, {
          center: initialCenter,
          zoom: 12,
          scrollWheelZoom: true
        })

        // OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19
        }).addTo(map)

        const layerGroup = L.layerGroup().addTo(map)
        layersGroupRef.current = layerGroup
        mapInstanceRef.current = map
      }

      const map = mapInstanceRef.current
      const layerGroup = layersGroupRef.current

      if (!layerGroup || !map) return

      // Clear previous layers
      layerGroup.clearLayers()

      if (!simulation) return

      const bounds = L.latLngBounds([])

      // 1. Origin Marker (Start)
      const startIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div style="background-color: #10b981; color: white; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 14px; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4); border: 2.5px solid white;">
            A
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 17]
      })

      const originMarker = L.marker([simulation.origin.lat, simulation.origin.lon], { icon: startIcon })
        .bindPopup(`<strong>${t.originLabel}:</strong> ${simulation.origin.name}<br/>${t.departureSoC}: ${simulation.startSoC}%`)
        .addTo(layerGroup)
      bounds.extend([simulation.origin.lat, simulation.origin.lon])

      // 2. Destination Marker (Finish)
      const destIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div style="background-color: #2563eb; color: white; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 14px; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4); border: 2.5px solid white;">
            B
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 17]
      })

      const destMarker = L.marker([simulation.destination.lat, simulation.destination.lon], { icon: destIcon })
        .bindPopup(`<strong>${t.destLabel}:</strong> ${simulation.destination.name}<br/>${t.totalTrip}: ${simulation.totalDistanceKm} km`)
        .addTo(layerGroup)
      bounds.extend([simulation.destination.lat, simulation.destination.lon])

      // 3. Green Polyline (EV portion)
      if (simulation.evPolyline && simulation.evPolyline.length > 1) {
        const evLine = L.polyline(simulation.evPolyline, {
          color: '#10b981', // Emerald green
          weight: 6,
          opacity: 0.9,
          lineCap: 'round',
          lineJoin: 'round'
        }).addTo(layerGroup)

        evLine.bindPopup(`<strong>${t.pureEvTitle}</strong><br/>${t.distance}: ${simulation.evDistanceKm} km (${simulation.evPercentage}% ${t.ofTrip})`)
        simulation.evPolyline.forEach((coord) => bounds.extend(coord))
      }

      // 4. Orange/Red Polyline (HEV portion)
      if (simulation.hevPolyline && simulation.hevPolyline.length > 1) {
        const hevLine = L.polyline(simulation.hevPolyline, {
          color: '#f97316', // Vibrant Orange / Amber
          weight: 6,
          opacity: 0.9,
          lineCap: 'round',
          lineJoin: 'round',
          dashArray: '8, 4'
        }).addTo(layerGroup)

        hevLine.bindPopup(`<strong>${t.hevTitle}</strong><br/>${t.distance}: ${simulation.hevDistanceKm} km (${simulation.hevPercentage}% ${t.ofTrip})<br/>${t.estimatedFuel}: ${simulation.totalFuelLiters} L`)
        simulation.hevPolyline.forEach((coord) => bounds.extend(coord))
      }

      // 5. Engine Start Point Transition Marker
      if (simulation.transitionPoint) {
        const tp = simulation.transitionPoint
        const transitionIcon = L.divIcon({
          className: 'custom-leaflet-marker',
          html: `
            <div style="background-color: #f59e0b; color: white; padding: 4px 8px; border-radius: 9999px; display: inline-flex; align-items: center; gap: 4px; font-weight: 700; font-size: 11px; box-shadow: 0 4px 14px rgba(245, 158, 11, 0.5); border: 2px solid white; white-space: nowrap; transform: translate(-50%, -50%);">
              <span>⚡→⛽</span>
              <span>Km ${tp.km}</span>
            </div>
          `,
          iconSize: [80, 24],
          iconAnchor: [40, 12]
        })

        const transitionMarker = L.marker([tp.lat, tp.lon], { icon: transitionIcon })
          .bindPopup(`
            <div style="font-family: inherit;">
              <strong style="color: #d97706; font-size: 13px;">⚡→⛽ ${t.engineStartPopupTitle}</strong>
              <div style="margin-top: 4px; font-size: 12px; line-height: 1.4;">
                <strong>${t.distance}:</strong> ${tp.km} km<br/>
                <strong>SoC:</strong> %${tp.socBufferReached} ${t.bufferReached}<br/>
                <em>${t.iceEngagedText} ${simulation.hevDistanceKm} km.</em>
              </div>
            </div>
          `)
          .addTo(layerGroup)

        // Open popup by default to highlight the key moment
        transitionMarker.openPopup()
        bounds.extend([tp.lat, tp.lon])
      }

      // Fit map view to route bounds with padding
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [50, 50] })
      }
    })
  }, [simulation, locale])

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md">
      {/* Map Legend Overlay */}
      <div className="absolute top-4 right-4 z-[1000] bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80 shadow-md text-xs space-y-2 pointer-events-auto">
        <div className="font-bold text-slate-800 dark:text-slate-100 flex items-center justify-between gap-4">
          <span>{t.legendTitle}</span>
          {simulation && (
            <span className="font-mono text-[10px] text-slate-500">{simulation.totalDistanceKm} km</span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-4 h-1.5 rounded-full bg-emerald-500 inline-block shrink-0"></span>
          <span className="text-slate-600 dark:text-slate-300 font-medium">{t.pureEv}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-4 h-1.5 rounded-full bg-amber-500 inline-block shrink-0 border-b border-dashed border-white"></span>
          <span className="text-slate-600 dark:text-slate-300 font-medium">{t.hevMode}</span>
        </div>
        {simulation?.transitionPoint && (
          <div className="flex items-center space-x-2 pt-1 border-t border-slate-200/60 dark:border-slate-800/60 text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
            <span>⚡→⛽</span>
            <span>{t.engineStartLabel}: Km {simulation.transitionPoint.km}</span>
          </div>
        )}
      </div>

      <div ref={mapContainerRef} style={{ height, width: '100%' }} className="bg-slate-100 dark:bg-slate-950 z-0" />
    </div>
  )
}
