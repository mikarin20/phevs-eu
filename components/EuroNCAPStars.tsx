'use client'

import { useState } from 'react'
import { StarIcon } from '@heroicons/react/24/solid'
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline'

interface EuroNCAPRating {
  stars: number
  adult_occupant: number
  child_occupant: number
  pedestrian_protection: number
  safety_assist: number
  overall_rating: number
  test_year?: number
}

interface EuroNCAPStarsProps {
  rating: EuroNCAPRating
  size?: 'sm' | 'md' | 'lg'
  showDetails?: boolean
}

export default function EuroNCAPStars({ rating, size = 'md', showDetails = false }: EuroNCAPStarsProps) {
  const [hoveredStar, setHoveredStar] = useState<number | null>(null)
  
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  }

  const containerClasses = {
    sm: 'space-x-1',
    md: 'space-x-1',
    lg: 'space-x-1.5'
  }

  const getStarColor = (index: number) => {
    if (index < rating.stars) {
      return 'text-yellow-400'
    }
    return 'text-gray-300'
  }

  const getRatingColor = (stars: number) => {
    if (stars >= 5) return 'text-green-600'
    if (stars >= 4) return 'text-yellow-600'
    if (stars >= 3) return 'text-orange-600'
    return 'text-red-600'
  }

  const getTooltipContent = (starIndex: number) => {
    const categories = [
      { name: 'Adult Occupant', value: rating.adult_occupant },
      { name: 'Child Occupant', value: rating.child_occupant },
      { name: 'Pedestrian', value: rating.pedestrian_protection },
      { name: 'Safety Assist', value: rating.safety_assist }
    ]
    
    if (starIndex < categories.length) {
      return categories[starIndex]
    }
    return null
  }

  return (
    <div className="flex flex-col items-center space-y-1">
      {/* Stars Display */}
      <div className={`flex items-center ${containerClasses[size]}`}>
        {[1, 2, 3, 4, 5].map((star) => {
          const tooltipContent = getTooltipContent(star - 1)
          const isHovered = hoveredStar === star - 1
          
          return (
            <div 
              key={star} 
              className="relative group"
              onMouseEnter={() => setHoveredStar(star - 1)}
              onMouseLeave={() => setHoveredStar(null)}
            >
              {star <= rating.stars ? (
                <StarIcon className={`${sizeClasses[size]} ${getStarColor(star - 1)} transition-all duration-200 group-hover:scale-110 cursor-pointer`} />
              ) : (
                <StarOutlineIcon className={`${sizeClasses[size]} ${getStarColor(star - 1)} transition-all duration-200 group-hover:scale-110 cursor-pointer`} />
              )}
              
              {/* Tooltip */}
              {tooltipContent && (
                <div className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-[#0B2E33] text-white text-xs rounded-lg shadow-lg whitespace-nowrap z-50 transition-opacity duration-200 ${
                  isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}>
                  <div className="font-semibold">{tooltipContent.name}</div>
                  <div className="text-[#B8E3E9]">{tooltipContent.value}%</div>
                  {/* Arrow */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-[#0B2E33]"></div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Rating Number */}
      <div className={`text-sm font-semibold ${getRatingColor(rating.stars)}`}>
        {rating.stars}/5
      </div>

      {/* Euro NCAP Label */}
      <div className="text-xs font-medium text-[#4F7C82]">
        Euro NCAP
      </div>

      {/* Test Year */}
      {rating.test_year && (
        <div className="text-xs text-[#93B1B5]">
          {rating.test_year}
        </div>
      )}

      {/* Detailed Ratings */}
      {showDetails && (
        <div className="text-xs space-y-1">
          <div className="grid grid-cols-2 gap-2">
            <div className="flex justify-between">
              <span className="text-[#4F7C82]">Adult:</span>
              <span className="font-medium text-[#0B2E33]">{rating.adult_occupant}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#4F7C82]">Child:</span>
              <span className="font-medium text-[#0B2E33]">{rating.child_occupant}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#4F7C82]">Pedestrian:</span>
              <span className="font-medium text-[#0B2E33]">{rating.pedestrian_protection}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#4F7C82]">Safety Assist:</span>
              <span className="font-medium text-[#0B2E33]">{rating.safety_assist}%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
