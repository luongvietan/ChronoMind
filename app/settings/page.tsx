import { SettingsView } from "@/components/settings/settings-view"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>
        <SettingsView />
      </div>
    </ProtectedRoute>
  )
}

