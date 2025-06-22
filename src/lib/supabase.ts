import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables')
  console.log('Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    redirectTo: window.location.origin // Fix redirect to use current domain instead of localhost
  }
})

// Database Types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          first_name: string
          last_name: string
          email: string
          avatar_url: string | null
          fhi_score: number
          total_grass_touched: number
          streak: number
          longest_streak: number
          latitude: number | null
          longitude: number | null
          share_location: boolean
          joined_date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          first_name: string
          last_name: string
          email: string
          avatar_url?: string | null
          fhi_score?: number
          total_grass_touched?: number
          streak?: number
          longest_streak?: number
          latitude?: number | null
          longitude?: number | null
          share_location?: boolean
          joined_date?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          first_name?: string
          last_name?: string
          email?: string
          avatar_url?: string | null
          fhi_score?: number
          total_grass_touched?: number
          streak?: number
          longest_streak?: number
          latitude?: number | null
          longitude?: number | null
          share_location?: boolean
          joined_date?: string
          created_at?: string
          updated_at?: string
        }
      }
      challenges: {
        Row: {
          id: string
          user_id: string
          patch_id: string
          patch_name: string
          patch_lat: number
          patch_lng: number
          patch_address: string
          status: 'ACTIVE' | 'COMPLETED' | 'FAILED' | 'EXPIRED'
          expires_at: string
          started_at: string
          completed_at: string | null
          submission_image_url: string | null
          gemini_verified: boolean
          fhi_points_awarded: number
          validation_attempts: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          patch_id: string
          patch_name: string
          patch_lat: number
          patch_lng: number
          patch_address: string
          status?: 'ACTIVE' | 'COMPLETED' | 'FAILED' | 'EXPIRED'
          expires_at: string
          started_at?: string
          completed_at?: string | null
          submission_image_url?: string | null
          gemini_verified?: boolean
          fhi_points_awarded?: number
          validation_attempts?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          patch_id?: string
          patch_name?: string
          patch_lat?: number
          patch_lng?: number
          patch_address?: string
          status?: 'ACTIVE' | 'COMPLETED' | 'FAILED' | 'EXPIRED'
          expires_at?: string
          started_at?: string
          completed_at?: string | null
          submission_image_url?: string | null
          gemini_verified?: boolean
          fhi_points_awarded?: number
          validation_attempts?: number
          created_at?: string
          updated_at?: string
        }
      }
      achievements: {
        Row: {
          id: string
          user_id: string
          type: string
          name: string
          description: string
          icon: string
          unlocked_at: string
          rarity: 'common' | 'rare' | 'epic' | 'legendary'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          name: string
          description: string
          icon: string
          unlocked_at?: string
          rarity?: 'common' | 'rare' | 'epic' | 'legendary'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          name?: string
          description?: string
          icon?: string
          unlocked_at?: string
          rarity?: 'common' | 'rare' | 'epic' | 'legendary'
          created_at?: string
        }
      }
      friendships: {
        Row: {
          id: string
          user_id: string
          friend_id: string
          status: 'PENDING' | 'ACCEPTED' | 'DECLINED'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          friend_id: string
          status?: 'PENDING' | 'ACCEPTED' | 'DECLINED'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          friend_id?: string
          status?: 'PENDING' | 'ACCEPTED' | 'DECLINED'
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}