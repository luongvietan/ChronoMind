import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import type { TeamMember } from "@/lib/types"

interface TeamMembersListProps {
  members: TeamMember[]
}

export function TeamMembersList({ members }: TeamMembersListProps) {
  if (members.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        <p>No team members found</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {members.map((member) => (
        <div key={member.id} className="flex items-center gap-3">
          <div className="relative">
            <Avatar>
              <AvatarImage src={member.avatar} alt={member.name} />
              <AvatarFallback>{member.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <span
              className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${member.online ? "bg-green-500" : "bg-gray-300"}`}
            />
          </div>

          <div className="flex-1">
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium">{member.name}</p>
              <Badge variant={member.online ? "default" : "outline"} className="text-xs">
                {member.online ? "Online" : "Offline"}
              </Badge>
            </div>
            {member.currentTask && (
              <p className="text-xs text-muted-foreground mt-0.5">Working on: {member.currentTask}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

