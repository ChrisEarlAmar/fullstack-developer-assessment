import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

const members = [
  { name: "Alice Chen", role: "Product Designer", email: "alice@acme.com", status: "Online" },
  { name: "Bob Martinez", role: "Frontend Developer", email: "bob@acme.com", status: "Online" },
  { name: "Carol Singh", role: "Backend Developer", email: "carol@acme.com", status: "Away" },
  { name: "David Kim", role: "DevOps Engineer", email: "david@acme.com", status: "Offline" },
  { name: "Eve Johnson", role: "QA Engineer", email: "eve@acme.com", status: "Online" },
  { name: "Frank Lee", role: "Data Scientist", email: "frank@acme.com", status: "Away" },
]

export default function Team() {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="px-4 lg:px-6">
        <h2 className="text-lg font-semibold">Team Members</h2>
        <p className="text-sm text-muted-foreground">View and manage your team</p>
      </div>
      <div className="grid grid-cols-1 gap-4 px-4 lg:grid-cols-2 lg:px-6 xl:grid-cols-3">
        {members.map((member) => (
          <Card key={member.name}>
            <CardHeader className="flex-row items-center gap-4 space-y-0">
              <Avatar className="size-10">
                <AvatarImage
                  src={`https://api.dicebear.com/9.x/initials/svg?seed=${member.name}`}
                  alt={member.name}
                />
                <AvatarFallback>
                  {member.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <CardTitle className="text-base">{member.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </div>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{member.email}</span>
              <Badge variant={member.status === "Online" ? "default" : "outline"}>
                {member.status}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
