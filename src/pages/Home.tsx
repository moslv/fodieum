import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

import { EventTimelineItem } from '@/components/features/EventTimelineItem'
import { FeaturedCarousel } from '@/components/features/FeaturedCarousel'
import { SearchBar } from '@/components/features/SearchBar'
import { ShortcutTiles } from '@/components/features/ShortcutTiles'
import { MobileHeader } from '@/components/layout/MobileHeader'
import { PageContainer } from '@/components/layout/PageContainer'
import { events } from '@/data/events'

const featured = events.filter((event) => event.featured)

/** Les vedettes tiennent déjà le carrousel : la frise prend la suite du calendrier. */
const upcoming = events
  .filter((event) => !event.featured)
  .sort((a, b) => a.startsAt.localeCompare(b.startsAt))

export function Home() {
  return (
    <>
      <MobileHeader />

      <PageContainer className="flex flex-col gap-7 pb-32 pt-4 lg:gap-12 lg:pb-16 lg:pt-10">
        <div className="flex flex-col gap-5 lg:grid lg:grid-cols-[1fr_380px] lg:items-end lg:gap-10">
          <div className="flex flex-col gap-4">
            <section className="flex animate-float-in flex-col gap-2">
              <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-label-sm uppercase tracking-wider text-primary">
                <span aria-hidden className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                Dakar &amp; Régions
              </span>
              <h1 className="text-display-md text-on-surface lg:text-display-lg">
                FOUGN DIEUM TAY
              </h1>
              <p className="text-body-lg text-secondary">Qu'est-ce qu'on fait ce week-end ?</p>
            </section>

            <div className="animate-float-in [animation-delay:90ms]">
              <SearchBar />
            </div>
          </div>

          <div className="animate-float-in [animation-delay:180ms]">
            <ShortcutTiles />
          </div>
        </div>

        <FeaturedCarousel events={featured} />

        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-headline-md text-on-surface lg:text-headline-lg">À venir</h2>
            <Link
              to="/evenements"
              className="flex items-center gap-1 text-label-md text-primary hover:underline"
            >
              Tout voir
              <ChevronRight aria-hidden className="h-4 w-4" />
            </Link>
          </div>

          <ul className="flex flex-col gap-6 lg:grid lg:grid-cols-3 lg:gap-6">
            {upcoming.map((event, index) => (
              <EventTimelineItem
                key={event.id}
                event={event}
                isLast={index === upcoming.length - 1}
              />
            ))}
          </ul>
        </section>
      </PageContainer>
    </>
  )
}
