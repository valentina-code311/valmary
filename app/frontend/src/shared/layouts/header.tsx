import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { cn } from '@/shared/utils/utils'
import { useAuth } from '@/shared/providers/auth-context'
import { Button } from '@/shared/ui/button'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from '@/shared/ui/sheet'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu'
import { Menu, User, LogOut, Camera, Settings } from 'lucide-react'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/our_love', label: 'Our Love' },
  { href: '/ceremony', label: 'Ceremony' },
  { href: '/best_wishes', label: 'Best Wishes' },
]

export function Header() {
  const { pathname } = useLocation()
  const { user, isAuthenticated, isAdmin, logout } = useAuth()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = async () => {
    await logout()
    setIsOpen(false)
  }

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-background/95 backdrop-blur-sm border-b border-gold/10 py-3'
          : 'bg-transparent py-6'
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="font-script text-3xl md:text-4xl text-gold hover:text-gold-light transition-colors"
          >
            E & S
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  to={link.href}
                  className={cn(
                    'text-sm tracking-widest uppercase transition-colors hover:text-gold',
                    pathname === link.href
                      ? 'text-gold'
                      : 'text-foreground/70'
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Auth Actions */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 text-foreground/70 hover:text-gold hover:bg-gold/5"
                  >
                    <User className="w-4 h-4" />
                    <span className="text-sm">{user?.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-card border-gold/20">
                  {isAdmin && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link to="/admin" className="flex items-center gap-2">
                          <Settings className="w-4 h-4" />
                          Admin Panel
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-gold/10" />
                    </>
                  )}
                  <DropdownMenuItem asChild>
                    <Link to="/challenge" className="flex items-center gap-2">
                      <Camera className="w-4 h-4" />
                      Photo Challenge
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gold/10" />
                  <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 text-destructive">
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                asChild
                variant="outline"
                size="sm"
                className="border-gold/30 text-gold hover:bg-gold/10 hover:border-gold/50"
              >
                <Link to="/auth">Sign In</Link>
              </Button>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="text-foreground hover:text-gold hover:bg-gold/5"
              >
                <Menu className="w-5 h-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-background border-gold/20 w-72">
              <SheetHeader>
                <SheetTitle className="font-script text-3xl text-gold text-left">
                  E & S
                </SheetTitle>
              </SheetHeader>
              <nav className="mt-8">
                <ul className="space-y-4">
                  {navLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        to={link.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          'block py-2 text-lg tracking-wide transition-colors hover:text-gold',
                          pathname === link.href
                            ? 'text-gold'
                            : 'text-foreground/70'
                        )}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 pt-8 border-t border-gold/10">
                  {isAuthenticated ? (
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Signed in as <span className="text-gold">{user?.name}</span>
                      </p>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-2 text-foreground/70 hover:text-gold transition-colors"
                        >
                          <Settings className="w-4 h-4" />
                          Admin Panel
                        </Link>
                      )}
                      <Link
                        to="/challenge"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-2 text-foreground/70 hover:text-gold transition-colors"
                      >
                        <Camera className="w-4 h-4" />
                        Photo Challenge
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-destructive hover:text-destructive/80 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <Button
                      asChild
                      className="w-full bg-gold/10 text-gold border border-gold/30 hover:bg-gold/20"
                    >
                      <Link to="/auth" onClick={() => setIsOpen(false)}>
                        Sign In
                      </Link>
                    </Button>
                  )}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </nav>
      </div>
    </header>
  )
}
