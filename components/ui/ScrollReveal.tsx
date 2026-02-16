'use client'

import { ReactNode, useEffect, useRef, useState } from 'react'

type AnimationType = 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'fade' | 'zoom'

interface ScrollRevealProps {
  children: ReactNode
  animation?: AnimationType
  delay?: number
  duration?: number
  className?: string
}

export default function ScrollReveal({
  children,
  animation = 'fade-up',
  delay = 0,
  duration = 800,
  className = '',
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(element)
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [])

  const getInitialTransform = () => {
    switch (animation) {
      case 'fade-up': return 'translateY(80px)'
      case 'fade-down': return 'translateY(-80px)'
      case 'fade-left': return 'translateX(80px)'
      case 'fade-right': return 'translateX(-80px)'
      case 'zoom': return 'scale(0.8)'
      default: return 'none'
    }
  }

  const style: React.CSSProperties = {
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0) translateX(0) scale(1)' : getInitialTransform(),
    transition: `opacity ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
  }

  return (
    <div ref={ref} style={style} className={className}>
      {children}
    </div>
  )
}
