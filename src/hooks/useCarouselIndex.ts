import { type RefObject, useEffect, useState } from 'react'

/**
 * Suit la diapositive visible d'un conteneur à défilement horizontal.
 * Mesuré sur l'élément réellement rendu plutôt que sur une largeur supposée,
 * pour rester juste quand la carte change de taille entre les points de rupture.
 */
export function useCarouselIndex(ref: RefObject<HTMLElement | null>): number {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const track = ref.current
    if (!track) return

    function update() {
      if (!track) return
      const slide = track.firstElementChild
      if (!(slide instanceof HTMLElement)) return

      const step = slide.offsetWidth + Number.parseFloat(getComputedStyle(track).columnGap || '0')
      if (step <= 0) return

      setIndex(Math.round(track.scrollLeft / step))
    }

    update()
    track.addEventListener('scroll', update, { passive: true })
    return () => track.removeEventListener('scroll', update)
  }, [ref])

  return index
}
