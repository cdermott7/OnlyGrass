import React from 'react'
import { motion } from 'framer-motion'
import { useLocation, useNavigate } from 'react-router-dom'
import { Home, Target, User, Users, Compass } from 'lucide-react'

const Navigation: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  
  const tabs = [
    { path: '/', icon: Home, label: 'Discover' },
    { path: '/challenges', icon: Target, label: 'Challenges' },
    { path: '/explore', icon: Compass, label: 'Explore' },
    { path: '/social', icon: Users, label: 'Social' },
    { path: '/profile', icon: User, label: 'Profile' },
  ]
  
  return (
    <motion.div
      className="absolute bottom-4 left-4 right-4 z-40 flex justify-center"
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
        className="glass-card-strong"
        style={{
          borderRadius: 'var(--radius-2xl)',
          padding: 'var(--space-sm) var(--space-md)',
          background: 'rgba(255,255,255,0.15)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.2)',
          boxShadow: '0 16px 32px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255,255,255,0.2)',
          width: '100%',
          maxWidth: '400px'
        }}
      >
        <div className="flex items-center justify-between w-full" style={{ gap: 'var(--space-xs)' }}>
          {tabs.map((tab, index) => {
            const isActive = location.pathname === tab.path
            const Icon = tab.icon
            
            return (
              <motion.button
                key={tab.path}
                onClick={() => navigate(tab.path)}
                className="relative flex flex-col items-center justify-center transition-all duration-300"
                style={{
                  padding: 'var(--space-sm) var(--space-xs)',
                  borderRadius: 'var(--radius-lg)',
                  minHeight: '56px',
                  flex: '1',
                  maxWidth: '80px'
                }}
                whileHover={{ 
                  scale: 1.05,
                  y: -2,
                  backgroundColor: 'rgba(255,255,255,0.1)'
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
                    className="absolute inset-0 rounded-lg"
                    style={{
                      background: 'rgba(255,255,255,0.15)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      backdropFilter: 'blur(12px)'
                    }}
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
                  className={`relative z-10 flex flex-col items-center ${
                    isActive 
                      ? 'text-white drop-shadow-sm' 
                      : 'text-white/70 hover:text-white/90'
                  }`}
                  animate={isActive ? { 
                    scale: [1, 1.1, 1]
                  } : {}}
                  transition={{ 
                    duration: 0.4,
                    ease: "easeInOut"
                  }}
                >
                  <Icon className="w-4 h-4" style={{ marginBottom: 'var(--space-xs)' }} />
                  <span 
                    className="font-medium leading-none text-center"
                    style={{ fontSize: '10px' }}
                  >
                    {tab.label}
                  </span>
                </motion.div>
              </motion.button>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}

export default Navigation