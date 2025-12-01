"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"

// SUPABASE INTEGRATION NOTE:
// When integrating Supabase, replace this mock context with Supabase Auth
// Install: npm install @supabase/supabase-js @supabase/ssr
// Create lib/supabase/client.ts and lib/supabase/server.ts
// Use supabase.auth.signInWithPassword() for login
// Use supabase.auth.signOut() for logout
// Use supabase.auth.getUser() to get current user

export type UserRole = "ADMIN" | "USER"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  avatarUrl: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check if user is stored in localStorage (simulated session)
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    // Protect routes - redirect to login if not authenticated
    if (!loading && !user && pathname !== "/" && pathname !== "/login") {
      router.push("/login")
    }
  }, [loading, user, pathname, router])

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setLoading(true)

    // MOCK LOGIN - Replace with Supabase authentication
    // Expected Supabase implementation:
    // const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    // if (error) return { success: false, error: error.message }
    // const { data: userData } = await supabase.from('users').select('*').eq('id', data.user.id).single()
    // setUser({ id: userData.id, email: userData.email, name: userData.name, role: userData.role, avatarUrl: userData.avatar_url })

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Import mock users
      const mockUsers = (await import("@/mock/users.json")).default
      const foundUser = mockUsers.find((u) => u.email === email && u.password === password)

      if (!foundUser) {
        setLoading(false)
        return { success: false, error: "Credenciales inválidas" }
      }

      const userData: User = {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name,
        role: foundUser.role as UserRole,
        avatarUrl: foundUser.avatarUrl,
      }

      setUser(userData)
      localStorage.setItem("user", JSON.stringify(userData))
      setLoading(false)

      return { success: true }
    } catch (error) {
      setLoading(false)
      return { success: false, error: "Error al iniciar sesión" }
    }
  }

  const logout = () => {
    // SUPABASE INTEGRATION:
    // await supabase.auth.signOut()
    setUser(null)
    localStorage.removeItem("user")
    router.push("/login")
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
