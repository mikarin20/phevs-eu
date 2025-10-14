'use client'

import { useState } from 'react'
import Image from 'next/image'

interface ImageGalleryProps {
  images: string[]
  alt: string
}

export default function ImageGallery({ images, alt }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0)

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg overflow-hidden">
        <Image
          src={images[selectedImage]}
          alt={alt}
          width={800}
          height={600}
          className="w-full h-96 object-cover"
          onError={(e) => {
            e.currentTarget.src = '/images/placeholder-car.jpg'
          }}
        />
      </div>

      {/* Thumbnail Images */}
      <div className="grid grid-cols-5 gap-2">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg overflow-hidden transition-all ${
              selectedImage === index ? 'ring-2 ring-blue-500' : 'hover:ring-2 hover:ring-blue-300'
            }`}
          >
            <Image
              src={image}
              alt={`${alt} ${index + 1}`}
              width={200}
              height={150}
              className="w-full h-20 object-cover"
              onError={(e) => {
                e.currentTarget.src = '/images/placeholder-car.jpg'
              }}
            />
          </button>
        ))}
      </div>
    </div>
  )
}
