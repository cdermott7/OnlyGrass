import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion'
import { useGesture } from 'react-use-gesture'
import { useNavigate } from 'react-router-dom'
import { Heart, MapPin, Star, AlertTriangle, Users, Clock, Menu, Award, Trophy, Settings, Timer, Zap, Brain, X } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import { GrassPatch } from '../types'
import GrassCard from './GrassCard'

const SwipeScreen: React.FC = () => {
  const navigate = useNavigate()
  const {
    grassPatches,
    currentPatchIndex,
    swipePatch,
    nextPatch,
    likedPatches,
    swipedPatches,
    currentUser,
    activeChallenge,
    showRoastPopup,
    currentRoast,
    dismissRoast
  } = useAppStore()
  
  const [isSwipeAnimating, setIsSwipeAnimating] = useState(false)
  const [showMatch, setShowMatch] = useState(false)
  const [matchedPatch, setMatchedPatch] = useState<GrassPatch | null>(null)
  const [showMenu, setShowMenu] = useState(false)
  
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotate = useTransform(x, [-200, 0, 200], [-20, 0, 20])
  const opacity = useTransform(x, [-250, -100, 0, 100, 250], [0.3, 1, 1, 1, 0.3])
  
  const currentPatch = grassPatches[currentPatchIndex]
  const nextPatchData = grassPatches[currentPatchIndex + 1]
  
  const bind = useGesture({
    onDrag: ({ offset: [dx, dy], velocity, direction: [xDir], cancel }) => {
      if (isSwipeAnimating || showMatch) return // Also check if modal is open
      
      // Apply movement with physics
      x.set(dx)
      y.set(dy * 0.4) // Limit vertical movement
      
      const isFlick = velocity > 0.8
      const threshold = isFlick ? 80 : 150
      
      if (Math.abs(dx) > threshold) {
        cancel()
        handleSwipe(xDir > 0 ? 'like' : 'dislike')
      }
    },
    onDragEnd: ({ offset: [dx] }) => {
      if (isSwipeAnimating || showMatch) return // Also check if modal is open
      
      if (Math.abs(dx) < 150) {
        // Animate back to center
        x.set(0)
        y.set(0)
      }
    }
  })
  
  const handleSwipe = (action: 'like' | 'dislike') => {
    if (!currentPatch || isSwipeAnimating) return
    
    setIsSwipeAnimating(true)
    
    // Smooth animated exit
    const targetX = action === 'like' ? 600 : -600
    const targetY = action === 'like' ? -150 : 150
    
    // Use animate API for smooth spring transition
    const controls = {
      x: targetX,
      y: targetY,
      rotate: action === 'like' ? 30 : -30,
      opacity: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        duration: 0.4
      }
    }
    
    // Apply the animation
    x.set(targetX)
    y.set(targetY)
    
    // Record swipe action
    swipePatch({
      grassId: currentPatch.id,
      action,
      timestamp: new Date().toISOString()
    })
    
    // Move to next patch after animation
    setTimeout(() => {
      nextPatch()
      x.set(0)
      y.set(0)
      setIsSwipeAnimating(false)
      
      // Check for challenge creation when swiping right (after the card has moved)
      if (action === 'like') {
        setMatchedPatch(currentPatch)
        // Small delay to ensure UI is ready
        setTimeout(() => {
          setShowMatch(true)
        }, 100)
      }
    }, 400)
  }
  
  
  const closeMatch = () => {
    setShowMatch(false)
    setMatchedPatch(null)
    // Reset any swipe animation state
    setIsSwipeAnimating(false)
    x.set(0)
    y.set(0)
  }

  // Add keyboard shortcuts for testing
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Don't handle keyboard if modal is open or animating
      if (showMatch || isSwipeAnimating) return
      
      if (e.key === 'ArrowLeft') {
        handleSwipe('dislike')
      } else if (e.key === 'ArrowRight') {
        handleSwipe('like')
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [showMatch, isSwipeAnimating])
  
  if (!currentPatch) {
    return (
      <div className="h-full flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-br from-grass-400 to-grass-600 flex items-center justify-center">
            <Heart className="w-16 h-16 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">No More Grass!</h2>
          <p className="text-gray-600 mb-8">You've seen all the patches in your area. Check back later for fresh grass!</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-gradient-to-r from-grass-500 to-grass-600 text-white rounded-full font-semibold hover:shadow-lg transition-all duration-200"
          >
            Reset Stack
          </button>
        </div>
      </div>
    )
  }
  
  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-white to-emerald-50 relative overflow-hidden">
      {/* Premium Top Bar with FHI Score */}
      <motion.div 
        className="flex-shrink-0 relative z-20 px-4 py-3"
        initial={{ opacity: 0, y: -50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ 
          duration: 1,
          type: "spring",
          stiffness: 200,
          damping: 25,
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
      >
        {/* Glass morphism background */}
        <div 
          className="absolute inset-0 rounded-2xl mx-2"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.3)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
          }}
        />
        
        <div className="relative flex items-center justify-between">
          {/* Menu Button */}
          <motion.button
            onClick={() => setShowMenu(true)}
            className="p-3 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-lg hover:bg-white/30 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Menu className="w-5 h-5 text-gray-800" />
          </motion.button>
          
          {/* Center - FHI Score */}
          <motion.div 
            className="flex items-center space-x-3"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              delay: 0.5, 
              type: "spring", 
              stiffness: 300,
              damping: 20,
              duration: 1.2
            }}
          >
            <motion.div 
              className="text-center"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div 
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl px-4 py-2 shadow-lg"
                animate={{
                  boxShadow: [
                    "0 10px 25px rgba(59,130,246,0.3)",
                    "0 15px 35px rgba(147,51,234,0.4)",
                    "0 10px 25px rgba(59,130,246,0.3)"
                  ]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <Brain className="w-5 h-5 text-white" />
                </motion.div>
                <div>
                  <motion.div 
                    className="text-white text-xs font-medium"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    FHI
                  </motion.div>
                  <motion.div 
                    className="text-white text-lg font-bold leading-none"
                    key={currentUser?.fhiScore}
                    initial={{ scale: 1.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {currentUser?.fhiScore || 847}
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
            
            {/* Streak */}
            <motion.div 
              className="flex items-center space-x-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl px-3 py-2 shadow-lg"
              initial={{ scale: 0, x: 50 }}
              animate={{ 
                scale: 1, 
                x: 0,
                boxShadow: [
                  "0 8px 20px rgba(249,115,22,0.3)",
                  "0 12px 30px rgba(239,68,68,0.4)", 
                  "0 8px 20px rgba(249,115,22,0.3)"
                ]
              }}
              transition={{
                scale: { delay: 0.7, type: "spring", stiffness: 300 },
                x: { delay: 0.7, type: "spring", stiffness: 300 },
                boxShadow: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
              }}
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ 
                  duration: 1, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Zap className="w-4 h-4 text-white" />
              </motion.div>
              <motion.span 
                className="text-white font-bold text-sm"
                key={currentUser?.streak}
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                {currentUser?.streak || 7}
              </motion.span>
            </motion.div>
          </motion.div>
          
          {/* Profile Avatar */}
          <motion.button
            onClick={() => navigate('/profile')}
            className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-white/40 shadow-lg hover:border-white/60 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80&fit=crop&crop=face'}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </motion.button>
        </div>
      </motion.div>
      
      {/* Active Challenge Timer */}
      {activeChallenge && (
        <motion.div
          className="mx-4 mb-4 relative z-20"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <div 
            className="rounded-2xl p-4"
            style={{
              background: 'linear-gradient(135deg, rgba(239,68,68,0.3) 0%, rgba(239,68,68,0.1) 100%)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(239,68,68,0.4)',
              boxShadow: '0 8px 32px rgba(239,68,68,0.2)'
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-red-500 flex items-center justify-center">
                  <Timer className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-white font-bold text-sm">Challenge Active</div>
                  <div className="text-white/80 text-xs">{activeChallenge.patch.name}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-white font-mono text-lg font-bold">59:42</div>
                <div className="text-white/80 text-xs">remaining</div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Card Stack - Maximum vertical space */}
      <div className="flex-1 relative px-3 pb-20">
        <div className="relative w-full h-full card-stack" style={{ minHeight: '500px' }}>
        {/* Next card (background) */}
        {nextPatchData && (
          <motion.div
            className="absolute inset-0 swipe-card"
            initial={{ scale: 0.95, opacity: 0.8 }}
            animate={{ scale: 0.95, opacity: 0.8 }}
            style={{ zIndex: 1 }}
          >
            <GrassCard patch={nextPatchData} isBackground />
          </motion.div>
        )}
        
        {/* Current card */}
        <motion.div
          {...(showMatch ? {} : bind())}
          className={`absolute inset-0 swipe-card ${showMatch ? 'pointer-events-none' : 'cursor-grab active:cursor-grabbing'} touch-pan-y`}
          style={{
            x,
            y,
            rotate,
            opacity,
            zIndex: 2,
            touchAction: showMatch ? 'auto' : 'none'
          }}
          whileTap={showMatch ? {} : { scale: 1.02 }}
          drag={!showMatch}
          dragConstraints={{ left: -300, right: 300, top: -100, bottom: 100 }}
          dragElastic={0.1}
          dragMomentum={false}
        >
          <GrassCard patch={currentPatch} />
          
          {/* Swipe Indicators with Premium Design */}
          <motion.div
            className="absolute top-12 left-8 px-6 py-3 text-white font-bold text-2xl rounded-2xl transform -rotate-12 border-4 border-red-400"
            style={{
              opacity: useTransform(x, [-150, -50, 0], [1, 0.5, 0]),
              scale: useTransform(x, [-150, -50, 0], [1.2, 1, 0.8]),
              background: 'linear-gradient(135deg, rgba(239,68,68,0.95) 0%, rgba(220,38,38,0.95) 100%)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 20px 40px rgba(239,68,68,0.4)'
            }}
          >
            <motion.span
              animate={{
                textShadow: [
                  "0 0 10px rgba(255,255,255,0.5)",
                  "0 0 20px rgba(255,255,255,0.8)",
                  "0 0 10px rgba(255,255,255,0.5)"
                ]
              }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              NOPE
            </motion.span>
          </motion.div>
          
          <motion.div
            className="absolute top-12 right-8 px-6 py-3 text-white font-bold text-2xl rounded-2xl transform rotate-12 border-4 border-green-400"
            style={{
              opacity: useTransform(x, [0, 50, 150], [0, 0.5, 1]),
              scale: useTransform(x, [0, 50, 150], [0.8, 1, 1.2]),
              background: 'linear-gradient(135deg, rgba(34,197,94,0.95) 0%, rgba(22,163,74,0.95) 100%)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 20px 40px rgba(34,197,94,0.4)'
            }}
          >
            <motion.span
              animate={{
                textShadow: [
                  "0 0 10px rgba(255,255,255,0.5)",
                  "0 0 20px rgba(255,255,255,0.8)",
                  "0 0 10px rgba(255,255,255,0.5)"
                ]
              }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              LIKE
            </motion.span>
          </motion.div>
        </motion.div>
        </div>
      </div>
      
      {/* Challenge Created Modal */}
      <AnimatePresence>
        {showMatch && matchedPatch && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeMatch}
          >
            <motion.div
              className="max-w-sm mx-4 text-center"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: '24px',
                padding: '32px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
              }}
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="text-6xl mb-4"
              >
                ⏰
              </motion.div>
              
              <motion.h3 
                className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Challenge Created!
              </motion.h3>
              
              <motion.p 
                className="text-gray-600 mb-6 text-sm leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                You have <strong>1 hour</strong> to find and touch <strong>{matchedPatch.name}</strong>. 
                Upload a photo when you get there to gain FHI points!
              </motion.p>
              
              <motion.div 
                className="flex space-x-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <button
                  onClick={closeMatch}
                  className="flex-1 py-3 px-6 bg-gray-100 text-gray-700 rounded-2xl font-semibold hover:bg-gray-200 transition-all duration-200"
                >
                  Keep Swiping
                </button>
                <button
                  onClick={() => {
                    closeMatch()
                    navigate('/challenges')
                  }}
                  className="flex-1 py-3 px-6 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-2xl font-semibold hover:shadow-lg transition-all duration-200"
                >
                  View Challenge
                </button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Menu */}
      <AnimatePresence>
        {showMenu && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowMenu(false)}
          >
            <motion.div
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl max-h-96 overflow-y-auto"
              style={{ WebkitOverflowScrolling: 'touch' }}
              initial={{ y: 400 }}
              animate={{ y: 0 }}
              exit={{ y: 400 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Handle */}
              <div className="flex justify-center pt-4 pb-2">
                <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
              </div>
              
              {/* User Profile Section */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-grass-300">
                    <img
                      src={currentUser?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80&fit=crop&crop=face'}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 text-lg">{currentUser?.name || 'Grass Lover'}</h3>
                    <p className="text-sm text-gray-600">{currentUser?.grassTouched || 0} grass touched</p>
                  </div>
                </div>
              </div>
              
              {/* Menu Grid */}
              <div className="p-6 pb-8">
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => {
                      setShowMenu(false)
                      navigate('/profile')
                    }}
                    className="flex flex-col items-center p-6 rounded-2xl bg-grass-50 hover:bg-grass-100 active:bg-grass-200 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-full bg-grass-200 flex items-center justify-center mb-3">
                      <Users className="w-6 h-6 text-grass-600" />
                    </div>
                    <p className="font-medium text-gray-800 text-center">Profile</p>
                    <p className="text-xs text-gray-500 text-center mt-1">View journey</p>
                  </button>
                  
                  <button
                    onClick={() => {
                      setShowMenu(false)
                      navigate('/matches')
                    }}
                    className="flex flex-col items-center p-6 rounded-2xl bg-red-50 hover:bg-red-100 active:bg-red-200 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-full bg-red-200 flex items-center justify-center mb-3">
                      <Heart className="w-6 h-6 text-red-600" />
                    </div>
                    <p className="font-medium text-gray-800 text-center">Matches</p>
                    <p className="text-xs text-gray-500 text-center mt-1">{likedPatches.size} patches</p>
                  </button>
                  
                  <button
                    onClick={() => {
                      setShowMenu(false)
                      navigate('/profile')
                    }}
                    className="flex flex-col items-center p-6 rounded-2xl bg-yellow-50 hover:bg-yellow-100 active:bg-yellow-200 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 flex items-center justify-center mb-3">
                      <Trophy className="w-6 h-6 text-white" />
                    </div>
                    <p className="font-medium text-gray-800 text-center">Points</p>
                    <p className="text-xs text-gray-500 text-center mt-1">{currentUser?.grassTouched || 0} earned</p>
                  </button>
                  
                  <button
                    onClick={() => {
                      setShowMenu(false)
                      navigate('/settings')
                    }}
                    className="flex flex-col items-center p-6 rounded-2xl bg-gray-50 hover:bg-gray-100 active:bg-gray-200 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mb-3">
                      <Settings className="w-6 h-6 text-gray-600" />
                    </div>
                    <p className="font-medium text-gray-800 text-center">Settings</p>
                    <p className="text-xs text-gray-500 text-center mt-1">Preferences</p>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grass Bot Roast Popup */}
      <AnimatePresence>
        {showRoastPopup && currentRoast && (
          <motion.div
            className="fixed top-4 right-4 z-50 max-w-sm"
            initial={{ opacity: 0, x: 400, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 400, scale: 0.8 }}
            transition={{ 
              type: "spring", 
              stiffness: 200, 
              damping: 20,
              duration: 0.6 
            }}
          >
            <div 
              className="rounded-2xl p-4 border"
              style={{
                background: currentRoast.roastType === 'SAVAGE_BURN' 
                  ? 'linear-gradient(135deg, rgba(239,68,68,0.95) 0%, rgba(220,38,38,0.95) 100%)'
                  : currentRoast.roastType === 'MODERATE_ROAST'
                  ? 'linear-gradient(135deg, rgba(245,158,11,0.95) 0%, rgba(217,119,6,0.95) 100%)'
                  : 'linear-gradient(135deg, rgba(59,130,246,0.95) 0%, rgba(37,99,235,0.95) 100%)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.3)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    <Brain className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="text-white font-bold text-sm">GrassBot</div>
                    <div className="text-white/80 text-xs capitalize">{currentRoast.roastType.replace('_', ' ').toLowerCase()}</div>
                  </div>
                </div>
                <motion.button
                  onClick={dismissRoast}
                  className="p-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-4 h-4 text-white" />
                </motion.button>
              </div>
              
              <p className="text-white text-sm leading-relaxed">
                {currentRoast.roastText}
              </p>
              
              {/* Auto-dismiss timer */}
              <motion.div
                className="mt-3 h-1 bg-white/30 rounded-full overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <motion.div
                  className="h-full bg-white rounded-full"
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ duration: 5, ease: "linear" }}
                  onAnimationComplete={dismissRoast}
                />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default SwipeScreen