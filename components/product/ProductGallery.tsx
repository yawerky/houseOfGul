'use client'

import { useState } from 'react'
import Image from 'next/image'

interface ProductGalleryProps {
  images: string[]
  name: string
}

export default function ProductGallery({ images, name }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0)

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-[4/5] overflow-hidden bg-champagne rounded-sm">
        <Image
          src={images[selectedImage]}
          alt={name}
          fill
          priority
          className="object-cover transition-opacity duration-500"
        />
      </div>

      {/* Thumbnail Grid */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2 md:gap-4">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`relative aspect-square overflow-hidden rounded-sm transition-all duration-300 ${
                selectedImage === index
                  ? 'ring-2 ring-gold'
                  : 'ring-1 ring-blush-dark/20 hover:ring-gold/50'
              }`}
            >
              <Image
                src={image}
                alt={`${name} view ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
