"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Edit3, Trash2 } from "lucide-react"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import type { Note } from "@/lib/types"

export default function NotasFixas() {
  const [notes, setNotes] = useLocalStorage<Note[]>("notes", [])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState("")

  const addNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      content: "Nova nota...",
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setNotes([...notes, newNote])
    setEditingId(newNote.id)
    setEditContent(newNote.content)
  }

  const saveNote = (id: string) => {
    setNotes(notes.map((note) => (note.id === id ? { ...note, content: editContent, updatedAt: new Date() } : note)))
    setEditingId(null)
    setEditContent("")
  }

  const deleteNote = (id: string) => {
    setNotes(notes.filter((note) => note.id !== id))
  }

  const startEdit = (note: Note) => {
    setEditingId(note.id)
    setEditContent(note.content)
  }

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-white font-semibold">Notas Fixas</CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={addNote}
          className="text-purple-400 hover:text-purple-300 hover:bg-purple-900/20"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-2">
        {notes.length === 0 ? (
          <p className="text-gray-400 text-sm italic">Nenhuma nota ainda. Clique no + para adicionar.</p>
        ) : (
          notes.map((note) => (
            <div key={note.id} className="group relative">
              {editingId === note.id ? (
                <div className="space-y-2">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full p-2 bg-slate-700 border border-slate-600 rounded text-white text-sm resize-none"
                    rows={2}
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => saveNote(note.id)} className="bg-purple-600 hover:bg-purple-700">
                      Salvar
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditingId(null)} className="text-gray-400">
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="p-2 bg-slate-700/50 rounded text-sm text-gray-300 group-hover:bg-slate-700/70">
                  {note.content}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => startEdit(note)}
                      className="h-6 w-6 text-gray-400 hover:text-purple-400"
                    >
                      <Edit3 className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteNote(note.id)}
                      className="h-6 w-6 text-gray-400 hover:text-red-400"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
