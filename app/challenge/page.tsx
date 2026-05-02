'use client'

import { useState, useCallback, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/wedding/header'
import { Footer } from '@/components/wedding/footer'
import { SectionWrapper } from '@/components/wedding/section-wrapper'
import { OrnamentalDivider } from '@/components/wedding/ornamental-divider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Spinner } from '@/components/ui/spinner'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useRequireAuth, useAuth } from '@/lib/auth/auth-context'
import { useCollection, useCreateDocument, useUploadFiles } from '@/lib/hooks/use-data'
import { cn } from '@/lib/utils'
import {
  Camera,
  Upload,
  X,
  Check,
  Clock,
  AlertCircle,
  ImageIcon,
  Loader2,
} from 'lucide-react'
import { toast } from 'sonner'
import type { PhotoCategory, PhotoUpload } from '@/lib/types'

export default function ChallengePage() {
  const router = useRouter()
  const { user } = useAuth()
  const { isLoading: authLoading, isAuthorized } = useRequireAuth()
  
  const { data: categories, isLoading: categoriesLoading } = useCollection<PhotoCategory>('photoCategories')
  const { data: uploads, refresh: refreshUploads } = useCollection<PhotoUpload>('photoUploads')
  const { create } = useCreateDocument<PhotoUpload>('photoUploads')
  const { upload, isLoading: isUploading, progress } = useUploadFiles()

  const [selectedCategory, setSelectedCategory] = useState<PhotoCategory | null>(null)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [caption, setCaption] = useState('')

  // Redirect if not authorized
  useEffect(() => {
    if (!authLoading && !isAuthorized) {
      router.push('/auth')
    }
  }, [authLoading, isAuthorized, router])

  // User's uploads
  const userUploads = uploads.filter(u => u.userId === user?.id)
  const activeCategories = categories.filter(c => c.isActive).sort((a, b) => a.order - b.order)

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    // Validate file types
    const validFiles = files.filter(f => f.type.startsWith('image/'))
    if (validFiles.length !== files.length) {
      toast.error('Please select only image files')
    }

    setSelectedFiles(validFiles)
    
    // Create previews
    const newPreviews = validFiles.map(f => URL.createObjectURL(f))
    setPreviews(prev => {
      prev.forEach(p => URL.revokeObjectURL(p))
      return newPreviews
    })
  }, [])

  const removeFile = useCallback((index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
    setPreviews(prev => {
      URL.revokeObjectURL(prev[index])
      return prev.filter((_, i) => i !== index)
    })
  }, [])

  const handleUpload = async () => {
    if (!selectedCategory || selectedFiles.length === 0 || !user) return

    try {
      // Upload files
      const urls = await upload(selectedFiles, `photos/${user.id}/${selectedCategory.id}`)
      
      // Create upload records
      for (const url of urls) {
        await create({
          userId: user.id,
          categoryId: selectedCategory.id,
          imageUrl: url,
          caption: caption || undefined,
          status: 'pending',
          createdAt: new Date(),
        })
      }

      toast.success(`${urls.length} photo(s) uploaded successfully!`)
      
      // Reset
      setSelectedFiles([])
      setPreviews([])
      setCaption('')
      setUploadDialogOpen(false)
      refreshUploads()
    } catch {
      toast.error('Failed to upload photos. Please try again.')
    }
  }

  const openUploadDialog = (category: PhotoCategory) => {
    setSelectedCategory(category)
    setUploadDialogOpen(true)
  }

  // Cleanup previews on unmount
  useEffect(() => {
    return () => {
      previews.forEach(p => URL.revokeObjectURL(p))
    }
  }, [previews])

  if (authLoading || categoriesLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    )
  }

  if (!isAuthorized) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-16 md:pt-40 md:pb-24">
          <div className="absolute inset-0 bg-gradient-to-b from-velvet/30 to-transparent" />
          <div className="absolute top-0 left-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
          
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              <p className="text-gold/80 font-script text-3xl md:text-4xl mb-4 animate-fade-in-up">
                Capture the magic
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight mb-6 animate-fade-in-up">
                <span className="text-gold-gradient">Photo Challenge</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed animate-fade-in-up">
                Share your favorite moments from our special day. Upload photos to different categories and help us build our wedding gallery!
              </p>
              <OrnamentalDivider variant="diamond" className="max-w-xs mx-auto mt-8" />
            </div>
          </div>
        </section>

        {/* Categories Grid */}
        <SectionWrapper className="pt-0">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {activeCategories.map((category) => {
              const categoryUploads = userUploads.filter(u => u.categoryId === category.id)
              const pendingCount = categoryUploads.filter(u => u.status === 'pending').length
              const approvedCount = categoryUploads.filter(u => u.status === 'approved').length
              
              return (
                <div
                  key={category.id}
                  className="group relative overflow-hidden rounded-sm border border-gold/10 bg-card/50 backdrop-blur-sm card-glow transition-all hover:border-gold/30"
                >
                  {/* Cover image */}
                  {category.coverImageUrl && (
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image
                        src={category.coverImageUrl}
                        alt={category.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-card via-card/60 to-transparent" />
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-foreground">
                          {category.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {category.description}
                        </p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center flex-shrink-0">
                        <Camera className="w-5 h-5 text-gold" />
                      </div>
                    </div>

                    {/* Stats */}
                    {categoryUploads.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {approvedCount > 0 && (
                          <Badge variant="outline" className="bg-green-500/10 border-green-500/30 text-green-400">
                            <Check className="w-3 h-3 mr-1" />
                            {approvedCount} approved
                          </Badge>
                        )}
                        {pendingCount > 0 && (
                          <Badge variant="outline" className="bg-yellow-500/10 border-yellow-500/30 text-yellow-400">
                            <Clock className="w-3 h-3 mr-1" />
                            {pendingCount} pending
                          </Badge>
                        )}
                      </div>
                    )}

                    <Button
                      onClick={() => openUploadDialog(category)}
                      className="w-full bg-gold/10 border border-gold/30 text-gold hover:bg-gold/20"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Photos
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </SectionWrapper>

        {/* User's Uploads */}
        {userUploads.length > 0 && (
          <SectionWrapper
            title="Your Uploads"
            subtitle="Photos you&apos;ve shared"
            dividerVariant="simple"
            className="bg-gradient-to-b from-background to-velvet/30"
          >
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
              {userUploads.map((photo) => (
                <div key={photo.id} className="relative group">
                  <div className="relative aspect-square rounded-sm overflow-hidden card-glow">
                    <Image
                      src={photo.imageUrl}
                      alt={photo.caption || 'Uploaded photo'}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                    
                    {/* Status badge */}
                    <div className="absolute top-2 right-2">
                      <StatusBadge status={photo.status} />
                    </div>
                  </div>
                  
                  {photo.caption && (
                    <p className="text-xs text-muted-foreground mt-2 truncate">
                      {photo.caption}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </SectionWrapper>
        )}

        {/* Upload Dialog */}
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogContent className="bg-card border-gold/20 max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-foreground">
                Upload to {selectedCategory?.name}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6 pt-4">
              {/* File input */}
              <div
                className={cn(
                  'relative border-2 border-dashed rounded-sm p-8 text-center transition-colors',
                  selectedFiles.length > 0
                    ? 'border-gold/50 bg-gold/5'
                    : 'border-gold/20 hover:border-gold/40'
                )}
              >
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileSelect}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <ImageIcon className="w-10 h-10 text-gold/50 mx-auto mb-3" />
                <p className="text-sm text-foreground">
                  Click or drag to select photos
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  You can select multiple images
                </p>
              </div>

              {/* Previews */}
              {previews.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {previews.map((preview, index) => (
                    <div key={index} className="relative aspect-square">
                      <Image
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        fill
                        className="object-cover rounded-sm"
                        sizes="100px"
                      />
                      <button
                        onClick={() => removeFile(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-white rounded-full flex items-center justify-center hover:bg-destructive/80"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Caption */}
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  Caption (optional)
                </label>
                <Input
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Add a caption to your photos..."
                  className="bg-background/50 border-gold/20"
                />
              </div>

              {/* Progress */}
              {isUploading && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Uploading...</span>
                    <span className="text-gold">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setUploadDialogOpen(false)}
                  className="flex-1 border-gold/30 text-foreground hover:bg-gold/10"
                  disabled={isUploading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpload}
                  disabled={selectedFiles.length === 0 || isUploading}
                  className="flex-1 bg-gold hover:bg-gold-light text-background"
                >
                  {isUploading ? (
                    <>
                      <Spinner className="w-4 h-4 mr-2" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload {selectedFiles.length > 0 && `(${selectedFiles.length})`}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </main>
      
      <Footer />
    </div>
  )
}

function StatusBadge({ status }: { status: PhotoUpload['status'] }) {
  switch (status) {
    case 'approved':
      return (
        <Badge className="bg-green-500/90 text-white border-0">
          <Check className="w-3 h-3 mr-1" />
          Approved
        </Badge>
      )
    case 'pending':
      return (
        <Badge className="bg-yellow-500/90 text-black border-0">
          <Clock className="w-3 h-3 mr-1" />
          Pending
        </Badge>
      )
    case 'rejected':
      return (
        <Badge className="bg-destructive/90 text-white border-0">
          <AlertCircle className="w-3 h-3 mr-1" />
          Rejected
        </Badge>
      )
  }
}
