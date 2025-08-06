'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { UserPlus, Users, Mail, Phone, Search, Check, X, MessageCircle, Crown } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { User, Friend } from '../types/user'
import { getCountryByCode } from '../data/countries'

interface FriendRequest {
  id: string
  fromUserId: string
  toUserId: string
  fromUser: User
  status: 'pending' | 'accepted' | 'declined'
  createdAt: Date
}

export default function FriendsManagement() {
  const { user } = useAuth()
  const [friends, setFriends] = useState<User[]>([])
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<User[]>([])
  const [activeTab, setActiveTab] = useState<'friends' | 'requests' | 'search' | 'contacts'>('friends')

  // Mock data for demonstration
  useEffect(() => {
    if (user) {
      // Mock friends
      const mockFriends: User[] = [
        {
          id: 'friend1',
          name: 'ZenMaster',
          email: 'zen@example.com',
          country: 'US',
          level: 15,
          experience: 14500,
          totalMinutes: 1200,
          goalsCompleted: 45,
          isEmailConfirmed: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'friend2',
          name: 'FocusNinja',
          email: 'focus@example.com',
          country: 'CA',
          level: 12,
          experience: 11800,
          totalMinutes: 980,
          goalsCompleted: 38,
          isEmailConfirmed: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]

      // Mock friend requests
      const mockRequests: FriendRequest[] = [
        {
          id: 'req1',
          fromUserId: 'user3',
          toUserId: user.id,
          fromUser: {
            id: 'user3',
            name: 'MindfulWarrior',
            email: 'mindful@example.com',
            country: user.country,
            level: 18,
            experience: 17200,
            totalMinutes: 1450,
            goalsCompleted: 52,
            isEmailConfirmed: true,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          status: 'pending',
          createdAt: new Date()
        }
      ]

      setFriends(mockFriends)
      setFriendRequests(mockRequests)
    }
  }, [user])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    
    if (query.trim() === '') {
      setSearchResults([])
      return
    }

    // Mock search results
    const mockResults: User[] = [
      {
        id: 'search1',
        name: 'BalancedSoul',
        email: 'balanced@example.com',
        country: 'GB',
        level: 14,
        experience: 13200,
        totalMinutes: 1100,
        goalsCompleted: 41,
        isEmailConfirmed: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'search2',
        name: 'DeepFocus',
        email: 'deep@example.com',
        country: 'DE',
        level: 11,
        experience: 10200,
        totalMinutes: 920,
        goalsCompleted: 35,
        isEmailConfirmed: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ].filter(user => 
      user.name.toLowerCase().includes(query.toLowerCase()) ||
      user.email.toLowerCase().includes(query.toLowerCase())
    )

    setSearchResults(mockResults)
  }

  const sendFriendRequest = (targetUser: User) => {
    // In a real app, this would send an API request
    console.log(`Sending friend request to ${targetUser.name}`)
    // Remove from search results to show it was sent
    setSearchResults(prev => prev.filter(u => u.id !== targetUser.id))
  }

  const acceptFriendRequest = (requestId: string) => {
    const request = friendRequests.find(r => r.id === requestId)
    if (request) {
      setFriends(prev => [...prev, request.fromUser])
      setFriendRequests(prev => prev.filter(r => r.id !== requestId))
    }
  }

  const declineFriendRequest = (requestId: string) => {
    setFriendRequests(prev => prev.filter(r => r.id !== requestId))
  }

  const removeFriend = (friendId: string) => {
    setFriends(prev => prev.filter(f => f.id !== friendId))
  }

  const simulateContactSync = () => {
    // Mock contact sync results
    const mockContacts: User[] = [
      {
        id: 'contact1',
        name: 'Alex Johnson',
        email: 'alex.johnson@email.com',
        country: 'US',
        level: 8,
        experience: 7200,
        totalMinutes: 650,
        goalsCompleted: 24,
        isEmailConfirmed: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'contact2',
        name: 'Sarah Chen',
        email: 'sarah.chen@email.com',
        country: user?.country || 'US',
        level: 6,
        experience: 5400,
        totalMinutes: 480,
        goalsCompleted: 18,
        isEmailConfirmed: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
    
    setSearchResults(mockContacts)
    setActiveTab('search')
  }

  const tabs = [
    { id: 'friends', label: 'Friends', icon: Users, count: friends.length },
    { id: 'requests', label: 'Requests', icon: Mail, count: friendRequests.length },
    { id: 'search', label: 'Find Friends', icon: Search, count: 0 },
    { id: 'contacts', label: 'Sync Contacts', icon: Phone, count: 0 }
  ]

  if (!user) return null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="monk-card">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold text-monk-700 flex items-center gap-3">
              <Users className="w-8 h-8" />
              Friends
            </h2>
            <p className="text-gray-600">Connect with fellow monks on your productivity journey</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-monk-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
              {tab.count > 0 && (
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                  activeTab === tab.id ? 'bg-white text-monk-500' : 'bg-monk-500 text-white'
                }`}>
                  {tab.count}
                </span>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'friends' && (
          <motion.div
            key="friends"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="monk-card"
          >
            <h3 className="text-xl font-semibold text-monk-700 mb-4">Your Monk Friends</h3>
            
            {friends.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-500 mb-2">No friends yet</h4>
                <p className="text-gray-400 mb-4">Start connecting with other monks to share your journey!</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab('search')}
                  className="monk-button"
                >
                  Find Friends
                </motion.button>
              </div>
            ) : (
              <div className="space-y-3">
                {friends.map((friend) => (
                  <motion.div
                    key={friend.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-monk-500 text-white rounded-full flex items-center justify-center font-bold">
                        {friend.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800 flex items-center gap-2">
                          {friend.name}
                          {friend.level >= 15 && <Crown className="w-4 h-4 text-yellow-500" />}
                        </div>
                        <div className="text-sm text-gray-600 flex items-center gap-2">
                          <span>Level {friend.level}</span>
                          <span>•</span>
                          <span>{getCountryByCode(friend.country)?.flag} {getCountryByCode(friend.country)?.name}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 text-monk-600 hover:bg-monk-100 rounded-lg"
                        title="Message"
                      >
                        <MessageCircle size={16} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => removeFriend(friend.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                        title="Remove Friend"
                      >
                        <X size={16} />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'requests' && (
          <motion.div
            key="requests"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="monk-card"
          >
            <h3 className="text-xl font-semibold text-monk-700 mb-4">Friend Requests</h3>
            
            {friendRequests.length === 0 ? (
              <div className="text-center py-12">
                <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-500 mb-2">No pending requests</h4>
                <p className="text-gray-400">You're all caught up!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {friendRequests.map((request) => (
                  <motion.div
                    key={request.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-4 bg-zen-50 border border-zen-200 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-zen-500 text-white rounded-full flex items-center justify-center font-bold">
                        {request.fromUser.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800">
                          {request.fromUser.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          Level {request.fromUser.level} • {getCountryByCode(request.fromUser.country)?.flag} {getCountryByCode(request.fromUser.country)?.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          Sent {request.createdAt.toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => acceptFriendRequest(request.id)}
                        className="flex items-center gap-1 px-3 py-2 bg-zen-500 text-white rounded-lg hover:bg-zen-600 transition-colors"
                      >
                        <Check size={16} />
                        Accept
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => declineFriendRequest(request.id)}
                        className="flex items-center gap-1 px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                      >
                        <X size={16} />
                        Decline
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'search' && (
          <motion.div
            key="search"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="monk-card"
          >
            <h3 className="text-xl font-semibold text-monk-700 mb-4">Find Monks</h3>
            
            {/* Search Input */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-monk-500 focus:border-transparent"
                placeholder="Search by name or email..."
              />
            </div>

            {/* Search Results */}
            <div className="space-y-3">
              {searchResults.map((result) => (
                <motion.div
                  key={result.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-400 text-white rounded-full flex items-center justify-center font-bold">
                      {result.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">{result.name}</div>
                      <div className="text-sm text-gray-600">
                        Level {result.level} • {getCountryByCode(result.country)?.flag} {getCountryByCode(result.country)?.name}
                      </div>
                      <div className="text-xs text-gray-500">{result.email}</div>
                    </div>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => sendFriendRequest(result)}
                    className="flex items-center gap-2 px-4 py-2 bg-monk-500 text-white rounded-lg hover:bg-monk-600 transition-colors"
                  >
                    <UserPlus size={16} />
                    Add Friend
                  </motion.button>
                </motion.div>
              ))}
              
              {searchQuery && searchResults.length === 0 && (
                <div className="text-center py-8">
                  <Search className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">No monks found matching "{searchQuery}"</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'contacts' && (
          <motion.div
            key="contacts"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="monk-card"
          >
            <h3 className="text-xl font-semibold text-monk-700 mb-4">Sync Contacts</h3>
            
            <div className="text-center py-12">
              <Phone className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-gray-600 mb-2">Find Friends from Your Contacts</h4>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                We'll help you find people from your contacts who are already using Monk. 
                Your contacts are never stored on our servers.
              </p>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={simulateContactSync}
                className="zen-button"
              >
                <Phone className="w-5 h-5 mr-2" />
                Sync Contacts
              </motion.button>
              
              <p className="text-xs text-gray-400 mt-4">
                This feature simulates contact sync for demo purposes
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}