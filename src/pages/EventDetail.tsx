import { useParams } from 'react-router-dom'

import { PageContainer } from '@/components/layout/PageContainer'
import { findEventBySlug } from '@/data/events'

export function EventDetail() {
  const { slug } = useParams()
  const event = slug ? findEventBySlug(slug) : undefined

  if (!event) {
    return (
      <PageContainer className="py-24">
        <h1 className="text-headline-lg text-on-surface">Cet événement n'existe pas</h1>
      </PageContainer>
    )
  }

  return (
    <PageContainer className="pb-32 pt-4 lg:pb-16 lg:pt-10">
      <h1 className="text-display-md text-on-surface">{event.title}</h1>
    </PageContainer>
  )
}
