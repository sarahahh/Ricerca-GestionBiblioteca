// Admin-only endpoint

import { NextResponse } from "next/server"
import { mockApi } from "@/lib/mock-api"

// SUPABASE MIGRATION:
// const supabase = createServerClient()
// const { data, error } = await supabase
//   .from('users')
//   .update({ role })
//   .eq('id', userId)
//   .select()
//   .single()

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { role } = body

    // Validation
    if (!role || !["ADMIN", "USER"].includes(role)) {
      return NextResponse.json({ error: "Rol inválido" }, { status: 400 })
    }

    // TODO: Add authentication check
    // Verify current user is ADMIN

    const result = await mockApi.users.updateRole(params.id, role)
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: "Error al actualizar usuario" }, { status: 500 })
  }
}
