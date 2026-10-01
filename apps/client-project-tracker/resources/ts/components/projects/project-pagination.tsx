import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { ProjectPagination as ProjectPaginationState } from "@/features/projects/types"

interface ProjectPaginationProps {
  onPageChange: (page: number) => void
  pagination: ProjectPaginationState
}

export function ProjectPagination({ onPageChange, pagination }: ProjectPaginationProps) {
  const range =
    pagination.from === null || pagination.to === null
      ? "No projects to display"
      : `Showing ${pagination.from}–${pagination.to} of ${pagination.total} projects`

  return (
    <nav
      aria-label="Project pagination"
      className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <p className="text-sm text-muted-foreground">{range}</p>
      <div className="flex items-center gap-2 self-end sm:self-auto">
        <span className="mr-1 text-sm text-muted-foreground">
          Page {pagination.currentPage} of {pagination.lastPage} · {pagination.perPage} per page
        </span>
        <Button
          aria-label="Previous page"
          disabled={pagination.currentPage === 1}
          onClick={() => onPageChange(pagination.currentPage - 1)}
          size="icon-sm"
          type="button"
          variant="outline"
        >
          <ChevronLeftIcon />
        </Button>
        <Button
          aria-label="Next page"
          disabled={pagination.currentPage === pagination.lastPage}
          onClick={() => onPageChange(pagination.currentPage + 1)}
          size="icon-sm"
          type="button"
          variant="outline"
        >
          <ChevronRightIcon />
        </Button>
      </div>
    </nav>
  )
}
