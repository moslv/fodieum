import { Outlet, ScrollRestoration } from 'react-router-dom'

import { BottomNav } from '@/components/layout/BottomNav'
import { DesktopHeader } from '@/components/layout/DesktopHeader'

export function AppShell() {
  return (
    <div className="min-h-dvh bg-background">
      <DesktopHeader />
      <Outlet />
      <BottomNav />
      <ScrollRestoration />
    </div>
  )
}
