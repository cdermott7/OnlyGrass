import { supabase } from '../lib/supabase'
import { GrassPatch, GrassChallenge, Achievement } from '../types'

export class DatabaseService {
  // Challenge operations
  async createChallenge(userId: string, patch: GrassPatch): Promise<string> {
    const challengeData = {
      user_id: userId,
      patch_id: patch.id,
      patch_name: patch.name,
      patch_lat: patch.location.lat,
      patch_lng: patch.location.lng,
      patch_address: patch.location.address,
      status: 'ACTIVE' as const,
      expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour from now
    }

    console.log('📝 Creating challenge with data:', challengeData)

    const { data, error } = await supabase
      .from('challenges')
      .insert(challengeData)
      .select()
      .single()

    if (error) {
      console.error('❌ Challenge creation error:', error)
      throw error
    }
    
    console.log('✅ Challenge created successfully:', data)
    return data.id
  }

  async getActiveChallenge(userId: string): Promise<GrassChallenge | null> {
    console.log('🔍 Looking for active challenge for user:', userId)
    
    // First, expire any old challenges
    await this.expireOldChallenges(userId)
    
    // First check all challenges for this user
    const { data: allChallenges, error: allError } = await supabase
      .from('challenges')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5)
    
    console.log('📊 All recent challenges for user:', allChallenges)
    
    const { data, error } = await supabase
      .from('challenges')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'ACTIVE')
      .order('created_at', { ascending: false })
      .limit(1)

    if (error) {
      console.warn('⚠️ Could not fetch active challenge:', error)
      return null
    }
    
    console.log('🎯 Active challenge query result:', data)
    
    if (!data || data.length === 0) {
      console.log('❌ No active challenge found')
      return null
    }
    
    // Get the first (most recent) challenge
    const challengeData = Array.isArray(data) ? data[0] : data

    // Convert database challenge to app format with complete data
    const cityName = challengeData.patch_address?.split(',')[1]?.trim() || 'Unknown City'
    const distanceFromUser = Math.floor(Math.random() * 500) + 100 // Estimate distance
    
    // Generate satellite image URL
    const satelliteImageUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${challengeData.patch_lat},${challengeData.patch_lng}&zoom=18&size=640x640&maptype=satellite&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
    
    return {
      id: challengeData.id,
      patchId: challengeData.patch_id,
      patch: {
        id: challengeData.patch_id,
        name: challengeData.patch_name,
        claudeDescription: `A ${Math.random() > 0.5 ? 'promising' : 'suspicious'} patch of grass that's judging your life choices. Time to prove you can actually touch grass instead of just talking about it.`,
        satelliteImageUrl,
        location: {
          lat: challengeData.patch_lat,
          lng: challengeData.patch_lng,
          address: challengeData.patch_address,
          city: cityName,
          distanceFromUser
        },
        difficultyRating: Math.min(5, Math.max(1, Math.floor(distanceFromUser / 100))),
        grassQuality: distanceFromUser < 200 ? 'pristine' : distanceFromUser < 400 ? 'decent' : 'questionable',
        estimatedWalkTime: distanceFromUser < 200 ? '2 min walk' :
                          distanceFromUser < 400 ? '5 min walk' : '8+ min walk',
        discoveredBy: 'SatelliteBot',
        isActive: true
      },
      status: challengeData.status as any,
      expiresAt: challengeData.expires_at,
      startedAt: challengeData.started_at,
      completedAt: challengeData.completed_at,
      submissionImageUrl: challengeData.submission_image_url,
      geminiVerified: challengeData.gemini_verified,
      fhiPointsAwarded: challengeData.fhi_points_awarded,
      validationAttempts: challengeData.validation_attempts
    }
  }

  async completeChallenge(challengeId: string, imageUrl: string, fhiPoints: number): Promise<void> {
    console.log('📸 Completing challenge:', { challengeId, imageUrl, fhiPoints })
    
    const { data, error } = await supabase
      .from('challenges')
      .update({
        status: 'COMPLETED',
        completed_at: new Date().toISOString(),
        submission_image_url: imageUrl,
        gemini_verified: true,
        fhi_points_awarded: fhiPoints
      })
      .eq('id', challengeId)
      .select()

    if (error) {
      console.error('❌ Challenge completion error:', error)
      throw error
    }
    
    console.log('✅ Challenge completed successfully:', data)
  }

  async failChallenge(challengeId: string, fhiPoints: number): Promise<void> {
    const { error } = await supabase
      .from('challenges')
      .update({
        status: 'FAILED',
        completed_at: new Date().toISOString(),
        fhi_points_awarded: fhiPoints
      })
      .eq('id', challengeId)

    if (error) throw error
  }

  async getUserChallenges(userId: string, limit: number = 10) {
    const { data, error } = await supabase
      .from('challenges')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data
  }

  async expireOldChallenges(userId: string): Promise<void> {
    console.log('🧹 Expiring old challenges for user:', userId)
    
    const { data, error } = await supabase
      .from('challenges')
      .update({ status: 'EXPIRED' })
      .eq('user_id', userId)
      .eq('status', 'ACTIVE')
      .lt('expires_at', new Date().toISOString())

    if (error) {
      console.warn('⚠️ Could not expire old challenges:', error)
    } else {
      console.log('✅ Expired old challenges:', data?.length || 0)
    }
  }

  // Achievement operations
  async unlockAchievement(userId: string, achievement: Achievement): Promise<void> {
    const { error } = await supabase
      .from('achievements')
      .insert({
        user_id: userId,
        type: achievement.type,
        name: achievement.name,
        description: achievement.description,
        icon: achievement.icon,
        rarity: achievement.rarity
      })

    if (error && error.code !== '23505') throw error // Ignore duplicate key errors
  }

  async getUserAchievements(userId: string) {
    try {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .eq('user_id', userId)
        .order('unlocked_at', { ascending: false })

      if (error) {
        console.warn('⚠️ Could not fetch achievements:', error)
        return []
      }
      
      return data || []
    } catch (error) {
      console.warn('⚠️ Error fetching achievements:', error)
      return []
    }
  }

  // Friend operations
  async sendFriendRequest(userId: string, friendId: string): Promise<void> {
    const { error } = await supabase
      .from('friendships')
      .insert({
        user_id: userId,
        friend_id: friendId,
        status: 'PENDING'
      })

    if (error) throw error
  }

  async acceptFriendRequest(friendshipId: string): Promise<void> {
    const { error } = await supabase
      .from('friendships')
      .update({ status: 'ACCEPTED' })
      .eq('id', friendshipId)

    if (error) throw error
  }

  async getFriends(userId: string) {
    const { data, error } = await supabase
      .from('friendships')
      .select(`
        *,
        friend:profiles!friendships_friend_id_fkey(id, username, first_name, last_name, avatar_url, fhi_score)
      `)
      .eq('user_id', userId)
      .eq('status', 'ACCEPTED')

    if (error) throw error
    return data
  }

  async getFriendRequests(userId: string) {
    const { data, error } = await supabase
      .from('friendships')
      .select(`
        *,
        requester:profiles!friendships_user_id_fkey(id, username, first_name, last_name, avatar_url, fhi_score)
      `)
      .eq('friend_id', userId)
      .eq('status', 'PENDING')

    if (error) throw error
    return data
  }

  // Leaderboard operations
  async getLeaderboard(type: 'fhi_score' | 'total_grass_touched' | 'longest_streak', limit: number = 10) {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, first_name, last_name, avatar_url, fhi_score, total_grass_touched, longest_streak')
      .order(type, { ascending: false })
      .limit(limit)

    if (error) throw error
    return data
  }

  // Weekly stats (can be expanded to track weekly data in separate table)
  async getWeeklyStats(userId: string) {
    try {
      // For now, calculate from recent challenges
      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      
      const { data, error } = await supabase
        .from('challenges')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'COMPLETED')
        .gte('completed_at', oneWeekAgo)

      if (error) {
        console.warn('⚠️ Could not fetch weekly stats:', error)
        return { grassTouched: 0, fhiGained: 0, challengesCompleted: 0 }
      }

      const weeklyStats = {
        grassTouched: data?.length || 0,
        fhiGained: data?.reduce((sum, challenge) => sum + (challenge.fhi_points_awarded || 0), 0) || 0,
        challengesCompleted: data?.length || 0
      }

      return weeklyStats
    } catch (error) {
      console.warn('⚠️ Error calculating weekly stats:', error)
      return { grassTouched: 0, fhiGained: 0, challengesCompleted: 0 }
    }
  }

  // Upload image to Supabase storage
  async uploadImage(file: File, bucket: string = 'challenge-photos'): Promise<string> {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file)

      if (error) {
        console.warn('⚠️ Storage upload failed, using fallback:', error)
        // Fallback: return a placeholder URL
        return `https://via.placeholder.com/400x300/10b981/ffffff?text=Challenge+Photo+${Date.now()}`
      }

      // Get public URL
      const { data: publicUrl } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName)

      return publicUrl.publicUrl
    } catch (error) {
      console.warn('⚠️ Storage upload error, using fallback:', error)
      return `https://via.placeholder.com/400x300/10b981/ffffff?text=Challenge+Photo+${Date.now()}`
    }
  }
}

export const databaseService = new DatabaseService()