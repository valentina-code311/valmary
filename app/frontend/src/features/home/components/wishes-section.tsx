import { useRef, useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/shared/utils/utils'
import { SectionWrapper } from '@/shared/ui/section-wrapper'
import { Button } from '@/shared/ui/button'
import { DecorativeFrame } from '@/shared/ui/ornamental-divider'
import { ArrowRight, ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import type { Wish } from '@/shared/config/types'

interface WishesSectionProps {
  wishes: Wish[]
}

export function WishesSection({ wishes }: WishesSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)

  // Filter to only approved wishes
  const approvedWishes = wishes.filter(w => w.status === 'approved')
  
  // Show 3 wishes at a time on desktop, 1 on mobile
  const visibleCount = 3
  const maxIndex = Math.max(0, approvedWishes.length - visibleCount)

  const goToNext = useCallback(() => {
    setCurrentIndex(prev => (prev >= maxIndex ? 0 : prev + 1))
  }, [maxIndex])

  const goToPrev = useCallback(() => {
    setCurrentIndex(prev => (prev <= 0 ? maxIndex : prev - 1))
  }, [maxIndex])

  // Auto-advance
  useEffect(() => {
    if (!isAutoPlaying || approvedWishes.length <= visibleCount) return
    const timer = setInterval(goToNext, 5000)
    return () => clearInterval(timer)
  }, [isAutoPlaying, goToNext, approvedWishes.length])

  if (approvedWishes.length === 0) {
    return null
  }

  return (
    <SectionWrapper
      id="wishes"
      title="Best Wishes"
      subtitle="Messages of love"
      dividerVariant="floral"
    >
      <div
        className="relative max-w-6xl mx-auto"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        {/* Carousel container */}
        <div ref={containerRef} className="overflow-hidden px-4">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${currentIndex * (100 / visibleCount)}%)` }}
          >
            {approvedWishes.map((wish) => (
              <div
                key={wish.id}
                className="w-full md:w-1/3 flex-shrink-0 px-3"
              >
                <WishCard wish={wish} />
              </div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        {approvedWishes.length > visibleCount && (
          <>
            <button
              onClick={goToPrev}
              className="absolute left-0 top-1/2 -translate-y-1/2 p-3 text-gold/70 hover:text-gold bg-background/80 hover:bg-background rounded-full border border-gold/20 transition-all shadow-lg"
              aria-label="Previous wishes"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 p-3 text-gold/70 hover:text-gold bg-background/80 hover:bg-background rounded-full border border-gold/20 transition-all shadow-lg"
              aria-label="Next wishes"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Dots */}
        {approvedWishes.length > visibleCount && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={cn(
                  'w-2 h-2 rounded-full transition-all',
                  i === currentIndex
                    ? 'bg-gold w-6'
                    : 'bg-gold/30 hover:bg-gold/50'
                )}
                aria-label={`Go to wish group ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="text-center mt-12">
        <Button
          asChild
          variant="outline"
          size="lg"
          className="border-gold/30 text-gold hover:bg-gold/10 hover:border-gold/50 gap-2"
        >
          <Link to="/best_wishes">
            Share Your Wishes
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </div>
    </SectionWrapper>
  )
}

function WishCard({ wish }: { wish: Wish }) {
  return (
    <DecorativeFrame className="h-full">
      <div className="bg-card/50 backdrop-blur-sm border border-gold/10 rounded-sm p-6 h-full flex flex-col">
        {/* Quote icon */}
        <Quote className="w-8 h-8 text-gold/30 mb-4" />
        
        {/* Message */}
        <p className="text-foreground/90 leading-relaxed flex-1 italic">
          &ldquo;{wish.message}&rdquo;
        </p>
        
        {/* Author */}
        <div className="mt-6 pt-4 border-t border-gold/10">
          <p className="text-gold font-medium">{wish.authorName}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {new Date(wish.createdAt).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
        </div>
      </div>
    </DecorativeFrame>
  )
}
