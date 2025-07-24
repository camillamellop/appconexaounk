// components/admin/UserManagement.tsx
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Search, Plus, Edit, Trash, MoreHorizontal, UserCheck, UserX } from "lucide-react"

interface User {
  id: number
  nome: string
  email: string
  tipo: string
  ativo: boolean
  created_at: string
}

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      // Simular dados de usuários
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setUsers([
        { id: 1, nome: "Admin UNK", email: "admin@unk.com", tipo: "admin", ativo: true, created_at: "2024-01-15" },
        { id: 2, nome: "DJ Liam", email: "liam@unk.com", tipo: "dj", ativo: true, created_at: "2024-01-20" },
        { id: 3, nome: "Producer Jack", email: "jack@unk.com", tipo: "produtor", ativo: true, created_at: "2024-01-25" },
        { id: 4, nome: "DJ Sarah", email: "sarah@unk.com", tipo: "dj", ativo: false, created_at: "2024-02-01" },
      ])
    } catch (error) {
      console.error("Erro ao buscar usuários:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter(user =>
    user.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getUserTypeColor = (tipo: string) => {
    switch (tipo) {
      case 'admin': return 'bg-red-600'
      case 'dj': return 'bg-purple-600'
      case 'produtor': return 'bg-blue-600'
      default: return 'bg-gray-600'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white">Carregando usuários...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header com busca */}
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar usuários..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-700 border-slate-600 text-white"
          />
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700">
          <Plus className="h-4 w-4 mr-2" />
          Novo Usuário
        </Button>
      </div>

      {/* Stats rápidas */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-slate-700 border-slate-600">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{users.length}</div>
              <div className="text-sm text-gray-400">Total</div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-700 border-slate-600">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{users.filter(u => u.ativo).length}</div>
              <div className="text-sm text-gray-400">Ativos</div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-700 border-slate-600">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">{users.filter(u => u.tipo === 'dj').length}</div>
              <div className="text-sm text-gray-400">DJs</div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-700 border-slate-600">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{users.filter(u => u.tipo === 'produtor').length}</div>
              <div className="text-sm text-gray-400">Produtores</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de usuários */}
      <div className="space-y-4">
        {filteredUsers.map((user) => (
          <Card key={user.id} className="bg-slate-700 border-slate-600">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-slate-600 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-white font-medium">{user.nome}</h3>
                      <Badge className={getUserTypeColor(user.tipo)}>
                        {user.tipo}
                      </Badge>
                      {user.ativo ? (
                        <Badge className="bg-green-600">Ativo</Badge>
                      ) : (
                        <Badge variant="destructive">Inativo</Badge>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm">{user.email}</p>
                    <p className="text-gray-500 text-xs">Criado em {new Date(user.created_at).toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="outline" className="border-slate-600">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant={user.ativo ? "destructive" : "default"}
                    className={user.ativo ? "" : "bg-green-600 hover:bg-green-700"}
                  >
                    {user.ativo ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                  </Button>
                  <Button size="sm" variant="outline" className="border-slate-600">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

// components/admin/Analytics.tsx
export function Analytics() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-slate-700 border-slate-600">
          <CardHeader>
            <CardTitle className="text-white text-sm">Usuários Ativos (7 dias)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white mb-2">127</div>
            <div className="text-sm text-green-400">+12% vs semana anterior</div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-700 border-slate-600">
          <CardHeader>
            <CardTitle className="text-white text-sm">Projetos Criados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white mb-2">43</div>
            <div className="text-sm text-blue-400">Este mês</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="text-center text-gray-400 py-8">
        <p>Gráficos detalhados serão implementados aqui</p>
      </div>
    </div>
  )
}

// components/admin/SystemSettings.tsx
export function SystemSettings() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-slate-700 border-slate-600">
          <CardHeader>
            <CardTitle className="text-white text-sm">Configurações Gerais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-white">Registros Públicos</span>
              <Button size="sm" variant="outline" className="border-slate-600">Configurar</Button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white">Notificações Email</span>
              <Button size="sm" variant="outline" className="border-slate-600">Configurar</Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-700 border-slate-600">
          <CardHeader>
            <CardTitle className="text-white text-sm">Manutenção</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full bg-blue-600 hover:bg-blue-700">Executar Backup</Button>
            <Button className="w-full bg-yellow-600 hover:bg-yellow-700">Limpar Cache</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// components/admin/SecuritySettings.tsx
export function SecuritySettings() {
  return (
    <div className="space-y-6">
      <Card className="bg-slate-700 border-slate-600">
        <CardHeader>
          <CardTitle className="text-white text-sm">Logs de Segurança</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-slate-600 rounded">
              <span className="text-white text-sm">Login Admin - 14:30</span>
              <Badge className="bg-green-600">Sucesso</Badge>
            </div>
            <div className="flex items-center justify-between p-2 bg-slate-600 rounded">
              <span className="text-white text-sm">Tentativa Login - 12:15</span>
              <Badge variant="destructive">Falhou</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
