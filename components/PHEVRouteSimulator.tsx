'use client'

import React, { useState, useEffect, useMemo, useRef } from 'react'
import dynamic from 'next/dynamic'
import {
  MapPinIcon,
  MagnifyingGlassIcon,
  SparklesIcon,
  BoltIcon,
  FireIcon,
  SunIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  ArrowPathIcon,
  InformationCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CheckBadgeIcon,
  AdjustmentsHorizontalIcon,
  ExclamationTriangleIcon
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
    name: 'Warsaw → Łódź (130 km)',
    origin: { name: 'Warsaw', displayName: 'Warsaw, Poland', lat: 52.2297, lon: 21.0122 },
    dest: { name: 'Łódź', displayName: 'Łódź, Poland', lat: 51.7592, lon: 19.4560 }
  },
  {
    name: 'Paris → Reims (145 km)',
    origin: { name: 'Paris', displayName: 'Paris, France', lat: 48.8566, lon: 2.3522 },
    dest: { name: 'Reims', displayName: 'Reims, France', lat: 49.2583, lon: 4.0317 }
  },
  {
    name: 'Amsterdam → Utrecht (45 km)',
    origin: { name: 'Amsterdam', displayName: 'Amsterdam, Netherlands', lat: 52.3676, lon: 4.9041 },
    dest: { name: 'Utrecht', displayName: 'Utrecht, Netherlands', lat: 52.0907, lon: 5.1214 }
  }
]

export default function PHEVRouteSimulator({ initialCarId, locale = 'en' }: PHEVRouteSimulatorProps) {
  const models = useMemo(() => getAllPHEVModels(), [])

  // 1. Vehicle Selection State
  const [selectedModelId, setSelectedModelId] = useState<string>(() => {
    if (initialCarId && models.some(m => m.id === initialCarId || m.slug === initialCarId)) {
      return initialCarId
    }
    // Default to benchmark benchmark Toyota RAV4 Prime / 2026 or first car
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
    }, 400)
    return () => clearTimeout(timer)
  }, [originQuery])

  // Debounced search for Destination
  useEffect(() => {
    const timer = setTimeout(() => {
      if (destQuery && destQuery !== destPoint.name) {
        searchGeocoding(destQuery, setDestSuggestions, setIsSearchingDest)
      }
    }, 400)
    return () => clearTimeout(timer)
  }, [destQuery])

  // Run initial simulation on mount
  useEffect(() => {
    handleRunSimulation()
    fetchWeatherForOrigin(originPoint)
  }, [])

  // Execute Route & Physics Simulation
  const handleRunSimulation = async () => {
    if (!originPoint || !destPoint || !selectedVehicle) return

    setIsSimulating(true)
    setErrorMessage(null)

    try {
      // 1. Fetch Driving Route & Steps from OSRM
      const res = await fetch(
        `/api/simulator/route?lon1=${originPoint.lon}&lat1=${originPoint.lat}&lon2=${destPoint.lon}&lat2=${destPoint.lat}`
      )

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.error || `Routing engine error (Status ${res.status})`)
      }

      const data = await res.json()
      if (!data.route) {
        throw new Error('No driving route could be calculated between these coordinates.')
      }

      // 2. Feed Route into Simulation Engine
      const result = simulatePHEVRoute(
        data.route,
        selectedVehicle,
        startSoC,
        ambientTempC,
        originPoint,
        destPoint
      )

      setSimulationResult(result)
    } catch (err: any) {
      console.error('Simulation error:', err)
      setErrorMessage(err.message || 'An error occurred while calculating the route.')
    } finally {
      setIsSimulating(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Control Panel Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xl p-5 sm:p-8 space-y-8">
        
        {/* Preset Quick Route Chips */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <SparklesIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Quick European Corridor Presets</span>
            </span>
            <span className="text-xs text-slate-400">One-click benchmark routes</span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {PRESET_ROUTES.map((preset) => {
              const isSelected = originPoint.name === preset.origin.name && destPoint.name === preset.dest.name
              return (
                <button
                  key={preset.name}
                  onClick={() => {
                    setOriginPoint(preset.origin)
                    setDestPoint(preset.dest)
                    setOriginQuery(preset.origin.name)
                    setDestQuery(preset.dest.name)
                    fetchWeatherForOrigin(preset.origin)
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
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
          <div className="relative">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
              <MapPinIcon className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Origin (Start Point A)</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={originQuery}
                onChange={(e) => setOriginQuery(e.target.value)}
                placeholder="Enter city, address or zip code..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500 focus:outline-hidden text-sm"
              />
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
          <div className="relative">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
              <MapPinIcon className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Destination (Endpoint B)</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={destQuery}
                onChange={(e) => setDestQuery(e.target.value)}
                placeholder="Enter destination city or address..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500 focus:outline-hidden text-sm"
              />
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
              <span>Select PHEV Model</span>
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
              <span>{selectedVehicle.name} — Powertrain & Battery Specifications</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-xs">
              
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/80">
                <span className="text-[10px] text-slate-500 block uppercase font-medium">Usable Battery</span>
                <span className="font-bold text-slate-900 dark:text-white text-sm">
                  {selectedVehicle.usableBatteryKwh} <span className="text-xs font-normal text-slate-500">/ {selectedVehicle.grossBatteryKwh} kWh</span>
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/80">
                <span className="text-[10px] text-slate-500 block uppercase font-medium">Hybrid Buffer SoC</span>
                <span className="font-bold text-amber-600 dark:text-amber-400 text-sm">
                  {selectedVehicle.hybridThresholdSoC}% <span className="text-xs font-normal text-slate-500">reserve</span>
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/80">
                <span className="text-[10px] text-slate-500 block uppercase font-medium">Max Pure EV Speed</span>
                <span className="font-bold text-blue-600 dark:text-blue-400 text-sm">
                  {selectedVehicle.maxEvCruisingSpeed} <span className="text-xs font-normal text-slate-500">km/h</span>
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/80">
                <span className="text-[10px] text-slate-500 block uppercase font-medium">Heat Pump Status</span>
                <span className={`font-bold text-xs inline-flex items-center gap-1 ${selectedVehicle.hasHeatPump ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-400'}`}>
                  {selectedVehicle.hasHeatPump ? '✓ Equipped' : '✗ PTC / No Pump'}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/80">
                <span className="text-[10px] text-slate-500 block uppercase font-medium">Battery Chemistry</span>
                <span className="font-bold text-slate-900 dark:text-white text-sm">
                  {selectedVehicle.batteryChemistry} <span className="text-[10px] font-normal text-slate-500">Cells</span>
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/80">
                <span className="text-[10px] text-slate-500 block uppercase font-medium">Empty Battery Fuel</span>
                <span className="font-bold text-slate-900 dark:text-white text-sm">
                  {selectedVehicle.depletedFuelLPer100km} <span className="text-xs font-normal text-slate-500">L/100km</span>
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Sliders: Departure SoC & Ambient Temperature */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-slate-200/80 dark:border-slate-800">
          
          {/* Departure SoC Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <BoltIcon className="w-4 h-4 text-emerald-600" />
                <span>Departure Battery SoC</span>
              </label>
              <span className="font-mono font-bold text-base text-emerald-600 dark:text-emerald-400">
                {startSoC}%
              </span>
            </div>
            <input
              type="range"
              min={selectedVehicle ? selectedVehicle.hybridThresholdSoC : 20}
              max={100}
              step={10}
              value={startSoC}
              onChange={(e) => setStartSoC(Number(e.target.value))}
              className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <div className="flex justify-between text-[11px] text-slate-500 font-mono">
              <span>{selectedVehicle?.hybridThresholdSoC || 20}% (Buffer Limit)</span>
              <span>50%</span>
              <span>100% (Full Charge)</span>
            </div>
          </div>

          {/* Ambient Temperature Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <SunIcon className="w-4 h-4 text-amber-500" />
                <span>Ambient Air Temperature</span>
                {weatherFetchedCity && (
                  <span className="text-[10px] font-normal text-blue-600 dark:text-blue-400">
                    (Live for {weatherFetchedCity})
                  </span>
                )}
              </label>
              <div className="flex items-center gap-2">
                {isFetchingWeather && (
                  <span className="text-[11px] text-slate-400 animate-pulse">Syncing Meteo...</span>
                )}
                <span className={`font-mono font-bold text-base ${ambientTempC <= 0 ? 'text-cyan-600 dark:text-cyan-400' : 'text-amber-600 dark:text-amber-400'}`}>
                  {ambientTempC > 0 ? `+${ambientTempC}` : ambientTempC}°C
                </span>
              </div>
            </div>
            <input
              type="range"
              min={-15}
              max={35}
              step={1}
              value={ambientTempC}
              onChange={(e) => setAmbientTempC(Number(e.target.value))}
              className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-[11px] text-slate-500 font-mono">
              <span>-15°C (Sub-Zero Winter)</span>
              <span>0°C (Freezing)</span>
              <span>+18°C (Ideal)</span>
              <span>+35°C (Summer Heat)</span>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500 flex items-center gap-2">
            <ShieldCheckIcon className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Powered by OpenStreetMap Nominatim, OSRM Public Routing &amp; Open-Meteo.</span>
          </div>

          <button
            onClick={handleRunSimulation}
            disabled={isSimulating}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 text-white font-bold text-sm shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
          >
            {isSimulating ? (
              <>
                <ArrowPathIcon className="w-5 h-5 animate-spin" />
                <span>Simulating Physical Route...</span>
              </>
            ) : (
              <>
                <SparklesIcon className="w-5 h-5" />
                <span>Simulate Real-World Route 🚀</span>
              </>
            )}
          </button>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
            <ExclamationTriangleIcon className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      {/* Telemetry Summary Cards */}
      {simulationResult && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* 1. EV Electric Range */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50/40 dark:from-emerald-950/40 dark:to-teal-950/20 border border-emerald-200 dark:border-emerald-800/80 shadow-sm space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Pure EV Range</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-200 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 text-[11px] font-bold">
                  {simulationResult.evPercentage}% of trip
                </span>
              </div>
              <div className="text-3xl font-black text-emerald-700 dark:text-emerald-300">
                {simulationResult.evDistanceKm} <span className="text-base font-normal">km</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Electric battery power without burning a drop of petrol.
              </p>
            </div>

            {/* 2. HEV / Gas Range */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50/40 dark:from-amber-950/40 dark:to-orange-950/20 border border-amber-200 dark:border-amber-800/80 shadow-sm space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">HEV / Gas Range</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-200 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 text-[11px] font-bold">
                  {simulationResult.hevPercentage}% of trip
                </span>
              </div>
              <div className="text-3xl font-black text-amber-700 dark:text-amber-300">
                {simulationResult.hevDistanceKm} <span className="text-base font-normal">km</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Petrol combustion ICE engaged after battery reserve buffer.
              </p>
            </div>

            {/* 3. Total Energy Consumed */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50/40 dark:from-blue-950/40 dark:to-indigo-950/20 border border-blue-200 dark:border-blue-800/80 shadow-sm space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400 block">Total Consumed Energy</span>
              <div className="text-2xl font-black text-blue-700 dark:text-blue-300">
                {simulationResult.totalElecKwh} <span className="text-sm font-semibold">kWh</span> + {simulationResult.totalFuelLiters} <span className="text-sm font-semibold">L</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Avg: {simulationResult.avgElecEfficiencyKwh100} kWh/100km (EV) • {simulationResult.avgFuelEfficiencyL100} L/100km (trip blended)
              </p>
            </div>

            {/* 4. Cold Weather Penalty & Heat Pump Warning */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-slate-900 dark:to-slate-800 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 block">Temperature Penalty</span>
              <div className={`text-2xl font-black ${simulationResult.coldWeatherPenaltyPct > 0 ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-700 dark:text-slate-200'}`}>
                {simulationResult.coldWeatherPenaltyPct > 0 ? `-${simulationResult.coldWeatherPenaltyPct}%` : 'Optimal (0%)'}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {simulationResult.vehicle.hasHeatPump
                  ? `Heat pump mitigated ~${Math.round(simulationResult.coldWeatherPenaltyPct * 0.4)}% extra range loss.`
                  : 'Vehicle lacks heat pump; electric resistance heater imposes full penalty.'}
              </p>
            </div>
          </div>

          {/* Transition Highlight Alert */}
          {simulationResult.transitionPoint && (
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border-l-4 border-amber-500 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <span className="text-2xl">⚡→⛽</span>
                <div>
                  <h4 className="font-bold text-amber-900 dark:text-amber-200 text-sm">
                    {simulationResult.transitionPoint.label}
                  </h4>
                  <p className="text-amber-700 dark:text-amber-300">
                    At kilometer {simulationResult.transitionPoint.km}, the usable battery hit the {simulationResult.vehicle.hybridThresholdSoC}% reserve threshold. The petrol combustion engine seamlessly took over.
                  </p>
                </div>
              </div>
              <div className="shrink-0 font-mono font-bold text-amber-800 dark:text-amber-300">
                Total Distance: {simulationResult.totalDistanceKm} km
              </div>
            </div>
          )}

          {/* Interactive Leaflet Route Map */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Interactive Route &amp; Hybrid Transition Map</span>
              </h3>
              <span className="text-xs text-slate-500">
                {simulationResult.origin.name} → {simulationResult.destination.name}
              </span>
            </div>

            <PHEVRouteMap simulation={simulationResult} height="540px" />
          </div>

          {/* Segment-by-segment Detailed Accordion */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <button
              onClick={() => setShowSegmentBreakdown(!showSegmentBreakdown)}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex items-center space-x-2">
                <AdjustmentsHorizontalIcon className="w-4 h-4 text-blue-600" />
                <span className="font-bold text-sm text-slate-900 dark:text-white">
                  Step-by-Step Road Segments Telemetry ({simulationResult.steps.length} segments analyzed)
                </span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-slate-500">
                <span>{showSegmentBreakdown ? 'Hide details' : 'View road breakdown'}</span>
                {showSegmentBreakdown ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />}
              </div>
            </button>

            {showSegmentBreakdown && (
              <div className="border-t border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800/60 max-h-96 overflow-y-auto">
                {simulationResult.steps.map((st) => (
                  <div key={st.stepIndex} className="px-6 py-3 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50/70 dark:hover:bg-slate-800/30">
                    <div className="space-y-0.5">
                      <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                        <span>#{st.stepIndex}</span>
                        <span>{st.roadName}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          st.mode === 'EV'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : st.mode === 'BLENDED'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300'
                        }`}>
                          {st.mode}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {st.distanceKm} km • {st.avgSpeedKmH} km/h avg • Road: {st.roadType}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-[11px] font-mono text-slate-600 dark:text-slate-400">
                      <div>
                        <span className="text-slate-400">Energy:</span> {st.elecConsumedKwh} kWh
                      </div>
                      {st.fuelConsumedLiters > 0 && (
                        <div>
                          <span className="text-slate-400">Fuel:</span> {st.fuelConsumedLiters} L
                        </div>
                      )}
                      <div>
                        <span className="text-slate-400">SoC:</span> {st.startSoC}% → {st.endSoC}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
