import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { MapPin, Search, Filter, Compass, Star, Clock, Users } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'

const ExploreScreen: React.FC = () => {
  const navigate = useNavigate()
  const { grassPatches, currentUser } = useAppStore()
  
  // Mock nearby patches and trending data
  const nearbyPatches = grassPatches.slice(0, 6)
  const trendingPatches = grassPatches.slice(2, 5)
  
  return (
    <div className="h-full bg-gradient-to-br from-slate-50 via-white to-emerald-50 relative">
      <div 
        className="h-full overflow-y-auto container-fluid" 
        style={{ 
          WebkitOverflowScrolling: 'touch',
          overflowY: 'scroll',
          maxHeight: '100vh',
          paddingTop: 'var(--space-xl)',
          paddingBottom: '8rem' // Fixed for 5-tab navigation
        }}
      >
        <div className="stack-xl">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold font-display text-gray-800 mb-2">
            Explore
          </h1>
          <p className="text-gray-600">
            Discover amazing grass patches near you
          </p>
        </motion.div>
        
        {/* Search Bar */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for grass patches..."
              className="glass-card-subtle w-full focus-ring"
              style={{
                paddingLeft: 'calc(var(--space-md) + 2.5rem)',
                paddingRight: 'var(--space-lg)',
                paddingTop: 'var(--space-md)',
                paddingBottom: 'var(--space-md)',
                fontSize: 'var(--text-base)',
                background: 'rgba(255,255,255,0.9)'
              }}
            />
            <button className="btn-glass absolute bg-grass-500 text-white hover:bg-grass-600" style={{
              right: 'var(--space-sm)',
              top: 'var(--space-sm)',
              padding: 'var(--space-sm)',
              minWidth: 'auto',
              borderRadius: 'var(--radius-lg)'
            }}>
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
        
        {/* Quick Stats */}
        <motion.div
          className="grid grid-cols-2 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="glass-card-subtle text-center" style={{
            padding: 'var(--space-lg)',
            background: 'linear-gradient(135deg, rgba(34,197,94,0.1) 0%, rgba(34,197,94,0.05) 100%)'
          }}>
            <Compass className="w-8 h-8 text-grass-600 mx-auto" style={{ marginBottom: 'var(--space-sm)' }} />
            <div className="text-2xl font-bold text-gray-800">{grassPatches.length}</div>
            <div className="text-sm text-gray-600">Patches Found</div>
          </div>
          <div className="glass-card-subtle text-center" style={{
            padding: 'var(--space-lg)',
            background: 'linear-gradient(135deg, rgba(245,158,11,0.1) 0%, rgba(245,158,11,0.05) 100%)'
          }}>
            <Star className="w-8 h-8 text-yellow-600 mx-auto" style={{ marginBottom: 'var(--space-sm)' }} />
            <div className="text-2xl font-bold text-gray-800">4.8</div>
            <div className="text-sm text-gray-600">Avg Rating</div>
          </div>
        </motion.div>
        
        {/* Trending Patches */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-xl font-bold text-gray-800 mb-4">🔥 Trending Now</h2>
          <div className="space-y-3">
            {trendingPatches.map((patch, index) => (
              <motion.div
                key={patch.id}
                className="glass-card-subtle cursor-pointer"
                style={{
                  padding: 'var(--space-lg)',
                  background: 'rgba(255,255,255,0.9)'
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/')}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                    <img
                      src={patch.satelliteImageUrl}
                      alt={patch.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 mb-1">{patch.name}</h3>
                    <div className="flex items-center space-x-2 mb-2">
                      <MapPin className="w-3 h-3 text-gray-400" />
                      <span className="text-sm text-gray-500">{patch.location.city}</span>
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-500">{patch.difficultyRating}/5</span>
                    </div>
                    <div className="flex items-center space-x-4 text-xs text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Users className="w-3 h-3" />
                        <span>{Math.floor(Math.random() * 50) + 10} visited today</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-grass-600">#{index + 1}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        {/* Nearby Patches */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-xl font-bold text-gray-800 mb-4">📍 Near You</h2>
          <div className="grid grid-cols-2 gap-3">
            {nearbyPatches.map((patch) => (
              <motion.div
                key={patch.id}
                className="glass-card-subtle overflow-hidden cursor-pointer"
                style={{
                  background: 'rgba(255,255,255,0.9)'
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/')}
              >
                <div className="aspect-square">
                  <img
                    src={patch.satelliteImageUrl}
                    alt={patch.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div style={{ padding: 'var(--space-md)' }}>
                  <h3 className="font-semibold text-gray-800 text-sm truncate" style={{ marginBottom: 'var(--space-xs)' }}>
                    {patch.name}
                  </h3>
                  <div className="flex items-center space-x-1 mb-2">
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    <span className="text-xs text-gray-500">{patch.difficultyRating}/5</span>
                    <span className="text-xs text-gray-400">• {patch.location.distanceFromUser}m away</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-500 truncate">{patch.location.city}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        {/* Call to Action */}
        <motion.div
          className="glass-card gradient-success text-center text-white"
          style={{
            padding: 'var(--space-xl)',
            marginBottom: 'var(--space-lg)',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Compass className="w-12 h-12 mx-auto mb-4 opacity-80" />
          <h3 className="text-xl font-bold mb-2">Ready to Explore?</h3>
          <p className="text-grass-100 mb-4 text-sm">
            Start swiping to discover your perfect grass patch and connect with nature.
          </p>
          <button
            onClick={() => navigate('/')}
            className="btn-glass bg-white text-grass-600 font-semibold hover:bg-grass-50 transition-colors"
            style={{
              padding: 'var(--space-md) var(--space-xl)',
              background: 'white',
              color: '#059669'
            }}
          >
            Start Discovering
          </button>
        </motion.div>
        </div>
      </div>
    </div>
  )
}

export default ExploreScreen