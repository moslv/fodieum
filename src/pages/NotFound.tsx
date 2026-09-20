import { Link } from 'react-router-dom'

import { PageContainer } from '@/components/layout/PageContainer'

export function NotFound() {
  return (
    <PageContainer className="flex min-h-dvh flex-col items-center justify-center text-center">
      <p className="text-label-sm uppercase tracking-[0.2em] text-primary">Erreur 404</p>
      <h1 className="mt-3 text-display-md text-on-surface">Page introuvable</h1>
      <p className="mt-2 text-body-lg text-secondary">
        Ce lien ne mène nulle part — l'événement a peut-être été retiré.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-label-lg text-white shadow-lg shadow-primary/25 transition-transform active:scale-95"
      >
        Retour à l'accueil
      </Link>
    </PageContainer>
  )
}
