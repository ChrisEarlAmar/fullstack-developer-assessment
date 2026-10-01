import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SearchIcon, BookOpenIcon, MessageCircleIcon, LifeBuoyIcon } from "lucide-react"

const resources = [
  {
    title: "Documentation",
    description: "Browse our comprehensive guides and API references.",
    icon: BookOpenIcon,
  },
  {
    title: "Community Forum",
    description: "Ask questions and share knowledge with other users.",
    icon: MessageCircleIcon,
  },
  {
    title: "Support",
    description: "Get in touch with our support team for assistance.",
    icon: LifeBuoyIcon,
  },
]

export default function Help() {
  return (
    <div className="flex flex-col gap-6 py-4 md:gap-8 md:py-6">
      <div className="px-4 lg:px-6">
        <h2 className="text-lg font-semibold">Help Center</h2>
        <p className="text-sm text-muted-foreground">How can we help you today?</p>
      </div>

      <div className="relative px-4 lg:px-6">
        <SearchIcon className="absolute left-7 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search documentation..." className="pl-10" />
      </div>

      <div className="grid grid-cols-1 gap-4 px-4 lg:grid-cols-3 lg:px-6">
        {resources.map((resource) => {
          const Icon = resource.icon
          return (
            <Card key={resource.title}>
              <CardHeader>
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="size-5 text-primary" />
                </div>
                <CardTitle className="mt-2 text-base">{resource.title}</CardTitle>
                <CardDescription>{resource.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Get started
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
