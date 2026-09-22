import { Monitor, Moon, Sun } from 'lucide-react'

import { useResolvedTheme, useThemePreference } from '@/hooks/useTheme'
import { cn } from '@/lib/cn'
import { setThemePreference, type ThemePreference } from '@/lib/theme'

/** L'ordre du cycle : on repasse toujours par « système ». */
const cycle: Record<ThemePreference, ThemePreference> = {
  system: 'light',
  light: 'dark',
  dark: 'system',
}

const labels: Record<ThemePreference, string> = {
  system: 'Thème du système',
  light: 'Thème clair',
  dark: 'Thème sombre',
}

interface ThemeToggleProps {
  className?: string
}

/**
 * Bascule de thème, en un seul bouton.
 *
 * L'icône montre le thème *appliqué*, pas le réglage : quand on suit le
 * système, c'est le soleil ou la lune qui s'affiche, doublé d'une pastille
 * qui dit que le choix vient d'ailleurs. Le réglage complet, avec ses trois
 * options nommées, reste sur la page Profil.
 */
export function ThemeToggle({ className }: ThemeToggleProps) {
  const preference = useThemePreference()
  const resolved = useResolvedTheme()
  const Icon = resolved === 'dark' ? Moon : Sun

  return (
    <button
      type="button"
      aria-label={`${labels[preference]} — basculer vers : ${labels[cycle[preference]].toLowerCase()}`}
      onClick={() => setThemePreference(cycle[preference])}
      className={cn(
        'relative flex h-10 w-10 items-center justify-center rounded-full border border-hairline',
        'bg-surface-container-lowest text-on-surface transition-transform active:scale-95',
        className,
      )}
    >
      <Icon aria-hidden className="h-5 w-5" />
      {preference === 'system' ? (
        <span
          aria-hidden
          className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-surface-container text-outline ring-2 ring-surface"
        >
          <Monitor className="h-2.5 w-2.5" />
        </span>
      ) : null}
    </button>
  )
}
