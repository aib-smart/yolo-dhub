import { supabase } from "@/lib/supabase"
import type { Database } from "@/types/supabase"

export type Order = Database["public"]["Tables"]["orders"]["Row"] & {
  timeline?: Database["public"]["Tables"]["order_timeline"]["Row"][]
}

export async function createOrder(orderData: Database["public"]["Tables"]["orders"]["Insert"]) {
  try {
    const { data: order, error } = await supabase
      .from("orders")
      .insert([
        {
          ...orderData,
          status: "review",
          exported: false,
        },
      ])
      .select()
      .single()

    if (error) throw error

    // Create initial timeline entry
    const { error: timelineError } = await supabase.from("order_timeline").insert([
      {
        order_id: order.id,
        status: "created",
        description: "Order created",
      },
    ])

    if (timelineError) throw timelineError

    return order
  } catch (error) {
    console.error("Error creating order:", error)
    throw error
  }
}

export async function getOrders(agentId: string, status?: string) {
  try {
    let query = supabase
      .from("orders")
      .select(
        `
        *,
        order_timeline (*)
      `,
      )
      .eq("agent_id", agentId)
      .order("created_at", { ascending: false })

    if (status && status !== "all") {
      query = query.eq("status", status)
    }

    const { data, error } = await query

    if (error) throw error

    return data as Order[]
  } catch (error) {
    console.error("Error fetching orders:", error)
    throw error
  }
}

export async function updateOrderStatus(orderId: string, status: Order["status"]) {
  try {
    const { data: order, error } = await supabase.from("orders").update({ status }).eq("id", orderId).select().single()

    if (error) throw error

    // Add timeline entry
    const { error: timelineError } = await supabase.from("order_timeline").insert([
      {
        order_id: orderId,
        status,
        description: `Order status updated to ${status}`,
      },
    ])

    if (timelineError) throw timelineError

    return order
  } catch (error) {
    console.error("Error updating order status:", error)
    throw error
  }
}

export async function markOrdersAsExported(orderIds: string[]) {
  try {
    const { error } = await supabase
      .from("orders")
      .update({
        status: "pending",
        exported: true,
      })
      .in("id", orderIds)

    if (error) throw error

    // Add timeline entries
    const timelineEntries = orderIds.map((id) => ({
      order_id: id,
      status: "exported",
      description: "Order exported and status changed to pending",
    }))

    const { error: timelineError } = await supabase.from("order_timeline").insert(timelineEntries)

    if (timelineError) throw timelineError
  } catch (error) {
    console.error("Error marking orders as exported:", error)
    throw error
  }
}

