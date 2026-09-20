import { EventCard } from '@/components/features/EventCard'
import type { FodiumEvent } from '@/data/types'
import { formatDateBadge } from '@/lib/format'

interface EventTimelineItemProps {
  event: FodiumEvent
  /** Le dernier élément n'affiche pas le trait de liaison. */
  isLast?: boolean
}

/**
 * Entrée de la frise « À venir » du mobile : le marqueur de date tient la
 * colonne de gauche et relie les cartes entre elles.
 */
export function EventTimelineItem({ event, isLast = false }: EventTimelineItemProps) {
  const { weekday, day, month } = formatDateBadge(event.startsAt)

  return (
    <li className="flex items-stretch gap-3.5">
      <div className="flex w-12 shrink-0 flex-col items-center pt-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-secondary">
          {weekday}
        </span>
        <span className="text-[24px] font-extrabold leading-tight text-on-surface">{day}</span>
        <span className="text-[10px] font-extrabold tracking-wider text-primary">{month}</span>
        {isLast ? null : (
          <span
            aria-hidden
            className="my-2 w-[2px] flex-1 rounded-full bg-gradient-to-b from-primary/30 to-black/5 lg:hidden"
          />
        )}
      </div>

      <EventCard event={event} showDate={false} className="min-w-0 flex-1" />
    </li>
  )
}
