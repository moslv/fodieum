export type EventCategory = 'festival' | 'concert' | 'soiree' | 'mode' | 'humour'

/** Deux largeurs servies via `srcSet` : carte de liste, puis bandeau de détail. */
export interface Poster {
  small: string
  large: string
  alt: string
}

export interface Organizer {
  name: string
  verified: boolean
  eventCount: number
}

export interface PickupPoint {
  id: string
  /** Quartier ou ville de ramassage, tel qu'affiché sur les chips. */
  name: string
  /** Heure de départ vers l'événement, format 24 h. */
  departureTime: string
  /** Heure de départ du retour, depuis le lieu de l'événement. */
  returnTime: string
  seatsLeft: number
}

export interface ShuttleOffer {
  operator: string
  /** Supplément en XOF ajouté au prix du billet. */
  supplement: number
  pickupPoints: PickupPoint[]
}

export interface FodiumEvent {
  id: string
  slug: string
  title: string
  /** Accroche courte affichée au-dessus du titre sur la page détail. */
  tagline: string
  category: EventCategory
  /** Date et heure de début, ISO 8601 avec fuseau. */
  startsAt: string
  venue: string
  city: string
  description: string
  tags: string[]
  /** Prix du billet seul en XOF, frais de service inclus. */
  basePrice: number
  /** `null` quand aucun visuel n'est disponible : un poster typographique est généré. */
  poster: Poster | null
  organizer: Organizer
  /** `null` quand l'événement n'est pas desservi par une navette Fodium. */
  shuttle: ShuttleOffer | null
  featured: boolean
  seatsLeft: number
}

export type PassKind = 'solo' | 'shuttle'
