import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface SectionWrapperProps {
  children: ReactNode
  className?: string
  background?: 'ivory' | 'champagne' | 'white' | 'cream'
  padding?: 'sm' | 'md' | 'lg' | 'xl'
}

export default function SectionWrapper({
  children,
  className,
  background = 'ivory',
  padding = 'lg',
}: SectionWrapperProps) {
  const backgrounds = {
    ivory: 'bg-ivory',
    champagne: 'bg-champagne',
    white: 'bg-white',
    cream: 'bg-cream',
  }

  const paddings = {
    sm: 'py-8 md:py-12',
    md: 'py-12 md:py-16',
    lg: 'py-16 md:py-24',
    xl: 'py-24 md:py-32',
  }

  return (
    <section className={cn(backgrounds[background], paddings[padding], className)}>
      <div className="luxury-container">{children}</div>
    </section>
  )
}
