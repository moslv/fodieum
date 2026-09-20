import { BadgeCheck, Bus, Fingerprint } from 'lucide-react'
import { type RefObject } from 'react'

import { EventPoster } from '@/components/features/EventPoster'
import type { FodiumEvent, PickupPoint } from '@/data/types'
import { cn } from '@/lib/cn'
import { formatEventDate, formatEventTime } from '@/lib/format'
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
 * Le billet lui-même : encoches latérales, séparateur pointillé et code-barres
 * dérivé de la référence. C'est la seule chose gardée de la maquette de
 * paiement — son esthétique, pas son formulaire.
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

  return (
    <article
      ref={rootRef}
      className={cn(
        'relative overflow-hidden rounded-card-lg bg-surface-container-lowest shadow-glass-lg',
        className,
      )}
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-surface-container">
        <EventPoster event={event} size="hero" />
        <span
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/30"
        />

        <span
          data-print="ref"
          className="absolute right-3 top-3 rounded-full bg-primary px-2.5 py-1 font-mono text-[11px] font-bold text-white"
        >
          #{reference}
        </span>

        {pickupPoint ? (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-on-surface/85 px-2.5 py-1 text-label-sm text-white backdrop-blur-sm">
            <Bus aria-hidden className="h-3.5 w-3.5" />
            Billet + Navette
          </span>
        ) : null}

        <div className="absolute inset-x-0 bottom-0 p-4">
          <h2 className="text-headline-md text-white">{event.title}</h2>
          <p className="text-body-sm text-white/85">
            {event.venue} · {event.city}
          </p>
        </div>
      </div>

      {/* Tant que rien n'est imprimé, le corps du billet est vide : ce repère
          dit que c'est un blanc en attente, pas un affichage cassé. */}
      {printing ? (
        <span
          data-print="waiting"
          className="pointer-events-none absolute inset-x-0 bottom-0 top-[58%] z-10 flex flex-col items-center justify-center gap-2 text-center"
        >
          <Fingerprint aria-hidden className="h-7 w-7 animate-pulse text-outline-variant" />
          <span className="text-label-md text-outline">Billet en attente d'émission</span>
        </span>
      ) : null}

      <dl className="grid grid-cols-2 gap-x-4 gap-y-3.5 p-5">
        <TicketField label="Date" value={formatEventDate(event.startsAt)} />
        <TicketField label="Heure" value={`${formatEventTime(event.startsAt)} GMT`} />
        <TicketField label="Titulaire" value={holder} />
        <TicketField label="Places" value={`${quantity} ${quantity > 1 ? 'billets' : 'billet'}`} />
      </dl>

      {pickupPoint ? (
        <div data-print="shuttle" className="px-5 pb-5">
          <div className="flex items-center gap-2 pb-2">
            <Bus aria-hidden className="h-4 w-4 text-primary" />
            <span className="text-label-md text-on-surface">Navette {event.shuttle?.operator}</span>
            <span className="ml-auto rounded-full bg-primary-fixed px-2 py-0.5 text-label-sm text-primary-dark">
              {pickupPoint.name}
            </span>
          </div>

          <div className="grid grid-cols-3 divide-x divide-black/5 rounded-xl bg-surface-container-low py-2.5 text-center">
            <TicketMetric label="Aller" value={pickupPoint.departureTime} hint="Rendez-vous" />
            <TicketMetric label="Retour" value={pickupPoint.returnTime} hint="Départ site" />
            <TicketMetric label="Siège" value={`N° ${seat}`} hint="Climatisé" accent />
          </div>
        </div>
      ) : null}

      {/* Encoches + pointillés : la découpe d'un vrai billet. */}
      <div className="relative h-6">
        <span
          aria-hidden
          className="absolute left-0 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-background"
        />
        <span
          aria-hidden
          className="absolute right-0 top-1/2 h-6 w-6 translate-x-1/2 -translate-y-1/2 rounded-full bg-background"
        />
        <span
          aria-hidden
          className="absolute inset-x-6 top-1/2 border-t-2 border-dashed border-black/10"
        />
      </div>

      <div className="flex flex-col items-center gap-2 px-5 pb-5">
        <div className="flex h-16 items-end gap-[3px]" aria-hidden>
          {bars.map((width, index) => (
            <span
              // Les barres n'ont pas d'identité propre : leur position est leur clé.
              key={index}
              data-print="bar"
              style={{ width: `${width}px` }}
              className="h-full origin-bottom bg-on-surface"
            />
          ))}
        </div>
        <p
          data-print="seal"
          className="font-mono text-[11px] tracking-[0.25em] text-on-surface-variant"
        >
          {reference}
        </p>
        <p
          data-print="seal"
          className="flex items-center gap-1.5 text-label-sm text-tertiary"
        >
          <BadgeCheck aria-hidden className="h-4 w-4" />
          Code d'authenticité vérifié · Émis par Fodium
        </p>
      </div>
    </article>
  )
}

function TicketField({ label, value }: { label: string; value: string }) {
  return (
    <div data-print="field">
      <dt className="text-label-sm uppercase tracking-wider text-outline">{label}</dt>
      <dd className="text-label-lg text-on-surface">{value}</dd>
    </div>
  )
}

interface TicketMetricProps {
  label: string
  value: string
  hint: string
  accent?: boolean
}

function TicketMetric({ label, value, hint, accent }: TicketMetricProps) {
  return (
    <div className="px-2">
      <p className="text-label-sm uppercase tracking-wider text-outline">{label}</p>
      <p className={cn('text-headline-sm', accent ? 'text-primary' : 'text-on-surface')}>{value}</p>
      <p className="text-[11px] text-outline">{hint}</p>
    </div>
  )
}
