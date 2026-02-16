'use client'

import Image from 'next/image'
import SectionWrapper from '@/components/ui/SectionWrapper'

const galleryImages = [
  {
    src: 'https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=600&q=80',
    alt: 'Elegant white roses',
  },
  {
    src: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=600&q=80',
    alt: 'Pink peony arrangement',
  },
  {
    src: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&q=80',
    alt: 'Garden roses',
  },
  {
    src: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=600&q=80',
    alt: 'Spring bouquet',
  },
  {
    src: 'https://images.unsplash.com/photo-1494972308805-463bc619d34e?w=600&q=80',
    alt: 'Blush florals',
  },
  {
    src: 'https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?w=600&q=80',
    alt: 'Garden arrangement',
  },
]

export default function InstagramGallery() {
  return (
    <SectionWrapper background="champagne">
      <div className="text-center mb-12">
        <p className="luxury-subheading mb-4">Follow Our Journey</p>
        <h2 className="font-serif text-3xl md:text-4xl text-charcoal mb-4">
          @houseofgul
        </h2>
        <div className="luxury-divider" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-4">
        {galleryImages.map((image, index) => (
          <a
            key={index}
            href="#"
            className="relative aspect-square overflow-hidden group"
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/30 transition-colors duration-300 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-ivory opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </div>
          </a>
        ))}
      </div>
    </SectionWrapper>
  )
}
