export interface Producer {
  id: string
  name: string
  email?: string
  phone?: string
  company?: string
  createdAt: Date
}

export interface EventDocument {
  id: string
  name: string
  type: "contract" | "rider" | "invoice" | "other"
  url: string
  uploadedAt: Date
}

export interface CalendarEvent {
  id: string
  title: string
  type: "meeting" | "event" | "gig"
  date: Date
  startTime: string
  endTime: string
  location?: string
  description?: string
  producerId?: string
  fee?: number
  status: "confirmed" | "pending" | "cancelled"
  documents: EventDocument[]
  createdAt: Date
}

export interface AvailabilitySlot {
  id: string
  date: Date
  startTime: string
  endTime: string
  available: boolean
}
