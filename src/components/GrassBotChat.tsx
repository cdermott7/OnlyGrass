import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, Send, X, Brain, Skull, Flame, AlertTriangle, Zap, Volume2, VolumeX } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import { vapiService, VapiService } from '../services/vapi'

interface Message {
  id: string
  type: 'user' | 'bot'
  content: string
  timestamp: Date
  mood: 'savage' | 'brutal' | 'mocking' | 'condescending'
}

const GrassBotChat: React.FC = () => {
  const { currentUser } = useAppStore()
  const [isOpen, setIsOpen] = useState(false)
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: "Oh look, another digital hermit finally opens the GrassHole Bot. Let me guess - you've been doom-scrolling for hours instead of touching actual grass? Pathetic. I'm here to brutally judge your sad attempts at becoming a functional human. Don't expect me to be nice about it. 💀",
      timestamp: new Date(),
      mood: 'savage'
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const generateBotResponse = async (userMessage: string): Promise<{ content: string; mood: 'savage' | 'brutal' | 'mocking' | 'condescending' }> => {
    if (!currentUser) {
      return {
        content: "Error: Can't roast you properly without knowing your pathetic stats first. Restart the app and try again.",
        mood: 'savage'
      }
    }

    try {
      // Import the service dynamically to avoid initialization issues
      const { anthropicService } = await import('../services/anthropic')
      
      const response = await anthropicService.generateResponse(userMessage, {
        fhiScore: currentUser.fhiScore,
        streak: currentUser.streak,
        grassTouched: currentUser.totalGrassTouched,
        recentFailures: 0 // Could track this in the future
      })

      return {
        content: response.content,
        mood: response.mood
      }
    } catch (error) {
      console.error('Failed to get GrassHole response:', error)
      
      // Fallback responses when API fails
      const fallbackResponses = [
        {
          content: "My servers are acting up, but at least they're more reliable than your grass-touching habits. Try again in a moment, or better yet, go outside.",
          mood: 'savage' as const
        },
        {
          content: "Even when I'm broken, I'm still more functional than your outdoor lifestyle. That's genuinely concerning.",
          mood: 'mocking' as const
        },
        {
          content: "API error... but you know what doesn't have API errors? ACTUAL GRASS. Go touch some while I fix myself.",
          mood: 'condescending' as const
        }
      ]
      
      return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)]
    }
  }

  const speakBotMessage = async (content: string, mood: 'savage' | 'brutal' | 'mocking' | 'condescending') => {
    if (!isVoiceEnabled) return
    
    try {
      setIsSpeaking(true)
      
      // Get appropriate voice for mood
      const voiceConfig = VapiService.getGrassBotVoice(
        mood === 'savage' ? 'sassy' :
        mood === 'brutal' ? 'dramatic' :
        mood === 'mocking' ? 'sassy' :
        'friendly'
      )
      
      // Speak the message
      await vapiService.speakText(content, voiceConfig)
    } catch (error) {
      console.error('Failed to speak message:', error)
    } finally {
      setIsSpeaking(false)
    }
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
      mood: 'savage'
    }

    const messageText = inputValue
    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    try {
      // Get real AI response
      const response = await generateBotResponse(messageText)
      
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: response.content,
        timestamp: new Date(),
        mood: response.mood
      }
      
      setMessages(prev => [...prev, botResponse])
      
      // Speak the bot response
      await speakBotMessage(response.content, response.mood)
      
    } catch (error) {
      console.error('Failed to get bot response:', error)
      
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: "Even my error handling is more reliable than your commitment to going outside. Try asking me something else.",
        timestamp: new Date(),
        mood: 'savage'
      }
      
      setMessages(prev => [...prev, errorResponse])
      
      // Speak error response too
      if (isVoiceEnabled) {
        await speakBotMessage(errorResponse.content, 'savage')
      }
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'savage': return 'from-red-600 to-red-800'
      case 'brutal': return 'from-orange-600 to-red-700'
      case 'mocking': return 'from-purple-600 to-pink-700'
      case 'condescending': return 'from-yellow-600 to-orange-700'
      default: return 'from-red-600 to-red-800'
    }
  }

  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case 'savage': return Skull
      case 'brutal': return Flame
      case 'mocking': return AlertTriangle
      case 'condescending': return Zap
      default: return Skull
    }
  }

  return (
    <>
      {/* Chat Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-4 z-40 w-16 h-16 rounded-full shadow-2xl flex items-center justify-center overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #dc2626 0%, #7f1d1d 50%, #991b1b 100%)',
          backdropFilter: 'blur(20px)',
          border: '2px solid rgba(239,68,68,0.3)'
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        {/* Menacing background animation */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <motion.div
          animate={{ 
            rotate: [0, -10, 10, -10, 0],
            scale: [1, 1.1, 1, 1.1, 1]
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="relative z-10"
        >
          <Skull className="w-7 h-7 text-white" />
        </motion.div>
        
        {/* Evil pulsing indicator */}
        <motion.div
          className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-r from-red-500 to-orange-600 rounded-full flex items-center justify-center border-2 border-red-300"
          animate={{
            scale: [1, 1.3, 1],
            boxShadow: [
              '0 0 0 0 rgba(239,68,68,0.7)',
              '0 0 0 10px rgba(239,68,68,0)',
              '0 0 0 0 rgba(239,68,68,0)'
            ]
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <Flame className="w-2.5 h-2.5 text-white" />
        </motion.div>
      </motion.button>

      {/* Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              className="w-full max-w-sm mx-auto rounded-t-3xl shadow-2xl max-h-[75vh] flex flex-col overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(17,24,39,0.98) 0%, rgba(31,41,55,0.98) 100%)',
                backdropFilter: 'blur(20px)',
                border: '2px solid rgba(239,68,68,0.3)',
                borderBottom: 'none'
              }}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-red-900/50">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center relative overflow-hidden"
                    style={{
                      background: 'linear-gradient(135deg, #dc2626 0%, #7f1d1d 100%)'
                    }}
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    >
                      <Skull className="w-6 h-6 text-white" />
                    </motion.div>
                    
                    {/* Evil aura */}
                    <motion.div
                      className="absolute inset-0 bg-red-500/30"
                      animate={{ opacity: [0.3, 0.6, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-red-400 text-lg">GrassHole Bot</h3>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                      <span className="text-xs text-red-300">Brutally Honest AI</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {/* Voice Toggle */}
                  <motion.button
                    onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
                    className={`p-2 rounded-full transition-colors ${
                      isVoiceEnabled ? 'bg-green-600/30 text-green-400' : 'bg-red-900/30 text-red-400'
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title={isVoiceEnabled ? 'Voice On' : 'Voice Off'}
                  >
                    {isSpeaking ? (
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                      >
                        <Volume2 className="w-5 h-5" />
                      </motion.div>
                    ) : isVoiceEnabled ? (
                      <Volume2 className="w-5 h-5" />
                    ) : (
                      <VolumeX className="w-5 h-5" />
                    )}
                  </motion.button>
                  
                  {/* Close Button */}
                  <motion.button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-full hover:bg-red-900/30 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="w-5 h-5 text-red-400" />
                  </motion.button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ WebkitOverflowScrolling: 'touch' }}>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    {message.type === 'bot' && (
                      <div className="mr-3 mt-2">
                        <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${getMoodColor(message.mood)} flex items-center justify-center`}>
                          {React.createElement(getMoodIcon(message.mood), { className: "w-4 h-4 text-white" })}
                        </div>
                      </div>
                    )}
                    
                    <div
                      className={`max-w-[75%] p-4 rounded-2xl ${
                        message.type === 'user'
                          ? 'bg-gradient-to-r from-blue-600 to-purple-700 text-white rounded-br-md'
                          : `bg-gradient-to-r ${getMoodColor(message.mood)} text-white rounded-bl-md shadow-lg`
                      }`}
                    >
                      <p className="text-sm leading-relaxed font-medium">{message.content}</p>
                      <div className="flex items-center justify-between mt-2">
                        <p className={`text-xs ${
                          message.type === 'user' ? 'text-blue-200' : 'text-white/80'
                        }`}>
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        {message.type === 'bot' && (
                          <span className="text-xs text-white/60 capitalize font-semibold">
                            {message.mood}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {/* Typing Indicator */}
                {isTyping && (
                  <motion.div
                    className="flex justify-start"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="mr-3 mt-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-red-600 to-red-800 flex items-center justify-center">
                        <Skull className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-red-600 to-red-800 p-4 rounded-2xl rounded-bl-md">
                      <div className="flex space-x-1">
                        <motion.div
                          className="w-2 h-2 bg-white rounded-full"
                          animate={{ y: [0, -8, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                        />
                        <motion.div
                          className="w-2 h-2 bg-white rounded-full"
                          animate={{ y: [0, -8, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                        />
                        <motion.div
                          className="w-2 h-2 bg-white rounded-full"
                          animate={{ y: [0, -8, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-red-900/50">
                <div className="flex items-center space-x-2">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Dare to chat with the GrassHole..."
                      className="w-full pl-4 pr-12 py-3 bg-gray-800/50 rounded-2xl border border-red-900/30 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 placeholder-gray-400 text-white backdrop-blur-sm"
                    />
                    <motion.button
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim()}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-gradient-to-r from-red-600 to-red-800 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Send className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
                
                {/* Warning */}
                <div className="mt-2 flex items-center space-x-2 text-xs text-red-400/80">
                  <AlertTriangle className="w-3 h-3" />
                  <span>Warning: This AI has zero chill</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default GrassBotChat