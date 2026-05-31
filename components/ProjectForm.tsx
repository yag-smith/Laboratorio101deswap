"use client"

import * as React from "react"
import { AlertCircleIcon, CheckCircle2Icon, PlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import {
  useData,
  type ProjectCategory,
  type ProjectPriority,
} from "@/context/DataContext"

interface FormState {
  name: string
  description: string
  category: ProjectCategory | ""
  priority: ProjectPriority | ""
  memberIds: string[]
}

const emptyForm: FormState = {
  name: "",
  description: "",
  category: "",
  priority: "",
  memberIds: [],
}

export function ProjectForm() {
  const { members, addProject } = useData()
  const [open, setOpen] = React.useState(false)
  const [form, setForm] = React.useState<FormState>(emptyForm)
  const [errors, setErrors] = React.useState<string[]>([])
  const [submitting, setSubmitting] = React.useState(false)
  const [success, setSuccess] = React.useState(false)

  function validate(): string[] {
    const errs: string[] = []
    if (!form.name.trim()) errs.push("El nombre del proyecto es obligatorio.")
    else if (form.name.trim().length < 3) errs.push("El nombre debe tener al menos 3 caracteres.")
    if (!form.category) errs.push("Selecciona una categoría.")
    if (!form.priority) errs.push("Selecciona una prioridad.")
    if (form.memberIds.length === 0) errs.push("Asigna al menos un miembro del equipo.")
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
    addProject({
      name: form.name.trim(),
      description: form.description.trim(),
      category: form.category as ProjectCategory,
      priority: form.priority as ProjectPriority,
      memberIds: form.memberIds,
    })
    setSubmitting(false)
    setSuccess(true)

    setTimeout(() => {
      setForm(emptyForm)
      setErrors([])
      setSuccess(false)
      setOpen(false)
    }, 700)
  }

  function toggleMember(memberId: string) {
    setForm((prev) => ({
      ...prev,
      memberIds: prev.memberIds.includes(memberId)
        ? prev.memberIds.filter((id) => id !== memberId)
        : [...prev.memberIds, memberId],
    }))
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o)
        if (!o) {
          setForm(emptyForm)
          setErrors([])
          setSuccess(false)
        }
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className="mr-2 h-4 w-4" />
          Nuevo Proyecto
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[560px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Crear Nuevo Proyecto</DialogTitle>
            <DialogDescription>
              Completa la información del proyecto. Click en guardar cuando termines.
            </DialogDescription>
          </DialogHeader>

          {errors.length > 0 && (
            <Alert variant="destructive" className="my-3">
              <AlertCircleIcon />
              <AlertTitle>Revisa los siguientes campos</AlertTitle>
              <AlertDescription>
                <ul className="list-disc pl-4 mt-1">
                  {errors.map((er) => (
                    <li key={er}>{er}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="my-3 border-green-500/40 text-green-700">
              <CheckCircle2Icon />
              <AlertTitle>Proyecto creado</AlertTitle>
              <AlertDescription>El proyecto se guardó correctamente.</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="name">
                Nombre del Proyecto <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Mi Proyecto Increíble"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                placeholder="Breve descripción del proyecto..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="category">
                  Categoría <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={form.category}
                  onValueChange={(value) =>
                    setForm({ ...form, category: value as ProjectCategory })
                  }
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Selecciona" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="web">Desarrollo Web</SelectItem>
                    <SelectItem value="mobile">Desarrollo Mobile</SelectItem>
                    <SelectItem value="design">Diseño</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="other">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="priority">
                  Prioridad <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={form.priority}
                  onValueChange={(value) =>
                    setForm({ ...form, priority: value as ProjectPriority })
                  }
                >
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Selecciona" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Baja</SelectItem>
                    <SelectItem value="medium">Media</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                    <SelectItem value="urgent">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label>
                Miembros del equipo <span className="text-red-500">*</span>
              </Label>
              <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto rounded-md border p-2">
                {members.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Aún no hay miembros. Agrega miembros en el menú Equipo.
                  </p>
                ) : (
                  members.map((m) => {
                    const checked = form.memberIds.includes(m.id)
                    return (
                      <label
                        key={m.id}
                        className="flex items-center gap-2 rounded-md border px-2 py-1 cursor-pointer hover:bg-accent"
                      >
                        <Checkbox
                          checked={checked}
                          onCheckedChange={() => toggleMember(m.id)}
                        />
                        <span className="text-sm">{m.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {m.role}
                        </Badge>
                      </label>
                    )
                  })
                )}
              </div>
              {form.memberIds.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  {form.memberIds.length} miembro(s) seleccionado(s).
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={submitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting && <Spinner className="mr-2" />}
              {submitting ? "Guardando..." : "Crear Proyecto"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
