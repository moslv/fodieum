import { ArrowRight, Bus, Clock, Minus, Plus, Ticket } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import type { FodiumEvent } from '@/data/types'
import { cn } from '@/lib/cn'
import { formatPrice } from '@/lib/format'
import { MAX_TICKETS_PER_ORDER } from '@/lib/pricing'
import type { PassSelectionState } from '@/hooks/usePassSelection'

/** En dessous, le point de ramassage affiche une alerte de rareté. */
const LOW_SEATS_THRESHOLD = 6

interface PassSelectorProps {
  event: FodiumEvent
  pass: PassSelectionState
  onCheckout: () => void
}

/**
 * Sélecteur de pass combiné : feuille ancrée en bas sur mobile, panneau
 * collant dans la colonne de droite sur desktop. Le point de ramassage
 * n'apparaît qu'au choix « Billet + Navette », et le total se recalcule à
 * chaque geste.
 */
export function PassSelector({ event, pass, onCheckout }: PassSelectorProps) {
  const { selection, breakdown, pickupPoint } = pass
  const hasShuttle = event.shuttle !== null
  const showPickup = hasShuttle && selection.kind === 'shuttle'

  return (
    <section
      aria-label="Choix du pass"
      className={cn(
        'fixed inset-x-0 bottom-0 z-40 mx-auto flex max-w-lg flex-col gap-3.5 rounded-t-3xl',
        'border-t border-hairline bg-surface-container-lowest/95 px-4 pb-6 pt-3 shadow-sheet backdrop-blur-xl',
        'lg:static lg:max-w-none lg:rounded-card lg:border lg:p-5 lg:shadow-glass-lg',
      )}
    >
      <span
        aria-hidden
        className="h-1 w-10 self-center rounded-full bg-surface-variant lg:hidden"
      />

      <div className={cn('grid gap-2.5', hasShuttle ? 'grid-cols-2' : 'grid-cols-1')}>
        <PassOption
          icon={Ticket}
          label="Billet seul"
          price={event.basePrice}
          selected={selection.kind === 'solo'}
          onSelect={() => pass.choosePass('solo')}
        />
        {hasShuttle && event.shuttle ? (
          <PassOption
            icon={Bus}
            label="Billet + Navette"
            price={event.basePrice + event.shuttle.supplement}
            selected={selection.kind === 'shuttle'}
            recommended
            onSelect={() => pass.choosePass('shuttle')}
          />
        ) : null}
      </div>

      {hasShuttle && event.shuttle ? (
        <div
          className={cn(
            'grid transition-all duration-300 ease-out motion-reduce:transition-none',
            showPickup ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
          )}
        >
          <div className="overflow-hidden">
            {/* `fieldset` + `legend` sortent la légende du flux et décalent la
                rangée : un groupe étiqueté par `aria-labelledby` rend la même
                sémantique sans casser la mise en page. */}
            <div
              role="group"
              aria-labelledby={`pickup-label-${event.id}`}
              className="flex flex-col gap-2 rounded-xl bg-surface-container-low p-2.5"
            >
              <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
                <span
                  id={`pickup-label-${event.id}`}
                  className="text-label-sm font-semibold text-on-surface"
                >
                  Lieu de ramassage
                </span>
                {pickupPoint ? (
                  <span className="flex items-center gap-1 text-[11px] font-medium text-tertiary">
                    <Clock aria-hidden className="h-3 w-3 shrink-0" />
                    {pickupPoint.departureTime} → {pickupPoint.returnTime}
                  </span>
                ) : null}
              </div>

              <div className="flex flex-wrap items-center gap-1.5 py-0.5">
                {event.shuttle.pickupPoints.map((point) => {
                  const isSelected = point.id === selection.pickupPointId

                  return (
                    <button
                      key={point.id}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => pass.choosePickupPoint(point.id)}
                      disabled={!showPickup}
                      className={cn(
                        'whitespace-nowrap rounded-full px-2.5 py-1 text-label-sm transition-colors',
                        isSelected
                          ? 'bg-primary text-on-primary'
                          : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container-low',
                      )}
                    >
                      {point.name}
                    </button>
                  )
                })}
              </div>

              {pickupPoint && pickupPoint.seatsLeft <= LOW_SEATS_THRESHOLD ? (
                <p className="text-[11px] font-medium text-primary-dark">
                  Plus que {pickupPoint.seatsLeft} places dans cette navette.
                </p>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

      <div className="flex items-center justify-between px-1">
        <div className="flex flex-col">
          <span className="text-label-sm text-on-surface-variant">Nombre de places</span>
          <span className="text-[11px] text-outline">Max. {MAX_TICKETS_PER_ORDER} par personne</span>
        </div>

        <div className="flex items-center gap-3 rounded-full bg-surface-container-low px-2 py-1">
          <QuantityButton
            icon={Minus}
            label="Retirer une place"
            disabled={!pass.canRemoveTicket}
            onClick={pass.removeTicket}
          />
          <span
            aria-live="polite"
            className="min-w-[28px] rounded bg-on-surface px-2.5 py-0.5 text-center text-headline-sm tracking-wider text-surface"
          >
            {selection.quantity}
          </span>
          <QuantityButton
            icon={Plus}
            label="Ajouter une place"
            disabled={!pass.canAddTicket}
            onClick={pass.addTicket}
          />
        </div>
      </div>

      <dl className="flex flex-col gap-1 border-t border-hairline pt-2.5 text-body-sm">
        <div className="flex items-baseline justify-between">
          <dt className="text-secondary">
            Billet × {selection.quantity}
          </dt>
          <dd className="text-on-surface">{formatPrice(breakdown.ticketsSubtotal)}</dd>
        </div>
        {breakdown.shuttleSubtotal > 0 && pickupPoint ? (
          <div className="flex items-baseline justify-between">
            <dt className="min-w-0 truncate text-secondary">
              Navette {pickupPoint.name} × {selection.quantity}
            </dt>
            <dd className="shrink-0 text-on-surface">{formatPrice(breakdown.shuttleSubtotal)}</dd>
          </div>
        ) : null}
      </dl>

      <div className="flex items-center justify-between gap-3 border-t border-hairline pt-3">
        <div className="flex min-w-0 flex-col">
          <div className="flex items-baseline gap-1">
            <span className="text-body-sm text-on-surface-variant">Total :</span>
            <span className="text-price text-primary">{formatPrice(breakdown.total)}</span>
          </div>
          <span className="text-[11px] text-outline">Frais de service inclus</span>
        </div>

        <Button size="lg" disabled={!pass.isComplete} onClick={onCheckout} className="shrink-0">
          Paiement
          <ArrowRight aria-hidden className="h-[18px] w-[18px]" />
        </Button>
      </div>
    </section>
  )
}

interface PassOptionProps {
  icon: typeof Ticket
  label: string
  price: number
  selected: boolean
  recommended?: boolean
  onSelect: () => void
}

function PassOption({ icon: Icon, label, price, selected, recommended, onSelect }: PassOptionProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className={cn(
        'relative flex flex-col rounded-2xl p-2.5 text-left transition-all active:scale-[0.98]',
        selected
          ? 'bg-primary-fixed/60 shadow-sm ring-2 ring-primary'
          : 'bg-surface-container-low hover:bg-surface-container',
      )}
    >
      {recommended ? (
        <span className="absolute -top-2 right-2 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-on-primary">
          Recommandé
        </span>
      ) : null}

      {/* La sélection se lit déjà à l'anneau et au fond : pas de coche qui
          viendrait disputer sa largeur au libellé. */}
      <span
        className={cn(
          'flex items-start gap-1.5 text-label-sm leading-tight',
          selected ? 'text-primary-dark' : 'text-on-surface-variant',
        )}
      >
        <Icon aria-hidden className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        {label}
      </span>

      <span className="mt-1 text-headline-sm text-on-surface">{formatPrice(price)}</span>
    </button>
  )
}

interface QuantityButtonProps {
  icon: typeof Plus
  label: string
  disabled: boolean
  onClick: () => void
}

function QuantityButton({ icon: Icon, label, disabled, onClick }: QuantityButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-container-lowest text-on-surface transition-transform active:scale-95 disabled:opacity-40"
    >
      <Icon aria-hidden className="h-4 w-4" />
    </button>
  )
}
