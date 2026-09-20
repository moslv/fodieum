import { ArrowLeft, Check, ChevronDown, QrCode } from 'lucide-react'
import { useRef, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'

import { HoldToPay } from '@/components/features/HoldToPay'
import { TicketStub } from '@/components/features/TicketStub'
import { PageContainer } from '@/components/layout/PageContainer'
import { Button } from '@/components/ui/Button'
import { account } from '@/data/account'
import { findEventBySlug } from '@/data/events'
import { paymentMethods } from '@/data/paymentMethods'
import { useHoldProgress } from '@/hooks/useHoldProgress'
import { useTicketPrinting } from '@/hooks/useTicketPrinting'
import { readCheckoutSelection } from '@/lib/checkout'
import { cn } from '@/lib/cn'
import { formatPrice } from '@/lib/format'
import { computePrice } from '@/lib/pricing'
import { ticketReference } from '@/lib/ticket'

/** Durée d'appui : assez long pour être délibéré, assez court pour ne pas lasser. */
const HOLD_DURATION = 1500

export function Checkout() {
  const { slug } = useParams()
  const { state } = useLocation()
  const event = slug ? findEventBySlug(slug) : undefined

  if (!event) {
    return (
      <PageContainer className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <h1 className="text-headline-lg text-on-surface">Commande introuvable</h1>
        <Link
          to="/evenements"
          className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-label-lg text-white"
        >
          Voir les événements
        </Link>
      </PageContainer>
    )
  }

  return <CheckoutView event={event} selectionState={state} />
}

interface CheckoutViewProps {
  event: NonNullable<ReturnType<typeof findEventBySlug>>
  selectionState: unknown
}

function CheckoutView({ event, selectionState }: CheckoutViewProps) {
  const navigate = useNavigate()
  const ticketRef = useRef<HTMLElement>(null)

  const [methodId, setMethodId] = useState(paymentMethods[0]!.id)
  const [pickerOpen, setPickerOpen] = useState(false)

  const selection = readCheckoutSelection(selectionState, event)
  const breakdown = computePrice(event, selection)
  const pickupPoint =
    selection.kind === 'shuttle'
      ? (event.shuttle?.pickupPoints.find((point) => point.id === selection.pickupPointId) ?? null)
      : null

  const reference = ticketReference(
    `${event.slug}:${selection.kind}:${selection.pickupPointId}:${selection.quantity}`,
  )

  const hold = useHoldProgress({ duration: HOLD_DURATION, onComplete: () => undefined })
  useTicketPrinting(ticketRef, hold.progress)

  const method = paymentMethods.find((item) => item.id === methodId) ?? paymentMethods[0]!
  const isPaid = hold.status === 'done'

  return (
    <PageContainer className="pb-16 pt-4 lg:pt-10">
      <div className="mb-5 flex items-center gap-3">
        <button
          type="button"
          aria-label="Retour à l'événement"
          onClick={() => navigate(-1)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-black/5 bg-white/80 text-on-surface shadow-glass transition-transform active:scale-95"
        >
          <ArrowLeft aria-hidden className="h-5 w-5" />
        </button>
        <h1 className="text-headline-md text-on-surface">
          {isPaid ? 'Votre billet' : 'Confirmer et payer'}
        </h1>
      </div>

      <div className="lg:grid lg:grid-cols-[1fr_420px] lg:items-start lg:gap-10">
        <TicketStub
          event={event}
          pickupPoint={pickupPoint}
          reference={reference}
          holder={account.fullName}
          quantity={selection.quantity}
          rootRef={ticketRef}
          className="lg:sticky lg:top-[92px]"
        />

        <div className="mt-6 flex flex-col gap-4 lg:mt-0">
          <section className="rounded-card border border-white/70 bg-white/85 p-4 shadow-glass backdrop-blur-md">
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-label-lg',
                  method.swatch,
                )}
              >
                {method.name.slice(0, 2).toUpperCase()}
              </span>

              <div className="min-w-0 flex-1">
                <p className="truncate text-label-lg text-on-surface">{method.name}</p>
                <p className="truncate text-body-sm text-secondary">
                  {method.maskedPhone} · {method.hint}
                </p>
              </div>

              {isPaid ? null : (
                <button
                  type="button"
                  aria-expanded={pickerOpen}
                  onClick={() => setPickerOpen((open) => !open)}
                  className="flex shrink-0 items-center gap-1 rounded-full bg-surface-container px-3 py-1.5 text-label-md text-on-surface transition-colors hover:bg-surface-container-high"
                >
                  Changer
                  <ChevronDown
                    aria-hidden
                    className={cn('h-4 w-4 transition-transform', pickerOpen && 'rotate-180')}
                  />
                </button>
              )}
            </div>

            {/* Le moyen de paiement est déjà choisi : la grille d'opérateurs ne
                s'ouvre que si l'on veut en changer. */}
            <div
              className={cn(
                'grid transition-all duration-300 ease-out motion-reduce:transition-none',
                pickerOpen && !isPaid ? 'mt-3 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
              )}
            >
              <ul className="flex flex-col gap-1.5 overflow-hidden">
                {paymentMethods.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setMethodId(item.id)
                        setPickerOpen(false)
                      }}
                      className={cn(
                        'flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left transition-colors',
                        item.id === methodId ? 'bg-primary/10' : 'hover:bg-surface-container-low',
                      )}
                    >
                      <span
                        className={cn(
                          'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-label-sm',
                          item.swatch,
                        )}
                      >
                        {item.name.slice(0, 2).toUpperCase()}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-label-md text-on-surface">
                          {item.name}
                        </span>
                        <span className="block truncate text-body-sm text-secondary">
                          {item.hint}
                        </span>
                      </span>
                      {item.id === methodId ? (
                        <Check aria-hidden className="h-4 w-4 shrink-0 text-primary" />
                      ) : null}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="rounded-card border border-white/70 bg-white/85 p-4 shadow-glass backdrop-blur-md">
            <dl className="flex flex-col gap-1.5 text-body-md">
              <div className="flex items-baseline justify-between">
                <dt className="text-secondary">Billet × {selection.quantity}</dt>
                <dd className="text-on-surface">{formatPrice(breakdown.ticketsSubtotal)}</dd>
              </div>
              {pickupPoint ? (
                <div className="flex items-baseline justify-between gap-2">
                  <dt className="min-w-0 truncate text-secondary">
                    Navette {pickupPoint.name} × {selection.quantity}
                  </dt>
                  <dd className="shrink-0 text-on-surface">
                    {formatPrice(breakdown.shuttleSubtotal)}
                  </dd>
                </div>
              ) : null}
              <div className="mt-1.5 flex items-baseline justify-between border-t border-black/5 pt-2.5">
                <dt className="text-label-lg text-on-surface">Total à payer</dt>
                <dd className="text-price text-primary">{formatPrice(breakdown.total)}</dd>
              </div>
            </dl>
            <p className="mt-1 text-[11px] text-outline">Frais de service inclus</p>
          </section>

          {isPaid ? (
            <div className="flex flex-col gap-2.5">
              <Button size="lg" onClick={() => navigate('/mes-billets')}>
                <QrCode aria-hidden className="h-5 w-5" />
                Voir mes billets
              </Button>
              <Button variant="ghost" size="lg" onClick={() => navigate('/')}>
                Retour à l'accueil
              </Button>
            </div>
          ) : (
            <HoldToPay amount={breakdown.total} hold={hold} />
          )}
        </div>
      </div>
    </PageContainer>
  )
}
