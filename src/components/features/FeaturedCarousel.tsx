import { useRef } from 'react'

import { EventCard } from '@/components/features/EventCard'
import type { FodiumEvent } from '@/data/types'
import { useAutoAdvance } from '@/hooks/useAutoAdvance'
import { useCarouselIndex } from '@/hooks/useCarouselIndex'
import { cn } from '@/lib/cn'

/** Temps de lecture d'une carte avant que le carrousel passe à la suivante. */
const ADVANCE_INTERVAL = 5000

interface FeaturedCarouselProps {
  events: FodiumEvent[]
}

/**
 * « À la une » : carrousel à accrochage sur mobile, grille sur desktop —
 * faire défiler horizontalement deux cartes sur un écran large n'aurait
 * aucun intérêt.
 *
 * Les cartes ne prennent pas toute la largeur du téléphone : la suivante
 * dépasse d'un tiers, ce qui annonce le défilement sans pastille à lire.
 * Le carrousel avance seul, et se tait dès qu'on y met la main.
 */
export function FeaturedCarousel({ events }: FeaturedCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const activeIndex = useCarouselIndex(trackRef)
  const scrollTo = useAutoAdvance({
    ref: trackRef,
    count: events.length,
    index: activeIndex,
    interval: ADVANCE_INTERVAL,
  })

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-headline-md text-on-surface lg:text-headline-lg">
          À la une
          <span aria-hidden className="h-2 w-2 rounded-full bg-primary" />
        </h2>

        <div className="flex items-center gap-1.5 lg:hidden">
          {events.map((event, index) => (
            <button
              key={event.id}
              type="button"
              aria-label={`Aller à « ${event.title} »`}
              aria-current={index === activeIndex}
              onClick={() => scrollTo(index)}
              className={cn(
                'h-2 rounded-full transition-all duration-300',
                index === activeIndex ? 'w-6 bg-primary' : 'w-2 bg-outline-variant/60',
              )}
            />
          ))}
        </div>
      </div>

      <div
        ref={trackRef}
        className={cn(
          '-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 pt-1 no-scrollbar',
          'lg:mx-0 lg:grid lg:grid-cols-2 lg:gap-6 lg:overflow-visible lg:px-0',
        )}
      >
        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            className="w-[72vw] max-w-[286px] shrink-0 snap-start lg:w-auto lg:max-w-none"
          />
        ))}
      </div>
    </section>
  )
}
