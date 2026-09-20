import { useSyncExternalStore } from 'react'

import { getIssuedTickets, type IssuedTicket, subscribeToTickets } from '@/lib/ticketStore'

export function useIssuedTickets(): IssuedTicket[] {
  return useSyncExternalStore(subscribeToTickets, getIssuedTickets, getIssuedTickets)
}
