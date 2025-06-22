import React from 'react'
import { motion } from 'framer-motion'
import { MapPin, Clock, Zap, Eye } from 'lucide-react'
import { GrassPatch } from '../types'

interface GrassCardProps {
  patch: GrassPatch
  isBackground?: boolean
}

const GrassCard: React.FC<GrassCardProps> = ({ patch, isBackground = false }) => {
  const qualityColors = {
    pristine: 'from-emerald-500 to-green-600',
    decent: 'from-green-500 to-lime-600', 
    questionable: 'from-yellow-500 to-orange-600',
    sus: 'from-red-500 to-pink-600'
  }
  
  const difficultyStars = '★'.repeat(patch.difficultyRating) + '☆'.repeat(5 - patch.difficultyRating)
  
  return (
    <motion.div
      className={`
        relative w-full h-full overflow-hidden 
        ${isBackground ? 'opacity-60 transform scale-95 rounded-3xl' : 'rounded-3xl'}
      `}
      style={{
        background: 'linear-gradient(145deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.2)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255,255,255,0.1)'
      }}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ 
        opacity: isBackground ? 0.6 : 1, 
        y: 0, 
        scale: isBackground ? 0.95 : 1 
      }}
      transition={{ 
        duration: 0.8, 
        ease: [0.25, 0.46, 0.45, 0.94],
        type: "spring",
        damping: 20,
        stiffness: 100
      }}
    >
      {/* Satellite Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={patch.satelliteImageUrl}
          alt={patch.name}
          className="w-full h-full object-cover block"
          style={{ 
            minHeight: '100%',
            minWidth: '100%',
            backgroundColor: '#10b981',
            filter: 'contrast(1.1) saturate(1.2)'
          }}
          onLoad={() => console.log('Satellite image loaded:', patch.name)}
          onError={(e) => {
            console.error('Satellite image failed to load:', patch.name, patch.satelliteImageUrl)
            e.currentTarget.style.backgroundColor = '#10b981'
          }}
        />
        {/* Premium gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
        {/* Subtle noise texture for premium feel */}
        <div 
          className="absolute inset-0 z-10 opacity-30 mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
          }}
        />
      </div>
      
      {/* Content with liquid glass effect */}
      <div className="relative h-full flex flex-col z-20">
        {/* Top Status Bar */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            {/* Grass Quality Badge */}
            <motion.div 
              className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide bg-gradient-to-r ${qualityColors[patch.grassQuality]} text-white shadow-lg`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
            >
              {patch.grassQuality}
            </motion.div>
            
            {/* Distance & Time */}
            <motion.div 
              className="flex items-center space-x-2 bg-black/30 backdrop-blur-md rounded-full px-3 py-1 border border-white/20"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <MapPin className="w-3 h-3 text-white/80" />
              <span className="text-white/90 text-xs font-medium">{patch.location.distanceFromUser}m</span>
              <div className="w-1 h-1 bg-white/60 rounded-full" />
              <Clock className="w-3 h-3 text-white/80" />
              <span className="text-white/90 text-xs font-medium">{patch.estimatedWalkTime}</span>
            </motion.div>
          </div>
          
          {/* Difficulty Rating */}
          <motion.div 
            className="flex items-center justify-center mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="bg-black/30 backdrop-blur-md rounded-2xl px-4 py-2 border border-white/20">
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-yellow-400 text-sm font-mono">{difficultyStars}</span>
                <span className="text-white/80 text-xs">Difficulty</span>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Main Content Area */}
        <div className="flex-1 px-4 pb-6">
          {/* Location Name */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-4"
          >
            <h2 className="text-2xl font-bold text-white mb-1 text-center leading-tight">
              {patch.name}
            </h2>
            <div className="flex items-center justify-center space-x-2">
              <MapPin className="w-4 h-4 text-white/60" />
              <span className="text-white/80 text-sm">{patch.location.address}</span>
            </div>
          </motion.div>
          
          {/* Claude AI Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mb-6"
          >
            <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-4 border border-white/20">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  <Eye className="w-3 h-3 text-white" />
                </div>
                <span className="text-white/90 text-sm font-semibold">GrassBot Analysis</span>
              </div>
              <p className="text-white/90 text-sm leading-relaxed italic">
                "{patch.claudeDescription}"
              </p>
            </div>
          </motion.div>
          
          {/* Discovery Info */}
          {patch.discoveredBy && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-center"
            >
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1 border border-white/20">
                <span className="text-white/70 text-xs">Discovered by</span>
                <span className="text-white/90 text-xs font-semibold">{patch.discoveredBy}</span>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default GrassCard