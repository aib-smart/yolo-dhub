import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

// 🟢 Create Order
export async function POST(req: Request) {
  try {
    const orderData = await req.json()

    // Validate required fields
    if (
      !orderData.agent_id ||
      !orderData.agent_name ||
      !orderData.product ||
      !orderData.amount ||
      !orderData.payment_method ||
      !orderData.payment_network ||
      !orderData.transaction_id ||
      !orderData.sender_name
    ) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Start a Supabase transaction
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert([
        {
          ...orderData,
          status: orderData.status || "pending",
          exported: false,
        },
      ])
      .select()
      .single()

    if (orderError) throw orderError

    // Create initial timeline entry
    const { error: timelineError } = await supabaseAdmin.from("order_timeline").insert([
      {
        order_id: order.id,
        status: order.status,
        description: "Order created",
      },
    ])

    if (timelineError) throw timelineError

    return NextResponse.json({ success: true, orderId: order.id }, { status: 201 })
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json(
      { error: "Failed to create order", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}

// 🔵 Get Orders
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const agentId = searchParams.get("agentId")
    const status = searchParams.get("status")

    if (!agentId) {
      return NextResponse.json({ error: "Agent ID is required" }, { status: 400 })
    }

    let query = supabaseAdmin
      .from("orders")
      .select(`
        *,
        order_timeline (*)
      `)
      .eq("agent_id", agentId)
      .order("created_at", { ascending: false })

    if (status && status !== "all") {
      query = query.eq("status", status)
    }

    const { data: orders, error } = await query

    if (error) throw error

    return NextResponse.json(orders)
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json(
      { error: "Failed to fetch orders", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}

