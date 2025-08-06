'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import LoginForm from '../components/auth/LoginForm'
import RegisterForm from '../components/auth/RegisterForm'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-monk-200 rounded-full opacity-20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-zen-200 rounded-full opacity-20 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-lg">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-monk-600 to-zen-600 bg-clip-text text-transparent mb-4">
            🧘 Monk
          </h1>
          <p className="text-gray-600">Balance your productivity, level up your life</p>
        </motion.div>

        {/* Auth Forms */}
        <motion.div
          key={isLogin ? 'login' : 'register'}
          initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {isLogin ? (
            <LoginForm onSwitchToRegister={() => setIsLogin(false)} />
          ) : (
            <RegisterForm onSwitchToLogin={() => setIsLogin(true)} />
          )}
        </motion.div>

        {/* Demo Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <div className="monk-card bg-monk-50 border border-monk-200">
            <h4 className="font-semibold text-monk-700 mb-2">Demo Mode</h4>
            <p className="text-sm text-gray-600">
              This is a demo version. Data is stored locally in your browser. 
              Email confirmation is simulated for demonstration purposes.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}