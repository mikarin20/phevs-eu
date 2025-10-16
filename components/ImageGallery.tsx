'use client'

import { useState, useEffect } from 'react'

interface ImageGalleryProps {
  images: string[]
  alt: string
}

export default function ImageGallery({ images, alt }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [validImages, setValidImages] = useState<string[]>([])
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set())
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set())

  // İlk görseli yükle
  useEffect(() => {
    if (images && images.length > 0) {
      setValidImages([images[0]])
    }
  }, [images])

  // Görsel başarıyla yüklendiğinde
  const handleImageLoad = (src: string) => {
    setLoadedImages(prev => new Set([...prev, src]))
    if (!validImages.includes(src)) {
      setValidImages(prev => [...prev, src])
    }
  }

  // Görsel yüklenemediğinde
  const handleImageError = (src: string) => {
    setFailedImages(prev => new Set([...prev, src]))
  }

  // Görüntülenecek görseller - sadece yüklenenler ve henüz denenmeyenler
  const displayImages = images.filter(img => 
    !failedImages.has(img)
  )

  // Ana görsel için fallback
  const mainImageSrc = validImages[selectedImage] || validImages[0] || '/images/placeholder-car.jpg'

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg overflow-hidden">
        <img
          src={mainImageSrc}
          alt={alt}
          className="w-full h-96 object-cover"
          onLoad={() => handleImageLoad(mainImageSrc)}
          onError={(e) => {
            handleImageError(mainImageSrc)
            e.currentTarget.src = '/images/placeholder-car.jpg'
          }}
        />
      </div>

      {/* Thumbnail Images */}
      <div className="grid grid-cols-5 gap-2">
        {displayImages.slice(0, 20).map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg overflow-hidden transition-all ${
              selectedImage === index ? 'ring-2 ring-blue-500' : 'hover:ring-2 hover:ring-blue-300'
            }`}
          >
            <img
              src={image}
              alt={`${alt} ${index + 1}`}
              className="w-full h-20 object-cover"
              onLoad={() => handleImageLoad(image)}
              onError={(e) => {
                handleImageError(image)
                e.currentTarget.style.display = 'none'
              }}
            />
          </button>
        ))}
      </div>
    </div>
  )
}
