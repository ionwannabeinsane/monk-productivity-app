'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, User, Globe, Target, Clock, UserPlus, ChevronLeft, ChevronRight } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { countries } from '../../data/countries'
import { RegisterData } from '../../types/user'

interface RegisterFormProps {
  onSwitchToLogin: () => void
}

export default function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const [step, setStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const { register, loading } = useAuth()

  // Form data
  const [formData, setFormData] = useState<RegisterData>({
    email: '',
    password: '',
    name: '',
    country: '',
    shortTermGoals: ['', '', ''],
    mediumTermGoals: ['', '', ''],
    longTermGoals: ['', '', ''],
    dailyScreenTimeGoal: 480 // 8 hours default
  })

  const updateFormData = (field: keyof RegisterData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const updateGoalArray = (type: 'shortTermGoals' | 'mediumTermGoals' | 'longTermGoals', index: number, value: string) => {
    const newGoals = [...formData[type]]
    newGoals[index] = value
    updateFormData(type, newGoals)
  }

  const handleNext = () => {
    setError('')
    
    if (step === 1) {
      if (!formData.email || !formData.password || !formData.name) {
        setError('Please fill in all fields')
        return
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters')
        return
      }
    }
    
    if (step === 2) {
      if (!formData.country) {
        setError('Please select your country')
        return
      }
    }

    setStep(step + 1)
  }

  const handleBack = () => {
    setError('')
    setStep(step - 1)
  }

  const handleSubmit = async () => {
    setError('')

    // Validate that at least one goal is filled
    const hasShortGoal = formData.shortTermGoals.some(goal => goal.trim())
    const hasMediumGoal = formData.mediumTermGoals.some(goal => goal.trim())
    const hasLongGoal = formData.longTermGoals.some(goal => goal.trim())

    if (!hasShortGoal && !hasMediumGoal && !hasLongGoal) {
      setError('Please add at least one goal to get started')
      return
    }

    const success = await register(formData)
    if (!success) {
      setError('Registration failed. Email might already be in use.')
    }
  }

  const renderStep1 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-4"
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Full Name
        </label>
        <div className="relative">
          <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={formData.name}
            onChange={(e) => updateFormData('name', e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-monk-500 focus:border-transparent"
            placeholder="Enter your full name"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email Address
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="email"
            value={formData.email}
            onChange={(e) => updateFormData('email', e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-monk-500 focus:border-transparent"
            placeholder="Enter your email"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={(e) => updateFormData('password', e.target.value)}
            className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-monk-500 focus:border-transparent"
            placeholder="Create a password"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 h-5 w-5 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
      </div>
    </motion.div>
  )

  const renderStep2 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-4"
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Your Country
        </label>
        <div className="relative">
          <Globe className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <select
            value={formData.country}
            onChange={(e) => updateFormData('country', e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-monk-500 focus:border-transparent appearance-none bg-white"
            required
          >
            <option value="">Choose your country</option>
            {countries.map((country) => (
              <option key={country.code} value={country.code}>
                {country.flag} {country.name}
              </option>
            ))}
          </select>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          This helps us show you local leaderboards and connect you with nearby monks
        </p>
      </div>

      <div className="bg-monk-50 p-4 rounded-lg">
        <h4 className="font-semibold text-monk-700 mb-2">Email Confirmation</h4>
        <p className="text-sm text-gray-600">
          We'll send you a confirmation email after registration to verify your account. 
          You can start using the app immediately, but some features may be limited until confirmed.
        </p>
      </div>
    </motion.div>
  )

  const renderStep3 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div>
        <h3 className="text-lg font-semibold text-monk-700 mb-4 flex items-center gap-2">
          <Target className="w-5 h-5" />
          Set Your Goals
        </h3>
        <p className="text-gray-600 mb-6">
          Define your goals to help your monk guide your productivity journey. You can add more later!
        </p>

        {/* Short-term Goals */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-monk-600 mb-2">
              Short-term Goals (Days to Weeks)
            </label>
            {formData.shortTermGoals.map((goal, index) => (
              <input
                key={index}
                type="text"
                value={goal}
                onChange={(e) => updateGoalArray('shortTermGoals', index, e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-monk-500 focus:border-transparent mb-2"
                placeholder={`Short-term goal ${index + 1} (optional)`}
              />
            ))}
          </div>

          {/* Medium-term Goals */}
          <div>
            <label className="block text-sm font-medium text-zen-600 mb-2">
              Medium-term Goals (Months)
            </label>
            {formData.mediumTermGoals.map((goal, index) => (
              <input
                key={index}
                type="text"
                value={goal}
                onChange={(e) => updateGoalArray('mediumTermGoals', index, e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zen-500 focus:border-transparent mb-2"
                placeholder={`Medium-term goal ${index + 1} (optional)`}
              />
            ))}
          </div>

          {/* Long-term Goals */}
          <div>
            <label className="block text-sm font-medium text-purple-600 mb-2">
              Long-term Goals (Years)
            </label>
            {formData.longTermGoals.map((goal, index) => (
              <input
                key={index}
                type="text"
                value={goal}
                onChange={(e) => updateGoalArray('longTermGoals', index, e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent mb-2"
                placeholder={`Long-term goal ${index + 1} (optional)`}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )

  const renderStep4 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div>
        <h3 className="text-lg font-semibold text-monk-700 mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Screen Time Goal
        </h3>
        <p className="text-gray-600 mb-6">
          How much screen time would you like to limit yourself to daily? This helps balance digital wellness with productivity.
        </p>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Daily Screen Time Goal
          </label>
          <div className="space-y-4">
            <input
              type="range"
              min="60"
              max="960"
              step="30"
              value={formData.dailyScreenTimeGoal}
              onChange={(e) => updateFormData('dailyScreenTimeGoal', parseInt(e.target.value))}
              className="w-full"
            />
            <div className="text-center">
              <div className="text-3xl font-bold text-monk-600">
                {Math.floor(formData.dailyScreenTimeGoal / 60)}h {formData.dailyScreenTimeGoal % 60}m
              </div>
              <div className="text-sm text-gray-500">per day</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-4">
            {[
              { hours: 4, label: 'Minimal' },
              { hours: 6, label: 'Moderate' },
              { hours: 8, label: 'Standard' }
            ].map((preset) => (
              <motion.button
                key={preset.hours}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => updateFormData('dailyScreenTimeGoal', preset.hours * 60)}
                className={`p-3 rounded-lg font-medium transition-all ${
                  formData.dailyScreenTimeGoal === preset.hours * 60
                    ? 'bg-monk-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <div className="font-bold">{preset.hours}h</div>
                <div className="text-xs">{preset.label}</div>
              </motion.button>
            ))}
          </div>
        </div>

        <div className="bg-zen-50 p-4 rounded-lg mt-6">
          <h4 className="font-semibold text-zen-700 mb-2">Ready to Begin!</h4>
          <p className="text-sm text-gray-600">
            Your monk journey is about to start. You'll earn experience through focused work sessions and completing goals. Let's build balanced productivity habits together!
          </p>
        </div>
      </div>
    </motion.div>
  )

  return (
    <div className="w-full max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="monk-card"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-monk-700 mb-2">Join the Monks</h2>
          <p className="text-gray-600">Start your balanced productivity journey</p>
          
          {/* Progress Indicator */}
          <div className="flex justify-center mt-4">
            <div className="flex space-x-2">
              {[1, 2, 3, 4].map((stepNum) => (
                <div
                  key={stepNum}
                  className={`w-3 h-3 rounded-full transition-all ${
                    stepNum <= step ? 'bg-monk-500' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">Step {step} of 4</p>
        </div>

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6"
          >
            {error}
          </motion.div>
        )}

        {/* Form Steps */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
            {step === 4 && renderStep4()}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex gap-3">
            {step > 1 && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={handleBack}
                className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
              >
                <ChevronLeft size={20} />
                Back
              </motion.button>
            )}

            {step < 4 ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={handleNext}
                className="flex-1 monk-button flex items-center justify-center gap-2"
              >
                Next
                <ChevronRight size={20} />
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 zen-button flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <UserPlus size={20} />
                )}
                {loading ? 'Creating Account...' : 'Start Journey'}
              </motion.button>
            )}
          </div>

          {/* Switch to Login */}
          {step === 1 && (
            <div className="text-center">
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-monk-600 hover:text-monk-700 font-medium"
              >
                Already have an account? Sign in
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}