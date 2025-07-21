export interface UserProfile {
  id: string
  name: string
  email: string
  phone: string
  bio: string
  location: string
  avatar: string
  company: string
  position: string
  website: string
  instagram: string
  linkedin: string
  createdAt: Date
  updatedAt: Date
}

export interface UserSettings {
  notifications: {
    push: boolean
    email: boolean
  }
  preferences: {
    language: string
    timezone: string
  }
}
