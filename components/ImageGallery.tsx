'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface ImageGalleryProps {
  images: string[]
  alt: string
}

export default function ImageGallery({ images, alt }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set())
  const [invalidImageIndices, setInvalidImageIndices] = useState<Set<number>>(new Set())
  const [checkedImages, setCheckedImages] = useState<Set<number>>(new Set())

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

  // Resim dosyasının mevcut olup olmadığını kontrol et
  const checkImageExists = async (imagePath: string): Promise<boolean> => {
    try {
      const response = await fetch(imagePath, { method: 'HEAD' })
      return response.ok
    } catch {
      return false
    }
  }

  // Resimleri önceden kontrol et
  useEffect(() => {
    const checkImages = async () => {
      const promises = validImages.map(async (image, index) => {
        if (!checkedImages.has(index)) {
          const exists = await checkImageExists(image)
          if (!exists) {
            setInvalidImageIndices(prev => new Set([...prev, index]))
          }
          setCheckedImages(prev => new Set([...prev, index]))
        }
      })
      await Promise.all(promises)
    }
    
    if (validImages.length > 0) {
      checkImages()
    }
  }, [validImages.length])

  // Resim yükleme hatası durumunda daha hızlı filtreleme
  const handleImageError = (index: number, imagePath: string) => {
    // Console log yerine sadece hata indeksini kaydet - 404 hataları gereksiz yere tekrarlanmasın
    if (!invalidImageIndices.has(index)) {
      setInvalidImageIndices(prev => new Set([...prev, index]))
      
      // Eğer ana görsel hatalıysa ve başka görseller varsa, ilk geçerli görsele geç
      if (index === selectedImage && validImages.length > 1) {
        const nextValidIndex = validImages.findIndex((_, i) => !invalidImageIndices.has(i) && i !== index)
        if (nextValidIndex !== -1) {
          setSelectedImage(nextValidIndex)
        }
      }
    }
  }

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
          <Image
            src={validImages[selectedImage]}
            alt={alt}
            fill
            className="object-cover transition-transform duration-700 hover:scale-[1.02]"
            priority={true}
            quality={90}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
            onLoad={() => setLoadedImages(prev => new Set([...prev, selectedImage]))}
            onError={() => {
              handleImageError(selectedImage, validImages[selectedImage])
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
                <Image
                  src={image}
                  alt={`${alt} ${index + 1}`}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                  loading="lazy"
                  quality={75}
                  sizes="(max-width: 768px) 20vw, 15vw"
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                  onLoad={() => setLoadedImages(prev => new Set([...prev, index]))}
                  onError={() => {
                    handleImageError(index, image)
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