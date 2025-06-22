import React from 'react'
import { MapPin, Navigation } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAppStore } from '../store/useAppStore'

export const LocationPrompt: React.FC = () => {
  const { locationPermission, initializeLocation, error } = useAppStore()

  if (locationPermission === 'granted') return null

  const handleRequestLocation = async () => {
    try {
      await initializeLocation()
    } catch (error) {
      console.error('Failed to get location:', error)
    }
  }

  return (
    <motion.div
      className="absolute top-16 left-4 right-4 z-40 bg-emerald-600 rounded-2xl p-4 text-white shadow-2xl"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{ position: 'absolute', top: '60px' }}
    >
      <div className="flex items-start space-x-3">
        <MapPin className="w-6 h-6 text-emerald-200 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="font-semibold text-lg">Better Grass Nearby!</h3>
          <p className="text-emerald-100 text-sm mb-3">
            {error ? error : 'Enable location to find the perfect grass patches around you'}
          </p>
          <button
            onClick={handleRequestLocation}
            className="bg-white text-emerald-600 px-4 py-2 rounded-xl font-semibold text-sm hover:bg-emerald-50 transition-colors flex items-center space-x-2"
          >
            <Navigation className="w-4 h-4" />
            <span>Enable Location</span>
          </button>
        </div>
      </div>
    </motion.div>
  )
}