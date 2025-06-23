import React from 'react'
import { motion } from 'framer-motion'

interface LoadingSkeletonProps {
  type?: 'card' | 'list' | 'profile' | 'full'
  count?: number
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ type = 'card', count = 1 }) => {
  const shimmer = {
    animate: {
      x: ['-100%', '100%'],
    },
    transition: {
      repeat: Infinity,
      duration: 1.5,
      ease: 'linear',
    },
  }

  const SkeletonCard = () => (
    <div className="relative overflow-hidden bg-white rounded-3xl shadow-xl mx-4 mb-6" style={{ aspectRatio: '3/4' }}>
      {/* Shimmer overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        {...shimmer}
      />
      
      {/* Card content skeleton */}
      <div className="p-6 h-full flex flex-col">
        {/* Image skeleton */}
        <div className="w-full h-48 bg-gray-200 rounded-2xl mb-4" />
        
        {/* Title skeleton */}
        <div className="h-6 bg-gray-200 rounded-lg mb-3 w-3/4" />
        
        {/* Description skeleton */}
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
          <div className="h-4 bg-gray-200 rounded w-4/6" />
        </div>
        
        {/* Stats skeleton */}
        <div className="mt-auto flex justify-between">
          <div className="h-8 w-20 bg-gray-200 rounded-full" />
          <div className="h-8 w-16 bg-gray-200 rounded-full" />
        </div>
      </div>
    </div>
  )

  const SkeletonList = () => (
    <div className="space-y-4 px-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="relative overflow-hidden bg-white rounded-2xl p-4 shadow-lg">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            {...shimmer}
          />
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-200 rounded-xl" />
            <div className="flex-1 space-y-2">
              <div className="h-5 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
            <div className="w-8 h-8 bg-gray-200 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  )

  const SkeletonProfile = () => (
    <div className="relative overflow-hidden bg-white rounded-3xl p-6 mx-4 shadow-xl">
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        {...shimmer}
      />
      <div className="flex items-center space-x-6 mb-6">
        <div className="w-20 h-20 bg-gray-200 rounded-full" />
        <div className="flex-1 space-y-3">
          <div className="h-6 bg-gray-200 rounded w-2/3" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="text-center">
            <div className="h-8 bg-gray-200 rounded mb-2" />
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto" />
          </div>
        ))}
      </div>
    </div>
  )

  const SkeletonFull = () => (
    <div className="h-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="text-center">
        <motion.div
          className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-emerald-400 to-green-500"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <div className="h-6 bg-gray-200 rounded w-48 mx-auto mb-3" />
        <div className="h-4 bg-gray-200 rounded w-32 mx-auto" />
      </div>
    </div>
  )

  switch (type) {
    case 'list':
      return <SkeletonList />
    case 'profile':
      return <SkeletonProfile />
    case 'full':
      return <SkeletonFull />
    default:
      return (
        <div className="h-full">
          {Array.from({ length: count }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )
  }
}

export default LoadingSkeleton