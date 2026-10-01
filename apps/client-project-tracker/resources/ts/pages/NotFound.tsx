import { HomeIcon } from "lucide-react"
import { Link, useLocation } from "react-router-dom"

import { Button } from "@/components/ui/button"

export default function NotFound() {
  const { pathname } = useLocation()

  return (
    <main className="flex min-h-[calc(100vh-var(--header-height))] flex-1 items-center justify-center px-4 py-12 lg:px-6">
      <section className="max-w-md space-y-5 text-center">
        <p className="text-sm font-medium text-muted-foreground">Error 404</p>
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight">Page not found</h2>
          <p className="text-sm text-muted-foreground">
            There is no page at <code className="rounded bg-muted px-1.5 py-0.5">{pathname}</code>.
          </p>
        </div>
        <Button render={<Link to="/projects" />}>
          <HomeIcon data-icon="inline-start" />
          Back to projects
        </Button>
      </section>
    </main>
  )
}
