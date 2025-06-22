import React from 'react'
import { motion } from 'framer-motion'
import { useLocation, useNavigate } from 'react-router-dom'
import { Home, Target, User, Compass } from 'lucide-react'

const Navigation: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  
  const tabs = [
    { path: '/', icon: Home, label: 'Discover' },
    { path: '/challenges', icon: Target, label: 'Challenges' },
    { path: '/explore', icon: Compass, label: 'Explore' },
    { path: '/profile', icon: User, label: 'Profile' },
  ]
  
  return (
    <motion.div
      className="absolute bottom-2 left-4 right-4 z-40 flex justify-center"
      initial={{ y: 100, opacity: 0, scale: 0.8 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      transition={{ 
        delay: 0.3, 
        duration: 0.8,
        type: "spring",
        stiffness: 200,
        damping: 20
      }}
    >
      <div 
        className="rounded-3xl px-8 py-4 shadow-2xl"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.5)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255,255,255,0.8)'
        }}
      >
        <div className="flex items-center space-x-2">
          {tabs.map((tab, index) => {
            const isActive = location.pathname === tab.path
            const Icon = tab.icon
            
            return (
              <motion.button
                key={tab.path}
                onClick={() => navigate(tab.path)}
                className="relative flex flex-col items-center justify-center px-4 py-3 rounded-2xl transition-all duration-300 min-h-[60px]"
                whileHover={{ 
                  scale: 1.1,
                  y: -2
                }}
                whileTap={{ 
                  scale: 0.95,
                  y: 0
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: 0.5 + (index * 0.1),
                  type: "spring",
                  stiffness: 300,
                  damping: 20
                }}
              >
                {isActive && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl border border-blue-500/30"
                    layoutId="activeTab"
                    transition={{ 
                      type: "spring", 
                      stiffness: 400, 
                      damping: 25,
                      duration: 0.6
                    }}
                  />
                )}
                
                <motion.div
                  className={`relative z-10 ${
                    isActive 
                      ? 'text-blue-600 drop-shadow-sm' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  animate={isActive ? { 
                    scale: [1, 1.2, 1],
                    rotateY: [0, 180, 360] 
                  } : {}}
                  transition={{ 
                    duration: 0.6,
                    ease: "easeInOut"
                  }}
                >
                  <Icon className="w-5 h-5 mb-1" />
                  <span className="text-xs font-semibold leading-none text-center">{tab.label}</span>
                </motion.div>
                
                {isActive && (
                  <motion.div
                    className="absolute -bottom-1 left-1/2 w-1.5 h-1.5 bg-blue-500 rounded-full"
                    initial={{ scale: 0, x: "-50%" }}
                    animate={{ scale: 1, x: "-50%" }}
                    transition={{ delay: 0.2, type: "spring" }}
                  />
                )}
              </motion.button>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}

export default Navigation