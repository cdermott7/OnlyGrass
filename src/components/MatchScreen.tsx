import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { MapPin, Clock, Users, Star, Calendar } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'

const MatchScreen: React.FC = () => {
  const { likedPatches, grassPatches } = useAppStore()
  const navigate = useNavigate()
  
  const likedPatchesData = grassPatches.filter(patch => likedPatches.has(patch.id))
  
  // Mock matches with other users
  const mockMatches = likedPatchesData.map(patch => ({
    id: patch.id,
    patch,
    users: Array.from({ length: Math.floor(Math.random() * 4) + 1 }, (_, i) => ({
      id: `user-${i}`,
      name: ['Sarah', 'Mike', 'Emma', 'Alex', 'Jordan'][i] || 'Grass Lover',
      avatar: `https://images.unsplash.com/photo-${1500000000000 + i * 10000000}?w=150&q=80&fit=crop&crop=face`
    })),
    suggestedTimes: ['Today 3PM', 'Tomorrow 10AM', 'This Weekend'],
    lastActivity: `${Math.floor(Math.random() * 24) + 1}h ago`
  }))
  
  if (mockMatches.length === 0) {
    return (
      <div className="h-full flex items-center justify-center px-4">
        <div className="max-w-md mx-auto">
          <div className="text-center">
            <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
              <Users className="w-16 h-16 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">No Matches Yet</h2>
            <p className="text-gray-600 mb-8">
              Start swiping to find your perfect grass patches and connect with fellow grass enthusiasts!
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full font-semibold hover:shadow-lg transition-all duration-200"
            >
              Start Swiping
            </button>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="h-full overflow-y-auto pt-4 pb-40 px-4" style={{ WebkitOverflowScrolling: 'touch' }}>
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-display text-gray-800 mb-2">
            Your Matches
          </h1>
          <p className="text-gray-600">
            {mockMatches.length} grass {mockMatches.length === 1 ? 'patch' : 'patches'} you both love
          </p>
        </div>
        
        {/* Matches List */}
        <div className="space-y-4">
          {mockMatches.map((match, index) => (
            <motion.div
              key={match.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(`/booking/${match.patch.id}`)}
            >
              <div className="flex">
                {/* Patch Image */}
                <div className="w-24 h-24 flex-shrink-0">
                  <img
                    src={match.patch.satelliteImageUrl}
                    alt={match.patch.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Content */}
                <div className="flex-1 p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-800 text-sm">
                      {match.patch.name}
                    </h3>
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      <span className="text-xs text-gray-600">{match.patch.difficultyRating}/5</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1 mb-2">
                    <MapPin className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-500">{match.patch.location.city}</span>
                  </div>
                  
                  {/* User Avatars */}
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex -space-x-2">
                      {match.users.slice(0, 3).map((user, userIndex) => (
                        <div
                          key={user.id}
                          className="w-6 h-6 rounded-full border-2 border-white overflow-hidden"
                        >
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                      {match.users.length > 3 && (
                        <div className="w-6 h-6 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center">
                          <span className="text-xs text-gray-600">+{match.users.length - 3}</span>
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">
                      {match.users.length} {match.users.length === 1 ? 'person' : 'people'} interested
                    </span>
                  </div>
                  
                  {/* Last Activity */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">{match.lastActivity}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/booking/${match.patch.id}`)
                      }}
                      className="flex items-center space-x-1 px-2 py-1 bg-grass-50 rounded-full hover:bg-grass-100 transition-colors"
                    >
                      <Calendar className="w-3 h-3 text-grass-500" />
                      <span className="text-xs text-grass-600 font-medium">Book Session</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Call to Action */}
        <motion.div
          className="mt-8 p-6 bg-gradient-to-br from-grass-50 to-earth-50 rounded-2xl text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="font-semibold text-gray-800 mb-2">Ready to touch grass?</h3>
          <p className="text-sm text-gray-600 mb-4">
            Book a session with your matches and experience the perfect grass patch together.
          </p>
          <div className="flex space-x-3">
            <button
              onClick={() => navigate('/')}
              className="flex-1 px-6 py-2 border border-grass-500 text-grass-600 rounded-full text-sm font-semibold hover:bg-grass-50 transition-all duration-200"
            >
              Find More Matches
            </button>
            {mockMatches.length > 0 && (
              <button
                onClick={() => navigate(`/booking/${mockMatches[0].patch.id}`)}
                className="flex-1 px-6 py-2 bg-gradient-to-r from-grass-500 to-grass-600 text-white rounded-full text-sm font-semibold hover:shadow-lg transition-all duration-200"
              >
                Book Top Match
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default MatchScreen