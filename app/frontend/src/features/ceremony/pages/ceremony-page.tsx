'use client'

import Image from 'next/image'
import { Header } from '@/components/wedding/header'
import { Footer } from '@/components/wedding/footer'
import { SectionWrapper } from '@/components/wedding/section-wrapper'
import { ContentBlocks } from '@/components/content/content-blocks'
import { OrnamentalDivider } from '@/components/wedding/ornamental-divider'
import { useDocument, useCollection } from '@/lib/hooks/use-data'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { Leaf, Flame, Wind, Heart, Quote } from 'lucide-react'
import type { Page, CeremonyStep, SymbolicType } from '@/lib/types'

const symbolIcons: Record<SymbolicType, React.ReactNode> = {
  earth: <Leaf className="w-8 h-8" />,
  fire: <Flame className="w-8 h-8" />,
  air: <Wind className="w-8 h-8" />,
  vows: <Heart className="w-8 h-8" />,
  words: <Quote className="w-8 h-8" />,
}

const symbolColors: Record<SymbolicType, { bg: string; border: string; text: string }> = {
  earth: { bg: 'bg-sage/10', border: 'border-sage/30', text: 'text-sage' },
  fire: { bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-400' },
  air: { bg: 'bg-sky-400/10', border: 'border-sky-400/30', text: 'text-sky-400' },
  vows: { bg: 'bg-blush/10', border: 'border-blush/30', text: 'text-blush' },
  words: { bg: 'bg-gold/10', border: 'border-gold/30', text: 'text-gold' },
}

const symbolDescriptions: Record<SymbolicType, string> = {
  earth: 'Foundation & Growth',
  fire: 'Passion & Transformation',
  air: 'Communication & Spirit',
  vows: 'Commitment & Love',
  words: 'Blessings & Wisdom',
}

export default function CeremonyPage() {
  const { data: page, isLoading } = useDocument<Page>('pages', 'page-2')
  const { data: steps } = useCollection<CeremonyStep>('ceremonySteps')
  
  const sortedSteps = [...steps].sort((a, b) => a.order - b.order)

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-16 md:pt-40 md:pb-24">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-b from-velvet/30 to-transparent" />
          <div className="absolute top-0 left-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
          
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              <p className="text-gold/80 font-script text-3xl md:text-4xl mb-4 animate-fade-in-up">
                Sacred moments
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight mb-6 animate-fade-in-up">
                <span className="text-gold-gradient">The Ceremony</span>
              </h1>
              
              {isLoading ? (
                <Skeleton className="h-6 w-3/4 mx-auto bg-muted" />
              ) : (
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed animate-fade-in-up">
                  {page?.excerpt || 'A celebration of love through the elements—earth, fire, air, and the sacred exchange of vows.'}
                </p>
              )}
              
              <OrnamentalDivider variant="diamond" className="max-w-xs mx-auto mt-8" />
            </div>
          </div>
        </section>

        {/* Elements overview */}
        <section className="container mx-auto px-4 md:px-6 pb-16">
          <div className="flex flex-wrap justify-center gap-4 md:gap-8">
            {sortedSteps.map((step) => {
              const colors = symbolColors[step.symbolicType]
              return (
                <div
                  key={step.id}
                  className={cn(
                    'flex flex-col items-center gap-2 p-4 rounded-sm border transition-all hover:scale-105',
                    colors.bg,
                    colors.border
                  )}
                >
                  <div className={colors.text}>
                    {symbolIcons[step.symbolicType]}
                  </div>
                  <span className="text-xs text-muted-foreground tracking-widest uppercase">
                    {symbolDescriptions[step.symbolicType]}
                  </span>
                </div>
              )
            })}
          </div>
        </section>

        {/* Content Blocks */}
        <SectionWrapper className="pt-0">
          {isLoading ? (
            <div className="space-y-8 max-w-3xl mx-auto">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-6 w-1/3 bg-muted" />
                  <Skeleton className="h-4 w-full bg-muted" />
                  <Skeleton className="h-4 w-5/6 bg-muted" />
                </div>
              ))}
            </div>
          ) : page?.blocks ? (
            <ContentBlocks blocks={page.blocks} />
          ) : null}
        </SectionWrapper>

        {/* Ceremony Steps - Detailed */}
        <SectionWrapper
          title="The Elements"
          subtitle="Our sacred journey"
          dividerVariant="floral"
          className="bg-gradient-to-b from-background to-velvet/30"
        >
          <div className="max-w-4xl mx-auto space-y-24">
            {sortedSteps.map((step, index) => {
              const colors = symbolColors[step.symbolicType]
              const isEven = index % 2 === 0
              
              return (
                <div
                  key={step.id}
                  className={cn(
                    'relative flex flex-col gap-8',
                    isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                  )}
                >
                  {/* Content */}
                  <div className="md:w-1/2 flex flex-col justify-center">
                    {/* Element badge */}
                    <div className={cn(
                      'inline-flex items-center gap-2 px-4 py-2 rounded-full border w-fit mb-6',
                      colors.bg,
                      colors.border
                    )}>
                      <span className={colors.text}>
                        {symbolIcons[step.symbolicType]}
                      </span>
                      <span className="text-sm tracking-widest uppercase text-foreground/70">
                        {symbolDescriptions[step.symbolicType]}
                      </span>
                    </div>
                    
                    <h3 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
                      {step.title}
                    </h3>
                    
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      {step.shortDescription}
                    </p>
                    
                    <p className="text-foreground/80 leading-relaxed">
                      {step.longDescription}
                    </p>
                  </div>

                  {/* Image */}
                  <div className="md:w-1/2">
                    {step.mediaUrl && (
                      <div className="relative">
                        <div className="relative aspect-[4/5] rounded-sm overflow-hidden card-glow">
                          <Image
                            src={step.mediaUrl}
                            alt={step.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 400px"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
                        </div>
                        
                        {/* Decorative element */}
                        <div className={cn(
                          'absolute -bottom-4 rounded-full border p-4',
                          isEven ? '-right-4' : '-left-4',
                          colors.bg,
                          colors.border
                        )}>
                          <span className={colors.text}>
                            {symbolIcons[step.symbolicType]}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </SectionWrapper>

        {/* Closing quote */}
        <section className="py-24 text-center">
          <div className="container mx-auto px-4 md:px-6">
            <OrnamentalDivider variant="diamond" className="max-w-xs mx-auto mb-12" />
            <blockquote className="max-w-2xl mx-auto">
              <p className="text-2xl md:text-3xl italic text-foreground/90 leading-relaxed">
                &ldquo;Two souls with but a single thought, two hearts that beat as one.&rdquo;
              </p>
              <footer className="mt-6 text-gold font-script text-2xl">
                &mdash; John Keats
              </footer>
            </blockquote>
            <OrnamentalDivider variant="diamond" className="max-w-xs mx-auto mt-12" />
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}
