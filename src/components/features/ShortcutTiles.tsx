import { Bus, Ticket } from 'lucide-react'
import { Link } from 'react-router-dom'

import { SoonBadge } from '@/components/ui/SoonBadge'

const tileClass =
  'group relative flex min-h-[136px] flex-col justify-between rounded-card border border-hairline bg-surface-container-lowest p-4 shadow-glass transition-all hover:-translate-y-0.5 hover:border-primary/30 active:scale-[0.98] lg:min-h-[168px] lg:p-6'

const iconClass =
  'flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary lg:h-14 lg:w-14'

const titleClass =
  'text-[17px] font-bold leading-tight text-on-surface transition-colors group-hover:text-primary lg:text-headline-md'

/** Les deux raccourcis visuels demandés par le brief. */
export function ShortcutTiles() {
  return (
    <div className="grid grid-cols-2 gap-3 lg:gap-6">
      <Link to="/evenements" className={tileClass}>
        <span className={iconClass}>
          <Ticket aria-hidden className="h-5 w-5 lg:h-6 lg:w-6" />
        </span>
        <span className="mt-3">
          <span className={`block ${titleClass}`}>Événements</span>
          <span className="mt-0.5 block text-body-sm text-secondary">Concerts, soirées</span>
        </span>
      </Link>

      <Link to="/transport" className={tileClass}>
        <span className="flex items-start justify-between">
          <span className={iconClass}>
            <Bus aria-hidden className="h-5 w-5 lg:h-6 lg:w-6" />
          </span>
          <SoonBadge size="md" />
        </span>
        <span className="mt-3">
          <span className={`block ${titleClass}`}>Transport</span>
          <span className="mt-0.5 block text-body-sm text-secondary">Navettes interurbaines</span>
        </span>
      </Link>
    </div>
  )
}
