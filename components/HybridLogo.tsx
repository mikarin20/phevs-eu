'use client'

interface HybridLogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export default function HybridLogo({ className = '', size = 'md' }: HybridLogoProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8', 
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  }

  return (
    <svg
      viewBox="0 0 64 64"
      className={`${sizeClasses[size]} ${className}`}
      fill="currentColor"
    >
      {/* Gas Pump Body */}
      <rect x="20" y="8" width="24" height="40" rx="2" fill="currentColor" />
      
      {/* Gas Pump Screen */}
      <rect x="24" y="12" width="16" height="8" rx="1" fill="white" />
      
      {/* Fuel Drop Icon */}
      <path d="M28 16 L30 18 L32 16 L30 14 Z" fill="currentColor" />
      
      {/* Lightning Icon */}
      <path d="M36 16 L38 18 L36 20 L38 22 L36 20 L34 18 Z" fill="currentColor" />
      
      {/* Fuel Hose */}
      <path d="M20 20 Q16 20 12 24 Q8 28 8 32" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
      
      {/* Fuel Nozzle */}
      <rect x="6" y="30" width="6" height="4" rx="1" fill="currentColor" />
      
      {/* Electric Cable */}
      <path d="M44 20 Q48 20 52 24 Q56 28 56 32" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
      
      {/* Electric Plug */}
      <rect x="54" y="30" width="6" height="4" rx="1" fill="currentColor" />
      <rect x="55" y="28" width="4" height="2" fill="currentColor" />
      
      {/* Base */}
      <rect x="16" y="48" width="32" height="8" rx="4" fill="currentColor" />
    </svg>
  )
}
