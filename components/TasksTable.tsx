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

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"
import {
  useData,
  type TaskItem,
  type TaskStatus,
  type TaskPriority,
} from "@/context/DataContext"
import { cn } from "@/lib/utils"

interface TaskFormState {
  description: string
  projectId: string
  status: TaskStatus
  priority: TaskPriority
  userId: string
  dateline: string
}

const emptyTask: TaskFormState = {
  description: "",
  projectId: "",
  status: "Pendiente",
  priority: "Media",
  userId: "",
  dateline: "",
}

const PAGE_SIZE = 5

const statusVariant = (status: TaskStatus) => {
  switch (status) {
    case "Completado":
      return "default" as const
    case "En progreso":
      return "secondary" as const
    default:
      return "outline" as const
  }
}

const priorityVariant = (priority: TaskPriority) => {
  switch (priority) {
    case "Urgente":
      return "destructive" as const
    case "Alta":
      return "default" as const
    case "Media":
      return "secondary" as const
    default:
      return "outline" as const
  }
}

export function TasksTable() {
  const { tasks, projects, members, addTask, updateTask, removeTask } = useData()
  const [creating, setCreating] = React.useState(false)
  const [editing, setEditing] = React.useState<TaskItem | null>(null)
  const [form, setForm] = React.useState<TaskFormState>(emptyTask)
  const [errors, setErrors] = React.useState<string[]>([])
  const [submitting, setSubmitting] = React.useState(false)
  const [deleteId, setDeleteId] = React.useState<string | null>(null)
  const [page, setPage] = React.useState(1)

  const totalPages = Math.max(1, Math.ceil(tasks.length / PAGE_SIZE))
  React.useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [page, totalPages])

  const paged = React.useMemo(
    () => tasks.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [tasks, page],
  )

  function openCreate() {
    setCreating(true)
    setEditing(null)
    setForm(emptyTask)
    setErrors([])
  }

  function openEdit(task: TaskItem) {
    setEditing(task)
    setCreating(false)
    setForm({
      description: task.description,
      projectId: task.projectId,
      status: task.status,
      priority: task.priority,
      userId: task.userId,
      dateline: task.dateline,
    })
    setErrors([])
  }

  function closeDialog() {
    setCreating(false)
    setEditing(null)
    setErrors([])
    setForm(emptyTask)
  }

  const dialogOpen = creating || editing !== null

  function validate(): string[] {
    const errs: string[] = []
    if (!form.description.trim()) errs.push("Descripción es obligatoria.")
    if (!form.projectId) errs.push("Selecciona un proyecto.")
    if (!form.userId) errs.push("Asigna a un miembro.")
    if (!form.dateline) errs.push("Selecciona una fecha límite.")
    return errs
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    setErrors(errs)
    if (errs.length > 0) return

    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 600))
    const payload = {
      description: form.description.trim(),
      projectId: form.projectId,
      status: form.status,
      priority: form.priority,
      userId: form.userId,
      dateline: form.dateline,
    }
    if (editing) updateTask(editing.id, payload)
    else addTask(payload)
    setSubmitting(false)
    closeDialog()
  }

  async function confirmDelete() {
    if (!deleteId) return
    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 400))
    removeTask(deleteId)
    setSubmitting(false)
    setDeleteId(null)
  }

  const target = tasks.find((t) => t.id === deleteId) ?? null
  const parsedDate =
    form.dateline && isValid(parse(form.dateline, "yyyy-MM-dd", new Date()))
      ? parse(form.dateline, "yyyy-MM-dd", new Date())
      : undefined

  const pageNumbers = React.useMemo(() => {
    const arr: (number | "ellipsis")[] = []
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || Math.abs(i - page) <= 1) {
        arr.push(i)
      } else if (arr[arr.length - 1] !== "ellipsis") {
        arr.push("ellipsis")
      }
    }
    return arr
  }, [totalPages, page])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Tareas ({tasks.length})</h3>
          <p className="text-sm text-muted-foreground">
            Página {page} de {totalPages}
          </p>
        </div>
        <Button onClick={openCreate}>
          <PlusIcon className="mr-2 h-4 w-4" /> Nueva tarea
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableCaption>
            {tasks.length === 0
              ? "No hay tareas aún."
              : "Lista paginada de tareas"}
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Descripción</TableHead>
              <TableHead>Proyecto</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Prioridad</TableHead>
              <TableHead>Asignado a</TableHead>
              <TableHead>Fecha límite</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paged.map((task) => {
              const project = projects.find((p) => p.id === task.projectId)
              const member = members.find((m) => m.id === task.userId)
              return (
                <TableRow key={task.id}>
                  <TableCell className="font-medium">{task.description}</TableCell>
                  <TableCell>{project?.name ?? "—"}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant(task.status)}>{task.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={priorityVariant(task.priority)}>{task.priority}</Badge>
                  </TableCell>
                  <TableCell>{member?.name ?? "—"}</TableCell>
                  <TableCell>{task.dateline}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(task)}>
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => setDeleteId(task.id)}
                    >
                      <Trash2Icon className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  setPage((p) => Math.max(1, p - 1))
                }}
              />
            </PaginationItem>
            {pageNumbers.map((n, i) =>
              n === "ellipsis" ? (
                <PaginationItem key={`e-${i}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem key={n}>
                  <PaginationLink
                    href="#"
                    isActive={n === page}
                    onClick={(e) => {
                      e.preventDefault()
                      setPage(n)
                    }}
                  >
                    {n}
                  </PaginationLink>
                </PaginationItem>
              ),
            )}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  setPage((p) => Math.min(totalPages, p + 1))
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      <Dialog open={dialogOpen} onOpenChange={(o) => !o && closeDialog()}>
        <DialogContent className="sm:max-w-[560px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>{editing ? "Editar tarea" : "Nueva tarea"}</DialogTitle>
              <DialogDescription>
                Configura los detalles de la tarea.
              </DialogDescription>
            </DialogHeader>

            {errors.length > 0 && (
              <Alert variant="destructive" className="my-3">
                <AlertCircleIcon />
                <AlertTitle>Faltan datos</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc pl-4 mt-1">
                    {errors.map((e) => (
                      <li key={e}>{e}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            <div className="grid gap-3 py-2">
              <div className="grid gap-1.5">
                <Label htmlFor="description">Descripción</Label>
                <Input
                  id="description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Ej. Implementar login con OAuth"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1.5">
                  <Label htmlFor="projectId">Proyecto</Label>
                  <Select
                    value={form.projectId}
                    onValueChange={(v) => setForm({ ...form, projectId: v })}
                  >
                    <SelectTrigger id="projectId">
                      <SelectValue placeholder="Selecciona" />
                    </SelectTrigger>
                    <SelectContent>
                      {projects.length === 0 && (
                        <SelectItem value="none" disabled>
                          Sin proyectos
                        </SelectItem>
                      )}
                      {projects.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-1.5">
                  <Label htmlFor="userId">Asignado a</Label>
                  <Select
                    value={form.userId}
                    onValueChange={(v) => setForm({ ...form, userId: v })}
                  >
                    <SelectTrigger id="userId">
                      <SelectValue placeholder="Selecciona" />
                    </SelectTrigger>
                    <SelectContent>
                      {members.length === 0 && (
                        <SelectItem value="none" disabled>
                          Sin miembros
                        </SelectItem>
                      )}
                      {members.map((m) => (
                        <SelectItem key={m.id} value={m.id}>
                          {m.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-1.5">
                  <Label htmlFor="status">Estado</Label>
                  <Select
                    value={form.status}
                    onValueChange={(v) =>
                      setForm({ ...form, status: v as TaskStatus })
                    }
                  >
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pendiente">Pendiente</SelectItem>
                      <SelectItem value="En progreso">En progreso</SelectItem>
                      <SelectItem value="Completado">Completado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-1.5">
                  <Label htmlFor="priority">Prioridad</Label>
                  <Select
                    value={form.priority}
                    onValueChange={(v) =>
                      setForm({ ...form, priority: v as TaskPriority })
                    }
                  >
                    <SelectTrigger id="priority">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Baja">Baja</SelectItem>
                      <SelectItem value="Media">Media</SelectItem>
                      <SelectItem value="Alta">Alta</SelectItem>
                      <SelectItem value="Urgente">Urgente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-1.5">
                <Label>Fecha límite (dateline)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className={cn(
                        "justify-start text-left font-normal",
                        !form.dateline && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {parsedDate ? format(parsedDate, "yyyy-MM-dd") : "Selecciona"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={parsedDate}
                      captionLayout="dropdown"
                      onSelect={(d) =>
                        setForm({
                          ...form,
                          dateline: d ? format(d, "yyyy-MM-dd") : "",
                        })
                      }
                    />
                  </PopoverContent>
                </Popover>
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
                {editing ? "Guardar cambios" : "Crear tarea"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={target !== null} onOpenChange={(o) => !o && setDeleteId(null)}>
        <DialogContent className="sm:max-w-[440px]">
          {target && (
            <>
              <DialogHeader>
                <DialogTitle>Eliminar tarea</DialogTitle>
                <DialogDescription>Acción irreversible.</DialogDescription>
              </DialogHeader>
              <Alert variant="destructive">
                <AlertTitle>¿Eliminar &quot;{target.description}&quot;?</AlertTitle>
                <AlertDescription>
                  La tarea desaparecerá de su proyecto.
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
