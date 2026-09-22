import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

import { cn } from '@/lib/cn'

export type BadgeTone = 'primary' | 'shuttle' | 'success' | 'warning' | 'neutral' | 'dark'

const tones: Record<BadgeTone, string> = {
  primary: 'bg-primary text-on-primary',
  shuttle: 'bg-amber-500/10 border border-amber-500/20 text-[#854300]',
  success: 'bg-emerald-50 border border-emerald-200 text-emerald-700',
  warning: 'bg-amber-50 border border-amber-200 text-amber-800',
  neutral: 'bg-surface-container text-on-surface-variant',
  dark: 'bg-on-surface/85 text-surface backdrop-blur-sm',
}

interface BadgeProps {
  children: ReactNode
  tone?: BadgeTone
  icon?: LucideIcon
  className?: string
}

export function Badge({ children, tone = 'neutral', icon: Icon, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-label-sm',
        tones[tone],
        className,
      )}
    >
      {Icon ? <Icon aria-hidden className="h-3.5 w-3.5 shrink-0" /> : null}
      {children}
    </span>
  )
}
