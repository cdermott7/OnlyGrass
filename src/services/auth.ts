import { supabase } from '../lib/supabase'
import type { User } from '@supabase/supabase-js'

export interface AuthUser {
  id: string
  email: string
  username: string
  firstName: string
  lastName: string
  avatarUrl?: string
}

export interface SignUpData {
  email: string
  password: string
  firstName: string
  lastName: string
  username: string
}

export interface SignInData {
  email: string
  password: string
}

export interface ProfileUpdateData {
  username?: string
  firstName?: string
  lastName?: string
  avatarUrl?: string
  latitude?: number
  longitude?: number
  shareLocation?: boolean
}

export class AuthService {
  // Sign up new user
  async signUp(data: SignUpData) {
    const { email, password, firstName, lastName, username } = data

    // Check if username is already taken
    const { data: existingUser, error: checkError } = await supabase
      .from('profiles')
      .select('username')
      .eq('username', username)
      .maybeSingle()

    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError
    }

    if (existingUser) {
      throw new Error('Username is already taken')
    }

    const { data: authData, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          first_name: firstName,
          last_name: lastName
        }
      }
    })

    if (error) throw error

    // If user was created successfully but no profile exists, create one manually
    if (authData.user) {
      // Wait a moment for the trigger to potentially work
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Check if profile was created by trigger
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', authData.user.id)
        .maybeSingle()

      // If no profile exists, create one manually
      if (!profile) {
        console.log('🔧 Creating profile manually...')
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            username,
            first_name: firstName,
            last_name: lastName,
            email: authData.user.email!
          })

        if (profileError) {
          console.error('Failed to create profile:', profileError)
          throw new Error('Failed to create user profile')
        }
      }
    }

    return authData
  }

  // Sign in existing user
  async signIn(data: SignInData) {
    const { email, password } = data

    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) throw error
    return authData
  }

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  // Get current user
  async getCurrentUser(): Promise<AuthUser | null> {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return null

    try {
      // Get profile data
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle()

      if (error) {
        // If database tables don't exist, return basic user info
        if (error.code === '42P01') {
          console.warn('⚠️ Database tables not set up. Using fallback user data.')
          return {
            id: user.id,
            email: user.email!,
            username: `user_${user.id.slice(0, 8)}`,
            firstName: user.user_metadata?.first_name || 'First',
            lastName: user.user_metadata?.last_name || 'Last',
            avatarUrl: user.user_metadata?.avatar_url
          }
        }
        throw error
      }

      // If no profile found, try to create one
      if (!profile) {
        console.log('🔧 No profile found, creating one...')
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            username: user.user_metadata?.username || `user_${user.id.slice(0, 8)}`,
            first_name: user.user_metadata?.first_name || 'First',
            last_name: user.user_metadata?.last_name || 'Last',
            email: user.email!
          })

        if (profileError) {
          console.error('Failed to create profile:', profileError)
          // Return fallback data instead of throwing
          return {
            id: user.id,
            email: user.email!,
            username: user.user_metadata?.username || `user_${user.id.slice(0, 8)}`,
            firstName: user.user_metadata?.first_name || 'First',
            lastName: user.user_metadata?.last_name || 'Last',
            avatarUrl: user.user_metadata?.avatar_url
          }
        }

        // Fetch the newly created profile
        const { data: newProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (newProfile) {
          return {
            id: user.id,
            email: user.email!,
            username: newProfile.username,
            firstName: newProfile.first_name,
            lastName: newProfile.last_name,
            avatarUrl: newProfile.avatar_url
          }
        }
      }

      return {
        id: user.id,
        email: user.email!,
        username: profile.username,
        firstName: profile.first_name,
        lastName: profile.last_name,
        avatarUrl: profile.avatar_url
      }
    } catch (error) {
      console.error('❌ Error in getCurrentUser:', error)
      throw error
    }
  }

  // Get full user profile
  async getUserProfile(userId: string) {
    console.log('🔍 Fetching profile for user:', userId)
    
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('❌ Profile fetch error:', error)
      if (error.code === '42P01') {
        console.warn('⚠️ Database tables not set up. Returning fallback profile.')
        // Return fallback profile structure
        return {
          id: userId,
          username: `user_${userId.slice(0, 8)}`,
          first_name: 'First',
          last_name: 'Last',
          email: '',
          avatar_url: null,
          fhi_score: 100,
          total_grass_touched: 0,
          streak: 0,
          longest_streak: 0,
          latitude: null,
          longitude: null,
          share_location: true,
          joined_date: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      }
      if (error.code === 'PGRST116') {
        throw new Error('Profile not found. The database might not be set up correctly.')
      }
      throw error
    }
    
    console.log('✅ Profile found:', profile?.username)
    return profile
  }

  // Update user profile
  async updateProfile(userId: string, updates: ProfileUpdateData) {
    const updateData: any = {}

    if (updates.username) updateData.username = updates.username
    if (updates.firstName) updateData.first_name = updates.firstName
    if (updates.lastName) updateData.last_name = updates.lastName
    if (updates.avatarUrl !== undefined) updateData.avatar_url = updates.avatarUrl
    if (updates.latitude !== undefined) updateData.latitude = updates.latitude
    if (updates.longitude !== undefined) updateData.longitude = updates.longitude
    if (updates.shareLocation !== undefined) updateData.share_location = updates.shareLocation

    const { data, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Update FHI score
  async updateFHIScore(userId: string, scoreChange: number) {
    // Get current score
    const { data: profile } = await supabase
      .from('profiles')
      .select('fhi_score')
      .eq('id', userId)
      .single()

    if (!profile) throw new Error('Profile not found')

    const newScore = Math.max(0, profile.fhi_score + scoreChange)

    const { data, error } = await supabase
      .from('profiles')
      .update({ fhi_score: newScore })
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Update grass touched stats
  async updateGrassStats(userId: string, increment: number = 1) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('total_grass_touched, streak, longest_streak')
      .eq('id', userId)
      .single()

    if (!profile) throw new Error('Profile not found')

    const newStreak = profile.streak + 1
    const newTotal = profile.total_grass_touched + increment
    const newLongestStreak = Math.max(profile.longest_streak, newStreak)

    const { data, error } = await supabase
      .from('profiles')
      .update({
        total_grass_touched: newTotal,
        streak: newStreak,
        longest_streak: newLongestStreak
      })
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Reset streak
  async resetStreak(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .update({ streak: 0 })
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Listen to auth state changes
  onAuthStateChange(callback: (user: User | null) => void) {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(session?.user || null)
    })
  }

  // Check if username is available
  async isUsernameAvailable(username: string): Promise<boolean> {
    const { data } = await supabase
      .from('profiles')
      .select('username')
      .eq('username', username)
      .single()

    return !data
  }

  // Search users by username
  async searchUsers(query: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, first_name, last_name, avatar_url, fhi_score')
      .ilike('username', `%${query}%`)
      .limit(10)

    if (error) throw error
    return data
  }
}

export const authService = new AuthService()