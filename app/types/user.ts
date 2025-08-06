export interface User {
  id: string
  email: string
  name: string
  country: string
  isEmailConfirmed: boolean
  createdAt: Date
  updatedAt: Date
  
  // Monk stats
  level: number
  experience: number
  totalMinutes: number
  goalsCompleted: number
  
  // Screen time tracking
  dailyScreenTimeGoal?: number // in minutes
  currentScreenTime?: number
  
  // Customization (placeholder for future)
  monkCustomization?: {
    robeColor?: string
    accessories?: string[]
  }
}

export interface Goal {
  id: string
  userId: string
  title: string
  type: 'short' | 'medium' | 'long'
  completed: boolean
  createdAt: Date
  completedAt?: Date
}

export interface Friend {
  id: string
  userId: string
  friendId: string
  status: 'pending' | 'accepted' | 'blocked'
  createdAt: Date
}

export interface FocusSession {
  id: string
  userId: string
  activityType: 'work' | 'study' | 'exercise' | 'break'
  duration: number // in minutes
  completedAt: Date
}

export interface Country {
  code: string
  name: string
  flag: string
}

export interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (userData: RegisterData) => Promise<boolean>
  logout: () => void
  loading: boolean
}

export interface RegisterData {
  email: string
  password: string
  name: string
  country: string
  shortTermGoals: string[]
  mediumTermGoals: string[]
  longTermGoals: string[]
  dailyScreenTimeGoal: number
}