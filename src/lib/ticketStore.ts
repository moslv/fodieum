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
const CANCELLED_KEY = 'fodium.cancelled'

/**
 * Coffre à billets. Sans backend, les achats de la session sont conservés dans
 * `localStorage` pour que « Mes billets » reflète réellement ce qu'on vient de
 * payer, au lieu d'afficher une liste figée.
 *
 * Exposé via `useSyncExternalStore` : la page se réabonne à l'état du module
 * sans qu'un contexte React ait à envelopper toute l'application.
 *
 * Les annulations sont retenues à part, par référence : un billet du catalogue
 * de démonstration n'est pas dans le coffre, et le retirer demande donc de se
 * souvenir de ce qu'on a rendu, pas seulement de ce qu'on a acheté.
 */
let tickets: IssuedTicket[] = restore(STORAGE_KEY)
let cancelled: string[] = restore(CANCELLED_KEY)
const listeners = new Set<() => void>()

function restore<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T[]) : []
  } catch {
    // Navigation privée, stockage bloqué : on démarre simplement à vide.
    return []
  }
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets))
    localStorage.setItem(CANCELLED_KEY, JSON.stringify(cancelled))
  } catch {
    // L'absence de stockage ne doit pas casser l'achat en cours.
  }
}

function notify() {
  listeners.forEach((listener) => listener())
}

export function subscribeToTickets(listener: () => void): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

/** Référence stable : `useSyncExternalStore` compare par identité. */
export function getIssuedTickets(): IssuedTicket[] {
  return tickets
}

/** Référence stable, même raison. */
export function getCancelledTickets(): string[] {
  return cancelled
}

export function issueTicket(ticket: IssuedTicket) {
  if (tickets.some((existing) => existing.reference === ticket.reference)) return

  tickets = [ticket, ...tickets]
  cancelled = cancelled.filter((reference) => reference !== ticket.reference)
  persist()
  notify()
}

/** Rend un billet : il quitte le coffre et ne réapparaît pas au rechargement. */
export function cancelTicket(reference: string) {
  if (cancelled.includes(reference)) return

  cancelled = [reference, ...cancelled]
  tickets = tickets.filter((ticket) => ticket.reference !== reference)
  persist()
  notify()
}
