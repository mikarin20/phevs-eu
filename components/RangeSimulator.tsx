'use client'

import { useState, useEffect } from 'react'
import { 
  SunIcon, 
  InformationCircleIcon,
  ArrowLeftIcon,
  XMarkIcon,
  SparklesIcon
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

  // Calculate range based on conditions
  useEffect(() => {
    let range = simulatorData?.base_range_km || baseRange

    // Use model-specific data if available, otherwise use defaults
    const tempEfficiency = simulatorData?.temperature_efficiency || {
      optimal_temp: 20,
      cold_weather_factor: 0.6,
      hot_weather_factor: 0.8,
      mild_cold_factor: 0.75,
      mild_hot_factor: 0.9
    }

    const acImpact = simulatorData?.ac_impact || 0.85
    const highwayEfficiency = simulatorData?.highway_efficiency || {
      city_factor: 1.0,
      mixed_factor: 0.9,
      highway_factor: 0.8
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-white via-blue-50/30 to-slate-50 rounded-3xl max-w-5xl w-full max-h-[95vh] overflow-hidden shadow-2xl border border-white/20">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-[#0B2E33] via-[#4F7C82] to-[#93B1B5] p-6 text-white">
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B2E33]/90 to-[#4F7C82]/90"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-full transition-all duration-200 backdrop-blur-sm"
              >
                <ArrowLeftIcon className="w-6 h-6" />
              </button>
              <div>
                <h2 className="text-2xl font-bold">Range Simulator</h2>
                <p className="text-blue-100 text-sm">Discover your electric range</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-all duration-200 backdrop-blur-sm"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-8">
          <div className="text-center mb-10">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#4F7C82] to-[#93B1B5] text-white px-6 py-3 rounded-full mb-4">
              <SparklesIcon className="w-5 h-5" />
              <span className="font-semibold">Real-time Range Calculation</span>
            </div>
            <h3 className="text-3xl font-bold text-[#0B2E33] mb-3">
              Discover Your Electric Range
            </h3>
            <p className="text-[#4F7C82] text-lg max-w-2xl mx-auto">
              Simulate realistic electric range based on driving conditions and environmental factors
            </p>
            {simulatorData && (
              <div className="mt-6 inline-flex items-center space-x-2 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 text-green-800 px-4 py-2 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Using official efficiency parameters for this vehicle</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Temperature Control */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-[#4F7C82] to-[#93B1B5] rounded-lg">
                  <SunIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-[#0B2E33] text-lg">Outside Temperature</h4>
                  <p className="text-[#4F7C82] text-sm">Environmental impact on range</p>
                </div>
                <InformationCircleIcon className="w-5 h-5 text-[#93B1B5]" />
              </div>
              
              <div className="relative bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-6 border border-white/50 shadow-lg">
                <div className="h-72 bg-gradient-to-t from-blue-600 via-emerald-500 to-red-500 rounded-xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-600/90 via-emerald-500/90 to-red-500/90"></div>
                  
                  {/* Temperature markers */}
                  <div className="absolute inset-0 flex flex-col justify-between p-6">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
                        <SunIcon className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-white font-bold text-lg">30°C</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
                        <SunIcon className="w-6 h-6 text-white rotate-180" />
                      </div>
                      <span className="text-white font-bold text-lg">-10°C</span>
                    </div>
                  </div>
                  
                  {/* Optimal temperature indicator */}
                  {simulatorData && (
                    <div 
                      className="absolute w-2 h-12 bg-yellow-400 rounded-full transform -translate-x-1/2 shadow-lg"
                      style={{ 
                        left: '50%', 
                        top: `${((30 - simulatorData.temperature_efficiency.optimal_temp) / 40) * 100}%` 
                      }}
                    />
                  )}
                  
                  <input
                    type="range"
                    min="-10"
                    max="30"
                    value={temperature}
                    onChange={(e) => setTemperature(Number(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  
                  <div 
                    className="absolute w-8 h-8 bg-white rounded-full shadow-xl border-4 border-[#4F7C82] transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
                    style={{ 
                      left: '50%', 
                      top: `${((30 - temperature) / 40) * 100}%` 
                    }}
                  >
                    <div className="w-3 h-3 bg-[#4F7C82] rounded-full"></div>
                  </div>
                </div>
                
                <div className="text-center mt-4">
                  <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#0B2E33] to-[#4F7C82] text-white px-6 py-3 rounded-full">
                    <span className="text-3xl font-bold">{temperature}°C</span>
                    <div className="w-px h-6 bg-white/30"></div>
                    <span className="text-sm font-medium">
                      {temperature < 0 ? 'Very Cold' : 
                       temperature < 10 ? 'Cold' : 
                       temperature < 20 ? 'Cool' : 
                       temperature < 25 ? 'Mild' : 
                       temperature < 30 ? 'Warm' : 'Hot'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Range Display */}
            <div className="flex flex-col items-center justify-center space-y-6">
              <div className="relative">
                <div className="w-64 h-64 bg-gradient-to-br from-[#0B2E33] via-[#4F7C82] to-[#93B1B5] rounded-full flex items-center justify-center relative overflow-hidden shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#0B2E33]/90 via-[#4F7C82]/90 to-[#93B1B5]/90"></div>
                  
                  {/* Animated background circles */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-200/30 via-green-200/30 to-red-200/30 animate-pulse rounded-full"></div>
                  <div className="absolute inset-4 bg-gradient-to-br from-white/20 to-transparent rounded-full animate-pulse"></div>
                  
                  {/* Range display */}
                  <div className="text-center z-10 relative">
                    <div className="text-7xl font-bold text-white drop-shadow-lg">{calculatedRange}</div>
                    <div className="text-2xl text-white/90 font-medium">km</div>
                    <div className="mt-2 text-sm text-white/80 font-medium">Electric Range</div>
                  </div>
                  
                  {/* Decorative elements */}
                  <div className="absolute top-4 right-4 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
                  <div className="absolute bottom-4 left-4 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <div className="absolute top-1/2 left-4 w-1 h-1 bg-blue-400 rounded-full animate-pulse"></div>
                </div>
                
                {/* Range indicator ring */}
                <div className="absolute inset-0 border-4 border-white/20 rounded-full"></div>
                <div className="absolute inset-2 border-2 border-white/10 rounded-full"></div>
              </div>
              
              <div className="text-center space-y-3">
                <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#0B2E33] to-[#4F7C82] text-white px-4 py-2 rounded-full">
                  <SparklesIcon className="w-4 h-4" />
                  <span className="font-semibold">Estimated Range</span>
                </div>
                <p className="text-[#4F7C82] text-sm">
                  Based on {batteryCapacity}kWh battery capacity
                </p>
                {simulatorData && (
                  <div className="space-y-1 text-xs text-[#93B1B5]">
                    <p>WLTP Base: <span className="font-semibold">{simulatorData.base_range_km} km</span></p>
                    <p>Optimal temp: <span className="font-semibold">{simulatorData.temperature_efficiency.optimal_temp}°C</span></p>
                  </div>
                )}
              </div>
            </div>

            {/* AC Control */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-[#4F7C82] to-[#93B1B5] rounded-lg">
                  <SunIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-[#0B2E33] text-lg">Climate Control</h4>
                  <p className="text-[#4F7C82] text-sm">AC impact on range</p>
                </div>
                <InformationCircleIcon className="w-5 h-5 text-[#93B1B5]" />
              </div>
              
              <div className="space-y-6">
                <button
                  onClick={() => setAcEnabled(!acEnabled)}
                  className={`w-full p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                    acEnabled 
                      ? 'border-[#4F7C82] bg-gradient-to-r from-[#4F7C82]/10 to-[#93B1B5]/10 text-[#0B2E33] shadow-lg' 
                      : 'border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-4">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                      acEnabled 
                        ? 'bg-gradient-to-r from-[#4F7C82] to-[#93B1B5] text-white shadow-lg' 
                        : 'bg-gray-300 text-gray-600'
                    }`}>
                      <SunIcon className="w-8 h-8" />
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-lg">
                        {acEnabled ? 'AC Enabled' : 'AC Disabled'}
                      </div>
                      <div className="text-sm opacity-80">
                        {acEnabled ? 'Climate control active' : 'Climate control off'}
                      </div>
                      {simulatorData && (
                        <div className="text-xs mt-1 font-medium">
                          Impact: {Math.round((1 - simulatorData.ac_impact) * 100)}% range reduction
                        </div>
                      )}
                    </div>
                  </div>
                </button>

                {/* Highway Share */}
                <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-6 border border-white/50 shadow-lg">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-lg font-bold text-[#0B2E33]">
                        Highway Driving
                      </label>
                      <span className="text-2xl font-bold text-[#4F7C82]">{highwayShare}%</span>
                    </div>
                    
                    <div className="relative">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={highwayShare}
                        onChange={(e) => setHighwayShare(Number(e.target.value))}
                        className="w-full h-3 bg-gradient-to-r from-[#4F7C82] to-[#93B1B5] rounded-lg appearance-none cursor-pointer slider"
                        style={{
                          background: `linear-gradient(to right, #4F7C82 0%, #93B1B5 100%)`
                        }}
                      />
                      <div className="flex justify-between text-sm text-[#4F7C82] mt-2">
                        <span className="font-medium">City Driving</span>
                        <span className="font-medium">Highway Driving</span>
                      </div>
                    </div>
                    
                    {simulatorData && (
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div className="bg-white/50 rounded-lg p-3 text-center">
                          <div className="font-bold text-[#0B2E33]">City Efficiency</div>
                          <div className="text-[#4F7C82] font-semibold">
                            {Math.round(simulatorData.highway_efficiency.city_factor * 100)}%
                          </div>
                        </div>
                        <div className="bg-white/50 rounded-lg p-3 text-center">
                          <div className="font-bold text-[#0B2E33]">Highway Efficiency</div>
                          <div className="text-[#4F7C82] font-semibold">
                            {Math.round(simulatorData.highway_efficiency.highway_factor * 100)}%
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Information */}
          <div className="mt-10 bg-gradient-to-r from-[#0B2E33]/10 via-[#4F7C82]/10 to-[#93B1B5]/10 rounded-2xl p-8 border border-white/30 shadow-lg">
            <div className="flex items-start space-x-6">
              <div className="p-3 bg-gradient-to-r from-[#4F7C82] to-[#93B1B5] rounded-xl shadow-md">
                <InformationCircleIcon className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-[#0B2E33] text-xl mb-3">Range Simulation Information</h4>
                <p className="text-[#0B2E33] text-base leading-relaxed mb-4 font-medium">
                  The achievable range depends particularly on your individual driving style. 
                  This simulation uses average consumption patterns and official efficiency data.
                </p>
                <div className="bg-white/50 rounded-lg p-4 mb-4">
                  <h5 className="font-semibold text-[#0B2E33] mb-2">Key Factors:</h5>
                  <ul className="text-[#4F7C82] text-sm space-y-1">
                    <li>• Temperature significantly affects battery efficiency</li>
                    <li>• Air conditioning reduces range by 10-15%</li>
                    <li>• Highway driving is less efficient than city driving</li>
                    <li>• Driving style impacts overall consumption</li>
                  </ul>
                </div>
                <button className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#4F7C82] to-[#93B1B5] text-white px-4 py-2 rounded-lg hover:shadow-md transition-all font-medium">
                  <span>Learn more about range data</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
