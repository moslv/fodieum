import { ArrowRight, QrCode, WifiOff } from 'lucide-react'
import { useMemo } from 'react'
import { Link } from 'react-router-dom'

import { TicketListCard } from '@/components/features/TicketListCard'
import { TicketStub } from '@/components/features/TicketStub'
import { MobileHeader } from '@/components/layout/MobileHeader'
import { PageContainer } from '@/components/layout/PageContainer'
import { buttonClass } from '@/components/ui/Button'
import { account } from '@/data/account'
import { demoTickets } from '@/data/tickets'
import { useCancelledTickets, useIssuedTickets } from '@/hooks/useIssuedTickets'
import { formatCountdown, formatEventTime, formatTicketDate } from '@/lib/format'
import { mergeTickets, resolveTickets } from '@/lib/ticketView'

/**
 * Le coffre à billets.
 *
 * On ouvre cet écran à l'entrée d'un lieu, pas pour parcourir un historique :
 * la page met donc en tête le billet de la prochaine séance, code prêt à
 * scanner, et range tout le reste derrière. Les billets passés restent
 * consultables plus bas, sans onglet à traverser pour atteindre l'essentiel.
 */
export function MyTickets() {
  const issued = useIssuedTickets()
  const cancelled = useCancelledTickets()

  const { next, upcoming, past } = useMemo(() => {
    const resolved = resolveTickets(mergeTickets(issued, demoTickets, cancelled))

    const valid = resolved
      .filter((item) => !item.isPast)
      .sort((a, b) => a.event.startsAt.localeCompare(b.event.startsAt))

    const [first, ...rest] = valid

    return {
      next: first ?? null,
      upcoming: rest,
      past: resolved
        .filter((item) => item.isPast)
        .sort((a, b) => b.event.startsAt.localeCompare(a.event.startsAt)),
    }
  }, [cancelled, issued])

  const validCount = next ? upcoming.length + 1 : 0

  return (
    <>
      <MobileHeader />

      <PageContainer className="flex flex-col gap-8 pb-32 pt-5 lg:max-w-6xl lg:pb-16 lg:pt-10">
        <header className="flex flex-col gap-1">
          <h1 className="text-display-md text-on-surface lg:text-display-lg">Mes billets</h1>
          <p className="font-mono text-stub-label uppercase text-outline">
            {validCount} {validCount > 1 ? 'billets valides' : 'billet valide'}
            {past.length > 0 ? ` · ${past.length} archivé${past.length > 1 ? 's' : ''}` : null}
          </p>
        </header>

        {next ? (
          <div className="flex flex-col gap-8 lg:grid lg:grid-cols-[minmax(0,460px)_1fr] lg:items-start lg:gap-12">
            <NextAccess resolved={next} />

            <div className="flex flex-col gap-8">
              {upcoming.length > 0 ? (
                <TicketSection title="Ensuite" count={upcoming.length}>
                  {upcoming.map((resolved) => (
                    <li key={resolved.ticket.reference}>
                      <TicketListCard resolved={resolved} />
                    </li>
                  ))}
                </TicketSection>
              ) : null}

              {past.length > 0 ? (
                <TicketSection title="Archives" count={past.length}>
                  {past.map((resolved) => (
                    <li key={resolved.ticket.reference}>
                      <TicketListCard resolved={resolved} />
                    </li>
                  ))}
                </TicketSection>
              ) : null}
            </div>
          </div>
        ) : (
          <EmptyState hasArchives={past.length > 0}>
            {past.map((resolved) => (
              <li key={resolved.ticket.reference}>
                <TicketListCard resolved={resolved} />
              </li>
            ))}
          </EmptyState>
        )}
      </PageContainer>
    </>
  )
}

interface NextAccessProps {
  resolved: ReturnType<typeof resolveTickets>[number]
}

/** Le billet de la prochaine séance, en pleine souche et prêt à présenter. */
function NextAccess({ resolved }: NextAccessProps) {
  const { ticket, event, pickupPoint } = resolved

  return (
    <section aria-labelledby="next-access" className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between gap-3">
        <h2 id="next-access" className="text-headline-md text-on-surface">
          Prochain accès
        </h2>
        <span className="rounded-[3px] bg-primary/10 px-2 py-1 font-mono text-stub-label uppercase text-primary-dark">
          {formatCountdown(event.startsAt)}
        </span>
      </div>

      <TicketStub
        event={event}
        pickupPoint={pickupPoint}
        reference={ticket.reference}
        holder={account.fullName}
        quantity={ticket.quantity}
      />

      <div className="flex items-center gap-2.5">
        <Link
          to={`/mes-billets/${ticket.reference}`}
          className={buttonClass({ size: 'lg', className: 'flex-1' })}
        >
          <QrCode aria-hidden className="h-5 w-5" />
          Présenter le billet
        </Link>
        <Link
          to={`/evenements/${event.slug}`}
          aria-label={`Voir la page de ${event.title}`}
          className={buttonClass({ variant: 'ghost', size: 'lg', className: 'shrink-0 px-4' })}
        >
          <ArrowRight aria-hidden className="h-5 w-5" />
        </Link>
      </div>

      <p className="flex items-center gap-2 font-mono text-stub-label uppercase text-outline">
        <WifiOff aria-hidden className="h-3.5 w-3.5 shrink-0" />
        Lisible sans réseau · {formatTicketDate(event.startsAt)} ·{' '}
        {formatEventTime(event.startsAt)}
      </p>
    </section>
  )
}

interface TicketSectionProps {
  title: string
  count: number
  children: React.ReactNode
}

function TicketSection({ title, count, children }: TicketSectionProps) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="flex items-baseline gap-2 text-headline-sm text-on-surface">
        {title}
        <span className="font-mono text-stub-label uppercase text-outline">
          {String(count).padStart(2, '0')}
        </span>
      </h2>
      <ul className="grid gap-3">{children}</ul>
    </section>
  )
}

interface EmptyStateProps {
  hasArchives: boolean
  children: React.ReactNode
}

function EmptyState({ hasArchives, children }: EmptyStateProps) {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col items-center gap-3 rounded-card border border-dashed border-outline-variant p-10 text-center">
        <QrCode aria-hidden className="h-8 w-8 text-outline-variant" />
        <p className="text-headline-sm text-on-surface">Aucun billet à venir</p>
        <p className="max-w-xs text-body-md text-secondary">
          Vos billets apparaissent ici dès le paiement, et y restent lisibles hors ligne.
        </p>
        <Link to="/evenements" className={buttonClass({ className: 'mt-1' })}>
          Découvrir les événements
        </Link>
      </div>

      {hasArchives ? (
        <TicketSection title="Archives" count={0}>
          {children}
        </TicketSection>
      ) : null}
    </div>
  )
}
