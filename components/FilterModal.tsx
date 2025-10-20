'use client'

import { useState } from 'react'
import { XMarkIcon, FunnelIcon } from '@heroicons/react/24/outline'

interface FilterModalProps {
  isOpen: boolean
  onClose: () => void
  filters: {
    segment: string
    priceRange: number[]
    rangeRange: number[]
    fuelConsumption: number[]
    batteryArchitecture: string
    batteryChemistry: string
    chargingType: string
    powerRange: number[]
    yearRange: number[]
    emissionRange: number[]
  }
  setFilters: (filters: any) => void
  brands: string[]
  segments: string[]
  onApplyFilters: () => void
  onClearFilters: () => void
}

export default function FilterModal({
  isOpen,
  onClose,
  filters,
  setFilters,
  brands,
  segments,
  onApplyFilters,
  onClearFilters
}: FilterModalProps) {
  if (!isOpen) return null

  const handleApply = () => {
    onApplyFilters()
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <FunnelIcon className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">Advanced Filters</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Segment Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Segment
              </label>
              <select
                value={filters.segment}
                onChange={(e) => setFilters({...filters, segment: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Segments</option>
                {segments.map((segment) => (
                  <option key={segment} value={segment}>
                    {segment}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range Slider */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Range: €{filters.priceRange[0].toLocaleString()} - €{filters.priceRange[1].toLocaleString()}
              </label>
              <div className="px-3">
                <input
                  type="range"
                  min="0"
                  max="150000"
                  step="5000"
                  value={filters.priceRange[0]}
                  onChange={(e) => setFilters({...filters, priceRange: [parseInt(e.target.value), filters.priceRange[1]]})}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <input
                  type="range"
                  min="0"
                  max="150000"
                  step="5000"
                  value={filters.priceRange[1]}
                  onChange={(e) => setFilters({...filters, priceRange: [filters.priceRange[0], parseInt(e.target.value)]})}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider mt-2"
                />
              </div>
            </div>

            {/* Electric Range Slider */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Electric Range: {filters.rangeRange[0]}km - {filters.rangeRange[1]}km
              </label>
              <div className="px-3">
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={filters.rangeRange[0]}
                  onChange={(e) => setFilters({...filters, rangeRange: [parseInt(e.target.value), filters.rangeRange[1]]})}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={filters.rangeRange[1]}
                  onChange={(e) => setFilters({...filters, rangeRange: [filters.rangeRange[0], parseInt(e.target.value)]})}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider mt-2"
                />
              </div>
            </div>

            {/* Power Range Slider */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Power: {filters.powerRange[0]}HP - {filters.powerRange[1]}HP
              </label>
              <div className="px-3">
                <input
                  type="range"
                  min="0"
                  max="500"
                  step="10"
                  value={filters.powerRange[0]}
                  onChange={(e) => setFilters({...filters, powerRange: [parseInt(e.target.value), filters.powerRange[1]]})}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <input
                  type="range"
                  min="0"
                  max="500"
                  step="10"
                  value={filters.powerRange[1]}
                  onChange={(e) => setFilters({...filters, powerRange: [filters.powerRange[0], parseInt(e.target.value)]})}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider mt-2"
                />
              </div>
            </div>

            {/* Year Range Slider */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Year: {filters.yearRange[0]} - {filters.yearRange[1]}
              </label>
              <div className="px-3">
                <input
                  type="range"
                  min="2020"
                  max="2025"
                  step="1"
                  value={filters.yearRange[0]}
                  onChange={(e) => setFilters({...filters, yearRange: [parseInt(e.target.value), filters.yearRange[1]]})}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <input
                  type="range"
                  min="2020"
                  max="2025"
                  step="1"
                  value={filters.yearRange[1]}
                  onChange={(e) => setFilters({...filters, yearRange: [filters.yearRange[0], parseInt(e.target.value)]})}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider mt-2"
                />
              </div>
            </div>

            {/* CO2 Emission Range Slider */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CO₂ Emission: {filters.emissionRange[0]}g/km - {filters.emissionRange[1]}g/km
              </label>
              <div className="px-3">
                <input
                  type="range"
                  min="0"
                  max="150"
                  step="5"
                  value={filters.emissionRange[0]}
                  onChange={(e) => setFilters({...filters, emissionRange: [parseInt(e.target.value), filters.emissionRange[1]]})}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <input
                  type="range"
                  min="0"
                  max="150"
                  step="5"
                  value={filters.emissionRange[1]}
                  onChange={(e) => setFilters({...filters, emissionRange: [filters.emissionRange[0], parseInt(e.target.value)]})}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider mt-2"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between space-x-3 pt-6 border-t border-gray-200">
            <button
              onClick={onClearFilters}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Clear All
            </button>
            <button
              onClick={handleApply}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
