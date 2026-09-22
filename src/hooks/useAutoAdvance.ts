import { type RefObject, useCallback, useEffect, useRef } from 'react'

interface UseAutoAdvanceOptions {
  ref: RefObject<HTMLElement | null>
  /** Nombre de diapositives. En dessous de deux, rien à faire avancer. */
  count: number
  /** Diapositive courante, relevée par `useCarouselIndex`. */
  index: number
  /** Temps d'arrêt sur chaque diapositive, en millisecondes. */
  interval: number
}

/**
 * Fait défiler un carrousel tout seul, et rend la fonction de défilement pour
 * que les commandes manuelles empruntent le même chemin.
 *
 * L'avance s'interrompt dès que la main s'en mêle — survol à la souris, doigt
 * posé — et quand l'onglet passe en arrière-plan. Elle ne fait rien non plus
 * quand le conteneur ne défile pas : sur les grands écrans le carrousel
 * devient une grille, il n'y a plus rien à avancer.
 *
 * Le défilement est strictement horizontal, calculé sur le conteneur :
 * `scrollIntoView` emporterait la page avec lui quand le carrousel n'est
 * qu'à moitié visible.
 */
export function useAutoAdvance({ ref, count, index, interval }: UseAutoAdvanceOptions) {
  const indexRef = useRef(index)

  useEffect(() => {
    indexRef.current = index
  }, [index])

  const scrollTo = useCallback(
    (target: number) => {
      const track = ref.current
      const slide = track?.children[target]
      if (!track || !(slide instanceof HTMLElement)) return

      const offset = slide.getBoundingClientRect().left - track.getBoundingClientRect().left

      track.scrollTo({
        left: track.scrollLeft + offset - (track.clientWidth - slide.clientWidth) / 2,
        behavior: 'smooth',
      })
    },
    [ref],
  )

  useEffect(() => {
    const track = ref.current
    if (!track || count < 2) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let held = false
    const hold = () => {
      held = true
    }
    const release = () => {
      held = false
    }

    const timer = window.setInterval(() => {
      if (held || document.hidden) return
      if (track.scrollWidth <= track.clientWidth) return

      scrollTo((indexRef.current + 1) % count)
    }, interval)

    // Le survol à la souris et l'appui du doigt se signalent différemment :
    // `mouseenter` ne se déclenche pas au toucher, et `pointerleave` ne
    // revient pas toujours après un balayage.
    track.addEventListener('mouseenter', hold)
    track.addEventListener('mouseleave', release)
    track.addEventListener('pointerdown', hold)
    track.addEventListener('pointerup', release)
    track.addEventListener('pointercancel', release)

    return () => {
      window.clearInterval(timer)
      track.removeEventListener('mouseenter', hold)
      track.removeEventListener('mouseleave', release)
      track.removeEventListener('pointerdown', hold)
      track.removeEventListener('pointerup', release)
      track.removeEventListener('pointercancel', release)
    }
  }, [count, interval, ref, scrollTo])

  return scrollTo
}
