// User Types
export interface User {
  id: string
  name: string
  email: string
  role: 'guest' | 'admin'
  hasAccess: boolean
  avatarUrl?: string
  createdAt: Date
}

// Hero Slides
export interface HeroSlide {
  id: string
  imageUrl: string
  title: string
  subtitle: string
  order: number
  isActive: boolean
}

// Story Milestones
export interface StoryMilestone {
  id: string
  title: string
  dateLabel: string
  shortDescription: string
  mediaUrl?: string
  order: number
}

// Ceremony Steps
export type SymbolicType = 'earth' | 'fire' | 'air' | 'vows' | 'words'

export interface CeremonyStep {
  id: string
  title: string
  symbolicType: SymbolicType
  shortDescription: string
  longDescription: string
  mediaUrl?: string
  order: number
}

// Content Blocks
export type ContentBlockType = 
  | 'richText' 
  | 'image' 
  | 'gallery' 
  | 'video' 
  | 'audio' 
  | 'divider' 
  | 'quote' 
  | 'timeline' 
  | 'embed'

export interface ContentBlock {
  id: string
  type: ContentBlockType
  content: Record<string, unknown>
  order: number
}

// Pages
export interface Page {
  id: string
  slug: 'our_love' | 'ceremony'
  title: string
  excerpt: string
  blocks: ContentBlock[]
}

// Photo Categories
export interface PhotoCategory {
  id: string
  name: string
  description: string
  coverImageUrl?: string
  order: number
  isActive: boolean
}

// Photo Uploads
export type PhotoStatus = 'pending' | 'approved' | 'rejected'

export interface PhotoUpload {
  id: string
  userId: string
  categoryId: string
  imageUrl: string
  caption?: string
  status: PhotoStatus
  createdAt: Date
}

// Wishes
export type WishStatus = 'approved' | 'pending' | 'rejected'

export interface Wish {
  id: string
  authorName: string
  authorType: 'guest' | 'public'
  userId?: string
  message: string
  status: WishStatus
  createdAt: Date
}

// Playlist Tracks
export interface PlaylistTrack {
  id: string
  title: string
  artist: string
  duration: string
  coverUrl?: string
  order: number
  externalUrl?: string
}

// Moderation Result
export interface ModerationResult {
  approved: boolean
  reason: string
  warningMessage: string
}

// Query Options for Firebase-like patterns
export interface QueryOptions {
  where?: Array<{
    field: string
    operator: '==' | '!=' | '<' | '<=' | '>' | '>=' | 'in' | 'array-contains'
    value: unknown
  }>
  orderBy?: {
    field: string
    direction: 'asc' | 'desc'
  }
  limit?: number
  startAfter?: unknown
}

// --- Admin CMS compat: Challenges ---
export type ChallengeSubmissionStatus = 'pending' | 'approved' | 'rejected'

export interface Challenge {
  id: string
  title: string
  description: string
  points: number
  isActive: boolean
}

export interface ChallengeSubmission {
  id: string
  challengeId: string
  guestName: string
  imageUrl: string
  caption?: string
  status: ChallengeSubmissionStatus
  createdAt: Date
}

// --- Admin CMS compat: Wedding Settings ---
export interface WeddingSettings {
  brideName1: string
  brideName2: string
  weddingDate: string
  venueName: string
  venueAddress: string
  heroTitle: string
  heroSubtitle: string
  enableWishes: boolean
  requireApprovalForWishes: boolean
  enableChallenges: boolean
  guestPassword: string
  adminPassword: string
}
