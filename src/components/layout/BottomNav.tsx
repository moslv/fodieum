import { NavLink, useLocation } from 'react-router-dom'

import { SoonBadge } from '@/components/ui/SoonBadge'
import { cn } from '@/lib/cn'
import { activeNavIndex, navItems } from '@/lib/navigation'

/**
 * Barre d'onglets flottante du mobile. L'indicateur actif n'est pas redessiné
 * d'un onglet à l'autre : une seule pastille glisse, ce qui donne à la
 * navigation une continuité que cinq fonds commutés n'auraient pas.
 */
export function BottomNav() {
  const { pathname } = useLocation()
  const activeIndex = activeNavIndex(pathname)

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 px-4 pb-4 pb-safe lg:hidden">
      <nav
        aria-label="Navigation principale"
        className={cn(
          'pointer-events-auto relative mx-auto flex h-[66px] max-w-md items-center px-2',
          'rounded-full border border-hairline bg-surface-container-lowest/90 shadow-nav backdrop-blur-xl',
        )}
      >
        <span aria-hidden className="pointer-events-none absolute inset-y-[9px] left-2 right-2">
          <span
            className="block h-full w-1/5 rounded-full bg-primary/10 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
            style={{ transform: `translateX(${activeIndex * 100}%)` }}
          />
        </span>

        {navItems.map(({ path, label, icon: Icon, upcoming }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            className={({ isActive }) =>
              cn(
                'relative z-10 flex h-12 min-w-0 flex-1 flex-col items-center justify-center gap-1 transition-colors',
                isActive ? 'text-primary' : 'text-secondary hover:text-on-surface',
              )
            }
          >
            {({ isActive }) => (
              <>
                <span className="relative flex items-center justify-center">
                  <Icon aria-hidden className="h-5 w-5" strokeWidth={isActive ? 2.4 : 2} />
                  {upcoming ? <SoonBadge className="absolute -right-5 -top-1.5" /> : null}
                </span>
                <span
                  className={cn(
                    'truncate px-1 text-[10px] leading-tight',
                    isActive ? 'font-bold' : 'font-medium',
                  )}
                >
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
