import { LoaderCircleIcon, Trash2Icon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { Project } from "@/features/projects/types"

// Alert dialog used to require an explicit confirmation before deletion.
interface DeleteProjectDialogProps {
  error: string | null
  isDeleting: boolean
  onConfirm: () => Promise<void>
  onOpenChange: (open: boolean) => void
  open: boolean
  project: Project | null
}

export function DeleteProjectDialog({
  error,
  isDeleting,
  onConfirm,
  onOpenChange,
  open,
  project,
}: DeleteProjectDialogProps) {
  if (!project) {
    return null
  }

  return (
    <AlertDialog
      onOpenChange={(nextOpen) => {
        if (!isDeleting) {
          onOpenChange(nextOpen)
        }
      }}
      open={open}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete project?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently remove <strong>{project.projectName}</strong> for{" "}
            {project.clientName}. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {error ? (
          <div
            className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
            role="alert"
          >
            {error}
          </div>
        ) : null}

        <AlertDialogFooter>
          <Button
            disabled={isDeleting}
            onClick={() => onOpenChange(false)}
            type="button"
            variant="outline"
          >
            Cancel
          </Button>
          <Button disabled={isDeleting} onClick={onConfirm} type="button" variant="destructive">
            {isDeleting ? <LoaderCircleIcon className="animate-spin" /> : <Trash2Icon />}
            {isDeleting ? "Deleting…" : "Delete project"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
