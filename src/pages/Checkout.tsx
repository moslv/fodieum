import { AlertCircle, ArrowLeft, Check, ChevronDown, Download, Loader2, QrCode } from 'lucide-react'
import { useCallback, useRef, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'

import { CancelTicketButton } from '@/components/features/CancelTicketButton'
import { HoldToPay } from '@/components/features/HoldToPay'
import { PaymentHandoff } from '@/components/features/PaymentHandoff'
import { TicketStub } from '@/components/features/TicketStub'
import { PageContainer } from '@/components/layout/PageContainer'
import { Button } from '@/components/ui/Button'
import { account } from '@/data/account'
import { findEventBySlug } from '@/data/events'
import { paymentMethods } from '@/data/paymentMethods'
import { type PaymentPhase, usePaymentFlow } from '@/hooks/usePaymentFlow'
import { useTicketPrinting } from '@/hooks/useTicketPrinting'
import { readCheckoutSelection } from '@/lib/checkout'
import { cn } from '@/lib/cn'
import { formatPrice } from '@/lib/format'
import { computePrice } from '@/lib/pricing'
import { ticketReference } from '@/lib/ticket'
import { downloadTicketImage } from '@/lib/ticketImage'
import { issueTicket } from '@/lib/ticketStore'

/** Durée d'appui : assez long pour être délibéré, assez court pour ne pas lasser. */
const HOLD_DURATION = 1500

type DownloadState = 'idle' | 'working' | 'done' | 'error'

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
          className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-label-lg text-on-primary"
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
  const [download, setDownload] = useState<DownloadState>('idle')

  const selection = readCheckoutSelection(selectionState, event)
  const breakdown = computePrice(event, selection)
  const pickupPoint =
    selection.kind === 'shuttle'
      ? (event.shuttle?.pickupPoints.find((point) => point.id === selection.pickupPointId) ?? null)
      : null

  const reference = ticketReference(
    `${event.slug}:${selection.kind}:${selection.pickupPointId}:${selection.quantity}`,
  )

  const issue = useCallback(() => {
    issueTicket({
      reference,
      eventSlug: event.slug,
      kind: selection.kind,
      pickupPointId: selection.pickupPointId,
      quantity: selection.quantity,
      total: breakdown.total,
      methodId,
      issuedAt: new Date().toISOString(),
    })
  }, [breakdown.total, event.slug, methodId, reference, selection])

  const flow = usePaymentFlow({ holdDuration: HOLD_DURATION, onIssue: issue })
  useTicketPrinting(ticketRef, flow.printProgress)

  const method = paymentMethods.find((item) => item.id === methodId) ?? paymentMethods[0]!
  const isPaid = flow.phase !== 'form'

  async function saveTicket() {
    setDownload('working')

    try {
      await downloadTicketImage({
        event,
        pickupPoint,
        reference,
        holder: account.fullName,
        quantity: selection.quantity,
      })
      setDownload('done')
    } catch {
      setDownload('error')
    }
  }

  return (
    <PageContainer className="pb-16 pt-4 lg:pt-10">
      <div className="mb-5 flex items-center gap-3">
        <button
          type="button"
          aria-label="Retour à l'événement"
          onClick={() => navigate(-1)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-hairline bg-surface-container-lowest text-on-surface transition-transform active:scale-95"
        >
          <ArrowLeft aria-hidden className="h-5 w-5" />
        </button>
        <h1 className="text-headline-md text-on-surface">{headings[flow.phase]}</h1>
      </div>

      <div className="lg:grid lg:grid-cols-[1fr_420px] lg:items-start lg:gap-10">
        <TicketStub
          event={event}
          pickupPoint={pickupPoint}
          reference={reference}
          holder={account.fullName}
          quantity={selection.quantity}
          printing
          rootRef={ticketRef}
          className="lg:sticky lg:top-[92px] lg:max-w-[560px]"
        />

        <div className="mt-6 flex flex-col gap-4 lg:mt-0">
          <section className="rounded-card border border-hairline bg-surface-container-lowest p-4 shadow-glass">
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

          <section className="rounded-card border border-hairline bg-surface-container-lowest p-4 shadow-glass">
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
              <div className="mt-1.5 flex items-baseline justify-between border-t border-hairline pt-2.5">
                <dt className="text-label-lg text-on-surface">Total à payer</dt>
                <dd className="text-price text-primary">{formatPrice(breakdown.total)}</dd>
              </div>
            </dl>
            <p className="mt-1 text-[11px] text-outline">Frais de service inclus</p>
          </section>

          {flow.phase === 'form' ? <HoldToPay amount={breakdown.total} hold={flow.hold} /> : null}

          {flow.phase === 'handoff' || flow.phase === 'confirmed' || flow.phase === 'printing' ? (
            <IssuingStatus phase={flow.phase} progress={flow.printProgress} />
          ) : null}

          {flow.phase === 'issued' ? (
            <div className="flex animate-float-in flex-col gap-2.5">
              <Button size="lg" onClick={saveTicket} disabled={download === 'working'}>
                <DownloadLabel state={download} />
              </Button>
              <Button variant="ghost" size="lg" onClick={() => navigate('/mes-billets')}>
                <QrCode aria-hidden className="h-5 w-5" />
                Voir mes billets
              </Button>
              <CancelTicketButton
                reference={reference}
                onCancelled={() => navigate(`/evenements/${event.slug}`)}
              />
              {download === 'error' ? (
                <p role="alert" className="flex items-center gap-1.5 text-body-sm text-error">
                  <AlertCircle aria-hidden className="h-4 w-4 shrink-0" />
                  Le fichier n'a pas pu être créé. Votre billet reste dans « Mes billets ».
                </p>
              ) : (
                <p className="text-center text-body-sm text-outline">
                  Le billet est déjà dans votre coffre, lisible hors ligne.
                </p>
              )}
            </div>
          ) : null}
        </div>
      </div>

      {flow.phase === 'handoff' || flow.phase === 'confirmed' ? (
        <PaymentHandoff
          method={method}
          amount={breakdown.total}
          stage={flow.phase}
          onCancel={flow.cancel}
        />
      ) : null}
    </PageContainer>
  )
}

/** Le paiement n'est pas un instant mais quatre états : le titre les suit. */
const headings: Record<PaymentPhase, string> = {
  form: 'Confirmer et payer',
  handoff: 'Paiement en cours',
  confirmed: 'Paiement confirmé',
  printing: 'Émission du billet',
  issued: 'Votre billet',
}

interface IssuingStatusProps {
  phase: Exclude<PaymentPhase, 'form' | 'issued'>
  progress: number
}

/** Ce qu'il se passe pendant que le billet n'est pas encore à emporter. */
function IssuingStatus({ phase, progress }: IssuingStatusProps) {
  return (
    <div className="flex flex-col gap-2.5 rounded-full bg-surface-container px-6 py-4">
      <p className="flex items-center justify-center gap-2 text-label-lg text-on-surface">
        <Loader2 aria-hidden className="h-5 w-5 animate-spin motion-reduce:animate-none" />
        {phase === 'printing' ? 'Émission de votre billet…' : 'Retrait des fonds…'}
      </p>
      <span
        role="progressbar"
        aria-label="Progression de l'émission"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress * 100)}
        className="h-1 overflow-hidden rounded-full bg-outline-variant/40"
      >
        <span
          style={{ transform: `scaleX(${progress})` }}
          className="block h-full origin-left rounded-full bg-primary transition-transform duration-150"
        />
      </span>
    </div>
  )
}

interface DownloadLabelProps {
  state: DownloadState
}

function DownloadLabel({ state }: DownloadLabelProps) {
  if (state === 'working') {
    return (
      <>
        <Loader2 aria-hidden className="h-5 w-5 animate-spin motion-reduce:animate-none" />
        Génération du fichier…
      </>
    )
  }

  if (state === 'done') {
    return (
      <>
        <Check aria-hidden className="h-5 w-5" />
        Billet enregistré
      </>
    )
  }

  return (
    <>
      <Download aria-hidden className="h-5 w-5" />
      {state === 'error' ? 'Réessayer le téléchargement' : 'Télécharger le billet'}
    </>
  )
}
