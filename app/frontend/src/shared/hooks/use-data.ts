'use client'

import useSWR, { mutate } from 'swr'
import { useCallback, useState } from 'react'
import type { QueryOptions } from '@/lib/types'
import {
  getCollection,
  getDocument,
  createDocument,
  updateDocument,
  deleteDocument,
  uploadFiles,
  moderateWishMessage,
} from '@/lib/services/mock-service'

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
