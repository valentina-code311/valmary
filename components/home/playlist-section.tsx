'use client'

import Image from 'next/image'
import { cn } from '@/lib/utils'
import { SectionWrapper } from '@/components/wedding/section-wrapper'
import { Music, ExternalLink, Play } from 'lucide-react'
import type { PlaylistTrack } from '@/lib/types'

interface PlaylistSectionProps {
  tracks: PlaylistTrack[]
}

export function PlaylistSection({ tracks }: PlaylistSectionProps) {
  const sortedTracks = [...tracks].sort((a, b) => a.order - b.order)

  if (sortedTracks.length === 0) {
    return null
  }

  return (
    <SectionWrapper
      id="playlist"
      title="Our Playlist"
      subtitle="Songs of our love"
      dividerVariant="simple"
    >
      <div className="max-w-2xl mx-auto">
        {/* Header card */}
        <div className="relative overflow-hidden rounded-t-sm bg-gradient-to-br from-gold/10 to-gold/5 border border-gold/20 p-6 mb-px">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center">
              <Music className="w-8 h-8 text-gold" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground">Wedding Playlist</h3>
              <p className="text-sm text-muted-foreground">{sortedTracks.length} songs</p>
            </div>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
        </div>

        {/* Track list */}
        <div className="border border-t-0 border-gold/20 rounded-b-sm divide-y divide-gold/10 overflow-hidden">
          {sortedTracks.map((track, index) => (
            <TrackItem key={track.id} track={track} index={index} />
          ))}
        </div>
      </div>
    </SectionWrapper>
  )
}

function TrackItem({ track, index }: { track: PlaylistTrack; index: number }) {
  return (
    <div className="group flex items-center gap-4 p-4 bg-card/30 hover:bg-card/60 transition-colors">
      {/* Index / Play icon */}
      <div className="w-8 text-center">
        <span className="text-muted-foreground text-sm group-hover:hidden">
          {index + 1}
        </span>
        <Play className="w-4 h-4 text-gold hidden group-hover:block mx-auto" />
      </div>

      {/* Cover */}
      <div className="relative w-12 h-12 rounded-sm overflow-hidden bg-muted flex-shrink-0">
        {track.coverUrl ? (
          <Image
            src={track.coverUrl}
            alt={`${track.title} cover`}
            fill
            className="object-cover"
            sizes="48px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Music className="w-5 h-5 text-muted-foreground" />
          </div>
        )}
      </div>

      {/* Track info */}
      <div className="flex-1 min-w-0">
        <p className={cn(
          'font-medium truncate transition-colors',
          track.externalUrl ? 'group-hover:text-gold' : 'text-foreground'
        )}>
          {track.title}
        </p>
        <p className="text-sm text-muted-foreground truncate">{track.artist}</p>
      </div>

      {/* Duration */}
      <span className="text-sm text-muted-foreground">{track.duration}</span>

      {/* External link */}
      {track.externalUrl && (
        <a
          href={track.externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 text-muted-foreground hover:text-gold opacity-0 group-hover:opacity-100 transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      )}
    </div>
  )
}
