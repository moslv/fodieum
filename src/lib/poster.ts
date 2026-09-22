/**
 * Encres des affiches générées.
 *
 * Extraites du composant parce que deux rendus très différents s'en servent :
 * l'affiche à l'écran (`PosterArtwork`, en SVG et en CSS) et le billet
 * téléchargeable (`ticketImage`, dessiné au canvas). Une seule table d'encres
 * garantit qu'un événement garde la même identité dans les deux.
 */
import type { EventCategory, FodiumEvent } from '@/data/types'
import { hashPick } from '@/lib/hash'

export interface InkScheme {
  /** Fond du tirage. */
  paper: string
  /** Encre du motif et des filets. */
  ink: string
  /** Encre du titre, posée sur le papier. */
  type: string
  /** Encre d'accent : filets, date, pastille. */
  accent: string
}

/** Une gamme d'encres par famille d'événement, deux tirages possibles chacune. */
const schemes: Record<EventCategory, readonly [InkScheme, InkScheme]> = {
  festival: [
    { paper: '#0d5c52', ink: '#0a463e', type: '#f6efe4', accent: '#f4a23c' },
    { paper: '#f1e4cd', ink: '#c9ad78', type: '#123f39', accent: '#c2410c' },
  ],
  concert: [
    { paper: '#241b3a', ink: '#17102a', type: '#f4efe6', accent: '#f07e00' },
    { paper: '#2d2a4a', ink: '#201d38', type: '#efe9f5', accent: '#8ab4f8' },
  ],
  soiree: [
    { paper: '#9a3412', ink: '#7a2a0e', type: '#fdf1e3', accent: '#ffd9a0' },
    { paper: '#fbe8d3', ink: '#e8b57f', type: '#7c2d12', accent: '#c2410c' },
  ],
  mode: [
    { paper: '#16181d', ink: '#0b0d10', type: '#f5f3ef', accent: '#e8d7bd' },
    { paper: '#e9e5dd', ink: '#bcb5a6', type: '#16181d', accent: '#934b00' },
  ],
  humour: [
    { paper: '#b45309', ink: '#8f4107', type: '#fff6e6', accent: '#fde68a' },
    { paper: '#fde9b8', ink: '#eec469', type: '#7c3a06', accent: '#b45309' },
  ],
}

/** Le tirage d'un événement, stable d'un rendu à l'autre. */
export function posterScheme(event: FodiumEvent): InkScheme {
  const inks = schemes[event.category]
  return hashPick(`ink:${event.id}`, 2) === 0 ? inks[0] : inks[1]
}

/**
 * Sigle de repli : les initiales du titre. Dans un talon de billet, une
 * affiche n'a pas la place d'un titre — elle garde sa trame et son sigle.
 */
export function posterMonogram(title: string): string {
  return title
    .split(/[\s—–-]+/)
    .filter((word) => word.length > 2)
    .slice(0, 3)
    .map((word) => word[0])
    .join('')
    .toUpperCase()
}
