'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Medal, Crown, Users, TrendingUp, Calendar, Globe, MapPin, UserPlus } from 'lucide-react'
import { User } from '../types/user'
import { getCountryByCode } from '../data/countries'

interface LeaderboardProps {
  currentUser: User
}

// Mock data for demonstration - in a real app, this would come from a backend
const generateMockUsers = (currentUser: User, viewType: 'global' | 'local' | 'friends'): User[] => {
  const baseUsers: Partial<User>[] = [
    { name: 'ZenMaster', level: 15, experience: 14500, totalMinutes: 1200, goalsCompleted: 45, country: 'US' },
    { name: 'FocusNinja', level: 12, experience: 11800, totalMinutes: 980, goalsCompleted: 38, country: 'CA' },
    { name: 'MindfulWarrior', level: 18, experience: 17200, totalMinutes: 1450, goalsCompleted: 52, country: currentUser.country },
    { name: 'ProductivityGuru', level: 10, experience: 9500, totalMinutes: 850, goalsCompleted: 32, country: 'GB' },
    { name: 'BalancedSoul', level: 14, experience: 13200, totalMinutes: 1100, goalsCompleted: 41, country: currentUser.country },
    { name: 'FlowState', level: 16, experience: 15800, totalMinutes: 1350, goalsCompleted: 48, country: 'DE' },
    { name: 'DeepFocus', level: 11, experience: 10200, totalMinutes: 920, goalsCompleted: 35, country: 'FR' },
    { name: 'CalmAchiever', level: 13, experience: 12500, totalMinutes: 1050, goalsCompleted: 39, country: currentUser.country },
    { name: 'LocalHero', level: 9, experience: 8500, totalMinutes: 750, goalsCompleted: 28, country: currentUser.country },
    { name: 'ZenStudent', level: 7, experience: 6200, totalMinutes: 520, goalsCompleted: 22, country: currentUser.country },
  ]

  let mockUsers: User[] = baseUsers.map(user => ({
    id: user.name || '',
    email: `${user.name?.toLowerCase()}@example.com` || '',
    name: user.name || '',
    country: user.country || 'US',
    isEmailConfirmed: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    level: user.level || 1,
    experience: user.experience || 0,
    totalMinutes: user.totalMinutes || 0,
    goalsCompleted: user.goalsCompleted || 0,
  }))

  // Filter based on view type
  if (viewType === 'local') {
    mockUsers = mockUsers.filter(user => user.country === currentUser.country)
  } else if (viewType === 'friends') {
    // For demo, assume some users are friends
    const friendNames = ['ZenMaster', 'FocusNinja', 'MindfulWarrior']
    mockUsers = mockUsers.filter(user => friendNames.includes(user.name))
  }

  // Add current user and sort
  mockUsers.push(currentUser)
  return mockUsers.sort((a, b) => b.experience - a.experience)
}

export default function Leaderboard({ currentUser }: LeaderboardProps) {
  const [users, setUsers] = useState<User[]>([])
  const [timeFrame, setTimeFrame] = useState<'weekly' | 'monthly' | 'allTime'>('weekly')
  const [sortBy, setSortBy] = useState<'experience' | 'totalMinutes' | 'goalsCompleted'>('experience')
  const [viewType, setViewType] = useState<'global' | 'local' | 'friends'>('global')

  useEffect(() => {
    const mockUsers = generateMockUsers(currentUser, viewType)
    setUsers(mockUsers)
  }, [currentUser, viewType])

  const sortedUsers = [...users].sort((a, b) => {
    switch (sortBy) {
      case 'totalMinutes':
        return b.totalMinutes - a.totalMinutes
      case 'goalsCompleted':
        return b.goalsCompleted - a.goalsCompleted
      default:
        return b.experience - a.experience
    }
  })

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />
      default:
        return <div className="w-6 h-6 flex items-center justify-center text-gray-500 font-bold">{rank}</div>
    }
  }

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'from-yellow-400 to-yellow-600'
      case 2: return 'from-gray-300 to-gray-500'
      case 3: return 'from-amber-400 to-amber-600'
      default: return 'from-gray-100 to-gray-200'
    }
  }

  const currentUserRank = sortedUsers.findIndex(user => user.id === currentUser.id) + 1
  const currentCountry = getCountryByCode(currentUser.country)

  const getViewTypeInfo = () => {
    switch (viewType) {
      case 'local':
        return {
          title: `${currentCountry?.flag} ${currentCountry?.name} Leaderboard`,
          description: 'Compete with monks in your country'
        }
      case 'friends':
        return {
          title: '👥 Friends Leaderboard',
          description: 'See how you rank among your monk friends'
        }
      default:
        return {
          title: '🌍 Global Leaderboard',
          description: 'Compete with monks worldwide'
        }
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="monk-card">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold text-monk-700 flex items-center gap-3">
              <Trophy className="w-8 h-8" />
              Leaderboard
            </h2>
            <p className="text-gray-600">{getViewTypeInfo().description}</p>
          </div>
        </div>

        {/* View Type Selector */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { key: 'global', label: 'Global', icon: Globe },
            { key: 'local', label: `${currentCountry?.flag} Local`, icon: MapPin },
            { key: 'friends', label: 'Friends', icon: Users }
          ].map((option) => (
            <motion.button
              key={option.key}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setViewType(option.key as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                viewType === option.key
                  ? 'bg-monk-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <option.icon size={18} />
              {option.label}
            </motion.button>
          ))}
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-4 mb-6">
          {/* Time Frame */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            {[
              { key: 'weekly', label: 'This Week' },
              { key: 'monthly', label: 'This Month' },
              { key: 'allTime', label: 'All Time' }
            ].map((option) => (
              <motion.button
                key={option.key}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setTimeFrame(option.key as any)}
                className={`px-4 py-2 rounded-md font-medium transition-all ${
                  timeFrame === option.key
                    ? 'bg-white text-monk-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {option.label}
              </motion.button>
            ))}
          </div>

          {/* Sort By */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            {[
              { key: 'experience', label: 'XP', icon: TrendingUp },
              { key: 'totalMinutes', label: 'Time', icon: Calendar },
              { key: 'goalsCompleted', label: 'Goals', icon: Trophy }
            ].map((option) => (
              <motion.button
                key={option.key}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSortBy(option.key as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all ${
                  sortBy === option.key
                    ? 'bg-white text-zen-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <option.icon size={16} />
                {option.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Your Rank */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-monk-50 to-zen-50 border-2 border-monk-200 rounded-xl p-4 mb-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 bg-monk-500 text-white rounded-full font-bold text-lg">
                #{currentUserRank}
              </div>
              <div>
                <div className="font-bold text-lg text-monk-700">Your Rank</div>
                <div className="text-sm text-gray-600">
                  {sortBy === 'experience' && `${currentUser.experience.toLocaleString()} XP`}
                  {sortBy === 'totalMinutes' && `${currentUser.totalMinutes} minutes`}
                  {sortBy === 'goalsCompleted' && `${currentUser.goalsCompleted} goals completed`}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-monk-600">Level {currentUser.level}</div>
              <div className="text-sm text-gray-600">Monk</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Leaderboard List */}
      <div className="monk-card">
        <h3 className="text-xl font-semibold text-monk-700 mb-6 flex items-center gap-2">
          <Users className="w-5 h-5" />
          Top Monks
        </h3>

        <div className="space-y-3">
          {sortedUsers.slice(0, 10).map((user, index) => (
            <motion.div
              key={user.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative overflow-hidden rounded-xl p-4 transition-all hover:shadow-lg ${
                user.id === currentUser.id
                  ? 'bg-gradient-to-r from-monk-100 to-zen-100 border-2 border-monk-300'
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              {/* Rank Badge */}
              <div className={`absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b ${getRankColor(index + 1)}`} />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {getRankIcon(index + 1)}
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                      user.id === currentUser.id ? 'bg-monk-500' : 'bg-gray-400'
                    }`}>
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <div className={`font-semibold ${user.id === currentUser.id ? 'text-monk-700' : 'text-gray-800'}`}>
                        {user.id === currentUser.id ? `${user.name} (You)` : user.name}
                      </div>
                      <div className="text-sm text-gray-600 flex items-center gap-1">
                        <span>Level {user.level}</span>
                        {viewType === 'global' && (
                          <>
                            <span>•</span>
                            <span>{getCountryByCode(user.country)?.flag}</span>
                            <span>{getCountryByCode(user.country)?.name}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-sm">
                  <div className="text-center">
                    <div className="font-bold text-monk-600">
                      {sortBy === 'experience' && user.experience.toLocaleString()}
                      {sortBy === 'totalMinutes' && `${user.totalMinutes}m`}
                      {sortBy === 'goalsCompleted' && user.goalsCompleted}
                    </div>
                    <div className="text-gray-500 text-xs">
                      {sortBy === 'experience' && 'XP'}
                      {sortBy === 'totalMinutes' && 'Minutes'}
                      {sortBy === 'goalsCompleted' && 'Goals'}
                    </div>
                  </div>

                  {/* Additional stats */}
                  <div className="hidden md:flex gap-4 text-xs text-gray-500">
                    {sortBy !== 'totalMinutes' && (
                      <div className="text-center">
                        <div className="font-semibold">{user.totalMinutes}m</div>
                        <div>Time</div>
                      </div>
                    )}
                    {sortBy !== 'goalsCompleted' && (
                      <div className="text-center">
                        <div className="font-semibold">{user.goalsCompleted}</div>
                        <div>Goals</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Join Community CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 text-center p-6 bg-gradient-to-r from-monk-50 to-zen-50 rounded-xl border border-monk-200"
        >
          <h4 className="text-lg font-semibold text-monk-700 mb-2">Invite Friends</h4>
          <p className="text-gray-600 mb-4">
            Challenge your friends and grow together on your productivity journey
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="monk-button"
          >
            Share Invite Link
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}