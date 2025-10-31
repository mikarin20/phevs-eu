'use client'

import { useState } from 'react'

interface BlogImageProps {
  src: string
  alt: string
  className?: string
  width?: number
  height?: number
}

export default function BlogImage({ src, alt, className = '', width, height }: BlogImageProps) {
  const [imgSrc, setImgSrc] = useState(src)
  const [hasError, setHasError] = useState(false)

  const handleError = () => {
    if (!hasError) {
      setHasError(true)
      setImgSrc('/images/placeholder-car.jpg')
    }
  }

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      width={width}
      height={height}
      onError={handleError}
    />
  )
}

