import type { ReactNode } from "react"
import { FolderKanbanIcon } from "lucide-react"

export interface NavItem {
  title: string
  url: string
  icon: ReactNode
}

export const navMain: NavItem[] = [
  { title: "Projects", url: "/projects", icon: <FolderKanbanIcon /> },
]
