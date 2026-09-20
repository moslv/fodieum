import { MobileHeader } from '@/components/layout/MobileHeader'
import { PageContainer } from '@/components/layout/PageContainer'

export function Home() {
  return (
    <>
      <MobileHeader />
      <PageContainer className="pb-32 pt-4 lg:pb-16 lg:pt-10">
        <h1 className="text-display-md text-on-surface">FOUGN DIEUM TAY</h1>
        <p className="mt-1 text-body-lg text-secondary">Qu'est-ce qu'on fait ce week-end ?</p>
      </PageContainer>
    </>
  )
}
