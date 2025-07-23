"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Shield, Key, Eye, Lock } from "lucide-react"

interface SecurityLog {
  id: string
  timestamp: string
  event: string
  ip: string
  user: string
  severity: "low" | "medium" | "high"
}

export default function SecuritySettings() {
  const [securityConfig, setSecurityConfig] = useState({
    twoFactorAuth: false,
    passwordExpiry: true,
    loginAttempts: 5,
    sessionTimeout: 30,
    ipWhitelist: false,
    auditLog: true,
  })

  const [securityLogs] = useState<SecurityLog[]>([
    {
      id: "1",
      timestamp: "2024-01-23 10:30:00",
      event: "Login bem-sucedido",
      ip: "192.168.1.100",
      user: "jack@unk.com",
      severity: "low",
    },
    {
      id: "2",
      timestamp: "2024-01-23 10:25:00",
      event: "Tentativa de login falhada",
      ip: "192.168.1.200",
      user: "unknown@test.com",
      severity: "medium",
    },
    {
      id: "3",
      timestamp: "2024-01-23 10:20:00",
      event: "Múltiplas tentativas de login",
      ip: "192.168.1.300",
      user: "admin@test.com",
      severity: "high",
    },
    {
      id: "4",
      timestamp: "2024-01-23 10:15:00",
      event: "Senha alterada",
      ip: "192.168.1.100",
      user: "jack@unk.com",
      severity: "low",
    },
  ])

  const handleSave = async () => {
    alert("Configurações de segurança salvas com sucesso!")
  }

  const handleGenerateApiKey = () => {
    const newKey = "unk_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    alert(`Nova API Key gerada: ${newKey}`)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "destructive"
      case "medium":
        return "secondary"
      case "low":
        return "default"
      default:
        return "default"
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Configurações de Segurança</h2>
        <p className="text-muted-foreground">Gerencie a segurança e autenticação do sistema</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Autenticação
            </CardTitle>
            <CardDescription>Configurações de autenticação e acesso</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="twoFactor">Autenticação de Dois Fatores</Label>
                <p className="text-sm text-muted-foreground">Requer código adicional no login</p>
              </div>
              <Switch
                id="twoFactor"
                checked={securityConfig.twoFactorAuth}
                onCheckedChange={(checked) => setSecurityConfig({ ...securityConfig, twoFactorAuth: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="passwordExpiry">Expiração de Senha</Label>
                <p className="text-sm text-muted-foreground">Força alteração de senha periodicamente</p>
              </div>
              <Switch
                id="passwordExpiry"
                checked={securityConfig.passwordExpiry}
                onCheckedChange={(checked) => setSecurityConfig({ ...securityConfig, passwordExpiry: checked })}
              />
            </div>
            <div>
              <Label htmlFor="loginAttempts">Máximo de Tentativas de Login</Label>
              <Input
                id="loginAttempts"
                type="number"
                value={securityConfig.loginAttempts}
                onChange={(e) =>
                  setSecurityConfig({ ...securityConfig, loginAttempts: Number.parseInt(e.target.value) })
                }
              />
            </div>
            <div>
              <Label htmlFor="sessionTimeout">Timeout de Sessão (minutos)</Label>
              <Input
                id="sessionTimeout"
                type="number"
                value={securityConfig.sessionTimeout}
                onChange={(e) =>
                  setSecurityConfig({ ...securityConfig, sessionTimeout: Number.parseInt(e.target.value) })
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Key className="w-5 h-5 mr-2" />
              API & Acesso
            </CardTitle>
            <CardDescription>Configurações de API e controle de acesso</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="ipWhitelist">Lista Branca de IPs</Label>
                <p className="text-sm text-muted-foreground">Restringe acesso a IPs específicos</p>
              </div>
              <Switch
                id="ipWhitelist"
                checked={securityConfig.ipWhitelist}
                onCheckedChange={(checked) => setSecurityConfig({ ...securityConfig, ipWhitelist: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="auditLog">Log de Auditoria</Label>
                <p className="text-sm text-muted-foreground">Registra todas as ações do sistema</p>
              </div>
              <Switch
                id="auditLog"
                checked={securityConfig.auditLog}
                onCheckedChange={(checked) => setSecurityConfig({ ...securityConfig, auditLog: checked })}
              />
            </div>
            <div className="space-y-2">
              <Label>API Key Atual</Label>
              <div className="flex space-x-2">
                <Input value="unk_abc123def456ghi789" readOnly />
                <Button onClick={handleGenerateApiKey} variant="outline">
                  Gerar Nova
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Eye className="w-5 h-5 mr-2" />
            Logs de Segurança
          </CardTitle>
          <CardDescription>Últimas atividades de segurança do sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Evento</TableHead>
                <TableHead>IP</TableHead>
                <TableHead>Usuário</TableHead>
                <TableHead>Severidade</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {securityLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-mono text-sm">{log.timestamp}</TableCell>
                  <TableCell>{log.event}</TableCell>
                  <TableCell className="font-mono">{log.ip}</TableCell>
                  <TableCell>{log.user}</TableCell>
                  <TableCell>
                    <Badge variant={getSeverityColor(log.severity) as any}>{log.severity.toUpperCase()}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave}>
          <Lock className="w-4 h-4 mr-2" />
          Salvar Configurações
        </Button>
      </div>
    </div>
  )
}

export { SecuritySettings }
