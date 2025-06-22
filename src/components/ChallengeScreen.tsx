import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Timer, MapPin, Camera, CheckCircle, XCircle, ArrowLeft, Upload, Zap, Trophy } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'

const ChallengeScreen: React.FC = () => {
  const navigate = useNavigate()
  const { activeChallenge, currentUser, completeChallenge, failChallenge } = useAppStore()
  const [showUpload, setShowUpload] = useState(false)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)

  if (!activeChallenge) {
    return (
      <div className="h-full flex items-center justify-center px-4">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center">
            <Timer className="w-16 h-16 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No Active Challenge</h2>
          <p className="text-gray-600 mb-8">
            Swipe right on a grass patch to start a challenge!
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-8 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-2xl font-semibold hover:shadow-lg transition-all duration-200"
          >
            Start Swiping
          </button>
        </motion.div>
      </div>
    )
  }

  const timeRemaining = new Date(activeChallenge.expiresAt).getTime() - new Date().getTime()
  const minutes = Math.floor(timeRemaining / (1000 * 60))
  const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmitProof = () => {
    if (uploadedImage) {
      completeChallenge(activeChallenge.id, uploadedImage)
      navigate('/')
    }
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
        {/* Header */}
        <motion.div
          className="flex items-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.button
            onClick={() => navigate(-1)}
            className="mr-4 p-3 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-lg hover:bg-white/30 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </motion.button>
          <h1 className="text-2xl font-bold text-white">Active Challenge</h1>
        </motion.div>

        {/* Timer Card */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <div 
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
          </div>
        </motion.div>

        {/* Challenge Details */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div 
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

            <div className="bg-black/30 rounded-2xl p-4">
              <h4 className="text-white font-semibold mb-2">Mission:</h4>
              <p className="text-white/90 text-sm leading-relaxed">
                Find this exact grass patch and upload a photo of yourself touching the grass. 
                You'll gain <span className="font-bold text-green-400">+25 FHI points</span> for success!
              </p>
            </div>
          </div>
        </motion.div>

        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div 
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
                  className="w-full py-4 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-2xl font-bold text-lg flex items-center justify-center space-x-2"
                  whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(34,197,94,0.3)" }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <CheckCircle className="w-6 h-6" />
                  <span>Submit & Claim +25 FHI</span>
                  <Trophy className="w-6 h-6" />
                </motion.button>
              </div>
            )}
          </div>
        </motion.div>
        </div>
      </div>
    </div>
  )
}

export default ChallengeScreen