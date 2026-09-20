import { findEventBySlug, isUpcoming } from '@/data/events'
import type { FodiumEvent, PickupPoint } from '@/data/types'
import type { IssuedTicket } from '@/lib/ticketStore'

export interface ResolvedTicket {
  ticket: IssuedTicket
  event: FodiumEvent
  pickupPoint: PickupPoint | null
  /** L'événement a déjà eu lieu : le billet bascule dans l'historique. */
  isPast: boolean
}

/** Relie un billet stocké à son événement ; ignore les références orphelines. */
export function resolveTicket(ticket: IssuedTicket, now = new Date()): ResolvedTicket | null {
  const event = findEventBySlug(ticket.eventSlug)
  if (!event) return null

  const pickupPoint =
    ticket.kind === 'shuttle'
      ? (event.shuttle?.pickupPoints.find((point) => point.id === ticket.pickupPointId) ?? null)
      : null

  return { ticket, event, pickupPoint, isPast: !isUpcoming(event, now) }
}

export function resolveTickets(tickets: IssuedTicket[], now = new Date()): ResolvedTicket[] {
  return tickets
    .map((ticket) => resolveTicket(ticket, now))
    .filter((resolved): resolved is ResolvedTicket => resolved !== null)
}

/** Les achats de la session priment sur l'historique de démonstration. */
export function mergeTickets(issued: IssuedTicket[], demo: IssuedTicket[]): IssuedTicket[] {
  const seen = new Set(issued.map((ticket) => ticket.reference))
  return [...issued, ...demo.filter((ticket) => !seen.has(ticket.reference))]
}
