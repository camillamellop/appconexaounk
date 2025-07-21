export interface User {
  id: string
  name: string
  avatar?: string
  email: string
}

export interface Note {
  id: string
  content: string
  createdAt: Date
  updatedAt: Date
}

export interface Event {
  id: string
  title: string
  time: string
  color: "purple" | "pink" | "blue" | "green" | "yellow"
  completed?: boolean
}

export interface Goal {
  id: string
  title: string
  description: string
  progress: number
  target: number
  unit: string
}

export interface Task {
  id: string
  title: string
  completed: boolean
  priority: "low" | "medium" | "high"
}

export interface Project {
  id: string
  title: string
  description: string
  progress: number
  tasks: Task[]
  deadline?: Date
}
