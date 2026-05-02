'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth/auth-context'
import { OrnamentalDivider } from '@/components/wedding/ornamental-divider'
import { DecorativeFrame } from '@/components/wedding/ornamental-divider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import { Spinner } from '@/components/ui/spinner'
import { cn } from '@/lib/utils'
import { Mail, Lock, ArrowLeft, Heart } from 'lucide-react'
import { toast } from 'sonner'

type AuthMode = 'login' | 'recovery'

export default function AuthPage() {
  const router = useRouter()
  const { login, requestPasswordReset, isAuthenticated } = useAuth()
  
  const [mode, setMode] = useState<AuthMode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // Redirect if already authenticated
  if (isAuthenticated) {
    router.push('/')
    return null
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    const result = await login(email, password)
    
    if (result.success) {
      toast.success('Welcome back!')
      router.push('/')
    } else {
      setError(result.error || 'Login failed')
    }
    
    setIsLoading(false)
  }

  const handleRecovery = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    const result = await requestPasswordReset(email)
    
    if (result.success) {
      toast.success('Password reset instructions have been sent to your email.')
      setMode('login')
      setEmail('')
    } else {
      setError(result.error || 'Could not send reset email')
    }
    
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-to-br from-velvet/50 via-background to-velvet/30" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
      
      {/* Main content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo / Title */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="font-script text-5xl text-gold hover:text-gold-light transition-colors">
              E & S
            </h1>
          </Link>
          <p className="text-muted-foreground mt-2">Guest Access</p>
        </div>

        {/* Auth Card */}
        <DecorativeFrame>
          <div className="bg-card/80 backdrop-blur-xl border border-gold/20 rounded-sm p-6 md:p-8 card-glow">
            {mode === 'login' ? (
              <>
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-semibold text-foreground">Welcome</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Sign in to access exclusive features
                  </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="email">Email Address</FieldLabel>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your@email.com"
                          className="pl-10 bg-background/50 border-gold/20 focus:border-gold/50"
                          required
                        />
                      </div>
                    </Field>
                  </FieldGroup>

                  <FieldGroup>
                    <Field>
                      <div className="flex items-center justify-between">
                        <FieldLabel htmlFor="password">Password</FieldLabel>
                        <button
                          type="button"
                          onClick={() => setMode('recovery')}
                          className="text-xs text-gold hover:text-gold-light transition-colors"
                        >
                          Forgot password?
                        </button>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter your password"
                          className="pl-10 bg-background/50 border-gold/20 focus:border-gold/50"
                          required
                        />
                      </div>
                    </Field>
                  </FieldGroup>

                  {error && (
                    <div className="bg-destructive/10 border border-destructive/30 rounded-sm p-3">
                      <p className="text-sm text-destructive text-center">{error}</p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gold hover:bg-gold-light text-background font-medium"
                  >
                    {isLoading ? (
                      <>
                        <Spinner className="w-4 h-4 mr-2" />
                        Signing in...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                </form>

                <OrnamentalDivider variant="simple" className="my-6" />

                <p className="text-center text-sm text-muted-foreground">
                  Access is by invitation only. Please contact the couple if you need assistance.
                </p>
              </>
            ) : (
              <>
                <button
                  onClick={() => setMode('login')}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-gold transition-colors mb-6"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to login
                </button>

                <div className="text-center mb-6">
                  <h2 className="text-2xl font-semibold text-foreground">Reset Password</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Enter your email to receive reset instructions
                  </p>
                </div>

                <form onSubmit={handleRecovery} className="space-y-5">
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="recovery-email">Email Address</FieldLabel>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="recovery-email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your@email.com"
                          className="pl-10 bg-background/50 border-gold/20 focus:border-gold/50"
                          required
                        />
                      </div>
                    </Field>
                  </FieldGroup>

                  {error && (
                    <div className="bg-destructive/10 border border-destructive/30 rounded-sm p-3">
                      <p className="text-sm text-destructive text-center">{error}</p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gold hover:bg-gold-light text-background font-medium"
                  >
                    {isLoading ? (
                      <>
                        <Spinner className="w-4 h-4 mr-2" />
                        Sending...
                      </>
                    ) : (
                      'Send Reset Link'
                    )}
                  </Button>
                </form>
              </>
            )}
          </div>
        </DecorativeFrame>

        {/* Back to home */}
        <div className="text-center mt-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-gold transition-colors"
          >
            <Heart className="w-4 h-4" />
            Return to Wedding Site
          </Link>
        </div>

        {/* Demo credentials */}
        <div className="mt-8 p-4 bg-card/30 border border-gold/10 rounded-sm">
          <p className="text-xs text-center text-muted-foreground mb-2">Demo Credentials</p>
          <div className="text-xs text-center space-y-1">
            <p><span className="text-gold">Admin:</span> elena@wedding.com / admin123</p>
            <p><span className="text-gold">Guest:</span> maria@example.com / guest123</p>
          </div>
        </div>
      </div>
    </div>
  )
}
