import type { IssuedTicket } from '@/lib/ticketStore'

/**
 * Historique de démonstration. Les billets réellement achetés dans la session
 * viennent s'ajouter devant, via le coffre `ticketStore`.
 *
 * Le coffre couvre volontairement les deux formules — entrée seule et pass
 * combiné avec navette — pour que « Mes billets » montre les deux souches.
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
    reference: 'FOD-27845',
    eventSlug: 'pool-brunch-all-white',
    kind: 'shuttle',
    pickupPointId: 'plateau',
    quantity: 2,
    total: 61200,
    methodId: 'wave',
    issuedAt: '2026-09-15T09:05:00+00:00',
  },
  {
    reference: 'FOD-63190',
    eventSlug: 'nuit-du-jazz',
    kind: 'solo',
    pickupPointId: null,
    quantity: 1,
    total: 15300,
    methodId: 'wave',
    issuedAt: '2026-09-18T20:11:00+00:00',
  },
  {
    reference: 'FOD-58471',
    eventSlug: 'festival-plage-popenguine',
    kind: 'shuttle',
    pickupPointId: 'almadies',
    quantity: 1,
    total: 14400,
    methodId: 'free-money',
    issuedAt: '2026-09-19T14:32:00+00:00',
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
