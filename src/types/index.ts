export interface GrassPatch {
  id: string
  name: string
  claudeDescription: string
  satelliteImageUrl: string
  location: {
    lat: number
    lng: number
    address: string
    city: string
    distanceFromUser: number // in meters
  }
  difficultyRating: number // 1-5 scale
  grassQuality: 'pristine' | 'decent' | 'questionable' | 'sus'
  estimatedWalkTime: string
  discoveredBy?: string
  isActive: boolean
}

export interface User {
  id: string
  username: string
  firstName: string
  lastName: string
  avatar: string
  email: string
  
  // Core FHI System
  fhiScore: number
  totalGrassTouched: number
  streak: number
  longestStreak: number
  
  // Location
  latitude?: number
  longitude?: number
  shareLocation: boolean
  
  // Social
  friends: User[]
  
  // Stats
  joinedDate: string
  achievements: Achievement[]
  weeklyStats: {
    grassTouched: number
    fhiGained: number
    challengesCompleted: number
  }
}

export interface Achievement {
  id: string
  type: 'FIRST_GRASS' | 'STREAK_5' | 'STREAK_10' | 'STREAK_30' | 'FHI_MASTER' | 'SPEED_DEMON' | 'GRASS_CONNOISSEUR' | 'SOCIAL_BUTTERFLY'
  name: string
  description: string
  icon: string
  unlockedAt: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

export interface GrassChallenge {
  id: string
  patchId: string
  patch: GrassPatch
  status: 'ACTIVE' | 'COMPLETED' | 'FAILED' | 'EXPIRED'
  expiresAt: string
  startedAt: string
  completedAt?: string
  submissionImageUrl?: string
  geminiVerified: boolean
  fhiPointsAwarded: number
  validationAttempts?: number
  validationResult?: any
}

export interface SwipeAction {
  grassId: string
  action: 'like' | 'nope'
  timestamp: string
}

export interface GrassBotRoast {
  id: string
  roastText: string
  roastType: 'GENTLE_NUDGE' | 'MODERATE_ROAST' | 'SAVAGE_BURN' | 'EXISTENTIAL_CRISIS'
  triggerEvent: string
  isDisplayed: boolean
  createdAt: string
}

export interface FriendRequest {
  id: string
  fromUser: User
  toUserId: string
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED'
  createdAt: string
}

export interface Leaderboard {
  period: 'daily' | 'weekly' | 'monthly' | 'allTime'
  users: LeaderboardEntry[]
}

export interface LeaderboardEntry {
  user: User
  rank: number
  fhiScore: number
  grassTouched: number
  streak: number
}