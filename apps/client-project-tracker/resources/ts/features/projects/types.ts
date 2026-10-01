export const PROJECT_STATUSES = ["Planning", "In Progress", "On Hold", "Completed"] as const

export const PROJECT_PRIORITIES = ["Low", "Medium", "High"] as const

export const PROJECT_SORT_FIELDS = [
  "clientName",
  "projectName",
  "status",
  "priority",
  "startDate",
  "dueDate",
] as const

export type ProjectStatus = (typeof PROJECT_STATUSES)[number]
export type ProjectPriority = (typeof PROJECT_PRIORITIES)[number]
export type ProjectSortField = (typeof PROJECT_SORT_FIELDS)[number]
export type SortDirection = "asc" | "desc"

export interface Project {
  id: number
  clientName: string
  projectName: string
  description: string | null
  status: ProjectStatus
  priority: ProjectPriority
  startDate: string
  dueDate: string
}

export interface ProjectPagination {
  currentPage: number
  from: number | null
  lastPage: number
  perPage: number
  to: number | null
  total: number
}

export interface ProjectPage {
  projects: Project[]
  pagination: ProjectPagination
}

export interface ProjectInput {
  clientName: string
  projectName: string
  description: string | null
  status: ProjectStatus
  priority: ProjectPriority
  startDate: string
  dueDate: string
}

export interface ProjectFilters {
  page: number
  search: string
  status?: ProjectStatus
  priority?: ProjectPriority
  sort: ProjectSortField
  direction: SortDirection
}

export type ProjectFieldErrors = Partial<Record<keyof ProjectInput, string>>

export const DEFAULT_PROJECT_FILTERS: ProjectFilters = {
  page: 1,
  search: "",
  sort: "dueDate",
  direction: "asc",
}

export function emptyProjectInput(): ProjectInput {
  return {
    clientName: "",
    projectName: "",
    description: null,
    status: "Planning",
    priority: "Medium",
    startDate: "",
    dueDate: "",
  }
}

export function projectToInput(project: Project): ProjectInput {
  return {
    clientName: project.clientName,
    projectName: project.projectName,
    description: project.description,
    status: project.status,
    priority: project.priority,
    startDate: project.startDate,
    dueDate: project.dueDate,
  }
}

export function isProjectStatus(value: string | null | undefined): value is ProjectStatus {
  return PROJECT_STATUSES.includes(value as ProjectStatus)
}

export function isProjectPriority(value: string | null | undefined): value is ProjectPriority {
  return PROJECT_PRIORITIES.includes(value as ProjectPriority)
}

export function isProjectSortField(value: string | null | undefined): value is ProjectSortField {
  return PROJECT_SORT_FIELDS.includes(value as ProjectSortField)
}
