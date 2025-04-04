import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client with the correct URL
const supabaseUrl = "https://pefxqlnxqffrrzxdqtan.supabase.co"
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""
const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")
  const teamId = searchParams.get("teamId")
  const completed = searchParams.get("completed")

  try {
    // Use a simple query without relationships
    let query = supabase.from("tasks").select("*")

    if (userId) {
      query = query.eq("assigned_to", userId)
    }

    if (teamId) {
      query = query.eq("team_id", teamId)
    }

    if (completed !== null) {
      query = query.eq("completed", completed === "true")
    }

    const { data, error } = await query.order("deadline", { ascending: true })

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ tasks: data })
  } catch (err) {
    console.error("Unexpected error:", err)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const { data, error } = await supabase
      .from("tasks")
      .insert([
        {
          title: body.title,
          description: body.description,
          priority: body.priority || 3,
          deadline: body.deadline,
          completed: body.completed || false,
          created_by: body.created_by,
          assigned_to: body.assigned_to,
          team_id: body.team_id,
        },
      ])
      .select()

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ task: data[0] })
  } catch (err) {
    console.error("Unexpected error:", err)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

