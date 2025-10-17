export function CarCardSkeleton({ viewMode = 'list', count = 1 }: { viewMode?: 'list' | 'grid', count?: number }) {
  const SkeletonCard = () => {
    if (viewMode === 'grid') {
      return (
        <div className="card animate-pulse">
          {/* Image */}
          <div className="w-full h-48 bg-gradient-to-br from-[#F1F5F9] to-[#E2E8F0] rounded-lg mb-4"></div>
          
          {/* Title */}
          <div className="h-6 bg-[#E2E8F0] rounded-lg w-3/4 mb-2"></div>
          
          {/* Badges */}
          <div className="flex items-center space-x-2 mb-4">
            <div className="h-5 w-16 bg-[#F1F5F9] rounded-full"></div>
            <div className="h-5 w-16 bg-[#F1F5F9] rounded-full"></div>
          </div>
          
          {/* Price */}
          <div className="h-8 bg-[#E2E8F0] rounded-lg w-1/2 mb-4"></div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i}>
                <div className="h-3 bg-[#F1F5F9] rounded w-16 mb-1"></div>
                <div className="h-4 bg-[#E2E8F0] rounded w-20"></div>
              </div>
            ))}
          </div>
          
          {/* Buttons */}
          <div className="flex items-center space-x-2 pt-4 mt-4 border-t border-[#E2E8F0]">
            <div className="flex-1 h-10 bg-[#E2E8F0] rounded-lg"></div>
            <div className="flex-1 h-10 bg-[#E2E8F0] rounded-lg"></div>
          </div>
        </div>
      )
    }

    return (
      <div className="card animate-pulse">
        <div className="flex items-start space-x-4">
          {/* Image */}
          <div className="flex-shrink-0 w-24 h-16 bg-gradient-to-br from-[#F1F5F9] to-[#E2E8F0] rounded-lg"></div>
          
          {/* Info */}
          <div className="flex-1">
            {/* Title */}
            <div className="h-6 bg-[#E2E8F0] rounded-lg w-1/2 mb-2"></div>
            
            {/* Badges */}
            <div className="flex items-center space-x-2 mb-3">
              <div className="h-5 w-16 bg-[#F1F5F9] rounded-full"></div>
              <div className="h-5 w-20 bg-[#F1F5F9] rounded-full"></div>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i}>
                  <div className="h-3 bg-[#F1F5F9] rounded w-24 mb-1"></div>
                  <div className="h-4 bg-[#E2E8F0] rounded w-20"></div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Price & Actions */}
          <div className="flex-shrink-0 flex flex-col items-end space-y-2">
            <div className="h-10 bg-[#E2E8F0] rounded-lg w-32 mb-2"></div>
            <div className="w-8 h-8 bg-[#F1F5F9] rounded-full"></div>
            <div className="w-8 h-8 bg-[#F1F5F9] rounded-full"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <SkeletonCard key={i} />
      ))}
    </>
  )
}

export function HeroSkeleton() {
  return (
    <div className="hero-gradient hero-pattern py-16 px-4 sm:px-6 lg:px-8 shadow-2xl animate-pulse">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <div className="text-center mb-12">
          <div className="h-12 bg-white/20 rounded-lg w-2/3 mx-auto mb-4"></div>
          <div className="h-6 bg-white/10 rounded-lg w-1/2 mx-auto"></div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="stat-card">
              <div className="h-10 bg-white/20 rounded w-20 mb-2"></div>
              <div className="h-4 bg-white/10 rounded w-32"></div>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="max-w-3xl mx-auto">
          <div className="h-16 bg-white/20 rounded-2xl"></div>
        </div>
      </div>
    </div>
  )
}

export function FilterBarSkeleton() {
  return (
    <div className="filter-bar animate-pulse">
      <div className="flex items-center justify-between mb-6">
        <div className="h-6 bg-slate-300 rounded w-32"></div>
        <div className="flex space-x-3">
          <div className="h-10 w-32 bg-slate-200 rounded-xl"></div>
          <div className="h-10 w-24 bg-slate-200 rounded-xl"></div>
        </div>
      </div>
    </div>
  )
}

