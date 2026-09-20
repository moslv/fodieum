import { Home, type LucideIcon, QrCode, Ticket, TramFront, User } from 'lucide-react'

export interface NavItem {
  path: string
  label: string
  icon: LucideIcon
  /** Marque l'onglet Transport, dont le service n'est pas encore ouvert. */
  upcoming?: boolean
}

/** Les cinq accès du brief, partagés par la barre mobile et le header desktop. */
export const navItems: NavItem[] = [
  { path: '/', label: 'Accueil', icon: Home },
  { path: '/evenements', label: 'Événements', icon: Ticket },
  { path: '/transport', label: 'Transport', icon: TramFront, upcoming: true },
  { path: '/mes-billets', label: 'Mes billets', icon: QrCode },
  { path: '/profil', label: 'Profil', icon: User },
]

/**
 * Index de l'onglet actif : sert à positionner l'indicateur coulissant.
 * Les sous-routes (`/evenements/:slug`) restent rattachées à leur onglet.
 */
export function activeNavIndex(pathname: string): number {
  const index = navItems.findIndex(
    (item) => item.path !== '/' && (pathname === item.path || pathname.startsWith(`${item.path}/`)),
  )

  return index === -1 ? 0 : index
}
