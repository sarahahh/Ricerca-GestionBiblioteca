// This allows easy migration from mock to Supabase without touching component code

// API Client - Frontend abstraction layer
// Components will call these functions instead of mockApi directly
// When migrating to Supabase, only update the API routes, not the components

export const apiClient = {
  maestros: {
    getAll: async () => {
      const response = await fetch("/api/maestros")
      if (!response.ok) throw new Error("Error al cargar maestros")
      return response.json()
    },
    create: async (data: { nombre: string; saldo: number }) => {
      const response = await fetch("/api/maestros", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error("Error al crear maestro")
      return response.json()
    },
  },

  movements: {
    getByMaestro: async (maestroId: string) => {
      const response = await fetch(`/api/movements?maestroId=${maestroId}`)
      if (!response.ok) throw new Error("Error al cargar movimientos")
      return response.json()
    },
    getAll: async () => {
      const response = await fetch("/api/movements")
      if (!response.ok) throw new Error("Error al cargar movimientos")
      return response.json()
    },
    create: async (data: {
      maestroId: string
      maestroNombre: string
      tipo: "ENTRADA" | "SALIDA"
      cantidad: number
    }) => {
      const response = await fetch("/api/movements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error("Error al crear movimiento")
      return response.json()
    },
  },

  users: {
    getAll: async () => {
      const response = await fetch("/api/users")
      if (!response.ok) throw new Error("Error al cargar usuarios")
      return response.json()
    },
    updateRole: async (userId: string, role: "ADMIN" | "USER") => {
      const response = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      })
      if (!response.ok) throw new Error("Error al actualizar usuario")
      return response.json()
    },
  },
}
