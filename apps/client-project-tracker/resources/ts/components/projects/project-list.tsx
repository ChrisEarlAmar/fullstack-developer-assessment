import { CalendarDaysIcon, EllipsisVerticalIcon, PencilIcon, Trash2Icon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { Project, ProjectPriority, ProjectStatus } from "@/features/projects/types"

interface ProjectListProps {
  projects: Project[]
  onDelete: (project: Project) => void
  onEdit: (project: Project) => void
}

const statusStyles: Record<ProjectStatus, string> = {
  Planning: "border-sky-500/25 bg-sky-500/10 text-sky-700 dark:text-sky-300",
  "In Progress": "border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  "On Hold": "border-violet-500/25 bg-violet-500/10 text-violet-700 dark:text-violet-300",
  Completed: "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
}

const priorityStyles: Record<ProjectPriority, string> = {
  Low: "border-slate-500/20 bg-slate-500/10 text-slate-700 dark:text-slate-300",
  Medium: "border-blue-500/25 bg-blue-500/10 text-blue-700 dark:text-blue-300",
  High: "border-rose-500/25 bg-rose-500/10 text-rose-700 dark:text-rose-300",
}

function projectDateFormatter(value: string): string {
  const [year, month, day] = value.split("-").map(Number)

  if (!year || !month || !day) {
    return value
  }

  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
    year: "numeric",
  }).format(new Date(Date.UTC(year, month - 1, day)))
}

function StatusBadge({ status }: { status: ProjectStatus }) {
  return (
    <Badge className={statusStyles[status]} variant="outline">
      {status}
    </Badge>
  )
}

function PriorityBadge({ priority }: { priority: ProjectPriority }) {
  return (
    <Badge className={priorityStyles[priority]} variant="outline">
      {priority}
    </Badge>
  )
}

function ProjectActions({
  project,
  onDelete,
  onEdit,
}: {
  project: Project
  onDelete: (project: Project) => void
  onEdit: (project: Project) => void
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            aria-label={"Actions for " + project.projectName}
            size="icon-sm"
            type="button"
            variant="ghost"
          />
        }
      >
        <EllipsisVerticalIcon />
        <span className="sr-only">Open project actions</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onEdit(project)}>
          <PencilIcon />
          Edit project
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onDelete(project)} variant="destructive">
          <Trash2Icon />
          Delete project
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function ProjectList({ projects, onDelete, onEdit }: ProjectListProps) {
  return (
    <>
      <Card className="hidden overflow-hidden md:flex">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="px-4">Project</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Start date</TableHead>
              <TableHead>Due date</TableHead>
              <TableHead className="w-12">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell className="max-w-68 px-4 font-medium">
                  <div className="truncate">{project.projectName}</div>
                  {project.description ? (
                    <div className="mt-0.5 truncate text-xs font-normal text-muted-foreground">
                      {project.description}
                    </div>
                  ) : null}
                </TableCell>
                <TableCell className="max-w-44 truncate">{project.clientName}</TableCell>
                <TableCell>
                  <StatusBadge status={project.status} />
                </TableCell>
                <TableCell>
                  <PriorityBadge priority={project.priority} />
                </TableCell>
                <TableCell>{projectDateFormatter(project.startDate)}</TableCell>
                <TableCell>{projectDateFormatter(project.dueDate)}</TableCell>
                <TableCell>
                  <ProjectActions onDelete={onDelete} onEdit={onEdit} project={project} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <div className="grid gap-3 md:hidden">
        {projects.map((project) => (
          <Card key={project.id} size="sm">
            <CardHeader className="gap-2">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <CardTitle className="truncate">{project.projectName}</CardTitle>
                  <p className="mt-1 truncate text-sm text-muted-foreground">
                    {project.clientName}
                  </p>
                </div>
                <ProjectActions onDelete={onDelete} onEdit={onEdit} project={project} />
              </div>
              <div className="flex flex-wrap gap-1.5">
                <StatusBadge status={project.status} />
                <PriorityBadge priority={project.priority} />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {project.description ? (
                <p className="line-clamp-2 text-sm text-muted-foreground">{project.description}</p>
              ) : (
                <p className="text-sm text-muted-foreground">No description provided.</p>
              )}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <CalendarDaysIcon className="size-3.5" />
                <span>
                  {projectDateFormatter(project.startDate)} –{" "}
                  {projectDateFormatter(project.dueDate)}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  )
}
