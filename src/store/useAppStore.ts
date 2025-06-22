import { create } from 'zustand'
import { GrassPatch, User, SwipeAction, GrassChallenge, GrassBotRoast, Achievement } from '../types'

interface AppState {
  // User state
  currentUser: User | null
  setCurrentUser: (user: User) => void
  
  // Grass patches (satellite imagery near user)
  grassPatches: GrassPatch[]
  currentPatchIndex: number
  swipedPatches: Set<string>
  likedPatches: Set<string>
  
  // Active challenges (1-hour grass touching)
  activeChallenge: GrassChallenge | null
  completedChallenges: GrassChallenge[]
  
  // Grass Bot (Claude AI roasting system)
  grassBotRoasts: GrassBotRoast[]
  showRoastPopup: boolean
  currentRoast: GrassBotRoast | null
  
  // FHI System
  updateFHIScore: (points: number) => void
  completeChallenge: (challengeId: string, imageUrl: string) => void
  failChallenge: (challengeId: string) => void
  
  // Actions
  swipePatch: (action: SwipeAction) => void
  nextPatch: () => void
  resetSwipeStack: () => void
  createChallenge: (patchId: string) => void
  
  // Grass Bot Actions
  triggerGrassBotRoast: (triggerEvent: string) => void
  dismissRoast: () => void
  
  // UI state
  isLoading: boolean
  setLoading: (loading: boolean) => void
}

// Mock satellite imagery grass patches (within 1km of user)
const mockGrassPatches: GrassPatch[] = [
  {
    id: '1',
    name: 'Berkeley Campus Quad',
    claudeDescription: 'Ah yes, the classic university quad grass. Premium grade-A procrastination material. This emerald carpet has witnessed more existential crises than your therapist. Perfect for contemplating your life choices while dodging frisbees thrown by people who clearly have their shit together.',
    satelliteImageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
    location: {
      lat: 37.8719,
      lng: -122.2585,
      address: 'UC Berkeley Campus',
      city: 'Berkeley, CA',
      distanceFromUser: 342
    },
    difficultyRating: 2,
    grassQuality: 'decent',
    estimatedWalkTime: '4 min walk',
    discoveredBy: 'GrassBot',
    isActive: true
  },
  {
    id: '2', 
    name: 'People\'s Park Rebellion Grass',
    claudeDescription: 'Historic revolutionary grass that has literally seen some shit. This patch carries the weight of decades of protests, drum circles, and questionable life decisions. Touch at your own risk - this grass judges you harder than your parents.',
    satelliteImageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    location: {
      lat: 37.8675,
      lng: -122.2573,
      address: '2556 Haste St',
      city: 'Berkeley, CA', 
      distanceFromUser: 156
    },
    difficultyRating: 4,
    grassQuality: 'questionable',
    estimatedWalkTime: '2 min walk',
    discoveredBy: 'Anonymous Revolutionary',
    isActive: true
  },
  {
    id: '3',
    name: 'Pristine Residential Lawn',
    claudeDescription: 'Karen\'s meticulously maintained front lawn. This grass is more pampered than a Silicon Valley startup founder. Warning: approaching this grass may trigger HOA violations and passive-aggressive neighborhood drama. Proceed with maximum stealth.',
    satelliteImageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80',
    location: {
      lat: 37.8698,
      lng: -122.2647,
      address: '1847 Rose St',
      city: 'Berkeley, CA',
      distanceFromUser: 687
    },
    difficultyRating: 5,
    grassQuality: 'pristine',
    estimatedWalkTime: '8 min walk',
    discoveredBy: 'SatelliteBot',
    isActive: true
  },
  {
    id: '4',
    name: 'Sketchy Park Corner',
    claudeDescription: 'This grass patch has seen things. Dark things. The kind of things that make even weeds uncomfortable. But hey, grass is grass, and your FHI score doesn\'t discriminate. Just maybe bring hand sanitizer... and perhaps a tetanus shot.',
    satelliteImageUrl: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800&q=80',
    location: {
      lat: 37.8701,
      lng: -122.2590,
      address: 'Ohlone Park',
      city: 'Berkeley, CA',
      distanceFromUser: 298
    },
    difficultyRating: 3,
    grassQuality: 'sus',
    estimatedWalkTime: '3 min walk',
    discoveredBy: 'Urban Explorer',
    isActive: true
  },
  {
    id: '5',
    name: 'Coffee Shop Patio Grass',
    claudeDescription: 'Hipster-adjacent grass that only drinks oat milk lattes and judges your music taste. This green space is perfect for Instagram stories about "connecting with nature" while simultaneously checking your crypto portfolio.',
    satelliteImageUrl: 'https://images.unsplash.com/photo-1560114928-40f1f1eb26a0?w=800&q=80',
    location: {
      lat: 37.8735,
      lng: -122.2601,
      address: '2124 Center St',
      city: 'Berkeley, CA',
      distanceFromUser: 445
    },
    difficultyRating: 1,
    grassQuality: 'decent',
    estimatedWalkTime: '5 min walk',
    discoveredBy: 'CaffeineAddict',
    isActive: true
  }
]

// Mock user with FHI score system
const mockUser: User = {
  id: 'user-1',
  username: 'grassmaster420',
  firstName: 'Alex',
  lastName: 'Chen',
  email: 'alex@onlygrass.app',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80&fit=crop&crop=face',
  
  // FHI System
  fhiScore: 847,
  totalGrassTouched: 42,
  streak: 7,
  longestStreak: 23,
  
  // Location (Berkeley area)
  latitude: 37.8719,
  longitude: -122.2585,
  shareLocation: true,
  
  // Social
  friends: [],
  
  // Stats
  joinedDate: '2024-01-15',
  achievements: [
    {
      id: 'ach-1',
      type: 'FIRST_GRASS',
      name: 'First Touch',
      description: 'Touched your first grass patch',
      icon: '🌱',
      unlockedAt: '2024-01-15',
      rarity: 'common'
    },
    {
      id: 'ach-2', 
      type: 'STREAK_5',
      name: 'Getting Consistent',
      description: 'Maintained a 5-day grass touching streak',
      icon: '🔥',
      unlockedAt: '2024-01-20',
      rarity: 'rare'
    }
  ],
  weeklyStats: {
    grassTouched: 12,
    fhiGained: 156,
    challengesCompleted: 11
  }
}

// Mock Grass Bot roasts
const mockRoasts: GrassBotRoast[] = [
  {
    id: 'roast-1',
    roastText: 'Another failed challenge? At this rate, the grass is going to start avoiding YOU. Maybe try setting your alarm next time, champ. 🌱💀',
    roastType: 'MODERATE_ROAST',
    triggerEvent: 'challenge_failed',
    isDisplayed: false,
    createdAt: '2024-01-23T10:30:00Z'
  },
  {
    id: 'roast-2',
    roastText: 'Your FHI score is dropping faster than your motivation to go outside. The grass is literally right there. It\'s not going anywhere. Unlike your dignity. 🤡',
    roastType: 'SAVAGE_BURN',
    triggerEvent: 'low_fhi',
    isDisplayed: false,
    createdAt: '2024-01-23T11:15:00Z'
  }
]

export const useAppStore = create<AppState>((set, get) => ({
  // User state
  currentUser: mockUser,
  setCurrentUser: (user) => set({ currentUser: user }),
  
  // Grass patches
  grassPatches: mockGrassPatches,
  currentPatchIndex: 0,
  swipedPatches: new Set(),
  likedPatches: new Set(),
  
  // Challenges
  activeChallenge: null,
  completedChallenges: [],
  
  // Grass Bot
  grassBotRoasts: mockRoasts,
  showRoastPopup: false,
  currentRoast: null,
  
  // FHI System
  updateFHIScore: (points: number) => {
    const { currentUser } = get()
    if (currentUser) {
      set({
        currentUser: {
          ...currentUser,
          fhiScore: Math.max(0, currentUser.fhiScore + points)
        }
      })
    }
  },
  
  completeChallenge: (challengeId: string, imageUrl: string) => {
    const { currentUser, updateFHIScore } = get()
    if (currentUser) {
      // Award FHI points for successful challenge
      updateFHIScore(25)
      
      // Update user stats
      set({
        currentUser: {
          ...currentUser,
          totalGrassTouched: currentUser.totalGrassTouched + 1,
          streak: currentUser.streak + 1,
          longestStreak: Math.max(currentUser.longestStreak, currentUser.streak + 1),
          weeklyStats: {
            ...currentUser.weeklyStats,
            grassTouched: currentUser.weeklyStats.grassTouched + 1,
            fhiGained: currentUser.weeklyStats.fhiGained + 25,
            challengesCompleted: currentUser.weeklyStats.challengesCompleted + 1
          }
        },
        activeChallenge: null
      })
    }
  },
  
  failChallenge: (challengeId: string) => {
    const { currentUser, updateFHIScore, triggerGrassBotRoast } = get()
    if (currentUser) {
      // Deduct FHI points for failed challenge
      updateFHIScore(-15)
      
      // Reset streak
      set({
        currentUser: {
          ...currentUser,
          streak: 0
        },
        activeChallenge: null
      })
      
      // Trigger Grass Bot roast
      triggerGrassBotRoast('challenge_failed')
    }
  },
  
  // Actions
  swipePatch: (action: SwipeAction) => {
    const { swipedPatches, likedPatches } = get()
    const newSwipedPatches = new Set(swipedPatches).add(action.grassId)
    const newLikedPatches = new Set(likedPatches)
    
    if (action.action === 'like') {
      newLikedPatches.add(action.grassId)
      // Create challenge when user swipes right
      get().createChallenge(action.grassId)
    }
    
    set({
      swipedPatches: newSwipedPatches,
      likedPatches: newLikedPatches
    })
  },
  
  nextPatch: () => {
    const { currentPatchIndex, grassPatches } = get()
    if (currentPatchIndex < grassPatches.length - 1) {
      set({ currentPatchIndex: currentPatchIndex + 1 })
    }
  },
  
  resetSwipeStack: () => {
    set({
      currentPatchIndex: 0,
      swipedPatches: new Set(),
      likedPatches: new Set()
    })
  },
  
  createChallenge: (patchId: string) => {
    const { grassPatches } = get()
    const patch = grassPatches.find(p => p.id === patchId)
    if (patch) {
      const challenge: GrassChallenge = {
        id: `challenge-${Date.now()}`,
        patchId,
        patch,
        status: 'ACTIVE',
        expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour from now
        startedAt: new Date().toISOString(),
        geminiVerified: false,
        fhiPointsAwarded: 0
      }
      
      set({ activeChallenge: challenge })
    }
  },
  
  // Grass Bot
  triggerGrassBotRoast: (triggerEvent: string) => {
    const { grassBotRoasts } = get()
    const availableRoasts = grassBotRoasts.filter(r => r.triggerEvent === triggerEvent && !r.isDisplayed)
    
    if (availableRoasts.length > 0) {
      const randomRoast = availableRoasts[Math.floor(Math.random() * availableRoasts.length)]
      set({
        currentRoast: randomRoast,
        showRoastPopup: true
      })
    }
  },
  
  dismissRoast: () => {
    set({
      showRoastPopup: false,
      currentRoast: null
    })
  },
  
  // UI state
  isLoading: false,
  setLoading: (loading) => set({ isLoading: loading })
}))