import gsap from 'gsap'
import { type RefObject, useEffect, useLayoutEffect, useRef } from 'react'

/**
 * Frise d'impression du billet, laissée en pause et *parcourue* par la valeur
 * d'avancement de l'appui.
 *
 * C'est la raison d'être de GSAP ici : une transition CSS ou une animation
 * déclenchée puis oubliée joue du début à la fin et ne sait pas revenir en
 * arrière. Il fallait une frise adressable — `timeline.progress(p)` — parcourue
 * par deux sources successives : l'appui maintenu, qui amorce le billet et le
 * dé-imprime si on relâche, puis le retour de l'opérateur, qui la mène au bout.
 */
export function useTicketPrinting(root: RefObject<HTMLElement | null>, progress: number) {
  const timelineRef = useRef<gsap.core.Timeline | null>(null)

  useLayoutEffect(() => {
    if (!root.current) return

    // Mouvement réduit : le billet est rendu complet d'emblée, sans frise.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const waiting = root.current.querySelector('[data-print="waiting"]')
      if (waiting instanceof HTMLElement) waiting.hidden = true
      return
    }

    const context = gsap.context(() => {
      timelineRef.current = gsap
        .timeline({ paused: true })
        .to('[data-print="waiting"]', { opacity: 0, duration: 0.25 }, 0)
        .from('[data-print="field"]', { opacity: 0, y: 10, stagger: 0.14, duration: 0.5 }, 0)
        .from('[data-print="shuttle"]', { opacity: 0, y: 14, duration: 0.5 }, 0.45)
        .from('[data-print="bar"]', { scaleY: 0, stagger: 0.012, duration: 0.3 }, 0.75)
        .from('[data-print="serial"]', { opacity: 0, scale: 0.5, duration: 0.45 }, 1.2)
        .from('[data-print="seal"]', { opacity: 0, duration: 0.4 }, 1.45)
    }, root)

    return () => {
      context.revert()
      timelineRef.current = null
    }
  }, [root])

  useEffect(() => {
    timelineRef.current?.progress(progress)
  }, [progress])
}
