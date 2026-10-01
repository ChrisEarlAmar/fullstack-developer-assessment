import { lazy, Suspense, type ComponentType } from "react"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"

import PageLoader from "@/routes/page-loader"

const Page = lazy(() => import("@/layout/page"))
const NotFound = lazy(() => import("@/pages/NotFound"))
const Projects = lazy(() => import("@/pages/Projects"))

function withSuspense(Component: ComponentType) {
  return (
    <Suspense fallback={<PageLoader />}>
      <Component />
    </Suspense>
  )
}

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          element={
            <Suspense fallback={<PageLoader />}>
              <Page />
            </Suspense>
          }
        >
          <Route index element={<Navigate replace to="/projects" />} />
          <Route path="projects" element={withSuspense(Projects)} />
          <Route path="*" element={withSuspense(NotFound)} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
