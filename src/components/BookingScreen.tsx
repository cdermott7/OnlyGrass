import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Calendar, Clock, Users, MapPin, Star, CheckCircle } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'

const BookingScreen: React.FC = () => {
  const { grassId } = useParams<{ grassId: string }>()
  const navigate = useNavigate()
  const { grassPatches } = useAppStore()
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [selectedDuration, setSelectedDuration] = useState<number>(60)
  const [notes, setNotes] = useState<string>('')
  const [isBooked, setIsBooked] = useState<boolean>(false)
  
  const patch = grassPatches.find(p => p.id === grassId)
  
  if (!patch) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Patch Not Found</h2>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-grass-500 text-white rounded-full"
          >
            Back to Swiping
          </button>
        </div>
      </div>
    )
  }
  
  const availableTimes = [
    'Today 2:00 PM',
    'Today 4:00 PM',
    'Tomorrow 10:00 AM',
    'Tomorrow 2:00 PM',
    'Tomorrow 5:00 PM',
    'This Weekend 9:00 AM',
    'This Weekend 3:00 PM'
  ]
  
  const durations = [
    { value: 30, label: '30 min' },
    { value: 60, label: '1 hour' },
    { value: 90, label: '1.5 hours' },
    { value: 120, label: '2 hours' }
  ]
  
  const mockUsers = [
    { id: '1', name: 'Sarah', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b2?w=150&q=80' },
    { id: '2', name: 'Mike', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80' },
    { id: '3', name: 'Emma', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80' }
  ]
  
  const handleBooking = () => {
    if (!selectedTime) return
    
    // Simulate booking
    setIsBooked(true)
    
    // Navigate to session completion after showing success
    setTimeout(() => {
      navigate(`/session-complete/${grassId}`, { 
        state: { 
          patch: patch,
          sessionTime: selectedTime,
          duration: selectedDuration 
        }
      })
    }, 2000)
  }
  
  if (isBooked) {
    return (
      <div className="h-full flex items-center justify-center px-4">
        <motion.div
          className="text-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <div className="w-24 h-24 mx-auto mb-6 bg-green-500 rounded-full flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Session Booked!</h2>
          <p className="text-gray-600 mb-2">You're all set for</p>
          <p className="text-lg font-semibold text-grass-600 mb-4">{selectedTime}</p>
          <p className="text-sm text-gray-500">You'll receive calendar invites and reminders</p>
        </motion.div>
      </div>
    )
  }
  
  return (
    <div className="h-full overflow-y-auto pt-4 pb-32 px-4" style={{ WebkitOverflowScrolling: 'touch' }}>
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-xl font-bold text-gray-800">Book Session</h1>
        </div>
        
        {/* Patch Info */}
        <motion.div
          className="bg-white rounded-2xl overflow-hidden shadow-lg mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="h-48 relative">
            <img
              src={patch.images[0]}
              alt={patch.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <h2 className="text-xl font-bold text-white mb-1">{patch.name}</h2>
              <div className="flex items-center space-x-4 text-white/90 text-sm">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>{patch.location.city}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span>{patch.rating}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Other Users */}
        <motion.div
          className="bg-white rounded-2xl p-6 shadow-lg mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center space-x-2 mb-4">
            <Users className="w-5 h-5 text-grass-500" />
            <h3 className="font-semibold text-gray-800">Others Interested</h3>
          </div>
          <div className="flex space-x-3">
            {mockUsers.map((user) => (
              <div key={user.id} className="text-center">
                <div className="w-12 h-12 rounded-full overflow-hidden mb-2">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-xs text-gray-600">{user.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
        
        {/* Time Selection */}
        <motion.div
          className="bg-white rounded-2xl p-6 shadow-lg mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center space-x-2 mb-4">
            <Calendar className="w-5 h-5 text-grass-500" />
            <h3 className="font-semibold text-gray-800">Select Time</h3>
          </div>
          <div className="space-y-2">
            {availableTimes.map((time) => (
              <button
                key={time}
                onClick={() => setSelectedTime(time)}
                className={`w-full p-3 rounded-xl text-left transition-all ${
                  selectedTime === time
                    ? 'bg-grass-50 border-2 border-grass-500 text-grass-700'
                    : 'bg-gray-50 border-2 border-transparent text-gray-700 hover:bg-gray-100'
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </motion.div>
        
        {/* Duration Selection */}
        <motion.div
          className="bg-white rounded-2xl p-6 shadow-lg mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center space-x-2 mb-4">
            <Clock className="w-5 h-5 text-grass-500" />
            <h3 className="font-semibold text-gray-800">Duration</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {durations.map((duration) => (
              <button
                key={duration.value}
                onClick={() => setSelectedDuration(duration.value)}
                className={`p-3 rounded-xl text-center transition-all ${
                  selectedDuration === duration.value
                    ? 'bg-grass-50 border-2 border-grass-500 text-grass-700'
                    : 'bg-gray-50 border-2 border-transparent text-gray-700 hover:bg-gray-100'
                }`}
              >
                {duration.label}
              </button>
            ))}
          </div>
        </motion.div>
        
        {/* Notes */}
        <motion.div
          className="bg-white rounded-2xl p-6 shadow-lg mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="font-semibold text-gray-800 mb-4">Session Notes (Optional)</h3>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="What would you like to do? Picnic, meditation, reading..."
            className="w-full h-24 p-3 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-grass-500 focus:border-transparent"
          />
        </motion.div>
        
        {/* Book Button */}
        <motion.button
          onClick={handleBooking}
          disabled={!selectedTime}
          className={`w-full py-4 rounded-2xl font-semibold text-white transition-all ${
            selectedTime
              ? 'bg-gradient-to-r from-grass-500 to-grass-600 hover:shadow-lg'
              : 'bg-gray-300 cursor-not-allowed'
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          whileHover={selectedTime ? { scale: 1.02 } : {}}
          whileTap={selectedTime ? { scale: 0.98 } : {}}
        >
          Book Session
        </motion.button>
      </div>
    </div>
  )
}

export default BookingScreen