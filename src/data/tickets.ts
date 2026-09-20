import type { IssuedTicket } from '@/lib/ticketStore'

/**
 * Historique de démonstration. Les billets réellement achetés dans la session
 * viennent s'ajouter devant, via le coffre `ticketStore`.
 */
export const demoTickets: IssuedTicket[] = [
  {
    reference: 'FOD-44102',
    eventSlug: 'senegal-fashion-week',
    kind: 'solo',
    pickupPointId: null,
    quantity: 2,
    total: 10200,
    methodId: 'orange-money',
    issuedAt: '2026-09-12T10:24:00+00:00',
  },
  {
    reference: 'FOD-10928',
    eventSlug: 'dakar-jazz-festival',
    kind: 'solo',
    pickupPointId: null,
    quantity: 1,
    total: 12000,
    methodId: 'wave',
    issuedAt: '2026-05-02T18:40:00+00:00',
  },
]
