export function CarCardSkeleton({ viewMode = 'list' }: { viewMode?: 'list' | 'grid' }) {
  if (viewMode === 'grid') {
    return (
      <div className="card animate-pulse">
        {/* Image */}
        <div className="w-full h-48 bg-gradient-to-br from-slate-200 to-slate-300 rounded-xl mb-4"></div>
        
        {/* Title */}
        <div className="h-6 bg-slate-300 rounded-lg w-3/4 mb-2"></div>
        
        {/* Badges */}
        <div className="flex items-center space-x-2 mb-4">
          <div className="h-5 w-16 bg-slate-200 rounded-full"></div>
          <div className="h-5 w-16 bg-slate-200 rounded-full"></div>
        </div>
        
        {/* Price */}
        <div className="h-8 bg-slate-300 rounded-lg w-1/2 mb-4"></div>
        
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i}>
              <div className="h-3 bg-slate-200 rounded w-16 mb-1"></div>
              <div className="h-4 bg-slate-300 rounded w-20"></div>
            </div>
          ))}
        </div>
        
        {/* Buttons */}
        <div className="flex items-center space-x-2 pt-4 mt-4 border-t border-slate-200">
          <div className="flex-1 h-10 bg-slate-300 rounded-xl"></div>
          <div className="flex-1 h-10 bg-slate-300 rounded-xl"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="card animate-pulse">
      <div className="flex items-start space-x-6">
        {/* Image */}
        <div className="flex-shrink-0 w-32 h-20 bg-gradient-to-br from-slate-200 to-slate-300 rounded-xl"></div>
        
        {/* Info */}
        <div className="flex-1">
          {/* Title */}
          <div className="h-6 bg-slate-300 rounded-lg w-1/2 mb-2"></div>
          
          {/* Badges */}
          <div className="flex items-center space-x-2 mb-3">
            <div className="h-5 w-16 bg-slate-200 rounded-full"></div>
            <div className="h-5 w-20 bg-slate-200 rounded-full"></div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i}>
                <div className="h-3 bg-slate-200 rounded w-24 mb-1"></div>
                <div className="h-4 bg-slate-300 rounded w-20"></div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Price & Actions */}
        <div className="flex-shrink-0 flex flex-col items-end space-y-2">
          <div className="h-10 bg-slate-300 rounded-lg w-32 mb-2"></div>
          <div className="w-10 h-10 bg-slate-200 rounded-full"></div>
          <div className="w-10 h-10 bg-slate-200 rounded-full"></div>
        </div>
      </div>
    </div>
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

