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
      <div className="aspect-w-16 aspect-h-9 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl overflow-hidden shadow-2xl">
        <img
          src={mainImageSrc}
          alt={alt}
          className="w-full h-96 object-cover hover:scale-105 transition-transform duration-500"
          loading="eager"
          onLoad={() => handleImageLoad(mainImageSrc)}
          onError={(e) => {
            handleImageError(mainImageSrc)
            e.currentTarget.src = '/images/placeholder-car.jpg'
          }}
        />
      </div>

      {/* Thumbnail Images */}
      <div className="grid grid-cols-5 gap-3">
        {displayImages.slice(0, 20).map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`aspect-w-16 aspect-h-9 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl overflow-hidden transition-all duration-300 ${
              selectedImage === index 
                ? 'ring-4 ring-blue-500 shadow-xl shadow-blue-500/30 scale-105' 
                : 'hover:ring-2 hover:ring-blue-300 hover:scale-105'
            }`}
          >
            <img
              src={image}
              alt={`${alt} ${index + 1}`}
              className="w-full h-20 object-cover"
              loading="lazy"
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
