/**
 * Attributs d'un billet, dérivés de sa graine : le même panier produit
 * toujours la même référence et le même code-barres.
 */
import { hash, hashSequence } from '@/lib/hash'

/** `« FOD-89247 »`. */
export function ticketReference(seed: string): string {
  return `FOD-${(hash(seed) % 90000) + 10000}`
}

/** Numéro de siège dans la navette, borné à une capacité de car. */
export function shuttleSeat(seed: string): number {
  return (hash(`seat:${seed}`) % 48) + 1
}

/**
 * Largeurs relatives des barres du code-barres, en unités de 1 à 4.
 * Le motif est dérivé de la référence : deux billets différents ne portent
 * pas le même code.
 */
export function barcodePattern(seed: string, bars = 44): number[] {
  return hashSequence(seed, bars, 4).map((value) => value + 1)
}
