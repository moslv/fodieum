import { useSyncExternalStore } from 'react'

import {
  getThemePreference,
  type ResolvedTheme,
  resolvedTheme,
  subscribeToTheme,
  type ThemePreference,
} from '@/lib/theme'

/** Le réglage choisi : « système », « clair » ou « sombre ». */
export function useThemePreference(): ThemePreference {
  return useSyncExternalStore(subscribeToTheme, getThemePreference, getThemePreference)
}

/** Le thème effectivement affiché, une fois « système » résolu. */
export function useResolvedTheme(): ResolvedTheme {
  return useSyncExternalStore(subscribeToTheme, resolvedTheme, resolvedTheme)
}
