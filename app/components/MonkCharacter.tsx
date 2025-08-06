'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface MonkCharacterProps {
  level: number
  experience: number
}

export default function MonkCharacter({ level, experience }: MonkCharacterProps) {
  const [isAnimating, setIsAnimating] = useState(false)

  // Trigger animation when level changes
  useEffect(() => {
    setIsAnimating(true)
    const timer = setTimeout(() => setIsAnimating(false), 1000)
    return () => clearTimeout(timer)
  }, [level])

  const getMonkAppearance = (level: number) => {
    if (level >= 20) return { robe: 'from-yellow-400 to-yellow-600', aura: 'shadow-yellow-400/50' }
    if (level >= 15) return { robe: 'from-purple-400 to-purple-600', aura: 'shadow-purple-400/50' }
    if (level >= 10) return { robe: 'from-blue-400 to-blue-600', aura: 'shadow-blue-400/50' }
    if (level >= 5) return { robe: 'from-green-400 to-green-600', aura: 'shadow-green-400/50' }
    return { robe: 'from-monk-400 to-monk-600', aura: 'shadow-monk-400/50' }
  }

  const appearance = getMonkAppearance(level)

  return (
    <div className="relative flex justify-center items-center h-64">
      {/* Meditation Platform */}
      <div className="absolute bottom-0 w-32 h-8 bg-gradient-to-b from-gray-300 to-gray-400 rounded-full opacity-60" />
      
      {/* Aura Effect */}
      <motion.div
        animate={isAnimating ? { scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] } : {}}
        className={`absolute w-40 h-40 rounded-full bg-gradient-to-r ${appearance.robe} opacity-20 blur-xl ${appearance.aura}`}
      />

      {/* Monk Character */}
      <motion.div
        animate={{ 
          y: [-5, 5, -5],
          rotate: isAnimating ? [0, 5, -5, 0] : 0
        }}
        transition={{ 
          y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
          rotate: { duration: 1, ease: "easeInOut" }
        }}
        className="relative z-10"
      >
        {/* Head */}
        <div className="w-16 h-16 bg-gradient-to-b from-amber-100 to-amber-200 rounded-full mx-auto mb-2 relative">
          {/* Eyes */}
          <div className="absolute top-5 left-4 w-2 h-1 bg-gray-800 rounded-full" />
          <div className="absolute top-5 right-4 w-2 h-1 bg-gray-800 rounded-full" />
          {/* Peaceful smile */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-4 h-2 border-b-2 border-gray-600 rounded-full" />
        </div>

        {/* Body/Robe */}
        <motion.div
          animate={isAnimating ? { scale: [1, 1.1, 1] } : {}}
          className={`w-24 h-32 bg-gradient-to-b ${appearance.robe} rounded-t-full relative mx-auto`}
        >
          {/* Arms in meditation pose */}
          <div className="absolute -left-2 top-8 w-8 h-16 bg-gradient-to-b from-amber-100 to-amber-200 rounded-full transform -rotate-12" />
          <div className="absolute -right-2 top-8 w-8 h-16 bg-gradient-to-b from-amber-100 to-amber-200 rounded-full transform rotate-12" />
          
          {/* Meditation hands */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gradient-to-b from-amber-100 to-amber-200 rounded-full" />
        </motion.div>

        {/* Level Badge */}
        <motion.div
          animate={isAnimating ? { scale: [1, 1.3, 1], rotate: [0, 360] } : {}}
          className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-monk-500 to-monk-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg"
        >
          {level}
        </motion.div>

        {/* Floating Particles */}
        {isAnimating && (
          <>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                animate={{ 
                  opacity: [0, 1, 0], 
                  scale: [0, 1, 0],
                  x: [0, (Math.random() - 0.5) * 100],
                  y: [0, -50 - Math.random() * 30]
                }}
                transition={{ duration: 1, delay: i * 0.1 }}
                className={`absolute w-2 h-2 bg-gradient-to-r ${appearance.robe} rounded-full`}
                style={{
                  left: `${50 + (Math.random() - 0.5) * 20}%`,
                  top: `${50 + (Math.random() - 0.5) * 20}%`
                }}
              />
            ))}
          </>
        )}
      </motion.div>

      {/* Level Up Text */}
      {isAnimating && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.5 }}
          animate={{ opacity: 1, y: -20, scale: 1 }}
          exit={{ opacity: 0, y: -40 }}
          className="absolute top-0 left-1/2 transform -translate-x-1/2 text-2xl font-bold text-monk-600"
        >
          Level Up!
        </motion.div>
      )}
    </div>
  )
}