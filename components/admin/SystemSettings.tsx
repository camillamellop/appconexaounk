"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Settings, Database, Bell, Server } from "lucide-react"

interface SystemConfig {
  siteName: string
  siteDescription: string
  maintenanceMode: boolean
  registrationEnabled: boolean
  emailNotifications: boolean
  backupFrequency: string
  maxFileSize: number
  sessionTimeout: number
}

export default function SystemSettings() {
  const [config, setConfig] = useState<SystemConfig>({
    siteName: "UNK Dashboard",
    siteDescription: "Sistema de gerenciamento para DJs",
    maintenanceMode: false,
    registrationEnabled: true,
    emailNotifications: true,
    backupFrequency: "daily",
    maxFileSize: 10,
    sessionTimeout: 30,
  })

  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    // Simular salvamento
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
    alert("Configurações salvas com sucesso!")
  }

  const handleBackup = async () => {
    alert("Backup iniciado! Você será notificado quando concluído.")
  }

  const handleClearCache = async () => {
    alert("Cache limpo com sucesso!")
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Configurações do Sistema</h2>
        <p className="text-muted-foreground">Gerencie as configurações gerais do sistema</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Configurações Gerais
            </CardTitle>
            <CardDescription>Configurações básicas do sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="siteName">Nome do Site</Label>
              <Input
                id="siteName"
                value={config.siteName}
                onChange={(e) => setConfig({ ...config, siteName: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="siteDescription">Descrição</Label>
              <Textarea
                id="siteDescription"
                value={config.siteDescription}
                onChange={(e) => setConfig({ ...config, siteDescription: e.target.value })}
                rows={3}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="maintenance">Modo Manutenção</Label>
                <p className="text-sm text-muted-foreground">Desabilita o acesso ao sistema</p>
              </div>
              <Switch
                id="maintenance"
                checked={config.maintenanceMode}
                onCheckedChange={(checked) => setConfig({ ...config, maintenanceMode: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="registration">Registro Habilitado</Label>
                <p className="text-sm text-muted-foreground">Permite novos registros</p>
              </div>
              <Switch
                id="registration"
                checked={config.registrationEnabled}
                onCheckedChange={(checked) => setConfig({ ...config, registrationEnabled: checked })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="w-5 h-5 mr-2" />
              Notificações
            </CardTitle>
            <CardDescription>Configurações de notificações</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="emailNotifications">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Enviar notificações por email</p>
              </div>
              <Switch
                id="emailNotifications"
                checked={config.emailNotifications}
                onCheckedChange={(checked) => setConfig({ ...config, emailNotifications: checked })}
              />
            </div>
            <div>
              <Label htmlFor="sessionTimeout">Session Timeout (minutos)</Label>
              <Input
                id="sessionTimeout"
                type="number"
                value={config.sessionTimeout}
                onChange={(e) => setConfig({ ...config, sessionTimeout: Number.parseInt(e.target.value) })}
              />
            </div>
            <div>
              <Label htmlFor="maxFileSize">Tamanho Máximo de Arquivo (MB)</Label>
              <Input
                id="maxFileSize"
                type="number"
                value={config.maxFileSize}
                onChange={(e) => setConfig({ ...config, maxFileSize: Number.parseInt(e.target.value) })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="w-5 h-5 mr-2" />
              Backup & Manutenção
            </CardTitle>
            <CardDescription>Configurações de backup e manutenção</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="backupFrequency">Frequência de Backup</Label>
              <Select
                value={config.backupFrequency}
                onValueChange={(value) => setConfig({ ...config, backupFrequency: value })}
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
            <div className="space-y-2">
              <Button onClick={handleBackup} className="w-full">
                Fazer Backup Agora
              </Button>
              <Button onClick={handleClearCache} variant="outline" className="w-full bg-transparent">
                Limpar Cache
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Server className="w-5 h-5 mr-2" />
              Status do Sistema
            </CardTitle>
            <CardDescription>Informações sobre o sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">Versão do Sistema</span>
              <Badge variant="outline">v1.0.0</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Node.js Version</span>
              <Badge variant="outline">v18.17.0</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Database</span>
              <Badge variant="default">PostgreSQL</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Último Backup</span>
              <Badge variant="secondary">Hoje, 03:00</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Uptime</span>
              <Badge variant="default">7 dias, 14h</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Salvando..." : "Salvar Configurações"}
        </Button>
      </div>
    </div>
  )
}

export { SystemSettings }
