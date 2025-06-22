import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Timer, MapPin, Camera, CheckCircle, XCircle, Upload, Zap, Trophy, Navigation, ExternalLink, Target, Calendar, Award, Clock, Activity, Plus } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import { databaseService } from '../services/database'

const ChallengeScreen: React.FC = () => {
  const navigate = useNavigate()
  const { activeChallenge, currentUser, completeChallenge, failChallenge } = useAppStore()
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [completedChallenges, setCompletedChallenges] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active')

  // Load challenges data
  useEffect(() => {
    const loadChallenges = async () => {
      console.log('📋 Loading challenges for ChallengeScreen')
      
      if (!currentUser) {
        setIsLoading(false)
        return
      }

      try {
        // Load active challenge if not already loaded
        if (!activeChallenge) {
          const challenge = await databaseService.getActiveChallenge(currentUser.id)
          if (challenge) {
            useAppStore.setState({ activeChallenge: challenge })
          }
        }

        // Load completed challenges
        const allChallenges = await databaseService.getUserChallenges(currentUser.id, 20)
        const completed = allChallenges?.filter(c => c.status === 'COMPLETED' || c.status === 'FAILED') || []
        setCompletedChallenges(completed)
        
      } catch (error) {
        console.error('💥 Failed to load challenges:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    loadChallenges()
  }, [currentUser, activeChallenge])

  // Real-time timer countdown for active challenge
  useEffect(() => {
    if (!activeChallenge) return

    const updateTimer = () => {
      const remaining = new Date(activeChallenge.expiresAt).getTime() - new Date().getTime()
      setTimeRemaining(Math.max(0, remaining))
      
      // Auto-fail challenge when time expires
      if (remaining <= 0) {
        failChallenge(activeChallenge.id)
      }
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    
    return () => clearInterval(interval)
  }, [activeChallenge, failChallenge])

  const minutes = Math.floor(timeRemaining / (1000 * 60))
  const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000)

  const openDirections = () => {
    if (!activeChallenge) return
    const { lat, lng } = activeChallenge.patch.location
    const mapsUrl = `https://maps.google.com/maps?q=${lat},${lng}&hl=en&z=19`
    window.open(mapsUrl, '_blank')
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmitProof = async () => {
    if (uploadedFile && activeChallenge) {
      setIsSubmitting(true)
      try {
        await completeChallenge(activeChallenge.id, uploadedFile)
        // Reload challenges after completion
        const allChallenges = await databaseService.getUserChallenges(currentUser!.id, 20)
        const completed = allChallenges?.filter(c => c.status === 'COMPLETED' || c.status === 'FAILED') || []
        setCompletedChallenges(completed)
        setUploadedImage(null)
        setUploadedFile(null)
      } catch (error) {
        console.error('Failed to submit proof:', error)
        alert('Photo validation failed. Please try taking another photo!')
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  if (isLoading) {
    return (
      <div className="h-full bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-6xl mb-4">⏳</div>
          <div className="text-white text-xl font-semibold">Loading Challenges...</div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="h-full bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 relative overflow-hidden">
      <div 
        className="h-full overflow-y-auto pt-6 pb-64 px-4" 
        style={{ 
          WebkitOverflowScrolling: 'touch',
          overflowY: 'scroll',
          maxHeight: '100vh',
          height: '100%'
        }}
      >
        <div className="max-w-md mx-auto space-y-6">
          
          {/* Header with Tabs */}
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl font-bold text-white mb-4 text-center">Challenges</h1>
            
            {/* Tab Switcher */}
            <div className="flex bg-white/10 backdrop-blur-sm rounded-2xl p-1">
              <button
                onClick={() => setActiveTab('active')}
                className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
                  activeTab === 'active' 
                    ? 'bg-white text-gray-900 shadow-lg' 
                    : 'text-white/70 hover:text-white'
                }`}
              >
                <Target className="w-4 h-4" />
                <span>Active</span>
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
                  activeTab === 'history' 
                    ? 'bg-white text-gray-900 shadow-lg' 
                    : 'text-white/70 hover:text-white'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>History</span>
              </button>
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            {activeTab === 'active' ? (
              <motion.div
                key="active"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                {activeChallenge ? (
                  <>
                    {/* Active Challenge Timer */}
                    <motion.div
                      className="rounded-3xl p-6 text-center"
                      style={{
                        background: timeRemaining > 600000 
                          ? 'linear-gradient(135deg, rgba(34,197,94,0.3) 0%, rgba(22,163,74,0.1) 100%)'
                          : timeRemaining > 300000
                          ? 'linear-gradient(135deg, rgba(245,158,11,0.3) 0%, rgba(217,119,6,0.1) 100%)'
                          : 'linear-gradient(135deg, rgba(239,68,68,0.3) 0%, rgba(220,38,38,0.1) 100%)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255,255,255,0.3)',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                      }}
                    >
                      <motion.div
                        className="text-6xl mb-4"
                        animate={{ 
                          scale: timeRemaining < 300000 ? [1, 1.1, 1] : 1,
                          rotate: timeRemaining < 60000 ? [0, 5, -5, 0] : 0
                        }}
                        transition={{ 
                          duration: 1, 
                          repeat: timeRemaining < 300000 ? Infinity : 0 
                        }}
                      >
                        ⏰
                      </motion.div>
                      <div className="text-white font-mono text-4xl font-bold mb-2">
                        {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
                      </div>
                      <div className="text-white/80 text-lg">Time Remaining</div>
                    </motion.div>

                    {/* Challenge Details */}
                    <motion.div
                      className="rounded-3xl p-6"
                      style={{
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255,255,255,0.3)',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                      }}
                    >
                      <div className="flex items-center space-x-4 mb-4">
                        <img
                          src={activeChallenge.patch.satelliteImageUrl}
                          alt={activeChallenge.patch.name}
                          className="w-20 h-20 rounded-2xl object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="text-white font-bold text-lg mb-1">
                            {activeChallenge.patch.name}
                          </h3>
                          <div className="flex items-center space-x-2 text-white/80 text-sm">
                            <MapPin className="w-4 h-4" />
                            <span>{activeChallenge.patch.location.address}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-white/80 text-sm mt-1">
                            <span>{activeChallenge.patch.location.distanceFromUser}m away</span>
                            <span>•</span>
                            <span>{activeChallenge.patch.estimatedWalkTime}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-black/30 rounded-2xl p-4 space-y-4">
                        <div>
                          <h4 className="text-white font-semibold mb-2">Mission:</h4>
                          <p className="text-white/90 text-sm leading-relaxed">
                            Find this exact grass patch and upload a photo of yourself touching the grass. 
                            You'll gain <span className="font-bold text-green-400">+25 FHI points</span> for success!
                          </p>
                        </div>
                        
                        <motion.button
                          onClick={openDirections}
                          className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold flex items-center justify-center space-x-2 transition-colors"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Navigation className="w-5 h-5" />
                          <span>Get Directions</span>
                          <ExternalLink className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </motion.div>

                    {/* Upload Section */}
                    <motion.div
                      className="rounded-3xl p-6"
                      style={{
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255,255,255,0.3)',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                      }}
                    >
                      <h4 className="text-white font-semibold mb-4 flex items-center space-x-2">
                        <Camera className="w-5 h-5" />
                        <span>Upload Proof</span>
                      </h4>

                      {!uploadedImage ? (
                        <motion.label
                          className="block w-full p-8 border-2 border-dashed border-white/40 rounded-2xl text-center cursor-pointer hover:border-white/60 transition-colors"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Upload className="w-12 h-12 text-white/60 mx-auto mb-4" />
                          <div className="text-white font-medium mb-2">Touch the grass and take a photo!</div>
                          <div className="text-white/70 text-sm">Tap to upload your proof</div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                        </motion.label>
                      ) : (
                        <div className="space-y-4">
                          <div className="relative rounded-2xl overflow-hidden">
                            <img
                              src={uploadedImage}
                              alt="Proof of grass touching"
                              className="w-full h-48 object-cover"
                            />
                            <div className="absolute top-2 right-2">
                              <motion.button
                                onClick={() => setUploadedImage(null)}
                                className="p-2 bg-red-500/80 backdrop-blur-sm rounded-full text-white"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <XCircle className="w-4 h-4" />
                              </motion.button>
                            </div>
                          </div>

                          <motion.button
                            onClick={handleSubmitProof}
                            disabled={isSubmitting}
                            className="w-full py-4 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-2xl font-bold text-lg flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                            whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                          >
                            {isSubmitting ? (
                              <>
                                <motion.div
                                  className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                />
                                <span>Validating with AI...</span>
                              </>
                            ) : (
                              <>
                                <CheckCircle className="w-6 h-6" />
                                <span>Submit & Claim +25 FHI</span>
                                <Trophy className="w-6 h-6" />
                              </>
                            )}
                          </motion.button>
                        </div>
                      )}
                    </motion.div>
                  </>
                ) : (
                  /* No Active Challenge State */
                  <motion.div
                    className="text-center py-12"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center">
                      <Target className="w-16 h-16 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-4">No Active Challenge</h2>
                    <p className="text-gray-300 mb-8">
                      Swipe right on a grass patch to start a challenge!
                    </p>
                    <button
                      onClick={() => navigate('/')}
                      className="px-8 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-2xl font-semibold hover:shadow-lg transition-all duration-200"
                    >
                      Start Discovering
                    </button>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              /* Challenge History Tab */
              <motion.div
                key="history"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                {completedChallenges.length > 0 ? (
                  completedChallenges.map((challenge, index) => (
                    <motion.div
                      key={challenge.id}
                      className="rounded-2xl p-4"
                      style={{
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255,255,255,0.2)',
                      }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          challenge.status === 'COMPLETED' 
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {challenge.status === 'COMPLETED' ? (
                            <CheckCircle className="w-6 h-6" />
                          ) : (
                            <XCircle className="w-6 h-6" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-white font-semibold">{challenge.patch_name}</h3>
                          <div className="flex items-center space-x-2 text-white/60 text-sm">
                            <Clock className="w-3 h-3" />
                            <span>{new Date(challenge.completed_at || challenge.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          challenge.status === 'COMPLETED'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {challenge.status === 'COMPLETED' ? `+${challenge.fhi_points_awarded || 25}` : challenge.fhi_points_awarded || -15} FHI
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    className="text-center py-12"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white/10 flex items-center justify-center">
                      <Activity className="w-12 h-12 text-white/60" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">No Challenge History</h3>
                    <p className="text-white/60 text-sm">Complete your first challenge to see it here!</p>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default ChallengeScreen