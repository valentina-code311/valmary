import { cn } from '@/shared/utils/utils'
import { OrnamentalDivider } from './ornamental-divider'

interface SectionWrapperProps {
  children: React.ReactNode
  className?: string
  title?: string
  subtitle?: string
  showDivider?: boolean
  dividerVariant?: 'simple' | 'floral' | 'diamond'
  id?: string
}

export function SectionWrapper({
  children,
  className,
  title,
  subtitle,
  showDivider = true,
  dividerVariant = 'simple',
  id,
}: SectionWrapperProps) {
  return (
    <section id={id} className={cn('py-16 md:py-24', className)}>
      <div className="container mx-auto px-4 md:px-6">
        {(title || subtitle) && (
          <div className="text-center mb-12 md:mb-16">
            {subtitle && (
              <p className="text-gold/80 font-script text-2xl md:text-3xl mb-2 animate-fade-in-up">
                {subtitle}
              </p>
            )}
            {title && (
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground tracking-wide animate-fade-in-up">
                {title}
              </h2>
            )}
            {showDivider && <OrnamentalDivider variant={dividerVariant} className="max-w-xs mx-auto mt-4" />}
          </div>
        )}
        {children}
      </div>
    </section>
  )
}

// Hero-specific wrapper with full viewport height
export function HeroWrapper({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <section className={cn('relative min-h-screen flex items-center', className)}>
      {/* Vignette overlay */}
      <div className="absolute inset-0 vignette z-10" />
      {children}
    </section>
  )
}
