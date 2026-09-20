import type { PassKind } from '@/data/types'

export interface IssuedTicket {
  reference: string
  eventSlug: string
  kind: PassKind
  pickupPointId: string | null
  quantity: number
  total: number
  methodId: string
  /** Date d'émission, ISO 8601. */
  issuedAt: string
}

const STORAGE_KEY = 'fodium.tickets'

/**
 * Coffre à billets. Sans backend, les achats de la session sont conservés dans
 * `localStorage` pour que « Mes billets » reflète réellement ce qu'on vient de
 * payer, au lieu d'afficher une liste figée.
 *
 * Exposé via `useSyncExternalStore` : la page se réabonne à l'état du module
 * sans qu'un contexte React ait à envelopper toute l'application.
 */
let tickets: IssuedTicket[] = restore()
const listeners = new Set<() => void>()

function restore(): IssuedTicket[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as IssuedTicket[]) : []
  } catch {
    // Navigation privée, stockage bloqué : on démarre simplement à vide.
    return []
  }
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets))
  } catch {
    // L'absence de stockage ne doit pas casser l'achat en cours.
  }
}

export function subscribeToTickets(listener: () => void): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

/** Référence stable : `useSyncExternalStore` compare par identité. */
export function getIssuedTickets(): IssuedTicket[] {
  return tickets
}

export function issueTicket(ticket: IssuedTicket) {
  if (tickets.some((existing) => existing.reference === ticket.reference)) return

  tickets = [ticket, ...tickets]
  persist()
  listeners.forEach((listener) => listener())
}
