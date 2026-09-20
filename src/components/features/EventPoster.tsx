import { Logo } from '@/components/layout/Logo'
import type { EventCategory, FodiumEvent } from '@/data/types'
import { cn } from '@/lib/cn'

/** Dégradés du poster de repli, un par famille d'événement. */
const fallbackGradients: Record<EventCategory, string> = {
  festival: 'from-[#0f766e] via-[#115e59] to-[#042f2e]',
  concert: 'from-[#4c1d95] via-[#3b0764] to-[#1e1b4b]',
  soiree: 'from-[#c2410c] via-[#9a3412] to-[#431407]',
  mode: 'from-[#334155] via-[#1e293b] to-[#020617]',
  humour: 'from-[#b45309] via-[#92400e] to-[#451a03]',
}

interface EventPosterProps {
  event: FodiumEvent
  /** `card` sert la version 640 px, `hero` la version 1280 px. */
  size?: 'card' | 'hero'
  className?: string
}

/**
 * Visuel d'un événement. Les fiches sans poster photographique reçoivent une
 * affiche typographique générée depuis leurs propres données, plutôt qu'un
 * cadre vide ou une image réutilisée d'un autre événement.
 */
export function EventPoster({ event, size = 'card', className }: EventPosterProps) {
  const { poster, title, tagline, category } = event

  if (!poster) {
    return (
      <div
        className={cn(
          'relative flex h-full w-full flex-col justify-end overflow-hidden bg-gradient-to-br p-4',
          fallbackGradients[category],
          className,
        )}
      >
        <span aria-hidden className="absolute right-3 top-3 opacity-30 mix-blend-luminosity">
          <Logo variant="mark" className="h-7 w-7" />
        </span>
        <span className="text-label-sm uppercase tracking-[0.18em] text-white/70">{tagline}</span>
        <span
          className={cn(
            'mt-1 font-extrabold uppercase leading-[0.95] tracking-tight text-white',
            size === 'hero' ? 'text-3xl sm:text-4xl' : 'text-xl',
          )}
        >
          {title}
        </span>
      </div>
    )
  }

  return (
    <img
      alt={poster.alt}
      src={size === 'hero' ? poster.large : poster.small}
      srcSet={`${poster.small} 640w, ${poster.large} 1280w`}
      sizes={size === 'hero' ? '(min-width: 1024px) 60vw, 100vw' : '(min-width: 1024px) 33vw, 88vw'}
      loading="lazy"
      decoding="async"
      className={cn('h-full w-full object-cover', className)}
    />
  )
}
