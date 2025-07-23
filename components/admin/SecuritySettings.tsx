"use client"

import { CardDescription } from "@/components/ui/card"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { Shield, Key, AlertTriangle, Activity, Lock, Eye, Ban, ShieldCheck, KeyRound, History } from "lucide-react"

interface SecurityLog {
  id: string
  timestamp: string
  event_type: "login_success" | "login_failed" | "password_change" | "account_locked" | "suspicious_activity"
  user_email: string
  ip_address: string
  user_agent: string
  details: string
}

interface ActiveSession {
  id: string
  user_email: string
  ip_address: string
  location: string
  device: string
  last_activity: string
  is_current: boolean
}

interface SecuritySettings {
  password_policy: {
    min_length: number
    require_uppercase: boolean
    require_lowercase: boolean
    require_numbers: boolean
    require_symbols: boolean
    password_history: number
  }
  account_lockout: {
    enabled: boolean
    max_attempts: number
    lockout_duration: number
    reset_time: number
  }
  session_management: {
    session_timeout: number
    concurrent_sessions: number
    force_logout_on_password_change: boolean
  }
  two_factor: {
    enabled: boolean
    required_for_admins: boolean
    backup_codes: boolean
  }
  ip_restrictions: {
    enabled: boolean
    whitelist: string[]
    blacklist: string[]
  }
}

export default function SecuritySettings() {
  const [settings, setSettings] = useState<SecuritySettings | null>(null)
  const [securityLogs, setSecurityLogs] = useState<SecurityLog[]>([])
  const [activeSessions, setActiveSessions] = useState<ActiveSession[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [twoFactor, setTwoFactor] = useState(false)
  const [sessionTimeout, setSessionTimeout] = useState(false)

  useEffect(() => {
    fetchSecurityData()
  }, [])

  const fetchSecurityData = async () => {
    try {
      setLoading(true)
      // Simulate API calls - replace with actual endpoints
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock data - replace with actual API calls
      const mockSettings: SecuritySettings = {
        password_policy: {
          min_length: 8,
          require_uppercase: true,
          require_lowercase: true,
          require_numbers: true,
          require_symbols: false,
          password_history: 5,
        },
        account_lockout: {
          enabled: true,
          max_attempts: 5,
          lockout_duration: 15,
          reset_time: 60,
        },
        session_management: {
          session_timeout: 30,
          concurrent_sessions: 3,
          force_logout_on_password_change: true,
        },
        two_factor: {
          enabled: false,
          required_for_admins: true,
          backup_codes: true,
        },
        ip_restrictions: {
          enabled: false,
          whitelist: [],
          blacklist: ["192.168.1.100", "10.0.0.50"],
        },
      }

      const mockLogs: SecurityLog[] = [
        {
          id: "1",
          timestamp: "2024-01-23T14:30:00Z",
          event_type: "login_success",
          user_email: "admin@unkdashboard.com",
          ip_address: "192.168.1.10",
          user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          details: "Login bem-sucedido",
        },
        {
          id: "2",
          timestamp: "2024-01-23T14:25:00Z",
          event_type: "login_failed",
          user_email: "user@example.com",
          ip_address: "203.0.113.1",
          user_agent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
          details: "Senha incorreta - tentativa 3/5",
        },
        {
          id: "3",
          timestamp: "2024-01-23T13:45:00Z",
          event_type: "suspicious_activity",
          user_email: "dj@example.com",
          ip_address: "198.51.100.1",
          user_agent: "curl/7.68.0",
          details: "Múltiplas tentativas de login de IP suspeito",
        },
      ]

      const mockSessions: ActiveSession[] = [
        {
          id: "1",
          user_email: "admin@unkdashboard.com",
          ip_address: "192.168.1.10",
          location: "São Paulo, BR",
          device: "Chrome on Windows",
          last_activity: "2024-01-23T14:30:00Z",
          is_current: true,
        },
        {
          id: "2",
          user_email: "dj@example.com",
          ip_address: "203.0.113.5",
          location: "Rio de Janeiro, BR",
          device: "Safari on iPhone",
          last_activity: "2024-01-23T14:15:00Z",
          is_current: false,
        },
      ]

      setSettings(mockSettings)
      setSecurityLogs(mockLogs)
      setActiveSessions(mockSessions)
    } catch (error) {
      console.error("Error fetching security data:", error)
      toast.error("Erro ao carregar dados de segurança")
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async () => {
    if (!settings) return

    try {
      setSaving(true)
      // Simulate API call - replace with actual endpoint
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast.success("Configurações de segurança salvas!")
    } catch (error) {
      console.error("Error saving settings:", error)
      toast.error("Erro ao salvar configurações")
    } finally {
      setSaving(false)
    }
  }

  const terminateSession = async (sessionId: string) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      setActiveSessions((prev) => prev.filter((session) => session.id !== sessionId))
      toast.success("Sessão terminada com sucesso")
    } catch (error) {
      console.error("Error terminating session:", error)
      toast.error("Erro ao terminar sessão")
    }
  }

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "login_success":
        return "bg-green-100 text-green-800"
      case "login_failed":
        return "bg-yellow-100 text-yellow-800"
      case "password_change":
        return "bg-blue-100 text-blue-800"
      case "account_locked":
        return "bg-red-100 text-red-800"
      case "suspicious_activity":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case "login_success":
        return <Shield className="h-4 w-4" />
      case "login_failed":
        return <AlertTriangle className="h-4 w-4" />
      case "password_change":
        return <Key className="h-4 w-4" />
      case "account_locked":
        return <Lock className="h-4 w-4" />
      case "suspicious_activity":
        return <Ban className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!settings) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Erro ao carregar configurações de segurança</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-blue-600" />
            Configurações de Segurança
          </h2>
          <p className="text-gray-600">Gerencie políticas de segurança e monitore atividades</p>
        </div>
        <Button onClick={saveSettings} disabled={saving}>
          {saving ? "Salvando..." : "Salvar Configurações"}
        </Button>
      </div>

      <Tabs defaultValue="policies" className="space-y-4">
        <TabsList>
          <TabsTrigger value="policies">Políticas</TabsTrigger>
          <TabsTrigger value="sessions">Sessões Ativas</TabsTrigger>
          <TabsTrigger value="logs">Logs de Segurança</TabsTrigger>
          <TabsTrigger value="restrictions">Restrições</TabsTrigger>
        </TabsList>

        <TabsContent value="policies" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Password Policy */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Política de Senhas
                </CardTitle>
                <CardDescription>Configure requisitos para senhas de usuários</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="min_length">Tamanho Mínimo</Label>
                  <Input
                    id="min_length"
                    type="number"
                    min="6"
                    max="20"
                    value={settings.password_policy.min_length}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        password_policy: {
                          ...settings.password_policy,
                          min_length: Number.parseInt(e.target.value),
                        },
                      })
                    }
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Exigir Maiúsculas</Label>
                    <Switch
                      checked={settings.password_policy.require_uppercase}
                      onCheckedChange={(checked) =>
                        setSettings({
                          ...settings,
                          password_policy: {
                            ...settings.password_policy,
                            require_uppercase: checked,
                          },
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Exigir Minúsculas</Label>
                    <Switch
                      checked={settings.password_policy.require_lowercase}
                      onCheckedChange={(checked) =>
                        setSettings({
                          ...settings,
                          password_policy: {
                            ...settings.password_policy,
                            require_lowercase: checked,
                          },
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Exigir Números</Label>
                    <Switch
                      checked={settings.password_policy.require_numbers}
                      onCheckedChange={(checked) =>
                        setSettings({
                          ...settings,
                          password_policy: {
                            ...settings.password_policy,
                            require_numbers: checked,
                          },
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Exigir Símbolos</Label>
                    <Switch
                      checked={settings.password_policy.require_symbols}
                      onCheckedChange={(checked) =>
                        setSettings({
                          ...settings,
                          password_policy: {
                            ...settings.password_policy,
                            require_symbols: checked,
                          },
                        })
                      }
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="password_history">Histórico de Senhas</Label>
                  <Input
                    id="password_history"
                    type="number"
                    min="0"
                    max="10"
                    value={settings.password_policy.password_history}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        password_policy: {
                          ...settings.password_policy,
                          password_history: Number.parseInt(e.target.value),
                        },
                      })
                    }
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Número de senhas anteriores que não podem ser reutilizadas
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Account Lockout */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Bloqueio de Conta
                </CardTitle>
                <CardDescription>Configure políticas de bloqueio por tentativas falhadas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Bloqueio Habilitado</Label>
                    <p className="text-sm text-gray-600">Bloquear conta após tentativas falhadas</p>
                  </div>
                  <Switch
                    checked={settings.account_lockout.enabled}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        account_lockout: {
                          ...settings.account_lockout,
                          enabled: checked,
                        },
                      })
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="max_attempts">Máximo de Tentativas</Label>
                  <Input
                    id="max_attempts"
                    type="number"
                    min="3"
                    max="10"
                    value={settings.account_lockout.max_attempts}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        account_lockout: {
                          ...settings.account_lockout,
                          max_attempts: Number.parseInt(e.target.value),
                        },
                      })
                    }
                    disabled={!settings.account_lockout.enabled}
                  />
                </div>

                <div>
                  <Label htmlFor="lockout_duration">Duração do Bloqueio (minutos)</Label>
                  <Input
                    id="lockout_duration"
                    type="number"
                    min="5"
                    max="1440"
                    value={settings.account_lockout.lockout_duration}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        account_lockout: {
                          ...settings.account_lockout,
                          lockout_duration: Number.parseInt(e.target.value),
                        },
                      })
                    }
                    disabled={!settings.account_lockout.enabled}
                  />
                </div>

                <div>
                  <Label htmlFor="reset_time">Tempo para Reset (minutos)</Label>
                  <Input
                    id="reset_time"
                    type="number"
                    min="15"
                    max="1440"
                    value={settings.account_lockout.reset_time}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        account_lockout: {
                          ...settings.account_lockout,
                          reset_time: Number.parseInt(e.target.value),
                        },
                      })
                    }
                    disabled={!settings.account_lockout.enabled}
                  />
                  <p className="text-xs text-gray-500 mt-1">Tempo para resetar contador de tentativas</p>
                </div>
              </CardContent>
            </Card>

            {/* Two-factor */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <KeyRound className="h-5 w-5 text-blue-600" />
                  Autenticação 2 FA
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <KeyRound className="h-4 w-4 text-muted-foreground" />
                    <span>Autenticação 2 FA</span>
                  </div>
                  <Switch
                    checked={twoFactor}
                    onCheckedChange={setTwoFactor}
                    aria-label="Ativar autenticação de dois fatores"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Session timeout */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5 text-blue-600" />
                  Encerrar sessão após inatividade
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <History className="h-4 w-4 text-muted-foreground" />
                    <span>Encerrar sessão após inatividade</span>
                  </div>
                  <Switch
                    checked={sessionTimeout}
                    onCheckedChange={setSessionTimeout}
                    aria-label="Ativar timeout de sessão"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Sessões Ativas
              </CardTitle>
              <CardDescription>Monitore e gerencie sessões de usuários ativas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Usuário</TableHead>
                      <TableHead>Localização</TableHead>
                      <TableHead>Dispositivo</TableHead>
                      <TableHead>Última Atividade</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeSessions.map((session) => (
                      <TableRow key={session.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{session.user_email}</div>
                            <div className="text-sm text-gray-500">{session.ip_address}</div>
                          </div>
                        </TableCell>
                        <TableCell>{session.location}</TableCell>
                        <TableCell>{session.device}</TableCell>
                        <TableCell>{new Date(session.last_activity).toLocaleString("pt-BR")}</TableCell>
                        <TableCell>
                          <Badge variant={session.is_current ? "default" : "secondary"}>
                            {session.is_current ? "Atual" : "Ativa"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {!session.is_current && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  Terminar
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Terminar Sessão</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Tem certeza que deseja terminar esta sessão? O usuário será desconectado
                                    imediatamente.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => terminateSession(session.id)}>
                                    Terminar
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Logs de Segurança
              </CardTitle>
              <CardDescription>Histórico de eventos de segurança do sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Evento</TableHead>
                      <TableHead>Usuário</TableHead>
                      <TableHead>IP</TableHead>
                      <TableHead>Detalhes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {securityLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>{new Date(log.timestamp).toLocaleString("pt-BR")}</TableCell>
                        <TableCell>
                          <Badge className={getEventTypeColor(log.event_type)}>
                            <div className="flex items-center gap-1">
                              {getEventTypeIcon(log.event_type)}
                              {log.event_type.replace("_", " ")}
                            </div>
                          </Badge>
                        </TableCell>
                        <TableCell>{log.user_email}</TableCell>
                        <TableCell>{log.ip_address}</TableCell>
                        <TableCell>{log.details}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="restrictions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ban className="h-5 w-5" />
                Restrições de IP
              </CardTitle>
              <CardDescription>Configure listas de IPs permitidos e bloqueados</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Restrições Habilitadas</Label>
                  <p className="text-sm text-gray-600">Ativar controle de acesso por IP</p>
                </div>
                <Switch
                  checked={settings.ip_restrictions.enabled}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      ip_restrictions: {
                        ...settings.ip_restrictions,
                        enabled: checked,
                      },
                    })
                  }
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <Label>Lista Branca (Permitidos)</Label>
                  <div className="mt-2 space-y-2">
                    {settings.ip_restrictions.whitelist.map((ip, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input value={ip} readOnly />
                        <Button variant="outline" size="sm">
                          Remover
                        </Button>
                      </div>
                    ))}
                    <Button variant="outline" size="sm">
                      Adicionar IP
                    </Button>
                  </div>
                </div>

                <div>
                  <Label>Lista Negra (Bloqueados)</Label>
                  <div className="mt-2 space-y-2">
                    {settings.ip_restrictions.blacklist.map((ip, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input value={ip} readOnly />
                        <Button variant="outline" size="sm">
                          Remover
                        </Button>
                      </div>
                    ))}
                    <Button variant="outline" size="sm">
                      Adicionar IP
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Named export for compatibility
export type { SecuritySettings }
