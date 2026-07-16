import { cn } from '@/shared/utils/utils'

interface OrnamentalDividerProps {
  className?: string
  variant?: 'simple' | 'floral' | 'diamond'
}

export function OrnamentalDivider({ className, variant = 'simple' }: OrnamentalDividerProps) {
  if (variant === 'diamond') {
    return (
      <div className={cn('flex items-center justify-center gap-4 py-8', className)}>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gold/40 to-gold/60" />
        <div className="relative">
          <div className="w-3 h-3 rotate-45 border border-gold/60 bg-background" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rotate-45 bg-gold/40" />
          </div>
        </div>
        <div className="h-px flex-1 bg-gradient-to-l from-transparent via-gold/40 to-gold/60" />
      </div>
    )
  }

  if (variant === 'floral') {
    return (
      <div className={cn('flex items-center justify-center gap-3 py-8', className)}>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-gold/50" />
        <svg
          className="w-6 h-6 text-gold/60"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        >
          <path d="M12 2C12 2 14 6 14 8C14 10 12 12 12 12C12 12 10 10 10 8C10 6 12 2 12 2Z" />
          <path d="M12 12C12 12 16 14 18 14C20 14 22 12 22 12C22 12 20 10 18 10C16 10 12 12 12 12Z" />
          <path d="M12 12C12 12 8 14 6 14C4 14 2 12 2 12C2 12 4 10 6 10C8 10 12 12 12 12Z" />
          <path d="M12 12C12 12 14 16 14 18C14 20 12 22 12 22C12 22 10 20 10 18C10 16 12 12 12 12Z" />
          <circle cx="12" cy="12" r="2" fill="currentColor" />
        </svg>
        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-gold/50" />
      </div>
    )
  }

  // Simple variant
  return (
    <div className={cn('flex items-center justify-center gap-4 py-6', className)}>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gold/30 to-gold/50" />
      <div className="flex gap-1.5">
        <div className="w-1 h-1 rounded-full bg-gold/50" />
        <div className="w-1.5 h-1.5 rounded-full bg-gold/70" />
        <div className="w-1 h-1 rounded-full bg-gold/50" />
      </div>
      <div className="h-px flex-1 bg-gradient-to-l from-transparent via-gold/30 to-gold/50" />
    </div>
  )
}

// Simple gold line
export function GoldLine({ className }: { className?: string }) {
  return (
    <div className={cn('ornamental-line h-px w-full', className)} />
  )
}

// Decorative frame for cards
export function DecorativeFrame({ 
  children, 
  className 
}: { 
  children: React.ReactNode
  className?: string 
}) {
  return (
    <div className={cn('relative', className)}>
      {/* Corner decorations */}
      <div className="absolute -top-1 -left-1 w-4 h-4 border-t border-l border-gold/40" />
      <div className="absolute -top-1 -right-1 w-4 h-4 border-t border-r border-gold/40" />
      <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b border-l border-gold/40" />
      <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b border-r border-gold/40" />
      {children}
    </div>
  )
}
