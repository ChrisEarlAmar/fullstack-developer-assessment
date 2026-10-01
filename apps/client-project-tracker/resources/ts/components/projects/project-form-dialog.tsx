import { useState, type FormEvent } from "react"
import { LoaderCircleIcon, SaveIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import {
  emptyProjectInput,
  isProjectPriority,
  isProjectStatus,
  projectToInput,
  type Project,
  type ProjectFieldErrors,
  type ProjectInput,
} from "@/features/projects/types"

// Centered dialog shared by project creation and editing.
interface ProjectFormDialogProps {
  fieldErrors: ProjectFieldErrors
  isSubmitting: boolean
  onClearErrors: () => void
  onOpenChange: (open: boolean) => void
  onSubmit: (input: ProjectInput) => Promise<void>
  open: boolean
  project: Project | null
  submitError: string | null
}

function validateProject(input: ProjectInput): ProjectFieldErrors {
  const errors: ProjectFieldErrors = {}

  if (!input.clientName) {
    errors.clientName = "Client name is required."
  }

  if (!input.projectName) {
    errors.projectName = "Project name is required."
  }

  if (!input.startDate) {
    errors.startDate = "Start date is required."
  }

  if (!input.dueDate) {
    errors.dueDate = "Due date is required."
  } else if (input.startDate && input.dueDate < input.startDate) {
    errors.dueDate = "Due date must be on or after the start date."
  }

  return errors
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) {
    return null
  }

  return (
    <p className="text-sm text-destructive" id={id} role="alert">
      {message}
    </p>
  )
}

export function ProjectFormDialog({
  fieldErrors,
  isSubmitting,
  onClearErrors,
  onOpenChange,
  onSubmit,
  open,
  project,
  submitError,
}: ProjectFormDialogProps) {
  const [values, setValues] = useState<ProjectInput>(() =>
    project ? projectToInput(project) : emptyProjectInput()
  )
  const [clientErrors, setClientErrors] = useState<ProjectFieldErrors>({})
  const isEditing = project !== null
  const errors = { ...clientErrors, ...fieldErrors }

  function updateValue<K extends keyof ProjectInput>(field: K, value: ProjectInput[K]) {
    setValues((current) => ({ ...current, [field]: value }))
    setClientErrors((current) => {
      const next = { ...current }
      delete next[field]

      if (field === "startDate") {
        delete next.dueDate
      }

      return next
    })
    onClearErrors()
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const input: ProjectInput = {
      ...values,
      clientName: values.clientName.trim(),
      description: values.description?.trim() || null,
      projectName: values.projectName.trim(),
    }
    const nextClientErrors = validateProject(input)

    if (Object.keys(nextClientErrors).length > 0) {
      setClientErrors(nextClientErrors)
      return
    }

    setClientErrors({})
    await onSubmit(input)
  }

  return (
    <Dialog
      onOpenChange={(nextOpen) => {
        if (!isSubmitting) {
          onOpenChange(nextOpen)
        }
      }}
      open={open}
    >
      <DialogContent className="max-w-2xl gap-0 overflow-hidden p-0">
        <DialogHeader className="p-5 pr-12 pb-0">
          <DialogTitle>{isEditing ? "Edit project" : "New project"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the project details, status, and planned dates."
              : "Add a client project to the tracker."}
          </DialogDescription>
        </DialogHeader>

        <form
          className="grid gap-5 overflow-y-auto px-5 py-5"
          id="project-form"
          onSubmit={handleSubmit}
        >
          {submitError ? (
            <div
              className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
              role="alert"
            >
              {submitError}
            </div>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="client-name">
                Client name{" "}
                <span aria-hidden="true" className="text-destructive">
                  *
                </span>
              </Label>
              <Input
                aria-describedby={errors.clientName ? "client-name-error" : undefined}
                aria-invalid={Boolean(errors.clientName) || undefined}
                autoComplete="organization"
                disabled={isSubmitting}
                id="client-name"
                maxLength={255}
                onChange={(event) => updateValue("clientName", event.target.value)}
                required
                value={values.clientName}
              />
              <FieldError id="client-name-error" message={errors.clientName} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="project-name">
                Project name{" "}
                <span aria-hidden="true" className="text-destructive">
                  *
                </span>
              </Label>
              <Input
                aria-describedby={errors.projectName ? "project-name-error" : undefined}
                aria-invalid={Boolean(errors.projectName) || undefined}
                disabled={isSubmitting}
                id="project-name"
                maxLength={255}
                onChange={(event) => updateValue("projectName", event.target.value)}
                required
                value={values.projectName}
              />
              <FieldError id="project-name-error" message={errors.projectName} />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              aria-describedby={errors.description ? "description-error" : undefined}
              aria-invalid={Boolean(errors.description) || undefined}
              disabled={isSubmitting}
              id="description"
              maxLength={5000}
              onChange={(event) => updateValue("description", event.target.value)}
              placeholder="Add context, goals, or delivery notes."
              value={values.description ?? ""}
            />
            <FieldError id="description-error" message={errors.description} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="project-status">
                Status{" "}
                <span aria-hidden="true" className="text-destructive">
                  *
                </span>
              </Label>
              <Select
                onValueChange={(value) => {
                  if (isProjectStatus(value)) {
                    updateValue("status", value)
                  }
                }}
                value={values.status}
              >
                <SelectTrigger
                  aria-describedby={errors.status ? "project-status-error" : undefined}
                  aria-invalid={Boolean(errors.status) || undefined}
                  disabled={isSubmitting}
                  id="project-status"
                >
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Planning">Planning</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="On Hold">On Hold</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <FieldError id="project-status-error" message={errors.status} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="project-priority">
                Priority{" "}
                <span aria-hidden="true" className="text-destructive">
                  *
                </span>
              </Label>
              <Select
                onValueChange={(value) => {
                  if (isProjectPriority(value)) {
                    updateValue("priority", value)
                  }
                }}
                value={values.priority}
              >
                <SelectTrigger
                  aria-describedby={errors.priority ? "project-priority-error" : undefined}
                  aria-invalid={Boolean(errors.priority) || undefined}
                  disabled={isSubmitting}
                  id="project-priority"
                >
                  <SelectValue placeholder="Select a priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
              <FieldError id="project-priority-error" message={errors.priority} />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="start-date">
                Start date{" "}
                <span aria-hidden="true" className="text-destructive">
                  *
                </span>
              </Label>
              <Input
                aria-describedby={errors.startDate ? "start-date-error" : undefined}
                aria-invalid={Boolean(errors.startDate) || undefined}
                disabled={isSubmitting}
                id="start-date"
                onChange={(event) => updateValue("startDate", event.target.value)}
                required
                type="date"
                value={values.startDate}
              />
              <FieldError id="start-date-error" message={errors.startDate} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="due-date">
                Due date{" "}
                <span aria-hidden="true" className="text-destructive">
                  *
                </span>
              </Label>
              <Input
                aria-describedby={errors.dueDate ? "due-date-error" : undefined}
                aria-invalid={Boolean(errors.dueDate) || undefined}
                disabled={isSubmitting}
                id="due-date"
                min={values.startDate || undefined}
                onChange={(event) => updateValue("dueDate", event.target.value)}
                required
                type="date"
                value={values.dueDate}
              />
              <FieldError id="due-date-error" message={errors.dueDate} />
            </div>
          </div>
        </form>

        <DialogFooter className="border-t px-5 py-4">
          <Button
            disabled={isSubmitting}
            onClick={() => onOpenChange(false)}
            type="button"
            variant="outline"
          >
            Cancel
          </Button>
          <Button disabled={isSubmitting} form="project-form" type="submit">
            {isSubmitting ? <LoaderCircleIcon className="animate-spin" /> : <SaveIcon />}
            {isSubmitting ? "Saving…" : isEditing ? "Save changes" : "Create project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
