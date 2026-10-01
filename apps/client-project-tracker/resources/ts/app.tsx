import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import Router from "@/routes/router"

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <Router />
      <Toaster />
    </ThemeProvider>
  )
}

const rootElement = document.getElementById("app")

if (!rootElement) {
  throw new Error('Application root "#app" was not found.')
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
)
