'use client'

import React, { useEffect, useRef } from 'react'
import 'leaflet/dist/leaflet.css'
import type { RouteSimulationResult } from '@/lib/phev-simulator-types'

interface PHEVRouteMapProps {
  simulation: RouteSimulationResult | null
  height?: string
}

export default function PHEVRouteMap({ simulation, height = '520px' }: PHEVRouteMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const layersGroupRef = useRef<any>(null)

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
        .bindPopup(`<strong>Origin:</strong> ${simulation.origin.name}<br/>Departure SoC: ${simulation.startSoC}%`)
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
        .bindPopup(`<strong>Destination:</strong> ${simulation.destination.name}<br/>Total Trip: ${simulation.totalDistanceKm} km`)
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

        evLine.bindPopup(`<strong>Pure Electric Range (EV)</strong><br/>Distance: ${simulation.evDistanceKm} km (${simulation.evPercentage}% of trip)`)
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

        hevLine.bindPopup(`<strong>Hybrid / Combustion Mode (HEV)</strong><br/>Distance: ${simulation.hevDistanceKm} km (${simulation.hevPercentage}% of trip)<br/>Estimated Fuel: ${simulation.totalFuelLiters} L`)
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
              <strong style="color: #d97706; font-size: 13px;">⚡→⛽ Engine Start Point</strong>
              <div style="margin-top: 4px; font-size: 12px; line-height: 1.4;">
                <strong>Distance Reached:</strong> ${tp.km} km<br/>
                <strong>Battery Status:</strong> ${tp.socBufferReached}% buffer reached<br/>
                <em>ICE combustion engine engaged for remaining ${simulation.hevDistanceKm} km.</em>
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

    return () => {
      // Keep map instance mounted across prop updates
    }
  }, [simulation])

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md">
      {/* Map Legend Overlay */}
      <div className="absolute top-4 right-4 z-[1000] bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80 shadow-md text-xs space-y-2 pointer-events-auto">
        <div className="font-bold text-slate-800 dark:text-slate-100 flex items-center justify-between gap-4">
          <span>Route Legend</span>
          {simulation && (
            <span className="font-mono text-[10px] text-slate-500">{simulation.totalDistanceKm} km</span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-4 h-1.5 rounded-full bg-emerald-500 inline-block shrink-0"></span>
          <span className="text-slate-600 dark:text-slate-300 font-medium">Pure EV (Battery Only)</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-4 h-1.5 rounded-full bg-amber-500 inline-block shrink-0 border-b border-dashed border-white"></span>
          <span className="text-slate-600 dark:text-slate-300 font-medium">HEV (Petrol Combustion)</span>
        </div>
        {simulation?.transitionPoint && (
          <div className="flex items-center space-x-2 pt-1 border-t border-slate-200/60 dark:border-slate-800/60 text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
            <span>⚡→⛽</span>
            <span>Engine Start: Km {simulation.transitionPoint.km}</span>
          </div>
        )}
      </div>

      <div ref={mapContainerRef} style={{ height, width: '100%' }} className="bg-slate-100 dark:bg-slate-950 z-0" />
    </div>
  )
}
