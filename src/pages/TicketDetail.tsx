import { ArrowLeft, Check, Share2, Ticket as TicketIcon } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { TicketStub } from '@/components/features/TicketStub'
import { PageContainer } from '@/components/layout/PageContainer'
import { Button } from '@/components/ui/Button'
import { account } from '@/data/account'
import { demoTickets } from '@/data/tickets'
import { useIssuedTickets } from '@/hooks/useIssuedTickets'
import { mergeTickets, resolveTicket } from '@/lib/ticketView'

export function TicketDetail() {
  const { reference } = useParams()
  const navigate = useNavigate()
  const issued = useIssuedTickets()
  const [shared, setShared] = useState(false)

  const stored = mergeTickets(issued, demoTickets).find((item) => item.reference === reference)
  const resolved = stored ? resolveTicket(stored) : null

  if (!resolved) {
    return (
      <PageContainer className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <TicketIcon aria-hidden className="h-8 w-8 text-outline-variant" />
        <h1 className="mt-3 text-headline-lg text-on-surface">Billet introuvable</h1>
        <Link
          to="/mes-billets"
          className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-label-lg text-white"
        >
          Retour à mes billets
        </Link>
      </PageContainer>
    )
  }

  const { ticket, event, pickupPoint, isPast } = resolved

  async function share() {
    const url = window.location.href

    try {
      if (navigator.share) {
        await navigator.share({ title: event.title, url })
      } else {
        await navigator.clipboard.writeText(url)
      }
      setShared(true)
    } catch {
      // Partage refusé ou annulé : rien à signaler.
    }
  }

  return (
    <PageContainer className="flex flex-col gap-5 pb-32 pt-4 lg:max-w-2xl lg:pb-16 lg:pt-10">
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Retour à mes billets"
          onClick={() => navigate('/mes-billets')}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-black/5 bg-white/80 text-on-surface shadow-glass transition-transform active:scale-95"
        >
          <ArrowLeft aria-hidden className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-headline-md text-on-surface">Billet d'accès officiel</h1>
          <p className="text-label-sm uppercase tracking-wider text-primary">
            {isPast ? 'Billet utilisé' : 'Accès garanti · Sécurisé'}
          </p>
        </div>
      </div>

      <TicketStub
        event={event}
        pickupPoint={pickupPoint}
        reference={ticket.reference}
        holder={account.fullName}
        quantity={ticket.quantity}
      />

      <div className="flex flex-col gap-2.5">
        <Button size="lg" onClick={share}>
          {shared ? (
            <>
              <Check aria-hidden className="h-5 w-5" />
              Lien copié
            </>
          ) : (
            <>
              <Share2 aria-hidden className="h-5 w-5" />
              Partager le billet
            </>
          )}
        </Button>
        <Button variant="ghost" size="lg" onClick={() => navigate(`/evenements/${event.slug}`)}>
          Voir l'événement
        </Button>
      </div>

      <p className="text-center text-body-sm text-outline">
        Présentez ce code à l'entrée. Il reste lisible sans réseau.
      </p>
    </PageContainer>
  )
}
