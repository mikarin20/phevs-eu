'use client'

import { useState, useEffect } from 'react'

interface ImageGalleryProps {
  images: string[]
  alt: string
}

export default function ImageGallery({ images, alt }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set())
  const [invalidImageIndices, setInvalidImageIndices] = useState<Set<number>>(new Set())

  // Sadece mevcut görselleri filtrele
  let validImages = images.filter(img => img && img.trim() !== '')
  
  // Hatalı görselleri filtrele
  if (invalidImageIndices.size > 0) {
    validImages = validImages.filter((_, index) => !invalidImageIndices.has(index))
  }
  
  // Eğer seçili görsel geçersizse, ilk geçerli görseli seç
  useEffect(() => {
    if (invalidImageIndices.size > 0 && selectedImage >= validImages.length && validImages.length > 0) {
      setSelectedImage(0)
    }
  }, [invalidImageIndices.size, selectedImage, validImages.length])

  if (validImages.length === 0) {
    return (
      <div className="space-y-4">
        <div className="relative bg-gradient-to-br from-[#F1F5F9] to-[#E2E8F0] rounded-lg overflow-hidden shadow-md">
          <div className="aspect-[4/3] w-full max-w-4xl mx-auto flex items-center justify-center">
            <p className="text-gray-500">Görsel bulunamadı</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Main Image - Modern Hero Style */}
      <div className="relative bg-gradient-to-br from-slate-100 via-white to-slate-50 rounded-2xl overflow-hidden shadow-xl border border-slate-200">
        <div className="aspect-[16/9] w-full max-w-6xl mx-auto flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
          <img
            src={validImages[selectedImage]}
            alt={alt}
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.02]"
            loading="eager"
            fetchPriority="high"
            onLoad={() => setLoadedImages(prev => new Set([...prev, selectedImage]))}
            onError={(e) => {
              console.log('Görsel yüklenemedi:', validImages[selectedImage])
              setInvalidImageIndices(prev => new Set([...prev, selectedImage]))
              e.currentTarget.style.display = 'none'
            }}
          />
        </div>
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none"></div>
      </div>

      {/* Thumbnail Images - Modern Grid */}
      {validImages.length > 1 && (
        <div className="grid grid-cols-6 gap-3 max-w-6xl mx-auto">
          {validImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`group relative bg-white rounded-xl overflow-hidden transition-all duration-300 border-2 ${
                selectedImage === index 
                  ? 'ring-4 ring-blue-500 shadow-xl scale-105 border-blue-400' 
                  : 'border-slate-200 hover:border-blue-300 hover:shadow-lg hover:scale-105'
              }`}
            >
              <div className="aspect-[4/3] w-full h-24 relative">
                <img
                  src={image}
                  alt={`${alt} ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  loading="lazy"
                  onLoad={() => setLoadedImages(prev => new Set([...prev, index]))}
                  onError={(e) => {
                    console.log('Thumbnail yüklenemedi:', image)
                    setInvalidImageIndices(prev => new Set([...prev, index]))
                    e.currentTarget.style.display = 'none'
                  }}
                />
              </div>
              {/* Selected indicator */}
              {selectedImage === index && (
                <div className="absolute inset-0 bg-blue-500/10 pointer-events-none"></div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}