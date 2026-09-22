import { Bus, CalendarDays, Clock, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'

import { EventPoster } from '@/components/features/EventPoster'
import { Badge } from '@/components/ui/Badge'
import type { FodiumEvent } from '@/data/types'
import { cn } from '@/lib/cn'
import { formatEventDate, formatEventTime, formatPrice } from '@/lib/format'

/** En dessous, on affiche l'alerte de rareté plutôt que le statut « En vente ». */
const LOW_STOCK_THRESHOLD = 30

interface EventCardProps {
  event: FodiumEvent
  /** `false` dans la frise « À venir », dont le marqueur porte déjà la date. */
  showDate?: boolean
  className?: string
}

export function EventCard({ event, showDate = true, className }: EventCardProps) {
  const isLowStock = event.seatsLeft <= LOW_STOCK_THRESHOLD

  return (
    <Link
      to={`/evenements/${event.slug}`}
      viewTransition
      className={cn(
        'group flex flex-col overflow-hidden rounded-card-lg border border-hairline bg-surface-container-lowest shadow-glass',
        'transition-all hover:-translate-y-0.5 hover:shadow-glass-lg active:scale-[0.99]',
        className,
      )}
    >
      <div
        className="relative aspect-[16/10] w-full overflow-hidden bg-surface-container"
        style={{ viewTransitionName: `poster-${event.id}` }}
      >
        <EventPoster
          event={event}
          className="transition-transform duration-500 group-hover:scale-105"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"
        />
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center justify-between gap-2">
          {event.shuttle ? (
            <Badge tone="shuttle" icon={Bus} className="min-w-0">
              <span className="truncate">Navette dispo</span>
            </Badge>
          ) : (
            <Badge tone="neutral" className="min-w-0">
              <span className="truncate">{event.tagline}</span>
            </Badge>
          )}
          <Badge tone={isLowStock ? 'warning' : 'success'} className="shrink-0">
            {isLowStock ? `${event.seatsLeft} places` : 'En vente'}
          </Badge>
        </div>

        <h3 className="text-headline-sm text-on-surface transition-colors group-hover:text-primary">
          {event.title}
        </h3>

        <div className="flex flex-col gap-1 text-label-md text-secondary">
          <span className="flex min-w-0 items-center gap-1.5">
            <MapPin aria-hidden className="h-3.5 w-3.5 shrink-0 text-primary" />
            <span className="truncate">
              {event.venue}, {event.city}
            </span>
          </span>
          <span className="flex min-w-0 items-center gap-1.5">
            {showDate ? (
              <CalendarDays aria-hidden className="h-3.5 w-3.5 shrink-0 text-secondary/80" />
            ) : (
              <Clock aria-hidden className="h-3.5 w-3.5 shrink-0 text-secondary/80" />
            )}
            <time dateTime={event.startsAt} className="truncate">
              {showDate
                ? `${formatEventDate(event.startsAt)} · ${formatEventTime(event.startsAt)}`
                : formatEventTime(event.startsAt)}
            </time>
          </span>
        </div>

        <div className="mt-auto flex items-baseline justify-between border-t border-hairline pt-2.5">
          <span className="text-body-sm text-secondary">À partir de</span>
          <span className="text-price text-primary">{formatPrice(event.basePrice)}</span>
        </div>
      </div>
    </Link>
  )
}
