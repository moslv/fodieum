import type { EventCategory, FodiumEvent } from '@/data/types'

/** Retire les accents pour que « evenement » trouve « événement ». */
function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
}

function haystack(event: FodiumEvent): string {
  return normalize(
    [event.title, event.tagline, event.venue, event.city, event.organizer.name, ...event.tags].join(
      ' ',
    ),
  )
}

export interface EventFilters {
  query: string
  category: EventCategory | 'all'
  /** Ne garder que les événements desservis par une navette. */
  shuttleOnly: boolean
}

export function filterEvents(events: FodiumEvent[], filters: EventFilters): FodiumEvent[] {
  const terms = normalize(filters.query).split(/\s+/).filter(Boolean)

  return events.filter((event) => {
    if (filters.category !== 'all' && event.category !== filters.category) return false
    if (filters.shuttleOnly && !event.shuttle) return false
    if (terms.length === 0) return true

    const text = haystack(event)
    return terms.every((term) => text.includes(term))
  })
}

export const categoryLabels: Record<EventCategory, string> = {
  festival: 'Festivals',
  concert: 'Concerts',
  soiree: 'Soirées',
  mode: 'Mode',
  humour: 'Humour',
}
