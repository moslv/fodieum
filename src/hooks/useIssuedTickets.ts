import { useSyncExternalStore } from 'react'

import {
  getCancelledTickets,
  getIssuedTickets,
  type IssuedTicket,
  subscribeToTickets,
} from '@/lib/ticketStore'

export function useIssuedTickets(): IssuedTicket[] {
  return useSyncExternalStore(subscribeToTickets, getIssuedTickets, getIssuedTickets)
}

/** Les références rendues, à retirer aussi du catalogue de démonstration. */
export function useCancelledTickets(): string[] {
  return useSyncExternalStore(subscribeToTickets, getCancelledTickets, getCancelledTickets)
}
