// Currently uses mock data, easily replaceable with Supabase

import { NextResponse } from "next/server"
import { mockApi } from "@/lib/mock-api"

// SUPABASE MIGRATION:
// Replace mockApi with Supabase client:
// import { createServerClient } from '@/lib/supabase/server'
// const supabase = createServerClient()
// const { data, error } = await supabase.from('maestros').select('*')

export async function GET() {
  try {
    const maestros = await mockApi.maestros.getAll()
    return NextResponse.json(maestros)
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener maestros" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { nombre, saldo, creadoPor } = body

    // Validation
    if (!nombre || typeof saldo !== "number") {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 })
    }

    // SUPABASE MIGRATION:
    // const { data, error } = await supabase
    //   .from('maestros')
    //   .insert({ nombre, saldo, creado_por: creadoPor })
    //   .select()
    //   .single()

    const newMaestro = await mockApi.maestros.create({
      nombre,
      saldo,
      creadoPor,
    })

    return NextResponse.json(newMaestro, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Error al crear maestro" }, { status: 500 })
  }
}
