"use client"

import * as React from "react"
import { CheckCircle2Icon, AlertCircleIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"
import { useData, type Settings } from "@/context/DataContext"

export function SettingsSection() {
  const { settings, updateSettings } = useData()
  const [form, setForm] = React.useState<Settings>(settings)
  const [submitting, setSubmitting] = React.useState(false)
  const [success, setSuccess] = React.useState(false)
  const [errors, setErrors] = React.useState<string[]>([])

  React.useEffect(() => {
    setForm(settings)
  }, [settings])

  function validate() {
    const errs: string[] = []
    if (!form.organizationName.trim())
      errs.push("El nombre de la organización es obligatorio.")
    if (!form.contactEmail.trim()) errs.push("El email de contacto es obligatorio.")
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contactEmail))
      errs.push("El email no tiene un formato válido.")
    return errs
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSuccess(false)
    const errs = validate()
    setErrors(errs)
    if (errs.length > 0) return
    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 900))
    updateSettings(form)
    setSubmitting(false)
    setSuccess(true)
    setTimeout(() => setSuccess(false), 2500)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {errors.length > 0 && (
        <Alert variant="destructive">
          <AlertCircleIcon />
          <AlertTitle>Revisa los campos</AlertTitle>
          <AlertDescription>
            <ul className="list-disc pl-4 mt-1">
              {errors.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-500/40 text-green-700">
          <CheckCircle2Icon />
          <AlertTitle>Configuración guardada</AlertTitle>
          <AlertDescription>
            Tus preferencias se actualizaron correctamente.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-3 md:grid-cols-2">
        <div className="grid gap-1.5">
          <Label htmlFor="organizationName">Nombre de la organización</Label>
          <Input
            id="organizationName"
            value={form.organizationName}
            onChange={(e) =>
              setForm({ ...form, organizationName: e.target.value })
            }
          />
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="contactEmail">Email de contacto</Label>
          <Input
            id="contactEmail"
            type="email"
            value={form.contactEmail}
            onChange={(e) =>
              setForm({ ...form, contactEmail: e.target.value })
            }
          />
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="language">Idioma</Label>
          <Select
            value={form.language}
            onValueChange={(v) =>
              setForm({ ...form, language: v as Settings["language"] })
            }
          >
            <SelectTrigger id="language">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="es">Español</SelectItem>
              <SelectItem value="en">English</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="timezone">Zona horaria</Label>
          <Select
            value={form.timezone}
            onValueChange={(v) => setForm({ ...form, timezone: v })}
          >
            <SelectTrigger id="timezone">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="America/Lima">America/Lima</SelectItem>
              <SelectItem value="America/Bogota">America/Bogota</SelectItem>
              <SelectItem value="America/Mexico_City">America/Mexico_City</SelectItem>
              <SelectItem value="Europe/Madrid">Europe/Madrid</SelectItem>
              <SelectItem value="UTC">UTC</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3 rounded-md border p-4">
        <h4 className="text-sm font-semibold">Notificaciones</h4>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Notificaciones por email</p>
            <p className="text-xs text-muted-foreground">
              Recibe novedades del equipo en tu bandeja.
            </p>
          </div>
          <Switch
            checked={form.emailNotifications}
            onCheckedChange={(v) => setForm({ ...form, emailNotifications: v })}
          />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Notificaciones push</p>
            <p className="text-xs text-muted-foreground">
              Alertas en tiempo real en el navegador.
            </p>
          </div>
          <Switch
            checked={form.pushNotifications}
            onCheckedChange={(v) => setForm({ ...form, pushNotifications: v })}
          />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Modo oscuro</p>
            <p className="text-xs text-muted-foreground">
              Cambia el tema visual del dashboard (simulado).
            </p>
          </div>
          <Switch
            checked={form.darkMode}
            onCheckedChange={(v) => setForm({ ...form, darkMode: v })}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => setForm(settings)}
          disabled={submitting}
        >
          Restablecer
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting && <Spinner className="mr-2" />}
          {submitting ? "Guardando..." : "Guardar configuración"}
        </Button>
      </div>
    </form>
  )
}
