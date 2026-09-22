import { BadgeCheck, Bus, Fingerprint } from 'lucide-react'
import { type RefObject } from 'react'

import { TicketFrame } from '@/components/features/TicketFrame'
import type { FodiumEvent, PickupPoint } from '@/data/types'
import { cn } from '@/lib/cn'
import { formatEventTime, formatTicketDate } from '@/lib/format'
import { barcodePattern, shuttleSeat } from '@/lib/ticket'

interface TicketStubProps {
  event: FodiumEvent
  pickupPoint: PickupPoint | null
  reference: string
  holder: string
  quantity: number
  /** `true` pendant le paiement : le billet part vierge et s'imprime. */
  printing?: boolean
  /** Le composant expose sa racine pour que la frise d'impression la cible. */
  rootRef?: RefObject<HTMLElement | null>
  className?: string
}

/**
 * Le billet émis : mentions d'accès, champs poinçonnés, navette le cas
 * échéant, code-barres. Il reprend la silhouette de `TicketFrame`, celle de
 * tous les billets de l'application.
 *
 * Tout tient sur trois bandes, parce qu'un billet se présente d'un bloc au
 * contrôle : on ne doit pas avoir à faire défiler l'écran pour atteindre son
 * code-barres. Le titulaire est donc remonté en tête plutôt que d'occuper une
 * quatrième colonne, et le nombre de places n'est dit qu'une fois.
 */
export function TicketStub({
  event,
  pickupPoint,
  reference,
  holder,
  quantity,
  printing = false,
  rootRef,
  className,
}: TicketStubProps) {
  const bars = barcodePattern(reference)
  const seat = pickupPoint ? shuttleSeat(reference) : null
  const admits = String(quantity).padStart(2, '0')

  return (
    <TicketFrame
      event={event}
      serial={reference.replace('FOD-', '')}
      rootRef={rootRef}
      className={className}
    >
      <div className="relative flex flex-1 flex-col">
        {/* Tant que rien n'est imprimé, le corps du billet est vide : ce repère
            dit que c'est un blanc en attente, pas un affichage cassé. */}
        {printing ? (
          <span
            data-print="waiting"
            className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center gap-2.5 text-center"
          >
            <Fingerprint aria-hidden className="h-7 w-7 animate-pulse text-outline-variant" />
            <span className="font-mono text-stub-label uppercase text-outline">
              Billet en attente d&apos;émission
            </span>
          </span>
        ) : null}

        <div className="flex flex-col gap-1.5 px-4 py-2.5">
          <div className="flex items-center justify-between gap-2">
            <span className="flex min-w-0 items-center gap-1.5 font-mono text-stub-label uppercase text-outline">
              {pickupPoint ? <Bus aria-hidden className="h-3 w-3 shrink-0 text-primary" /> : null}
              <span className="truncate">{pickupPoint ? 'Billet + Navette' : 'Entrée seule'}</span>
            </span>
            <span className="min-w-0 shrink truncate font-mono text-stub-label uppercase text-on-surface">
              {holder}
            </span>
          </div>

          <div className="min-w-0">
            <h2 className="line-clamp-2 text-ticket-title uppercase text-on-surface">
              {event.title}
            </h2>
            <p className="mt-1 truncate font-mono text-stub-label uppercase text-secondary">
              {event.venue} · {event.city}
            </p>
          </div>
        </div>

        <dl className="grid grid-cols-3 gap-x-4 border-t border-dashed border-tear px-4 py-2.5">
          <TicketField label="Date" value={formatTicketDate(event.startsAt)} />
          <TicketField label="Heure" value={`${formatEventTime(event.startsAt)} GMT`} />
          <TicketField label="Places" value={admits} />
        </dl>

        {pickupPoint ? (
          <div
            data-print="shuttle"
            className="flex flex-col gap-2 border-t border-dashed border-tear px-4 py-2.5"
          >
            <span className="flex items-center gap-2">
              <Bus aria-hidden className="h-3.5 w-3.5 shrink-0 text-primary" />
              <span className="truncate font-mono text-stub-label uppercase text-on-surface">
                Navette {event.shuttle?.operator}
              </span>
              <span className="ml-auto shrink-0 truncate font-mono text-stub-label uppercase text-primary-dark">
                {pickupPoint.name}
              </span>
            </span>

            <div className="grid grid-cols-3 gap-x-4">
              <TicketField label="Aller" value={pickupPoint.departureTime} />
              <TicketField label="Retour" value={pickupPoint.returnTime} />
              <TicketField label="Siège" value={`N°${seat}`} accent />
            </div>
          </div>
        ) : null}

        <div className="mt-auto flex items-end gap-3 border-t border-dashed border-tear px-4 py-2.5">
          <span className="flex h-7 flex-1 items-end gap-[2px] overflow-hidden" aria-hidden>
            {bars.map((width, index) => (
              // Les barres n'ont pas d'identité propre : leur position est leur clé.
              <span
                key={index}
                data-print="bar"
                style={{ width: `${width}px` }}
                className="h-full origin-bottom bg-on-surface"
              />
            ))}
          </span>
          <p
            data-print="seal"
            className="flex shrink-0 items-center gap-1.5 font-mono text-stub-label uppercase text-tertiary"
          >
            <BadgeCheck aria-hidden className="h-3.5 w-3.5" />
            Vérifié
          </p>
        </div>
      </div>
    </TicketFrame>
  )
}

interface TicketFieldProps {
  label: string
  value: string
  accent?: boolean
}

function TicketField({ label, value, accent }: TicketFieldProps) {
  return (
    <div data-print="field" className="min-w-0">
      <dt className="font-mono text-stub-label uppercase text-outline">{label}</dt>
      <dd
        className={cn(
          'mt-0.5 truncate font-mono text-stub-value',
          accent ? 'text-primary' : 'text-on-surface',
        )}
      >
        {value}
      </dd>
    </div>
  )
}
