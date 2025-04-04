export interface Task {
  id: string
  title: string
  description?: string
  priority: number // 1-5
  deadline: string // ISO date string
  tags: string[]
  completed: boolean
  dependencies?: string[] // IDs of tasks that must be completed first
  assignedTo?: string // User ID
}

export interface TimelineTask {
  id: string
  title: string
  startTime: string // ISO date string
  endTime: string // ISO date string
  color: string
}

export interface TeamMember {
  id: string
  name: string
  avatar: string
  online: boolean
  currentTask?: string
}

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: "admin" | "editor" | "viewer"
  preferences: {
    theme: "light" | "dark" | "system"
    notifications: {
      email: boolean
      push: boolean
      sms: boolean
    }
    productiveHours: {
      start: number // 0-23
      end: number // 0-23
    }
  }
}

