"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Instagram, ImageIcon, Hash, Eye, Check, X, Clock } from "lucide-react"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import type { InstagramPost } from "@/lib/project-types"

export default function InstagramSection() {
  const [posts, setPosts] = useLocalStorage<InstagramPost[]>("instagramPosts", [])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedPost, setSelectedPost] = useState<InstagramPost | null>(null)
  const [newPost, setNewPost] = useState<Partial<InstagramPost>>({
    title: "",
    description: "",
    hashtags: [],
    status: "draft",
  })

  const handleCreatePost = () => {
    if (!newPost.title || !newPost.description) return

    const post: InstagramPost = {
      id: Date.now().toString(),
      title: newPost.title,
      description: newPost.description,
      hashtags: newPost.hashtags || [],
      status: "draft",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    setPosts([...posts, post])
    setNewPost({ title: "", description: "", hashtags: [], status: "draft" })
    setIsDialogOpen(false)
  }

  const handleStatusChange = (postId: string, newStatus: InstagramPost["status"]) => {
    setPosts(posts.map((post) => (post.id === postId ? { ...post, status: newStatus, updatedAt: new Date() } : post)))
  }

  const handleHashtagsChange = (value: string) => {
    const hashtags = value
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0)
    setNewPost({ ...newPost, hashtags })
  }

  const statusColors = {
    draft: "bg-gray-500",
    pending: "bg-yellow-500",
    approved: "bg-green-500",
    rejected: "bg-red-500",
    published: "bg-blue-500",
  }

  const statusIcons = {
    draft: Clock,
    pending: Eye,
    approved: Check,
    rejected: X,
    published: Instagram,
  }

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Instagram className="h-5 w-5 text-pink-500" />
            Gestão de Posts Instagram
          </CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-pink-600 hover:bg-pink-700">
                <Plus className="h-4 w-4 mr-2" />
                Nova Ideia
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Instagram className="h-5 w-5 text-pink-500" />
                  Nova Ideia de Post
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Título do Post</label>
                  <Input
                    placeholder="Ex: Dicas de produção musical"
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Descrição/Caption</label>
                  <Textarea
                    placeholder="Escreva a descrição do post..."
                    value={newPost.description}
                    onChange={(e) => setNewPost({ ...newPost, description: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white min-h-[100px]"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">
                    Hashtags (separadas por vírgula)
                  </label>
                  <Input
                    placeholder="#dj #music #producer #techno"
                    onChange={(e) => handleHashtagsChange(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    className="border-slate-600 text-gray-300 hover:bg-slate-700"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleCreatePost}
                    className="bg-pink-600 hover:bg-pink-700"
                    disabled={!newPost.title || !newPost.description}
                  >
                    Criar Ideia
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {posts.length === 0 ? (
          <div className="text-center py-8">
            <Instagram className="h-12 w-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400 mb-4">Nenhuma ideia de post criada ainda</p>
            <p className="text-sm text-gray-500">Comece criando sua primeira ideia de post!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => {
              const StatusIcon = statusIcons[post.status]
              return (
                <Card key={post.id} className="bg-slate-700 border-slate-600">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="text-white font-medium mb-1">{post.title}</h4>
                        <p className="text-gray-400 text-sm line-clamp-2">{post.description}</p>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Badge className={`${statusColors[post.status]} text-white text-xs`}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {post.status.toUpperCase()}
                        </Badge>
                      </div>
                    </div>

                    {post.hashtags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {post.hashtags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs border-pink-500 text-pink-400">
                            <Hash className="h-2 w-2 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-500">
                        Criado em {new Date(post.createdAt).toLocaleDateString("pt-BR")}
                      </div>
                      <div className="flex gap-2">
                        <Select
                          value={post.status}
                          onValueChange={(value: InstagramPost["status"]) => handleStatusChange(post.id, value)}
                        >
                          <SelectTrigger className="w-32 h-8 bg-slate-600 border-slate-500 text-white text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-700 border-slate-600">
                            <SelectItem value="draft" className="text-white">
                              Rascunho
                            </SelectItem>
                            <SelectItem value="pending" className="text-white">
                              Pendente
                            </SelectItem>
                            <SelectItem value="approved" className="text-white">
                              Aprovado
                            </SelectItem>
                            <SelectItem value="rejected" className="text-white">
                              Rejeitado
                            </SelectItem>
                            <SelectItem value="published" className="text-white">
                              Publicado
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-slate-600 text-gray-300 hover:bg-slate-600 bg-transparent"
                        >
                          <ImageIcon className="h-3 w-3 mr-1" />
                          Foto
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
