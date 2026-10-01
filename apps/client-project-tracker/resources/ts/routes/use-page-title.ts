import { useEffect } from "react"
import { useLocation } from "react-router-dom"

const applicationName = "Client Project Tracker"

function normalizePathname(pathname: string): string {
  return pathname === "/" ? pathname : pathname.replace(/\/+$/, "") || "/"
}

export function getPageTitle(pathname: string): string {
  return normalizePathname(pathname) === "/projects" ? "Projects" : "Not Found"
}

export function usePageTitle(): string {
  const { pathname } = useLocation()
  const title = getPageTitle(pathname)

  useEffect(() => {
    document.title = title + " | " + applicationName
  }, [title])

  return title
}
