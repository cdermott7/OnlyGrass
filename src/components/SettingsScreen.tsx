import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, Bell, MapPin, Shield, Moon, Globe, Heart, Camera, 
  Share2, HelpCircle, LogOut, ChevronRight, Brain, Zap, 
  User, Lock, Volume2, Smartphone, Wifi, Database
} from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import { authService } from '../services/auth'

const SettingsScreen: React.FC = () => {
  const navigate = useNavigate()
  const { currentUser, setCurrentUser, loadCurrentUser } = useAppStore()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [notifications, setNotifications] = useState({
    grassChallenges: true,
    fhiUpdates: true,
    streakReminders: true,
    grassBotRoasts: true,
    newPatches: true,
    socialUpdates: false
  })
  const [privacy, setPrivacy] = useState({
    shareLocation: true,
    showFHIScore: true,
    showStreak: true,
    publicProfile: true
  })
  const [preferences, setPreferences] = useState({
    darkMode: false,
    soundEffects: true,
    hapticFeedback: true,
    autoGPS: true
  })
  const [isUpdating, setIsUpdating] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  
  // Handle profile picture change
  const handleProfilePictureChange = () => {
    fileInputRef.current?.click()
  }
  
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !currentUser) return
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (JPG, PNG, etc.)')
      return
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Please select an image smaller than 5MB')
      return
    }
    
    // Show preview
    const previewUrl = URL.createObjectURL(file)
    setPreviewImage(previewUrl)
    
    setIsUpdating(true)
    try {
      console.log('🖼️ Uploading profile picture for user:', currentUser.id)
      console.log('📁 File details:', { name: file.name, size: file.size, type: file.type })
      
      // Upload the actual image file to Supabase storage
      const imageUrl = await authService.uploadProfilePicture(currentUser.id, file)
      console.log('✅ Image uploaded, URL:', imageUrl)
      
      // Update user profile with the actual image URL
      await authService.updateProfile(currentUser.id, {
        avatarUrl: imageUrl
      })
      
      // Reload user data and wait for it to complete
      const updatedUser = await loadCurrentUser()
      console.log('✅ Profile picture updated successfully', updatedUser?.avatar)
      
      // Force re-render by updating state
      if (updatedUser) {
        setCurrentUser(updatedUser)
      }
      
      alert('Profile picture updated successfully!')
      
      // Clear preview
      setPreviewImage(null)
    } catch (error) {
      console.error('❌ Failed to update profile picture:', error)
      
      // Provide specific error messages
      let errorMessage = 'Failed to update profile picture'
      if (error instanceof Error) {
        if (error.message.includes('storage')) {
          errorMessage = 'Failed to upload image. Please try again.'
        } else if (error.message.includes('profile')) {
          errorMessage = 'Failed to save profile. Please try again.'
        } else {
          errorMessage = error.message
        }
      }
      
      alert(errorMessage)
      
      // Clear preview on error
      setPreviewImage(null)
    } finally {
      setIsUpdating(false)
    }
  }
  
  // Handle sign out
  const handleSignOut = async () => {
    if (confirm('Are you sure you want to sign out?')) {
      try {
        await authService.signOut()
        navigate('/')
      } catch (error) {
        console.error('Sign out failed:', error)
        alert('Failed to sign out. Please try again.')
      }
    }
  }
  
  // Handle dark mode toggle
  const handleDarkModeToggle = (enabled: boolean) => {
    setPreferences(prev => ({ ...prev, darkMode: enabled }))
    // Apply dark mode to document
    if (enabled) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }
  
  if (!currentUser) return null
  
  const settingSections = [
    {
      title: 'Account & Profile',
      icon: User,
      items: [
        { 
          icon: Camera, 
          label: isUpdating ? 'Updating...' : 'Edit Profile Picture', 
          action: handleProfilePictureChange 
        },
        { 
          icon: User, 
          label: 'Update Bio & Preferences', 
          action: () => alert('Bio editing coming soon!') 
        },
        { 
          icon: Share2, 
          label: 'Share Your Profile', 
          action: () => {
            if (navigator.share) {
              navigator.share({
                title: 'OnlyGrass Profile',
                text: `Check out ${currentUser.firstName}'s grass touching stats!`,
                url: window.location.origin
              })
            } else {
              navigator.clipboard.writeText(window.location.origin)
              alert('Profile link copied to clipboard!')
            }
          }
        },
        { 
          icon: Heart, 
          label: 'Grass Touching Preferences', 
          action: () => alert('Preference settings coming soon!') 
        },
      ]
    },
    {
      title: 'FHI & Performance',
      icon: Brain,
      items: [
        { 
          icon: Brain, 
          label: 'Show FHI Score Publicly', 
          toggle: true,
          value: privacy.showFHIScore,
          onChange: (val: boolean) => setPrivacy(prev => ({ ...prev, showFHIScore: val }))
        },
        { 
          icon: Zap, 
          label: 'Show Streak Counter', 
          toggle: true,
          value: privacy.showStreak,
          onChange: (val: boolean) => setPrivacy(prev => ({ ...prev, showStreak: val }))
        },
        { 
          icon: Database, 
          label: 'Sync Progress to Cloud', 
          toggle: true,
          value: true,
          onChange: () => {}
        },
      ]
    },
    {
      title: 'Notifications',
      icon: Bell,
      items: [
        { 
          icon: Zap, 
          label: 'Grass Challenge Alerts', 
          toggle: true,
          value: notifications.grassChallenges,
          onChange: (val: boolean) => setNotifications(prev => ({ ...prev, grassChallenges: val }))
        },
        { 
          icon: Brain, 
          label: 'FHI Score Updates', 
          toggle: true,
          value: notifications.fhiUpdates,
          onChange: (val: boolean) => setNotifications(prev => ({ ...prev, fhiUpdates: val }))
        },
        { 
          icon: Zap, 
          label: 'Streak Reminders', 
          toggle: true,
          value: notifications.streakReminders,
          onChange: (val: boolean) => setNotifications(prev => ({ ...prev, streakReminders: val }))
        },
        { 
          icon: Heart, 
          label: 'GrassHole Bot Roasts', 
          toggle: true,
          value: notifications.grassBotRoasts,
          onChange: (val: boolean) => setNotifications(prev => ({ ...prev, grassBotRoasts: val }))
        },
        { 
          icon: MapPin, 
          label: 'New Patches Nearby', 
          toggle: true,
          value: notifications.newPatches,
          onChange: (val: boolean) => setNotifications(prev => ({ ...prev, newPatches: val }))
        },
        { 
          icon: User, 
          label: 'Friend Activity', 
          toggle: true,
          value: notifications.socialUpdates,
          onChange: (val: boolean) => setNotifications(prev => ({ ...prev, socialUpdates: val }))
        },
      ]
    },
    {
      title: 'Privacy & Location',
      icon: Lock,
      items: [
        { 
          icon: MapPin, 
          label: 'Share Location Data', 
          toggle: true,
          value: privacy.shareLocation,
          onChange: (val: boolean) => setPrivacy(prev => ({ ...prev, shareLocation: val }))
        },
        { 
          icon: Wifi, 
          label: 'Auto-Enable GPS', 
          toggle: true,
          value: preferences.autoGPS,
          onChange: (val: boolean) => setPreferences(prev => ({ ...prev, autoGPS: val }))
        },
        { 
          icon: Shield, 
          label: 'Public Profile', 
          toggle: true,
          value: privacy.publicProfile,
          onChange: (val: boolean) => setPrivacy(prev => ({ ...prev, publicProfile: val }))
        },
        { icon: Shield, label: 'Blocked Users', action: () => {} },
        { icon: Shield, label: 'Report Safety Issue', action: () => {} },
      ]
    },
    {
      title: 'App Experience',
      icon: Smartphone,
      items: [
        { 
          icon: Moon, 
          label: 'Dark Mode', 
          toggle: true, 
          value: preferences.darkMode, 
          onChange: handleDarkModeToggle
        },
        { 
          icon: Volume2, 
          label: 'Sound Effects', 
          toggle: true, 
          value: preferences.soundEffects, 
          onChange: (val: boolean) => setPreferences(prev => ({ ...prev, soundEffects: val }))
        },
        { 
          icon: Smartphone, 
          label: 'Haptic Feedback', 
          toggle: true, 
          value: preferences.hapticFeedback, 
          onChange: (val: boolean) => setPreferences(prev => ({ ...prev, hapticFeedback: val }))
        },
        { icon: Globe, label: 'Language', value: 'English (US)', action: () => {} },
        { icon: MapPin, label: 'Distance Units', value: 'Meters', action: () => {} },
      ]
    },
    {
      title: 'Support & Legal',
      icon: HelpCircle,
      items: [
        { icon: HelpCircle, label: 'Help & Tutorial', action: () => {} },
        { icon: HelpCircle, label: 'Contact Support', action: () => {} },
        { icon: HelpCircle, label: 'Community Guidelines', action: () => {} },
        { icon: HelpCircle, label: 'Terms of Service', action: () => {} },
        { icon: HelpCircle, label: 'Privacy Policy', action: () => {} },
        { icon: HelpCircle, label: 'Open Source Licenses', action: () => {} },
      ]
    }
  ]
  
  return (
    <div className="h-full bg-gradient-to-br from-slate-50 via-white to-emerald-50 relative">
      <div 
        className="h-full overflow-y-auto pt-6 pb-40 px-4" 
        style={{ 
          WebkitOverflowScrolling: 'touch',
          overflowY: 'scroll',
          maxHeight: '100vh'
        }}
      >
        <div className="max-w-md mx-auto space-y-6">
        
        {/* Header */}
        <motion.div 
          className="flex items-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.button
            onClick={() => navigate(-1)}
            className="mr-4 p-3 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/50 shadow-lg hover:bg-white/90 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </motion.button>
          <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
        </motion.div>
        
        {/* User Info Card */}
        <motion.div
          className="relative overflow-hidden rounded-3xl p-6"
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center space-x-4 text-white">
            <div className="relative w-16 h-16 rounded-full overflow-hidden border-4 border-white/30">
              <img
                src={previewImage || currentUser.avatar}
                alt={currentUser.firstName}
                className={`w-full h-full object-cover ${isUpdating ? 'opacity-70' : ''}`}
                key={previewImage || currentUser.avatar} // Force re-render when avatar changes
                onError={(e) => {
                  console.error('❌ Settings avatar failed to load:', previewImage || currentUser.avatar)
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80&fit=crop&crop=face'
                }}
              />
              {isUpdating && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                </div>
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold">{currentUser.firstName} {currentUser.lastName}</h2>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center space-x-1 bg-white/20 rounded-full px-3 py-1">
                  <Brain className="w-4 h-4 text-yellow-300" />
                  <span className="text-sm font-semibold">FHI: {currentUser.fhiScore}</span>
                </div>
                <div className="flex items-center space-x-1 bg-white/20 rounded-full px-3 py-1">
                  <Zap className="w-4 h-4 text-orange-300" />
                  <span className="text-sm font-semibold">{currentUser.streak} streak</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Settings Sections */}
        {settingSections.map((section, sectionIndex) => (
          <motion.div
            key={section.title}
            className="bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/50 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: sectionIndex * 0.1 + 0.3 }}
          >
            <div className="px-6 py-4 border-b border-gray-100/50">
              <div className="flex items-center space-x-2">
                <section.icon className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-gray-800">{section.title}</h3>
              </div>
            </div>
            <div className="divide-y divide-gray-100/50">
              {section.items.map((item, itemIndex) => {
                const Icon = item.icon
                
                return (
                  <motion.div 
                    key={itemIndex} 
                    className="px-6 py-4 hover:bg-gray-50/50 transition-colors cursor-pointer"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => item.action && item.action()}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Icon className="w-5 h-5 text-gray-500" />
                        <span className="text-gray-700 font-medium">{item.label}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {item.toggle ? (
                          <motion.div 
                            className={`w-12 h-6 rounded-full transition-colors cursor-pointer ${
                              item.value ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'bg-gray-200'
                            }`}
                            onClick={() => item.onChange && item.onChange(!item.value)}
                            whileTap={{ scale: 0.95 }}
                          >
                            <motion.div 
                              className="w-5 h-5 bg-white rounded-full shadow transition-transform transform mt-0.5"
                              animate={{ x: item.value ? 26 : 2 }}
                              transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                          </motion.div>
                        ) : (
                          <>
                            {item.value && (
                              <span className="text-gray-500 text-sm font-medium">{item.value}</span>
                            )}
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          </>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        ))}
        
        {/* Danger Zone */}
        <motion.div
          className="bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-red-200/50 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="px-6 py-4 border-b border-red-100/50">
            <h3 className="font-bold text-red-600">Danger Zone</h3>
          </div>
          <motion.button
            className="w-full px-6 py-4 flex items-center justify-center space-x-3 text-red-600 hover:bg-red-50/50 transition-colors"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={handleSignOut}
          >
            <LogOut className="w-5 h-5" />
            <span className="font-semibold">Sign Out</span>
          </motion.button>
        </motion.div>
        
        {/* App Version & Credits */}
        <motion.div
          className="text-center space-y-2 text-gray-500 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <div>OnlyGrass v1.0.0</div>
          <div>Made for Berkeley Hackathon</div>
          <div>🌱 Touch grass, not people 🌱</div>
        </motion.div>

        {/* Hidden file input for profile picture */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        </div>
      </div>
    </div>
  )
}

export default SettingsScreen