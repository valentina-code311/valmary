import type {
  User,
  HeroSlide,
  StoryMilestone,
  CeremonyStep,
  Page,
  PhotoCategory,
  PhotoUpload,
  Wish,
  PlaylistTrack,
  ContentBlock,
} from './types'

// Mock Users
export const mockUsers: User[] = [
  {
    id: 'admin-1',
    name: 'Elena',
    email: 'elena@wedding.com',
    role: 'admin',
    hasAccess: true,
    avatarUrl: '/images/elena-avatar.jpg',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'admin-2',
    name: 'Sofia',
    email: 'sofia@wedding.com',
    role: 'admin',
    hasAccess: true,
    avatarUrl: '/images/sofia-avatar.jpg',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'guest-1',
    name: 'Maria Garcia',
    email: 'maria@example.com',
    role: 'guest',
    hasAccess: true,
    createdAt: new Date('2024-06-01'),
  },
  {
    id: 'guest-2',
    name: 'Carlos Rodriguez',
    email: 'carlos@example.com',
    role: 'guest',
    hasAccess: true,
    createdAt: new Date('2024-06-01'),
  },
  {
    id: 'guest-3',
    name: 'Ana Martinez',
    email: 'ana@example.com',
    role: 'guest',
    hasAccess: true,
    createdAt: new Date('2024-06-02'),
  },
]

// Mock Hero Slides
export const mockHeroSlides: HeroSlide[] = [
  {
    id: 'hero-1',
    imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&h=800&fit=crop',
    title: 'Elena & Sofia',
    subtitle: 'Two hearts, one love, forever intertwined',
    order: 1,
    isActive: true,
  },
  {
    id: 'hero-2',
    imageUrl: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1200&h=800&fit=crop',
    title: 'Our Love Story',
    subtitle: 'A journey written in the stars',
    order: 2,
    isActive: true,
  },
  {
    id: 'hero-3',
    imageUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1200&h=800&fit=crop',
    title: 'Forever Begins',
    subtitle: 'June 15, 2024',
    order: 3,
    isActive: true,
  },
]

// Mock Story Milestones
export const mockStoryMilestones: StoryMilestone[] = [
  {
    id: 'milestone-1',
    title: 'First Glance',
    dateLabel: 'September 2019',
    shortDescription: 'Our eyes met across a crowded art gallery. Little did we know that moment would change everything.',
    mediaUrl: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&h=400&fit=crop',
    order: 1,
  },
  {
    id: 'milestone-2',
    title: 'First Date',
    dateLabel: 'October 2019',
    shortDescription: 'A rainy evening, a cozy café, and conversations that lasted until dawn.',
    mediaUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop',
    order: 2,
  },
  {
    id: 'milestone-3',
    title: 'First Trip Together',
    dateLabel: 'March 2020',
    shortDescription: 'Barcelona stole our hearts, but we had already stolen each other\'s.',
    mediaUrl: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=600&h=400&fit=crop',
    order: 3,
  },
  {
    id: 'milestone-4',
    title: 'Moving In Together',
    dateLabel: 'August 2021',
    shortDescription: 'Our little apartment became the backdrop for countless memories and dreams.',
    mediaUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop',
    order: 4,
  },
  {
    id: 'milestone-5',
    title: 'The Proposal',
    dateLabel: 'December 2023',
    shortDescription: 'Under the stars, surrounded by love, she said yes. Twice.',
    mediaUrl: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=600&h=400&fit=crop',
    order: 5,
  },
]

// Mock Ceremony Steps
export const mockCeremonySteps: CeremonyStep[] = [
  {
    id: 'ceremony-1',
    title: 'Earth Ceremony',
    symbolicType: 'earth',
    shortDescription: 'Planting our roots together, grounded in love and commitment.',
    longDescription: 'The Earth Ceremony represents our foundation. Together, we planted a young olive tree, symbolizing the roots we are creating as a family. As we poured soil from our childhood homes into the same pot, we honored our pasts while nurturing our shared future. The olive tree, a symbol of peace and longevity, will grow alongside our love.',
    mediaUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=400&fit=crop',
    order: 1,
  },
  {
    id: 'ceremony-2',
    title: 'Fire Ritual',
    symbolicType: 'fire',
    shortDescription: 'Igniting the eternal flame of passion and warmth.',
    longDescription: 'The Fire Ritual celebrates the passion and warmth that ignites our relationship. We lit a unity candle using flames from candles held by our mothers, symbolizing the merging of two families into one. The fire represents transformation, purification, and the eternal flame of our love that will never be extinguished.',
    mediaUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop',
    order: 2,
  },
  {
    id: 'ceremony-3',
    title: 'Air Blessing',
    symbolicType: 'air',
    shortDescription: 'Breathing life into our promises, carried by the wind.',
    longDescription: 'The Air Blessing invited the element of breath and spirit into our union. We released biodegradable confetti into the wind, each piece carrying our wishes for the future. The air represents communication, intellect, and the invisible bonds that connect us even when apart. As the wind carried our intentions, we committed to always speaking our truth with love.',
    mediaUrl: 'https://images.unsplash.com/photo-1505455184862-554165e5f6ba?w=600&h=400&fit=crop',
    order: 3,
  },
  {
    id: 'ceremony-4',
    title: 'Exchange of Vows',
    symbolicType: 'vows',
    shortDescription: 'Words from the heart, promises for eternity.',
    longDescription: 'In this sacred moment, we spoke the words we had written for each other. Personal vows crafted over months of reflection, tears, and laughter. We promised to be each other\'s home, to celebrate triumphs and weather storms together, to choose each other every single day. These words, witnessed by our loved ones, sealed our commitment.',
    mediaUrl: 'https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?w=600&h=400&fit=crop',
    order: 4,
  },
  {
    id: 'ceremony-5',
    title: 'Words of Blessing',
    symbolicType: 'words',
    shortDescription: 'Blessings from loved ones to guide our journey.',
    longDescription: 'Our ceremony concluded with words of blessing from those who have shaped our lives. Our parents, siblings, and closest friends shared their wishes, advice, and blessings for our marriage. These words of wisdom and love from our community remind us that we are never alone on this journey.',
    mediaUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&h=400&fit=crop',
    order: 5,
  },
]

// Mock Content Blocks for Our Love Page
const ourLoveBlocks: ContentBlock[] = [
  {
    id: 'block-1',
    type: 'richText',
    content: {
      html: '<p class="text-xl leading-relaxed">Our story began in the most unexpected way, as all the best love stories do. Two paths that had been winding through life, finally intersecting at the perfect moment.</p>',
    },
    order: 1,
  },
  {
    id: 'block-2',
    type: 'image',
    content: {
      url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=1200&h=600&fit=crop',
      alt: 'Elena and Sofia at the art gallery',
      caption: 'The gallery where it all began',
    },
    order: 2,
  },
  {
    id: 'block-3',
    type: 'quote',
    content: {
      text: 'I knew in that moment, looking into her eyes, that I had found my home.',
      author: 'Elena',
    },
    order: 3,
  },
  {
    id: 'block-4',
    type: 'divider',
    content: {},
    order: 4,
  },
  {
    id: 'block-5',
    type: 'richText',
    content: {
      html: '<h2 class="text-3xl font-semibold mb-4">The First Chapter</h2><p class="leading-relaxed">It was September 2019, and the air was thick with the promise of autumn. I had walked into that art gallery on a whim, seeking refuge from the chaos of everyday life. Little did I know that within those walls, among the paintings and sculptures, I would find something far more beautiful than any masterpiece.</p>',
    },
    order: 5,
  },
  {
    id: 'block-6',
    type: 'gallery',
    content: {
      images: [
        { url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop', alt: 'Together' },
        { url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600&h=400&fit=crop', alt: 'Celebration' },
        { url: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=600&h=400&fit=crop', alt: 'Love' },
      ],
    },
    order: 6,
  },
]

// Mock Content Blocks for Ceremony Page
const ceremonyBlocks: ContentBlock[] = [
  {
    id: 'cer-block-1',
    type: 'richText',
    content: {
      html: '<p class="text-xl leading-relaxed">Our ceremony was designed to honor the elements that sustain all life, reflecting our belief that love, like nature, requires nurturing, passion, communication, and commitment to flourish.</p>',
    },
    order: 1,
  },
  {
    id: 'cer-block-2',
    type: 'quote',
    content: {
      text: 'We wanted our ceremony to be a reflection of who we are—grounded, passionate, and deeply connected to the world around us.',
      author: 'Sofia',
    },
    order: 2,
  },
  {
    id: 'cer-block-3',
    type: 'divider',
    content: {},
    order: 3,
  },
  {
    id: 'cer-block-4',
    type: 'image',
    content: {
      url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&h=600&fit=crop',
      alt: 'The ceremony setting',
      caption: 'Our sacred space, prepared with love',
    },
    order: 4,
  },
]

// Mock Pages
export const mockPages: Page[] = [
  {
    id: 'page-1',
    slug: 'our_love',
    title: 'Our Love Story',
    excerpt: 'From a chance encounter to forever. The story of how two souls found each other.',
    blocks: ourLoveBlocks,
  },
  {
    id: 'page-2',
    slug: 'ceremony',
    title: 'The Ceremony',
    excerpt: 'A celebration of love through the elements—earth, fire, air, and the sacred exchange of vows.',
    blocks: ceremonyBlocks,
  },
]

// Mock Photo Categories
export const mockPhotoCategories: PhotoCategory[] = [
  {
    id: 'cat-1',
    name: 'With the Brides',
    description: 'Capture your special moments with Elena and Sofia',
    coverImageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop',
    order: 1,
    isActive: true,
  },
  {
    id: 'cat-2',
    name: 'Venue & Decor',
    description: 'The beautiful details that made our day magical',
    coverImageUrl: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&h=300&fit=crop',
    order: 2,
    isActive: true,
  },
  {
    id: 'cat-3',
    name: 'Emotional Moments',
    description: 'The tears, the laughter, the love',
    coverImageUrl: 'https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?w=400&h=300&fit=crop',
    order: 3,
    isActive: true,
  },
  {
    id: 'cat-4',
    name: 'Dance Floor',
    description: 'When the music started and we all let loose',
    coverImageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=300&fit=crop',
    order: 4,
    isActive: true,
  },
  {
    id: 'cat-5',
    name: 'Little Details',
    description: 'The small touches that made everything perfect',
    coverImageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
    order: 5,
    isActive: true,
  },
]

// Mock Photo Uploads
export const mockPhotoUploads: PhotoUpload[] = [
  {
    id: 'upload-1',
    userId: 'guest-1',
    categoryId: 'cat-1',
    imageUrl: 'https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?w=800&h=600&fit=crop',
    caption: 'Such a beautiful moment with the brides!',
    status: 'approved',
    createdAt: new Date('2024-06-15T14:30:00'),
  },
  {
    id: 'upload-2',
    userId: 'guest-2',
    categoryId: 'cat-2',
    imageUrl: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&h=600&fit=crop',
    caption: 'The floral arrangements were stunning',
    status: 'approved',
    createdAt: new Date('2024-06-15T15:00:00'),
  },
  {
    id: 'upload-3',
    userId: 'guest-1',
    categoryId: 'cat-3',
    imageUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&h=600&fit=crop',
    caption: 'The vows had everyone in tears',
    status: 'approved',
    createdAt: new Date('2024-06-15T16:00:00'),
  },
  {
    id: 'upload-4',
    userId: 'guest-3',
    categoryId: 'cat-4',
    imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&h=600&fit=crop',
    caption: 'The dance floor was on fire!',
    status: 'pending',
    createdAt: new Date('2024-06-15T22:00:00'),
  },
]

// Mock Wishes
export const mockWishes: Wish[] = [
  {
    id: 'wish-1',
    authorName: 'Maria Garcia',
    authorType: 'guest',
    userId: 'guest-1',
    message: 'May your love continue to grow stronger with each passing day. You two are an inspiration to us all. Congratulations on finding your forever person!',
    status: 'approved',
    createdAt: new Date('2024-06-10'),
  },
  {
    id: 'wish-2',
    authorName: 'Carlos Rodriguez',
    authorType: 'guest',
    userId: 'guest-2',
    message: 'Wishing you both a lifetime of adventure, laughter, and endless love. Your wedding was absolutely magical!',
    status: 'approved',
    createdAt: new Date('2024-06-11'),
  },
  {
    id: 'wish-3',
    authorName: 'Ana Martinez',
    authorType: 'guest',
    userId: 'guest-3',
    message: 'Two beautiful souls, one incredible love story. May your journey together be filled with joy and wonder. Love you both!',
    status: 'approved',
    createdAt: new Date('2024-06-12'),
  },
  {
    id: 'wish-4',
    authorName: 'James Wilson',
    authorType: 'public',
    message: 'Your love story gives me hope. Congratulations to the happy couple!',
    status: 'approved',
    createdAt: new Date('2024-06-13'),
  },
  {
    id: 'wish-5',
    authorName: 'Sophie Chen',
    authorType: 'public',
    message: 'What a beautiful celebration of love! Wishing you both all the happiness in the world.',
    status: 'approved',
    createdAt: new Date('2024-06-14'),
  },
  {
    id: 'wish-6',
    authorName: 'David Brown',
    authorType: 'public',
    message: 'May your marriage be blessed with love, laughter, and a lifetime of beautiful memories.',
    status: 'pending',
    createdAt: new Date('2024-06-15'),
  },
]

// Mock Playlist Tracks
export const mockPlaylistTracks: PlaylistTrack[] = [
  {
    id: 'track-1',
    title: 'At Last',
    artist: 'Etta James',
    duration: '3:02',
    coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop',
    order: 1,
    externalUrl: 'https://open.spotify.com',
  },
  {
    id: 'track-2',
    title: 'Can\'t Help Falling in Love',
    artist: 'Elvis Presley',
    duration: '3:00',
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=100&h=100&fit=crop',
    order: 2,
  },
  {
    id: 'track-3',
    title: 'La Vie En Rose',
    artist: 'Édith Piaf',
    duration: '3:26',
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=100&h=100&fit=crop',
    order: 3,
  },
  {
    id: 'track-4',
    title: 'Thinking Out Loud',
    artist: 'Ed Sheeran',
    duration: '4:41',
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100&h=100&fit=crop',
    order: 4,
  },
  {
    id: 'track-5',
    title: 'All of Me',
    artist: 'John Legend',
    duration: '4:29',
    coverUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=100&h=100&fit=crop',
    order: 5,
  },
  {
    id: 'track-6',
    title: 'Perfect',
    artist: 'Ed Sheeran',
    duration: '4:23',
    coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop',
    order: 6,
  },
  {
    id: 'track-7',
    title: 'A Thousand Years',
    artist: 'Christina Perri',
    duration: '4:45',
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=100&h=100&fit=crop',
    order: 7,
  },
  {
    id: 'track-8',
    title: 'The Way You Look Tonight',
    artist: 'Frank Sinatra',
    duration: '3:23',
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=100&h=100&fit=crop',
    order: 8,
  },
]
