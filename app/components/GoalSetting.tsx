'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Target, Clock, Calendar, CheckCircle2, Circle } from 'lucide-react'

interface Goal {
  id: string
  title: string
  type: 'short' | 'medium' | 'long'
  completed: boolean
  createdAt: Date
}

interface GoalSettingProps {
  goals: Goal[]
  onAddGoal: (goal: Omit<Goal, 'id' | 'completed' | 'createdAt'>) => void
  onCompleteGoal: (goalId: string) => void
}

export default function GoalSetting({ goals, onAddGoal, onCompleteGoal }: GoalSettingProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [newGoal, setNewGoal] = useState({ title: '', type: 'short' as const })
  const [activeFilter, setActiveFilter] = useState<'all' | 'short' | 'medium' | 'long'>('all')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newGoal.title.trim()) {
      onAddGoal(newGoal)
      setNewGoal({ title: '', type: 'short' })
      setShowAddForm(false)
    }
  }

  const filteredGoals = goals.filter(goal => 
    activeFilter === 'all' || goal.type === activeFilter
  )

  const getGoalIcon = (type: string) => {
    switch (type) {
      case 'short': return <Clock className="w-5 h-5 text-monk-500" />
      case 'medium': return <Target className="w-5 h-5 text-zen-500" />
      case 'long': return <Calendar className="w-5 h-5 text-purple-500" />
      default: return <Target className="w-5 h-5" />
    }
  }

  const getGoalTypeInfo = (type: string) => {
    switch (type) {
      case 'short': return { label: 'Short-term', description: 'Goals to achieve within days or weeks', color: 'monk' }
      case 'medium': return { label: 'Medium-term', description: 'Goals to achieve within months', color: 'zen' }
      case 'long': return { label: 'Long-term', description: 'Goals to achieve within years', color: 'purple' }
      default: return { label: 'Goal', description: '', color: 'gray' }
    }
  }

  const goalStats = {
    total: goals.length,
    completed: goals.filter(g => g.completed).length,
    short: goals.filter(g => g.type === 'short').length,
    medium: goals.filter(g => g.type === 'medium').length,
    long: goals.filter(g => g.type === 'long').length,
  }

  return (
    <div className="space-y-6">
      {/* Header and Stats */}
      <div className="monk-card">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold text-monk-700">Your Goals</h2>
            <p className="text-gray-600">Set and track your short, medium, and long-term goals</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddForm(!showAddForm)}
            className="monk-button flex items-center gap-2"
          >
            <Plus size={20} />
            Add Goal
          </motion.button>
        </div>

        {/* Goal Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-700">{goalStats.total}</div>
            <div className="text-sm text-gray-500">Total Goals</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{goalStats.completed}</div>
            <div className="text-sm text-gray-500">Completed</div>
          </div>
          <div className="text-center p-3 bg-monk-50 rounded-lg">
            <div className="text-2xl font-bold text-monk-600">{goalStats.short}</div>
            <div className="text-sm text-gray-500">Short-term</div>
          </div>
          <div className="text-center p-3 bg-zen-50 rounded-lg">
            <div className="text-2xl font-bold text-zen-600">{goalStats.medium}</div>
            <div className="text-sm text-gray-500">Medium-term</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{goalStats.long}</div>
            <div className="text-sm text-gray-500">Long-term</div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          {['all', 'short', 'medium', 'long'].map((filter) => (
            <motion.button
              key={filter}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveFilter(filter as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-all capitalize ${
                activeFilter === filter
                  ? 'bg-monk-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filter === 'all' ? 'All Goals' : `${filter}-term`}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Add Goal Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="monk-card"
          >
            <h3 className="text-xl font-semibold text-monk-700 mb-4">Add New Goal</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Goal Title
                </label>
                <input
                  type="text"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                  placeholder="Enter your goal..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-monk-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Goal Type
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {['short', 'medium', 'long'].map((type) => {
                    const info = getGoalTypeInfo(type)
                    return (
                      <motion.label
                        key={type}
                        whileHover={{ scale: 1.02 }}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          newGoal.type === type
                            ? `border-${info.color}-500 bg-${info.color}-50`
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="goalType"
                          value={type}
                          checked={newGoal.type === type}
                          onChange={(e) => setNewGoal({ ...newGoal, type: e.target.value as any })}
                          className="sr-only"
                        />
                        <div className="flex items-center gap-3">
                          {getGoalIcon(type)}
                          <div>
                            <div className="font-semibold">{info.label}</div>
                            <div className="text-sm text-gray-600">{info.description}</div>
                          </div>
                        </div>
                      </motion.label>
                    )
                  })}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="zen-button flex-1"
                >
                  Create Goal
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Goals List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredGoals.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="monk-card text-center py-12"
            >
              <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-500 mb-2">No goals yet</h3>
              <p className="text-gray-400">
                {activeFilter === 'all' 
                  ? "Start your journey by setting your first goal!"
                  : `No ${activeFilter}-term goals yet. Create one to get started!`
                }
              </p>
            </motion.div>
          ) : (
            filteredGoals.map((goal, index) => (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className={`monk-card hover:shadow-xl transition-all ${
                  goal.completed ? 'opacity-75' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => !goal.completed && onCompleteGoal(goal.id)}
                    className={`flex-shrink-0 ${goal.completed ? 'cursor-default' : 'cursor-pointer'}`}
                  >
                    {goal.completed ? (
                      <CheckCircle2 className="w-6 h-6 text-green-500" />
                    ) : (
                      <Circle className="w-6 h-6 text-gray-400 hover:text-monk-500 transition-colors" />
                    )}
                  </motion.button>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {getGoalIcon(goal.type)}
                      <span className={`font-semibold ${goal.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                        {goal.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="capitalize">{goal.type}-term goal</span>
                      <span>Created {new Date(goal.createdAt).toLocaleDateString()}</span>
                      {goal.completed && (
                        <span className="text-green-600 font-medium">✓ Completed</span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}