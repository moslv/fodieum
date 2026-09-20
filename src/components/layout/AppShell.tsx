import { Outlet, ScrollRestoration, useLocation } from 'react-router-dom'

import { BottomNav } from '@/components/layout/BottomNav'
import { DesktopHeader } from '@/components/layout/DesktopHeader'
import { hidesBottomNav } from '@/lib/navigation'

export function AppShell() {
  const { pathname } = useLocation()

  return (
    <div className="min-h-dvh bg-background">
      <DesktopHeader />
      <Outlet />
      {hidesBottomNav(pathname) ? null : <BottomNav />}
      <ScrollRestoration />
    </div>
  )
}
