"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Settings, Database, Mail, Bell, Shield, Globe, Code } from "lucide-react"

interface SystemConfig {
  general: {
    site_name: string
    site_description: string
    contact_email: string
    timezone: string
    language: string
    maintenance_mode: boolean
  }
  email: {
    smtp_host: string
    smtp_port: number
    smtp_user: string
    smtp_password: string
    from_email: string
    from_name: string
    enabled: boolean
  }
  notifications: {
    email_notifications: boolean
    push_notifications: boolean
    sms_notifications: boolean
    notification_frequency: string
  }
  security: {
    password_min_length: number
    require_2fa: boolean
    session_timeout: number
    max_login_attempts: number
    lockout_duration: number
  }
  database: {
    backup_frequency: string
    auto_cleanup: boolean
    retention_days: number
    last_backup: string
  }
  api: {
    rate_limit: number
    api_key_required: boolean
    cors_enabled: boolean
    allowed_origins: string
  }
}

export default function SystemSettings() {
  const [config, setConfig] = useState<SystemConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("general")

  useEffect(() => {
    fetchSystemConfig()
  }, [])

  const fetchSystemConfig = async () => {
    try {
      setLoading(true)
      // Simulate API call - replace with actual endpoint
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock data - replace with actual API call
      const mockConfig: SystemConfig = {
        general: {
          site_name: "UNK Dashboard",
          site_description: "Plataforma de gerenciamento para DJs e Produtores",
          contact_email: "admin@unkdashboard.com",
          timezone: "America/Sao_Paulo",
          language: "pt-BR",
          maintenance_mode: false,
        },
        email: {
          smtp_host: "smtp.gmail.com",
          smtp_port: 587,
          smtp_user: "noreply@unkdashboard.com",
          smtp_password: "••••••••",
          from_email: "noreply@unkdashboard.com",
          from_name: "UNK Dashboard",
          enabled: true,
        },
        notifications: {
          email_notifications: true,
          push_notifications: true,
          sms_notifications: false,
          notification_frequency: "immediate",
        },
        security: {
          password_min_length: 8,
          require_2fa: false,
          session_timeout: 30,
          max_login_attempts: 5,
          lockout_duration: 15,
        },
        database: {
          backup_frequency: "daily",
          auto_cleanup: true,
          retention_days: 30,
          last_backup: "2024-01-23T10:30:00Z",
        },
        api: {
          rate_limit: 100,
          api_key_required: true,
          cors_enabled: true,
          allowed_origins: "*",
        },
      }

      setConfig(mockConfig)
    } catch (error) {
      console.error("Error fetching system config:", error)
      toast.error("Erro ao carregar configurações")
    } finally {
      setLoading(false)
    }
  }

  const saveConfig = async () => {
    if (!config) return

    try {
      setSaving(true)
      // Simulate API call - replace with actual endpoint
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast.success("Configurações salvas com sucesso!")
    } catch (error) {
      console.error("Error saving config:", error)
      toast.error("Erro ao salvar configurações")
    } finally {
      setSaving(false)
    }
  }

  const updateConfig = (section: keyof SystemConfig, field: string, value: any) => {
    if (!config) return

    setConfig({
      ...config,
      [section]: {
        ...config[section],
        [field]: value,
      },
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!config) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Erro ao carregar configurações do sistema</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Settings className="h-6 w-6" />
            Configurações do Sistema
          </h2>
          <p className="text-gray-600">Gerencie configurações globais da plataforma</p>
        </div>
        <Button onClick={saveConfig} disabled={saving}>
          {saving ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
          <TabsTrigger value="database">Banco</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Configurações Gerais
              </CardTitle>
              <CardDescription>Configurações básicas da aplicação</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="site_name">Nome do Site</Label>
                  <Input
                    id="site_name"
                    value={config.general.site_name}
                    onChange={(e) => updateConfig("general", "site_name", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="contact_email">Email de Contato</Label>
                  <Input
                    id="contact_email"
                    type="email"
                    value={config.general.contact_email}
                    onChange={(e) => updateConfig("general", "contact_email", e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="site_description">Descrição do Site</Label>
                <Textarea
                  id="site_description"
                  value={config.general.site_description}
                  onChange={(e) => updateConfig("general", "site_description", e.target.value)}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="timezone">Fuso Horário</Label>
                  <Select
                    value={config.general.timezone}
                    onValueChange={(value) => updateConfig("general", "timezone", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/Sao_Paulo">São Paulo (GMT-3)</SelectItem>
                      <SelectItem value="America/New_York">New York (GMT-5)</SelectItem>
                      <SelectItem value="Europe/London">London (GMT+0)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="language">Idioma</Label>
                  <Select
                    value={config.general.language}
                    onValueChange={(value) => updateConfig("general", "language", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                      <SelectItem value="en-US">English (US)</SelectItem>
                      <SelectItem value="es-ES">Español</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="maintenance_mode">Modo de Manutenção</Label>
                  <p className="text-sm text-gray-600">Ativa uma página de manutenção para todos os usuários</p>
                </div>
                <Switch
                  id="maintenance_mode"
                  checked={config.general.maintenance_mode}
                  onCheckedChange={(checked) => updateConfig("general", "maintenance_mode", checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Configurações de Email
              </CardTitle>
              <CardDescription>Configure o servidor SMTP para envio de emails</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <Label>Email Habilitado</Label>
                  <p className="text-sm text-gray-600">Ativar/desativar envio de emails</p>
                </div>
                <Switch
                  checked={config.email.enabled}
                  onCheckedChange={(checked) => updateConfig("email", "enabled", checked)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="smtp_host">Servidor SMTP</Label>
                  <Input
                    id="smtp_host"
                    value={config.email.smtp_host}
                    onChange={(e) => updateConfig("email", "smtp_host", e.target.value)}
                    disabled={!config.email.enabled}
                  />
                </div>
                <div>
                  <Label htmlFor="smtp_port">Porta SMTP</Label>
                  <Input
                    id="smtp_port"
                    type="number"
                    value={config.email.smtp_port}
                    onChange={(e) => updateConfig("email", "smtp_port", Number.parseInt(e.target.value))}
                    disabled={!config.email.enabled}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="smtp_user">Usuário SMTP</Label>
                  <Input
                    id="smtp_user"
                    value={config.email.smtp_user}
                    onChange={(e) => updateConfig("email", "smtp_user", e.target.value)}
                    disabled={!config.email.enabled}
                  />
                </div>
                <div>
                  <Label htmlFor="smtp_password">Senha SMTP</Label>
                  <Input
                    id="smtp_password"
                    type="password"
                    value={config.email.smtp_password}
                    onChange={(e) => updateConfig("email", "smtp_password", e.target.value)}
                    disabled={!config.email.enabled}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="from_email">Email Remetente</Label>
                  <Input
                    id="from_email"
                    type="email"
                    value={config.email.from_email}
                    onChange={(e) => updateConfig("email", "from_email", e.target.value)}
                    disabled={!config.email.enabled}
                  />
                </div>
                <div>
                  <Label htmlFor="from_name">Nome Remetente</Label>
                  <Input
                    id="from_name"
                    value={config.email.from_name}
                    onChange={(e) => updateConfig("email", "from_name", e.target.value)}
                    disabled={!config.email.enabled}
                  />
                </div>
              </div>

              <div className="pt-4">
                <Button variant="outline" disabled={!config.email.enabled}>
                  Testar Configuração
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Configurações de Notificações
              </CardTitle>
              <CardDescription>Configure como e quando as notificações são enviadas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Notificações por Email</Label>
                    <p className="text-sm text-gray-600">Enviar notificações importantes por email</p>
                  </div>
                  <Switch
                    checked={config.notifications.email_notifications}
                    onCheckedChange={(checked) => updateConfig("notifications", "email_notifications", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Notificações Push</Label>
                    <p className="text-sm text-gray-600">Enviar notificações push no navegador</p>
                  </div>
                  <Switch
                    checked={config.notifications.push_notifications}
                    onCheckedChange={(checked) => updateConfig("notifications", "push_notifications", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Notificações SMS</Label>
                    <p className="text-sm text-gray-600">Enviar notificações críticas por SMS</p>
                  </div>
                  <Switch
                    checked={config.notifications.sms_notifications}
                    onCheckedChange={(checked) => updateConfig("notifications", "sms_notifications", checked)}
                  />
                </div>
              </div>

              <Separator />

              <div>
                <Label htmlFor="notification_frequency">Frequência de Notificações</Label>
                <Select
                  value={config.notifications.notification_frequency}
                  onValueChange={(value) => updateConfig("notifications", "notification_frequency", value)}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Imediata</SelectItem>
                    <SelectItem value="hourly">A cada hora</SelectItem>
                    <SelectItem value="daily">Diária</SelectItem>
                    <SelectItem value="weekly">Semanal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Configurações de Segurança
              </CardTitle>
              <CardDescription>Configure políticas de segurança e autenticação</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="password_min_length">Tamanho Mínimo da Senha</Label>
                  <Input
                    id="password_min_length"
                    type="number"
                    min="6"
                    max="20"
                    value={config.security.password_min_length}
                    onChange={(e) => updateConfig("security", "password_min_length", Number.parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="session_timeout">Timeout da Sessão (minutos)</Label>
                  <Input
                    id="session_timeout"
                    type="number"
                    min="5"
                    max="480"
                    value={config.security.session_timeout}
                    onChange={(e) => updateConfig("security", "session_timeout", Number.parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="max_login_attempts">Máximo de Tentativas de Login</Label>
                  <Input
                    id="max_login_attempts"
                    type="number"
                    min="3"
                    max="10"
                    value={config.security.max_login_attempts}
                    onChange={(e) => updateConfig("security", "max_login_attempts", Number.parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="lockout_duration">Duração do Bloqueio (minutos)</Label>
                  <Input
                    id="lockout_duration"
                    type="number"
                    min="5"
                    max="60"
                    value={config.security.lockout_duration}
                    onChange={(e) => updateConfig("security", "lockout_duration", Number.parseInt(e.target.value))}
                  />
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label>Autenticação de Dois Fatores</Label>
                  <p className="text-sm text-gray-600">Exigir 2FA para todos os usuários</p>
                </div>
                <Switch
                  checked={config.security.require_2fa}
                  onCheckedChange={(checked) => updateConfig("security", "require_2fa", checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="database" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Configurações do Banco de Dados
              </CardTitle>
              <CardDescription>Gerencie backups e manutenção do banco de dados</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="backup_frequency">Frequência de Backup</Label>
                  <Select
                    value={config.database.backup_frequency}
                    onValueChange={(value) => updateConfig("database", "backup_frequency", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">A cada hora</SelectItem>
                      <SelectItem value="daily">Diário</SelectItem>
                      <SelectItem value="weekly">Semanal</SelectItem>
                      <SelectItem value="monthly">Mensal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="retention_days">Retenção (dias)</Label>
                  <Input
                    id="retention_days"
                    type="number"
                    min="7"
                    max="365"
                    value={config.database.retention_days}
                    onChange={(e) => updateConfig("database", "retention_days", Number.parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Limpeza Automática</Label>
                  <p className="text-sm text-gray-600">Remover automaticamente dados antigos</p>
                </div>
                <Switch
                  checked={config.database.auto_cleanup}
                  onCheckedChange={(checked) => updateConfig("database", "auto_cleanup", checked)}
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Último Backup</Label>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{new Date(config.database.last_backup).toLocaleString("pt-BR")}</Badge>
                  <Button variant="outline" size="sm">
                    Fazer Backup Agora
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Configurações da API
              </CardTitle>
              <CardDescription>Configure limites e segurança da API</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="rate_limit">Limite de Requisições (por minuto)</Label>
                  <Input
                    id="rate_limit"
                    type="number"
                    min="10"
                    max="1000"
                    value={config.api.rate_limit}
                    onChange={(e) => updateConfig("api", "rate_limit", Number.parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="allowed_origins">Origens Permitidas (CORS)</Label>
                  <Input
                    id="allowed_origins"
                    value={config.api.allowed_origins}
                    onChange={(e) => updateConfig("api", "allowed_origins", e.target.value)}
                    placeholder="* ou https://exemplo.com"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Chave API Obrigatória</Label>
                    <p className="text-sm text-gray-600">Exigir chave API para todas as requisições</p>
                  </div>
                  <Switch
                    checked={config.api.api_key_required}
                    onCheckedChange={(checked) => updateConfig("api", "api_key_required", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>CORS Habilitado</Label>
                    <p className="text-sm text-gray-600">Permitir requisições cross-origin</p>
                  </div>
                  <Switch
                    checked={config.api.cors_enabled}
                    onCheckedChange={(checked) => updateConfig("api", "cors_enabled", checked)}
                  />
                </div>
              </div>

              <Separator />

              <div className="pt-4">
                <Button variant="outline">Gerar Nova Chave API</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Named export for compatibility
export { SystemSettings }
