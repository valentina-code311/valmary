import { Link } from 'react-router-dom'
import { Button } from '@/shared/ui/button'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6 px-4">
      <span className="font-script text-6xl text-gold">404</span>
      <p className="text-muted-foreground tracking-widest uppercase text-sm">
        Page not found
      </p>
      <Button
        asChild
        variant="outline"
        className="border-gold/30 text-gold hover:bg-gold/10 hover:border-gold/50"
      >
        <Link to="/">Back to home</Link>
      </Button>
    </div>
  )
}
