'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Timer, Target, Trophy, Users, LogOut, UserPlus } from 'lucide-react'
import { useAuth } from './context/AuthContext'
import MonkCharacter from './components/MonkCharacter'
import GoalSetting from './components/GoalSetting'
import TimerComponent from './components/TimerComponent'
import Leaderboard from './components/Leaderboard'
import FriendsManagement from './components/FriendsManagement'

interface MonkStats {
  level: number
  experience: number
  totalMinutes: number
  goalsCompleted: number
}

interface Goal {
  id: string
  title: string
  type: 'short' | 'medium' | 'long'
  completed: boolean
  createdAt: Date
}

export default function Home() {
  const { user, logout, loading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [goals, setGoals] = useState<Goal[]>([])

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth')
    }
  }, [user, loading, router])

  // Load user-specific goals from localStorage
  useEffect(() => {
    if (user) {
      const savedGoals = localStorage.getItem('monkGoals')
      if (savedGoals) {
        const allGoals = JSON.parse(savedGoals)
        const userGoals = allGoals.filter((goal: Goal) => goal.userId === user.id)
        setGoals(userGoals)
      }
    }
  }, [user])

  // Save goals to localStorage whenever they change
  useEffect(() => {
    if (user) {
      const allGoals = JSON.parse(localStorage.getItem('monkGoals') || '[]')
      const otherUserGoals = allGoals.filter((goal: Goal) => goal.userId !== user.id)
      localStorage.setItem('monkGoals', JSON.stringify([...otherUserGoals, ...goals]))
    }
  }, [goals, user])

  const addExperience = (minutes: number) => {
    if (!user) return
    
    // Update user data in localStorage
    const users = JSON.parse(localStorage.getItem('monkUsers') || '[]')
    const userIndex = users.findIndex((u: any) => u.id === user.id)
    
    if (userIndex !== -1) {
      const newExp = user.experience + minutes * 10 // 10 XP per minute
      const newLevel = Math.floor(newExp / 1000) + 1 // Level up every 1000 XP
      
      users[userIndex] = {
        ...users[userIndex],
        experience: newExp,
        level: newLevel,
        totalMinutes: user.totalMinutes + minutes,
        updatedAt: new Date()
      }
      
      localStorage.setItem('monkUsers', JSON.stringify(users))
      
      // Update current user state
      const updatedUser = { ...user, experience: newExp, level: newLevel, totalMinutes: user.totalMinutes + minutes }
      localStorage.setItem('monkUser', JSON.stringify(updatedUser))
      // Note: In a real app, you'd update the auth context here
    }
  }

  const completeGoal = (goalId: string) => {
    if (!user) return
    
    setGoals(prev => prev.map(goal => 
      goal.id === goalId ? { ...goal, completed: true, completedAt: new Date() } : goal
    ))
    
    // Update user stats
    const users = JSON.parse(localStorage.getItem('monkUsers') || '[]')
    const userIndex = users.findIndex((u: any) => u.id === user.id)
    
    if (userIndex !== -1) {
      const newExp = user.experience + 500 // Bonus XP for completing goals
      const newLevel = Math.floor(newExp / 1000) + 1
      
      users[userIndex] = {
        ...users[userIndex],
        experience: newExp,
        level: newLevel,
        goalsCompleted: user.goalsCompleted + 1,
        updatedAt: new Date()
      }
      
      localStorage.setItem('monkUsers', JSON.stringify(users))
      
      // Update current user state
      const updatedUser = { ...user, experience: newExp, level: newLevel, goalsCompleted: user.goalsCompleted + 1 }
      localStorage.setItem('monkUser', JSON.stringify(updatedUser))
    }
  }

  const addGoal = (goal: Omit<Goal, 'id' | 'userId' | 'completed' | 'createdAt'>) => {
    if (!user) return
    
    const newGoal: Goal = {
      ...goal,
      id: Date.now().toString(),
      userId: user.id,
      completed: false,
      createdAt: new Date()
    }
    setGoals(prev => [...prev, newGoal])
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Timer },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'timer', label: 'Focus Timer', icon: Trophy },
    { id: 'friends', label: 'Friends', icon: UserPlus },
    { id: 'leaderboard', label: 'Leaderboard', icon: Users }
  ]

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-monk-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your monk...</p>
        </div>
      </div>
    )
  }

  // Redirect to auth if no user (will be handled by useEffect)
  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div className="text-center flex-1">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-monk-600 to-zen-600 bg-clip-text text-transparent mb-2">
              Monk
            </h1>
            <p className="text-lg text-gray-600">Welcome back, {user.name}</p>
          </div>
          
          {/* User Actions */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm text-gray-500">Level {user.level} Monk</div>
              <div className="text-xs text-gray-400">{user.country}</div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors"
            >
              <LogOut size={16} />
              Logout
            </motion.button>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-monk-500 text-white shadow-lg'
                  : 'bg-white/60 text-gray-700 hover:bg-white/80'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </motion.button>
          ))}
        </div>

        {/* Main Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Monk Character */}
              <div className="monk-card text-center">
                <MonkCharacter level={user.level} experience={user.experience} />
                <div className="mt-6 space-y-2">
                  <h3 className="text-2xl font-bold text-monk-700">Level {user.level} Monk</h3>
                  <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-monk-400 to-monk-600 h-full transition-all duration-500"
                      style={{ width: `${(user.experience % 1000) / 10}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-600">
                    {user.experience % 1000}/1000 XP to next level
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="space-y-4">
                <div className="monk-card">
                  <h3 className="text-xl font-semibold text-monk-700 mb-4">Your Progress</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-monk-600">{user.totalMinutes}</div>
                      <div className="text-sm text-gray-600">Minutes Focused</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-zen-600">{user.goalsCompleted}</div>
                      <div className="text-sm text-gray-600">Goals Completed</div>
                    </div>
                  </div>
                </div>

                {/* Screen Time Goal */}
                {user.dailyScreenTimeGoal && (
                  <div className="monk-card">
                    <h3 className="text-xl font-semibold text-monk-700 mb-4">Screen Time Goal</h3>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {Math.floor(user.dailyScreenTimeGoal / 60)}h {user.dailyScreenTimeGoal % 60}m
                      </div>
                      <div className="text-sm text-gray-600">Daily Goal</div>
                      <div className="bg-gray-200 rounded-full h-2 mt-2 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-purple-400 to-purple-600 h-full transition-all duration-500"
                          style={{ width: `${Math.min((user.currentScreenTime || 0) / user.dailyScreenTimeGoal * 100, 100)}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {user.currentScreenTime || 0} / {user.dailyScreenTimeGoal} minutes today
                      </p>
                    </div>
                  </div>
                )}

                {/* Recent Goals */}
                <div className="monk-card">
                  <h3 className="text-xl font-semibold text-monk-700 mb-4">Recent Goals</h3>
                  <div className="space-y-2">
                    {goals.slice(-3).map((goal) => (
                      <div key={goal.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                        <div className={`w-3 h-3 rounded-full ${goal.completed ? 'bg-zen-500' : 'bg-gray-300'}`} />
                        <span className={`flex-1 ${goal.completed ? 'line-through text-gray-500' : ''}`}>
                          {goal.title}
                        </span>
                        <span className="text-xs text-gray-500 capitalize">{goal.type}</span>
                      </div>
                    ))}
                    {goals.length === 0 && (
                      <p className="text-gray-500 text-center py-4">No goals set yet. Start by setting your first goal!</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'goals' && (
            <GoalSetting 
              goals={goals} 
              onAddGoal={addGoal} 
              onCompleteGoal={completeGoal}
            />
          )}

          {activeTab === 'timer' && (
            <TimerComponent onComplete={addExperience} />
          )}

          {activeTab === 'friends' && (
            <FriendsManagement />
          )}

          {activeTab === 'leaderboard' && (
            <Leaderboard currentUser={user} />
          )}
        </motion.div>
      </div>
    </div>
  )
}