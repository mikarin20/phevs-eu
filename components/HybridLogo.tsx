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
    <img
      src="/symbol.png"
      alt="PHEV Hybrid Symbol"
      className={`${sizeClasses[size]} ${className}`}
    />
  )
}
