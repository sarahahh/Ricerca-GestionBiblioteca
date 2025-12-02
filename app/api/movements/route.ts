// Supports filtering by maestroId query parameter

import { NextResponse } from "next/server"
import { mockApi } from "@/lib/mock-api"

// SUPABASE MIGRATION:
// const supabase = createServerClient()
// For filtered query:
// const { data } = await supabase
//   .from('movements')
//   .select('*')
//   .eq('maestro_id', maestroId)

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const maestroId = searchParams.get("maestroId")

    const movements = maestroId ? await mockApi.movements.getByMaestro(maestroId) : await mockApi.movements.getAll()

    return NextResponse.json(movements)
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener movimientos" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { maestroId, maestroNombre, tipo, cantidad, responsable } = body

    // Validation
    if (!maestroId || !tipo || typeof cantidad !== "number") {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 })
    }

    // SUPABASE MIGRATION:
    // const { data, error } = await supabase
    //   .from('movements')
    //   .insert({
    //     maestro_id: maestroId,
    //     maestro_nombre: maestroNombre,
    //     tipo,
    //     cantidad,
    //     responsable,
    //   })
    //   .select()
    //   .single()

    const newMovement = await mockApi.movements.create({
      maestroId,
      maestroNombre,
      tipo,
      cantidad,
      responsable,
    })

    return NextResponse.json(newMovement, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Error al crear movimiento" }, { status: 500 })
  }
}
