import * as React from "react"
import { FolderKanbanIcon } from "lucide-react"
import { NavLink } from "react-router-dom"

import { NavMain } from "@/components/nav-main"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { navMain } from "@/routes/navigation"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="data-[slot=sidebar-menu-button]:h-auto data-[slot=sidebar-menu-button]:p-2"
              render={<NavLink to="/projects" />}
              tooltip="Client Project Tracker"
            >
              <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <FolderKanbanIcon className="size-4" />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold">Client Project Tracker</span>
                <span className="block truncate text-xs text-muted-foreground">
                  Project workspace
                </span>
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
    </Sidebar>
  )
}
