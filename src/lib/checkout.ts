import type { FodiumEvent } from '@/data/types'
import { MAX_TICKETS_PER_ORDER, type PassSelection } from '@/lib/pricing'

/**
 * Le panier voyage dans l'état de navigation plutôt que dans l'URL : il n'a
 * pas à être partageable, et une URL falsifiée ne doit pas pouvoir fabriquer
 * une commande. Ce qui arrive ici est donc revalidé contre l'événement.
 */
export function readCheckoutSelection(state: unknown, event: FodiumEvent): PassSelection {
  const fallback: PassSelection = {
    kind: event.shuttle ? 'shuttle' : 'solo',
    pickupPointId: event.shuttle?.pickupPoints[0]?.id ?? null,
    quantity: 1,
  }

  if (typeof state !== 'object' || state === null) return fallback

  const { kind, pickupPointId, quantity } = state as Partial<PassSelection>

  const safeKind = kind === 'shuttle' && event.shuttle ? 'shuttle' : 'solo'
  const safeQuantity =
    typeof quantity === 'number' && Number.isInteger(quantity)
      ? Math.min(Math.max(quantity, 1), MAX_TICKETS_PER_ORDER)
      : 1

  const knownPickup = event.shuttle?.pickupPoints.some((point) => point.id === pickupPointId)

  return {
    kind: safeKind,
    pickupPointId: safeKind === 'shuttle' && knownPickup ? (pickupPointId ?? null) : fallback.pickupPointId,
    quantity: safeQuantity,
  }
}
