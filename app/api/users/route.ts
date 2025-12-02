// Admin-only endpoint for user management

import { NextResponse } from "next/server"
import { mockApi } from "@/lib/mock-api"

// SUPABASE MIGRATION:
// const supabase = createServerClient()
// Add RLS policy check:
// const { data: currentUser } = await supabase.auth.getUser()
// Check if user.role === 'ADMIN' before proceeding

export async function GET() {
  try {
    // TODO: Add authentication check here
    // const session = await getServerSession()
    // if (!session || session.user.role !== 'ADMIN') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    const users = await mockApi.users.getAll()
    return NextResponse.json(users)
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener usuarios" }, { status: 500 })
  }
}
