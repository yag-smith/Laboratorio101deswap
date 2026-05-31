"use client"

import * as React from "react"
import { format, parse, isValid } from "date-fns"
import {
  PlusIcon,
  PencilIcon,
  Trash2Icon,
  CalendarIcon,
  AlertCircleIcon,
} from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useData, type Member } from "@/context/DataContext"
import { cn } from "@/lib/utils"

interface MemberFormState {
  userId: string
  name: string
  role: string
  email: string
  position: string
  birthdate: string
  phone: string
  projectId: string
  isActive: boolean
}

const emptyMember: MemberFormState = {
  userId: "",
  name: "",
  role: "",
  email: "",
  position: "",
  birthdate: "",
  phone: "",
  projectId: "none",
  isActive: true,
}

function emailValid(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function MembersSection() {
  const { members, projects, addMember, updateMember, removeMember } = useData()
  const [editing, setEditing] = React.useState<Member | null>(null)
  const [creating, setCreating] = React.useState(false)
  const [form, setForm] = React.useState<MemberFormState>(emptyMember)
  const [errors, setErrors] = React.useState<string[]>([])
  const [submitting, setSubmitting] = React.useState(false)
  const [deleteId, setDeleteId] = React.useState<string | null>(null)

  function openCreate() {
    setCreating(true)
    setEditing(null)
    setForm(emptyMember)
    setErrors([])
  }

  function openEdit(member: Member) {
    setEditing(member)
    setCreating(false)
    setForm({
      userId: member.userId,
      name: member.name,
      role: member.role,
      email: member.email,
      position: member.position,
      birthdate: member.birthdate,
      phone: member.phone,
      projectId: member.projectId ?? "none",
      isActive: member.isActive,
    })
    setErrors([])
  }

  const dialogOpen = creating || editing !== null

  function closeDialog() {
    setCreating(false)
    setEditing(null)
    setErrors([])
    setForm(emptyMember)
  }

  function validate(): string[] {
    const errs: string[] = []
    if (!form.userId.trim()) errs.push("UserId es obligatorio.")
    if (!form.name.trim()) errs.push("Nombre es obligatorio.")
    if (!form.role.trim()) errs.push("Rol es obligatorio.")
    if (!form.email.trim()) errs.push("Email es obligatorio.")
    else if (!emailValid(form.email)) errs.push("Email no es válido.")
    if (!form.position.trim()) errs.push("Posición es obligatoria.")
    if (!form.birthdate) errs.push("Fecha de nacimiento es obligatoria.")
    if (!form.phone.trim()) errs.push("Teléfono es obligatorio.")
    return errs
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    setErrors(errs)
    if (errs.length > 0) return

    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 700))

    const payload = {
      userId: form.userId.trim(),
      name: form.name.trim(),
      role: form.role.trim(),
      email: form.email.trim(),
      position: form.position.trim(),
      birthdate: form.birthdate,
      phone: form.phone.trim(),
      projectId: form.projectId === "none" ? null : form.projectId,
      isActive: form.isActive,
    }

    if (editing) {
      updateMember(editing.id, payload)
    } else {
      addMember(payload)
    }
    setSubmitting(false)
    closeDialog()
  }

  async function confirmDelete() {
    if (!deleteId) return
    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 500))
    removeMember(deleteId)
    setSubmitting(false)
    setDeleteId(null)
  }

  const parsedBirth =
    form.birthdate && isValid(parse(form.birthdate, "yyyy-MM-dd", new Date()))
      ? parse(form.birthdate, "yyyy-MM-dd", new Date())
      : undefined

  const target = members.find((m) => m.id === deleteId) ?? null

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Miembros ({members.length})</h3>
          <p className="text-sm text-muted-foreground">
            Gestiona el equipo, sus roles y proyectos asignados.
          </p>
        </div>
        <Button onClick={openCreate}>
          <PlusIcon className="mr-2 h-4 w-4" /> Nuevo miembro
        </Button>
      </div>

      {members.length === 0 ? (
        <Alert>
          <AlertTitle>Sin miembros</AlertTitle>
          <AlertDescription>Agrega el primer miembro del equipo.</AlertDescription>
        </Alert>
      ) : (
        <div className="space-y-3">
          {members.map((member) => {
            const project = projects.find((p) => p.id === member.projectId)
            return (
              <div
                key={member.id}
                className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 border rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarFallback>
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">
                      {member.name}{" "}
                      <span className="text-xs text-muted-foreground">
                        · {member.userId}
                      </span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {member.role} · {member.position}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {member.email} · {member.phone}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Nace: {member.birthdate} · Proyecto:{" "}
                      {project ? project.name : "—"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={member.isActive ? "default" : "secondary"}>
                    {member.isActive ? "Activo" : "Inactivo"}
                  </Badge>
                  <Button size="sm" variant="outline" onClick={() => openEdit(member)}>
                    <PencilIcon className="h-4 w-4 mr-1" /> Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-destructive hover:text-destructive"
                    onClick={() => setDeleteId(member.id)}
                  >
                    <Trash2Icon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Crear / Editar */}
      <Dialog open={dialogOpen} onOpenChange={(o) => !o && closeDialog()}>
        <DialogContent className="sm:max-w-[600px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>
                {editing ? "Editar miembro" : "Nuevo miembro"}
              </DialogTitle>
              <DialogDescription>
                Completa los datos del miembro del equipo.
              </DialogDescription>
            </DialogHeader>

            {errors.length > 0 && (
              <Alert variant="destructive" className="my-3">
                <AlertCircleIcon />
                <AlertTitle>Corrige estos campos</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc pl-4 mt-1">
                    {errors.map((e) => (
                      <li key={e}>{e}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-2 gap-3 py-2">
              <div className="grid gap-1.5">
                <Label htmlFor="userId">UserId</Label>
                <Input
                  id="userId"
                  value={form.userId}
                  onChange={(e) => setForm({ ...form, userId: e.target.value })}
                  placeholder="u-006"
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="role">Rol</Label>
                <Input
                  id="role"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  placeholder="Frontend Developer"
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="position">Posición</Label>
                <Input
                  id="position"
                  value={form.position}
                  onChange={(e) => setForm({ ...form, position: e.target.value })}
                  placeholder="Senior / Mid / Junior / Lead"
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>

              <div className="grid gap-1.5">
                <Label>Fecha de nacimiento</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className={cn(
                        "justify-start text-left font-normal",
                        !form.birthdate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {parsedBirth ? format(parsedBirth, "yyyy-MM-dd") : "Selecciona"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={parsedBirth}
                      captionLayout="dropdown"
                      onSelect={(d) =>
                        setForm({
                          ...form,
                          birthdate: d ? format(d, "yyyy-MM-dd") : "",
                        })
                      }
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="projectId">Proyecto asignado</Label>
                <Select
                  value={form.projectId}
                  onValueChange={(v) => setForm({ ...form, projectId: v })}
                >
                  <SelectTrigger id="projectId">
                    <SelectValue placeholder="Sin proyecto" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Sin proyecto</SelectItem>
                    {projects.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-3 col-span-2 mt-2">
                <Switch
                  id="isActive"
                  checked={form.isActive}
                  onCheckedChange={(v) => setForm({ ...form, isActive: v })}
                />
                <Label htmlFor="isActive">Miembro activo</Label>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={closeDialog}
                disabled={submitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting && <Spinner className="mr-2" />}
                {editing ? "Guardar cambios" : "Crear miembro"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Eliminar */}
      <Dialog open={target !== null} onOpenChange={(o) => !o && setDeleteId(null)}>
        <DialogContent className="sm:max-w-[460px]">
          {target && (
            <>
              <DialogHeader>
                <DialogTitle>Eliminar miembro</DialogTitle>
                <DialogDescription>
                  Esta acción no se puede deshacer.
                </DialogDescription>
              </DialogHeader>
              <Alert variant="destructive">
                <AlertTitle>¿Eliminar a {target.name}?</AlertTitle>
                <AlertDescription>
                  Se quitará de los proyectos que tenía asignados.
                </AlertDescription>
              </Alert>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setDeleteId(null)}
                  disabled={submitting}
                >
                  Cancelar
                </Button>
                <Button
                  variant="destructive"
                  onClick={confirmDelete}
                  disabled={submitting}
                >
                  {submitting && <Spinner className="mr-2" />}
                  Eliminar
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
