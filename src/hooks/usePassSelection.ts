import { useMemo, useState } from 'react'

import type { FodiumEvent, PassKind, PickupPoint } from '@/data/types'
import {
  computePrice,
  isSelectionComplete,
  MAX_TICKETS_PER_ORDER,
  type PassSelection,
  type PriceBreakdown,
} from '@/lib/pricing'

export interface PassSelectionState {
  selection: PassSelection
  breakdown: PriceBreakdown
  pickupPoint: PickupPoint | null
  isComplete: boolean
  canAddTicket: boolean
  canRemoveTicket: boolean
  choosePass: (kind: PassKind) => void
  choosePickupPoint: (id: string) => void
  addTicket: () => void
  removeTicket: () => void
}

/**
 * État du pass combiné. La navette est proposée par défaut quand elle existe :
 * c'est l'offre que le service met en avant, et l'utilisateur peut toujours
 * retomber sur le billet seul en un geste.
 */
export function usePassSelection(event: FodiumEvent): PassSelectionState {
  const [kind, setKind] = useState<PassKind>(event.shuttle ? 'shuttle' : 'solo')
  const [pickupPointId, setPickupPointId] = useState<string | null>(
    event.shuttle?.pickupPoints[0]?.id ?? null,
  )
  const [quantity, setQuantity] = useState(1)

  const selection = useMemo<PassSelection>(
    () => ({ kind, pickupPointId, quantity }),
    [kind, pickupPointId, quantity],
  )

  const breakdown = useMemo(() => computePrice(event, selection), [event, selection])

  const pickupPoint =
    event.shuttle?.pickupPoints.find((point) => point.id === pickupPointId) ?? null

  return {
    selection,
    breakdown,
    pickupPoint: kind === 'shuttle' ? pickupPoint : null,
    isComplete: isSelectionComplete(selection),
    canAddTicket: quantity < MAX_TICKETS_PER_ORDER,
    canRemoveTicket: quantity > 1,
    choosePass: (next) => setKind(event.shuttle ? next : 'solo'),
    choosePickupPoint: setPickupPointId,
    addTicket: () => setQuantity((value) => Math.min(value + 1, MAX_TICKETS_PER_ORDER)),
    removeTicket: () => setQuantity((value) => Math.max(value - 1, 1)),
  }
}
