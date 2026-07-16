'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/wedding/header'
import { Footer } from '@/components/wedding/footer'
import { SectionWrapper } from '@/components/wedding/section-wrapper'
import { OrnamentalDivider } from '@/components/wedding/ornamental-divider'
import { DecorativeFrame } from '@/components/wedding/ornamental-divider'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import { Spinner } from '@/components/ui/spinner'
import { useCollection, useCreateDocument, useModerateWishMessage } from '@/lib/hooks/use-data'
import { useAuth } from '@/lib/auth/auth-context'
import { cn } from '@/lib/utils'
import { Quote, Send, AlertTriangle, Heart, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import type { Wish } from '@/lib/types'

const MODERATION_WARNING_KEY = 'wedding_wish_warnings'
const MAX_WARNINGS = 2

export default function BestWishesPage() {
  const { user, isAuthenticated } = useAuth()
  const { data: wishes, isLoading, refresh } = useCollection<Wish>('wishes')
  const { create, isLoading: isCreating } = useCreateDocument<Wish>('wishes')
  const { moderate, isLoading: isModerating } = useModerateWishMessage()
  
  const [displayCount, setDisplayCount] = useState(6)
  const [authorName, setAuthorName] = useState('')
  const [message, setMessage] = useState('')
  const [warningCount, setWarningCount] = useState(0)
  const [warningMessage, setWarningMessage] = useState('')
  const [isBlocked, setIsBlocked] = useState(false)

  // Load warning count from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(MODERATION_WARNING_KEY)
    if (stored) {
      const count = parseInt(stored, 10)
      setWarningCount(count)
      if (count >= MAX_WARNINGS) {
        setIsBlocked(true)
      }
    }
  }, [])

  // Filter to only approved wishes
  const approvedWishes = wishes
    .filter(w => w.status === 'approved')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const visibleWishes = approvedWishes.slice(0, displayCount)
  const hasMore = displayCount < approvedWishes.length

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (isBlocked) {
      toast.error('You have been blocked from submitting wishes due to repeated violations.')
      return
    }

    const name = isAuthenticated && user ? user.name : authorName.trim()
    const text = message.trim()

    if (!name || !text) {
      toast.error('Please fill in all fields.')
      return
    }

    // Moderate the message
    const result = await moderate(text)
    
    if (!result.approved) {
      const newCount = warningCount + 1
      setWarningCount(newCount)
      localStorage.setItem(MODERATION_WARNING_KEY, newCount.toString())
      setWarningMessage(result.warningMessage)
      
      if (newCount >= MAX_WARNINGS) {
        setIsBlocked(true)
        toast.error('You have been blocked from submitting wishes due to repeated violations.')
      }
      
      return
    }

    // Clear warning message on successful moderation
    setWarningMessage('')

    // Create the wish
    try {
      await create({
        authorName: name,
        authorType: isAuthenticated ? 'guest' : 'public',
        userId: isAuthenticated && user ? user.id : undefined,
        message: text,
        status: 'pending', // Will be reviewed by admin
        createdAt: new Date(),
      })

      // Reset form
      setMessage('')
      if (!isAuthenticated) {
        setAuthorName('')
      }

      toast.success('Thank you for your beautiful wishes! They will appear after review.')
      refresh()
    } catch {
      toast.error('Something went wrong. Please try again.')
    }
  }

  const loadMore = () => {
    setDisplayCount(prev => prev + 6)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-16 md:pt-40 md:pb-24">
          <div className="absolute inset-0 bg-gradient-to-b from-velvet/30 to-transparent" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
          
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              <p className="text-gold/80 font-script text-3xl md:text-4xl mb-4 animate-fade-in-up">
                Messages of love
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight mb-6 animate-fade-in-up">
                <span className="text-gold-gradient">Best Wishes</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed animate-fade-in-up">
                Share your heartfelt wishes for Elena & Sofia as they begin their beautiful journey together.
              </p>
              <OrnamentalDivider variant="floral" className="max-w-xs mx-auto mt-8" />
            </div>
          </div>
        </section>

        {/* Submit Form */}
        <SectionWrapper className="pt-0 pb-16">
          <div className="max-w-xl mx-auto">
            <DecorativeFrame>
              <div className="bg-card/50 backdrop-blur-sm border border-gold/20 rounded-sm p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Heart className="w-6 h-6 text-gold" />
                  <h2 className="text-xl font-semibold text-foreground">Leave Your Wishes</h2>
                </div>

                {isBlocked ? (
                  <div className="bg-destructive/10 border border-destructive/30 rounded-sm p-4 text-center">
                    <AlertTriangle className="w-8 h-8 text-destructive mx-auto mb-3" />
                    <p className="text-destructive font-medium">Submission Blocked</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Due to repeated violations of our guidelines, you are no longer able to submit wishes.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {!isAuthenticated && (
                      <FieldGroup>
                        <Field>
                          <FieldLabel htmlFor="name">Your Name</FieldLabel>
                          <Input
                            id="name"
                            value={authorName}
                            onChange={(e) => setAuthorName(e.target.value)}
                            placeholder="Enter your name"
                            className="bg-background/50 border-gold/20 focus:border-gold/50"
                            required
                          />
                        </Field>
                      </FieldGroup>
                    )}

                    {isAuthenticated && user && (
                      <p className="text-sm text-muted-foreground">
                        Posting as <span className="text-gold">{user.name}</span>
                      </p>
                    )}

                    <FieldGroup>
                      <Field>
                        <FieldLabel htmlFor="message">Your Message</FieldLabel>
                        <Textarea
                          id="message"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Share your heartfelt wishes for the happy couple..."
                          className="bg-background/50 border-gold/20 focus:border-gold/50 min-h-32 resize-none"
                          required
                        />
                      </Field>
                    </FieldGroup>

                    {warningMessage && (
                      <div className="bg-destructive/10 border border-destructive/30 rounded-sm p-4 flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-destructive font-medium">Message Not Approved</p>
                          <p className="text-sm text-muted-foreground mt-1">{warningMessage}</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            Warning {warningCount} of {MAX_WARNINGS}
                          </p>
                        </div>
                      </div>
                    )}

                    <Button
                      type="submit"
                      disabled={isCreating || isModerating}
                      className="w-full bg-gold hover:bg-gold-light text-background font-medium"
                    >
                      {isCreating || isModerating ? (
                        <>
                          <Spinner className="w-4 h-4 mr-2" />
                          {isModerating ? 'Checking...' : 'Sending...'}
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Send Your Wishes
                        </>
                      )}
                    </Button>

                    <p className="text-xs text-center text-muted-foreground">
                      All wishes are reviewed before being published to ensure a loving and respectful experience.
                    </p>
                  </form>
                )}
              </div>
            </DecorativeFrame>
          </div>
        </SectionWrapper>

        {/* Wishes Grid */}
        <SectionWrapper
          title="Messages of Love"
          subtitle="From our cherished guests"
          dividerVariant="simple"
          className="bg-gradient-to-b from-background to-velvet/30"
        >
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-gold" />
            </div>
          ) : approvedWishes.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="w-12 h-12 text-gold/30 mx-auto mb-4" />
              <p className="text-muted-foreground">Be the first to leave your wishes!</p>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {visibleWishes.map((wish, index) => (
                  <WishCard key={wish.id} wish={wish} index={index} />
                ))}
              </div>

              {hasMore && (
                <div className="text-center mt-12">
                  <Button
                    onClick={loadMore}
                    variant="outline"
                    size="lg"
                    className="border-gold/30 text-gold hover:bg-gold/10 hover:border-gold/50"
                  >
                    Load More Wishes
                  </Button>
                </div>
              )}
            </>
          )}
        </SectionWrapper>
      </main>
      
      <Footer />
    </div>
  )
}

function WishCard({ wish, index }: { wish: Wish; index: number }) {
  return (
    <div
      className={cn(
        'animate-fade-in-up',
        `[animation-delay:${index * 100}ms]`
      )}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <DecorativeFrame className="h-full">
        <div className="bg-card/50 backdrop-blur-sm border border-gold/10 rounded-sm p-6 h-full flex flex-col transition-all hover:border-gold/30 hover:bg-card/70">
          <Quote className="w-8 h-8 text-gold/30 mb-4" />
          
          <p className="text-foreground/90 leading-relaxed flex-1 italic">
            &ldquo;{wish.message}&rdquo;
          </p>
          
          <div className="mt-6 pt-4 border-t border-gold/10">
            <p className="text-gold font-medium">{wish.authorName}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {new Date(wish.createdAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>
      </DecorativeFrame>
    </div>
  )
}
