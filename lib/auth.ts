import { supabase } from "./supabase"
import type { User } from "@supabase/supabase-js"

export type UserRole = "admin" | "agent"
export type ApprovalStatus = "pending" | "approved" | "rejected"

export interface UserProfile {
  id: string
  email: string
  first_name: string
  last_name: string
  role: UserRole
  phone: string
  agent_id?: string
  id_type?: string
  id_number?: string
  region?: string
  is_active: boolean
  approval_status: ApprovalStatus
  created_at: string
  updated_at: string
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error

  // Get user profile data
  const { data: profile, error: profileError } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", data.user.id)
    .single()

  if (profileError) throw profileError

  return {
    user: data.user,
    profile,
  }
}

export async function signUp(userData: {
  email: string
  password: string
  first_name: string
  last_name: string
  phone: string
  id_type: string
  id_number: string
  region: string
  role?: UserRole
}) {
  try {
    // 1. Create auth user with metadata
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          first_name: userData.first_name,
          last_name: userData.last_name,
          role: userData.role || "agent",
        },
      },
    })

    if (authError) throw authError
    if (!authData.user) throw new Error("No user returned from sign up")

    // 2. Create user profile using the API route
    const response = await fetch("/api/create-profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: authData.user.id,
        email: userData.email,
        first_name: userData.first_name,
        last_name: userData.last_name,
        phone: userData.phone,
        role: userData.role || "agent",
        id_type: userData.id_type,
        id_number: userData.id_number,
        region: userData.region,
        approval_status: "pending",
      }),
    })

    if (!response.ok) {
      // If profile creation fails, clean up the auth user
      await supabase.auth.admin.deleteUser(authData.user.id)
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to create profile")
    }

    const profile = await response.json()

    // Return success without throwing email confirmation error
    return {
      user: authData.user,
      profile,
      confirmEmail: true,
    }
  } catch (error) {
    console.error("Error in signUp:", error)
    throw error
  }
}

export async function logoutUser() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
  localStorage.removeItem("agent")
}

export async function getCurrentUser(): Promise<{
  user: User | null
  profile: UserProfile | null
}> {
  const { data } = await supabase.auth.getUser()

  if (!data.user) {
    return { user: null, profile: null }
  }

  // Get user profile
  const { data: profile } = await supabase.from("user_profiles").select("*").eq("id", data.user.id).single()

  return {
    user: data.user,
    profile,
  }
}

