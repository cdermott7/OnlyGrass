import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import SwipeScreen from './components/SwipeScreen'
import MatchScreen from './components/MatchScreen'
import ProfileScreen from './components/ProfileScreen'
import BookingScreen from './components/BookingScreen'
import SettingsScreen from './components/SettingsScreen'
import SessionCompleteScreen from './components/SessionCompleteScreen'
import ExploreScreen from './components/ExploreScreen'
import ChallengeScreen from './components/ChallengeScreen'
import SocialScreen from './components/SocialScreen'
import Navigation from './components/Navigation'
import GrassBotChat from './components/GrassBotChat'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { AuthScreen } from './components/auth/AuthScreen'
import { DatabaseStatus } from './components/DatabaseStatus'
import { LocationPrompt } from './components/LocationPrompt'
import { useAppStore } from './store/useAppStore'

function AppContent() {
  const { user, loading } = useAuth()
  const { initializeLocation } = useAppStore()

  useEffect(() => {
    // Initialize the app when user is logged in
    if (user) {
      initializeLocation()
    }
  }, [user, initializeLocation])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🌱</div>
          <div className="text-white text-xl font-semibold">Loading OnlyGrass...</div>
        </div>
      </div>
    )
  }

  if (!user) {
    return <AuthScreen />
  }
  return (
    <Router>
      <DatabaseStatus />
      {/* Premium Mobile Container */}
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black flex items-center justify-center p-4">
        {/* Ambient Light Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-l from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
        
        {/* iPhone-like Container with Enhanced Glassmorphism */}
        <div 
          className="relative w-full max-w-sm mx-auto overflow-hidden glass-card-strong"
          style={{ 
            aspectRatio: '9/19.5', 
            height: '844px',
            borderRadius: '3rem',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.06) 100%)',
            backdropFilter: 'blur(32px)',
            border: '2px solid rgba(255,255,255,0.15)',
            boxShadow: '0 32px 64px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255,255,255,0.15)'
          }}
        >
          {/* Screen Content Area */}
          <div 
            className="relative h-full overflow-hidden"
            style={{
              margin: '8px',
              borderRadius: '42px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              overflow: 'hidden'
            }}
          >
            {/* Dynamic Island */}
            <div 
              className="absolute top-2 left-1/2 transform -translate-x-1/2 z-50"
              style={{
                width: '126px',
                height: '32px',
                borderRadius: '16px',
                background: 'rgba(0,0,0,0.85)',
                backdropFilter: 'blur(20px)'
              }}
            />
            
            {/* Location Prompt - inside iPhone container */}
            <LocationPrompt />
            
            {/* Main App Content */}
            <div className="relative h-full overflow-hidden" style={{ paddingTop: '40px' }}>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <SwipeScreen />
                </motion.div>
              } />
              <Route path="/challenges" element={
                <motion.div
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChallengeScreen />
                </motion.div>
              } />
              <Route path="/profile" element={
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProfileScreen />
                </motion.div>
              } />
              <Route path="/explore" element={
                <motion.div
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3 }}
                >
                  <ExploreScreen />
                </motion.div>
              } />
              <Route path="/social" element={
                <motion.div
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3 }}
                >
                  <SocialScreen />
                </motion.div>
              } />
              <Route path="/booking/:grassId" element={
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  transition={{ duration: 0.4 }}
                >
                  <BookingScreen />
                </motion.div>
              } />
              <Route path="/settings" element={
                <motion.div
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3 }}
                >
                  <SettingsScreen />
                </motion.div>
              } />
              <Route path="/session-complete/:grassId" element={
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.4 }}
                >
                  <SessionCompleteScreen />
                </motion.div>
              } />
            </Routes>
          </AnimatePresence>
          
            <Navigation />
            <GrassBotChat />
            </div>
          </div>
        </div>
      </div>
    </Router>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App