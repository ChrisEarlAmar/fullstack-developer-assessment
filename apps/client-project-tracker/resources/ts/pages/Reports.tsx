import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DownloadIcon, FileTextIcon, TrendingUpIcon } from "lucide-react"

const reports = [
  { title: "Monthly Revenue Report", date: "May 1, 2026", type: "Financial", downloads: 24 },
  { title: "User Engagement Q2", date: "Apr 15, 2026", type: "Analytics", downloads: 18 },
  { title: "Project Performance", date: "Apr 10, 2026", type: "Operations", downloads: 31 },
  { title: "Security Compliance", date: "Mar 28, 2026", type: "Security", downloads: 12 },
  { title: "Customer Satisfaction", date: "Mar 15, 2026", type: "Survey", downloads: 45 },
  { title: "Infrastructure Costs", date: "Mar 1, 2026", type: "Financial", downloads: 9 },
]

export default function Reports() {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="flex items-center justify-between px-4 lg:px-6">
        <div>
          <h2 className="text-lg font-semibold">Reports</h2>
          <p className="text-sm text-muted-foreground">Download and manage generated reports</p>
        </div>
        <Button variant="outline">
          <TrendingUpIcon />
          Generate Report
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-4 px-4 lg:grid-cols-2 lg:px-6 xl:grid-cols-3">
        {reports.map((report) => (
          <Card key={report.title}>
            <CardHeader className="flex-row items-start gap-4 space-y-0">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <FileTextIcon className="size-5 text-primary" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-base">{report.title}</CardTitle>
                <CardDescription>{report.date}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <Badge variant="outline">{report.type}</Badge>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{report.downloads} downloads</span>
                <Button variant="ghost" size="icon-sm">
                  <DownloadIcon />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
