'use client'

import { Header } from '@/components/wedding/header'
import { Footer } from '@/components/wedding/footer'
import { HeroSection } from '@/components/home/hero-section'
import { StorySection } from '@/components/home/story-section'
import { CeremonySection } from '@/components/home/ceremony-section'
import { WishesSection } from '@/components/home/wishes-section'
import { GallerySection } from '@/components/home/gallery-section'
import { PlaylistSection } from '@/components/home/playlist-section'
import { useCollection } from '@/lib/hooks/use-data'
import type {
  HeroSlide,
  StoryMilestone,
  CeremonyStep,
  Wish,
  PhotoUpload,
  PhotoCategory,
  PlaylistTrack,
} from '@/lib/types'

export default function HomePage() {
  // Fetch all data
  const { data: heroSlides } = useCollection<HeroSlide>('heroSlides')
  const { data: milestones } = useCollection<StoryMilestone>('storyMilestones')
  const { data: ceremonySteps } = useCollection<CeremonyStep>('ceremonySteps')
  const { data: wishes } = useCollection<Wish>('wishes')
  const { data: photos } = useCollection<PhotoUpload>('photoUploads')
  const { data: categories } = useCollection<PhotoCategory>('photoCategories')
  const { data: tracks } = useCollection<PlaylistTrack>('playlistTracks')

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        <HeroSection slides={heroSlides} />
        <StorySection milestones={milestones} />
        <CeremonySection steps={ceremonySteps} />
        <WishesSection wishes={wishes} />
        <GallerySection photos={photos} categories={categories} />
        <PlaylistSection tracks={tracks} />
      </main>
      
      <Footer />
    </div>
  )
}
