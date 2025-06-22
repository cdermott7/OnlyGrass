import React from 'react'
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
import Navigation from './components/Navigation'
import GrassBotChat from './components/GrassBotChat'

function App() {
  return (
    <Router>
      {/* Premium Mobile Container */}
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black flex items-center justify-center p-4">
        {/* Ambient Light Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-l from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
        
        {/* iPhone-like Container */}
        <div 
          className="relative w-full max-w-sm mx-auto overflow-hidden"
          style={{ 
            aspectRatio: '9/19.5', 
            height: '844px',
            borderRadius: '50px',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
            backdropFilter: 'blur(20px)',
            border: '2px solid rgba(255,255,255,0.1)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255,255,255,0.1)'
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
            
            {/* Main App Content */}
            <div className="relative h-full" style={{ paddingTop: '40px' }}>
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
              <Route path="/matches" element={
                <motion.div
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3 }}
                >
                  <MatchScreen />
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
              <Route path="/challenges" element={
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  transition={{ duration: 0.4 }}
                >
                  <ChallengeScreen />
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

export default App