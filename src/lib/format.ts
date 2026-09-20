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
