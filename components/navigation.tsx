"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, CalendarClock, Users, Settings, PlusCircle, LogOut } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, signOut } = useAuth()

  const routes = [
    {
      href: "/",
      label: "Dashboard",
      icon: LayoutDashboard,
      active: pathname === "/",
    },
    {
      href: "/calendar",
      label: "Calendar",
      icon: CalendarClock,
      active: pathname === "/calendar",
    },
    {
      href: "/team",
      label: "Team",
      icon: Users,
      active: pathname === "/team",
    },
    {
      href: "/settings",
      label: "Settings",
      icon: Settings,
      active: pathname === "/settings",
    },
  ]

  const handleSignOut = async () => {
    await signOut()
    router.push("/auth/login")
  }

  if (!user) {
    return null
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-10 bg-background border-t lg:relative lg:border-t-0 lg:border-r lg:h-screen lg:w-64">
      <div className="flex lg:flex-col p-4">
        <div className="hidden lg:flex items-center gap-2 mb-8 mt-4">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold">C</span>
          </div>
          <h1 className="text-xl font-bold">ChronoMind</h1>
        </div>

        <div className="flex justify-between w-full lg:flex-col lg:space-y-2">
          {routes.map((route) => (
            <Link key={route.href} href={route.href}>
              <Button variant={route.active ? "default" : "ghost"} className="w-full justify-start">
                <route.icon className="h-5 w-5 mr-2" />
                <span className="hidden lg:inline">{route.label}</span>
              </Button>
            </Link>
          ))}
        </div>

        <div className="hidden lg:block mt-auto">
          <div className="flex items-center gap-3 mb-4 px-2 py-3">
            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
              {user.email?.substring(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">{user.email}</p>
            </div>
          </div>

          <Button variant="outline" className="w-full justify-start text-destructive" onClick={handleSignOut}>
            <LogOut className="h-5 w-5 mr-2" />
            Sign Out
          </Button>
        </div>

        <div className="hidden lg:block mt-4 mb-8">
          <Link href="/add-task">
            <Button className="w-full">
              <PlusCircle className="h-5 w-5 mr-2" />
              Add New Task
            </Button>
          </Link>
        </div>
      </div>

      <div className="fixed right-4 bottom-20 lg:hidden">
        <Link href="/add-task">
          <Button size="icon" className="h-14 w-14 rounded-full shadow-lg">
            <PlusCircle className="h-6 w-6" />
          </Button>
        </Link>
      </div>
    </div>
  )
}

