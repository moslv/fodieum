import dakarJazzLarge from '@/assets/posters/poster-dakar-jazz-1280.webp'
import dakarJazzSmall from '@/assets/posters/poster-dakar-jazz-640.webp'
import fashionWeekLarge from '@/assets/posters/poster-fashion-week-dakar-1280.webp'
import fashionWeekSmall from '@/assets/posters/poster-fashion-week-dakar-640.webp'
import jazzLarge from '@/assets/posters/poster-jazz-night-1280.webp'
import jazzSmall from '@/assets/posters/poster-jazz-night-640.webp'
import poolBrunchLarge from '@/assets/posters/poster-pool-party-saly-1280.webp'
import poolBrunchSmall from '@/assets/posters/poster-pool-party-saly-640.webp'
import popenguineLarge from '@/assets/posters/poster-popenguine-1280.webp'
import popenguineSmall from '@/assets/posters/poster-popenguine-640.webp'
import saintLouisLarge from '@/assets/posters/poster-saint-louis-jazz-1280.webp'
import saintLouisSmall from '@/assets/posters/poster-saint-louis-jazz-640.webp'

import type { FodiumEvent } from './types'

/**
 * Catalogue de démonstration. Aucun backend : ces données sont la seule
 * source de l'interface, y compris les prix affichés et recalculés.
 */
export const events: FodiumEvent[] = [
  {
    id: 'evt-pool-brunch',
    slug: 'pool-brunch-all-white',
    title: 'Pool Brunch – All White',
    tagline: 'Vibes & Sunset',
    category: 'soiree',
    startsAt: '2026-10-10T11:00:00+00:00',
    venue: 'La Villa Resort',
    city: 'Saly, Mbour',
    description:
      "Vivez l'expérience ultime au bord de l'océan à Saly. Une journée festive alliant gastronomie raffinée, cocktails signature et les meilleurs sets Amapiano & Afro-house sous les palmiers. Tenue blanche exigée.",
    tags: ['Brunch', 'Piscine Lagoon', 'Amapiano & Afro-house'],
    basePrice: 25500,
    poster: {
      small: poolBrunchSmall,
      large: poolBrunchLarge,
      alt: 'Brunch au bord de la piscine du La Villa Resort à Saly, invités en tenue blanche',
    },
    organizer: { name: 'Sunset Lounge Presents', verified: true, eventCount: 14 },
    shuttle: {
      operator: 'Fodium Express',
      supplement: 5100,
      pickupPoints: [
        { id: 'plateau', name: 'Plateau', departureTime: '08:30', returnTime: '22:00', seatsLeft: 12 },
        { id: 'liberte-6', name: 'Liberté 6', departureTime: '08:45', returnTime: '22:00', seatsLeft: 8 },
        { id: 'keur-massar', name: 'Keur Massar', departureTime: '08:00', returnTime: '22:00', seatsLeft: 3 },
        { id: 'rufisque', name: 'Rufisque', departureTime: '09:15', returnTime: '22:00', seatsLeft: 17 },
      ],
    },
    featured: true,
    seatsLeft: 46,
  },
  {
    id: 'evt-fashion-week',
    slug: 'senegal-fashion-week',
    title: 'Cavalcante Senegal Fashion Week',
    tagline: 'Édition Prestige Dakar',
    category: 'mode',
    startsAt: '2026-10-03T15:00:00+00:00',
    venue: 'Magic Land',
    city: 'Dakar',
    description:
      "Trois podiums, vingt maisons, une renaissance du style sénégalais. La Fashion Week revient à Magic Land avec un showcase haute couture, une sélection avant-garde et un défilé de clôture ouvert au public.",
    tags: ['Haute couture', 'Avant-garde', 'Défilé'],
    basePrice: 5100,
    poster: {
      small: fashionWeekSmall,
      large: fashionWeekLarge,
      alt: 'Mannequin en tenue wax sur le podium de la Dakar Senegal Fashion Week',
    },
    organizer: { name: 'Cavalcante Studio', verified: true, eventCount: 6 },
    shuttle: null,
    featured: true,
    seatsLeft: 23,
  },
  {
    id: 'evt-nuit-du-jazz',
    slug: 'nuit-du-jazz',
    title: 'Nuit du Jazz',
    tagline: 'Carte blanche à l’Institut',
    category: 'concert',
    startsAt: '2026-10-16T20:30:00+00:00',
    venue: 'Institut français',
    city: 'Dakar',
    description:
      "Une nuit, trois formations, du hard bop aux fusions mandingues. La cour de l'Institut français se transforme en club à ciel ouvert jusqu'au bout de la nuit.",
    tags: ['Jazz', 'Live band', 'Plein air'],
    basePrice: 15300,
    poster: {
      small: jazzSmall,
      large: jazzLarge,
      alt: 'Musiciens de jazz sur scène dans une ambiance tamisée',
    },
    organizer: { name: 'Institut français de Dakar', verified: true, eventCount: 31 },
    shuttle: null,
    featured: false,
    seatsLeft: 88,
  },
  {
    id: 'evt-popenguine',
    slug: 'festival-plage-popenguine',
    title: 'Festival Plage de Popenguine',
    tagline: 'Coastal Cliffs Acoustic Stage',
    category: 'festival',
    startsAt: '2026-10-24T14:00:00+00:00',
    venue: 'Plage des falaises',
    city: 'Popenguine',
    description:
      "Deux scènes face à l'océan, entre falaises et sable. Programmation acoustique l'après-midi, sets électroniques au coucher du soleil, et retour en navette jusqu'à Dakar dans la nuit.",
    tags: ['Plage', 'Acoustique', 'Sunset'],
    basePrice: 10200,
    poster: {
      small: popenguineSmall,
      large: popenguineLarge,
      alt: "Foule dansant sur la plage face à l'océan au coucher du soleil",
    },
    organizer: { name: 'Popenguine Collective', verified: false, eventCount: 3 },
    shuttle: {
      operator: 'Fodium Express',
      supplement: 4200,
      pickupPoints: [
        { id: 'plateau', name: 'Plateau', departureTime: '11:30', returnTime: '23:30', seatsLeft: 21 },
        { id: 'almadies', name: 'Almadies', departureTime: '11:00', returnTime: '23:30', seatsLeft: 6 },
        { id: 'mbour', name: 'Mbour', departureTime: '12:45', returnTime: '23:00', seatsLeft: 14 },
      ],
    },
    featured: false,
    seatsLeft: 140,
  },
  {
    id: 'evt-saint-louis-jazz',
    slug: 'saint-louis-jazz-edition-speciale',
    title: 'Saint-Louis Jazz — Édition spéciale',
    tagline: 'Nuit sur le fleuve',
    category: 'festival',
    startsAt: '2026-11-14T19:00:00+00:00',
    venue: 'Quai Henry Jay',
    city: 'Saint-Louis',
    description:
      "Le plus ancien festival de jazz d'Afrique de l'Ouest ouvre une soirée hors saison sur les quais. Aller-retour depuis Dakar assuré dans la nuit — 260 km, sans avoir à conduire.",
    tags: ['Jazz', 'Interurbain', 'Nuit blanche'],
    basePrice: 18000,
    poster: {
      small: saintLouisSmall,
      large: saintLouisLarge,
      alt: 'Saxophoniste en concert, éclairé sur une scène sombre',
    },
    organizer: { name: 'Saint-Louis Jazz Association', verified: true, eventCount: 42 },
    shuttle: {
      operator: 'Fodium Express',
      supplement: 9500,
      pickupPoints: [
        { id: 'dakar-plateau', name: 'Dakar · Plateau', departureTime: '14:00', returnTime: '02:00', seatsLeft: 9 },
        { id: 'dakar-parcelles', name: 'Dakar · Parcelles', departureTime: '14:30', returnTime: '02:00', seatsLeft: 11 },
        { id: 'thies', name: 'Thiès', departureTime: '15:45', returnTime: '03:15', seatsLeft: 4 },
      ],
    },
    featured: false,
    seatsLeft: 60,
  },
  {
    id: 'evt-dakar-jazz-passe',
    slug: 'dakar-jazz-festival',
    title: 'Dakar Jazz Festival',
    tagline: 'Édition 2026',
    category: 'concert',
    startsAt: '2026-05-18T19:00:00+00:00',
    venue: 'Institut français',
    city: 'Dakar',
    description:
      "L'édition 2026 du Dakar Jazz Festival s'est tenue sur trois soirées à l'Institut français.",
    tags: ['Jazz', 'Archive'],
    basePrice: 12000,
    poster: {
      small: dakarJazzSmall,
      large: dakarJazzLarge,
      alt: "Section de cuivres d'un orchestre de jazz devant un rideau rouge",
    },
    organizer: { name: 'Institut français de Dakar', verified: true, eventCount: 31 },
    shuttle: null,
    featured: false,
    seatsLeft: 0,
  },
]

export function findEventBySlug(slug: string): FodiumEvent | undefined {
  return events.find((event) => event.slug === slug)
}

export function isUpcoming(event: FodiumEvent, now = new Date()): boolean {
  return new Date(event.startsAt) >= now
}

/** Catalogue affichable, du plus proche au plus lointain. */
export function upcomingEvents(now = new Date()): FodiumEvent[] {
  return events
    .filter((event) => isUpcoming(event, now))
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt))
}
