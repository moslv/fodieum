import { ArrowUpRight, Check, Loader2, ShieldCheck } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import type { PaymentMethod } from '@/data/paymentMethods'
import { cn } from '@/lib/cn'
import { formatPrice } from '@/lib/format'

interface PaymentHandoffProps {
  method: PaymentMethod
  amount: number
  /** `handoff` : l'opérateur a la main. `confirmed` : les fonds sont retirés. */
  stage: 'handoff' | 'confirmed'
  /** Retour à la commande, tant que rien n'est prélevé. */
  onCancel: () => void
}

/**
 * Le passage par l'application de l'opérateur.
 *
 * Un paiement mobile quitte la billetterie : Wave ou Orange Money reprend la
 * main pour retirer les fonds, et l'utilisateur revient sans savoir ce qui
 * s'est passé — c'est là que les billetteries perdent les gens. On rend donc
 * l'aller-retour visible : on annonce le départ, on montre le retrait, on
 * accuse le retour. Le billet, lui, reste à l'écran derrière le voile : on
 * n'a jamais quitté sa commande.
 */
export function PaymentHandoff({ method, amount, stage, onCancel }: PaymentHandoffProps) {
  const steps = [
    `Ouverture de ${method.name}`,
    `Retrait de ${formatPrice(amount)}`,
    'Retour à Fodium',
  ]
  const activeIndex = stage === 'handoff' ? 1 : 2

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-50 flex items-end justify-center bg-on-surface/40 px-4 pb-8 backdrop-blur-sm sm:items-center sm:pb-0"
    >
      <div className="w-full max-w-sm animate-float-in rounded-card-lg bg-surface-container-lowest p-6 shadow-sheet">
        <div className="flex items-center gap-3">
          <span
            className={cn(
              'relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-headline-sm',
              method.swatch,
            )}
          >
            {method.name.slice(0, 2).toUpperCase()}
            {stage === 'handoff' ? (
              <span
                aria-hidden
                className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-surface-container-lowest text-on-surface shadow-glass"
              >
                <ArrowUpRight className="h-3.5 w-3.5" />
              </span>
            ) : (
              <span
                aria-hidden
                className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-tertiary text-on-tertiary shadow-glass"
              >
                <Check className="h-3.5 w-3.5" />
              </span>
            )}
          </span>

          <div className="min-w-0">
            <p className="text-headline-sm text-on-surface">
              {stage === 'handoff' ? `Confirmez dans ${method.name}` : 'Débit confirmé'}
            </p>
            <p className="truncate text-body-sm text-secondary">
              {stage === 'handoff'
                ? `${method.maskedPhone} · ${formatPrice(amount)}`
                : 'Émission de votre billet…'}
            </p>
          </div>
        </div>

        <ol className="mt-5 flex flex-col gap-3">
          {steps.map((label, index) => (
            <li key={label} className="flex items-center gap-3">
              <span
                aria-hidden
                className={cn(
                  'flex h-6 w-6 shrink-0 items-center justify-center rounded-full',
                  index < activeIndex && 'bg-tertiary/10 text-tertiary',
                  index === activeIndex && 'bg-primary/10 text-primary',
                  index > activeIndex && 'bg-surface-container text-outline-variant',
                )}
              >
                {index < activeIndex ? (
                  <Check className="h-3.5 w-3.5" />
                ) : index === activeIndex ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin motion-reduce:animate-none" />
                ) : (
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                )}
              </span>
              <span
                className={cn(
                  'text-body-md',
                  index <= activeIndex ? 'text-on-surface' : 'text-outline',
                )}
              >
                {label}
              </span>
            </li>
          ))}
        </ol>

        <p className="mt-5 flex items-center gap-2 border-t border-hairline pt-4 text-body-sm text-secondary">
          <ShieldCheck aria-hidden className="h-4 w-4 shrink-0 text-tertiary" />
          Votre place est retenue pendant l&apos;opération.
        </p>

        {/* Une fois le débit confirmé, renoncer n'aurait plus de sens : il
            faudrait rendre le billet, ce qui se fait sur l'écran suivant. */}
        {stage === 'handoff' ? (
          <Button variant="ghost" size="lg" className="mt-3 w-full" onClick={onCancel}>
            Annuler le paiement
          </Button>
        ) : null}
      </div>
    </div>
  )
}
