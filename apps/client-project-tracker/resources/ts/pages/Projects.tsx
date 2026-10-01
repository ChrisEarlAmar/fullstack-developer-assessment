import { useCallback, useEffect, useState } from "react"
import { FolderKanbanIcon, PlusIcon, RefreshCwIcon } from "lucide-react"
import { toast } from "sonner"

import { DeleteProjectDialog } from "@/components/projects/delete-project-dialog"
import { ProjectFilters } from "@/components/projects/project-filters"
import { ProjectFormDialog } from "@/components/projects/project-form-dialog"
import { ProjectList } from "@/components/projects/project-list"
import { ProjectPagination } from "@/components/projects/project-pagination"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  createProject,
  deleteProject,
  listProjects,
  ProjectApiError,
  updateProject,
} from "@/features/projects/api"
import {
  DEFAULT_PROJECT_FILTERS,
  type Project,
  type ProjectFieldErrors,
  type ProjectFilters as ProjectFiltersState,
  type ProjectInput,
  type ProjectPagination as ProjectPaginationState,
} from "@/features/projects/types"

function readableError(error: unknown): string {
  return error instanceof Error ? error.message : "Something went wrong. Please try again."
}

function ProjectListSkeleton() {
  return (
    <Card>
      <CardContent className="space-y-3 pt-4">
        {[1, 2, 3, 4, 5].map((row) => (
          <div
            className="flex items-center justify-between gap-4 border-b pb-3 last:border-0 last:pb-0"
            key={row}
          >
            <div className="space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-32" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-16" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

function ProjectLoadError({ onRetry }: { onRetry: () => void }) {
  return (
    <Card>
      <CardContent className="flex min-h-56 flex-col items-center justify-center gap-4 p-6 text-center">
        <div className="rounded-full bg-destructive/10 p-3 text-destructive">
          <RefreshCwIcon className="size-5" />
        </div>
        <div className="space-y-1">
          <h2 className="font-medium">Projects could not be loaded</h2>
          <p className="max-w-sm text-sm text-muted-foreground">
            Check that the application is running, then try again.
          </p>
        </div>
        <Button onClick={onRetry} type="button" variant="outline">
          <RefreshCwIcon />
          Try again
        </Button>
      </CardContent>
    </Card>
  )
}

function EmptyProjects({ onCreate }: { onCreate: () => void }) {
  return (
    <Card>
      <CardContent className="flex min-h-56 flex-col items-center justify-center gap-4 p-6 text-center">
        <div className="rounded-full bg-muted p-3 text-muted-foreground">
          <FolderKanbanIcon className="size-5" />
        </div>
        <div className="space-y-1">
          <h2 className="font-medium">No projects found</h2>
          <p className="max-w-sm text-sm text-muted-foreground">
            Try changing the filters, or add the first project to the tracker.
          </p>
        </div>
        <Button onClick={onCreate} type="button">
          <PlusIcon />
          New project
        </Button>
      </CardContent>
    </Card>
  )
}

export default function Projects() {
  const [filters, setFilters] = useState<ProjectFiltersState>(() => ({
    ...DEFAULT_PROJECT_FILTERS,
  }))
  const [projects, setProjects] = useState<Project[]>([])
  const [pagination, setPagination] = useState<ProjectPaginationState | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [reloadVersion, setReloadVersion] = useState(0)

  const [formOpen, setFormOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formFieldErrors, setFormFieldErrors] = useState<ProjectFieldErrors>({})
  const [formSubmitError, setFormSubmitError] = useState<string | null>(null)

  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const refreshProjects = useCallback(() => {
    setIsLoading(true)
    setLoadError(null)
    setReloadVersion((version) => version + 1)
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    let active = true

    listProjects(filters, controller.signal)
      .then((projectPage) => {
        if (active) {
          setProjects(projectPage.projects)
          setPagination(projectPage.pagination)
        }
      })
      .catch((error: unknown) => {
        if (active && !controller.signal.aborted) {
          setLoadError(readableError(error))
        }
      })
      .finally(() => {
        if (active) {
          setIsLoading(false)
        }
      })

    return () => {
      active = false
      controller.abort()
    }
  }, [filters, reloadVersion])

  function clearFormErrors() {
    setFormFieldErrors({})
    setFormSubmitError(null)
  }

  function updateFilters(nextFilters: ProjectFiltersState) {
    setIsLoading(true)
    setLoadError(null)
    setFilters({ ...nextFilters, page: 1 })
  }

  function updatePage(page: number) {
    setIsLoading(true)
    setLoadError(null)
    setFilters((current) => ({ ...current, page }))
  }

  function handleFormOpenChange(open: boolean) {
    setFormOpen(open)

    if (!open) {
      setEditingProject(null)
      clearFormErrors()
    }
  }

  function openCreateForm() {
    setEditingProject(null)
    clearFormErrors()
    setFormOpen(true)
  }

  function openEditForm(project: Project) {
    setEditingProject(project)
    clearFormErrors()
    setFormOpen(true)
  }

  async function saveProject(input: ProjectInput) {
    setIsSubmitting(true)
    clearFormErrors()

    try {
      if (editingProject) {
        await updateProject(editingProject.id, input)
        toast.success("Project updated")
      } else {
        await createProject(input)
        toast.success("Project created")
      }

      handleFormOpenChange(false)
      refreshProjects()
    } catch (error: unknown) {
      if (error instanceof ProjectApiError) {
        setFormFieldErrors(error.fieldErrors)
      }

      setFormSubmitError(
        error instanceof ProjectApiError && Object.keys(error.fieldErrors).length > 0
          ? "Please correct the highlighted fields and try again."
          : readableError(error)
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleDeleteOpenChange(open: boolean) {
    setDeleteOpen(open)

    if (!open) {
      setDeleteTarget(null)
      setDeleteError(null)
    }
  }

  function openDeleteDialog(project: Project) {
    setDeleteTarget(project)
    setDeleteError(null)
    setDeleteOpen(true)
  }

  async function confirmDelete() {
    if (!deleteTarget) {
      return
    }

    setIsDeleting(true)
    setDeleteError(null)

    try {
      await deleteProject(deleteTarget.id)
      setProjects((current) => current.filter((project) => project.id !== deleteTarget.id))
      toast.success("Project deleted")
      handleDeleteOpenChange(false)
      refreshProjects()
    } catch (error: unknown) {
      setDeleteError(readableError(error))
    } finally {
      setIsDeleting(false)
    }
  }

  const projectCount = pagination?.total ?? projects.length
  const projectCountLabel = projectCount === 1 ? "1 project" : projectCount + " projects"

  return (
    <div className="flex flex-1 flex-col gap-5 px-4 py-5 sm:gap-6 sm:px-6 sm:py-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-primary">Client Project Tracker</p>
          <h2 className="text-2xl font-semibold tracking-tight">Projects</h2>
          <p className="text-sm text-muted-foreground">
            Track delivery work, priorities, and important dates in one place.
          </p>
        </div>
        <Button onClick={openCreateForm} type="button">
          <PlusIcon />
          New project
        </Button>
      </div>

      <ProjectFilters filters={filters} onChange={updateFilters} />

      <div className="flex items-center justify-between">
        <p aria-live="polite" className="text-sm text-muted-foreground">
          {isLoading ? "Loading projects…" : projectCountLabel}
        </p>
        <Button
          aria-label="Refresh projects"
          onClick={refreshProjects}
          size="icon-sm"
          type="button"
          variant="ghost"
        >
          <RefreshCwIcon className={isLoading ? "animate-spin" : undefined} />
        </Button>
      </div>

      {loadError ? (
        <ProjectLoadError onRetry={refreshProjects} />
      ) : isLoading && projects.length === 0 ? (
        <ProjectListSkeleton />
      ) : projects.length === 0 ? (
        <EmptyProjects onCreate={openCreateForm} />
      ) : (
        <ProjectList onDelete={openDeleteDialog} onEdit={openEditForm} projects={projects} />
      )}

      {!isLoading && !loadError && pagination && projects.length > 0 ? (
        <ProjectPagination onPageChange={updatePage} pagination={pagination} />
      ) : null}

      {formOpen ? (
        <ProjectFormDialog
          fieldErrors={formFieldErrors}
          isSubmitting={isSubmitting}
          onClearErrors={clearFormErrors}
          onOpenChange={handleFormOpenChange}
          onSubmit={saveProject}
          open={formOpen}
          project={editingProject}
          submitError={formSubmitError}
        />
      ) : null}
      <DeleteProjectDialog
        error={deleteError}
        isDeleting={isDeleting}
        onConfirm={confirmDelete}
        onOpenChange={handleDeleteOpenChange}
        open={deleteOpen}
        project={deleteTarget}
      />
    </div>
  )
}
