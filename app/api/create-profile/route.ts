import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { z } from "zod"

// Validation schema for profile creation
const profileSchema = z.object({
  userId: z.string().uuid(),
  email: z.string().email(),
  first_name: z.string().min(2),
  last_name: z.string().min(2),
  phone: z.string().min(10),
  role: z.enum(["admin", "agent"]),
  id_type: z.string().optional(),
  id_number: z.string().optional(),
  region: z.string().optional(),
  approval_status: z.enum(["pending", "approved", "rejected"]).default("pending"),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()

    // Validate request data
    const validatedData = profileSchema.parse(body)

    // Check if profile already exists
    const { data: existingProfile } = await supabaseAdmin
      .from("user_profiles")
      .select("id")
      .eq("id", validatedData.userId)
      .single()

    if (existingProfile) {
      return NextResponse.json({ error: "Profile already exists for this user" }, { status: 409 })
    }

    // Create profile
    const { data: profile, error: profileError } = await supabaseAdmin
      .from("user_profiles")
      .insert([
        {
          id: validatedData.userId,
          email: validatedData.email,
          first_name: validatedData.first_name,
          last_name: validatedData.last_name,
          phone: validatedData.phone,
          role: validatedData.role,
          id_type: validatedData.id_type,
          id_number: validatedData.id_number,
          region: validatedData.region,
          is_active: false, // Start as inactive until approved
          approval_status: validatedData.approval_status,
        },
      ])
      .select()
      .single()

    if (profileError) {
      console.error("Error creating profile:", profileError)
      return NextResponse.json({ error: "Failed to create profile" }, { status: 500 })
    }

    return NextResponse.json(profile, { status: 201 })
  } catch (error) {
    console.error("Error in create-profile route:", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request data", details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

