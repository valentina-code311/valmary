import { Link } from 'react-router-dom'
import { OrnamentalDivider } from '@/shared/ui/ornamental-divider'
import { Heart } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-velvet border-t border-gold/10">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <OrnamentalDivider variant="floral" className="mb-8" />
        
        <div className="text-center space-y-6">
          {/* Names */}
          <h3 className="font-script text-4xl md:text-5xl text-gold">
            Elena & Sofia
          </h3>
          
          {/* Date */}
          <p className="text-muted-foreground tracking-widest uppercase text-sm">
            June 15, 2024
          </p>
          
          {/* Navigation */}
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <Link
              to="/"
              className="text-sm text-muted-foreground hover:text-gold transition-colors"
            >
              Home
            </Link>
            <Link
              to="/our_love"
              className="text-sm text-muted-foreground hover:text-gold transition-colors"
            >
              Our Love
            </Link>
            <Link
              to="/ceremony"
              className="text-sm text-muted-foreground hover:text-gold transition-colors"
            >
              Ceremony
            </Link>
            <Link
              to="/best_wishes"
              className="text-sm text-muted-foreground hover:text-gold transition-colors"
            >
              Best Wishes
            </Link>
          </nav>
          
          {/* Copyright */}
          <div className="pt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-gold fill-gold animate-pulse" />
            <span>&copy; {currentYear}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
