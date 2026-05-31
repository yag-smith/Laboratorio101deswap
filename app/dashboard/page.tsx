"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProjectForm } from "@/components/ProjectForm"
import { OverviewSection } from "@/components/OverviewSection"
import { ProjectsSection } from "@/components/ProjectsSection"
import { MembersSection } from "@/components/MembersSection"
import { TasksTable } from "@/components/TasksTable"
import { SettingsSection } from "@/components/SettingsSection"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-slate-100 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="rounded-2xl bg-gradient-to-r from-sky-500 via-sky-600 to-sky-700 p-6 md:p-8 shadow-lg shadow-sky-200/60">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="text-white">
              <h1 className="text-3xl md:text-4xl font-bold mb-1">
                Dashboard de Proyectos
              </h1>
              <p className="text-sky-50/90">
                Gestiona proyectos, equipo y tareas con shadcn/ui.
              </p>
            </div>
            <ProjectForm />
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="bg-white shadow-sm">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="projects">Proyectos</TabsTrigger>
            <TabsTrigger value="tasks">Tareas</TabsTrigger>
            <TabsTrigger value="team">Equipo</TabsTrigger>
            <TabsTrigger value="settings">Configuración</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <OverviewSection />
          </TabsContent>

          <TabsContent value="projects" className="space-y-4">
            <ProjectsSection />
          </TabsContent>

          <TabsContent value="tasks" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Gestión de Tareas</CardTitle>
                <CardDescription>
                  Administra todas las tareas de tus proyectos.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TasksTable />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="team" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Miembros del Equipo</CardTitle>
                <CardDescription>
                  CRUD completo del equipo de trabajo.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MembersSection />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Configuración</CardTitle>
                <CardDescription>
                  Administra las preferencias de tu organización.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SettingsSection />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
