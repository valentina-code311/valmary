import { Link } from 'react-router-dom'
import { SectionWrapper } from '@/shared/ui/section-wrapper'
import { Button } from '@/shared/ui/button'
import { ArrowRight } from 'lucide-react'
import type { StoryMilestone } from '@/shared/config/types'

interface StorySectionProps {
  milestones: StoryMilestone[]
}

export function StorySection({ milestones }: StorySectionProps) {
  const sortedMilestones = [...milestones].sort((a, b) => a.order - b.order)

  return (
    <SectionWrapper
      id="story"
      title="Our Story"
      subtitle="A journey of love"
      dividerVariant="floral"
    >
      {/* Timeline */}
      <div className="relative max-w-4xl mx-auto">
        {/* Center line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-gold/0 via-gold/40 to-gold/0 hidden md:block" />

        <div className="space-y-12 md:space-y-0">
          {sortedMilestones.map((milestone, index) => (
            <div
              key={milestone.id}
              className={`relative md:grid md:grid-cols-2 md:gap-12 md:py-8 ${
                index % 2 === 0 ? '' : 'md:text-right'
              }`}
            >
              {/* Timeline dot */}
              <div className="absolute left-1/2 top-8 -translate-x-1/2 hidden md:block">
                <div className="w-4 h-4 rounded-full bg-gold/20 border-2 border-gold flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-gold" />
                </div>
              </div>

              {/* Content */}
              <div
                className={`${
                  index % 2 === 0
                    ? 'md:col-start-1 md:pr-12'
                    : 'md:col-start-2 md:pl-12'
                }`}
              >
                <div className="group">
                  {/* Date label */}
                  <p className="text-gold/70 text-sm tracking-widest uppercase mb-2">
                    {milestone.dateLabel}
                  </p>
                  
                  {/* Title */}
                  <h3 className="text-2xl md:text-3xl font-semibold text-foreground mb-3">
                    {milestone.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {milestone.shortDescription}
                  </p>
                  
                  {/* Image */}
                  {milestone.mediaUrl && (
                    <div className="relative aspect-[3/2] rounded-sm overflow-hidden card-glow mt-4">
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

              {/* Empty column for grid alignment */}
              <div className={index % 2 === 0 ? 'md:col-start-2' : 'md:col-start-1'} />
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center mt-12">
        <Button
          asChild
          variant="outline"
          size="lg"
          className="border-gold/30 text-gold hover:bg-gold/10 hover:border-gold/50 gap-2"
        >
          <Link to="/our_love">
            Read Our Full Story
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </div>
    </SectionWrapper>
  )
}
