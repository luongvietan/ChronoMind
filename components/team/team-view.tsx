"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useTeam } from "@/hooks/use-team"
import { TeamMembersList } from "@/components/dashboard/team-members-list"
import { TeamProgressRing } from "@/components/dashboard/team-progress-ring"
import { useTasks } from "@/hooks/use-tasks"
import { UserPlus } from "lucide-react"

export function TeamView() {
  const { members, isLoading: membersLoading } = useTeam()
  const { tasks, isLoading: tasksLoading } = useTasks({ teamId: members.length > 0 ? "team-id" : undefined })

  const completedTasks = tasks.filter((task) => task.completed).length
  const totalTasks = tasks.length
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  const isLoading = membersLoading || tasksLoading

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            Team Members
            <Button variant="outline" size="sm">
              <UserPlus className="h-4 w-4 mr-2" />
              Invite
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <TeamMembersList members={members} />
          )}
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Team Progress</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col items-center justify-center">
                <TeamProgressRing progress={progress} />
                <p className="text-sm text-muted-foreground mt-2">{progress}% of team tasks completed</p>
              </div>
              <div>
                <h3 className="font-medium mb-3">Task Statistics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Total Tasks:</span>
                    <span className="font-medium">{totalTasks}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Completed:</span>
                    <span className="font-medium text-success">{completedTasks}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pending:</span>
                    <span className="font-medium text-secondary">{totalTasks - completedTasks}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

