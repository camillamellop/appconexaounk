"use client"

import { CardDescription } from "@/components/ui/card"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Shield, Lock, Eye, Key, Activity, Save, RefreshCw } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function SecuritySettings() {
  const [securitySettings, setSecuritySettings] = useState({
    authentication: {
      requireStrongPasswords: true,
      passwordMinLength: 8,
      requireTwoFactor: false,
      sessionTimeout: 24,
      maxLoginAttempts: 5,
      lockoutDuration: 30,
    },
    access: {
      allowRegistration: true,
      requireEmailVerification: true,
      defaultRole: "user",
      adminApprovalRequired: false,
    },
    monitoring: {
      logFailedLogins: true,
      logSuccessfulLogins: true,
      logAdminActions: true,
      alertOnSuspiciousActivity: true,
    },
  })

  const [auditLogs] = useState([
    {
      id: 1,
      timestamp: "2024-01-23 14:30:25",
      user: "admin@unk.com",
      action: "Login realizado",
      ip: "192.168.1.100",
      status: "success",
    },
    {
      id: 2,
      timestamp: "2024-01-23 14:25:10",
      user: "user@example.com",
      action: "Tentativa de login falhada",
      ip: "192.168.1.101",
      status: "failed",
    },
    {
      id: 3,
      timestamp: "2024-01-23 14:20:05",
      user: "admin@unk.com",
      action: "Usuário criado: novo@email.com",
      ip: "192.168.1.100",
      status: "success",
    },
    {
      id: 4,
      timestamp: "2024-01-23 14:15:30",
      user: "admin@unk.com",
      action: "Configurações de segurança alteradas",
      ip: "192.168.1.100",
      status: "success",
    },
    {
      id: 5,
      timestamp: "2024-01-23 14:10:15",
      user: "suspicious@email.com",
      action: "Múltiplas tentativas de login",
      ip: "192.168.1.200",
      status: "blocked",
    },
  ])

  const [loading, setLoading] = useState(false)

  const handleSave = async (section: string) => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Configurações de Segurança Salvas",
        description: `Configurações de ${section} foram atualizadas com sucesso.`,
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao salvar configurações de segurança",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const updateSetting = (section: string, key: string, value: any) => {
    setSecuritySettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [key]: value,
      },
    }))
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge className="bg-green-100 text-green-800">Sucesso</Badge>
      case "failed":
        return <Badge className="bg-red-100 text-red-800">Falha</Badge>
      case "blocked":
        return <Badge className="bg-yellow-100 text-yellow-800">Bloqueado</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Configurações de Segurança</h2>
          <p className="text-muted-foreground">Gerencie políticas de segurança e monitoramento</p>
        </div>
        <Badge variant="outline" className="flex items-center gap-2">
          <Shield className="w-3 h-3" />
          Segurança Ativa
        </Badge>
      </div>

      <Tabs defaultValue="authentication" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="authentication">Autenticação</TabsTrigger>
          <TabsTrigger value="access">Controle de Acesso</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoramento</TabsTrigger>
          <TabsTrigger value="logs">Logs de Auditoria</TabsTrigger>
        </TabsList>

        <TabsContent value="authentication" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Políticas de Autenticação
              </CardTitle>
              <CardDescription>Configure requisitos de senha e autenticação</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="passwordMinLength">Tamanho Mínimo da Senha</Label>
                  <Input
                    id="passwordMinLength"
                    type="number"
                    value={securitySettings.authentication.passwordMinLength}
                    onChange={(e) =>
                      updateSetting("authentication", "passwordMinLength", Number.parseInt(e.target.value))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Timeout de Sessão (horas)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={securitySettings.authentication.sessionTimeout}
                    onChange={(e) => updateSetting("authentication", "sessionTimeout", Number.parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxLoginAttempts">Máximo de Tentativas de Login</Label>
                  <Input
                    id="maxLoginAttempts"
                    type="number"
                    value={securitySettings.authentication.maxLoginAttempts}
                    onChange={(e) =>
                      updateSetting("authentication", "maxLoginAttempts", Number.parseInt(e.target.value))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lockoutDuration">Duração do Bloqueio (minutos)</Label>
                  <Input
                    id="lockoutDuration"
                    type="number"
                    value={securitySettings.authentication.lockoutDuration}
                    onChange={(e) =>
                      updateSetting("authentication", "lockoutDuration", Number.parseInt(e.target.value))
                    }
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Senhas Fortes Obrigatórias</Label>
                    <p className="text-sm text-muted-foreground">Exige maiúsculas, minúsculas, números e símbolos</p>
                  </div>
                  <Switch
                    checked={securitySettings.authentication.requireStrongPasswords}
                    onCheckedChange={(checked) => updateSetting("authentication", "requireStrongPasswords", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Autenticação de Dois Fatores</Label>
                    <p className="text-sm text-muted-foreground">Requer verificação adicional no login</p>
                  </div>
                  <Switch
                    checked={securitySettings.authentication.requireTwoFactor}
                    onCheckedChange={(checked) => updateSetting("authentication", "requireTwoFactor", checked)}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => handleSave("autenticação")} disabled={loading}>
                  {loading ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                  Salvar Configurações
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="access" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Controle de Acesso
              </CardTitle>
              <CardDescription>Gerencie permissões e políticas de acesso</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="defaultRole">Role Padrão para Novos Usuários</Label>
                <Select
                  value={securitySettings.access.defaultRole}
                  onValueChange={(value) => updateSetting("access", "defaultRole", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">Usuário</SelectItem>
                    <SelectItem value="admin">Administrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Permitir Registro de Novos Usuários</Label>
                    <p className="text-sm text-muted-foreground">Usuários podem criar contas automaticamente</p>
                  </div>
                  <Switch
                    checked={securitySettings.access.allowRegistration}
                    onCheckedChange={(checked) => updateSetting("access", "allowRegistration", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Verificação de Email Obrigatória</Label>
                    <p className="text-sm text-muted-foreground">Usuários devem verificar email antes de acessar</p>
                  </div>
                  <Switch
                    checked={securitySettings.access.requireEmailVerification}
                    onCheckedChange={(checked) => updateSetting("access", "requireEmailVerification", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Aprovação de Admin Obrigatória</Label>
                    <p className="text-sm text-muted-foreground">Novos usuários precisam de aprovação manual</p>
                  </div>
                  <Switch
                    checked={securitySettings.access.adminApprovalRequired}
                    onCheckedChange={(checked) => updateSetting("access", "adminApprovalRequired", checked)}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => handleSave("controle de acesso")} disabled={loading}>
                  {loading ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                  Salvar Configurações
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Monitoramento de Segurança
              </CardTitle>
              <CardDescription>Configure alertas e logs de segurança</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Registrar Logins Falhados</Label>
                    <p className="text-sm text-muted-foreground">Mantém log de tentativas de login mal-sucedidas</p>
                  </div>
                  <Switch
                    checked={securitySettings.monitoring.logFailedLogins}
                    onCheckedChange={(checked) => updateSetting("monitoring", "logFailedLogins", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Registrar Logins Bem-sucedidos</Label>
                    <p className="text-sm text-muted-foreground">Mantém log de todos os logins realizados</p>
                  </div>
                  <Switch
                    checked={securitySettings.monitoring.logSuccessfulLogins}
                    onCheckedChange={(checked) => updateSetting("monitoring", "logSuccessfulLogins", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Registrar Ações de Admin</Label>
                    <p className="text-sm text-muted-foreground">Mantém log de todas as ações administrativas</p>
                  </div>
                  <Switch
                    checked={securitySettings.monitoring.logAdminActions}
                    onCheckedChange={(checked) => updateSetting("monitoring", "logAdminActions", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Alertar Atividade Suspeita</Label>
                    <p className="text-sm text-muted-foreground">Envia alertas para atividades anômalas</p>
                  </div>
                  <Switch
                    checked={securitySettings.monitoring.alertOnSuspiciousActivity}
                    onCheckedChange={(checked) => updateSetting("monitoring", "alertOnSuspiciousActivity", checked)}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => handleSave("monitoramento")} disabled={loading}>
                  {loading ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                  Salvar Configurações
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Logs de Auditoria
              </CardTitle>
              <CardDescription>Visualize atividades recentes do sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Ação</TableHead>
                    <TableHead>IP</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-mono text-sm">{log.timestamp}</TableCell>
                      <TableCell>{log.user}</TableCell>
                      <TableCell>{log.action}</TableCell>
                      <TableCell className="font-mono text-sm">{log.ip}</TableCell>
                      <TableCell>{getStatusBadge(log.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="flex justify-between items-center mt-4">
                <p className="text-sm text-muted-foreground">Mostrando os últimos 5 registros</p>
                <div className="space-x-2">
                  <Button variant="outline" size="sm">
                    Exportar Logs
                  </Button>
                  <Button variant="outline" size="sm">
                    Limpar Logs
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="max-w-4xl mx-auto mt-10">
        <CardHeader>
          <CardTitle>Segurança</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Para reforçar a segurança, recomendamos alterar a senha de todos os usuários a cada 90 dias.
          </p>
          <Button>Aplicar política de senha</Button>
        </CardContent>
      </Card>
    </div>
  )
}

export { default as SecuritySettings } from "./SecuritySettings"
