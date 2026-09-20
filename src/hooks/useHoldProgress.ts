import { useCallback, useEffect, useRef, useState } from 'react'

export type HoldStatus = 'idle' | 'holding' | 'releasing' | 'done'

/** Le retour en arrière est plus rapide que la montée : annuler doit être immédiat. */
const REWIND_FACTOR = 2.5

interface UseHoldProgressOptions {
  /** Durée d'appui nécessaire pour aller au bout, en millisecondes. */
  duration: number
  onComplete: () => void
}

export interface HoldProgress {
  /** Avancement de 0 à 1, piloté par le doigt. */
  progress: number
  status: HoldStatus
  start: () => void
  release: () => void
}

/**
 * Avancement piloté par un appui maintenu, réversible tant qu'il n'a pas
 * abouti. Relâcher rembobine au lieu de valider : le geste reste annulable
 * jusqu'au dernier instant, ce qu'un simple clic ne permet pas.
 */
export function useHoldProgress({ duration, onComplete }: UseHoldProgressOptions): HoldProgress {
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState<HoldStatus>('idle')

  const statusRef = useRef<HoldStatus>('idle')
  const progressRef = useRef(0)
  const frameRef = useRef(0)
  const lastTimeRef = useRef(0)
  const onCompleteRef = useRef(onComplete)

  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  useEffect(() => () => cancelAnimationFrame(frameRef.current), [])

  const applyStatus = useCallback((next: HoldStatus) => {
    statusRef.current = next
    setStatus(next)
  }, [])

  const start = useCallback(() => {
    if (statusRef.current === 'done' || statusRef.current === 'holding') return

    applyStatus('holding')
    lastTimeRef.current = performance.now()
    cancelAnimationFrame(frameRef.current)

    // La boucle vit dans `start` : une seule tourne à la fois, et `release`
    // n'a qu'à changer le statut pour qu'elle rembobine d'elle-même.
    function step(time: number) {
      const delta = (time - lastTimeRef.current) / duration
      lastTimeRef.current = time

      progressRef.current =
        statusRef.current === 'holding'
          ? Math.min(1, progressRef.current + delta)
          : Math.max(0, progressRef.current - delta * REWIND_FACTOR)

      setProgress(progressRef.current)

      if (progressRef.current >= 1) {
        applyStatus('done')
        onCompleteRef.current()
        return
      }

      if (progressRef.current <= 0 && statusRef.current !== 'holding') {
        applyStatus('idle')
        return
      }

      frameRef.current = requestAnimationFrame(step)
    }

    frameRef.current = requestAnimationFrame(step)
  }, [applyStatus, duration])

  const release = useCallback(() => {
    if (statusRef.current !== 'holding') return
    applyStatus('releasing')
  }, [applyStatus])

  return { progress, status, start, release }
}
