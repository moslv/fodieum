import { BadgeCheck, Fingerprint, Lock } from 'lucide-react'
import type { KeyboardEvent } from 'react'

import type { HoldProgress } from '@/hooks/useHoldProgress'
import { cn } from '@/lib/cn'
import { formatPrice } from '@/lib/format'

interface HoldToPayProps {
  amount: number
  hold: HoldProgress
}

/**
 * Contrôle de paiement par appui maintenu. Le paiement classique laisse
 * l'utilisateur devant un spinner : il a payé, ne sait pas où en est sa
 * commande, et ne peut plus revenir en arrière. Ici l'attente *est* le geste —
 * l'avancement suit le doigt, et relâcher avant la fin annule sans rien
 * débiter.
 */
export function HoldToPay({ amount, hold }: HoldToPayProps) {
  const { progress, status, start, release } = hold
  const isDone = status === 'done'

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key !== ' ' && event.key !== 'Enter') return
    if (event.repeat) return
    event.preventDefault()
    start()
  }

  function handleKeyUp(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key !== ' ' && event.key !== 'Enter') return
    release()
  }

  return (
    <div className="flex flex-col items-center gap-2.5">
      <button
        type="button"
        disabled={isDone}
        aria-describedby="hold-to-pay-hint"
        onPointerDown={start}
        onPointerUp={release}
        onPointerLeave={release}
        onPointerCancel={release}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        className={cn(
          'relative w-full touch-none select-none overflow-hidden rounded-full px-6 py-4',
          'text-label-lg shadow-lg transition-transform duration-200',
          isDone
            ? 'bg-tertiary text-on-tertiary shadow-tertiary/25'
            : 'bg-primary text-on-primary shadow-primary/30',
          status === 'holding' ? 'scale-[0.98]' : 'scale-100',
        )}
      >
        {/* Remplissage piloté par l'avancement : le bouton se charge sous le doigt. */}
        <span
          aria-hidden
          style={{ transform: `scaleX(${progress})` }}
          className="absolute inset-0 origin-left bg-white/25 dark:bg-black/25"
        />

        <span className="relative flex items-center justify-center gap-2">
          {isDone ? (
            <>
              <BadgeCheck aria-hidden className="h-5 w-5" />
              Paiement envoyé
            </>
          ) : (
            <>
              <Fingerprint aria-hidden className="h-5 w-5" />
              {status === 'holding' ? 'Ne relâchez pas…' : `Maintenez pour payer ${formatPrice(amount)}`}
            </>
          )}
        </span>
      </button>

      <div
        role="progressbar"
        aria-label="Progression du paiement"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress * 100)}
        className="sr-only"
      />

      <p id="hold-to-pay-hint" className="flex items-center gap-1.5 text-body-sm text-secondary">
        <Lock aria-hidden className="h-3.5 w-3.5 text-tertiary" />
        {isDone
          ? "Transmission à l'opérateur…"
          : 'Relâchez avant la fin pour annuler — rien ne sera débité'}
      </p>
    </div>
  )
}
