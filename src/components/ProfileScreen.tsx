import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  Edit, MapPin, Heart, Users, Calendar, Settings, Star, Award, 
  Clock, Camera, Book, Mountain, Zap, Brain, Trophy, Target, 
  TrendingUp, Activity, Shield, Crown
} from 'lucide-react'
import { useAppStore } from '../store/useAppStore'

const ProfileScreen: React.FC = () => {
  const navigate = useNavigate()
  const { currentUser, likedPatches, grassPatches } = useAppStore()
  
  if (!currentUser) return null
  
  const likedPatchesData = grassPatches.filter(patch => likedPatches.has(patch.id))
  const stats = {
    patchesLiked: likedPatches.size,
    sessions: Math.floor(Math.random() * 20) + 5,
    matches: Math.floor(Math.random() * 15) + 3,
    rating: 4.8,
    grassTouched: currentUser.totalGrassTouched || 42
  }

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

        {/* Hero Profile Header */}
        <motion.div
          className="relative overflow-hidden rounded-3xl"
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
            minHeight: '280px'
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full blur-xl animate-pulse" />
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-white rounded-full blur-lg animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full blur-md animate-pulse" style={{ animationDelay: '2s' }} />
          </div>
          
          <div className="relative p-6 text-center text-white">
            {/* Profile Picture */}
            <motion.div 
              className="relative inline-block mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            >
              <div className="w-24 h-24 rounded-full overflow-hidden mx-auto border-4 border-white/30 shadow-2xl">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.firstName}
                  className="w-full h-full object-cover"
                />
              </div>
              <motion.button 
                className="absolute -bottom-1 -right-1 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Edit className="w-4 h-4 text-white" />
              </motion.button>
            </motion.div>
            
            {/* Name and Title */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h1 className="text-2xl font-bold mb-2">{currentUser.firstName} {currentUser.lastName}</h1>
              <div className="flex items-center justify-center space-x-4 mb-4">
                <div className="flex items-center space-x-1 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                  <Brain className="w-4 h-4 text-yellow-300" />
                  <span className="text-sm font-semibold">FHI: {currentUser.fhiScore}</span>
                </div>
                <div className="flex items-center space-x-1 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                  <Zap className="w-4 h-4 text-orange-300" />
                  <span className="text-sm font-semibold">{currentUser.streak} day streak</span>
                </div>
              </div>
              <p className="text-white/90 text-sm">Professional grass toucher & nature enthusiast</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Enhanced Stats Grid */}
        <motion.div
          className="grid grid-cols-2 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div 
            className="p-6 rounded-2xl relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(34,197,94,0.1) 0%, rgba(34,197,94,0.05) 100%)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(34,197,94,0.2)'
            }}
          >
            <div className="relative z-10">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-3">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-800 mb-1">{stats.patchesLiked}</div>
              <div className="text-sm text-gray-600">Patches Liked</div>
            </div>
          </div>
          
          <div 
            className="p-6 rounded-2xl relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(59,130,246,0.05) 100%)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(59,130,246,0.2)'
            }}
          >
            <div className="relative z-10">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-3">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-800 mb-1">{stats.grassTouched}</div>
              <div className="text-sm text-gray-600">Grass Touched</div>
            </div>
          </div>
        </motion.div>

        {/* FHI Score Card */}
        <motion.div
          className="relative overflow-hidden rounded-2xl p-6"
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold">Functional Human Index</h3>
                  <p className="text-white/80 text-sm">Your grass-touching prowess</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">{currentUser.fhiScore}</div>
                <div className="text-white/80 text-xs">/ 1000</div>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="bg-white/20 rounded-full h-3 mb-3">
              <motion.div 
                className="bg-gradient-to-r from-yellow-400 to-orange-500 h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(currentUser.fhiScore / 1000) * 100}%` }}
                transition={{ delay: 0.5, duration: 1 }}
              />
            </div>
            <div className="flex justify-between text-xs text-white/80">
              <span>Basement Dweller</span>
              <span>Grass Touching God</span>
            </div>
          </div>
        </motion.div>

        {/* Achievement Showcase */}
        <motion.div
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center space-x-2 mb-4">
            <Trophy className="w-5 h-5 text-yellow-600" />
            <h3 className="font-bold text-gray-800">Achievements</h3>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Shield, name: 'First Touch', color: 'from-green-500 to-emerald-600' },
              { icon: Zap, name: 'Streak Master', color: 'from-orange-500 to-red-600' },
              { icon: Crown, name: 'Explorer', color: 'from-purple-500 to-pink-600' },
              { icon: Activity, name: 'Speedster', color: 'from-blue-500 to-cyan-600' },
              { icon: Star, name: 'Perfectionist', color: 'from-yellow-500 to-orange-600' },
              { icon: TrendingUp, name: 'Rising Star', color: 'from-indigo-500 to-purple-600' }
            ].map((achievement, index) => (
              <motion.div 
                key={index}
                className="text-center"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${achievement.color} rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-lg`}>
                  <achievement.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-xs font-semibold text-gray-700">{achievement.name}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center space-x-2 mb-4">
            <Activity className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-gray-800">Recent Activity</h3>
          </div>
          
          <div className="space-y-3">
            {[
              { action: 'Touched grass at Golden Gate Park', time: '2 hours ago', icon: Heart, color: 'text-green-600' },
              { action: 'Completed 7-day streak challenge', time: '1 day ago', icon: Zap, color: 'text-orange-600' },
              { action: 'Discovered new patch in Mission District', time: '3 days ago', icon: MapPin, color: 'text-blue-600' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className={`w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center`}>
                  <activity.icon className={`w-4 h-4 ${activity.color}`} />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-800">{activity.action}</div>
                  <div className="text-xs text-gray-500">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Liked Patches Gallery */}
        {likedPatchesData.length > 0 && (
          <motion.div
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h3 className="font-bold text-gray-800 mb-4">Liked Patches</h3>
            <div className="grid grid-cols-3 gap-3">
              {likedPatchesData.slice(0, 6).map((patch, index) => (
                <motion.div 
                  key={patch.id} 
                  className="aspect-square rounded-xl overflow-hidden shadow-lg"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <img
                    src={patch.satelliteImageUrl}
                    alt={patch.name}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
        
        {/* Settings Button */}
        <motion.button
          onClick={() => navigate('/settings')}
          className="w-full py-4 rounded-2xl font-bold text-white flex items-center justify-center space-x-2 shadow-lg"
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          whileHover={{ scale: 1.02, boxShadow: '0 20px 40px rgba(102,126,234,0.3)' }}
          whileTap={{ scale: 0.98 }}
        >
          <Settings className="w-5 h-5" />
          <span>Settings & Preferences</span>
        </motion.button>

        </div>
      </div>
    </div>
  )
}

export default ProfileScreen