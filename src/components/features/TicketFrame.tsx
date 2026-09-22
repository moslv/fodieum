import type { ReactNode, RefObject } from 'react'

import { EventPoster } from '@/components/features/EventPoster'
import type { FodiumEvent } from '@/data/types'
import { cn } from '@/lib/cn'

interface TicketFrameProps {
  event: FodiumEvent
  /** Numéro de souche, imprimé au bas du talon. */
  serial: string
  /** Le corps imprimé : champs, code-barres, prix — selon l'usage. */
  children: ReactNode
  /** Exposé pour que la frise d'impression puisse cibler le billet. */
  rootRef?: RefObject<HTMLElement | null>
  className?: string
}

/**
 * La silhouette du billet, partagée par tous les écrans.
 *
 * Un billet garde le même format partout — au paiement, dans le coffre, en
 * liste : talon illustré à gauche, ligne de déchirure, corps imprimé à
 * droite. C'est un objet qu'on reconnaît d'un coup d'œil, pas une carte dont
 * la mise en page changerait d'un écran à l'autre. Seul le contenu du corps
 * varie.
 *
 * Le contour — angles adoucis, entailles latérales — vient de `.ticket-cut`
 * et `.ticket-shell` (voir `styles/index.css`).
 *
 * Les deux moitiés et le tampon portent un `data-tear` : c'est par là que
 * `useTicketTear` attrape le billet pour le déchirer à l'annulation. Le
 * tampon est toujours dans le document, simplement invisible — le monter au
 * moment de l'animation obligerait à attendre un rendu de React avant de
 * pouvoir l'animer.
 */
export function TicketFrame({ event, serial, children, rootRef, className }: TicketFrameProps) {
  return (
    <div className={cn('ticket-shell', className)}>
      <article
        className="ticket-cut relative flex rounded-ticket bg-surface-container-lowest"
        ref={rootRef}
      >
        {/* ---- Talon illustré ---- */}
        <div
          data-tear="stub"
          className="relative w-[86px] shrink-0 overflow-hidden rounded-l-ticket bg-surface-container sm:w-[104px]"
        >
          <EventPoster event={event} size="thumb" />
          {/* Un voile plein écraserait l'affiche générée : seul le bas est
              assombri, là où se pose le numéro de souche. */}
          <span
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/75 to-transparent"
          />
          <span
            data-print="serial"
            className="absolute inset-x-0 bottom-0 px-2 pb-2 text-center font-mono text-stub-label uppercase text-white"
          >
            N°{serial}
          </span>
        </div>

        {/* ---- Corps imprimé, au-delà de la ligne de déchirure ---- */}
        <div
          data-tear="body"
          className="flex min-w-0 flex-1 flex-col border-l-2 border-dashed border-tear"
        >
          {children}
        </div>

        <span
          aria-hidden
          data-tear="stamp"
          className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center opacity-0"
        >
          <span className="rotate-[-12deg] rounded-md border-[3px] border-error px-4 py-1 font-mono text-headline-sm uppercase tracking-[0.22em] text-error">
            Annulé
          </span>
        </span>
      </article>
    </div>
  )
}
