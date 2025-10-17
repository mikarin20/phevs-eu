'use client'

import { StarIcon } from '@heroicons/react/24/solid'
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline'

interface EuroNCAPRating {
  stars: number
  adult_occupant: number
  child_occupant: number
  pedestrian_protection: number
  safety_assist: number
  overall_rating: number
}

interface EuroNCAPStarsProps {
  rating: EuroNCAPRating
  size?: 'sm' | 'md' | 'lg'
  showDetails?: boolean
}

export default function EuroNCAPStars({ rating, size = 'md', showDetails = false }: EuroNCAPStarsProps) {
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

  return (
    <div className="flex flex-col space-y-2">
      {/* Stars Display */}
      <div className={`flex items-center ${containerClasses[size]}`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <div key={star} className="relative">
            {star <= rating.stars ? (
              <StarIcon className={`${sizeClasses[size]} ${getStarColor(star - 1)}`} />
            ) : (
              <StarOutlineIcon className={`${sizeClasses[size]} ${getStarColor(star - 1)}`} />
            )}
          </div>
        ))}
        <span className={`ml-2 font-semibold ${getRatingColor(rating.stars)}`}>
          {rating.stars}/5
        </span>
      </div>

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
