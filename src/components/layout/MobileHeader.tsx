import { Bell, MapPin, User } from 'lucide-react'

import { Logo } from '@/components/layout/Logo'

/**
 * Header des écrans de premier niveau sur mobile. Les écrans de détail
 * posent le leur, avec un retour à la place du logo.
 */
export function MobileHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/60 bg-white/75 pt-safe backdrop-blur-xl lg:hidden">
      <div className="flex h-16 items-center justify-between px-4">
        <Logo className="h-9 text-on-surface" />

        <div className="flex items-center gap-2.5">
          <span className="hidden items-center gap-1.5 rounded-full border border-black/5 bg-white/80 px-3 py-1 text-label-sm text-secondary sm:flex">
            <MapPin aria-hidden className="h-3.5 w-3.5 text-primary" />
            Sénégal
          </span>
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
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-[#d86b00] text-white ring-2 ring-white/80"
          >
            <User aria-hidden className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  )
}
