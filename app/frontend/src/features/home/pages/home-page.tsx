import { Header } from '@/shared/layouts/header'
import { Footer } from '@/shared/layouts/footer'
import { HeroSection } from '@/features/home/components/hero-section'
import { StorySection } from '@/features/home/components/story-section'
import { CeremonySection } from '@/features/home/components/ceremony-section'
import { WishesSection } from '@/features/home/components/wishes-section'
import { GallerySection } from '@/features/home/components/gallery-section'
import { PlaylistSection } from '@/features/home/components/playlist-section'
import { useCollection } from '@/shared/hooks/use-data'
import type {
  HeroSlide,
  StoryMilestone,
  CeremonyStep,
  Wish,
  PhotoUpload,
  PhotoCategory,
  PlaylistTrack,
} from '@/shared/config/types'

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
