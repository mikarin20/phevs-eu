'use client'

import { useState, useEffect } from 'react'

interface ImageGalleryProps {
  images: string[]
  alt: string
}

export default function ImageGallery({ images, alt }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [loadedImages, setLoadedImages] = useState<string[]>([])
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set())

  // İlk 7 görseli otomatik yükle
  useEffect(() => {
    if (images && images.length > 0) {
      const imagesToLoad = images.slice(0, 7) // İlk 7 görseli al
      setLoadedImages(imagesToLoad)
    }
  }, [images])

  // Görsel başarıyla yüklendiğinde
  const handleImageLoad = (src: string) => {
    if (!loadedImages.includes(src)) {
      setLoadedImages(prev => [...prev, src])
    }
  }

  // Görsel yüklenemediğinde
  const handleImageError = (src: string) => {
    setFailedImages(prev => new Set([...prev, src]))
  }

  // Ana görsel
  const mainImageSrc = loadedImages[selectedImage] || loadedImages[0] || '/images/placeholder-car.jpg'

  // Thumbnail'lar için görseller - sadece yüklenenler
  const thumbnailImages = loadedImages.slice(1, 21) // İlk görseli çıkar, max 20 thumbnail

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-w-16 aspect-h-9 bg-gradient-to-br from-[#F1F5F9] to-[#E2E8F0] rounded-lg overflow-hidden shadow-md">
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
      {thumbnailImages.length > 0 && (
        <div className="grid grid-cols-5 gap-3">
          {thumbnailImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index + 1)} // +1 çünkü ilk görsel ana görsel
              className={`aspect-w-16 aspect-h-9 bg-gradient-to-br from-[#F1F5F9] to-[#E2E8F0] rounded-lg overflow-hidden transition-all duration-300 ${
                selectedImage === index + 1 
                  ? 'ring-2 ring-[#4F7C82] shadow-lg scale-105' 
                  : 'hover:ring-1 hover:ring-[#93B1B5] hover:scale-105'
              }`}
            >
              <img
                src={image}
                alt={`${alt} ${index + 2}`}
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
      )}

    </div>
  )
}