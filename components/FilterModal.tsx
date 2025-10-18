'use client'

import { useState } from 'react'
import { XMarkIcon, FunnelIcon } from '@heroicons/react/24/outline'

interface FilterModalProps {
  isOpen: boolean
  onClose: () => void
  selectedBrand: string
  setSelectedBrand: (brand: string) => void
  selectedSegment: string
  setSelectedSegment: (segment: string) => void
  selectedPriceRange: string
  setSelectedPriceRange: (range: string) => void
  selectedRange: string
  setSelectedRange: (range: string) => void
  brands: string[]
  segments: string[]
  priceRanges: { value: string; label: string }[]
  rangeRanges: { value: string; label: string }[]
  onApplyFilters: () => void
  onClearFilters: () => void
}

export default function FilterModal({
  isOpen,
  onClose,
  selectedBrand,
  setSelectedBrand,
  selectedSegment,
  setSelectedSegment,
  selectedPriceRange,
  setSelectedPriceRange,
  selectedRange,
  setSelectedRange,
  brands,
  segments,
  priceRanges,
  rangeRanges,
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
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <FunnelIcon className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">Filters</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Brand Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brand
              </label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Brands</option>
                {brands.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
            </div>

            {/* Segment Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Segment
              </label>
              <select
                value={selectedSegment}
                onChange={(e) => setSelectedSegment(e.target.value)}
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

            {/* Price Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Range
              </label>
              <select
                value={selectedPriceRange}
                onChange={(e) => setSelectedPriceRange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Prices</option>
                {priceRanges.map((range) => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Electric Range
              </label>
              <select
                value={selectedRange}
                onChange={(e) => setSelectedRange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Ranges</option>
                {rangeRanges.map((range) => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
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
