'use client'

import { useState } from 'react'
import { getImageUrl } from '@/lib/image-url'

interface BlogImageProps {
  src: string
  alt: string
  className?: string
  width?: number
  height?: number
}

export default function BlogImage({ src, alt, className = '', width, height }: BlogImageProps) {
  const [imgSrc, setImgSrc] = useState(getImageUrl(src))
  const [hasError, setHasError] = useState(false)

  const handleError = () => {
    if (!hasError) {
      setHasError(true)
      setImgSrc(getImageUrl(null))
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

