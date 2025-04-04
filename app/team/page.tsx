import { TeamView } from "@/components/team/team-view"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function TeamPage() {
  return (
    <ProtectedRoute>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Team</h1>
        <TeamView />
      </div>
    </ProtectedRoute>
  )
}

