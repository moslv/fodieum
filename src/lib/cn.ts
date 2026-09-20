import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Fusionne des classes Tailwind en laissant la dernière gagner : un composant
 * peut ainsi exposer un `className` qui écrase réellement son style par défaut.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
