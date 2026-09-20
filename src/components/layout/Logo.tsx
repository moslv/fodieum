import { cn } from '@/lib/cn'

interface LogoProps {
  className?: string
  /** `mark` n'affiche que le carré, sans le mot-symbole. */
  variant?: 'full' | 'mark'
}

export function Logo({ className, variant = 'full' }: LogoProps) {
  if (variant === 'mark') {
    return (
      <svg
        aria-label="Fodium"
        className={cn('h-9 w-9', className)}
        role="img"
        viewBox="0 0 40 40"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="40" height="40" rx="12" fill="#F07E00" />
        <path d="M10 12h13M10 20h10M10 28h6" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" />
        <circle cx="23" cy="26" r="3" fill="#FFF0DE" />
      </svg>
    )
  }

  return (
    <svg
      aria-label="Fodium"
      className={cn('h-9 w-auto', className)}
      role="img"
      viewBox="0 0 160 48"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect y="4" width="40" height="40" rx="12" fill="#F07E00" />
      <path d="M14 16H27M14 24H24M14 32H20" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" />
      <circle cx="27" cy="30" r="3" fill="#FFF0DE" />
      <text
        x="48"
        y="32"
        fill="currentColor"
        fontFamily="'Plus Jakarta Sans', sans-serif"
        fontSize="24"
        fontWeight="800"
        letterSpacing="-0.5"
      >
        fodium
      </text>
      <circle cx="138" cy="18" r="3.5" fill="#F07E00" />
    </svg>
  )
}
