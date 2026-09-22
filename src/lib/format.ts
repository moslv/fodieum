/**
 * Le Sénégal est à GMT+0 toute l'année : forcer le fuseau garde l'affichage
 * identique à celui des maquettes quel que soit le fuseau du navigateur.
 */
const TIME_ZONE = 'UTC'
const LOCALE = 'fr-FR'

const priceFormatter = new Intl.NumberFormat(LOCALE, { maximumFractionDigits: 0 })

const longDateFormatter = new Intl.DateTimeFormat(LOCALE, {
  weekday: 'short',
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  timeZone: TIME_ZONE,
})

const timeFormatter = new Intl.DateTimeFormat(LOCALE, {
  hour: '2-digit',
  minute: '2-digit',
  timeZone: TIME_ZONE,
})

const badgeFormatter = new Intl.DateTimeFormat(LOCALE, {
  weekday: 'short',
  day: '2-digit',
  month: 'short',
  timeZone: TIME_ZONE,
})

/** `30600` → `« 30 600 XOF »`. */
export function formatPrice(amount: number): string {
  return `${priceFormatter.format(amount)} XOF`
}

/** `30600` → `« 30 600 »`, pour les compositions où l'unité est déjà posée. */
export function formatAmount(amount: number): string {
  return priceFormatter.format(amount)
}

/** `'2026-10-10T11:00:00+00:00'` → `« sam. 10 oct. 2026 »`. */
export function formatEventDate(iso: string): string {
  return longDateFormatter.format(new Date(iso))
}

/** `'2026-10-10T11:00:00+00:00'` → `« 11:00 »`. */
export function formatEventTime(iso: string): string {
  return timeFormatter.format(new Date(iso))
}

const shortDateFormatter = new Intl.DateTimeFormat(LOCALE, {
  day: '2-digit',
  month: 'short',
  timeZone: TIME_ZONE,
})

/** `« 10 oct. »` — pour les cartes étroites, où l'année déborde. */
export function formatShortDate(iso: string): string {
  return shortDateFormatter.format(new Date(iso))
}

const ticketDateFormatter = new Intl.DateTimeFormat('fr-CA', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  timeZone: TIME_ZONE,
})

/**
 * `« 03.10.2026 »` — la date telle qu'une billetterie l'imprime : numérique,
 * de largeur fixe, elle ne déborde jamais de sa colonne.
 */
export function formatTicketDate(iso: string): string {
  const [year, month, day] = ticketDateFormatter.format(new Date(iso)).split('-')
  return `${day}.${month}.${year}`
}

const DAY_MS = 24 * 60 * 60 * 1000

/** Nombre de jours calendaires qui séparent `now` de `iso`, dans le fuseau du site. */
function daysUntil(iso: string, now: Date): number {
  const target = new Date(iso)
  const startOfTarget = Date.UTC(target.getUTCFullYear(), target.getUTCMonth(), target.getUTCDate())
  const startOfToday = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())

  return Math.round((startOfTarget - startOfToday) / DAY_MS)
}

/**
 * `« Demain »`, `« Dans 12 jours »`, `« Dans 2 mois »` : le délai avant une
 * séance, compté en jours entiers. Sur un billet, « dans 12 jours » se lit
 * plus vite qu'une date à rapprocher mentalement d'aujourd'hui.
 */
export function formatCountdown(iso: string, now = new Date()): string {
  const days = daysUntil(iso, now)

  if (days <= 0) return "Aujourd'hui"
  if (days === 1) return 'Demain'
  if (days < 31) return `Dans ${days} jours`

  const months = Math.round(days / 30)
  return months <= 1 ? 'Dans un mois' : `Dans ${months} mois`
}

export interface DateBadgeParts {
  weekday: string
  day: string
  month: string
}

/**
 * Découpe une date pour le marqueur vertical de la frise « À venir » :
 * `{ weekday: 'SAM', day: '10', month: 'OCT' }`.
 */
export function formatDateBadge(iso: string): DateBadgeParts {
  const parts = badgeFormatter.formatToParts(new Date(iso))
  const read = (type: Intl.DateTimeFormatPartTypes) =>
    (parts.find((part) => part.type === type)?.value ?? '').replace('.', '').toUpperCase()

  return { weekday: read('weekday'), day: read('day'), month: read('month') }
}
