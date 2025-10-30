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
      {/* Mobile View */}
      <div className="sm:hidden">
        <div className="grid grid-cols-2 gap-2 p-3">
          <div className="col-span-2 flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <ArrowsUpDownIcon className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-gray-900 dark:text-white">
                {selectedCars.length} araç seçildi
              </span>
            </div>
            <button
              onClick={onClearAll}
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Temizle
            </button>
          </div>
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center justify-center space-x-1 py-2 px-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <span className="text-sm">{isExpanded ? 'Araçları Gizle' : 'Araçları Göster'}</span>
          </button>
          
          {selectedCars.length >= 2 ? (
            <Link
              href={`/compare/${selectedCars.map(car => car.slug).join('-vs-')}`}
              className="flex items-center justify-center space-x-1 py-2 px-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ArrowsUpDownIcon className="h-4 w-4" />
              <span className="text-sm">Karşılaştır</span>
            </Link>
          ) : (
            <div className="flex items-center justify-center space-x-1 py-2 px-3 bg-gray-100 text-gray-400 rounded-lg cursor-not-allowed">
              <ArrowsUpDownIcon className="h-4 w-4" />
              <span className="text-sm">1 araç daha seç</span>
            </div>
          )}
        </div>

        {isExpanded && (
          <div className="px-3 pb-3">
            <div className="grid grid-cols-1 gap-2">
              {selectedCars.map((car) => (
                <div
                  key={car.id}
                  className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded-lg p-2"
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-12 h-12 rounded overflow-hidden">
                      <img
                        src={car.image_url}
                        alt={`${car.brand} ${car.model}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {car.brand} {car.model}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {car.year}
                      </div>
                    </div>
                  </div>
                  <button
                    aria-label="Seçili aracı kaldır"
                    onClick={() => onRemoveCar(car.id)}
                    className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors"
                  >
                    <XMarkIcon className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Desktop View */}
      <div className="hidden sm:block max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <ArrowsUpDownIcon className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-gray-900 dark:text-white">
                {selectedCars.length} araç karşılaştırılıyor
              </span>
            </div>
            
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              {isExpanded ? 'Araçları Gizle' : 'Araçları Göster'}
            </button>
          </div>

          <div className="flex items-center space-x-3">
            {selectedCars.length >= 2 && (
              <Link
                href={`/compare/${selectedCars.map(car => car.slug).join('-vs-')}`}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <ArrowsUpDownIcon className="h-4 w-4" />
                <span>Karşılaştır</span>
              </Link>
            )}
            
            <button
              onClick={onClearAll}
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Temizle
            </button>
          </div>
        </div>

        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {selectedCars.map((car) => (
                <div
                  key={car.id}
                  className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded-lg p-3"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-16 h-16 rounded overflow-hidden">
                      <img
                        src={car.image_url}
                        alt={`${car.brand} ${car.model}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {car.brand} {car.model}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {car.year}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => onRemoveCar(car.id)}
                    className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors"
                  >
                    <XMarkIcon className="h-5 w-5 text-gray-500" />
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
