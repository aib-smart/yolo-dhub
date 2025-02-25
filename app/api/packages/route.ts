import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { z } from "zod"

const packageSchema = z.object({
  name: z.string().min(2),
  data: z.string().min(1),
  validity: z.string().min(1),
  price: z.number().positive(),
  carrier: z.string().min(2),
  active: z.boolean().default(true),
  popular: z.boolean().optional(),
})

// Create Package
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const validatedData = packageSchema.parse(body)

    const { data: package_, error } = await supabaseAdmin.from("packages").insert([validatedData]).select().single()

    if (error) throw error

    return NextResponse.json(package_, { status: 201 })
  } catch (error) {
    console.error("Error creating package:", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid package data", details: error.errors }, { status: 400 })
    }
    return NextResponse.json(
      { error: "Failed to create package", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}

// Get Packages
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const carrier = searchParams.get("carrier")?.toLowerCase() || "mtn"

    const { data: packages, error } = await supabaseAdmin
      .from("packages")
      .select("*")
      .eq("carrier", carrier)
      .order("price", { ascending: true })

    if (error) throw error

    return NextResponse.json(packages)
  } catch (error) {
    console.error("Error fetching packages:", error)
    return NextResponse.json(
      { error: "Failed to fetch packages", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}

