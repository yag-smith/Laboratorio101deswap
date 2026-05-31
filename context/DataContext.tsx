"use client"

import * as React from "react"

export type ProjectStatus = "Planificado" | "En progreso" | "En revisión" | "Completado"
export type ProjectPriority = "low" | "medium" | "high" | "urgent"
export type ProjectCategory = "web" | "mobile" | "design" | "marketing" | "other"

export interface Project {
  id: string
  name: string
  description: string
  category: ProjectCategory
  priority: ProjectPriority
  status: ProjectStatus
  progress: number
  memberIds: string[]
  createdAt: string
}

export interface Member {
  id: string
  userId: string
  name: string
  role: string
  email: string
  position: string
  birthdate: string
  phone: string
  projectId: string | null
  isActive: boolean
}

export type TaskStatus = "Pendiente" | "En progreso" | "Completado"
export type TaskPriority = "Baja" | "Media" | "Alta" | "Urgente"

export interface TaskItem {
  id: string
  description: string
  projectId: string
  status: TaskStatus
  priority: TaskPriority
  userId: string
  dateline: string
}

export interface Settings {
  organizationName: string
  contactEmail: string
  language: "es" | "en"
  timezone: string
  emailNotifications: boolean
  pushNotifications: boolean
  darkMode: boolean
}

interface DataContextValue {
  projects: Project[]
  members: Member[]
  tasks: TaskItem[]
  settings: Settings
  addProject: (input: Omit<Project, "id" | "createdAt" | "progress" | "status"> & { progress?: number; status?: ProjectStatus }) => Project
  updateProject: (id: string, patch: Partial<Project>) => void
  removeProject: (id: string) => void
  addMember: (input: Omit<Member, "id">) => Member
  updateMember: (id: string, patch: Partial<Member>) => void
  removeMember: (id: string) => void
  addTask: (input: Omit<TaskItem, "id">) => TaskItem
  updateTask: (id: string, patch: Partial<TaskItem>) => void
  removeTask: (id: string) => void
  updateSettings: (patch: Partial<Settings>) => void
}

const DataContext = React.createContext<DataContextValue | null>(null)

const uid = () => Math.random().toString(36).slice(2, 10)

const seedMembers: Member[] = [
  {
    id: "m1",
    userId: "u-001",
    name: "María García",
    role: "Frontend Developer",
    email: "maria@example.com",
    position: "Senior",
    birthdate: "1995-04-12",
    phone: "+51 987 654 321",
    projectId: "p1",
    isActive: true,
  },
  {
    id: "m2",
    userId: "u-002",
    name: "Juan Pérez",
    role: "Backend Developer",
    email: "juan@example.com",
    position: "Mid",
    birthdate: "1992-09-03",
    phone: "+51 999 123 456",
    projectId: "p1",
    isActive: true,
  },
  {
    id: "m3",
    userId: "u-003",
    name: "Ana López",
    role: "UI/UX Designer",
    email: "ana@example.com",
    position: "Senior",
    birthdate: "1990-11-22",
    phone: "+51 977 888 999",
    projectId: "p2",
    isActive: false,
  },
  {
    id: "m4",
    userId: "u-004",
    name: "Carlos Ruiz",
    role: "DevOps Engineer",
    email: "carlos@example.com",
    position: "Senior",
    birthdate: "1988-06-30",
    phone: "+51 911 222 333",
    projectId: "p3",
    isActive: true,
  },
  {
    id: "m5",
    userId: "u-005",
    name: "Laura Martínez",
    role: "Project Manager",
    email: "laura@example.com",
    position: "Lead",
    birthdate: "1985-01-18",
    phone: "+51 955 444 555",
    projectId: "p2",
    isActive: true,
  },
]

const seedProjects: Project[] = [
  {
    id: "p1",
    name: "E-commerce Platform",
    description: "Plataforma de comercio electrónico con Next.js",
    category: "web",
    priority: "high",
    status: "En progreso",
    progress: 65,
    memberIds: ["m1", "m2"],
    createdAt: "2026-03-10",
  },
  {
    id: "p2",
    name: "Mobile App",
    description: "Aplicación móvil con React Native",
    category: "mobile",
    priority: "medium",
    status: "En revisión",
    progress: 90,
    memberIds: ["m3", "m5"],
    createdAt: "2026-02-15",
  },
  {
    id: "p3",
    name: "API Gateway",
    description: "Microservicios con Node.js",
    category: "web",
    priority: "urgent",
    status: "En progreso",
    progress: 45,
    memberIds: ["m4"],
    createdAt: "2026-04-01",
  },
  {
    id: "p4",
    name: "Design System",
    description: "Librería de componentes reutilizables",
    category: "design",
    priority: "low",
    status: "Completado",
    progress: 100,
    memberIds: ["m3"],
    createdAt: "2026-01-20",
  },
]

const seedTasks: TaskItem[] = [
  { id: "t1", description: "Implementar autenticación", projectId: "p1", status: "En progreso", priority: "Alta", userId: "m1", dateline: "2026-06-15" },
  { id: "t2", description: "Diseñar pantalla de perfil", projectId: "p2", status: "Pendiente", priority: "Media", userId: "m3", dateline: "2026-06-20" },
  { id: "t3", description: "Configurar CI/CD", projectId: "p3", status: "Completado", priority: "Alta", userId: "m4", dateline: "2026-05-25" },
  { id: "t4", description: "Optimizar queries SQL", projectId: "p1", status: "En progreso", priority: "Urgente", userId: "m2", dateline: "2026-06-10" },
  { id: "t5", description: "Documentar API endpoints", projectId: "p3", status: "Pendiente", priority: "Baja", userId: "m4", dateline: "2026-07-05" },
  { id: "t6", description: "Setup testing E2E", projectId: "p1", status: "Pendiente", priority: "Media", userId: "m1", dateline: "2026-06-28" },
  { id: "t7", description: "Migrar a Tailwind v4", projectId: "p4", status: "Completado", priority: "Baja", userId: "m3", dateline: "2026-05-01" },
  { id: "t8", description: "Integrar pasarela de pago", projectId: "p1", status: "Pendiente", priority: "Urgente", userId: "m2", dateline: "2026-06-30" },
  { id: "t9", description: "Push notifications", projectId: "p2", status: "En progreso", priority: "Media", userId: "m5", dateline: "2026-07-10" },
  { id: "t10", description: "Auditoría de accesibilidad", projectId: "p4", status: "Pendiente", priority: "Media", userId: "m3", dateline: "2026-07-15" },
  { id: "t11", description: "Implementar rate limiting", projectId: "p3", status: "En progreso", priority: "Alta", userId: "m4", dateline: "2026-06-22" },
  { id: "t12", description: "Refactor del carrito", projectId: "p1", status: "Pendiente", priority: "Media", userId: "m1", dateline: "2026-07-02" },
  { id: "t13", description: "Soporte multi-idioma", projectId: "p2", status: "Pendiente", priority: "Baja", userId: "m5", dateline: "2026-07-20" },
  { id: "t14", description: "Monitoreo con Grafana", projectId: "p3", status: "Pendiente", priority: "Media", userId: "m4", dateline: "2026-07-12" },
]

const seedSettings: Settings = {
  organizationName: "Mi Organización",
  contactEmail: "admin@example.com",
  language: "es",
  timezone: "America/Lima",
  emailNotifications: true,
  pushNotifications: false,
  darkMode: false,
}

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = React.useState<Project[]>(seedProjects)
  const [members, setMembers] = React.useState<Member[]>(seedMembers)
  const [tasks, setTasks] = React.useState<TaskItem[]>(seedTasks)
  const [settings, setSettings] = React.useState<Settings>(seedSettings)

  const addProject: DataContextValue["addProject"] = (input) => {
    const project: Project = {
      id: uid(),
      createdAt: new Date().toISOString().slice(0, 10),
      progress: input.progress ?? 0,
      status: input.status ?? "Planificado",
      name: input.name,
      description: input.description,
      category: input.category,
      priority: input.priority,
      memberIds: input.memberIds,
    }
    setProjects((prev) => [project, ...prev])
    return project
  }

  const updateProject: DataContextValue["updateProject"] = (id, patch) => {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)))
  }

  const removeProject: DataContextValue["removeProject"] = (id) => {
    setProjects((prev) => prev.filter((p) => p.id !== id))
    setTasks((prev) => prev.filter((t) => t.projectId !== id))
    setMembers((prev) =>
      prev.map((m) => (m.projectId === id ? { ...m, projectId: null } : m)),
    )
  }

  const addMember: DataContextValue["addMember"] = (input) => {
    const member: Member = { id: uid(), ...input }
    setMembers((prev) => [member, ...prev])
    return member
  }

  const updateMember: DataContextValue["updateMember"] = (id, patch) => {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch } : m)))
  }

  const removeMember: DataContextValue["removeMember"] = (id) => {
    setMembers((prev) => prev.filter((m) => m.id !== id))
    setProjects((prev) =>
      prev.map((p) => ({ ...p, memberIds: p.memberIds.filter((mid) => mid !== id) })),
    )
  }

  const addTask: DataContextValue["addTask"] = (input) => {
    const task: TaskItem = { id: uid(), ...input }
    setTasks((prev) => [task, ...prev])
    return task
  }

  const updateTask: DataContextValue["updateTask"] = (id, patch) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)))
  }

  const removeTask: DataContextValue["removeTask"] = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }

  const updateSettings: DataContextValue["updateSettings"] = (patch) => {
    setSettings((prev) => ({ ...prev, ...patch }))
  }

  const value: DataContextValue = {
    projects,
    members,
    tasks,
    settings,
    addProject,
    updateProject,
    removeProject,
    addMember,
    updateMember,
    removeMember,
    addTask,
    updateTask,
    removeTask,
    updateSettings,
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData() {
  const ctx = React.useContext(DataContext)
  if (!ctx) throw new Error("useData must be used inside <DataProvider>")
  return ctx
}
