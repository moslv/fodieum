/**
 * Hachage déterministe partagé. Sans backend, tout ce qui doit avoir l'air
 * tiré au sort — référence de billet, code-barres, composition d'une affiche —
 * doit rester identique d'un rendu de React à l'autre : on dérive ces valeurs
 * d'une graine textuelle plutôt que de `Math.random()`.
 */

/** FNV-1a 32 bits : court, stable, suffisant pour une démo. */
export function hash(seed: string): number {
  let value = 0x811c9dc5

  for (let index = 0; index < seed.length; index += 1) {
    value ^= seed.charCodeAt(index)
    value = Math.imul(value, 0x01000193)
  }

  return value >>> 0
}

/** Entier de `[0, bound[` dérivé de la graine. */
export function hashPick(seed: string, bound: number): number {
  return hash(seed) % bound
}

/** Suite d'entiers de `[0, bound[`, enchaînés depuis la graine. */
export function hashSequence(seed: string, length: number, bound: number): number[] {
  let value = hash(seed)

  return Array.from({ length }, () => {
    value = Math.imul(value ^ (value >>> 15), 0x2545f491) >>> 0
    return value % bound
  })
}
