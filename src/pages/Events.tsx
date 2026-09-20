import { MobileHeader } from '@/components/layout/MobileHeader'
import { PageContainer } from '@/components/layout/PageContainer'

export function Events() {
  return (
    <>
      <MobileHeader />
      <PageContainer className="pb-32 pt-4 lg:pb-16 lg:pt-10">
        <h1 className="text-display-md text-on-surface">Événements</h1>
      </PageContainer>
    </>
  )
}
