import { Bus, Search, X } from 'lucide-react'
import { type ReactNode, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { EventCard } from '@/components/features/EventCard'
import { MobileHeader } from '@/components/layout/MobileHeader'
import { PageContainer } from '@/components/layout/PageContainer'
import { upcomingEvents } from '@/data/events'
import type { EventCategory } from '@/data/types'
import { cn } from '@/lib/cn'
import { categoryLabels, filterEvents } from '@/lib/search'

const catalogue = upcomingEvents()

/** Seules les familles réellement présentes au catalogue sont proposées. */
const availableCategories = [...new Set(catalogue.map((event) => event.category))]

export function Events() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [category, setCategory] = useState<EventCategory | 'all'>('all')
  const [shuttleOnly, setShuttleOnly] = useState(false)

  const query = searchParams.get('q') ?? ''

  const results = useMemo(
    () => filterEvents(catalogue, { query, category, shuttleOnly }),
    [category, query, shuttleOnly],
  )

  function updateQuery(value: string) {
    // La recherche vit dans l'URL : un résultat reste partageable et le retour
    // arrière du navigateur défait bien le filtrage.
    setSearchParams(value ? { q: value } : {}, { replace: true })
  }

  return (
    <>
      <MobileHeader />

      <PageContainer className="flex flex-col gap-5 pb-32 pt-5 lg:pb-16 lg:pt-10">
        <header className="flex flex-col gap-1">
          <h1 className="text-display-md text-on-surface lg:text-display-lg">Événements</h1>
          <p className="text-body-lg text-secondary">
            {results.length} {results.length > 1 ? 'événements' : 'événement'} à venir au Sénégal.
          </p>
        </header>

        <div className="flex items-center gap-2.5 rounded-card border border-white/70 bg-white/85 px-4 py-3 shadow-glass backdrop-blur-md focus-within:ring-2 focus-within:ring-primary/40">
          <Search aria-hidden className="h-5 w-5 shrink-0 text-secondary" />
          <input
            type="search"
            value={query}
            onChange={(event) => updateQuery(event.target.value)}
            placeholder="Un artiste, un lieu, une ville…"
            aria-label="Rechercher un événement"
            className="w-full min-w-0 bg-transparent text-body-md text-on-surface placeholder:text-secondary/70 focus:outline-none"
          />
          {query ? (
            <button
              type="button"
              aria-label="Effacer la recherche"
              onClick={() => updateQuery('')}
              className="shrink-0 rounded-full p-1 text-secondary transition-colors hover:bg-surface-container hover:text-on-surface"
            >
              <X aria-hidden className="h-4 w-4" />
            </button>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <FilterChip selected={category === 'all'} onSelect={() => setCategory('all')}>
            Tout
          </FilterChip>

          {availableCategories.map((item) => (
            <FilterChip
              key={item}
              selected={category === item}
              onSelect={() => setCategory(item)}
            >
              {categoryLabels[item]}
            </FilterChip>
          ))}

          <FilterChip selected={shuttleOnly} onSelect={() => setShuttleOnly((value) => !value)}>
            <Bus aria-hidden className="h-3.5 w-3.5" />
            Avec navette
          </FilterChip>
        </div>

        {results.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-card border border-dashed border-outline-variant p-10 text-center">
            <Search aria-hidden className="h-7 w-7 text-outline-variant" />
            <p className="text-headline-sm text-on-surface">Aucun résultat</p>
            <p className="text-body-md text-secondary">
              Essayez un autre artiste, un autre lieu, ou retirez un filtre.
            </p>
          </div>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {results.map((event) => (
              <li key={event.id} className="flex">
                <EventCard event={event} className="w-full" />
              </li>
            ))}
          </ul>
        )}
      </PageContainer>
    </>
  )
}

interface FilterChipProps {
  selected: boolean
  onSelect: () => void
  children: ReactNode
}

function FilterChip({ selected, onSelect, children }: FilterChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-label-md transition-all active:scale-95',
        selected
          ? 'bg-primary text-white shadow-sm shadow-primary/25'
          : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high',
      )}
    >
      {children}
    </button>
  )
}
