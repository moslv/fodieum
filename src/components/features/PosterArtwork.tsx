import type { ReactNode } from 'react'

import type { EventCategory, FodiumEvent } from '@/data/types'
import { cn } from '@/lib/cn'
import { formatDateBadge } from '@/lib/format'
import { hashPick } from '@/lib/hash'
import { posterMonogram, posterScheme } from '@/lib/poster'

/** Mention de famille imprimée en tête d'affiche. */
const categoryLabels: Record<EventCategory, string> = {
  festival: 'Festival',
  concert: 'Concert',
  soiree: 'Soirée',
  mode: 'Mode',
  humour: 'Humour',
}

type MotifKind = 'arcs' | 'bars' | 'orbits' | 'rules' | 'grid'

/**
 * Deux trames par famille : le motif reste lisible comme signe de la
 * catégorie, sans que deux festivals sortent la même affiche.
 */
const motifs: Record<EventCategory, readonly [MotifKind, MotifKind]> = {
  festival: ['arcs', 'orbits'],
  concert: ['bars', 'arcs'],
  soiree: ['orbits', 'grid'],
  mode: ['rules', 'bars'],
  humour: ['grid', 'rules'],
}

interface PosterArtworkProps {
  event: FodiumEvent
  /**
   * `thumb` sert les talons de billets (moins de 110 px de large), `card` les
   * listes, `hero` les bandeaux de la page détail.
   */
  size?: 'thumb' | 'card' | 'hero'
  className?: string
}

/**
 * Affiche sérigraphiée générée depuis les données de l'événement.
 *
 * Les trois posters photographiques du dossier de maquettes ne couvrent que
 * trois fiches : les autres se retrouvaient avec un cadre vide. Plutôt que
 * d'empiler des images de banque ou de réutiliser le visuel d'un autre
 * événement, chaque fiche sans photo reçoit une affiche composée — encre
 * plate, trame, titre au massicot — dans la tradition de l'affiche de
 * concert. Le tirage est déterministe : une même fiche garde son affiche.
 */
export function PosterArtwork({ event, size = 'card', className }: PosterArtworkProps) {
  const scheme = posterScheme(event)
  const kinds = motifs[event.category]
  const motif = hashPick(`kind:${event.id}`, 2) === 0 ? kinds[0] : kinds[1]
  const date = formatDateBadge(event.startsAt)
  const isHero = size === 'hero'

  const frame = (children: ReactNode) => (
    <div
      role="img"
      aria-label={`Affiche générée pour ${event.title}, ${event.venue} à ${event.city}`}
      style={{ backgroundColor: scheme.paper, color: scheme.type }}
      className={cn('relative h-full w-full overflow-hidden', className)}
    >
      <Motif kind={motif} seed={event.id} ink={scheme.ink} />
      {children}
    </div>
  )

  // Sous 110 px de large, un titre ne tient pas : le talon garde la trame,
  // le sigle et la date — ce qui suffit à reconnaître l'événement.
  if (size === 'thumb') {
    return frame(
      <div className="relative flex h-full flex-col items-center justify-center gap-1.5 p-2 text-center">
        <span className="font-extrabold leading-none tracking-tight" style={{ fontSize: '26px' }}>
          {posterMonogram(event.title)}
        </span>
        <span
          style={{ backgroundColor: scheme.accent, color: scheme.paper }}
          className="rounded-[3px] px-1.5 py-0.5 font-mono text-stub-label uppercase"
        >
          {date.day} {date.month}
        </span>
      </div>,
    )
  }

  return frame(
    <div className="relative flex h-full flex-col justify-end">
      {/* Bandeau de tête : la mention d'éditeur d'une affiche imprimée. */}
      <div
        style={{ borderColor: `${scheme.type}33` }}
        className="absolute inset-x-0 top-0 flex items-center justify-between gap-2 border-b px-4 py-2.5"
      >
        <span className="truncate font-mono text-stub-label uppercase opacity-70">
          Fodium · {categoryLabels[event.category]}
        </span>
        <span
          style={{ backgroundColor: scheme.accent, color: scheme.paper }}
          className="shrink-0 rounded-[3px] px-1.5 py-0.5 font-mono text-stub-label uppercase"
        >
          {date.day} {date.month}
        </span>
      </div>

      <div className={cn('flex flex-col gap-2.5', isHero ? 'p-6 sm:p-8' : 'p-4')}>
        <span
          style={{ backgroundColor: scheme.accent }}
          className={cn('block rounded-full', isHero ? 'h-1 w-12' : 'h-[3px] w-8')}
        />

        <h3
          className={cn(
            'font-extrabold uppercase leading-[0.92] tracking-[-0.02em]',
            isHero ? 'line-clamp-3 text-4xl sm:text-5xl' : 'line-clamp-2 text-[21px]',
          )}
        >
          {event.title}
        </h3>

        <p
          className={cn(
            'truncate font-mono uppercase opacity-80',
            isHero ? 'text-label-md tracking-[0.14em]' : 'text-stub-label',
          )}
        >
          {event.venue} · {event.city}
        </p>
      </div>
    </div>,
  )
}

interface MotifProps {
  kind: MotifKind
  seed: string
  ink: string
}

/**
 * Trame de fond : une seule forme géométrique, répétée. Dessinée en SVG
 * plutôt qu'en `background-image` pour rester nette à toutes les tailles et
 * garder chaque variante lisible dans le code.
 */
function Motif({ kind, seed, ink }: MotifProps) {
  const offset = hashPick(`motif:${seed}`, 5)
  const originX = 30 + hashPick(`x:${seed}`, 60)
  const originY = 10 + hashPick(`y:${seed}`, 50)

  return (
    <svg
      aria-hidden
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full"
      fill="none"
    >
      {kind === 'arcs'
        ? Array.from({ length: 6 }, (_, index) => (
            <circle
              key={index}
              cx={originX}
              cy={originY}
              r={10 + index * 14 + offset}
              stroke={ink}
              strokeWidth={5}
            />
          ))
        : null}

      {kind === 'bars'
        ? Array.from({ length: 9 }, (_, index) => (
            <rect
              key={index}
              x={index * 11.5 + 3}
              y={100 - (18 + ((index * 17 + offset * 9) % 66))}
              width={7}
              height={100}
              fill={ink}
            />
          ))
        : null}

      {kind === 'orbits'
        ? Array.from({ length: 4 }, (_, index) => (
            <circle
              key={index}
              cx={originX - 24 + index * 18}
              cy={originY + (index % 2) * 16}
              r={24}
              fill={ink}
              fillOpacity={0.55}
            />
          ))
        : null}

      {kind === 'rules'
        ? Array.from({ length: 14 }, (_, index) => (
            <rect
              key={index}
              x={-40 + index * 12}
              y={-20}
              width={4}
              height={160}
              fill={ink}
              transform={`rotate(${18 + offset} 50 50)`}
            />
          ))
        : null}

      {kind === 'grid'
        ? Array.from({ length: 8 }, (_, row) =>
            Array.from({ length: 8 }, (_, column) => (
              <circle
                key={`${row}-${column}`}
                cx={column * 13 + 7}
                cy={row * 13 + 7}
                r={(row + column + offset) % 3 === 0 ? 4.5 : 2.5}
                fill={ink}
              />
            )),
          )
        : null}
    </svg>
  )
}
