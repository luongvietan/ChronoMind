import { AddTaskForm } from "@/components/add-task/add-task-form"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function AddTaskPage() {
  return (
    <ProtectedRoute>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Add New Task</h1>
        <AddTaskForm />
      </div>
    </ProtectedRoute>
  )
}

