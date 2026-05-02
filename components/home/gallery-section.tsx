'use client'

import { useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { SectionWrapper } from '@/components/wedding/section-wrapper'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { X } from 'lucide-react'
import type { PhotoUpload, PhotoCategory } from '@/lib/types'

interface GallerySectionProps {
  photos: PhotoUpload[]
  categories: PhotoCategory[]
}

export function GallerySection({ photos, categories }: GallerySectionProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoUpload | null>(null)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  // Only show approved photos
  const approvedPhotos = photos.filter(p => p.status === 'approved')
  
  // Active categories (that have approved photos)
  const activeCategories = categories
    .filter(c => c.isActive && approvedPhotos.some(p => p.categoryId === c.id))
    .sort((a, b) => a.order - b.order)

  // Filter photos by category
  const filteredPhotos = activeCategory
    ? approvedPhotos.filter(p => p.categoryId === activeCategory)
    : approvedPhotos

  if (approvedPhotos.length === 0) {
    return null
  }

  return (
    <SectionWrapper
      id="gallery"
      title="Guest Gallery"
      subtitle="Captured moments"
      dividerVariant="simple"
      className="bg-gradient-to-b from-background to-velvet/50"
    >
      {/* Category filters */}
      {activeCategories.length > 1 && (
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          <button
            onClick={() => setActiveCategory(null)}
            className={cn(
              'px-4 py-2 text-sm tracking-wide rounded-sm border transition-all',
              !activeCategory
                ? 'bg-gold text-background border-gold'
                : 'border-gold/30 text-muted-foreground hover:text-gold hover:border-gold/50'
            )}
          >
            All Photos
          </button>
          {activeCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={cn(
                'px-4 py-2 text-sm tracking-wide rounded-sm border transition-all',
                activeCategory === category.id
                  ? 'bg-gold text-background border-gold'
                  : 'border-gold/30 text-muted-foreground hover:text-gold hover:border-gold/50'
              )}
            >
              {category.name}
            </button>
          ))}
        </div>
      )}

      {/* Photo grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredPhotos.slice(0, 8).map((photo, index) => (
          <div
            key={photo.id}
            onClick={() => setSelectedPhoto(photo)}
            className={cn(
              'group relative cursor-pointer overflow-hidden rounded-sm card-glow transition-all hover:z-10',
              index === 0 && 'md:col-span-2 md:row-span-2'
            )}
          >
            <div className={cn('relative', index === 0 ? 'aspect-square' : 'aspect-[4/3]')}>
              <Image
                src={photo.imageUrl}
                alt={photo.caption || 'Wedding photo'}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes={index === 0 ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 768px) 50vw, 25vw'}
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              {/* Caption */}
              {photo.caption && (
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform">
                  <p className="text-sm text-foreground line-clamp-2">{photo.caption}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
        <DialogContent className="max-w-4xl bg-background/95 backdrop-blur-xl border-gold/20 p-0">
          <button
            onClick={() => setSelectedPhoto(null)}
            className="absolute right-4 top-4 z-50 p-2 text-foreground/70 hover:text-foreground bg-background/80 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          {selectedPhoto && (
            <div className="relative">
              <div className="relative aspect-[4/3] md:aspect-[16/10]">
                <Image
                  src={selectedPhoto.imageUrl}
                  alt={selectedPhoto.caption || 'Wedding photo'}
                  fill
                  className="object-contain"
                  sizes="(max-width: 1024px) 100vw, 80vw"
                />
              </div>
              {selectedPhoto.caption && (
                <div className="p-4 border-t border-gold/10">
                  <p className="text-foreground">{selectedPhoto.caption}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </SectionWrapper>
  )
}
