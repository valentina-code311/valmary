import { Link } from 'react-router-dom'
import { useCollection } from '@/shared/hooks/use-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import {
  Image as ImageIcon,
  Heart,
  Calendar,
  Camera,
  Users,
  Music,
  MessageSquare,
  ArrowRight,
  Clock,
  Check,
} from 'lucide-react'
import type {
  HeroSlide,
  StoryMilestone,
  CeremonyStep,
  PhotoCategory,
  PhotoUpload,
  Wish,
  User,
  PlaylistTrack,
} from '@/shared/config/types'

export default function AdminDashboard() {
  const { data: heroSlides } = useCollection<HeroSlide>('heroSlides')
  const { data: milestones } = useCollection<StoryMilestone>('storyMilestones')
  const { data: ceremonySteps } = useCollection<CeremonyStep>('ceremonySteps')
  const { data: categories } = useCollection<PhotoCategory>('photoCategories')
  const { data: photos } = useCollection<PhotoUpload>('photoUploads')
  const { data: wishes } = useCollection<Wish>('wishes')
  const { data: users } = useCollection<User>('users')
  const { data: tracks } = useCollection<PlaylistTrack>('playlistTracks')

  const pendingPhotos = photos.filter(p => p.status === 'pending')
  const pendingWishes = wishes.filter(w => w.status === 'pending')
  const activeGuests = users.filter(u => u.role === 'guest' && u.hasAccess)

  const stats = [
    {
      title: 'Hero Slides',
      value: heroSlides.filter(h => h.isActive).length,
      total: heroSlides.length,
      icon: ImageIcon,
      href: '/admin/hero',
      color: 'text-gold',
    },
    {
      title: 'Story Milestones',
      value: milestones.length,
      icon: Heart,
      href: '/admin/story',
      color: 'text-blush',
    },
    {
      title: 'Ceremony Steps',
      value: ceremonySteps.length,
      icon: Calendar,
      href: '/admin/ceremony',
      color: 'text-sage',
    },
    {
      title: 'Photo Categories',
      value: categories.filter(c => c.isActive).length,
      total: categories.length,
      icon: Camera,
      href: '/admin/categories',
      color: 'text-gold',
    },
    {
      title: 'Guest Photos',
      value: photos.filter(p => p.status === 'approved').length,
      total: photos.length,
      icon: ImageIcon,
      href: '/admin/photos',
      color: 'text-champagne',
    },
    {
      title: 'Best Wishes',
      value: wishes.filter(w => w.status === 'approved').length,
      total: wishes.length,
      icon: MessageSquare,
      href: '/admin/wishes',
      color: 'text-blush',
    },
    {
      title: 'Active Guests',
      value: activeGuests.length,
      icon: Users,
      href: '/admin/guests',
      color: 'text-sage',
    },
    {
      title: 'Playlist Tracks',
      value: tracks.length,
      icon: Music,
      href: '/admin/playlist',
      color: 'text-gold',
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back! Here&apos;s an overview of your wedding site.
        </p>
      </div>

      {/* Pending items alerts */}
      {(pendingPhotos.length > 0 || pendingWishes.length > 0) && (
        <div className="grid md:grid-cols-2 gap-4">
          {pendingPhotos.length > 0 && (
            <Card className="border-yellow-500/30 bg-yellow-500/5">
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-yellow-500" />
                  <div>
                    <p className="font-medium text-foreground">
                      {pendingPhotos.length} Photo{pendingPhotos.length > 1 ? 's' : ''} Pending Review
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Guest uploads awaiting approval
                    </p>
                  </div>
                </div>
                <Button asChild size="sm" variant="outline" className="border-yellow-500/30">
                  <Link to="/admin/photos">Review</Link>
                </Button>
              </CardContent>
            </Card>
          )}
          
          {pendingWishes.length > 0 && (
            <Card className="border-yellow-500/30 bg-yellow-500/5">
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-yellow-500" />
                  <div>
                    <p className="font-medium text-foreground">
                      {pendingWishes.length} Wish{pendingWishes.length > 1 ? 'es' : ''} Pending Review
                    </p>
                    <p className="text-sm text-muted-foreground">
                      New messages awaiting approval
                    </p>
                  </div>
                </div>
                <Button asChild size="sm" variant="outline" className="border-yellow-500/30">
                  <Link to="/admin/wishes">Review</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Stats grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Link key={stat.href} to={stat.href}>
              <Card className="border-gold/10 hover:border-gold/30 transition-colors group">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-2xl font-semibold text-foreground">
                        {stat.value}
                      </p>
                      {stat.total !== undefined && stat.total !== stat.value && (
                        <p className="text-xs text-muted-foreground">
                          of {stat.total} total
                        </p>
                      )}
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-gold transition-colors" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* Recent activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent photos */}
        <Card className="border-gold/10">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-medium">Recent Photo Uploads</CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link to="/admin/photos">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {photos.slice(0, 4).map((photo) => {
                const guest = users.find(u => u.id === photo.userId)
                const category = categories.find(c => c.id === photo.categoryId)
                
                return (
                  <div key={photo.id} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-sm bg-muted overflow-hidden">
                      <img
                        src={photo.imageUrl}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {guest?.name || 'Unknown Guest'}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {category?.name}
                      </p>
                    </div>
                    <StatusBadge status={photo.status} />
                  </div>
                )
              })}
              
              {photos.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No photo uploads yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent wishes */}
        <Card className="border-gold/10">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-medium">Recent Wishes</CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link to="/admin/wishes">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {wishes.slice(0, 4).map((wish) => (
                <div key={wish.id} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-4 h-4 text-gold" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-foreground">
                        {wish.authorName}
                      </p>
                      <StatusBadge status={wish.status} />
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                      {wish.message}
                    </p>
                  </div>
                </div>
              ))}
              
              {wishes.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No wishes yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case 'approved':
      return (
        <Badge variant="outline" className="bg-green-500/10 border-green-500/30 text-green-400">
          <Check className="w-3 h-3 mr-1" />
          Approved
        </Badge>
      )
    case 'pending':
      return (
        <Badge variant="outline" className="bg-yellow-500/10 border-yellow-500/30 text-yellow-400">
          <Clock className="w-3 h-3 mr-1" />
          Pending
        </Badge>
      )
    case 'rejected':
      return (
        <Badge variant="outline" className="bg-red-500/10 border-red-500/30 text-red-400">
          Rejected
        </Badge>
      )
    default:
      return null
  }
}
