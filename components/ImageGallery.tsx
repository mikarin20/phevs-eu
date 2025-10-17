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
    // Eğer ana görsel yüklenemezse, ilk geçerli görseli kullan
    if (src === mainImageSrc && loadedImages.length > 0) {
      setSelectedImage(0)
    }
  }

  // Ana görsel - önce images array'inden, sonra loadedImages'dan, en son placeholder
  const getMainImageSrc = () => {
    // Önce images array'inden seçili index'i dene
    if (images?.[selectedImage] && !failedImages.has(images[selectedImage])) {
      return images[selectedImage]
    }
    // Sonra images array'inden ilk geçerli görseli dene
    if (images?.[0] && !failedImages.has(images[0])) {
      return images[0]
    }
    // Sonra loadedImages'dan seçili index'i dene
    if (loadedImages[selectedImage] && !failedImages.has(loadedImages[selectedImage])) {
      return loadedImages[selectedImage]
    }
    // Sonra loadedImages'dan ilk geçerli görseli dene
    if (loadedImages[0] && !failedImages.has(loadedImages[0])) {
      return loadedImages[0]
    }
    // En son placeholder
    return '/images/placeholder-car.jpg'
  }
  
  const mainImageSrc = getMainImageSrc()

  // Thumbnail'lar için görseller - sadece yüklenenler
  const thumbnailImages = loadedImages.slice(1, 21) // İlk görseli çıkar, max 20 thumbnail

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative bg-gradient-to-br from-[#F1F5F9] to-[#E2E8F0] rounded-lg overflow-hidden shadow-md">
        <div className="aspect-[16/9] w-full max-h-20">
          <img
            src={mainImageSrc}
            alt={alt}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            loading="eager"
            fetchPriority="high"
            onLoad={() => handleImageLoad(mainImageSrc)}
            onError={(e) => {
              handleImageError(mainImageSrc)
              e.currentTarget.src = '/images/placeholder-car.jpg'
            }}
          />
        </div>
      </div>

      {/* Thumbnail Images */}
      {thumbnailImages.length > 0 && (
        <div className="grid grid-cols-5 gap-3">
          {thumbnailImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index + 1)} // +1 çünkü ilk görsel ana görsel
              className={`bg-gradient-to-br from-[#F1F5F9] to-[#E2E8F0] rounded-lg overflow-hidden transition-all duration-300 ${
                selectedImage === index + 1 
                  ? 'ring-2 ring-[#4F7C82] shadow-lg scale-105' 
                  : 'hover:ring-1 hover:ring-[#93B1B5] hover:scale-105'
              }`}
            >
              <div className="aspect-[16/9] w-full h-16">
                <img
                  src={image}
                  alt={`${alt} ${index + 2}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onLoad={() => handleImageLoad(image)}
                  onError={(e) => {
                    handleImageError(image)
                    e.currentTarget.style.display = 'none'
                  }}
                />
              </div>
            </button>
          ))}
        </div>
      )}

    </div>
  )
}