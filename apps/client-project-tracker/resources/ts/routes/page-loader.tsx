import { Skeleton } from "@/components/ui/skeleton"

export default function PageLoader() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Generic top block */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-full max-w-2xl" />
        <Skeleton className="h-4 w-5/6 max-w-xl" />
      </div>

      {/* Generic content blocks */}
      <div className="space-y-6">
        <Skeleton className="h-40 w-full rounded-xl" />

        <div className="grid gap-4 sm:grid-cols-2">
          <Skeleton className="h-28 w-full rounded-xl" />
          <Skeleton className="h-28 w-full rounded-xl" />
        </div>

        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>

        <Skeleton className="h-24 w-full rounded-xl" />
      </div>
    </div>
  )
}
