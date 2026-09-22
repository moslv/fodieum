import { Loader2, Undo2, X } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/Button'

/** Délai au bout duquel la demande non confirmée retombe d'elle-même. */
const CONFIRM_WINDOW = 5000

type CancelStage = 'idle' | 'asking' | 'running'

interface CancelTicketButtonProps {
  reference: string
  /**
   * Rend le billet. La page garde la main sur ce qui l'accompagne — la
   * déchirure à l'écran, puis l'endroit où l'on repart.
   */
  onConfirm: () => void | Promise<void>
}

/**
 * Rendre un billet, en deux temps.
 *
 * Annuler est irréversible et n'a pas de bouton « rétablir » : le premier
 * appui ne fait que demander confirmation, et la demande retombe seule au
 * bout de quelques secondes. On évite ainsi la boîte de dialogue du
 * navigateur, qui bloque la page et sort l'utilisateur du billet qu'il est
 * précisément en train de regarder.
 */
export function CancelTicketButton({ reference, onConfirm }: CancelTicketButtonProps) {
  const [stage, setStage] = useState<CancelStage>('idle')

  useEffect(() => {
    if (stage !== 'asking') return

    const timer = window.setTimeout(() => setStage('idle'), CONFIRM_WINDOW)
    return () => window.clearTimeout(timer)
  }, [stage])

  if (stage === 'idle') {
    return (
      <Button variant="ghost" size="lg" onClick={() => setStage('asking')}>
        <X aria-hidden className="h-5 w-5" />
        Annuler le billet
      </Button>
    )
  }

  if (stage === 'running') {
    return (
      <Button variant="ghost" size="lg" disabled aria-live="polite">
        <Loader2 aria-hidden className="h-5 w-5 animate-spin motion-reduce:animate-none" />
        Annulation du billet…
      </Button>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <Button
          size="lg"
          className="flex-1 bg-error text-on-error shadow-error/20"
          onClick={async () => {
            setStage('running')
            await onConfirm()
          }}
        >
          Confirmer l&apos;annulation
        </Button>
        <Button
          variant="ghost"
          size="lg"
          aria-label="Garder le billet"
          className="shrink-0 px-4"
          onClick={() => setStage('idle')}
        >
          <Undo2 aria-hidden className="h-5 w-5" />
        </Button>
      </div>
      <p className="text-center text-body-sm text-secondary">
        Le billet {reference} sera retiré de votre coffre. C&apos;est définitif.
      </p>
    </div>
  )
}
