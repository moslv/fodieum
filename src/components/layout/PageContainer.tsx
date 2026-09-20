import type { ReactNode } from 'react'

import { cn } from '@/lib/cn'

interface PageContainerProps {
  children: ReactNode
  className?: string
}

/**
 * Gouttière commune à toutes les pages : la colonne mobile reste centrée
 * jusqu'au point de bascule desktop, où elle s'élargit.
 */
export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <div className={cn('mx-auto w-full max-w-lg px-4 lg:max-w-7xl lg:px-8', className)}>
      {children}
    </div>
  )
}
