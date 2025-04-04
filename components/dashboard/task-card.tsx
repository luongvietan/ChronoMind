import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import type { Task } from "@/lib/types"
import { formatDistanceToNow } from "date-fns"
import { Clock, Tag } from "lucide-react"

interface TaskCardProps {
  task: Task
  onComplete: (completed: boolean) => void
}

export function TaskCard({ task, onComplete }: TaskCardProps) {
  const isOverdue = new Date(task.deadline) < new Date() && !task.completed
  const tags = task.tags || []

  return (
    <Card
      className={`
      border-l-4 
      ${task.completed ? "border-l-success" : isOverdue ? "border-l-destructive" : "border-l-primary"}
      transition-all duration-300 hover:shadow-md
    `}
    >
      <CardContent className="p-3 flex items-start gap-3">
        <Checkbox
          checked={task.completed}
          onCheckedChange={onComplete}
          className={`mt-1 ${task.completed ? "bg-success border-success" : ""}`}
        />

        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className={`font-medium ${task.completed ? "line-through text-muted-foreground" : ""}`}>
              {task.title}
            </h3>
            <div className="flex items-center text-xs text-muted-foreground">
              <Clock className="h-3 w-3 mr-1" />
              <span className={isOverdue ? "text-destructive font-medium" : ""}>
                {formatDistanceToNow(new Date(task.deadline), { addSuffix: true })}
              </span>
            </div>
          </div>

          <div className="flex mt-2 gap-1">
            {tags.length > 0 ? (
              tags.map((tag) => (
                <Badge key={tag} variant="outline" className="flex items-center gap-1 text-xs">
                  <Tag className="h-3 w-3" />
                  {tag}
                </Badge>
              ))
            ) : (
              <Badge variant="outline" className="flex items-center gap-1 text-xs">
                <Tag className="h-3 w-3" />
                Task
              </Badge>
            )}
            <Badge variant="outline" className="flex items-center gap-1 text-xs">
              P{task.priority}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

