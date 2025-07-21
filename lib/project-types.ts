import type { Project } from "./types"

export interface ActionPlan {
  id: string
  title: string
  month: string
  tasks: ActionTask[]
  createdAt: Date
  updatedAt: Date
}

export interface ActionTask {
  id: string
  title: string
  completed: boolean
  priority: "low" | "medium" | "high"
  dueDate?: Date
  category: "networking" | "learning" | "branding" | "career" | "instagram" | "other"
}

export interface PersonalBranding {
  mission: string
  vision: string
  values: string
  updatedAt: Date
}

export interface ProjectDocument {
  id: string
  name: string
  type: string
  size: number
  url: string
  uploadedAt: Date
  projectId?: string
}

export interface InstagramPost {
  id: string
  title: string
  description: string
  imageUrl?: string
  status: "draft" | "pending" | "approved" | "rejected" | "published"
  scheduledDate?: Date
  hashtags: string[]
  createdAt: Date
  updatedAt: Date
  feedback?: string
}

export interface CareerProject extends Project {
  category: "branding" | "career" | "dj" | "instagram"
  priority: "low" | "medium" | "high"
  status: "planning" | "in-progress" | "review" | "completed"
  documents: ProjectDocument[]
  tags: string[]
  instagramPosts?: InstagramPost[]
}
