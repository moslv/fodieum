import { Bus, ChevronRight, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'

import { EventPoster } from '@/components/features/EventPoster'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/cn'
import { formatEventTime, formatPrice, formatShortDate } from '@/lib/format'
import { barcodePattern } from '@/lib/ticket'
import type { ResolvedTicket } from '@/lib/ticketView'

interface TicketListCardProps {
  resolved: ResolvedTicket
}

/**
 * Billet en liste : souche perforée à gauche, affiche lavée à droite.
 * La souche porte le code-barres en vertical, comme sur un vrai coupon
 * détachable.
 */
export function TicketListCard({ resolved }: TicketListCardProps) {
  const { ticket, event, pickupPoint, isPast } = resolved
  const bars = barcodePattern(ticket.reference, 22)

  return (
    <Link
      to={`/mes-billets/${ticket.reference}`}
      className={cn(
        'group flex overflow-hidden rounded-card border border-white/70 bg-white/85 shadow-glass backdrop-blur-md',
        'transition-all hover:-translate-y-0.5 hover:shadow-lg',
        isPast && 'opacity-70 grayscale',
      )}
    >
      <div className="flex w-[84px] shrink-0 flex-col items-center justify-center gap-2 border-r-2 border-dashed border-black/10 bg-surface-container-lowest px-2 py-4">
        <span className="text-center font-mono text-[9px] uppercase leading-tight tracking-[0.15em] text-outline">
          {isPast ? 'Archive' : 'Billet'}
          <br />
          <span className="text-primary">Fodium</span>
        </span>

        <span aria-hidden className="flex h-10 w-full items-center justify-center gap-[2px]">
          {bars.map((width, index) => (
            // Les barres n'ont pas d'identité propre : leur position est leur clé.
            <span key={index} style={{ width: `${width}px` }} className="h-full bg-on-surface" />
          ))}
        </span>

        <span className="font-mono text-[9px] tracking-wider text-outline">
          #{ticket.reference.replace('FOD-', '')}
        </span>
      </div>

      <div className="relative min-w-0 flex-1">
        <span aria-hidden className="absolute inset-0">
          <EventPoster event={event} />
        </span>
        <span aria-hidden className="absolute inset-0 bg-white/90 backdrop-blur-[2px]" />

        <div className="relative flex h-full flex-col gap-1.5 p-3.5">
          <div className="flex items-start justify-between gap-2">
            {pickupPoint ? (
              <Badge tone="primary" icon={Bus} className="min-w-0">
                <span className="truncate">Billet + Navette</span>
              </Badge>
            ) : (
              <Badge tone="neutral" className="min-w-0">
                <span className="truncate">Entrée seule</span>
              </Badge>
            )}
            <Badge tone={isPast ? 'neutral' : 'success'} className="shrink-0">
              {isPast ? 'Expiré' : 'Actif'}
            </Badge>
          </div>

          <p className="truncate text-headline-sm uppercase text-on-surface">{event.title}</p>

          <p className="flex min-w-0 items-center gap-1.5 text-label-md text-secondary">
            <MapPin aria-hidden className="h-3.5 w-3.5 shrink-0 text-primary" />
            <span className="truncate">
              {event.venue}, {event.city}
            </span>
          </p>

          <div className="mt-auto flex items-end justify-between gap-2 border-t border-black/5 pt-2">
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-wider text-outline">Date & heure</p>
              <p className="truncate text-label-md text-on-surface">
                {formatShortDate(event.startsAt)} · {formatEventTime(event.startsAt)}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              <span className="text-label-lg text-primary">{formatPrice(ticket.total)}</span>
              <ChevronRight
                aria-hidden
                className="h-4 w-4 text-outline transition-transform group-hover:translate-x-0.5"
              />
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
