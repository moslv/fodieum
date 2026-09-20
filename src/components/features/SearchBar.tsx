import { Search } from 'lucide-react'
import { type FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { cn } from '@/lib/cn'

type SearchScope = 'events' | 'transit'

const scopes: { id: SearchScope; label: string; placeholder: string }[] = [
  { id: 'events', label: 'Événements', placeholder: 'Un artiste, un lieu, une ville…' },
  { id: 'transit', label: 'Trajets', placeholder: 'Dakar → Saint-Louis, Saly…' },
]

/**
 * Recherche unifiée de l'accueil. Le sélecteur passe sous le champ en dessous
 * de `sm` : côte à côte, il ne laissait au champ qu'une dizaine de caractères.
 */
export function SearchBar() {
  const navigate = useNavigate()
  const [scope, setScope] = useState<SearchScope>('events')
  const [query, setQuery] = useState('')

  const activeScope = scopes.find((item) => item.id === scope) ?? scopes[0]!

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (scope === 'transit') {
      navigate('/transport')
      return
    }

    navigate(query.trim() ? `/evenements?q=${encodeURIComponent(query.trim())}` : '/evenements')
  }

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      className={cn(
        'flex flex-col gap-2 rounded-card border border-white/70 bg-white/85 px-4 py-3 shadow-glass-lg backdrop-blur-md',
        'transition-all focus-within:ring-2 focus-within:ring-primary/40 sm:flex-row sm:items-center sm:gap-3',
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-2.5">
        <Search aria-hidden className="h-5 w-5 shrink-0 text-secondary" />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={activeScope.placeholder}
          aria-label={`Rechercher parmi les ${activeScope.label.toLowerCase()}`}
          className="w-full min-w-0 bg-transparent text-body-md text-on-surface placeholder:text-secondary/70 focus:outline-none"
        />
      </div>

      <div
        role="tablist"
        aria-label="Type de recherche"
        className="flex shrink-0 items-center gap-1 self-stretch rounded-full border border-black/5 bg-surface-container/70 p-1 sm:self-auto"
      >
        {scopes.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={scope === id}
            onClick={() => setScope(id)}
            className={cn(
              'flex-1 whitespace-nowrap rounded-full px-3.5 py-1.5 text-label-sm transition-all sm:flex-none',
              scope === id
                ? 'bg-white text-primary shadow-sm'
                : 'font-medium text-secondary hover:text-on-surface',
            )}
          >
            {label}
          </button>
        ))}
      </div>
    </form>
  )
}
