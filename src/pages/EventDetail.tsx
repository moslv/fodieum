import {
  ArrowLeft,
  BadgeCheck,
  Bookmark,
  CalendarDays,
  MapPin,
  Share2,
  Sparkles,
} from 'lucide-react'
import { type ReactNode, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { EventPoster } from '@/components/features/EventPoster'
import { PassSelector } from '@/components/features/PassSelector'
import { PageContainer } from '@/components/layout/PageContainer'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { findEventBySlug } from '@/data/events'
import type { FodiumEvent } from '@/data/types'
import { usePassSelection } from '@/hooks/usePassSelection'
import { cn } from '@/lib/cn'
import { formatEventDate, formatEventTime } from '@/lib/format'

export function EventDetail() {
  const { slug } = useParams()
  const event = slug ? findEventBySlug(slug) : undefined

  if (!event) {
    return (
      <PageContainer className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <h1 className="text-headline-lg text-on-surface">Cet événement n'existe plus</h1>
        <p className="mt-2 text-body-md text-secondary">
          Il a peut-être été retiré de la billetterie.
        </p>
        <Link
          to="/evenements"
          className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-label-lg text-on-primary"
        >
          Voir les événements
        </Link>
      </PageContainer>
    )
  }

  return <EventDetailView key={event.id} event={event} />
}

interface EventDetailViewProps {
  event: FodiumEvent
}

function EventDetailView({ event }: EventDetailViewProps) {
  const navigate = useNavigate()
  const pass = usePassSelection(event)
  const [bookmarked, setBookmarked] = useState(false)
  const [following, setFollowing] = useState(false)

  const mapQuery = encodeURIComponent(`${event.venue}, ${event.city}`)

  return (
    <div className="lg:mx-auto lg:max-w-7xl lg:px-8 lg:py-10">
      <div className="lg:grid lg:grid-cols-[1fr_420px] lg:items-start lg:gap-10">
        <div className="flex flex-col">
          <div
            className="relative aspect-[4/3] w-full overflow-hidden bg-surface-container sm:aspect-[16/9] lg:rounded-card-lg"
            style={{ viewTransitionName: `poster-${event.id}` }}
          >
            <EventPoster event={event} size="hero" />
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-black/25"
            />

            <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4 pt-safe lg:hidden">
              <IconButton label="Retour" onClick={() => navigate(-1)}>
                <ArrowLeft aria-hidden className="h-5 w-5" />
              </IconButton>

              <div className="flex items-center gap-2">
                <IconButton label="Partager">
                  <Share2 aria-hidden className="h-5 w-5" />
                </IconButton>
                <IconButton
                  label={bookmarked ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                  pressed={bookmarked}
                  onClick={() => setBookmarked((value) => !value)}
                >
                  <Bookmark
                    aria-hidden
                    className="h-5 w-5"
                    fill={bookmarked ? 'currentColor' : 'none'}
                  />
                </IconButton>
              </div>
            </div>
          </div>

          <PageContainer className="flex flex-col gap-5 pb-[26rem] pt-5 lg:max-w-none lg:px-0 lg:pb-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="primary" icon={Sparkles}>
                {event.tagline}
              </Badge>
              {event.organizer.verified ? (
                <Badge tone="dark" icon={BadgeCheck}>
                  Officiel
                </Badge>
              ) : null}
            </div>

            <div className="flex flex-col gap-2">
              <h1 className="text-display-md text-on-surface lg:text-display-lg">{event.title}</h1>

              <p className="flex items-center gap-2 text-label-lg text-primary-dark">
                <CalendarDays aria-hidden className="h-4 w-4 shrink-0 text-primary" />
                <time dateTime={event.startsAt}>
                  {formatEventDate(event.startsAt)} · {formatEventTime(event.startsAt)}
                </time>
              </p>

              <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-body-lg text-secondary">
                <span className="flex min-w-0 items-center gap-2">
                  <MapPin aria-hidden className="h-4 w-4 shrink-0 text-primary" />
                  {event.venue} · {event.city}
                </span>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-label-md text-primary hover:underline"
                >
                  Voir sur la carte
                </a>
              </p>
            </div>

            <ul className="flex flex-wrap gap-2">
              {event.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full bg-secondary-container px-3 py-1.5 text-label-md text-on-surface-variant"
                >
                  {tag}
                </li>
              ))}
            </ul>

            <section className="rounded-card border border-hairline bg-surface-container-lowest p-5 shadow-glass">
              <h2 className="text-headline-sm text-on-surface">À propos</h2>
              <p className="mt-2 text-body-lg text-on-surface-variant">{event.description}</p>
            </section>

            <section className="flex items-center gap-3 rounded-card border border-hairline bg-surface-container-lowest p-4 shadow-glass">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Sparkles aria-hidden className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-headline-sm text-on-surface">{event.organizer.name}</p>
                <p className="text-body-sm text-secondary">
                  {event.organizer.verified ? 'Organisateur certifié' : 'Organisateur'} ·{' '}
                  {event.organizer.eventCount} événements
                </p>
              </div>
              <Button
                variant={following ? 'primary' : 'secondary'}
                onClick={() => setFollowing((value) => !value)}
              >
                {following ? 'Abonné' : 'Suivre'}
              </Button>
            </section>
          </PageContainer>
        </div>

        <div className="lg:sticky lg:top-[92px]">
          <PassSelector
            event={event}
            pass={pass}
            onCheckout={() =>
              navigate(`/evenements/${event.slug}/paiement`, {
                state: pass.selection,
                viewTransition: true,
              })
            }
          />
        </div>
      </div>
    </div>
  )
}

interface IconButtonProps {
  label: string
  children: ReactNode
  pressed?: boolean
  onClick?: () => void
}

function IconButton({ label, children, pressed, onClick }: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={pressed}
      onClick={onClick}
      className={cn(
        'flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-md transition-all active:scale-95',
        pressed ? 'bg-primary text-on-primary' : 'bg-black/35 text-white hover:bg-black/50',
      )}
    >
      {children}
    </button>
  )
}
