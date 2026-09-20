import type { FodiumEvent, PassKind } from '@/data/types'

/** Plafond repris des maquettes : « Max. 4 par personne ». */
export const MAX_TICKETS_PER_ORDER = 4

export interface PassSelection {
  kind: PassKind
  /** Requis dès que `kind` vaut `'shuttle'`. */
  pickupPointId: string | null
  quantity: number
}

export interface PriceBreakdown {
  /** Prix d'une place, navette comprise le cas échéant. */
  unitPrice: number
  ticketsSubtotal: number
  shuttleSubtotal: number
  total: number
}

export function computePrice(event: FodiumEvent, selection: PassSelection): PriceBreakdown {
  const supplement = selection.kind === 'shuttle' ? (event.shuttle?.supplement ?? 0) : 0

  return {
    unitPrice: event.basePrice + supplement,
    ticketsSubtotal: event.basePrice * selection.quantity,
    shuttleSubtotal: supplement * selection.quantity,
    total: (event.basePrice + supplement) * selection.quantity,
  }
}

/**
 * Prix affiché dans les listes : le plus bas auquel on peut entrer,
 * navette exclue.
 */
export function entryPrice(event: FodiumEvent): number {
  return event.basePrice
}

/** Une commande navette n'est valide qu'avec un point de ramassage choisi. */
export function isSelectionComplete(selection: PassSelection): boolean {
  if (selection.quantity < 1 || selection.quantity > MAX_TICKETS_PER_ORDER) {
    return false
  }

  return selection.kind === 'solo' || selection.pickupPointId !== null
}
