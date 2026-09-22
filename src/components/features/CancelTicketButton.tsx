import { Undo2, X } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/Button'
import { cancelTicket } from '@/lib/ticketStore'

/** Délai au bout duquel la demande non confirmée retombe d'elle-même. */
const CONFIRM_WINDOW = 5000

interface CancelTicketButtonProps {
  reference: string
  /** Appelé une fois le billet rendu : à la page de décider où l'on repart. */
  onCancelled: () => void
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
export function CancelTicketButton({ reference, onCancelled }: CancelTicketButtonProps) {
  const [asking, setAsking] = useState(false)

  useEffect(() => {
    if (!asking) return

    const timer = window.setTimeout(() => setAsking(false), CONFIRM_WINDOW)
    return () => window.clearTimeout(timer)
  }, [asking])

  if (!asking) {
    return (
      <Button variant="ghost" size="lg" onClick={() => setAsking(true)}>
        <X aria-hidden className="h-5 w-5" />
        Annuler le billet
      </Button>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <Button
          size="lg"
          className="flex-1 bg-error shadow-error/20"
          onClick={() => {
            cancelTicket(reference)
            onCancelled()
          }}
        >
          Confirmer l&apos;annulation
        </Button>
        <Button
          variant="ghost"
          size="lg"
          aria-label="Garder le billet"
          className="shrink-0 px-4"
          onClick={() => setAsking(false)}
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
