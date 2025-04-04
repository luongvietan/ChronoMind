"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TeamProgressRing } from "./team-progress-ring"
import { TeamMembersList } from "./team-members-list"
import { useTeam } from "@/hooks/use-team"
import { useTasks } from "@/hooks/use-tasks"

export function TeamProgressColumn() {
  const { members, isLoading: membersLoading } = useTeam()
  const { tasks, isLoading: tasksLoading } = useTasks({ teamId: members.length > 0 ? "team-id" : undefined })

  const completedTasks = tasks.filter((task) => task.completed).length
  const totalTasks = tasks.length
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  const isLoading = membersLoading || tasksLoading

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold">Team Progress</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center">
              <TeamProgressRing progress={progress} />
              <p className="text-sm text-muted-foreground mt-2">{progress}% of team tasks completed</p>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-medium mb-3">Team Members</h3>
              <TeamMembersList members={members} />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

