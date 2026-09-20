import { cn } from '@/lib/cn'

interface SoonBadgeProps {
  className?: string
  /** `sm` pour la barre de navigation, `md` pour la tuile d'accueil. */
  size?: 'sm' | 'md'
}

/**
 * Pastille « Bientôt » du service Transport. Le brief impose qu'elle soit
 * vivante : un reflet la balaie en continu et un halo pulse autour d'elle.
 */
export function SoonBadge({ className, size = 'sm' }: SoonBadgeProps) {
  return (
    <span
      className={cn(
        'relative inline-flex select-none items-center overflow-hidden rounded-full',
        'bg-gradient-to-r from-primary to-[#d86b00] font-bold uppercase tracking-[0.12em] text-white',
        'animate-halo motion-reduce:animate-none',
        size === 'sm' ? 'px-1.5 py-0.5 text-[8px] leading-none' : 'px-2.5 py-1 text-[10px]',
        className,
      )}
    >
      <span className="relative z-10">Bientôt</span>
      <span
        aria-hidden
        className="absolute inset-y-0 -left-4 w-6 animate-shimmer bg-white/45 blur-[3px] motion-reduce:hidden"
      />
    </span>
  )
}
