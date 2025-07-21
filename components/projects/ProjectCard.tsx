"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { FolderOpen, Calendar, Users, FileText, Instagram } from "lucide-react"
import type { CareerProject } from "@/lib/project-types"

interface ProjectCardProps {
  project: CareerProject
  onClick: () => void
}

const priorityColors = {
  low: "bg-green-500",
  medium: "bg-yellow-500",
  high: "bg-red-500",
}

const statusColors = {
  planning: "bg-blue-500",
  "in-progress": "bg-purple-500",
  review: "bg-orange-500",
  completed: "bg-green-500",
}

const categoryIcons = {
  branding: Users,
  career: FolderOpen,
  dj: "🎵",
  instagram: Instagram,
}

export default function ProjectCard({ project, onClick }: ProjectCardProps) {
  const Icon =
    typeof categoryIcons[project.category] === "string"
      ? () => <span className="text-lg">{categoryIcons[project.category]}</span>
      : categoryIcons[project.category]

  return (
    <Card
      className="bg-slate-800 border-slate-700 hover:bg-slate-750 cursor-pointer transition-all duration-200 hover:border-purple-500/50"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Icon className="h-5 w-5 text-purple-400" />
            <h3 className="text-white font-semibold text-lg">{project.title}</h3>
          </div>
          <div className="flex gap-2">
            <Badge className={`${priorityColors[project.priority]} text-white text-xs`}>
              {project.priority.toUpperCase()}
            </Badge>
            <Badge className={`${statusColors[project.status]} text-white text-xs`}>
              {project.status.toUpperCase()}
            </Badge>
          </div>
        </div>
        <p className="text-gray-400 text-sm mt-2">{project.description}</p>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400">Progresso</span>
            <span className="text-purple-400 font-medium">{Math.round(project.progress)}%</span>
          </div>
          <Progress value={project.progress} className="h-2" />
        </div>

        <div className="flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <FileText className="h-3 w-3" />
              <span>{project.tasks.length} tarefas</span>
            </div>
            <div className="flex items-center gap-1">
              <FolderOpen className="h-3 w-3" />
              <span>{project.documents?.length || 0} docs</span>
            </div>
            {project.category === "instagram" && (
              <div className="flex items-center gap-1">
                <Instagram className="h-3 w-3" />
                <span>{project.instagramPosts?.length || 0} posts</span>
              </div>
            )}
          </div>
          {project.deadline && (
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{new Date(project.deadline).toLocaleDateString("pt-BR")}</span>
            </div>
          )}
        </div>

        {project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {project.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs border-slate-600 text-gray-400">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
