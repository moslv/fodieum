import { ArrowLeft, Bus, Clock, MapPin, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'

import { PageContainer } from '@/components/layout/PageContainer'
import { SoonBadge } from '@/components/ui/SoonBadge'

const promises = [
  {
    icon: MapPin,
    title: 'Départ de votre quartier',
    body: "Plateau, Liberté 6, Keur Massar, Rufisque — vous montez près de chez vous, pas à l'autre bout de Dakar.",
  },
  {
    icon: Clock,
    title: 'Retour garanti',
    body: "L'horaire de retour est réservé en même temps que l'aller. Plus de négociation à 3 h du matin.",
  },
  {
    icon: ShieldCheck,
    title: 'Un seul justificatif',
    body: 'Le billet et la place de navette vivent sur le même QR code. Un scan à la montée, un scan à l’entrée.',
  },
]

export function TransportTeaser() {
  return (
    <PageContainer className="pb-32 pt-6 lg:pb-16 lg:pt-12">
      <Link
        to="/"
        className="mb-6 inline-flex items-center gap-2 text-label-md text-secondary transition-colors hover:text-on-surface lg:hidden"
      >
        <ArrowLeft aria-hidden className="h-4 w-4" />
        Accueil
      </Link>

      <div className="lg:mx-auto lg:max-w-2xl lg:text-center">
        <div className="flex items-center gap-2 lg:justify-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/15 to-primary/5 text-primary">
            <Bus aria-hidden className="h-6 w-6" />
          </span>
          <SoonBadge size="md" />
        </div>

        <h1 className="mt-4 text-display-md text-on-surface lg:text-display-lg">Fodium Transport</h1>
        <p className="mt-2 text-body-lg text-secondary">
          Les navettes événementielles et les trajets interurbains arrivent. En attendant, la
          navette se réserve déjà avec votre billet, directement sur la page de l'événement.
        </p>
      </div>

      <ul className="mt-8 grid gap-3 lg:mx-auto lg:max-w-4xl lg:grid-cols-3">
        {promises.map(({ icon: Icon, title, body }) => (
          <li
            key={title}
            className="rounded-card border border-black/[0.06] bg-surface-container-lowest p-5 shadow-glass"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icon aria-hidden className="h-5 w-5" />
            </span>
            <h2 className="mt-3 text-headline-sm text-on-surface">{title}</h2>
            <p className="mt-1 text-body-md text-secondary">{body}</p>
          </li>
        ))}
      </ul>

      <div className="mt-8 rounded-card border border-primary/20 bg-primary/5 p-5 lg:mx-auto lg:max-w-2xl lg:text-center">
        <p className="text-body-md text-on-surface-variant">
          Cinq événements proposent déjà une navette Fodium Express.
        </p>
        <Link
          to="/evenements"
          className="mt-3 inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-label-lg text-white shadow-lg shadow-primary/25 transition-transform active:scale-95"
        >
          Voir les événements desservis
        </Link>
      </div>
    </PageContainer>
  )
}
