/**
 * Préférence de thème.
 *
 * Trois états, pas deux : « système » est le défaut, et il doit le rester tant
 * que personne n'a choisi — un visiteur qui a réglé son téléphone en sombre
 * n'a pas à le redire ici. Un choix explicite, lui, est conservé.
 *
 * Le thème lui-même n'est pas dans React : la bascule est une classe sur
 * `<html>`, posée dès le script d'amorçage d'`index.html` pour que la page ne
 * s'affiche jamais en clair avant de virer au sombre.
 */
export type ThemePreference = 'system' | 'light' | 'dark'
export type ResolvedTheme = 'light' | 'dark'

const STORAGE_KEY = 'fodium.theme'

const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)')
const listeners = new Set<() => void>()

let preference: ThemePreference = restore()

function restore(): ThemePreference {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored === 'light' || stored === 'dark' ? stored : 'system'
  } catch {
    // Stockage bloqué : on suit le système, ce qui est déjà le défaut.
    return 'system'
  }
}

function apply() {
  document.documentElement.classList.toggle('dark', resolvedTheme() === 'dark')
}

function notify() {
  listeners.forEach((listener) => listener())
}

systemPrefersDark.addEventListener('change', () => {
  if (preference !== 'system') return

  apply()
  notify()
})

apply()

export function subscribeToTheme(listener: () => void): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function getThemePreference(): ThemePreference {
  return preference
}

/** Le thème réellement appliqué, une fois « système » résolu. */
export function resolvedTheme(): ResolvedTheme {
  if (preference !== 'system') return preference

  return systemPrefersDark.matches ? 'dark' : 'light'
}

export function setThemePreference(next: ThemePreference) {
  preference = next

  try {
    localStorage.setItem(STORAGE_KEY, next)
  } catch {
    // Le thème s'appliquera quand même, il ne survivra juste pas au rechargement.
  }

  apply()
  notify()
}
