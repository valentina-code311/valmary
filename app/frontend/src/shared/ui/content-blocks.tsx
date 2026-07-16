'use client'

import Image from 'next/image'
import { cn } from '@/lib/utils'
import { OrnamentalDivider } from '@/components/wedding/ornamental-divider'
import { Quote, Play, Music } from 'lucide-react'
import type { ContentBlock } from '@/lib/types'

interface ContentBlocksProps {
  blocks: ContentBlock[]
}

export function ContentBlocks({ blocks }: ContentBlocksProps) {
  const sortedBlocks = [...blocks].sort((a, b) => a.order - b.order)

  return (
    <div className="space-y-12 max-w-3xl mx-auto">
      {sortedBlocks.map((block) => (
        <ContentBlockRenderer key={block.id} block={block} />
      ))}
    </div>
  )
}

function ContentBlockRenderer({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case 'richText':
      return <RichTextBlock content={block.content} />
    case 'image':
      return <ImageBlock content={block.content} />
    case 'gallery':
      return <GalleryBlock content={block.content} />
    case 'video':
      return <VideoBlock content={block.content} />
    case 'audio':
      return <AudioBlock content={block.content} />
    case 'divider':
      return <DividerBlock />
    case 'quote':
      return <QuoteBlock content={block.content} />
    case 'timeline':
      return <TimelineBlock content={block.content} />
    case 'embed':
      return <EmbedBlock content={block.content} />
    default:
      return null
  }
}

// Rich Text Block
function RichTextBlock({ content }: { content: Record<string, unknown> }) {
  const html = content.html as string
  
  return (
    <div 
      className="prose prose-invert prose-gold max-w-none 
        prose-headings:text-foreground prose-headings:font-semibold
        prose-p:text-foreground/80 prose-p:leading-relaxed
        prose-a:text-gold prose-a:no-underline hover:prose-a:underline
        prose-strong:text-gold prose-strong:font-semibold
        prose-blockquote:border-l-gold prose-blockquote:text-foreground/70"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

// Image Block
function ImageBlock({ content }: { content: Record<string, unknown> }) {
  const url = content.url as string
  const alt = (content.alt as string) || ''
  const caption = content.caption as string | undefined

  return (
    <figure className="space-y-4">
      <div className="relative aspect-[16/9] rounded-sm overflow-hidden card-glow">
        <Image
          src={url}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 700px"
        />
      </div>
      {caption && (
        <figcaption className="text-center text-sm text-muted-foreground italic">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

// Gallery Block
function GalleryBlock({ content }: { content: Record<string, unknown> }) {
  const images = content.images as Array<{ url: string; alt: string }>

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {images.map((image, index) => (
        <div key={index} className="relative aspect-square rounded-sm overflow-hidden card-glow group">
          <Image
            src={image.url}
            alt={image.alt}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 200px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      ))}
    </div>
  )
}

// Video Block
function VideoBlock({ content }: { content: Record<string, unknown> }) {
  const url = content.url as string
  const thumbnail = content.thumbnail as string | undefined
  const caption = content.caption as string | undefined

  return (
    <figure className="space-y-4">
      <div className="relative aspect-video rounded-sm overflow-hidden card-glow bg-muted">
        {thumbnail ? (
          <div className="relative w-full h-full group cursor-pointer">
            <Image
              src={thumbnail}
              alt="Video thumbnail"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 700px"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-background/30 group-hover:bg-background/50 transition-colors">
              <div className="w-16 h-16 rounded-full bg-gold/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Play className="w-8 h-8 text-background ml-1" />
              </div>
            </div>
          </div>
        ) : (
          <video
            src={url}
            controls
            className="w-full h-full object-cover"
            poster={thumbnail}
          />
        )}
      </div>
      {caption && (
        <figcaption className="text-center text-sm text-muted-foreground italic">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

// Audio Block
function AudioBlock({ content }: { content: Record<string, unknown> }) {
  const url = content.url as string
  const title = content.title as string | undefined

  return (
    <div className="bg-card/50 border border-gold/20 rounded-sm p-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
          <Music className="w-6 h-6 text-gold" />
        </div>
        <div className="flex-1">
          {title && <p className="font-medium text-foreground mb-2">{title}</p>}
          <audio src={url} controls className="w-full h-10" />
        </div>
      </div>
    </div>
  )
}

// Divider Block
function DividerBlock() {
  return <OrnamentalDivider variant="floral" className="my-8" />
}

// Quote Block
function QuoteBlock({ content }: { content: Record<string, unknown> }) {
  const text = content.text as string
  const author = content.author as string | undefined

  return (
    <blockquote className="relative py-8 px-6 text-center">
      <Quote className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-10 text-gold/20" />
      <p className="text-xl md:text-2xl italic text-foreground/90 leading-relaxed pt-6">
        &ldquo;{text}&rdquo;
      </p>
      {author && (
        <footer className="mt-4 text-gold font-medium">
          &mdash; {author}
        </footer>
      )}
    </blockquote>
  )
}

// Timeline Block
function TimelineBlock({ content }: { content: Record<string, unknown> }) {
  const items = content.items as Array<{
    date: string
    title: string
    description?: string
  }>

  return (
    <div className="relative pl-8 space-y-8">
      {/* Vertical line */}
      <div className="absolute left-3 top-2 bottom-2 w-px bg-gradient-to-b from-gold/40 via-gold/40 to-transparent" />
      
      {items.map((item, index) => (
        <div key={index} className="relative">
          {/* Dot */}
          <div className="absolute -left-5 top-1.5 w-3 h-3 rounded-full bg-gold/40 border-2 border-gold" />
          
          <p className="text-xs text-gold tracking-widest uppercase mb-1">
            {item.date}
          </p>
          <h4 className="text-lg font-semibold text-foreground mb-1">
            {item.title}
          </h4>
          {item.description && (
            <p className="text-muted-foreground text-sm leading-relaxed">
              {item.description}
            </p>
          )}
        </div>
      ))}
    </div>
  )
}

// Embed Block
function EmbedBlock({ content }: { content: Record<string, unknown> }) {
  const html = content.html as string

  return (
    <div 
      className={cn(
        'relative rounded-sm overflow-hidden card-glow',
        '[&>iframe]:w-full [&>iframe]:aspect-video'
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
