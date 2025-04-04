import type { Task, TimelineTask, TeamMember } from "./types"

export const mockTasks: Task[] = [
  {
    id: "task-1",
    title: "Complete project proposal",
    priority: 5,
    deadline: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
    tags: ["Work", "Urgent"],
    completed: false,
  },
  {
    id: "task-2",
    title: "Review marketing materials",
    priority: 3,
    deadline: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(), // 5 hours from now
    tags: ["Work", "Marketing"],
    completed: false,
  },
  {
    id: "task-3",
    title: "Schedule team meeting",
    priority: 2,
    deadline: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
    tags: ["Work", "Meeting"],
    completed: true,
  },
  {
    id: "task-4",
    title: "Prepare presentation slides",
    priority: 4,
    deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 1 day from now
    tags: ["Work", "Presentation"],
    completed: false,
  },
]

export const mockTimelineData: TimelineTask[] = [
  {
    id: "timeline-1",
    title: "Project Proposal",
    startTime: new Date(new Date().setHours(9, 0, 0, 0)).toISOString(),
    endTime: new Date(new Date().setHours(10, 30, 0, 0)).toISOString(),
    color: "#88D9E6",
  },
  {
    id: "timeline-2",
    title: "Team Meeting",
    startTime: new Date(new Date().setHours(11, 0, 0, 0)).toISOString(),
    endTime: new Date(new Date().setHours(12, 0, 0, 0)).toISOString(),
    color: "#FFB347",
  },
  {
    id: "timeline-3",
    title: "Marketing Review",
    startTime: new Date(new Date().setHours(13, 30, 0, 0)).toISOString(),
    endTime: new Date(new Date().setHours(15, 0, 0, 0)).toISOString(),
    color: "#77DD77",
  },
  {
    id: "timeline-4",
    title: "Presentation Prep",
    startTime: new Date(new Date().setHours(15, 30, 0, 0)).toISOString(),
    endTime: new Date(new Date().setHours(17, 0, 0, 0)).toISOString(),
    color: "#FF6B6B",
  },
]

export const mockTeamMembers: TeamMember[] = [
  {
    id: "user-1",
    name: "Alex Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    online: true,
    currentTask: "Project Proposal",
  },
  {
    id: "user-2",
    name: "Sarah Williams",
    avatar: "/placeholder.svg?height=40&width=40",
    online: true,
    currentTask: "Marketing Review",
  },
  {
    id: "user-3",
    name: "Michael Chen",
    avatar: "/placeholder.svg?height=40&width=40",
    online: false,
  },
  {
    id: "user-4",
    name: "Emily Rodriguez",
    avatar: "/placeholder.svg?height=40&width=40",
    online: false,
  },
]

