'use client'

import { useState, useEffect } from 'react'
import { 
  SunIcon, 
  InformationCircleIcon,
  XMarkIcon,
  SparklesIcon,
  BoltIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline'

interface RangeSimulatorProps {
  baseRange: number
  batteryCapacity: number
  isOpen: boolean
  onClose: () => void
  simulatorData?: {
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

export default function RangeSimulator({ 
  baseRange, 
  batteryCapacity, 
  isOpen, 
  onClose,
  simulatorData
}: RangeSimulatorProps) {
  const [temperature, setTemperature] = useState(20) // °C
  const [acEnabled, setAcEnabled] = useState(true)
  const [highwayShare, setHighwayShare] = useState(35) // %
  const [calculatedRange, setCalculatedRange] = useState(baseRange)

  // Range calculation
  useEffect(() => {
    let range = baseRange

    // Use simulator data if available, otherwise use default factors
    const tempEfficiency = simulatorData?.temperature_efficiency || {
      optimal_temp: 20,
      cold_weather_factor: 0.7,
      hot_weather_factor: 0.8,
      mild_cold_factor: 0.85,
      mild_hot_factor: 0.9
    }

    const acImpact = simulatorData?.ac_impact || 0.85
    const highwayEfficiency = simulatorData?.highway_efficiency || {
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

    // AC effect
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

    setCalculatedRange(Math.round(range))
  }, [baseRange, temperature, acEnabled, highwayShare, simulatorData])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
        
        {/* Modal */}
        <div className="relative w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <SparklesIcon className="h-8 w-8" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold">Range Simulator</h2>
                  <p className="text-slate-300 text-sm">Discover your electric range based on real-world conditions</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-3 hover:bg-white/10 rounded-xl transition-colors"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 bg-gradient-to-br from-slate-50 to-white">
            {/* Status Indicators */}
            <div className="flex justify-center space-x-4 mb-8">
              <div className="flex items-center space-x-2 bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-sm font-medium">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span>Real-time Calculation</span>
              </div>
              
              {simulatorData && (
                <div className="flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                  <InformationCircleIcon className="h-4 w-4" />
                  <span>Official Parameters</span>
                </div>
              )}
            </div>

            {/* Main Range Display */}
            <div className="text-center mb-12">
              <div className="relative inline-block">
                {/* Decorative background */}
                <div className="absolute -inset-8 bg-gradient-to-r from-blue-100 via-emerald-100 to-blue-100 rounded-full opacity-20 blur-xl"></div>
                
                {/* Range card */}
                <div className="relative bg-white rounded-3xl p-12 shadow-xl border border-slate-200 min-w-[320px]">
                  <div className="text-8xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-4">
                    {Math.round(calculatedRange)}
                  </div>
                  <div className="text-2xl text-slate-600 font-medium mb-6">kilometers</div>
                  
                  {/* Range comparison */}
                  <div className="flex items-center justify-center space-x-8 text-sm">
                    <div className="text-center">
                      <div className="font-semibold text-slate-700 mb-1">WLTP Base</div>
                      <div className="text-slate-500">{baseRange} km</div>
                    </div>
                    <div className="w-px h-12 bg-slate-300"></div>
                    <div className="text-center">
                      <div className="font-semibold text-slate-700 mb-1">Simulated</div>
                      <div className="text-emerald-600 font-bold text-lg">{Math.round(calculatedRange)} km</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Controls Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Temperature Control */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
                <div className="flex items-center space-x-2 mb-6">
                  <SunIcon className="h-6 w-6 text-orange-500" />
                  <h3 className="text-lg font-semibold text-slate-800">External Temperature</h3>
                  <InformationCircleIcon className="h-4 w-4 text-slate-400" />
                </div>
                
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-slate-800 mb-2">{temperature}°C</div>
                    <div className="text-sm text-slate-500">Current setting</div>
                  </div>
                  
                  <div className="relative">
                    <input
                      type="range"
                      min="-10"
                      max="40"
                      value={temperature}
                      onChange={(e) => setTemperature(Number(e.target.value))}
                      className="w-full h-2 bg-gradient-to-r from-blue-200 via-yellow-200 to-red-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-xs text-slate-500 mt-2">
                      <span>-10°C</span>
                      <span className="text-orange-500 font-medium">Optimal: {simulatorData?.temperature_efficiency.optimal_temp || 20}°C</span>
                      <span>40°C</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* AC Control */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
                <div className="flex items-center space-x-2 mb-6">
                  <Cog6ToothIcon className="h-6 w-6 text-blue-500" />
                  <h3 className="text-lg font-semibold text-slate-800">Climate Control</h3>
                  <InformationCircleIcon className="h-4 w-4 text-slate-400" />
                </div>
                
                <div className="space-y-4">
                  <div className="text-center">
                    <div className={`text-2xl font-bold mb-2 ${acEnabled ? 'text-blue-600' : 'text-slate-400'}`}>
                      {acEnabled ? 'AC Enabled' : 'AC Disabled'}
                    </div>
                    <div className="text-sm text-slate-500">
                      Impact: {simulatorData ? `${Math.round((1 - simulatorData.ac_impact) * 100)}%` : '15%'} range reduction
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setAcEnabled(!acEnabled)}
                    className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                      acEnabled 
                        ? 'bg-blue-100 text-blue-800 border-2 border-blue-200' 
                        : 'bg-slate-100 text-slate-600 border-2 border-slate-200'
                    }`}
                  >
                    {acEnabled ? 'Turn Off AC' : 'Turn On AC'}
                  </button>
                </div>
              </div>

              {/* Highway Share Control */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
                <div className="flex items-center space-x-2 mb-6">
                  <BoltIcon className="h-6 w-6 text-emerald-500" />
                  <h3 className="text-lg font-semibold text-slate-800">Highway Share</h3>
                  <InformationCircleIcon className="h-4 w-4 text-slate-400" />
                </div>
                
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-slate-800 mb-2">{highwayShare}%</div>
                    <div className="text-sm text-slate-500">Highway driving</div>
                  </div>
                  
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={highwayShare}
                      onChange={(e) => setHighwayShare(Number(e.target.value))}
                      className="w-full h-2 bg-gradient-to-r from-emerald-200 to-blue-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>City</span>
                      <span>Mixed</span>
                      <span>Highway</span>
                    </div>
                  </div>
                  
                  {simulatorData && (
                    <div className="text-xs text-slate-500 space-y-1">
                      <div>City: {Math.round(simulatorData.highway_efficiency.city_factor * 100)}% efficiency</div>
                      <div>Highway: {Math.round(simulatorData.highway_efficiency.highway_factor * 100)}% efficiency</div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Information Section */}
            <div className="mt-12 bg-slate-100 rounded-2xl p-6">
              <div className="flex items-start space-x-4">
                <InformationCircleIcon className="h-6 w-6 text-slate-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-slate-800 mb-2">How Range is Calculated</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Your electric range depends on several factors including external temperature, climate control usage, 
                    and driving conditions. This simulator uses real-world efficiency data to provide accurate estimates. 
                    Individual driving style and traffic conditions may vary actual results.
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