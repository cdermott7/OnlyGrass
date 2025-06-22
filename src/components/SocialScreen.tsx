import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  Users, Search, UserPlus, Trophy, Crown, Medal, 
  Star, Zap, Brain, Check, X, ArrowLeft, Plus,
  MessageCircle, UserCheck, Clock, Target
} from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import { socialService, Friend, FriendRequest, LeaderboardEntry } from '../services/social'

const SocialScreen: React.FC = () => {
  const navigate = useNavigate()
  const { currentUser } = useAppStore()
  const [activeTab, setActiveTab] = useState<'friends' | 'leaderboard' | 'requests' | 'search'>('friends')
  const [friends, setFriends] = useState<Friend[]>([])
  const [pendingRequests, setPendingRequests] = useState<FriendRequest[]>([])
  const [sentRequests, setSentRequests] = useState<FriendRequest[]>([])
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    if (currentUser) {
      loadSocialData()
    }
  }, [currentUser])

  const loadSocialData = async () => {
    if (!currentUser) return
    
    setIsLoading(true)
    try {
      const [friendsData, pendingData, sentData, leaderboardData] = await Promise.all([
        socialService.getFriends(currentUser.id),
        socialService.getPendingRequests(currentUser.id),
        socialService.getSentRequests(currentUser.id),
        socialService.getFriendsLeaderboard(currentUser.id)
      ])
      
      setFriends(friendsData)
      setPendingRequests(pendingData)
      setSentRequests(sentData)
      setLeaderboard(leaderboardData)
    } catch (error) {
      console.error('Failed to load social data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = async (query: string) => {
    setSearchQuery(query)
    if (!query.trim() || !currentUser) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    try {
      const results = await socialService.searchUsers(query, currentUser.id)
      setSearchResults(results)
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setIsSearching(false)
    }
  }

  const sendFriendRequest = async (friendId: string) => {
    if (!currentUser) return
    
    try {
      await socialService.sendFriendRequest(currentUser.id, friendId)
      // Update search results to show request sent
      setSearchResults(prev => prev.map(user => 
        user.id === friendId ? { ...user, requestSent: true } : user
      ))
      // Reload sent requests
      const sentData = await socialService.getSentRequests(currentUser.id)
      setSentRequests(sentData)
    } catch (error) {
      console.error('Failed to send friend request:', error)
      alert(error instanceof Error ? error.message : 'Failed to send friend request')
    }
  }

  const acceptFriendRequest = async (requestId: string) => {
    try {
      await socialService.acceptFriendRequest(requestId)
      await loadSocialData() // Reload all data
    } catch (error) {
      console.error('Failed to accept friend request:', error)
      alert('Failed to accept friend request')
    }
  }

  const declineFriendRequest = async (requestId: string) => {
    try {
      await socialService.declineFriendRequest(requestId)
      await loadSocialData() // Reload all data
    } catch (error) {
      console.error('Failed to decline friend request:', error)
      alert('Failed to decline friend request')
    }
  }

  if (!currentUser) return null

  const tabs = [
    { id: 'friends' as const, label: 'Friends', icon: Users, count: friends.length },
    { id: 'leaderboard' as const, label: 'Leaderboard', icon: Trophy, count: null },
    { id: 'requests' as const, label: 'Requests', icon: UserPlus, count: pendingRequests.length },
    { id: 'search' as const, label: 'Search', icon: Search, count: null }
  ]

  return (
    <div className="h-full bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 relative overflow-hidden">
      <div 
        className="h-full overflow-y-auto container-fluid" 
        style={{ 
          WebkitOverflowScrolling: 'touch',
          overflowY: 'scroll',
          maxHeight: '100vh',
          height: '100%',
          paddingTop: 'var(--space-xl)',
          paddingBottom: '8rem' // Fixed for 5-tab navigation
        }}
      >
        <div className="stack-lg">
          
          {/* Header */}
          <motion.div
            className="flex items-center justify-between"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <button
              onClick={() => navigate('/profile')}
              className="btn-glass"
              style={{
                padding: 'var(--space-md)',
                minWidth: 'auto',
                borderRadius: 'var(--radius-lg)'
              }}
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            
            <h1 className="text-3xl font-bold text-white text-center">Social</h1>
            
            <div className="w-12" /> {/* Spacer */}
          </motion.div>

          {/* Tab Navigation */}
          <motion.div
            className="glass-card-subtle"
            style={{ padding: 'var(--space-xs)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="grid grid-cols-4 gap-1">
              {tabs.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative flex flex-col items-center justify-center transition-all duration-300 ${
                      isActive 
                        ? 'glass-card-strong bg-white/10 text-white' 
                        : 'text-white/70 hover:text-white/90 hover:bg-white/5'
                    }`}
                    style={{
                      padding: 'var(--space-sm)',
                      borderRadius: 'var(--radius-md)',
                      gap: 'var(--space-xs)'
                    }}
                  >
                    <div className="relative">
                      <Icon className="w-4 h-4" />
                      {tab.count !== null && tab.count > 0 && (
                        <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                          <span className="text-xs text-white font-bold">{tab.count}</span>
                        </div>
                      )}
                    </div>
                    <span className="text-xs font-medium">{tab.label}</span>
                  </button>
                )
              })}
            </div>
          </motion.div>

          {/* Content */}
          <AnimatePresence mode="wait">
            {activeTab === 'friends' && (
              <motion.div
                key="friends"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="stack-md"
              >
                {friends.length > 0 ? (
                  friends.map((friend, index) => (
                    <motion.div
                      key={friend.id}
                      className="glass-card-subtle"
                      style={{ padding: 'var(--space-lg)' }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/20">
                          <img
                            src={friend.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${friend.username}`}
                            alt={friend.username}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-white font-semibold">{friend.firstName} {friend.lastName}</h3>
                          <p className="text-white/70 text-sm">@{friend.username}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-1 text-white">
                            <Brain className="w-4 h-4 text-blue-400" />
                            <span className="font-bold">{friend.fhiScore}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-white/70 text-sm">
                            <Zap className="w-3 h-3 text-orange-400" />
                            <span>{friend.streak} streak</span>
                          </div>
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
                    <Users className="w-16 h-16 text-white/40 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No Friends Yet</h3>
                    <p className="text-white/70 mb-6">Start building your grass-touching community!</p>
                    <button
                      onClick={() => setActiveTab('search')}
                      className="btn-glass gradient-primary text-white font-semibold"
                      style={{ padding: 'var(--space-md) var(--space-xl)' }}
                    >
                      Find Friends
                    </button>
                  </motion.div>
                )}
              </motion.div>
            )}

            {activeTab === 'leaderboard' && (
              <motion.div
                key="leaderboard"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="stack-md"
              >
                {leaderboard.map((user, index) => {
                  const isCurrentUser = user.id === currentUser.id
                  return (
                    <motion.div
                      key={user.id}
                      className={`glass-card-subtle ${isCurrentUser ? 'border-yellow-400/50 bg-yellow-400/10' : ''}`}
                      style={{ padding: 'var(--space-lg)' }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-8 h-8">
                          {user.rank <= 3 ? (
                            user.rank === 1 ? <Crown className="w-6 h-6 text-yellow-400" /> :
                            user.rank === 2 ? <Medal className="w-6 h-6 text-gray-300" /> :
                            <Medal className="w-6 h-6 text-amber-600" />
                          ) : (
                            <span className="text-white/70 font-bold">#{user.rank}</span>
                          )}
                        </div>
                        
                        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/20">
                          <img
                            src={user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                            alt={user.username}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        <div className="flex-1">
                          <h3 className={`font-semibold ${isCurrentUser ? 'text-yellow-300' : 'text-white'}`}>
                            {user.firstName} {user.lastName}
                            {isCurrentUser && <span className="text-xs ml-2">(You)</span>}
                          </h3>
                          <p className="text-white/70 text-sm">@{user.username}</p>
                        </div>
                        
                        <div className="text-right">
                          <div className="flex items-center space-x-1 text-white">
                            <Brain className="w-4 h-4 text-blue-400" />
                            <span className="font-bold">{user.fhiScore}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-white/70 text-sm">
                            <Target className="w-3 h-3 text-green-400" />
                            <span>{user.totalGrassTouched}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </motion.div>
            )}

            {activeTab === 'requests' && (
              <motion.div
                key="requests"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="stack-md"
              >
                {pendingRequests.length > 0 ? (
                  pendingRequests.map((request, index) => (
                    <motion.div
                      key={request.id}
                      className="glass-card-subtle"
                      style={{ padding: 'var(--space-lg)' }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/20">
                          <img
                            src={request.user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${request.user.username}`}
                            alt={request.user.username}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-white font-semibold">{request.user.firstName} {request.user.lastName}</h3>
                          <p className="text-white/70 text-sm">@{request.user.username}</p>
                          <div className="flex items-center space-x-1 text-white/60 text-xs mt-1">
                            <Clock className="w-3 h-3" />
                            <span>{new Date(request.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => acceptFriendRequest(request.id)}
                            className="btn-glass bg-green-500/20 hover:bg-green-500/30 text-green-400 border-green-400/30"
                            style={{
                              padding: 'var(--space-sm)',
                              minWidth: 'auto',
                              borderRadius: 'var(--radius-md)'
                            }}
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => declineFriendRequest(request.id)}
                            className="btn-glass bg-red-500/20 hover:bg-red-500/30 text-red-400 border-red-400/30"
                            style={{
                              padding: 'var(--space-sm)',
                              minWidth: 'auto',
                              borderRadius: 'var(--radius-md)'
                            }}
                          >
                            <X className="w-4 h-4" />
                          </button>
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
                    <UserPlus className="w-16 h-16 text-white/40 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No Friend Requests</h3>
                    <p className="text-white/70">You'll see friend requests here when people want to connect with you.</p>
                  </motion.div>
                )}
              </motion.div>
            )}

            {activeTab === 'search' && (
              <motion.div
                key="search"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="stack-md"
              >
                {/* Search Input */}
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-5 h-5 text-white/60" />
                  <input
                    type="text"
                    placeholder="Search by username..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="glass-card-subtle w-full focus-ring text-white placeholder-white/60"
                    style={{
                      paddingLeft: 'calc(var(--space-md) + 2.5rem)',
                      paddingRight: 'var(--space-lg)',
                      paddingTop: 'var(--space-md)',
                      paddingBottom: 'var(--space-md)',
                      fontSize: 'var(--text-base)',
                      background: 'rgba(255,255,255,0.1)'
                    }}
                  />
                </div>

                {/* Search Results */}
                {searchResults.length > 0 ? (
                  searchResults.map((user, index) => (
                    <motion.div
                      key={user.id}
                      className="glass-card-subtle"
                      style={{ padding: 'var(--space-lg)' }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/20">
                          <img
                            src={user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                            alt={user.username}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-white font-semibold">{user.first_name} {user.last_name}</h3>
                          <p className="text-white/70 text-sm">@{user.username}</p>
                          <div className="flex items-center space-x-1 text-white/60 text-sm mt-1">
                            <Brain className="w-3 h-3 text-blue-400" />
                            <span>{user.fhi_score} FHI</span>
                          </div>
                        </div>
                        <button
                          onClick={() => sendFriendRequest(user.id)}
                          disabled={user.requestSent}
                          className={`btn-glass ${
                            user.requestSent 
                              ? 'bg-gray-500/20 text-gray-400 cursor-not-allowed' 
                              : 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border-blue-400/30'
                          }`}
                          style={{
                            padding: 'var(--space-sm) var(--space-md)',
                            borderRadius: 'var(--radius-md)',
                            gap: 'var(--space-xs)'
                          }}
                        >
                          {user.requestSent ? (
                            <>
                              <UserCheck className="w-4 h-4" />
                              <span className="text-sm">Sent</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-4 h-4" />
                              <span className="text-sm">Add</span>
                            </>
                          )}
                        </button>
                      </div>
                    </motion.div>
                  ))
                ) : searchQuery.trim() ? (
                  <motion.div
                    className="text-center py-12"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <Search className="w-16 h-16 text-white/40 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No Results Found</h3>
                    <p className="text-white/70">Try searching with a different username.</p>
                  </motion.div>
                ) : (
                  <motion.div
                    className="text-center py-12"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <Search className="w-16 h-16 text-white/40 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">Find Friends</h3>
                    <p className="text-white/70">Search for other grass touchers by their username.</p>
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

export default SocialScreen