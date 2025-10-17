// phevs_eu_modern_blue_green_demo.jsx
import { useState, useEffect, useMemo } from 'react'
import { 
  MagnifyingGlassIcon, 
  ArrowsUpDownIcon, 
  CheckIcon, 
  XMarkIcon,
  Squares2X2Icon,
  ListBulletIcon,
  HeartIcon,
  FunnelIcon,
  ChevronDownIcon,
  SparklesIcon,
  BoltIcon,
  CurrencyEuroIcon,
  CpuChipIcon,
  WrenchScrewdriverIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'

export default function PhevsModernBlueGreenDemo() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header - Modern Mavi-Yeşil */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">PHEVs.eu</h1>
              <span className="text-sm text-blue-600">Plug-in Hybrid Comparison</span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-5 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 inline-flex items-center space-x-2">
                <SparklesIcon className="h-5 w-5" />
                <span>Range Simulator</span>
              </button>
              <Link href="/compare" className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 px-5 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 inline-flex items-center space-x-2">
                <ArrowsUpDownIcon className="h-5 w-5" />
                <span>Compare (0/3)</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Filter Bar - Modern Stil */}
      <div className="bg-gray-50 border-b border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="flex-1 min-w-64">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by brand or model..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>
            
            {/* Filters */}
            <select className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
              <option>All Brands</option>
              <option>Audi</option>
              <option>BMW</option>
              <option>Mercedes</option>
            </select>
            
            <select className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
              <option>All Segments</option>
              <option>SUV</option>
              <option>Sedan</option>
              <option>Hatchback</option>
            </select>
            
            <select className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
              <option>Sort by Name</option>
              <option>Sort by Price</option>
              <option>Sort by Range</option>
            </select>
          </div>
        </div>
      </div>

      {/* Range Simulator Banner - Modern Mavi */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <SparklesIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Range Simulator</h3>
                <p className="text-sm text-gray-600">Discover your real-world electric range based on temperature and driving conditions</p>
              </div>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 inline-flex items-center space-x-2">
              <SparklesIcon className="h-5 w-5" />
              <span>Try Range Simulator</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">87 vehicles found</h2>
        </div>

        {/* Sample Car Cards - Modern Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Sample Car 1 */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-all duration-200 p-6 group">
            <div className="aspect-w-16 aspect-h-9 mb-4">
              <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-green-100 rounded-lg flex items-center justify-center">
                <span className="text-4xl">🚗</span>
              </div>
            </div>
            
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900">Audi A3 Sportback TFSI e</h3>
                <div className="text-xl font-bold text-blue-600">€45,000</div>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full">2024</span>
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded-full">Compact</span>
                </div>
                <div className="flex text-yellow-400">
                  ⭐⭐⭐⭐⭐
                </div>
              </div>
              
              <div className="space-y-2 text-sm mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <BoltIcon className="h-4 w-4 text-blue-600" />
                    <span className="text-gray-700">EV Range:</span>
                  </div>
                  <span className="font-semibold text-blue-600">78 km</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CpuChipIcon className="h-4 w-4 text-blue-600" />
                    <span className="text-gray-700">Battery:</span>
                  </div>
                  <span className="font-semibold text-blue-600">13 kWh</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CurrencyEuroIcon className="h-4 w-4 text-blue-600" />
                    <span className="text-gray-700">Fuel Consumption:</span>
                  </div>
                  <span className="font-semibold text-blue-600">1.4 L/100km</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <HeartIcon className="h-5 w-5 text-gray-400 hover:text-red-500" />
                </button>
                <button className="w-8 h-8 rounded-full border-2 border-gray-300 hover:border-blue-600 flex items-center justify-center transition-colors">
                  <CheckIcon className="h-4 w-4 text-gray-400" />
                </button>
              </div>
            </div>
          </div>

          {/* Sample Car 2 */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-all duration-200 p-6 group">
            <div className="aspect-w-16 aspect-h-9 mb-4">
              <div className="w-full h-48 bg-gradient-to-br from-green-100 to-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-4xl">🚙</span>
              </div>
            </div>
            
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900">BMW X5 xDrive45e</h3>
                <div className="text-xl font-bold text-blue-600">€78,000</div>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full">2024</span>
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded-full">SUV</span>
                </div>
                <div className="flex text-yellow-400">
                  ⭐⭐⭐⭐⭐
                </div>
              </div>
              
              <div className="space-y-2 text-sm mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <BoltIcon className="h-4 w-4 text-blue-600" />
                    <span className="text-gray-700">EV Range:</span>
                  </div>
                  <span className="font-semibold text-blue-600">87 km</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CpuChipIcon className="h-4 w-4 text-blue-600" />
                    <span className="text-gray-700">Battery:</span>
                  </div>
                  <span className="font-semibold text-blue-600">24 kWh</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CurrencyEuroIcon className="h-4 w-4 text-blue-600" />
                    <span className="text-gray-700">Fuel Consumption:</span>
                  </div>
                  <span className="font-semibold text-blue-600">2.1 L/100km</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <HeartIcon className="h-5 w-5 text-gray-400 hover:text-red-500" />
                </button>
                <button className="w-8 h-8 rounded-full border-2 border-gray-300 hover:border-blue-600 flex items-center justify-center transition-colors">
                  <CheckIcon className="h-4 w-4 text-gray-400" />
                </button>
              </div>
            </div>
          </div>

          {/* Sample Car 3 */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-all duration-200 p-6 group">
            <div className="aspect-w-16 aspect-h-9 mb-4">
              <div className="w-full h-48 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                <span className="text-4xl">🚘</span>
              </div>
            </div>
            
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900">Mercedes C-Class C300e</h3>
                <div className="text-xl font-bold text-blue-600">€52,000</div>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full">2024</span>
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded-full">Sedan</span>
                </div>
                <div className="flex text-yellow-400">
                  ⭐⭐⭐⭐⭐
                </div>
              </div>
              
              <div className="space-y-2 text-sm mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <BoltIcon className="h-4 w-4 text-blue-600" />
                    <span className="text-gray-700">EV Range:</span>
                  </div>
                  <span className="font-semibold text-blue-600">105 km</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CpuChipIcon className="h-4 w-4 text-blue-600" />
                    <span className="text-gray-700">Battery:</span>
                  </div>
                  <span className="font-semibold text-blue-600">25.4 kWh</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CurrencyEuroIcon className="h-4 w-4 text-blue-600" />
                    <span className="text-gray-700">Fuel Consumption:</span>
                  </div>
                  <span className="font-semibold text-blue-600">1.1 L/100km</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <HeartIcon className="h-5 w-5 text-gray-400 hover:text-red-500" />
                </button>
                <button className="w-8 h-8 rounded-full border-2 border-gray-300 hover:border-blue-600 flex items-center justify-center transition-colors">
                  <CheckIcon className="h-4 w-4 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">PHEVs.eu</h3>
              <p className="text-gray-300 text-sm">
                Europe's most comprehensive plug-in hybrid vehicle comparison platform
              </p>
            </div>
            <div className="border-t border-gray-700 pt-4">
              <p className="text-gray-400 text-xs">
                © 2025 PHEVs.eu. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}