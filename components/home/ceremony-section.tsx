'use client'

import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { SectionWrapper } from '@/components/wedding/section-wrapper'
import { Button } from '@/components/ui/button'
import { ArrowRight, Leaf, Flame, Wind, Heart, Quote } from 'lucide-react'
import type { CeremonyStep, SymbolicType } from '@/lib/types'

const symbolIcons: Record<SymbolicType, React.ReactNode> = {
  earth: <Leaf className="w-6 h-6" />,
  fire: <Flame className="w-6 h-6" />,
  air: <Wind className="w-6 h-6" />,
  vows: <Heart className="w-6 h-6" />,
  words: <Quote className="w-6 h-6" />,
}

const symbolColors: Record<SymbolicType, string> = {
  earth: 'from-sage/20 to-sage/5',
  fire: 'from-orange-500/20 to-orange-500/5',
  air: 'from-sky-400/20 to-sky-400/5',
  vows: 'from-blush/20 to-blush/5',
  words: 'from-gold/20 to-gold/5',
}

interface CeremonySectionProps {
  steps: CeremonyStep[]
}

export function CeremonySection({ steps }: CeremonySectionProps) {
  const sortedSteps = [...steps].sort((a, b) => a.order - b.order)

  return (
    <SectionWrapper
      id="ceremony"
      title="The Ceremony"
      subtitle="Sacred moments"
      dividerVariant="diamond"
      className="bg-gradient-to-b from-velvet/50 to-background"
    >
      {/* Steps grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {sortedSteps.slice(0, 3).map((step) => (
          <CeremonyCard key={step.id} step={step} />
        ))}
      </div>

      {/* Bottom row for remaining steps */}
      {sortedSteps.length > 3 && (
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mt-6">
          {sortedSteps.slice(3, 5).map((step) => (
            <CeremonyCard key={step.id} step={step} />
          ))}
        </div>
      )}

      {/* CTA */}
      <div className="text-center mt-12">
        <Button
          asChild
          variant="outline"
          size="lg"
          className="border-gold/30 text-gold hover:bg-gold/10 hover:border-gold/50 gap-2"
        >
          <Link href="/ceremony">
            Discover the Full Ceremony
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </div>
    </SectionWrapper>
  )
}

function CeremonyCard({ step }: { step: CeremonyStep }) {
  return (
    <div className="group relative overflow-hidden rounded-sm border border-gold/10 bg-card/50 backdrop-blur-sm card-glow transition-all hover:border-gold/30">
      {/* Background gradient based on element type */}
      <div
        className={cn(
          'absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity',
          symbolColors[step.symbolicType]
        )}
      />

      {/* Image */}
      {step.mediaUrl && (
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={step.mediaUrl}
            alt={step.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
        </div>
      )}

      {/* Content */}
      <div className="relative p-6">
        {/* Icon */}
        <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-gold mb-4 -mt-10 relative z-10">
          {symbolIcons[step.symbolicType]}
        </div>

        <h3 className="text-xl font-semibold text-foreground mb-2">
          {step.title}
        </h3>
        
        <p className="text-muted-foreground text-sm leading-relaxed">
          {step.shortDescription}
        </p>
      </div>
    </div>
  )
}
