import type { ButtonHTMLAttributes, ReactNode } from 'react'

import { cn } from '@/lib/cn'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost'
export type ButtonSize = 'md' | 'lg'

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-white shadow-md shadow-primary/20 hover:brightness-105',
  secondary: 'bg-surface-container text-on-surface hover:bg-surface-container-high',
  ghost:
    'border border-black/[0.08] bg-surface-container-lowest text-on-surface hover:bg-surface-container-low',
}

const sizes: Record<ButtonSize, string> = {
  md: 'px-5 py-2.5 text-label-md',
  lg: 'px-6 py-3.5 text-label-lg',
}

interface ButtonStyleProps {
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
}

/**
 * Habillage du bouton, exposé à part : un `<Link>` qui joue le rôle d'action
 * principale doit porter exactement la même allure qu'un `<button>`, sans
 * qu'on recopie la liste de classes à chaque fois.
 */
export function buttonClass({ variant = 'primary', size = 'md', className }: ButtonStyleProps = {}) {
  return cn(
    'inline-flex items-center justify-center gap-2 rounded-full transition-all',
    'active:scale-95 disabled:pointer-events-none disabled:opacity-50',
    variants[variant],
    sizes[size],
    className,
  )
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, ButtonStyleProps {
  children: ReactNode
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
    <button type={type} className={buttonClass({ variant, size, className })} {...props}>
      {children}
    </button>
  )
}
