import { Header } from '@/shared/layouts/header'
import { Footer } from '@/shared/layouts/footer'
import { SectionWrapper } from '@/shared/ui/section-wrapper'
import { ContentBlocks } from '@/shared/ui/content-blocks'
import { OrnamentalDivider } from '@/shared/ui/ornamental-divider'
import { useDocument, useCollection } from '@/shared/hooks/use-data'
import { Skeleton } from '@/shared/ui/skeleton'
import type { Page, StoryMilestone } from '@/shared/config/types'

export default function OurLovePage() {
  const { data: page, isLoading } = useDocument<Page>('pages', 'page-1')
  const { data: milestones } = useCollection<StoryMilestone>('storyMilestones')
  
  const sortedMilestones = [...milestones].sort((a, b) => a.order - b.order)

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-16 md:pt-40 md:pb-24">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-b from-velvet/30 to-transparent" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
          
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              <p className="text-gold/80 font-script text-3xl md:text-4xl mb-4 animate-fade-in-up">
                Once upon a time
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight mb-6 animate-fade-in-up">
                <span className="text-gold-gradient">Our Love Story</span>
              </h1>
              
              {isLoading ? (
                <Skeleton className="h-6 w-3/4 mx-auto bg-muted" />
              ) : (
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed animate-fade-in-up">
                  {page?.excerpt || 'From a chance encounter to forever. The story of how two souls found each other.'}
                </p>
              )}
              
              <OrnamentalDivider variant="floral" className="max-w-xs mx-auto mt-8" />
            </div>
          </div>
        </section>

        {/* Featured Image */}
        <section className="container mx-auto px-4 md:px-6 pb-16">
          <div className="relative max-w-4xl mx-auto">
            <div className="relative aspect-[21/9] rounded-sm overflow-hidden card-glow">
              <img
                src="https://images.unsplash.com/photo-1519741497674-611481863552?w=1400&h=600&fit=crop"
                alt="Elena and Sofia"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-background/20" />
            </div>
            
            {/* Decorative corners */}
            <div className="absolute -top-3 -left-3 w-12 h-12 border-t-2 border-l-2 border-gold/40" />
            <div className="absolute -top-3 -right-3 w-12 h-12 border-t-2 border-r-2 border-gold/40" />
            <div className="absolute -bottom-3 -left-3 w-12 h-12 border-b-2 border-l-2 border-gold/40" />
            <div className="absolute -bottom-3 -right-3 w-12 h-12 border-b-2 border-r-2 border-gold/40" />
          </div>
        </section>

        {/* Content Blocks */}
        <SectionWrapper className="pt-8">
          {isLoading ? (
            <div className="space-y-8 max-w-3xl mx-auto">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-6 w-1/3 bg-muted" />
                  <Skeleton className="h-4 w-full bg-muted" />
                  <Skeleton className="h-4 w-5/6 bg-muted" />
                  <Skeleton className="h-4 w-4/5 bg-muted" />
                </div>
              ))}
            </div>
          ) : page?.blocks ? (
            <ContentBlocks blocks={page.blocks} />
          ) : null}
        </SectionWrapper>

        {/* Full Timeline Section */}
        <SectionWrapper
          title="Our Journey"
          subtitle="Milestones of love"
          dividerVariant="diamond"
          className="bg-gradient-to-b from-background to-velvet/30"
        >
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-gold/0 via-gold/40 to-gold/0" />
              
              <div className="space-y-12">
                {sortedMilestones.map((milestone, index) => (
                  <div
                    key={milestone.id}
                    className={`relative flex flex-col md:flex-row gap-8 ${
                      index % 2 === 0 ? 'md:flex-row-reverse' : ''
                    }`}
                  >
                    {/* Timeline dot */}
                    <div className="absolute left-4 md:left-1/2 top-0 -translate-x-1/2 z-10">
                      <div className="w-8 h-8 rounded-full bg-background border-2 border-gold flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full bg-gold" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className={`md:w-1/2 pl-16 md:pl-0 ${
                      index % 2 === 0 ? 'md:pr-16 md:text-right' : 'md:pl-16'
                    }`}>
                      <div className="group">
                        <p className="text-gold/70 text-sm tracking-widest uppercase mb-2">
                          {milestone.dateLabel}
                        </p>
                        <h3 className="text-2xl md:text-3xl font-semibold text-foreground mb-3">
                          {milestone.title}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {milestone.shortDescription}
                        </p>
                        
                        {milestone.mediaUrl && (
                          <div className="relative aspect-[4/3] rounded-sm overflow-hidden card-glow mt-6">
                            <img
                              src={milestone.mediaUrl}
                              alt={milestone.title}
                              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Spacer for grid alignment */}
                    <div className="hidden md:block md:w-1/2" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </SectionWrapper>

        {/* Closing quote */}
        <section className="py-24 text-center">
          <div className="container mx-auto px-4 md:px-6">
            <OrnamentalDivider variant="floral" className="max-w-xs mx-auto mb-12" />
            <blockquote className="max-w-2xl mx-auto">
              <p className="text-2xl md:text-3xl italic text-foreground/90 leading-relaxed">
                &ldquo;In all the world, there is no heart for me like yours. In all the world, there is no love for you like mine.&rdquo;
              </p>
              <footer className="mt-6 text-gold font-script text-2xl">
                &mdash; Maya Angelou
              </footer>
            </blockquote>
            <OrnamentalDivider variant="floral" className="max-w-xs mx-auto mt-12" />
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}
