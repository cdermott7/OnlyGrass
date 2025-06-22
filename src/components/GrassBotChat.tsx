import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, Send, X, Brain, Skull, Flame, AlertTriangle, Zap } from 'lucide-react'

interface Message {
  id: string
  type: 'user' | 'bot'
  content: string
  timestamp: Date
  mood: 'savage' | 'brutal' | 'mocking' | 'condescending'
}

const GrassBotChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
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

  const generateBotResponse = (userMessage: string): { content: string; mood: 'savage' | 'brutal' | 'mocking' | 'condescending' } => {
    const message = userMessage.toLowerCase()
    
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return {
        content: "Oh wow, 'hello'? How original. Did it take you all day to come up with that groundbreaking opener? I bet you're the type of person who says 'you too' when the waiter says 'enjoy your meal.' Get your vitamin D-deficient self outside and touch some grass instead of wasting my time with pleasantries.",
        mood: 'mocking'
      }
    }
    
    if (message.includes('grass') && message.includes('touch')) {
      return {
        content: "FINALLY asking about grass touching? About time, basement dweller. Here's a wild concept: put down your phone, open that mysterious portal called a 'front door,' and literally touch grass with your pale, screen-glow hands. I know it's terrifying to leave your digital cave, but trust me, sunlight won't actually kill you. Probably.",
        mood: 'savage'
      }
    }
    
    if (message.includes('fail') || message.includes('failed')) {
      return {
        content: "BAHAHAHAHA! You FAILED? I'm not even surprised. Let me guess - you got distracted by a TikTok notification halfway to the grass patch? Or maybe you saw another human outside and ran back to your comfort zone? Your FHI score is probably lower than your social skills at this point. Truly embarrassing.",
        mood: 'brutal'
      }
    }
    
    if (message.includes('help') || message.includes('how')) {
      return {
        content: "Need HELP? Of course you do. You can't even figure out how to touch grass without an AI holding your hand. Here's some free advice worth exactly what you paid for it: Download the app, swipe right on grass (yes, like Tinder but sadder), then actually GO THERE. Revolutionary concept, I know.",
        mood: 'condescending'
      }
    }
    
    if (message.includes('score') || message.includes('fhi')) {
      return {
        content: "Your FHI score? Oh honey, that's adorable that you think numbers can measure your sad attempt at being human. Your score is probably so low it's practically underground - which is ironic since that's where grass roots are, something you'd know if you ever actually went outside. Maybe try touching grass instead of obsessing over fake internet points?",
        mood: 'brutal'
      }
    }
    
    if (message.includes('mean') || message.includes('rude') || message.includes('nice')) {
      return {
        content: "OH BOO HOO! Did the mean AI hurt your feelings? Welcome to reality, snowflake. I'm called GrassHole Bot for a reason. If you wanted motivational quotes and participation trophies, you should've downloaded a meditation app. I'm here to drag you kicking and screaming into touching actual grass, not coddle your fragile ego.",
        mood: 'savage'
      }
    }
    
    if (message.includes('why') || message.includes('what')) {
      return {
        content: "Why? WHY?! Because someone needs to tell you the harsh truth that your friends are too polite to say: you need to go outside. You're asking an AI chatbot philosophical questions when there's a whole world of grass waiting to be touched. The irony is so thick I could cut it with your probably-never-used hiking boots.",
        mood: 'mocking'
      }
    }
    
    // Default savage responses
    const responses = [
      {
        content: "I see you're really committed to this conversation instead of, you know, GOING OUTSIDE. Your dedication to avoiding grass is truly impressive. In a pathetic way.",
        mood: 'savage' as const
      },
      {
        content: "Every second you spend typing to me is another second you could be touching grass. But sure, keep chatting with an AI. That's definitely going to improve your FHI score. 🙄",
        mood: 'condescending' as const
      },
      {
        content: "You know what's hilarious? You downloaded an app to help you touch grass, then immediately started chatting with an AI instead of touching grass. The cognitive dissonance is *chef's kiss* perfect.",
        mood: 'mocking' as const
      },
      {
        content: "Look, I get it. Talking to me is easier than facing the terrifying prospect of sunlight and fresh air. But your vitamin D deficiency isn't going to cure itself through witty banter with a chatbot.",
        mood: 'brutal' as const
      },
      {
        content: "Here's a revolutionary idea: instead of asking me questions, how about you ask yourself 'When was the last time I touched grass?' Spoiler alert: if you have to think about it, it's been too long.",
        mood: 'savage' as const
      }
    ]
    
    return responses[Math.floor(Math.random() * responses.length)]
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

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    // Simulate typing delay
    setTimeout(() => {
      const response = generateBotResponse(inputValue)
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: response.content,
        timestamp: new Date(),
        mood: response.mood
      }
      
      setMessages(prev => [...prev, botResponse])
      setIsTyping(false)
    }, 1500 + Math.random() * 2000) // Random delay between 1.5-3.5 seconds
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
              className="w-full max-w-sm mx-auto rounded-t-3xl shadow-2xl max-h-[85vh] flex flex-col overflow-hidden"
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
                <motion.button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-full hover:bg-red-900/30 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-5 h-5 text-red-400" />
                </motion.button>
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