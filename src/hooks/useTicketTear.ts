import gsap from 'gsap'
import { type RefObject, useCallback } from 'react'

/**
 * Déchire un billet à l'annulation.
 *
 * Un billet annulé ne doit pas disparaître comme une ligne de liste : c'est
 * un objet qu'on rend. Il se fait donc tamponner, puis se sépare le long de
 * sa ligne de découpe — les deux moitiés que `TicketFrame` a déjà posées —
 * avant que la page passe à la suite.
 *
 * La promesse rendue n'est tenue qu'à la fin : l'appelant retire le billet du
 * coffre et change d'écran une fois la déchirure jouée, jamais pendant.
 */
export function useTicketTear(root: RefObject<HTMLElement | null>) {
  return useCallback(
    () =>
      new Promise<void>((resolve) => {
        const node = root.current

        // Mouvement réduit : l'annulation reste instantanée, elle est déjà
        // confirmée par ailleurs.
        if (!node || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          resolve()
          return
        }

        const stamp = node.querySelector('[data-tear="stamp"]')
        const stub = node.querySelector('[data-tear="stub"]')
        const body = node.querySelector('[data-tear="body"]')

        gsap
          .timeline({ onComplete: resolve })
          // Le tampon tombe de haut : il arrive en grand et se pose net.
          .fromTo(
            stamp,
            { opacity: 0, scale: 2.6, rotate: 8 },
            { opacity: 1, scale: 1, rotate: 0, duration: 0.3, ease: 'back.out(2.2)' },
          )
          // Le billet encaisse le coup.
          .to(node, { x: -4, duration: 0.05, ease: 'none' })
          .to(node, { x: 0, duration: 0.25, ease: 'elastic.out(1, 0.35)' })
          // Puis il se sépare et tombe hors du cadre.
          .to(stub, { x: -30, y: 34, rotate: -8, opacity: 0, duration: 0.5, ease: 'power2.in' }, 0.75)
          .to(body, { x: 30, y: 44, rotate: 6, opacity: 0, duration: 0.5, ease: 'power2.in' }, 0.79)
          .to(stamp, { opacity: 0, duration: 0.35, ease: 'power1.in' }, 0.82)
      }),
    [root],
  )
}
