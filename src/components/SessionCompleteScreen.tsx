import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { 
  CheckCircle2, 
  Star, 
  Heart, 
  Camera, 
  Share2, 
  MapPin,
  Clock,
  Leaf,
  Sun,
  Trees,
  Droplets,
  Dog,
  Users,
  Award
} from 'lucide-react'
import { useAppStore } from '../store/useAppStore'

const SessionCompleteScreen: React.FC = () => {
  const { grassId } = useParams<{ grassId: string }>()
  const location = useLocation()
  const navigate = useNavigate()
  const { grassPatches, currentUser, incrementGrassTouched } = useAppStore()
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [rating, setRating] = useState(0)
  const [review, setReview] = useState('')
  const [qualityRatings, setQualityRatings] = useState({
    grassHealth: 0,
    cleanliness: 0,
    safety: 0,
    accessibility: 0
  })
  const [features, setFeatures] = useState({
    shady: false,
    lush: false,
    quiet: false,
    dogFriendly: false,
    waterNearby: false,
    picnicFriendly: false
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  
  const patch = grassPatches.find(p => p.id === grassId)
  const sessionData = location.state
  
  useEffect(() => {
    // Increment grass touched counter when session completes
    incrementGrassTouched()
    
    // Auto-show review form after 3 seconds
    const timer = setTimeout(() => {
      setShowReviewForm(true)
    }, 3000)
    return () => clearTimeout(timer)
  }, [])
  
  if (!patch || !currentUser) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Session Not Found</h2>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-grass-500 text-white rounded-full"
          >
            Back to Discover
          </button>
        </div>
      </div>
    )
  }
  
  const handleReviewSubmit = () => {
    if (rating === 0) return
    
    // Simulate saving review data
    console.log('Review submitted:', {
      patchId: grassId,
      rating,
      review,
      qualityRatings,
      features,
      userId: currentUser.id,
      sessionTime: sessionData?.sessionTime
    })
    
    setIsSubmitted(true)
    
    // Navigate back to matches after submission
    setTimeout(() => {
      navigate('/matches')
    }, 2000)
  }
  
  if (isSubmitted) {
    return (
      <div className="h-full flex items-center justify-center px-4 bg-gradient-to-br from-grass-50 via-white to-earth-50">
        <motion.div
          className="text-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-grass-400 to-grass-600 rounded-full flex items-center justify-center">
            <Award className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Thank You!</h2>
          <p className="text-gray-600 mb-2">Your review helps other grass enthusiasts</p>
          <p className="text-lg font-semibold text-grass-600 mb-4">+10 Experience Points Earned!</p>
          <p className="text-sm text-gray-500">Returning to matches...</p>
        </motion.div>
      </div>
    )
  }
  
  return (
    <div className="h-full bg-gradient-to-br from-grass-50 via-white to-earth-50">
      <AnimatePresence mode="wait">
        {!showReviewForm ? (
          // Congratulations Screen
          <motion.div
            key="congrats"
            className="h-full flex items-center justify-center px-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center max-w-md mx-auto">
              {/* Success Icon */}
              <motion.div
                className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-grass-400 to-grass-600 rounded-full flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <CheckCircle2 className="w-16 h-16 text-white" />
              </motion.div>
              
              {/* Congratulations Text */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <h1 className="text-4xl font-bold text-gray-800 mb-4">Congratulations!</h1>
                <p className="text-xl text-gray-600 mb-2">You successfully touched grass at</p>
                <h2 className="text-2xl font-bold text-grass-600 mb-6">{patch.name}</h2>
              </motion.div>
              
              {/* Session Stats */}
              <motion.div
                className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-white/30"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <Clock className="w-8 h-8 text-grass-500 mx-auto mb-2" />
                    <div className="text-lg font-bold text-gray-800">{sessionData?.duration || 60} min</div>
                    <div className="text-sm text-gray-600">Session Duration</div>
                  </div>
                  <div>
                    <Leaf className="w-8 h-8 text-grass-500 mx-auto mb-2" />
                    <div className="text-lg font-bold text-gray-800">+1</div>
                    <div className="text-sm text-gray-600">Grass Touched</div>
                  </div>
                </div>
              </motion.div>
              
              {/* Achievement Unlock */}
              <motion.div
                className="bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-2xl p-4 mb-6 text-white"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <div className="flex items-center justify-center space-x-3">
                  <Award className="w-6 h-6" />
                  <div>
                    <div className="font-bold">Achievement Unlocked!</div>
                    <div className="text-sm opacity-90">Grass Explorer - Visit 5 different patches</div>
                  </div>
                </div>
              </motion.div>
              
              {/* Loading indicator */}
              <motion.div
                className="text-gray-500 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                Preparing your review form...
              </motion.div>
            </div>
          </motion.div>
        ) : (
          // Review Form
          <motion.div
            key="review"
            className="h-full overflow-y-auto pt-8 pb-40 px-4"
            style={{ WebkitOverflowScrolling: 'touch' }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="max-w-md mx-auto">
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Rate Your Experience</h1>
                <p className="text-gray-600">Help other grass enthusiasts discover great patches</p>
              </div>
              
              {/* Patch Info */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg mb-6">
                <div className="h-32 relative">
                  <img
                    src={patch.images[0]}
                    alt={patch.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-white font-bold">{patch.name}</h3>
                    <div className="flex items-center text-white/90 text-sm">
                      <MapPin className="w-3 h-3 mr-1" />
                      <span>{patch.location.city}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Overall Rating */}
              <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
                <h3 className="font-semibold text-gray-800 mb-4">Overall Rating</h3>
                <div className="flex justify-center space-x-2 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className="transition-colors"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= rating
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <div className="text-center text-sm text-gray-600">
                  {rating === 0 && 'Tap a star to rate'}
                  {rating === 1 && 'Poor - Not recommended'}
                  {rating === 2 && 'Fair - Could be better'}
                  {rating === 3 && 'Good - Decent grass experience'}
                  {rating === 4 && 'Great - Really enjoyed it'}
                  {rating === 5 && 'Excellent - Amazing grass patch!'}
                </div>
              </div>
              
              {/* Quality Metrics */}
              <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
                <h3 className="font-semibold text-gray-800 mb-4">Quality Assessment</h3>
                <div className="space-y-4">
                  {Object.entries({
                    grassHealth: 'Grass Health',
                    cleanliness: 'Cleanliness',
                    safety: 'Safety',
                    accessibility: 'Accessibility'
                  }).map(([key, label]) => (
                    <div key={key}>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-700">{label}</span>
                        <span className="text-sm font-medium text-grass-600">
                          {qualityRatings[key as keyof typeof qualityRatings]}/10
                        </span>
                      </div>
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                          <button
                            key={value}
                            onClick={() => setQualityRatings(prev => ({
                              ...prev,
                              [key]: value
                            }))}
                            className={`w-6 h-6 rounded ${
                              value <= qualityRatings[key as keyof typeof qualityRatings]
                                ? 'bg-grass-500'
                                : 'bg-gray-200'
                            } transition-colors`}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Features */}
              <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
                <h3 className="font-semibold text-gray-800 mb-4">Features Present</h3>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries({
                    shady: { label: 'Shady', icon: Trees },
                    lush: { label: 'Lush Grass', icon: Leaf },
                    quiet: { label: 'Quiet', icon: Heart },
                    dogFriendly: { label: 'Dog-Friendly', icon: Dog },
                    waterNearby: { label: 'Water Nearby', icon: Droplets },
                    picnicFriendly: { label: 'Picnic-Ready', icon: Sun }
                  }).map(([key, { label, icon: Icon }]) => (
                    <button
                      key={key}
                      onClick={() => setFeatures(prev => ({
                        ...prev,
                        [key]: !prev[key as keyof typeof features]
                      }))}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        features[key as keyof typeof features]
                          ? 'border-grass-500 bg-grass-50'
                          : 'border-gray-200 bg-white'
                      }`}
                    >
                      <Icon className={`w-5 h-5 mx-auto mb-1 ${
                        features[key as keyof typeof features]
                          ? 'text-grass-600'
                          : 'text-gray-400'
                      }`} />
                      <div className={`text-xs ${
                        features[key as keyof typeof features]
                          ? 'text-grass-700 font-medium'
                          : 'text-gray-600'
                      }`}>
                        {label}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Written Review */}
              <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
                <h3 className="font-semibold text-gray-800 mb-4">Share Your Experience</h3>
                <textarea
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  placeholder="Tell other grass enthusiasts about your experience..."
                  className="w-full h-24 p-3 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-grass-500 focus:border-transparent"
                  maxLength={300}
                />
                <div className="text-right text-xs text-gray-500 mt-2">
                  {review.length}/300 characters
                </div>
              </div>
              
              {/* Submit Button */}
              <button
                onClick={handleReviewSubmit}
                disabled={rating === 0}
                className={`w-full py-4 rounded-2xl font-semibold text-white transition-all ${
                  rating > 0
                    ? 'bg-gradient-to-r from-grass-500 to-grass-600 hover:shadow-lg'
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                Submit Review
              </button>
              
              {/* Skip Option */}
              <button
                onClick={() => navigate('/matches')}
                className="w-full py-3 text-gray-500 text-sm hover:text-gray-700 transition-colors"
              >
                Skip Review
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default SessionCompleteScreen