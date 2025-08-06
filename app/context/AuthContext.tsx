'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { User, AuthContextType, RegisterData, Goal } from '../types/user'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing user session on app load
    const savedUser = localStorage.getItem('monkUser')
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser)
        // Convert date strings back to Date objects
        userData.createdAt = new Date(userData.createdAt)
        userData.updatedAt = new Date(userData.updatedAt)
        setUser(userData)
      } catch (error) {
        console.error('Error parsing saved user data:', error)
        localStorage.removeItem('monkUser')
      }
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true)
    try {
      // In a real app, this would be an API call
      // For now, we'll check localStorage for registered users
      const users = JSON.parse(localStorage.getItem('monkUsers') || '[]')
      const foundUser = users.find((u: any) => u.email === email)
      
      if (foundUser && foundUser.password === password) {
        // Remove password from user object before setting state
        const { password: _, ...userWithoutPassword } = foundUser
        userWithoutPassword.createdAt = new Date(userWithoutPassword.createdAt)
        userWithoutPassword.updatedAt = new Date(userWithoutPassword.updatedAt)
        
        setUser(userWithoutPassword)
        localStorage.setItem('monkUser', JSON.stringify(userWithoutPassword))
        setLoading(false)
        return true
      }
      
      setLoading(false)
      return false
    } catch (error) {
      console.error('Login error:', error)
      setLoading(false)
      return false
    }
  }

  const register = async (userData: RegisterData): Promise<boolean> => {
    setLoading(true)
    try {
      // Check if user already exists
      const users = JSON.parse(localStorage.getItem('monkUsers') || '[]')
      const existingUser = users.find((u: any) => u.email === userData.email)
      
      if (existingUser) {
        setLoading(false)
        return false // User already exists
      }

      // Create new user
      const newUser: User = {
        id: uuidv4(),
        email: userData.email,
        name: userData.name,
        country: userData.country,
        isEmailConfirmed: false, // Will be true after email confirmation
        createdAt: new Date(),
        updatedAt: new Date(),
        level: 1,
        experience: 0,
        totalMinutes: 0,
        goalsCompleted: 0,
        dailyScreenTimeGoal: userData.dailyScreenTimeGoal,
        currentScreenTime: 0,
      }

      // Save user with password to users array
      const userWithPassword = { ...newUser, password: userData.password }
      users.push(userWithPassword)
      localStorage.setItem('monkUsers', JSON.stringify(users))

      // Create initial goals
      const goals: Goal[] = []
      
      // Add short-term goals
      userData.shortTermGoals.forEach(title => {
        if (title.trim()) {
          goals.push({
            id: uuidv4(),
            userId: newUser.id,
            title: title.trim(),
            type: 'short',
            completed: false,
            createdAt: new Date()
          })
        }
      })

      // Add medium-term goals
      userData.mediumTermGoals.forEach(title => {
        if (title.trim()) {
          goals.push({
            id: uuidv4(),
            userId: newUser.id,
            title: title.trim(),
            type: 'medium',
            completed: false,
            createdAt: new Date()
          })
        }
      })

      // Add long-term goals
      userData.longTermGoals.forEach(title => {
        if (title.trim()) {
          goals.push({
            id: uuidv4(),
            userId: newUser.id,
            title: title.trim(),
            type: 'long',
            completed: false,
            createdAt: new Date()
          })
        }
      })

      // Save goals
      const existingGoals = JSON.parse(localStorage.getItem('monkGoals') || '[]')
      localStorage.setItem('monkGoals', JSON.stringify([...existingGoals, ...goals]))

      // Set user as logged in
      setUser(newUser)
      localStorage.setItem('monkUser', JSON.stringify(newUser))
      
      setLoading(false)
      return true
    } catch (error) {
      console.error('Registration error:', error)
      setLoading(false)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('monkUser')
  }

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}