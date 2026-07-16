import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import type { User } from '@/shared/config/types'
import { mockUsers } from '@/shared/utils/mock-data'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  isAdmin: boolean
  isGuest: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  requestPasswordReset: (email: string) => Promise<{ success: boolean; error?: string }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock password validation (in production, this would be handled by Firebase Auth)
const MOCK_PASSWORDS: Record<string, string> = {
  'elena@wedding.com': 'admin123',
  'sofia@wedding.com': 'admin123',
  'maria@example.com': 'guest123',
  'carlos@example.com': 'guest123',
  'ana@example.com': 'guest123',
}

const AUTH_STORAGE_KEY = 'wedding_auth_user'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check for existing session on mount
  useEffect(() => {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY)
    if (stored) {
      try {
        const parsedUser = JSON.parse(stored)
        // Verify user still exists in mock data
        const validUser = mockUsers.find(u => u.id === parsedUser.id)
        if (validUser) {
          setUser(validUser)
        } else {
          localStorage.removeItem(AUTH_STORAGE_KEY)
        }
      } catch {
        localStorage.removeItem(AUTH_STORAGE_KEY)
      }
    }
    setIsLoading(false)
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true)
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Find user by email
    const foundUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase())
    
    if (!foundUser) {
      setIsLoading(false)
      return { success: false, error: 'No account found with this email address.' }
    }
    
    // Check password
    const correctPassword = MOCK_PASSWORDS[foundUser.email]
    if (password !== correctPassword) {
      setIsLoading(false)
      return { success: false, error: 'Invalid password. Please try again.' }
    }
    
    // Check access
    if (!foundUser.hasAccess) {
      setIsLoading(false)
      return { success: false, error: 'Your account does not have access. Please contact the couple.' }
    }
    
    // Success
    setUser(foundUser)
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(foundUser))
    setIsLoading(false)
    return { success: true }
  }, [])

  const logout = useCallback(async () => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 200))
    setUser(null)
    localStorage.removeItem(AUTH_STORAGE_KEY)
    setIsLoading(false)
  }, [])

  const requestPasswordReset = useCallback(async (email: string) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const foundUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase())
    
    if (!foundUser) {
      return { success: false, error: 'No account found with this email address.' }
    }
    
    // In production, this would send an email via Firebase Auth
    console.log(`[Mock] Password reset email sent to ${email}`)
    return { success: true }
  }, [])

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isGuest: user?.role === 'guest',
    login,
    logout,
    requestPasswordReset,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Hook for protected routes
export function useRequireAuth(options?: { adminOnly?: boolean }) {
  const { user, isLoading, isAdmin } = useAuth()
  
  const isAuthorized = isLoading ? null : (
    options?.adminOnly ? isAdmin : !!user
  )
  
  return {
    user,
    isLoading,
    isAuthorized,
  }
}
