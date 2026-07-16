import { useEffect } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useRequireAuth, useAuth } from '@/shared/providers/auth-context'
import { cn } from '@/shared/utils/utils'
import { Button } from '@/shared/ui/button'
import { ScrollArea } from '@/shared/ui/scroll-area'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu'
import {
  LayoutDashboard,
  Image as ImageIcon,
  Heart,
  Calendar,
  FileText,
  Camera,
  Users,
  Music,
  MessageSquare,
  LogOut,
  Home,
  ChevronRight,
  Settings,
  User,
  Loader2,
} from 'lucide-react'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/hero', label: 'Hero Slides', icon: ImageIcon },
  { href: '/admin/story', label: 'Story Milestones', icon: Heart },
  { href: '/admin/ceremony', label: 'Ceremony Steps', icon: Calendar },
  { href: '/admin/pages', label: 'Pages', icon: FileText },
  { href: '/admin/categories', label: 'Photo Categories', icon: Camera },
  { href: '/admin/photos', label: 'Photo Uploads', icon: ImageIcon },
  { href: '/admin/wishes', label: 'Best Wishes', icon: MessageSquare },
  { href: '/admin/guests', label: 'Guest List', icon: Users },
  { href: '/admin/playlist', label: 'Playlist', icon: Music },
]

export default function AdminLayout() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { user, logout } = useAuth()
  const { isLoading, isAuthorized } = useRequireAuth({ adminOnly: true })

  useEffect(() => {
    if (!isLoading && !isAuthorized) {
      navigate('/auth')
    }
  }, [isLoading, isAuthorized, navigate])

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  if (isLoading) {
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
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-gold/10 bg-card/50 hidden md:flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gold/10">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-script text-3xl text-gold">E & S</span>
          </Link>
          <p className="text-xs text-muted-foreground mt-1">Admin Panel</p>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 py-4">
          <nav className="px-3 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm transition-colors',
                    isActive
                      ? 'bg-gold/10 text-gold'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </ScrollArea>

        {/* User section */}
        <div className="p-4 border-t border-gold/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center">
              <User className="w-4 h-4 text-gold" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {user?.name}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.email}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="h-16 border-b border-gold/10 bg-card/30 backdrop-blur-sm flex items-center px-4 md:px-6 gap-4">
          {/* Mobile menu - simplified */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Settings className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 bg-card border-gold/20">
              {navItems.map((item) => (
                <DropdownMenuItem key={item.href} asChild>
                  <Link to={item.href} className="flex items-center gap-2">
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator className="bg-gold/10" />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-muted-foreground hover:text-gold transition-colors">
              <Home className="w-4 h-4" />
            </Link>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <Link to="/admin" className="text-muted-foreground hover:text-gold transition-colors">
              Admin
            </Link>
            {pathname !== '/admin' && (
              <>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
                <span className="text-foreground capitalize">
                  {pathname.split('/').pop()?.replace('-', ' ')}
                </span>
              </>
            )}
          </div>

          <div className="flex-1" />

          {/* Actions */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-muted-foreground hover:text-destructive hidden md:flex"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
