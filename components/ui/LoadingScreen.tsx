'use client'

import { useEffect, useState } from 'react'

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  if (!isLoading) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-ivory transition-opacity duration-500">
      <div className="text-center">
        <h1 className="font-serif text-3xl md:text-4xl text-charcoal mb-2 tracking-wide">
          House of Gul
        </h1>
        <p className="text-charcoal-light text-sm tracking-widest uppercase">
          Where Every Bloom Speaks
        </p>
        <div className="mt-8 flex justify-center gap-1">
          <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
          <span className="w-2 h-2 rounded-full bg-gold animate-pulse [animation-delay:0.2s]" />
          <span className="w-2 h-2 rounded-full bg-gold animate-pulse [animation-delay:0.4s]" />
        </div>
      </div>
    </div>
  )
}
