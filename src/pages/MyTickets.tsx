import { History, QrCode, ShieldCheck } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import { TicketListCard } from '@/components/features/TicketListCard'
import { MobileHeader } from '@/components/layout/MobileHeader'
import { PageContainer } from '@/components/layout/PageContainer'
import { demoTickets } from '@/data/tickets'
import { useIssuedTickets } from '@/hooks/useIssuedTickets'
import { cn } from '@/lib/cn'
import { mergeTickets, resolveTickets } from '@/lib/ticketView'

type TicketFilter = 'valid' | 'past'

export function MyTickets() {
  const issued = useIssuedTickets()
  const [filter, setFilter] = useState<TicketFilter>('valid')

  const { valid, past } = useMemo(() => {
    const resolved = resolveTickets(mergeTickets(issued, demoTickets))

    return {
      valid: resolved.filter((item) => !item.isPast),
      past: resolved.filter((item) => item.isPast),
    }
  }, [issued])

  const shown = filter === 'valid' ? valid : past

  return (
    <>
      <MobileHeader />

      <PageContainer className="flex flex-col gap-5 pb-32 pt-5 lg:max-w-4xl lg:pb-16 lg:pt-10">
        <header className="flex flex-col gap-1">
          <span className="flex items-center gap-2 text-label-sm uppercase tracking-wider text-primary">
            <ShieldCheck aria-hidden className="h-4 w-4" />
            Coffre-fort d'accès vérifié
          </span>
          <h1 className="text-display-md text-on-surface">Mes billets</h1>
          <p className="text-body-lg text-secondary">Vos pass d'accès officiels.</p>
        </header>

        <div
          role="tablist"
          aria-label="Filtrer les billets"
          className="flex items-center gap-1 rounded-full bg-surface-container/70 p-1"
        >
          <FilterTab
            selected={filter === 'valid'}
            onSelect={() => setFilter('valid')}
            icon={ShieldCheck}
            label={`Valides (${valid.length})`}
          />
          <FilterTab
            selected={filter === 'past'}
            onSelect={() => setFilter('past')}
            icon={History}
            label={`Passés (${past.length})`}
          />
        </div>

        {shown.length === 0 ? (
          <EmptyState filter={filter} />
        ) : (
          <ul className="flex flex-col gap-3">
            {shown.map((resolved) => (
              <li key={resolved.ticket.reference}>
                <TicketListCard resolved={resolved} />
              </li>
            ))}
          </ul>
        )}

        <aside className="flex items-center gap-4 rounded-card bg-secondary-container/60 p-5">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-white">
            <QrCode aria-hidden className="h-5 w-5" />
          </span>
          <p className="text-body-md text-on-surface-variant">
            Vos billets restent lisibles hors ligne : présentez le code à l'entrée, même sans
            réseau.
          </p>
        </aside>
      </PageContainer>
    </>
  )
}

interface FilterTabProps {
  selected: boolean
  onSelect: () => void
  icon: typeof ShieldCheck
  label: string
}

function FilterTab({ selected, onSelect, icon: Icon, label }: FilterTabProps) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={selected}
      onClick={onSelect}
      className={cn(
        'flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-2 text-label-md transition-all',
        selected ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-secondary',
      )}
    >
      <Icon aria-hidden className="h-4 w-4" />
      {label}
    </button>
  )
}

function EmptyState({ filter }: { filter: TicketFilter }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-card border border-dashed border-outline-variant p-10 text-center">
      <QrCode aria-hidden className="h-8 w-8 text-outline-variant" />
      <p className="text-headline-sm text-on-surface">
        {filter === 'valid' ? 'Aucun billet à venir' : 'Aucun billet passé'}
      </p>
      {filter === 'valid' ? (
        <Link
          to="/evenements"
          className="mt-1 inline-flex rounded-full bg-primary px-5 py-2.5 text-label-md text-white"
        >
          Découvrir les événements
        </Link>
      ) : null}
    </div>
  )
}
