"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, ArrowLeft, Filter } from "lucide-react"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import ProjectCard from "@/components/projects/ProjectCard"
import PersonalBrandingSection from "@/components/projects/PersonalBrandingSection"
import ActionPlanSection from "@/components/projects/ActionPlanSection"
import DocumentsSection from "@/components/projects/DocumentsSection"
import InstagramSection from "@/components/projects/InstagramSection"
import type { CareerProject } from "@/lib/project-types"

export default function ProjetosPage() {
  const [projects, setProjects] = useLocalStorage<CareerProject[]>("careerProjects", [
    {
      id: "1",
      title: "Lançamento EP DJ Luna",
      description: "Estratégia completa para lançamento do novo EP",
      progress: 15,
      category: "dj",
      priority: "high",
      status: "planning",
      tasks: [
        { id: "1", title: "Definir identidade visual", completed: false, priority: "high" },
        { id: "2", title: "Criar material promocional", completed: false, priority: "medium" },
        { id: "3", title: "Planejar estratégia de lançamento", completed: false, priority: "high" },
      ],
      documents: [],
      tags: ["música", "branding", "marketing"],
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
    },
    {
      id: "2",
      title: "Desenvolvimento de Carreira Tech",
      description: "Plano estratégico para crescimento profissional em tecnologia",
      progress: 45,
      category: "career",
      priority: "high",
      status: "in-progress",
      tasks: [
        { id: "4", title: "Atualizar portfólio", completed: true, priority: "high" },
        { id: "5", title: "Fazer networking", completed: false, priority: "medium" },
        { id: "6", title: "Estudar novas tecnologias", completed: false, priority: "medium" },
      ],
      documents: [],
      tags: ["carreira", "tecnologia", "networking"],
    },
    {
      id: "3",
      title: "Estratégia de Conteúdo Instagram",
      description: "Planejamento e criação de conteúdo para crescimento no Instagram",
      progress: 25,
      category: "instagram",
      priority: "medium",
      status: "in-progress",
      tasks: [
        { id: "7", title: "Definir linha editorial", completed: true, priority: "high" },
        { id: "8", title: "Criar calendário de posts", completed: false, priority: "medium" },
        { id: "9", title: "Produzir conteúdo visual", completed: false, priority: "high" },
      ],
      documents: [],
      tags: ["instagram", "conteúdo", "social media"],
      instagramPosts: [],
    },
  ])

  const [selectedProject, setSelectedProject] = useState<CareerProject | null>(null)
  const [filter, setFilter] = useState<"all" | "branding" | "career" | "dj" | "instagram">("all")
  const [showCreateModal, setShowCreateModal] = useState(false)

  const filteredProjects = filter === "all" ? projects : projects.filter((project) => project.category === filter)

  const createProject = (projectData: Partial<CareerProject>) => {
    const newProject: CareerProject = {
      id: Date.now().toString(),
      title: projectData.title || "Novo Projeto",
      description: projectData.description || "Descrição do projeto",
      progress: 0,
      category: projectData.category || "branding",
      priority: projectData.priority || "medium",
      status: "planning",
      tasks: [],
      documents: [],
      tags: projectData.tags || [],
      deadline: projectData.deadline,
      instagramPosts: projectData.category === "instagram" ? [] : undefined,
    }

    setProjects([...projects, newProject])
    setShowCreateModal(false)
  }

  if (selectedProject) {
    return (
      <div className="min-h-screen bg-slate-900 p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" onClick={() => setSelectedProject(null)} className="text-gray-400 hover:text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <h1 className="text-2xl font-bold text-white">{selectedProject.title}</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <PersonalBrandingSection />
              <ActionPlanSection />
              {selectedProject.category === "instagram" && <InstagramSection />}
            </div>
            <div>
              <DocumentsSection />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">Projetos & Tarefas</h1>
            <p className="text-gray-400">Gerencie seus projetos de carreira e branding</p>
          </div>
          <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => setShowCreateModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Projeto
          </Button>
        </div>

        {/* Filtros */}
        <div className="flex items-center gap-2 mb-6">
          <Filter className="h-4 w-4 text-gray-400" />
          <div className="flex gap-2 flex-wrap">
            {[
              { key: "all", label: "Todos", count: projects.length },
              { key: "branding", label: "Branding", count: projects.filter((p) => p.category === "branding").length },
              { key: "career", label: "Carreira", count: projects.filter((p) => p.category === "career").length },
              { key: "dj", label: "DJ/Música", count: projects.filter((p) => p.category === "dj").length },
              {
                key: "instagram",
                label: "Instagram",
                count: projects.filter((p) => p.category === "instagram").length,
              },
            ].map((filterOption) => (
              <Button
                key={filterOption.key}
                variant={filter === filterOption.key ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(filterOption.key as any)}
                className={
                  filter === filterOption.key
                    ? "bg-purple-600 hover:bg-purple-700 text-white border-purple-600"
                    : "bg-slate-800 border-slate-600 text-gray-300 hover:bg-slate-700 hover:text-white hover:border-slate-500"
                }
              >
                {filterOption.label}
                {filterOption.count > 0 && (
                  <Badge
                    variant="secondary"
                    className={`ml-2 ${
                      filter === filterOption.key ? "bg-purple-800 text-purple-100" : "bg-slate-700 text-gray-300"
                    }`}
                  >
                    {filterOption.count}
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </div>

        {/* Grid de Projetos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} onClick={() => setSelectedProject(project)} />
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-white mb-2">Nenhum projeto encontrado</h3>
            <p className="text-gray-400 mb-4">
              {filter === "all" ? "Comece criando seu primeiro projeto" : `Nenhum projeto na categoria "${filter}"`}
            </p>
            <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => setShowCreateModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Criar Projeto
            </Button>
          </div>
        )}

        {/* Estatísticas */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <div className="text-2xl font-bold text-white">{projects.length}</div>
            <div className="text-sm text-gray-400">Total de Projetos</div>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-400">
              {projects.filter((p) => p.status === "completed").length}
            </div>
            <div className="text-sm text-gray-400">Concluídos</div>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-400">
              {projects.filter((p) => p.status === "in-progress").length}
            </div>
            <div className="text-sm text-gray-400">Em Andamento</div>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <div className="text-2xl font-bold text-pink-400">
              {projects.filter((p) => p.category === "instagram").length}
            </div>
            <div className="text-sm text-gray-400">Instagram</div>
          </div>
        </div>
      </div>

      {/* Modal de Criação de Projeto */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-white mb-4">Criar Novo Projeto</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                createProject({
                  title: formData.get("title") as string,
                  description: formData.get("description") as string,
                  category: formData.get("category") as any,
                  priority: formData.get("priority") as any,
                  tags:
                    (formData.get("tags") as string)
                      ?.split(",")
                      .map((tag) => tag.trim())
                      .filter(Boolean) || [],
                })
              }}
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Título</label>
                  <input
                    name="title"
                    type="text"
                    required
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Nome do projeto"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Descrição</label>
                  <textarea
                    name="description"
                    rows={3}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Descrição do projeto"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Categoria</label>
                  <select
                    name="category"
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="branding">Branding</option>
                    <option value="career">Carreira</option>
                    <option value="dj">DJ/Música</option>
                    <option value="instagram">Instagram</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Prioridade</label>
                  <select
                    name="priority"
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="low">Baixa</option>
                    <option value="medium">Média</option>
                    <option value="high">Alta</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Tags (separadas por vírgula)</label>
                  <input
                    name="tags"
                    type="text"
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="marketing, design, música"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 border-slate-600 text-gray-300 hover:bg-slate-700"
                >
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1 bg-purple-600 hover:bg-purple-700">
                  Criar Projeto
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
