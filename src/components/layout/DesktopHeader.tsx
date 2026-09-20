import { Bell, MapPin, Search, User } from 'lucide-react'
import { NavLink } from 'react-router-dom'

import { Logo } from '@/components/layout/Logo'
import { SoonBadge } from '@/components/ui/SoonBadge'
import { cn } from '@/lib/cn'
import { navItems } from '@/lib/navigation'

/**
 * Header horizontal à partir de `lg`. Le brief interdit la barre flottante
 * sur grand écran : les cinq mêmes accès passent ici en ligne.
 */
export function DesktopHeader() {
  return (
    <header className="sticky top-0 z-50 hidden border-b border-white/60 bg-white/75 backdrop-blur-xl lg:block">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center gap-8 px-8">
        <NavLink to="/" aria-label="Fodium — accueil" className="shrink-0 text-on-surface">
          <Logo />
        </NavLink>

        <nav aria-label="Navigation principale" className="flex flex-1 items-center gap-1">
          {navItems.map(({ path, label, icon: Icon, upcoming }) => (
            <NavLink
              key={path}
              to={path}
              end={path === '/'}
              className={({ isActive }) =>
                cn(
                  'relative flex items-center gap-2 rounded-full px-4 py-2 text-label-lg transition-colors',
                  isActive ? 'text-primary' : 'text-secondary hover:bg-surface-container/60 hover:text-on-surface',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon aria-hidden className="h-[18px] w-[18px]" strokeWidth={isActive ? 2.4 : 2} />
                  <span>{label}</span>
                  {upcoming ? <SoonBadge /> : null}
                  {isActive ? (
                    <span
                      aria-hidden
                      className="absolute inset-x-4 -bottom-[15px] h-[3px] rounded-full bg-primary"
                    />
                  ) : null}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2.5">
          <span className="flex items-center gap-1.5 rounded-full border border-black/5 bg-white/80 px-3 py-1.5 text-label-sm text-secondary">
            <MapPin aria-hidden className="h-3.5 w-3.5 text-primary" />
            Sénégal
          </span>
          <button
            type="button"
            aria-label="Rechercher"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/80 bg-white/80 text-on-surface shadow-glass transition-transform active:scale-95"
          >
            <Search aria-hidden className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Notifications"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/80 bg-white/80 text-on-surface shadow-glass transition-transform active:scale-95"
          >
            <Bell aria-hidden className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Mon profil"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-[#d86b00] text-white ring-2 ring-white/80"
          >
            <User aria-hidden className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  )
}
