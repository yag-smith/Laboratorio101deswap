"use client"

import * as React from "react"
import {
  FolderKanbanIcon,
  CheckCircle2Icon,
  ClockIcon,
  UsersIcon,
} from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useData } from "@/context/DataContext"

export function OverviewSection() {
  const { projects, tasks, members } = useData()

  const completedTasks = tasks.filter((t) => t.status === "Completado").length
  const inProgressTasks = tasks.filter((t) => t.status === "En progreso").length
  const activeMembers = members.filter((m) => m.isActive).length
  const inProgressProjects = projects.filter((p) => p.status === "En progreso").length

  const avgProgress =
    projects.length === 0
      ? 0
      : Math.round(
          projects.reduce((acc, p) => acc + p.progress, 0) / projects.length,
        )

  const recentTasks = [...tasks]
    .sort((a, b) => (a.dateline < b.dateline ? 1 : -1))
    .slice(0, 5)

  const stats = [
    {
      title: "Total Proyectos",
      value: projects.length,
      hint: `${inProgressProjects} en progreso`,
      icon: <FolderKanbanIcon className="h-5 w-5 text-sky-600" />,
      iconBg: "bg-sky-100",
    },
    {
      title: "Tareas Completadas",
      value: completedTasks,
      hint: `de ${tasks.length} tareas totales`,
      icon: <CheckCircle2Icon className="h-5 w-5 text-emerald-600" />,
      iconBg: "bg-emerald-100",
    },
    {
      title: "Tareas en Progreso",
      value: inProgressTasks,
      hint: `Avance promedio: ${avgProgress}%`,
      icon: <ClockIcon className="h-5 w-5 text-amber-600" />,
      iconBg: "bg-amber-100",
    },
    {
      title: "Miembros Activos",
      value: activeMembers,
      hint: `${members.length - activeMembers} inactivos`,
      icon: <UsersIcon className="h-5 w-5 text-violet-600" />,
      iconBg: "bg-violet-100",
    },
  ]

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.title} className="transition-shadow hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {s.title}
              </CardTitle>
              <span
                className={`inline-flex h-9 w-9 items-center justify-center rounded-full ${s.iconBg}`}
              >
                {s.icon}
              </span>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{s.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{s.hint}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Próximas tareas</CardTitle>
          <CardDescription>
            Tareas ordenadas por fecha límite más reciente.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentTasks.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Aún no hay tareas registradas.
              </p>
            )}
            {recentTasks.map((task) => {
              const member = members.find((m) => m.id === task.userId)
              const project = projects.find((p) => p.id === task.projectId)
              return (
                <div key={task.id} className="flex items-center gap-4">
                  <Avatar>
                    <AvatarFallback>
                      {(member?.name ?? "?").slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium leading-none">
                      {member?.name ?? "Sin asignar"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {task.description}{" "}
                      <span className="font-medium">· {project?.name ?? "—"}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        task.status === "Completado"
                          ? "default"
                          : task.status === "En progreso"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {task.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {task.dateline}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
