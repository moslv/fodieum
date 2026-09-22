import { useEffect, useRef, useState } from 'react'

import { type HoldProgress, useHoldProgress } from '@/hooks/useHoldProgress'

/**
 * `form` tant que l'appui n'a pas abouti, puis le billet part en émission :
 * l'application de paiement prend la main, le débit revient confirmé, et le
 * billet s'imprime.
 */
export type PaymentPhase = 'form' | 'handoff' | 'confirmed' | 'printing' | 'issued'

/** Temps passé « dans » l'application de l'opérateur. */
const HANDOFF_MS = 2400
/** Retour dans Fodium, accusé de débit affiché. */
const CONFIRMED_MS = 1000
/** Durée d'impression du billet. */
const PRINTING_MS = 1600

/**
 * Part de l'impression jouée pendant l'appui maintenu. Le geste amorce le
 * billet — titre, champs — mais ne le valide pas : le code-barres et le sceau
 * ne s'impriment qu'au retour de l'opérateur, une fois les fonds retirés.
 */
const HOLD_PRINT_SHARE = 0.4

interface UsePaymentFlowOptions {
  /** Durée de l'appui maintenu nécessaire pour lancer le paiement. */
  holdDuration: number
  /** Appelé une fois, quand le débit est confirmé et le billet entre en émission. */
  onIssue: () => void
}

export interface PaymentFlow {
  phase: PaymentPhase
  /** L'appui maintenu, à brancher sur le contrôle de paiement. */
  hold: HoldProgress
  /** Avancement de l'impression, de 0 à 1, appui compris. */
  printProgress: number
  /** Renonce tant que l'opérateur n'a pas prélevé les fonds. */
  cancel: () => void
}

/**
 * Enchaînement du paiement, de l'appui au billet téléchargeable.
 *
 * Un paiement mobile sénégalais sort de l'application : Wave ou Orange Money
 * prend la main pour retirer les fonds. La plupart des billetteries laissent
 * l'utilisateur revenir sur un écran blanc et un spinner. Ici le départ, le
 * retour et l'émission sont trois états annoncés, et le billet se fabrique à
 * l'écran au retour — on voit ce qu'on a acheté se former.
 *
 * Le crochet porte aussi l'appui maintenu, parce que c'est lui qui déclenche
 * le départ : les deux ne forment qu'un seul geste de paiement.
 */
export function usePaymentFlow({ holdDuration, onIssue }: UsePaymentFlowOptions): PaymentFlow {
  const [phase, setPhase] = useState<PaymentPhase>('form')
  const [printed, setPrinted] = useState(0)

  // Lu une fois : la préférence ne change pas en cours de paiement.
  const [reducedMotion] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  const hold = useHoldProgress({
    duration: holdDuration,
    onComplete: () => setPhase('handoff'),
  })

  const onIssueRef = useRef(onIssue)

  useEffect(() => {
    onIssueRef.current = onIssue
  }, [onIssue])

  useEffect(() => {
    if (phase === 'handoff') {
      const timer = window.setTimeout(() => setPhase('confirmed'), HANDOFF_MS)
      return () => window.clearTimeout(timer)
    }

    if (phase === 'confirmed') {
      const timer = window.setTimeout(() => setPhase('printing'), CONFIRMED_MS)
      return () => window.clearTimeout(timer)
    }

    if (phase !== 'printing') return

    onIssueRef.current()

    // Mouvement réduit : le billet est acquis, on ne le fait pas s'imprimer.
    if (reducedMotion) {
      const timer = window.setTimeout(() => setPhase('issued'), 400)
      return () => window.clearTimeout(timer)
    }

    // L'impression est une frise GSAP parcourue par cette valeur : elle est
    // donc avancée image par image, et non confiée à une transition CSS.
    let frame = 0
    const startedAt = performance.now()

    function step(time: number) {
      const ratio = Math.min(1, (time - startedAt) / PRINTING_MS)

      if (ratio >= 1) {
        setPhase('issued')
        return
      }

      setPrinted(ratio)
      frame = requestAnimationFrame(step)
    }

    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [phase, reducedMotion])

  // Après `confirmed`, les fonds sont sortis du compte : il n'y a plus rien à
  // abandonner, seulement un billet à rendre.
  function cancel() {
    setPhase('form')
    setPrinted(0)
    hold.reset()
  }

  return {
    phase,
    hold,
    printProgress: printProgress(phase, hold.progress, printed, reducedMotion),
    cancel,
  }
}

function printProgress(
  phase: PaymentPhase,
  holdProgress: number,
  printed: number,
  reducedMotion: boolean,
): number {
  if (phase === 'form') return holdProgress * HOLD_PRINT_SHARE
  if (phase === 'issued' || reducedMotion) return 1

  return HOLD_PRINT_SHARE + printed * (1 - HOLD_PRINT_SHARE)
}
