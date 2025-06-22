import { supabase } from '../lib/supabase'

export interface Friend {
  id: string
  username: string
  firstName: string
  lastName: string
  avatarUrl?: string
  fhiScore: number
  streak: number
  totalGrassTouched: number
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED'
  createdAt: string
}

export interface FriendRequest {
  id: string
  userId: string
  friendId: string
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED'
  createdAt: string
  user: {
    username: string
    firstName: string
    lastName: string
    avatarUrl?: string
    fhiScore: number
  }
}

export interface LeaderboardEntry {
  id: string
  username: string
  firstName: string
  lastName: string
  avatarUrl?: string
  fhiScore: number
  streak: number
  totalGrassTouched: number
  rank: number
}

export class SocialService {
  // Send friend request
  async sendFriendRequest(userId: string, friendId: string) {
    console.log('📤 Sending friend request from', userId, 'to', friendId)
    
    // Check if friendship already exists
    const { data: existing } = await supabase
      .from('friendships')
      .select('id, status')
      .or(`and(user_id.eq.${userId},friend_id.eq.${friendId}),and(user_id.eq.${friendId},friend_id.eq.${userId})`)
      .maybeSingle()

    if (existing) {
      if (existing.status === 'PENDING') {
        throw new Error('Friend request already sent')
      }
      if (existing.status === 'ACCEPTED') {
        throw new Error('Already friends')
      }
    }

    const { data, error } = await supabase
      .from('friendships')
      .insert({
        user_id: userId,
        friend_id: friendId,
        status: 'PENDING'
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Accept friend request
  async acceptFriendRequest(requestId: string) {
    console.log('✅ Accepting friend request:', requestId)
    
    const { data, error } = await supabase
      .from('friendships')
      .update({ status: 'ACCEPTED' })
      .eq('id', requestId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Decline friend request
  async declineFriendRequest(requestId: string) {
    console.log('❌ Declining friend request:', requestId)
    
    const { data, error } = await supabase
      .from('friendships')
      .update({ status: 'DECLINED' })
      .eq('id', requestId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Remove friend
  async removeFriend(userId: string, friendId: string) {
    console.log('🗑️ Removing friendship between', userId, 'and', friendId)
    
    const { error } = await supabase
      .from('friendships')
      .delete()
      .or(`and(user_id.eq.${userId},friend_id.eq.${friendId}),and(user_id.eq.${friendId},friend_id.eq.${userId})`)

    if (error) throw error
  }

  // Get friends list
  async getFriends(userId: string): Promise<Friend[]> {
    console.log('👥 Getting friends for user:', userId)
    
    const { data, error } = await supabase
      .from('friendships')
      .select(`
        id,
        status,
        created_at,
        user_id,
        friend_id,
        user:profiles!friendships_user_id_fkey(
          id,
          username,
          first_name,
          last_name,
          avatar_url,
          fhi_score,
          streak,
          total_grass_touched
        ),
        friend:profiles!friendships_friend_id_fkey(
          id,
          username,
          first_name,
          last_name,
          avatar_url,
          fhi_score,
          streak,
          total_grass_touched
        )
      `)
      .or(`user_id.eq.${userId},friend_id.eq.${userId}`)
      .eq('status', 'ACCEPTED')

    if (error) throw error

    // Transform the data to get the friend's profile (not the current user's)
    return (data || []).map(friendship => {
      const friendProfile = friendship.user_id === userId ? friendship.friend : friendship.user
      return {
        id: friendProfile.id,
        username: friendProfile.username,
        firstName: friendProfile.first_name,
        lastName: friendProfile.last_name,
        avatarUrl: friendProfile.avatar_url,
        fhiScore: friendProfile.fhi_score,
        streak: friendProfile.streak,
        totalGrassTouched: friendProfile.total_grass_touched,
        status: friendship.status,
        createdAt: friendship.created_at
      }
    })
  }

  // Get pending friend requests (received)
  async getPendingRequests(userId: string): Promise<FriendRequest[]> {
    console.log('📩 Getting pending friend requests for user:', userId)
    
    const { data, error } = await supabase
      .from('friendships')
      .select(`
        id,
        user_id,
        friend_id,
        status,
        created_at,
        user:profiles!friendships_user_id_fkey(
          username,
          first_name,
          last_name,
          avatar_url,
          fhi_score
        )
      `)
      .eq('friend_id', userId)
      .eq('status', 'PENDING')

    if (error) throw error

    return (data || []).map(request => ({
      id: request.id,
      userId: request.user_id,
      friendId: request.friend_id,
      status: request.status,
      createdAt: request.created_at,
      user: {
        username: request.user.username,
        firstName: request.user.first_name,
        lastName: request.user.last_name,
        avatarUrl: request.user.avatar_url,
        fhiScore: request.user.fhi_score
      }
    }))
  }

  // Get sent friend requests
  async getSentRequests(userId: string): Promise<FriendRequest[]> {
    console.log('📤 Getting sent friend requests for user:', userId)
    
    const { data, error } = await supabase
      .from('friendships')
      .select(`
        id,
        user_id,
        friend_id,
        status,
        created_at,
        friend:profiles!friendships_friend_id_fkey(
          username,
          first_name,
          last_name,
          avatar_url,
          fhi_score
        )
      `)
      .eq('user_id', userId)
      .eq('status', 'PENDING')

    if (error) throw error

    return (data || []).map(request => ({
      id: request.id,
      userId: request.user_id,
      friendId: request.friend_id,
      status: request.status,
      createdAt: request.created_at,
      user: {
        username: request.friend.username,
        firstName: request.friend.first_name,
        lastName: request.friend.last_name,
        avatarUrl: request.friend.avatar_url,
        fhiScore: request.friend.fhi_score
      }
    }))
  }

  // Search users by username
  async searchUsers(query: string, currentUserId: string) {
    console.log('🔍 Searching users with query:', query)
    
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, first_name, last_name, avatar_url, fhi_score')
      .ilike('username', `%${query}%`)
      .neq('id', currentUserId) // Exclude current user
      .limit(20)

    if (error) throw error
    return data || []
  }

  // Get leaderboard (top users by FHI score)
  async getLeaderboard(limit: number = 50): Promise<LeaderboardEntry[]> {
    console.log('🏆 Getting leaderboard (top', limit, 'users)')
    
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, first_name, last_name, avatar_url, fhi_score, streak, total_grass_touched')
      .order('fhi_score', { ascending: false })
      .limit(limit)

    if (error) throw error

    return (data || []).map((user, index) => ({
      ...user,
      firstName: user.first_name,
      lastName: user.last_name,
      avatarUrl: user.avatar_url,
      fhiScore: user.fhi_score,
      totalGrassTouched: user.total_grass_touched,
      rank: index + 1
    }))
  }

  // Get friends leaderboard
  async getFriendsLeaderboard(userId: string): Promise<LeaderboardEntry[]> {
    console.log('👥🏆 Getting friends leaderboard for user:', userId)
    
    // Get all friends first
    const friends = await this.getFriends(userId)
    
    // Get current user's data
    const { data: currentUser } = await supabase
      .from('profiles')
      .select('id, username, first_name, last_name, avatar_url, fhi_score, streak, total_grass_touched')
      .eq('id', userId)
      .single()

    if (!currentUser) throw new Error('Current user not found')

    // Combine friends and current user, sort by FHI score
    const allUsers = [
      {
        id: currentUser.id,
        username: currentUser.username,
        firstName: currentUser.first_name,
        lastName: currentUser.last_name,
        avatarUrl: currentUser.avatar_url,
        fhiScore: currentUser.fhi_score,
        streak: currentUser.streak,
        totalGrassTouched: currentUser.total_grass_touched
      },
      ...friends
    ].sort((a, b) => b.fhiScore - a.fhiScore)

    return allUsers.map((user, index) => ({
      ...user,
      rank: index + 1
    }))
  }
}

export const socialService = new SocialService()