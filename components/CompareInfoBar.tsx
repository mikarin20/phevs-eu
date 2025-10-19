'use client'

import { useState } from 'react'
import { XMarkIcon, ArrowsUpDownIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

interface Car {
  id: string
  brand: string
  model: string
  year: number
  image_url: string
  slug: string
}

interface CompareInfoBarProps {
  selectedCars: Car[]
  onRemoveCar: (carId: string) => void
  onClearAll: () => void
  isVisible: boolean
}

export default function CompareInfoBar({ 
  selectedCars, 
  onRemoveCar, 
  onClearAll, 
  isVisible 
}: CompareInfoBarProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (!isVisible || selectedCars.length === 0) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg z-40">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <ArrowsUpDownIcon className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-gray-900 dark:text-white">
                Comparing {selectedCars.length} vehicle{selectedCars.length > 1 ? 's' : ''}
              </span>
            </div>
            
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              {isExpanded ? 'Hide' : 'Show'} vehicles
            </button>
          </div>

          <div className="flex items-center space-x-3">
            {selectedCars.length >= 2 && (
              <Link
                href={`/compare/${selectedCars.map(car => car.slug).join('-vs-')}`}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <ArrowsUpDownIcon className="h-4 w-4" />
                <span>Compare Now</span>
              </Link>
            )}
            
            <button
              onClick={onClearAll}
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Clear All
            </button>
          </div>
        </div>

        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 overflow-x-auto">
              {selectedCars.map((car) => (
                <div
                  key={car.id}
                  className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-700 rounded-lg p-2 min-w-0 flex-shrink-0"
                >
                  <div className="w-8 h-8 rounded overflow-hidden flex-shrink-0">
                    <img
                      src={car.image_url}
                      alt={`${car.brand} ${car.model}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-medium text-gray-900 dark:text-white truncate">
                      {car.brand} {car.model}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {car.year}
                    </div>
                  </div>
                  <button
                    onClick={() => onRemoveCar(car.id)}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors flex-shrink-0"
                  >
                    <XMarkIcon className="h-3 w-3 text-gray-500" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
