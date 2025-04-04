import { createClient } from "@supabase/supabase-js"
import type { Database } from "./database.types"

// Use the specific Supabase URL
const supabaseUrl = "https://pefxqlnxqffrrzxdqtan.supabase.co"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Create the Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})

// Add some debugging to help identify issues
console.log("Server Supabase client initialized with URL:", supabaseUrl)

