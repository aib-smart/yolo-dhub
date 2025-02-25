import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { z } from "zod"

const packageUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  data: z.string().min(1).optional(),
  validity: z.string().min(1).optional(),
  price: z.number().positive().optional(),
  carrier: z.string().min(2).optional(),
  active: z.boolean().optional(),
  popular: z.boolean().optional(),
})

// Update Package
export async function PATCH(req: Request, { params }: { params: { packageId: string } }) {
  try {
    const body = await req.json()
    const validatedData = packageUpdateSchema.parse(body)

    const { data: package_, error } = await supabaseAdmin
      .from("packages")
      .update(validatedData)
      .eq("id", params.packageId)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(package_)
  } catch (error) {
    console.error("Error updating package:", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid package data", details: error.errors }, { status: 400 })
    }
    return NextResponse.json(
      { error: "Failed to update package", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}

// Delete Package
export async function DELETE(req: Request, { params }: { params: { packageId: string } }) {
  try {
    const { error } = await supabaseAdmin.from("packages").delete().eq("id", params.packageId)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting package:", error)
    return NextResponse.json(
      { error: "Failed to delete package", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}

