/**
 * Génération déterministe des attributs d'un billet. Sans backend, le même
 * panier doit toujours produire la même référence et le même code-barres :
 * un tirage aléatoire changerait à chaque rendu de React.
 */

/** FNV-1a 32 bits : court, stable, suffisant pour une démo. */
function hash(seed: string): number {
  let value = 0x811c9dc5

  for (let index = 0; index < seed.length; index += 1) {
    value ^= seed.charCodeAt(index)
    value = Math.imul(value, 0x01000193)
  }

  return value >>> 0
}

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
  let value = hash(seed)

  return Array.from({ length: bars }, () => {
    value = Math.imul(value ^ (value >>> 15), 0x2545f491) >>> 0
    return (value % 4) + 1
  })
}
