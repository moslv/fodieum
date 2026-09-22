import { Bell, ChevronRight, CreditCard, HelpCircle, type LucideIcon, ShieldCheck, User } from 'lucide-react'

import { MobileHeader } from '@/components/layout/MobileHeader'
import { PageContainer } from '@/components/layout/PageContainer'

interface ProfileRow {
  icon: LucideIcon
  label: string
  hint: string
}

const rows: ProfileRow[] = [
  { icon: CreditCard, label: 'Moyens de paiement', hint: 'Wave · 77 123 45 67' },
  { icon: Bell, label: 'Notifications', hint: 'Rappels de départ activés' },
  { icon: ShieldCheck, label: 'Sécurité du compte', hint: 'Numéro vérifié' },
  { icon: HelpCircle, label: 'Aide et contact', hint: 'fodium@kanzey.co' },
]

export function Profile() {
  return (
    <>
      <MobileHeader />
      <PageContainer className="pb-32 pt-6 lg:max-w-3xl lg:pb-16 lg:pt-12">
        <div className="flex items-center gap-4">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-[#d86b00] text-white ring-4 ring-white">
            <User aria-hidden className="h-8 w-8" />
          </span>
          <div>
            <h1 className="text-headline-md text-on-surface">Amadou Diallo</h1>
            <p className="text-body-md text-secondary">Dakar · Membre depuis 2024</p>
          </div>
        </div>

        <ul className="mt-6 divide-y divide-black/5 overflow-hidden rounded-card border border-black/[0.06] bg-surface-container-lowest shadow-glass">
          {rows.map(({ icon: Icon, label, hint }) => (
            <li key={label}>
              <button
                type="button"
                className="flex w-full items-center gap-3 px-4 py-4 text-left transition-colors hover:bg-surface-container-low"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon aria-hidden className="h-5 w-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-label-lg text-on-surface">{label}</span>
                  <span className="block truncate text-body-sm text-secondary">{hint}</span>
                </span>
                <ChevronRight aria-hidden className="h-5 w-5 shrink-0 text-outline" />
              </button>
            </li>
          ))}
        </ul>

        <p className="mt-6 text-body-sm text-outline">
          Prototype de démonstration : aucune authentification n'est connectée.
        </p>
      </PageContainer>
    </>
  )
}
