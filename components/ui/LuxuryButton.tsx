'use client'

import { cn } from '@/lib/utils'
import { ButtonHTMLAttributes, ReactNode } from 'react'

interface LuxuryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'gold' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
}

export default function LuxuryButton({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: LuxuryButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center tracking-widest uppercase transition-all duration-300 font-light'

  const variants = {
    primary: 'bg-charcoal text-ivory hover:bg-gold border border-charcoal',
    secondary:
      'bg-transparent text-charcoal border border-charcoal hover:bg-charcoal hover:text-ivory',
    gold: 'bg-gold text-white hover:bg-gold-dark border border-gold',
    ghost: 'bg-transparent text-charcoal hover:text-gold',
  }

  const sizes = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-sm',
  }

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  )
}
