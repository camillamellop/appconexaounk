"use client"

import { useState, useEffect } from "react"
import AgendaHeader from "@/components/agenda/AgendaHeader"
import AgendaTabs from "@/components/agenda/AgendaTabs"
import CalendarView from "@/components/agenda/CalendarView"
import EventDetails from "@/components/agenda/EventDetails"
import ProducersSection from "@/components/agenda/ProducersSection"
import GigDetailsSection from "@/components/agenda/GigDetailsSection"
import DocumentsSection from "@/components/agenda/DocumentsSection"
import BottomNavigation from "@/components/layout/BottomNavigation"
import { useAgendaEvents, useAllUsers } from "@/hooks/useSupabase"
import { isAdmin } from "@/lib/auth"
import type { CalendarEvent, Producer, EventDocument } from "@/lib/agenda-types"

export default function AgendaPage() {
  const [activeTab, setActiveTab] = useState("calendar")
  const [producers, setProducers] = useState<Producer[]>([])
  const [documents, setDocuments] = useState<EventDocument[]>([])
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | undefined>()
  const [showEventForm, setShowEventForm] = useState(false)
  const [selectedGig, setSelectedGig] = useState<CalendarEvent | undefined>()

  const { events, loading, addEvent, updateEvent, deleteEvent } = useAgendaEvents()
  const { users } = useAllUsers()
  const userIsAdmin = isAdmin()

  // Load producers and documents from localStorage (legacy support)
  useEffect(() => {
    const savedProducers = localStorage.getItem("agenda-producers")
    const savedDocuments = localStorage.getItem("agenda-documents")

    if (savedProducers) {
      const parsedProducers = JSON.parse(savedProducers).map((producer: any) => ({
        ...producer,
        createdAt: new Date(producer.createdAt),
      }))
      setProducers(parsedProducers)
    }

    if (savedDocuments) {
      const parsedDocuments = JSON.parse(savedDocuments).map((doc: any) => ({
        ...doc,
        uploadedAt: new Date(doc.uploadedAt),
      }))
      setDocuments(parsedDocuments)
    }
  }, [])

  // Save to localStorage (legacy support)
  const saveProducers = (newProducers: Producer[]) => {
    setProducers(newProducers)
    localStorage.setItem("agenda-producers", JSON.stringify(newProducers))
  }

  const saveDocuments = (newDocuments: EventDocument[]) => {
    setDocuments(newDocuments)
    localStorage.setItem("agenda-documents", JSON.stringify(newDocuments))
  }

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event)
    setShowEventForm(true)
    if (event.type === "gig") {
      setSelectedGig(event)
    }
  }

  const handleAddEvent = (date: Date) => {
    setSelectedEvent(undefined)
    setShowEventForm(true)
  }

  const handleSaveEvent = async (eventData: Partial<CalendarEvent>) => {
    if (selectedEvent) {
      // Update existing event
      await updateEvent(selectedEvent.id, eventData)
    } else {
      // Create new event
      await addEvent({
        ...eventData,
        documents: [],
      } as Omit<CalendarEvent, "id" | "created_at">)
    }
    setShowEventForm(false)
    setSelectedEvent(undefined)
  }

  const handleAddProducer = (producerData: Omit<Producer, "id" | "createdAt">) => {
    const newProducer: Producer = {
      id: Date.now().toString(),
      ...producerData,
      createdAt: new Date(),
    }
    saveProducers([...producers, newProducer])
  }

  const handleAddDocument = (documentData: Omit<EventDocument, "id" | "uploadedAt">) => {
    const newDocument: EventDocument = {
      id: Date.now().toString(),
      ...documentData,
      uploadedAt: new Date(),
    }
    saveDocuments([...documents, newDocument])
  }

  const handleDeleteDocument = (documentId: string) => {
    const updatedDocuments = documents.filter((doc) => doc.id !== documentId)
    saveDocuments(updatedDocuments)
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "calendar":
        return (
          <div className="space-y-6">
            {/* Indicador para admin */}
            {userIsAdmin && (
              <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
                <h3 className="text-red-400 font-medium mb-2">👑 Modo Administrador</h3>
                <p className="text-red-300 text-sm">
                  Você está vendo a agenda de todos os DJs. Use o filtro acima do calendário para visualizar um DJ
                  específico.
                </p>
              </div>
            )}

            <CalendarView events={events} onEventClick={handleEventClick} onAddEvent={handleAddEvent} users={users} />

            {showEventForm && (
              <EventDetails
                event={selectedEvent}
                producers={producers}
                onSave={handleSaveEvent}
                onClose={() => {
                  setShowEventForm(false)
                  setSelectedEvent(undefined)
                }}
              />
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ProducersSection producers={producers} onAddProducer={handleAddProducer} />

              <GigDetailsSection selectedGig={selectedGig} producers={producers} />
            </div>

            <DocumentsSection
              documents={documents}
              onAddDocument={handleAddDocument}
              onDeleteDocument={handleDeleteDocument}
            />
          </div>
        )

      case "tasks":
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-white mb-4">Tasks</h2>
            <p className="text-slate-400">Funcionalidade em desenvolvimento...</p>
          </div>
        )

      case "availability":
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-white mb-4">Availability</h2>
            <p className="text-slate-400">Funcionalidade em desenvolvimento...</p>
          </div>
        )

      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white">Carregando agenda...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <AgendaHeader />
      <AgendaTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="px-4 md:px-6 py-6 pb-20">
        <div className="max-w-7xl mx-auto">{renderTabContent()}</div>
      </main>

      <BottomNavigation />
    </div>
  )
}
