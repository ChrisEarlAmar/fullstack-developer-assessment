import type {
  Project,
  ProjectFieldErrors,
  ProjectFilters,
  ProjectInput,
  ProjectPage,
  ProjectPagination,
} from "@/features/projects/types"

interface ProjectResponse {
  data: Project
}

interface ProjectCollectionResponse {
  data: Project[]
  meta: {
    current_page: number
    from: number | null
    last_page: number
    per_page: number
    to: number | null
    total: number
  }
}

interface LaravelErrorResponse {
  message?: unknown
  errors?: Record<string, unknown>
}

const fieldNameMap: Record<string, keyof ProjectInput> = {
  clientName: "clientName",
  client_name: "clientName",
  projectName: "projectName",
  project_name: "projectName",
  description: "description",
  status: "status",
  priority: "priority",
  startDate: "startDate",
  start_date: "startDate",
  dueDate: "dueDate",
  due_date: "dueDate",
}

export class ProjectApiError extends Error {
  readonly fieldErrors: ProjectFieldErrors

  constructor(
    message: string,
    readonly status: number,
    fieldErrors: ProjectFieldErrors = {}
  ) {
    super(message)
    this.name = "ProjectApiError"
    this.fieldErrors = fieldErrors
  }
}

function isLaravelErrorResponse(value: unknown): value is LaravelErrorResponse {
  return typeof value === "object" && value !== null
}

function firstMessage(value: unknown): string | undefined {
  if (Array.isArray(value) && typeof value[0] === "string") {
    return value[0]
  }

  return typeof value === "string" ? value : undefined
}

function toProjectApiError(status: number, body: unknown): ProjectApiError {
  if (!isLaravelErrorResponse(body)) {
    return new ProjectApiError("Something went wrong. Please try again.", status)
  }

  const fieldErrors: ProjectFieldErrors = {}

  if (body.errors) {
    for (const [key, value] of Object.entries(body.errors)) {
      const field = fieldNameMap[key]
      const message = firstMessage(value)

      if (field && message) {
        fieldErrors[field] = message
      }
    }
  }

  const message =
    typeof body.message === "string" ? body.message : "Something went wrong. Please try again."

  return new ProjectApiError(message, status, fieldErrors)
}

async function getResponseBody(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type") ?? ""

  if (!contentType.includes("application/json")) {
    return null
  }

  try {
    return await response.json()
  } catch {
    return null
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: {
      Accept: "application/json",
      ...init.headers,
    },
    credentials: "same-origin",
  })

  if (response.status === 204) {
    return undefined as T
  }

  const body = await getResponseBody(response)

  if (!response.ok) {
    throw toProjectApiError(response.status, body)
  }

  return body as T
}

function projectUrl(id?: number): string {
  return id === undefined ? "/api/projects" : "/api/projects/" + id
}

function projectQuery(filters: ProjectFilters): string {
  const query = new URLSearchParams()

  if (filters.search.trim()) {
    query.set("search", filters.search.trim())
  }

  if (filters.status) {
    query.set("status", filters.status)
  }

  if (filters.priority) {
    query.set("priority", filters.priority)
  }

  query.set("sort", filters.sort)
  query.set("direction", filters.direction)
  query.set("page", String(filters.page))
  query.set("perPage", "20")

  return query.toString()
}

export async function listProjects(
  filters: ProjectFilters,
  signal?: AbortSignal
): Promise<ProjectPage> {
  const query = projectQuery(filters)
  const response = await request<ProjectCollectionResponse>(
    projectUrl() + (query ? "?" + query : ""),
    { signal }
  )

  const pagination: ProjectPagination = {
    currentPage: response.meta.current_page,
    from: response.meta.from,
    lastPage: response.meta.last_page,
    perPage: response.meta.per_page,
    to: response.meta.to,
    total: response.meta.total,
  }

  return { projects: response.data, pagination }
}

export async function createProject(input: ProjectInput): Promise<Project> {
  const response = await request<ProjectResponse>(projectUrl(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })

  return response.data
}

export async function updateProject(id: number, input: ProjectInput): Promise<Project> {
  const response = await request<ProjectResponse>(projectUrl(id), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })

  return response.data
}

export async function deleteProject(id: number): Promise<void> {
  await request<void>(projectUrl(id), { method: "DELETE" })
}
