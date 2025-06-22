import { create } from 'zustand'
import { GrassPatch, User, SwipeAction, GrassChallenge, GrassBotRoast, Achievement } from '../types'
import { googleMapsService, GrassLocation } from '../services/googleMaps'
import { geminiService } from '../services/gemini'
import { anthropicService } from '../services/anthropic'
import { authService } from '../services/auth'
import { databaseService } from '../services/database'

interface AppState {
  // User state
  currentUser: User | null
  setCurrentUser: (user: User) => void
  loadCurrentUser: () => Promise<User | null>
  
  // Location state
  userLocation: { lat: number; lng: number } | null
  locationPermission: 'granted' | 'denied' | 'prompt' | null
  
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
  completeChallenge: (challengeId: string, imageFile: File) => Promise<void>
  failChallenge: (challengeId: string) => void
  
  // Actions
  swipePatch: (action: SwipeAction) => void
  nextPatch: () => void
  resetSwipeStack: () => void
  createChallenge: (patchId: string) => void
  
  // Location and data loading
  initializeLocation: () => Promise<void>
  loadGrassPatches: () => Promise<void>
  refreshNearbyGrass: () => Promise<void>
  
  // Grass Bot Actions
  triggerGrassBotRoast: (triggerEvent: string) => Promise<void>
  dismissRoast: () => void
  
  // UI state
  isLoading: boolean
  setLoading: (loading: boolean) => void
  error: string | null
  setError: (error: string | null) => void
}

// Convert Supabase profile to User format
const convertProfileToUser = async (profile: any): Promise<User> => {
  let weeklyStats = { grassTouched: 0, fhiGained: 0, challengesCompleted: 0 }
  let achievements: Achievement[] = []

  try {
    // Try to get weekly stats and achievements from database
    const [statsResult, achievementsResult] = await Promise.all([
      databaseService.getWeeklyStats(profile.id).catch(() => weeklyStats),
      databaseService.getUserAchievements(profile.id).catch(() => [])
    ])
    
    weeklyStats = statsResult
    achievements = achievementsResult.map((ach: any) => ({
      id: ach.id,
      type: ach.type as any,
      name: ach.name,
      description: ach.description,
      icon: ach.icon,
      unlockedAt: ach.unlocked_at,
      rarity: ach.rarity as any
    }))
  } catch (error) {
    console.warn('⚠️ Could not load user stats from database, using defaults')
  }

  return {
    id: profile.id,
    username: profile.username,
    firstName: profile.first_name,
    lastName: profile.last_name,
    email: profile.email,
    avatar: profile.avatar_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80&fit=crop&crop=face',
    
    // FHI System
    fhiScore: profile.fhi_score,
    totalGrassTouched: profile.total_grass_touched,
    streak: profile.streak,
    longestStreak: profile.longest_streak,
    
    // Location
    latitude: profile.latitude,
    longitude: profile.longitude,
    shareLocation: profile.share_location,
    
    // Social
    friends: [], // Will be loaded separately
    
    // Stats
    joinedDate: profile.joined_date,
    achievements,
    weeklyStats
  }
}

// Fallback grass descriptions to avoid API rate limits
const getRandomFallbackDescription = (): string => {
  const descriptions = [
    "A suspiciously well-maintained patch of grass that's probably judging your life choices.",
    "This grass has seen things. Mostly feet, but still things.",
    "Premium organic grass, ethically sourced from the ground.",
    "Grass so nice, you'll almost forget you're avoiding real human interaction.",
    "This verdant paradise is just waiting for your vitamin D-deficient touch.",
    "Nature's carpet, now with extra judgment for your indoor lifestyle.",
    "Local grass patch, probably more social than you are.",
    "Artisanal outdoor flooring with a side of existential dread.",
    "This grass knows what you did last summer... indoors.",
    "Peak grass touching real estate for reformed basement dwellers."
  ]
  return descriptions[Math.floor(Math.random() * descriptions.length)]
}

// Convert Google Maps location to GrassPatch
const convertLocationToGrassPatch = async (location: GrassLocation, index: number): Promise<GrassPatch> => {
  // Generate AI description using Gemini with rate limiting
  let claudeDescription = ''
  
  // Only generate descriptions for first 3 patches to avoid rate limits
  if (index < 3) {
    try {
      // Add delay between API calls to avoid rate limiting
      if (index > 0) {
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
      
      claudeDescription = await geminiService.generateGrassDescription({
        lat: location.lat,
        lng: location.lng,
        name: location.address,
        address: location.address
      })
    } catch (error) {
      console.error('Failed to generate description:', error)
      claudeDescription = getRandomFallbackDescription()
    }
  } else {
    claudeDescription = getRandomFallbackDescription()
  }

  // Determine grass quality based on location type
  let grassQuality: 'pristine' | 'decent' | 'questionable' | 'sus' = 'decent'
  if (location.address.toLowerCase().includes('park')) {
    grassQuality = Math.random() > 0.3 ? 'decent' : 'pristine'
  } else if (location.address.toLowerCase().includes('residential')) {
    grassQuality = 'pristine'
  } else if (location.address.toLowerCase().includes('street')) {
    grassQuality = Math.random() > 0.5 ? 'questionable' : 'sus'
  }

  // Calculate difficulty based on distance and location type
  let difficultyRating = 1
  if (location.distanceFromUser > 500) difficultyRating += 1
  if (location.distanceFromUser > 800) difficultyRating += 1
  if (grassQuality === 'sus') difficultyRating += 1
  if (grassQuality === 'pristine') difficultyRating += 1

  return {
    id: location.placeId || `grass-${Date.now()}-${Math.random()}`,
    name: location.address.split(',')[0] || 'Grass Patch',
    claudeDescription,
    satelliteImageUrl: location.satelliteImageUrl,
    location: {
      lat: location.lat,
      lng: location.lng,
      address: location.address,
      city: location.city,
      distanceFromUser: location.distanceFromUser
    },
    difficultyRating: Math.min(5, difficultyRating),
    grassQuality,
    estimatedWalkTime: location.distanceFromUser < 200 ? '1 min walk' :
                       location.distanceFromUser < 500 ? '3 min walk' :
                       location.distanceFromUser < 800 ? '5 min walk' : '8+ min walk',
    discoveredBy: 'SatelliteBot',
    isActive: true
  }
}

export const useAppStore = create<AppState>((set, get) => ({
  // User state
  currentUser: null,
  setCurrentUser: (user) => set({ currentUser: user }),

  // Load user from authentication
  loadCurrentUser: async () => {
    try {
      console.log('🔄 Loading current user...')
      const authUser = await authService.getCurrentUser()
      if (authUser) {
        console.log('🔄 Got auth user, loading profile...')
        const profile = await authService.getUserProfile(authUser.id)
        console.log('🔄 Got profile, avatar_url:', profile.avatar_url)
        const user = await convertProfileToUser(profile)
        console.log('🔄 Converted to user, avatar:', user.avatar)
        set({ currentUser: user })
        return user
      }
    } catch (error) {
      console.error('Failed to load current user:', error)
      set({ error: 'Failed to load user profile' })
    }
    return null
  },
  
  // Location state
  userLocation: null,
  locationPermission: null,
  
  // Grass patches
  grassPatches: [],
  currentPatchIndex: 0,
  swipedPatches: new Set(),
  likedPatches: new Set(),
  
  // Challenges
  activeChallenge: null,
  completedChallenges: [],
  
  // Grass Bot
  grassBotRoasts: [],
  showRoastPopup: false,
  currentRoast: null,
  
  // Initialize location and load grass patches
  initializeLocation: async () => {
    set({ isLoading: true, error: null })
    
    try {
      // Load current user data first
      const user = await get().loadCurrentUser()
      
      // Initialize Google Maps API
      await googleMapsService.initialize()
      
      // Check if geolocation is available and user hasn't denied it
      if (!navigator.geolocation) {
        throw new Error('Geolocation not supported')
      }
      
      // Request permission first
      const permission = await navigator.permissions.query({ name: 'geolocation' })
      console.log('📍 Geolocation permission status:', permission.state)
      
      let location: { lat: number; lng: number }
      
      if (permission.state === 'granted' || permission.state === 'prompt') {
        try {
          location = await googleMapsService.getCurrentLocation()
          set({ 
            userLocation: location,
            locationPermission: 'granted'
          })
          console.log('📍 Location obtained:', location)
        } catch (locationError) {
          console.warn('⚠️ Geolocation failed, using Berkeley default')
          location = { lat: 37.8719, lng: -122.2585 } // Berkeley default
          set({ 
            userLocation: location,
            locationPermission: 'denied'
          })
        }
      } else {
        console.log('📍 Using Berkeley default location')
        location = { lat: 37.8719, lng: -122.2585 } // Berkeley default
        set({ 
          userLocation: location,
          locationPermission: 'denied'
        })
      }
      
      // Update user location in database
      if (user) {
        try {
          await authService.updateProfile(user.id, {
            latitude: location.lat,
            longitude: location.lng
          })
          
          // Reload user to get updated location
          await get().loadCurrentUser()
        } catch (error) {
          console.warn('⚠️ Could not update user location in database')
        }
      }
      
      // Load active challenge if any
      if (user) {
        try {
          const activeChallenge = await databaseService.getActiveChallenge(user.id)
          set({ activeChallenge })
        } catch (error) {
          console.warn('⚠️ Could not load active challenge')
          set({ activeChallenge: null })
        }
      }
      
      // Load grass patches
      await get().loadGrassPatches()
      
    } catch (error) {
      console.error('Location initialization failed:', error)
      set({ 
        error: 'Using default location (Berkeley). Grant location permission for better experience.',
        locationPermission: 'denied',
        userLocation: { lat: 37.8719, lng: -122.2585 } // Berkeley default
      })
      
      // Still try to load grass patches with default location
      await get().loadGrassPatches()
    } finally {
      set({ isLoading: false })
    }
  },

  loadGrassPatches: async () => {
    const { userLocation } = get()
    if (!userLocation) return

    try {
      set({ isLoading: true })
      
      // Find grass patches within 1km
      const locations = await googleMapsService.findGrassPatches(userLocation, 1)
      
      // Convert to grass patches with AI descriptions
      const grassPatches: GrassPatch[] = []
      for (let i = 0; i < locations.length; i++) {
        const location = locations[i]
        const patch = await convertLocationToGrassPatch(location, i)
        grassPatches.push(patch)
      }
      
      set({ 
        grassPatches,
        currentPatchIndex: 0,
        swipedPatches: new Set(),
        likedPatches: new Set()
      })
      
    } catch (error) {
      console.error('Failed to load grass patches:', error)
      set({ error: 'Failed to load nearby grass patches' })
    } finally {
      set({ isLoading: false })
    }
  },

  refreshNearbyGrass: async () => {
    const { userLocation } = get()
    if (!userLocation) {
      await get().initializeLocation()
    } else {
      await get().loadGrassPatches()
    }
  },
  
  // FHI System
  updateFHIScore: async (points: number) => {
    const { currentUser } = get()
    if (!currentUser) return

    try {
      // Update FHI score in database
      await authService.updateFHIScore(currentUser.id, points)
      
      // Reload user data to get updated score
      const updatedUser = await get().loadCurrentUser()
      
      // Trigger roast for low FHI score
      if (updatedUser && updatedUser.fhiScore < 200 && points < 0) {
        await get().triggerGrassBotRoast('low_fhi')
      }
    } catch (error) {
      console.error('Failed to update FHI score:', error)
      set({ error: 'Failed to update FHI score' })
    }
  },
  
  completeChallenge: async (challengeId: string, imageFile: File) => {
    const { currentUser, activeChallenge } = get()
    if (!currentUser || !activeChallenge) return

    set({ isLoading: true })
    
    try {
      // Validate photo with Gemini
      const validation = await geminiService.validateGrassPhoto(
        imageFile,
        {
          lat: activeChallenge.patch.location.lat,
          lng: activeChallenge.patch.location.lng,
          name: activeChallenge.patch.name
        }
      )

      if (validation.isValid) {
        // Award FHI points for successful challenge
        const pointsAwarded = 25 + (validation.confidence > 80 ? 5 : 0)
        
        // Upload image to Supabase storage
        const imageUrl = await databaseService.uploadImage(imageFile)
        
        // Update challenge in database
        await databaseService.completeChallenge(challengeId, imageUrl, pointsAwarded)
        
        // Update user stats in database
        await authService.updateFHIScore(currentUser.id, pointsAwarded)
        await authService.updateGrassStats(currentUser.id, 1)
        
        // Check for achievements and unlock them
        const newTotalGrass = currentUser.totalGrassTouched + 1
        const newStreak = currentUser.streak + 1
        
        // Unlock achievements
        if (newTotalGrass === 1) {
          await databaseService.unlockAchievement(currentUser.id, {
            id: '',
            type: 'FIRST_GRASS',
            name: 'First Touch',
            description: 'Touched your first grass patch',
            icon: '🌱',
            unlockedAt: new Date().toISOString(),
            rarity: 'common'
          })
        }
        
        if (newStreak === 5) {
          await databaseService.unlockAchievement(currentUser.id, {
            id: '',
            type: 'STREAK_5',
            name: 'Getting Consistent',
            description: 'Maintained a 5-day grass touching streak',
            icon: '🔥',
            unlockedAt: new Date().toISOString(),
            rarity: 'rare'
          })
        }
        
        // Reload user data
        await get().loadCurrentUser()
        
        // Clear active challenge
        set({ activeChallenge: null })

        // Trigger success roast
        await get().triggerGrassBotRoast('success')
        
      } else {
        // Photo didn't pass validation
        throw new Error(`Photo validation failed: ${validation.reason}`)
      }
      
    } catch (error) {
      console.error('Challenge completion failed:', error)
      set({ error: error instanceof Error ? error.message : 'Failed to validate photo. Please try again.' })
      throw error
    } finally {
      set({ isLoading: false })
    }
  },
  
  failChallenge: async (challengeId: string) => {
    const { currentUser, activeChallenge } = get()
    if (!currentUser || !activeChallenge) return

    try {
      // Update challenge status in database
      await databaseService.failChallenge(challengeId, -15)
      
      // Update user stats in database
      await authService.updateFHIScore(currentUser.id, -15)
      await authService.resetStreak(currentUser.id)
      
      // Reload user data to get updated stats
      await get().loadCurrentUser()
      
      // Clear active challenge
      set({ activeChallenge: null })
      
      // Trigger Grass Bot roast
      await get().triggerGrassBotRoast('failure')
      
    } catch (error) {
      console.error('Failed to fail challenge:', error)
      set({ error: 'Failed to update challenge status' })
    }
  },
  
  // Actions
  swipePatch: (action: SwipeAction) => {
    try {
      const { swipedPatches, likedPatches } = get()
      const newSwipedPatches = new Set(swipedPatches).add(action.grassId)
      const newLikedPatches = new Set(likedPatches)
      
      if (action.action === 'like') {
        newLikedPatches.add(action.grassId)
        console.log('👍 Added patch to liked:', action.grassId)
        // Challenge will be created when user confirms in startChallenge modal
      } else {
        console.log('👎 Swiped left on patch:', action.grassId)
      }
      
      set({
        swipedPatches: newSwipedPatches,
        likedPatches: newLikedPatches
      })
    } catch (error) {
      console.error('❌ Error in swipePatch:', error)
      // Don't throw - just log the error to prevent app crashes
    }
  },
  
  nextPatch: () => {
    try {
      const { currentPatchIndex, grassPatches } = get()
      console.log('🔄 Moving to next patch. Current index:', currentPatchIndex, 'Total patches:', grassPatches.length)
      
      if (currentPatchIndex < grassPatches.length - 1) {
        set({ currentPatchIndex: currentPatchIndex + 1 })
        console.log('✅ Moved to patch index:', currentPatchIndex + 1)
      } else {
        console.log('🔄 Running out of patches, refreshing...')
        // Load more patches if we're running out - don't await to prevent blocking
        get().refreshNearbyGrass().catch(error => {
          console.error('❌ Error refreshing grass patches:', error)
        })
      }
    } catch (error) {
      console.error('❌ Error in nextPatch:', error)
      // Don't throw - just log the error to prevent app crashes
    }
  },
  
  resetSwipeStack: () => {
    set({
      currentPatchIndex: 0,
      swipedPatches: new Set(),
      likedPatches: new Set()
    })
  },
  
  createChallenge: async (patchId: string) => {
    const { grassPatches, currentUser } = get()
    const patch = grassPatches.find(p => p.id === patchId)
    
    console.log('🎯 createChallenge called:', { patchId, patch: patch?.name, user: currentUser?.username })
    
    if (!patch) {
      console.error('❌ Patch not found for ID:', patchId)
      throw new Error('Grass patch not found')
    }
    
    if (!currentUser) {
      console.error('❌ No current user')
      throw new Error('User not logged in')
    }
    
    try {
      console.log('🚀 Creating challenge for patch:', patch.name)
      
      // Create challenge in database
      const challengeId = await databaseService.createChallenge(currentUser.id, patch)
      console.log('✅ Challenge created with ID:', challengeId)
      
      // Load the challenge from database to get all details
      const challenge = await databaseService.getActiveChallenge(currentUser.id)
      
      if (challenge) {
        console.log('✅ Challenge loaded successfully:', {
          id: challenge.id,
          patchName: challenge.patch.name,
          expiresAt: challenge.expiresAt,
          status: challenge.status
        })
        set({ activeChallenge: challenge, error: null })
        return challenge
      } else {
        console.error('❌ Failed to load created challenge from database')
        throw new Error('Challenge created but failed to load from database')
      }
    } catch (error) {
      console.error('💥 Failed to create challenge:', error)
      set({ error: 'Failed to create challenge' })
      throw error
    }
  },
  
  // Grass Bot with real Anthropic API
  triggerGrassBotRoast: async (triggerEvent: string) => {
    const { currentUser } = get()
    if (!currentUser) return

    try {
      const response = await anthropicService.generateContextualRoast(
        triggerEvent as any,
        {
          fhiScore: currentUser.fhiScore,
          streak: currentUser.streak,
          grassTouched: currentUser.totalGrassTouched
        }
      )

      const roast: GrassBotRoast = {
        id: `roast-${Date.now()}`,
        roastText: response.content,
        roastType: response.mood === 'savage' ? 'SAVAGE_BURN' : 
                   response.mood === 'brutal' ? 'SAVAGE_BURN' : 'MODERATE_ROAST',
        triggerEvent,
        isDisplayed: false,
        createdAt: new Date().toISOString()
      }

      set({
        currentRoast: roast,
        showRoastPopup: true,
        grassBotRoasts: [...get().grassBotRoasts, roast]
      })

    } catch (error) {
      console.error('Failed to generate roast:', error)
      
      // Fallback roasts
      const fallbackRoasts = [
        "Your grass-touching skills are about as reliable as my internet connection right now.",
        "Even my API errors are more consistent than your FHI score.",
        "Error 404: Motivation to touch grass not found."
      ]
      
      const roast: GrassBotRoast = {
        id: `roast-${Date.now()}`,
        roastText: fallbackRoasts[Math.floor(Math.random() * fallbackRoasts.length)],
        roastType: 'MODERATE_ROAST',
        triggerEvent,
        isDisplayed: false,
        createdAt: new Date().toISOString()
      }

      set({
        currentRoast: roast,
        showRoastPopup: true,
        grassBotRoasts: [...get().grassBotRoasts, roast]
      })
    }
  },
  
  dismissRoast: () => {
    const { currentRoast, grassBotRoasts } = get()
    if (currentRoast) {
      // Mark roast as displayed
      const updatedRoasts = grassBotRoasts.map(r => 
        r.id === currentRoast.id ? { ...r, isDisplayed: true } : r
      )
      
      set({
        showRoastPopup: false,
        currentRoast: null,
        grassBotRoasts: updatedRoasts
      })
    }
  },
  
  // UI state
  isLoading: false,
  setLoading: (loading) => set({ isLoading: loading }),
  error: null,
  setError: (error) => set({ error })
}))

// Initialize location when the app first loads (moved to App component)