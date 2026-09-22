import { PosterArtwork } from '@/components/features/PosterArtwork'
import type { FodiumEvent } from '@/data/types'
import { cn } from '@/lib/cn'

interface EventPosterProps {
  event: FodiumEvent
  /**
   * `thumb` pour les talons de billets, `card` pour les listes (640 px),
   * `hero` pour les bandeaux (1280 px).
   */
  size?: 'thumb' | 'card' | 'hero'
  className?: string
}

/**
 * Visuel d'un événement : la photo quand la fiche en a une, sinon une affiche
 * composée depuis ses propres données — jamais de cadre vide ni de visuel
 * emprunté à un autre événement. Voir `PosterArtwork`.
 */
export function EventPoster({ event, size = 'card', className }: EventPosterProps) {
  const { poster } = event

  if (!poster) {
    return <PosterArtwork event={event} size={size} className={className} />
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
