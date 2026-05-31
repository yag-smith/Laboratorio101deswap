"use client"

import * as React from "react"
import { Trash2Icon, EyeIcon, UsersIcon } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"
import { useData, type Project } from "@/context/DataContext"

const statusVariant = (status: Project["status"]) => {
  switch (status) {
    case "Completado":
      return "default"
    case "En revisión":
      return "secondary"
    case "En progreso":
      return "outline"
    default:
      return "outline"
  }
}

const priorityLabel: Record<Project["priority"], string> = {
  low: "Baja",
  medium: "Media",
  high: "Alta",
  urgent: "Urgente",
}

const categoryLabel: Record<Project["category"], string> = {
  web: "Web",
  mobile: "Mobile",
  design: "Diseño",
  marketing: "Marketing",
  other: "Otro",
}

export function ProjectsSection() {
  const { projects, members, tasks, removeProject } = useData()
  const [detailId, setDetailId] = React.useState<string | null>(null)
  const [deleteId, setDeleteId] = React.useState<string | null>(null)
  const [deleting, setDeleting] = React.useState(false)

  const detail = projects.find((p) => p.id === detailId) ?? null
  const target = projects.find((p) => p.id === deleteId) ?? null

  async function confirmDelete() {
    if (!deleteId) return
    setDeleting(true)
    await new Promise((r) => setTimeout(r, 600))
    removeProject(deleteId)
    setDeleting(false)
    setDeleteId(null)
  }

  if (projects.length === 0) {
    return (
      <Alert>
        <AlertTitle>No hay proyectos</AlertTitle>
        <AlertDescription>
          Crea tu primer proyecto con el botón &quot;Nuevo Proyecto&quot;.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => {
          const teamCount = project.memberIds.length
          return (
            <Card
              key={project.id}
              className="flex flex-col transition-all hover:shadow-lg hover:shadow-sky-100 hover:-translate-y-0.5 border-t-4 border-t-sky-500/80"
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                    <CardDescription>{project.description || "Sin descripción"}</CardDescription>
                  </div>
                  <Badge variant={statusVariant(project.status)}>{project.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Progreso</span>
                      <span className="font-medium">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <Badge variant="outline">{categoryLabel[project.category]}</Badge>
                    <Badge variant="outline">{priorityLabel[project.priority]}</Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4 pt-3 border-t">
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <UsersIcon className="h-4 w-4" />
                    {teamCount} miembro{teamCount === 1 ? "" : "s"}
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setDetailId(project.id)}
                    >
                      <EyeIcon className="h-4 w-4 mr-1" /> Detalles
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                      onClick={() => setDeleteId(project.id)}
                    >
                      <Trash2Icon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Detalles */}
      <Dialog open={detail !== null} onOpenChange={(o) => !o && setDetailId(null)}>
        <DialogContent className="sm:max-w-[560px]">
          {detail && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {detail.name}
                  <Badge variant={statusVariant(detail.status)}>{detail.status}</Badge>
                </DialogTitle>
                <DialogDescription>{detail.description || "Sin descripción"}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Categoría</p>
                    <p className="font-medium">{categoryLabel[detail.category]}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Prioridad</p>
                    <p className="font-medium">{priorityLabel[detail.priority]}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Progreso</p>
                    <p className="font-medium">{detail.progress}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Creado</p>
                    <p className="font-medium">{detail.createdAt}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Miembros asignados ({detail.memberIds.length})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {detail.memberIds.length === 0 && (
                      <span className="text-sm text-muted-foreground">Sin miembros</span>
                    )}
                    {detail.memberIds.map((mid) => {
                      const member = members.find((m) => m.id === mid)
                      if (!member) return null
                      return (
                        <Badge key={mid} variant="secondary">
                          {member.name} · {member.role}
                        </Badge>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Tareas relacionadas
                  </p>
                  <div className="space-y-1 max-h-40 overflow-y-auto">
                    {tasks.filter((t) => t.projectId === detail.id).length === 0 && (
                      <span className="text-sm text-muted-foreground">Sin tareas</span>
                    )}
                    {tasks
                      .filter((t) => t.projectId === detail.id)
                      .map((t) => (
                        <div
                          key={t.id}
                          className="flex items-center justify-between text-sm border rounded px-2 py-1"
                        >
                          <span>{t.description}</span>
                          <Badge variant="outline" className="text-xs">
                            {t.status}
                          </Badge>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDetailId(null)}>
                  Cerrar
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Eliminar */}
      <Dialog open={target !== null} onOpenChange={(o) => !o && setDeleteId(null)}>
        <DialogContent className="sm:max-w-[480px]">
          {target && (
            <>
              <DialogHeader>
                <DialogTitle>Eliminar proyecto</DialogTitle>
                <DialogDescription>
                  Esta acción no se puede deshacer.
                </DialogDescription>
              </DialogHeader>
              <Alert variant="destructive">
                <AlertTitle>¿Eliminar &quot;{target.name}&quot;?</AlertTitle>
                <AlertDescription>
                  También se eliminarán sus tareas y los miembros quedarán sin proyecto asignado.
                </AlertDescription>
              </Alert>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setDeleteId(null)}
                  disabled={deleting}
                >
                  Cancelar
                </Button>
                <Button
                  variant="destructive"
                  onClick={confirmDelete}
                  disabled={deleting}
                >
                  {deleting && <Spinner className="mr-2" />}
                  {deleting ? "Eliminando..." : "Eliminar"}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
