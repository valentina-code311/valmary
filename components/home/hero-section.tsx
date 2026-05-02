'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { HeroWrapper } from '@/components/wedding/section-wrapper'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { HeroSlide } from '@/lib/types'

interface HeroSectionProps {
  slides: HeroSlide[]
}

export function HeroSection({ slides }: HeroSectionProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const activeSlides = slides.filter(s => s.isActive).sort((a, b) => a.order - b.order)

  const goToSlide = useCallback((index: number) => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentSlide(index)
    setTimeout(() => setIsAnimating(false), 500)
  }, [isAnimating])

  const nextSlide = useCallback(() => {
    goToSlide((currentSlide + 1) % activeSlides.length)
  }, [currentSlide, activeSlides.length, goToSlide])

  const prevSlide = useCallback(() => {
    goToSlide((currentSlide - 1 + activeSlides.length) % activeSlides.length)
  }, [currentSlide, activeSlides.length, goToSlide])

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(nextSlide, 6000)
    return () => clearInterval(timer)
  }, [nextSlide])

  if (activeSlides.length === 0) {
    return null
  }

  const slide = activeSlides[currentSlide]

  return (
    <HeroWrapper>
      <div className="container mx-auto px-4 md:px-6 py-24 md:py-32 relative z-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Text Content */}
          <div className="text-center lg:text-left space-y-6 order-2 lg:order-1">
            <p className="text-gold/80 font-script text-2xl md:text-3xl animate-fade-in-up">
              Celebrating our love
            </p>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-semibold tracking-tight animate-fade-in-up">
              <span className="text-gold-gradient">{slide.title}</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-lg mx-auto lg:mx-0 animate-fade-in-up leading-relaxed">
              {slide.subtitle}
            </p>
            
            {/* Ornamental line */}
            <div className="flex items-center justify-center lg:justify-start gap-4 py-4 animate-fade-in-up">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-gold/50" />
              <span className="text-gold/60 text-sm tracking-[0.3em] uppercase">June 15, 2024</span>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-gold/50" />
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-up">
              <Button
                asChild
                size="lg"
                className="bg-gold hover:bg-gold-light text-background font-medium tracking-wide"
              >
                <Link href="/our_love">Our Love Story</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-gold/30 text-gold hover:bg-gold/10 hover:border-gold/50 tracking-wide"
              >
                <Link href="/best_wishes">Leave a Wish</Link>
              </Button>
            </div>
          </div>

          {/* Image Carousel */}
          <div className="relative order-1 lg:order-2">
            <div className="relative aspect-[4/5] md:aspect-[3/4] lg:aspect-[4/5] max-w-md mx-auto lg:max-w-none">
              {/* Decorative frame */}
              <div className="absolute -inset-3 border border-gold/20 rounded-sm" />
              <div className="absolute -inset-6 border border-gold/10 rounded-sm hidden md:block" />
              
              {/* Image */}
              <div className="relative w-full h-full overflow-hidden rounded-sm card-glow">
                {activeSlides.map((s, index) => (
                  <div
                    key={s.id}
                    className={cn(
                      'absolute inset-0 transition-all duration-700',
                      index === currentSlide
                        ? 'opacity-100 scale-100'
                        : 'opacity-0 scale-105'
                    )}
                  >
                    <Image
                      src={s.imageUrl}
                      alt={s.title}
                      fill
                      className="object-cover"
                      priority={index === 0}
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
                  </div>
                ))}
              </div>

              {/* Navigation arrows */}
              {activeSlides.length > 1 && (
                <>
                  <button
                    onClick={prevSlide}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 text-white/70 hover:text-white bg-black/20 hover:bg-black/40 rounded-full transition-all"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-white/70 hover:text-white bg-black/20 hover:bg-black/40 rounded-full transition-all"
                    aria-label="Next slide"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Dots indicator */}
              {activeSlides.length > 1 && (
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
                  {activeSlides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={cn(
                        'w-2 h-2 rounded-full transition-all',
                        index === currentSlide
                          ? 'bg-gold w-6'
                          : 'bg-gold/30 hover:bg-gold/50'
                      )}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold/3 rounded-full blur-3xl" />
    </HeroWrapper>
  )
}
