import { Bell, MapPin, User } from 'lucide-react'
import { NavLink } from 'react-router-dom'

import { Logo } from '@/components/layout/Logo'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

/**
 * Header des écrans de premier niveau sur mobile. Les écrans de détail
 * posent le leur, avec un retour à la place du logo.
 */
export function MobileHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-background/80 pt-safe backdrop-blur-xl lg:hidden">
      <div className="flex h-16 items-center justify-between px-4">
        <Logo className="h-9 text-on-surface" />

        <div className="flex items-center gap-2.5">
          <span className="hidden items-center gap-1.5 rounded-full bg-surface-container px-3 py-1 text-label-sm text-secondary sm:flex">
            <MapPin aria-hidden className="h-3.5 w-3.5 text-primary" />
            Sénégal
          </span>
          <ThemeToggle />
          <button
            type="button"
            aria-label="Notifications"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-hairline bg-surface-container-lowest text-on-surface transition-transform active:scale-95"
          >
            <Bell aria-hidden className="h-5 w-5" />
          </button>
          <NavLink
            to="/profil"
            aria-label="Mon profil"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-[#d86b00] text-on-primary ring-2 ring-surface transition-transform active:scale-95"
          >
            <User aria-hidden className="h-5 w-5" />
          </NavLink>
        </div>
      </div>
    </header>
  )
}
