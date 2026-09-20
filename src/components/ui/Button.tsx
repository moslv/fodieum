import type { ButtonHTMLAttributes, ReactNode } from 'react'

import { cn } from '@/lib/cn'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'
type ButtonSize = 'md' | 'lg'

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-white shadow-lg shadow-primary/25 hover:brightness-105',
  secondary: 'bg-surface-container text-on-surface hover:bg-surface-container-high',
  ghost: 'border border-black/10 bg-white/80 text-on-surface hover:bg-white',
}

const sizes: Record<ButtonSize, string> = {
  md: 'px-5 py-2.5 text-label-md',
  lg: 'px-6 py-3.5 text-label-lg',
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full transition-all',
        'active:scale-95 disabled:pointer-events-none disabled:opacity-50',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
