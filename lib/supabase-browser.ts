"use client"

import { createBrowserClient } from "@supabase/ssr"
import type { Database } from "./database.types"

// Use the specific Supabase URL
const supabaseUrl = "https://pefxqlnxqffrrzxdqtan.supabase.co"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const createBrowserSupabaseClient = () => {
  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
}

// Create a singleton instance for the browser
export const supabaseBrowser = createBrowserSupabaseClient()

// Add some debugging to help identify issues
console.log("Browser Supabase client initialized with URL:", supabaseUrl)

