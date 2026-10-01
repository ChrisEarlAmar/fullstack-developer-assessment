import { SearchIcon, SlidersHorizontalIcon, XIcon } from "lucide-react"

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
  DEFAULT_PROJECT_FILTERS,
  isProjectPriority,
  isProjectSortField,
  isProjectStatus,
  type ProjectFilters,
  type ProjectPriority,
  type ProjectStatus,
  type SortDirection,
} from "@/features/projects/types"

interface ProjectFiltersProps {
  filters: ProjectFilters
  onChange: (filters: ProjectFilters) => void
}

const sortOptions = [
  { value: "dueDate:asc", label: "Due date: soonest" },
  { value: "dueDate:desc", label: "Due date: latest" },
  { value: "projectName:asc", label: "Project name: A–Z" },
  { value: "clientName:asc", label: "Client name: A–Z" },
] as const

const statusLabels: Record<ProjectStatus | "all", string> = {
  all: "All statuses",
  Planning: "Planning",
  "In Progress": "In progress",
  "On Hold": "On hold",
  Completed: "Completed",
}

const priorityLabels: Record<ProjectPriority | "all", string> = {
  all: "All priorities",
  High: "High priority",
  Medium: "Medium priority",
  Low: "Low priority",
}

const sortLabels = Object.fromEntries(sortOptions.map((option) => [option.value, option.label]))

function isSortDirection(value: string): value is SortDirection {
  return value === "asc" || value === "desc"
}

export function ProjectFilters({ filters, onChange }: ProjectFiltersProps) {
  const hasActiveFilters = Boolean(filters.search || filters.status || filters.priority)

  function updateSort(value: string | null) {
    const [sort, direction] = (value ?? "").split(":")

    if (isProjectSortField(sort) && isSortDirection(direction)) {
      onChange({ ...filters, sort, direction })
    }
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border bg-card p-3 shadow-sm sm:p-4">
      <div className="flex items-center gap-2 text-sm font-medium">
        <SlidersHorizontalIcon className="size-4 text-muted-foreground" />
        Filter projects
      </div>
      <div className="grid gap-3 lg:grid-cols-[minmax(15rem,1fr)_10rem_10rem_12rem_auto]">
        <div className="grid gap-1.5">
          <Label htmlFor="project-search">Search</Label>
          <div className="relative">
            <SearchIcon
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              className="pl-8"
              id="project-search"
              onChange={(event) => onChange({ ...filters, search: event.target.value })}
              placeholder="Client or project name"
              type="search"
              value={filters.search}
            />
          </div>
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="status-filter">Status</Label>
          <Select
            onValueChange={(value) => {
              onChange({
                ...filters,
                status:
                  value === "all" ? undefined : isProjectStatus(value) ? value : filters.status,
              })
            }}
            value={filters.status ?? "all"}
          >
            <SelectTrigger className="w-full" id="status-filter">
              <SelectValue>{(value) => statusLabels[value as ProjectStatus | "all"]}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="Planning">Planning</SelectItem>
              <SelectItem value="In Progress">In progress</SelectItem>
              <SelectItem value="On Hold">On hold</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="priority-filter">Priority</Label>
          <Select
            onValueChange={(value) => {
              onChange({
                ...filters,
                priority:
                  value === "all" ? undefined : isProjectPriority(value) ? value : filters.priority,
              })
            }}
            value={filters.priority ?? "all"}
          >
            <SelectTrigger className="w-full" id="priority-filter">
              <SelectValue>
                {(value) => priorityLabels[value as ProjectPriority | "all"]}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All priorities</SelectItem>
              <SelectItem value="High">High priority</SelectItem>
              <SelectItem value="Medium">Medium priority</SelectItem>
              <SelectItem value="Low">Low priority</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="project-sort">Sort by</Label>
          <Select onValueChange={updateSort} value={filters.sort + ":" + filters.direction}>
            <SelectTrigger className="w-full" id="project-sort">
              <SelectValue>{(value) => sortLabels[value as keyof typeof sortLabels]}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-end">
          {hasActiveFilters ? (
            <Button
              aria-label="Clear project filters"
              className="w-full justify-center lg:w-auto"
              onClick={() => onChange({ ...DEFAULT_PROJECT_FILTERS })}
              size="default"
              type="button"
              variant="ghost"
            >
              <XIcon />
              Clear
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  )
}
