'use client'

import { useState, useEffect } from 'react'
import { 
  SunIcon, 
  InformationCircleIcon,
  ArrowLeftIcon,
  XMarkIcon
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-semibold text-gray-900">Range Simulator</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Main Content */}
        <div className="p-6">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Discover Your Electric Range
            </h3>
            <p className="text-gray-600">
              Simulate realistic electric range based on driving conditions
            </p>
            {simulatorData && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Model-specific data:</strong> Using official efficiency parameters for this vehicle
                </p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Temperature Control */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <SunIcon className="w-5 h-5 text-gray-600" />
                <h4 className="font-semibold text-gray-900">Outside Temperature</h4>
                <InformationCircleIcon className="w-4 h-4 text-gray-400" />
              </div>
              
              <div className="relative">
                <div className="h-64 bg-gradient-to-t from-blue-500 via-green-500 to-red-500 rounded-lg relative">
                  <div className="absolute inset-0 flex flex-col justify-between p-4">
                    <div className="flex items-center justify-center">
                      <SunIcon className="w-6 h-6 text-white" />
                      <span className="text-white font-semibold ml-2">30°C</span>
                    </div>
                    <div className="flex items-center justify-center">
                      <SunIcon className="w-6 h-6 text-white rotate-180" />
                      <span className="text-white font-semibold ml-2">-10°C</span>
                    </div>
                  </div>
                  
                  {/* Optimal temperature indicator */}
                  {simulatorData && (
                    <div 
                      className="absolute w-1 h-8 bg-yellow-300 rounded-full transform -translate-x-1/2"
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
                    className="absolute w-6 h-6 bg-white rounded-full shadow-lg border-2 border-gray-300 transform -translate-x-1/2 -translate-y-1/2"
                    style={{ 
                      left: '50%', 
                      top: `${((30 - temperature) / 40) * 100}%` 
                    }}
                  />
                </div>
                <div className="text-center mt-2">
                  <span className="text-2xl font-bold text-gray-900">{temperature}°C</span>
                </div>
              </div>
            </div>

            {/* Range Display */}
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="relative">
                <div className="w-48 h-48 bg-gradient-to-br from-blue-100 via-green-100 to-red-100 rounded-full flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-200/20 via-green-200/20 to-red-200/20 animate-pulse" />
                  <div className="text-center z-10">
                    <div className="text-6xl font-bold text-gray-900">{calculatedRange}</div>
                    <div className="text-xl text-gray-600">km</div>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Estimated electric range
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Based on {batteryCapacity}kWh battery
                </p>
                {simulatorData && (
                  <div className="mt-2 text-xs text-gray-500">
                    <p>WLTP Base: {simulatorData.base_range_km} km</p>
                    <p>Optimal temp: {simulatorData.temperature_efficiency.optimal_temp}°C</p>
                  </div>
                )}
              </div>
            </div>

            {/* AC Control */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <SunIcon className="w-5 h-5 text-gray-600" />
                <h4 className="font-semibold text-gray-900">Air Conditioning</h4>
                <InformationCircleIcon className="w-4 h-4 text-gray-400" />
              </div>
              
              <div className="space-y-4">
                <button
                  onClick={() => setAcEnabled(!acEnabled)}
                  className={`w-full p-4 rounded-xl border-2 transition-all ${
                    acEnabled 
                      ? 'border-blue-500 bg-blue-50 text-blue-700' 
                      : 'border-gray-200 bg-gray-50 text-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      acEnabled ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'
                    }`}>
                      <SunIcon className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold">
                        {acEnabled ? 'AC Enabled' : 'AC Disabled'}
                      </div>
                      <div className="text-sm">
                        {acEnabled ? 'Climate control active' : 'Climate control off'}
                      </div>
                      {simulatorData && (
                        <div className="text-xs text-gray-500 mt-1">
                          Impact: {Math.round((1 - simulatorData.ac_impact) * 100)}% range reduction
                        </div>
                      )}
                    </div>
                  </div>
                </button>

                {/* Highway Share */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Highway Driving: {highwayShare}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={highwayShare}
                    onChange={(e) => setHighwayShare(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>City</span>
                    <span>Highway</span>
                  </div>
                  {simulatorData && (
                    <div className="text-xs text-gray-500">
                      <p>City efficiency: {Math.round(simulatorData.highway_efficiency.city_factor * 100)}%</p>
                      <p>Highway efficiency: {Math.round(simulatorData.highway_efficiency.highway_factor * 100)}%</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Information */}
          <div className="mt-8 p-4 bg-gray-50 rounded-xl">
            <p className="text-sm text-gray-600 mb-2">
              <strong>Note:</strong> The achievable range depends particularly on your individual driving style. 
              This simulation uses average consumption patterns.
            </p>
            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
              → Information about range data
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
