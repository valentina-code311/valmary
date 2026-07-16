import type { QueryOptions } from '@/lib/types'
import {
  mockUsers,
  mockHeroSlides,
  mockStoryMilestones,
  mockCeremonySteps,
  mockPages,
  mockPhotoCategories,
  mockPhotoUploads,
  mockWishes,
  mockPlaylistTracks,
} from '@/lib/mock-data'

// Type-safe collection mapping
type CollectionData = {
  users: typeof mockUsers
  heroSlides: typeof mockHeroSlides
  storyMilestones: typeof mockStoryMilestones
  ceremonySteps: typeof mockCeremonySteps
  pages: typeof mockPages
  photoCategories: typeof mockPhotoCategories
  photoUploads: typeof mockPhotoUploads
  wishes: typeof mockWishes
  playlistTracks: typeof mockPlaylistTracks
}

// In-memory store for mutations (simulates Firebase real-time updates)
const store: CollectionData = {
  users: [...mockUsers],
  heroSlides: [...mockHeroSlides],
  storyMilestones: [...mockStoryMilestones],
  ceremonySteps: [...mockCeremonySteps],
  pages: [...mockPages],
  photoCategories: [...mockPhotoCategories],
  photoUploads: [...mockPhotoUploads],
  wishes: [...mockWishes],
  playlistTracks: [...mockPlaylistTracks],
}

// Simulate network delay
const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms))

// Get collection data with query options
export async function getCollection<K extends keyof CollectionData>(
  collectionName: K,
  options?: QueryOptions
): Promise<CollectionData[K]> {
  await delay()
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let data = [...store[collectionName]] as any[]

  // Apply where filters
  if (options?.where) {
    for (const filter of options.where) {
      data = data.filter(item => {
        const value = item[filter.field]
        switch (filter.operator) {
          case '==': return value === filter.value
          case '!=': return value !== filter.value
          case '<': return value < filter.value
          case '<=': return value <= filter.value
          case '>': return value > filter.value
          case '>=': return value >= filter.value
          case 'in': return (filter.value as unknown[]).includes(value)
          case 'array-contains': return Array.isArray(value) && value.includes(filter.value)
          default: return true
        }
      })
    }
  }

  // Apply orderBy
  if (options?.orderBy) {
    const { field, direction } = options.orderBy
    data.sort((a, b) => {
      const aVal = a[field]
      const bVal = b[field]
      const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0
      return direction === 'desc' ? -comparison : comparison
    })
  }

  // Apply limit
  if (options?.limit) {
    data = data.slice(0, options.limit)
  }

  return data as CollectionData[K]
}

// Get single document
export async function getDocument<K extends keyof CollectionData>(
  collectionName: K,
  documentId: string
): Promise<CollectionData[K][number] | null> {
  await delay()
  const collection = store[collectionName]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (collection as any[]).find(item => item.id === documentId) || null
}

// Create document
export async function createDocument<K extends keyof CollectionData>(
  collectionName: K,
  data: Omit<CollectionData[K][number], 'id'> & { id?: string }
): Promise<CollectionData[K][number]> {
  await delay()
  const newDoc = {
    ...data,
    id: data.id || `${collectionName}-${Date.now()}`,
  } as CollectionData[K][number]
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(store[collectionName] as any[]).push(newDoc)
  return newDoc
}

// Update document
export async function updateDocument<K extends keyof CollectionData>(
  collectionName: K,
  documentId: string,
  data: Partial<CollectionData[K][number]>
): Promise<CollectionData[K][number] | null> {
  await delay()
  const collection = store[collectionName]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const index = (collection as any[]).findIndex(item => item.id === documentId)
  
  if (index === -1) return null
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updated = { ...(collection as any[])[index], ...data }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(store[collectionName] as any[])[index] = updated
  return updated
}

// Delete document
export async function deleteDocument<K extends keyof CollectionData>(
  collectionName: K,
  documentId: string
): Promise<boolean> {
  await delay()
  const collection = store[collectionName]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const index = (collection as any[]).findIndex(item => item.id === documentId)
  
  if (index === -1) return false
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(store[collectionName] as any[]).splice(index, 1)
  return true
}

// Upload files (mock - returns fake URLs)
export async function uploadFiles(
  files: File[],
  path: string
): Promise<string[]> {
  await delay(500)
  
  return files.map((file, index) => {
    // Create a blob URL for preview purposes
    const blobUrl = URL.createObjectURL(file)
    // In production, this would return Firebase Storage URLs
    console.log(`[Mock] Uploaded ${file.name} to ${path}/${index}`)
    return blobUrl
  })
}

// Moderation service (mock)
export async function moderateWishMessage(text: string): Promise<{
  approved: boolean
  reason: string
  warningMessage: string
}> {
  await delay(200)
  
  // Simple mock moderation - check for negative keywords
  const negativePatterns = [
    /\bhate\b/i,
    /\bangry\b/i,
    /\bterrible\b/i,
    /\bawful\b/i,
    /\bdisgusting\b/i,
    /\bhorrible\b/i,
    /\bworse\b/i,
    /\bstupid\b/i,
    /\bidiot\b/i,
    /\bdumb\b/i,
  ]
  
  const isNegative = negativePatterns.some(pattern => pattern.test(text))
  
  if (isNegative) {
    return {
      approved: false,
      reason: 'Message contains inappropriate content',
      warningMessage: 'Your message appears to contain negative or inappropriate content. Please revise your message to be loving and respectful.',
    }
  }
  
  // Check minimum length
  if (text.trim().length < 10) {
    return {
      approved: false,
      reason: 'Message too short',
      warningMessage: 'Please write a more heartfelt message (at least 10 characters).',
    }
  }
  
  return {
    approved: true,
    reason: 'Message approved',
    warningMessage: '',
  }
}
