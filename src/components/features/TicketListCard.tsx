import { Bus, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

import { TicketFrame } from '@/components/features/TicketFrame'
import { cn } from '@/lib/cn'
import { formatEventTime, formatPrice, formatShortDate } from '@/lib/format'
import type { ResolvedTicket } from '@/lib/ticketView'

interface TicketListCardProps {
  resolved: ResolvedTicket
}

/**
 * Le billet en liste : la silhouette de `TicketFrame`, dont le corps se
 * limite ici à ce qu'on lit en parcourant un coffre — statut, séance, prix.
 * Le détail des champs reste dans `TicketStub`, un écran plus loin.
 */
export function TicketListCard({ resolved }: TicketListCardProps) {
  const { ticket, event, pickupPoint, isPast } = resolved

  return (
    <Link
      to={`/mes-billets/${ticket.reference}`}
      className="group block transition-transform hover:-translate-y-0.5"
    >
      <TicketFrame
        event={event}
        serial={ticket.reference.replace('FOD-', '')}
        className={cn(isPast && 'opacity-65 saturate-50')}
      >
        <div className="flex min-w-0 flex-1 flex-col gap-2 px-4 py-3.5">
          <div className="flex items-center justify-between gap-2">
            <span className="flex min-w-0 items-center gap-1.5 font-mono text-stub-label uppercase text-outline">
              {pickupPoint ? <Bus aria-hidden className="h-3 w-3 shrink-0 text-primary" /> : null}
              <span className="truncate">{pickupPoint ? 'Billet + Navette' : 'Entrée seule'}</span>
            </span>
            <span
              className={cn(
                'shrink-0 rounded-[3px] px-1.5 py-0.5 font-mono text-stub-label uppercase',
                isPast ? 'bg-surface-container text-outline' : 'bg-tertiary/10 text-tertiary',
              )}
            >
              {isPast ? 'Utilisé' : 'Valide'}
            </span>
          </div>

          <div className="min-w-0">
            <p className="line-clamp-2 text-ticket-title uppercase text-on-surface">
              {event.title}
            </p>
            <p className="mt-1 truncate font-mono text-stub-label uppercase text-secondary">
              {event.venue} · {event.city}
            </p>
          </div>

          <div className="mt-auto flex items-end justify-between gap-3 border-t border-dashed border-black/15 pt-2.5">
            <div className="min-w-0">
              <p className="font-mono text-stub-label uppercase text-outline">Séance</p>
              <p className="mt-0.5 truncate font-mono text-stub-value text-on-surface">
                {formatShortDate(event.startsAt)} · {formatEventTime(event.startsAt)}
              </p>
            </div>
            <span className="flex shrink-0 items-center gap-1.5 font-mono text-stub-value text-primary">
              {formatPrice(ticket.total)}
              <ChevronRight
                aria-hidden
                className="h-4 w-4 text-outline transition-transform group-hover:translate-x-0.5"
              />
            </span>
          </div>
        </div>
      </TicketFrame>
    </Link>
  )
}
