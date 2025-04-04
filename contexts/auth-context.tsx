"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { supabaseBrowser } from "@/lib/supabase-browser"
import type { Session, User } from "@supabase/supabase-js"

type AuthContextType = {
  user: User | null
  session: Session | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, name: string) => Promise<{ error: any; data: any }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const initializeAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabaseBrowser.auth.getSession()
        setSession(session)
        setUser(session?.user ?? null)
      } catch (error) {
        console.error("Error getting session:", error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()

    // Listen for auth changes
    try {
      const {
        data: { subscription },
      } = supabaseBrowser.auth.onAuthStateChange((_event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        setIsLoading(false)
      })

      return () => subscription.unsubscribe()
    } catch (error) {
      console.error("Error setting up auth subscription:", error)
      setIsLoading(false)
      return () => {}
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabaseBrowser.auth.signInWithPassword({ email, password })
      return { error }
    } catch (error) {
      console.error("Sign in error:", error)
      return {
        error: error instanceof Error ? error : new Error("An error occurred during sign in"),
      }
    }
  }

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const { data, error } = await supabaseBrowser.auth.signUp({
        email,
        password,
        options: {
          data: { name },
        },
      })

      if (!error && data.user) {
        // Create user profile in the users table
        try {
          await supabaseBrowser.from("users").insert({
            id: data.user.id,
            email: data.user.email!,
            name,
            role: "editor",
          })
        } catch (profileError) {
          console.error("Error creating user profile:", profileError)
        }
      }

      return { data, error }
    } catch (err) {
      console.error("Sign up error:", err)
      return {
        data: null,
        error: err instanceof Error ? err : new Error("An error occurred during sign up"),
      }
    }
  }

  const signOut = async () => {
    try {
      await supabaseBrowser.auth.signOut()
    } catch (error) {
      console.error("Sign out error:", error)
    }
  }

  const value = {
    user,
    session,
    isLoading,
    signIn,
    signUp,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

