import React, { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { authService, AuthUser } from '../services/auth'

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  signUp: (data: any) => Promise<void>
  signIn: (data: any) => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (data: any) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const initializeAuth = async () => {
      try {
        const currentUser = await authService.getCurrentUser()
        setUser(currentUser)
      } catch (error) {
        console.error('Error getting current user:', error)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()

    // Listen for auth changes
    const { data: { subscription } } = authService.onAuthStateChange(async (authUser) => {
      if (authUser) {
        try {
          console.log('🔐 Auth user found:', authUser.id)
          const currentUser = await authService.getCurrentUser()
          console.log('👤 User profile loaded:', currentUser?.username)
          setUser(currentUser)
        } catch (error) {
          console.error('❌ Error getting user profile:', error)
          if (error instanceof Error) {
            console.error('Error details:', error.message)
          }
          setUser(null)
        }
      } else {
        console.log('🚪 No auth user found')
        setUser(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (data: any) => {
    setLoading(true)
    try {
      await authService.signUp(data)
      // User will be set via auth state change listener
    } catch (error) {
      setLoading(false)
      throw error
    }
  }

  const signIn = async (data: any) => {
    setLoading(true)
    try {
      await authService.signIn(data)
      // User will be set via auth state change listener
    } catch (error) {
      setLoading(false)
      throw error
    }
  }

  const signOut = async () => {
    setLoading(true)
    try {
      await authService.signOut()
      setUser(null)
    } catch (error) {
      console.error('Error signing out:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (data: any) => {
    if (!user) throw new Error('No user logged in')
    
    try {
      await authService.updateProfile(user.id, data)
      // Refresh user data
      const updatedUser = await authService.getCurrentUser()
      setUser(updatedUser)
    } catch (error) {
      throw error
    }
  }

  const value: AuthContextType = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}