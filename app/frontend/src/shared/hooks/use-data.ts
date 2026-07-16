import useSWR, { mutate } from 'swr'
import { useCallback, useState } from 'react'
import type { QueryOptions } from '@/shared/config/types'
import {
  getCollection,
  getDocument,
  createDocument,
  updateDocument,
  deleteDocument,
  uploadFiles,
  moderateWishMessage,
  getWeddingSettings,
} from '@/shared/utils/mock-service'

// Collection names type
type CollectionName = 
  | 'users'
  | 'heroSlides'
  | 'storyMilestones'
  | 'ceremonySteps'
  | 'pages'
  | 'photoCategories'
  | 'photoUploads'
  | 'wishes'
  | 'playlistTracks'
  | 'challenges'
  | 'challengeSubmissions'

// Hook for fetching a collection
export function useCollection<T>(
  collectionName: CollectionName,
  options?: QueryOptions
) {
  const key = options 
    ? [collectionName, JSON.stringify(options)]
    : collectionName

  const { data, error, isLoading, isValidating } = useSWR<T[]>(
    key,
    () => getCollection(collectionName, options) as Promise<T[]>,
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
    }
  )

  return {
    data: data ?? [],
    error,
    isLoading,
    isValidating,
    refresh: () => mutate(key),
  }
}

// Hook for fetching a single document
export function useDocument<T>(
  collectionName: CollectionName,
  documentId: string | null
) {
  const key = documentId ? [collectionName, documentId] : null

  const { data, error, isLoading } = useSWR<T | null>(
    key,
    () => documentId ? getDocument(collectionName, documentId) as Promise<T | null> : null,
    {
      revalidateOnFocus: false,
    }
  )

  return {
    data,
    error,
    isLoading,
    refresh: () => key && mutate(key),
  }
}

// Hook for creating a document
export function useCreateDocument<T>(collectionName: CollectionName) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const create = useCallback(async (data: Omit<T, 'id'> & { id?: string }) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const result = await createDocument(collectionName, data as Parameters<typeof createDocument>[1])
      // Revalidate collection
      mutate(collectionName)
      return result as T
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to create document')
      setError(error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [collectionName])

  return { create, isLoading, error }
}

// Hook for updating a document
export function useUpdateDocument<T>(collectionName: CollectionName) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const update = useCallback(async (documentId: string, data: Partial<T>) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const result = await updateDocument(collectionName, documentId, data as Parameters<typeof updateDocument>[2])
      // Revalidate collection and document
      mutate(collectionName)
      mutate([collectionName, documentId])
      return result as T | null
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update document')
      setError(error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [collectionName])

  return { update, isLoading, error }
}

// Hook for deleting a document
export function useDeleteDocument(collectionName: CollectionName) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const remove = useCallback(async (documentId: string) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const result = await deleteDocument(collectionName, documentId)
      // Revalidate collection
      mutate(collectionName)
      return result
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to delete document')
      setError(error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [collectionName])

  return { remove, isLoading, error }
}

// Hook for uploading files
export function useUploadFiles() {
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<Error | null>(null)

  const upload = useCallback(async (files: File[], path: string) => {
    setIsLoading(true)
    setProgress(0)
    setError(null)
    
    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90))
      }, 100)
      
      const urls = await uploadFiles(files, path)
      
      clearInterval(progressInterval)
      setProgress(100)
      
      return urls
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to upload files')
      setError(error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { upload, isLoading, progress, error }
}

// Hook for moderating wish messages
export function useModerateWishMessage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const moderate = useCallback(async (text: string) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const result = await moderateWishMessage(text)
      return result
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to moderate message')
      setError(error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { moderate, isLoading, error }
}

// =====================================================================
// Hooks del panel Admin (CMS)
// Devuelven la colección con nombre propio + mutate, sobre el mock-service.
// =====================================================================

import type {
  Wish,
  StoryMilestone,
  CeremonyStep,
  PhotoUpload,
  PlaylistTrack,
  Challenge,
  ChallengeSubmission,
} from '@/shared/config/types'

export function useWishes() {
  const key = 'admin/wishes'
  const { data, error, isLoading } = useSWR(key, async () => {
    const wishes = (await getCollection('wishes')) as Wish[]
    // CMS usa guestName; el esquema base usa authorName
    return wishes.map(w => ({
      id: w.id,
      guestName: w.authorName,
      message: w.message,
      status: w.status,
      createdAt: w.createdAt,
    }))
  })
  return { wishes: data ?? [], error, isLoading, mutate: () => mutate(key) }
}

export function useChallenges() {
  const key = 'admin/challenges'
  const { data, error, isLoading } = useSWR(key, () =>
    getCollection('challenges') as Promise<Challenge[]>
  )
  return { challenges: data ?? [], error, isLoading, mutate: () => mutate(key) }
}

export function useChallengeSubmissions() {
  const key = 'admin/challengeSubmissions'
  const { data, error, isLoading } = useSWR(key, () =>
    getCollection('challengeSubmissions') as Promise<ChallengeSubmission[]>
  )
  return { submissions: data ?? [], error, isLoading, mutate: () => mutate(key) }
}

export function useWeddingSettings() {
  const key = 'admin/weddingSettings'
  const { data, error, isLoading } = useSWR(key, getWeddingSettings)
  return { settings: data, error, isLoading, mutate: () => mutate(key) }
}

export function useStoryMilestones() {
  const key = 'admin/storyMilestones'
  const { data, error, isLoading } = useSWR(key, async () => {
    const milestones = (await getCollection('storyMilestones')) as StoryMilestone[]
    // CMS usa date/description/imageUrl; base usa dateLabel/shortDescription/mediaUrl
    return milestones.map(m => ({
      id: m.id,
      title: m.title,
      date: m.dateLabel,
      description: m.shortDescription,
      imageUrl: m.mediaUrl ?? '',
    }))
  })
  return { milestones: data ?? [], error, isLoading, mutate: () => mutate(key) }
}

export function useCeremonySteps() {
  const key = 'admin/ceremonySteps'
  const { data, error, isLoading } = useSWR(key, async () => {
    const steps = (await getCollection('ceremonySteps')) as CeremonyStep[]
    return steps.map(s => ({
      id: s.id,
      order: s.order,
      title: s.title,
      description: s.shortDescription,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      time: (s as any).time ?? '',
    }))
  })
  return { steps: data ?? [], error, isLoading, mutate: () => mutate(key) }
}

export function useGalleryPhotos() {
  const key = 'admin/galleryPhotos'
  const { data, error, isLoading } = useSWR(key, async () => {
    const photos = (await getCollection('photoUploads')) as PhotoUpload[]
    // CMS usa url; base usa imageUrl
    return photos.map(p => ({
      id: p.id,
      url: p.imageUrl,
      caption: p.caption ?? '',
    }))
  })
  return { photos: data ?? [], error, isLoading, mutate: () => mutate(key) }
}

export function usePlaylistTracks() {
  const key = 'admin/playlistTracks'
  const { data, error, isLoading } = useSWR(key, async () => {
    const tracks = (await getCollection('playlistTracks')) as PlaylistTrack[]
    return tracks.map(t => ({
      id: t.id,
      title: t.title,
      artist: t.artist,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      significance: (t as any).significance ?? '',
    }))
  })
  return { tracks: data ?? [], error, isLoading, mutate: () => mutate(key) }
}
