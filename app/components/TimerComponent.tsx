'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, RotateCcw, Settings, Coffee, BookOpen, Dumbbell, Brain } from 'lucide-react'

interface TimerComponentProps {
  onComplete: (minutes: number) => void
}

interface ActivityType {
  id: string
  name: string
  icon: React.ComponentType<any>
  color: string
  defaultMinutes: number
}

const activityTypes: ActivityType[] = [
  { id: 'work', name: 'Work', icon: Brain, color: 'monk', defaultMinutes: 25 },
  { id: 'study', name: 'Study', icon: BookOpen, color: 'zen', defaultMinutes: 30 },
  { id: 'exercise', name: 'Exercise', icon: Dumbbell, color: 'red', defaultMinutes: 15 },
  { id: 'break', name: 'Break', icon: Coffee, color: 'blue', defaultMinutes: 5 },
]

export default function TimerComponent({ onComplete }: TimerComponentProps) {
  const [timeLeft, setTimeLeft] = useState(25 * 60) // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState(activityTypes[0])
  const [customMinutes, setCustomMinutes] = useState(25)
  const [showSettings, setShowSettings] = useState(false)
  const [completedSessions, setCompletedSessions] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false)
            const minutes = Math.ceil((customMinutes * 60 - prev) / 60)
            onComplete(minutes)
            setCompletedSessions(prev => prev + 1)
            
            // Play completion sound (if browser supports it)
            if ('speechSynthesis' in window) {
              const utterance = new SpeechSynthesisUtterance('Session complete! Great work!')
              utterance.rate = 0.8
              utterance.pitch = 1.2
              speechSynthesis.speak(utterance)
            }
            
            return customMinutes * 60
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, timeLeft, customMinutes, onComplete])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleStart = () => {
    setIsRunning(true)
  }

  const handlePause = () => {
    setIsRunning(false)
  }

  const handleReset = () => {
    setIsRunning(false)
    setTimeLeft(customMinutes * 60)
  }

  const handleActivityChange = (activity: ActivityType) => {
    setSelectedActivity(activity)
    setCustomMinutes(activity.defaultMinutes)
    setTimeLeft(activity.defaultMinutes * 60)
    setIsRunning(false)
  }

  const handleCustomTimeChange = (minutes: number) => {
    setCustomMinutes(minutes)
    setTimeLeft(minutes * 60)
    setIsRunning(false)
  }

  const progress = ((customMinutes * 60 - timeLeft) / (customMinutes * 60)) * 100

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Timer Display */}
      <div className="monk-card text-center">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-monk-700 mb-2">Focus Timer</h2>
          <p className="text-gray-600">Stay focused and level up your monk</p>
        </div>

        {/* Activity Selection */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {activityTypes.map((activity) => (
            <motion.button
              key={activity.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleActivityChange(activity)}
              className={`p-3 rounded-lg font-medium transition-all flex flex-col items-center gap-2 ${
                selectedActivity.id === activity.id
                  ? `bg-${activity.color}-500 text-white shadow-lg`
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <activity.icon size={20} />
              <span className="text-sm">{activity.name}</span>
            </motion.button>
          ))}
        </div>

        {/* Timer Circle */}
        <div className="relative w-64 h-64 mx-auto mb-8">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="6"
            />
            {/* Progress circle */}
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={`rgb(var(--color-${selectedActivity.color}-500))`}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 45 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 45 * (1 - progress / 100) }}
              transition={{ duration: 0.5 }}
              className={`drop-shadow-lg`}
              style={{
                stroke: selectedActivity.color === 'monk' ? '#e18b2a' :
                        selectedActivity.color === 'zen' ? '#3e9a3e' :
                        selectedActivity.color === 'red' ? '#dc2626' : '#2563eb'
              }}
            />
          </svg>
          
          {/* Timer Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.div
              key={timeLeft}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              className="text-4xl md:text-5xl font-bold text-gray-800"
            >
              {formatTime(timeLeft)}
            </motion.div>
            <div className="text-lg text-gray-600 mt-2">{selectedActivity.name}</div>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex justify-center gap-4 mb-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={isRunning ? handlePause : handleStart}
            className={`flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg shadow-lg transition-all ${
              isRunning 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-zen-500 hover:bg-zen-600 text-white'
            }`}
          >
            {isRunning ? <Pause size={24} /> : <Play size={24} />}
            {isRunning ? 'Pause' : 'Start'}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleReset}
            className="flex items-center gap-2 px-6 py-4 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-semibold shadow-lg transition-all"
          >
            <RotateCcw size={20} />
            Reset
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center gap-2 px-6 py-4 bg-monk-200 hover:bg-monk-300 text-monk-700 rounded-xl font-semibold shadow-lg transition-all"
          >
            <Settings size={20} />
          </motion.button>
        </div>

        {/* Stats */}
        <div className="text-center">
          <div className="text-2xl font-bold text-monk-600">{completedSessions}</div>
          <div className="text-gray-600">Sessions Completed Today</div>
        </div>
      </div>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="monk-card"
          >
            <h3 className="text-xl font-semibold text-monk-700 mb-4">Timer Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Custom Duration (minutes)
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="1"
                    max="120"
                    value={customMinutes}
                    onChange={(e) => handleCustomTimeChange(parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <div className="w-16 text-center font-semibold">{customMinutes}m</div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[5, 15, 25, 45, 60, 90].map((minutes) => (
                  <motion.button
                    key={minutes}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleCustomTimeChange(minutes)}
                    className={`px-3 py-2 rounded-lg font-medium transition-all ${
                      customMinutes === minutes
                        ? 'bg-monk-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {minutes}m
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Motivational Quotes */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="monk-card text-center"
      >
        <div className="text-lg italic text-gray-600 mb-2">
          "The mind is everything. What you think you become."
        </div>
        <div className="text-sm text-gray-500">- Buddha</div>
      </motion.div>
    </div>
  )
}