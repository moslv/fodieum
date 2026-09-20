import { createBrowserRouter } from 'react-router-dom'

import { AppShell } from '@/components/layout/AppShell'
import { Checkout } from '@/pages/Checkout'
import { EventDetail } from '@/pages/EventDetail'
import { Events } from '@/pages/Events'
import { Home } from '@/pages/Home'
import { MyTickets } from '@/pages/MyTickets'
import { NotFound } from '@/pages/NotFound'
import { Profile } from '@/pages/Profile'
import { TicketDetail } from '@/pages/TicketDetail'
import { TransportTeaser } from '@/pages/TransportTeaser'

/**
 * Routeur de données : il débloque `ScrollRestoration` et le prop
 * `viewTransition` des liens, sur lequel repose la transition entre la carte
 * d'un événement et sa page détail.
 */
export const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/evenements', element: <Events /> },
      { path: '/evenements/:slug', element: <EventDetail /> },
      { path: '/evenements/:slug/paiement', element: <Checkout /> },
      { path: '/transport', element: <TransportTeaser /> },
      { path: '/mes-billets', element: <MyTickets /> },
      { path: '/mes-billets/:reference', element: <TicketDetail /> },
      { path: '/profil', element: <Profile /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])
