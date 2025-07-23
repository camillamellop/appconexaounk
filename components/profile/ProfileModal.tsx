"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import { getCurrentUser } from "@/lib/auth"
import LogoutConfirmDialog from "./LogoutConfirmDialog"
import type { User } from "@/lib/auth"
import {
  UserIcon,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Instagram,
  Linkedin,
  Camera,
  Bell,
  Settings,
  LogOut,
  Save,
  X,
} from "lucide-react"

interface UserSettings {
  notifications: {
    push: boolean
    email: boolean
  }
  preferences: {
    language: string
    timezone: string
  }
}

interface ProfileModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const currentUser = getCurrentUser()

  const [userProfile, setUserProfile] = useLocalStorage<User>(
    "userProfile",
    currentUser || {
      id: "1",
      name: "Usuário",
      email: "usuario@example.com",
      phone: "",
      bio: "",
      location: "",
      avatar: "",
      specialty: "",
      instagram: "",
      twitter: "",
    },
  )

  const [userSettings, setUserSettings] = useLocalStorage<UserSettings>("userSettings", {
    notifications: {
      push: true,
      email: true,
    },
    preferences: {
      language: "pt-BR",
      timezone: "America/Sao_Paulo",
    },
  })

  const [formData, setFormData] = useState<User>(userProfile)
  const [settings, setSettings] = useState<UserSettings>(userSettings)
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleInputChange = (field: keyof User, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setFormData((prev) => ({
          ...prev,
          avatar: result,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = () => {
    setUserProfile(formData)
    setUserSettings(settings)

    // Show success feedback
    console.log("✅ Configurações salvas:", settings)

    onClose()
  }

  const handleCancel = () => {
    setFormData(userProfile)
    setSettings(userSettings)
    onClose()
  }

  const handleLogout = () => {
    setIsLogoutDialogOpen(true)
  }

  const confirmLogout = () => {
    setIsLogoutDialogOpen(false)
    // The logout function will handle the redirect
  }

  const handleNotificationChange = (type: "push" | "email", value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: value,
      },
    }))
  }

  const handlePreferenceChange = (type: "language" | "timezone", value: string) => {
    setSettings((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [type]: value,
      },
    }))
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-slate-800 border-slate-700 max-w-2xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <UserIcon className="h-5 w-5" />
              Meu Perfil
            </DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-slate-700">
              <TabsTrigger value="profile" className="data-[state=active]:bg-purple-600">
                Perfil
              </TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:bg-purple-600">
                Configurações
              </TabsTrigger>
            </TabsList>

            <div className="max-h-[60vh] overflow-y-auto">
              <TabsContent value="profile" className="space-y-6 p-1">
                {/* Avatar Section */}
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={formData.avatar || "/placeholder.svg"} alt={formData.name} />
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-2xl">
                        <UserIcon className="h-12 w-12" />
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      size="icon"
                      className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-purple-600 hover:bg-purple-700"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                  <p className="text-sm text-gray-400">Clique na câmera para alterar sua foto</p>
                </div>

                <Separator className="bg-slate-700" />

                {/* Personal Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-white flex items-center gap-2">
                      <UserIcon className="h-4 w-4" />
                      Nome Completo *
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-white flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Telefone
                    </Label>
                    <Input
                      id="phone"
                      value={formData.phone || ""}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="(11) 99999-9999"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-white flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Localização
                    </Label>
                    <Input
                      id="location"
                      value={formData.location || ""}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="São Paulo, SP"
                    />
                  </div>
                </div>

                {/* Professional Info */}
                <Separator className="bg-slate-700" />
                <h3 className="text-lg font-semibold text-white">Informações Profissionais</h3>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="specialty" className="text-white flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      Especialidade
                    </Label>
                    <Input
                      id="specialty"
                      value={formData.specialty || ""}
                      onChange={(e) => handleInputChange("specialty", e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="House, Techno, Pop..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio" className="text-white">
                      Biografia
                    </Label>
                    <Textarea
                      id="bio"
                      value={formData.bio || ""}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white"
                      rows={3}
                      placeholder="Conte um pouco sobre você..."
                    />
                  </div>
                </div>

                {/* Social Links */}
                <Separator className="bg-slate-700" />
                <h3 className="text-lg font-semibold text-white">Redes Sociais</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="instagram" className="text-white flex items-center gap-2">
                      <Instagram className="h-4 w-4" />
                      Instagram
                    </Label>
                    <Input
                      id="instagram"
                      value={formData.instagram || ""}
                      onChange={(e) => handleInputChange("instagram", e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="@usuario"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="twitter" className="text-white flex items-center gap-2">
                      <Linkedin className="h-4 w-4" />
                      Twitter
                    </Label>
                    <Input
                      id="twitter"
                      value={formData.twitter || ""}
                      onChange={(e) => handleInputChange("twitter", e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="@usuario"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="settings" className="space-y-6 p-1">
                {/* Notifications */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notificações
                  </h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white">Notificações Push</p>
                        <p className="text-sm text-gray-400">Receber notificações no dispositivo</p>
                      </div>
                      <Switch
                        checked={settings.notifications.push}
                        onCheckedChange={(value) => handleNotificationChange("push", value)}
                        className="data-[state=checked]:bg-purple-600"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white">Notificações por Email</p>
                        <p className="text-sm text-gray-400">Receber notificações por email</p>
                      </div>
                      <Switch
                        checked={settings.notifications.email}
                        onCheckedChange={(value) => handleNotificationChange("email", value)}
                        className="data-[state=checked]:bg-purple-600"
                      />
                    </div>
                  </div>
                </div>

                <Separator className="bg-slate-700" />

                {/* Preferences */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Preferências
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-white">Idioma</Label>
                      <Select
                        value={settings.preferences.language}
                        onValueChange={(value) => handlePreferenceChange("language", value)}
                      >
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-700 border-slate-600">
                          <SelectItem value="pt-BR" className="text-white hover:bg-slate-600">
                            Português (Brasil)
                          </SelectItem>
                          <SelectItem value="en-US" className="text-white hover:bg-slate-600">
                            English (US)
                          </SelectItem>
                          <SelectItem value="es-ES" className="text-white hover:bg-slate-600">
                            Español
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white">Fuso Horário</Label>
                      <Select
                        value={settings.preferences.timezone}
                        onValueChange={(value) => handlePreferenceChange("timezone", value)}
                      >
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-700 border-slate-600">
                          <SelectItem value="America/Sao_Paulo" className="text-white hover:bg-slate-600">
                            São Paulo (GMT-3)
                          </SelectItem>
                          <SelectItem value="America/New_York" className="text-white hover:bg-slate-600">
                            New York (GMT-5)
                          </SelectItem>
                          <SelectItem value="Europe/London" className="text-white hover:bg-slate-600">
                            London (GMT+0)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Separator className="bg-slate-700" />

                {/* Logout Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Conta</h3>
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">Sair da Conta</p>
                        <p className="text-sm text-gray-400">Desconectar-se de todos os dispositivos</p>
                      </div>
                      <Button variant="destructive" onClick={handleLogout} className="bg-red-600 hover:bg-red-700">
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="border-slate-600 text-white hover:bg-slate-700 bg-transparent"
            >
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button onClick={handleSave} className="bg-purple-600 hover:bg-purple-700">
              <Save className="h-4 w-4 mr-2" />
              Salvar Alterações
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <LogoutConfirmDialog
        isOpen={isLogoutDialogOpen}
        onClose={() => setIsLogoutDialogOpen(false)}
        onConfirm={confirmLogout}
      />
    </>
  )
}
