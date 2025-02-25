import { NextResponse } from "next/server"
import { db } from "@/lib/firebase-admin"
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore"

// 🔵 Get Single Order
export async function GET(req: Request, { params }: { params: { orderId: string } }) {
  try {
    const { searchParams } = new URL(req.url)
    const agentId = searchParams.get("agentId")

    if (!agentId) {
      return NextResponse.json({ error: "Agent ID is required" }, { status: 400 })
    }

    const orderRef = doc(db, "orders", agentId, "orders", params.orderId)
    const orderSnap = await getDoc(orderRef)

    if (!orderSnap.exists()) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    const orderData = {
      id: orderSnap.id,
      ...orderSnap.data(),
      createdAt: orderSnap.data().createdAt?.toDate().toISOString(),
      updatedAt: orderSnap.data().updatedAt?.toDate().toISOString(),
    }

    return NextResponse.json(orderData)
  } catch (error) {
    console.error("Error fetching order:", error)
    return NextResponse.json({ error: "Failed to fetch order", details: error.message }, { status: 500 })
  }
}

// 🟡 Update Order
export async function PATCH(req: Request, { params }: { params: { orderId: string } }) {
  try {
    const { searchParams } = new URL(req.url)
    const agentId = searchParams.get("agentId")
    const updateData = await req.json()

    if (!agentId) {
      return NextResponse.json({ error: "Agent ID is required" }, { status: 400 })
    }

    const orderRef = doc(db, "orders", agentId, "orders", params.orderId)
    const orderSnap = await getDoc(orderRef)

    if (!orderSnap.exists()) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Get existing timeline
    const existingData = orderSnap.data()
    const timeline = existingData.timeline || []

    // Add new timeline entry if status is changing
    if (updateData.status && updateData.status !== existingData.status) {
      timeline.push({
        status: updateData.status,
        timestamp: new Date().toISOString(),
        description: `Order status updated to ${updateData.status}`,
      })
    }

    // Update the document
    await updateDoc(orderRef, {
      ...updateData,
      timeline,
      updatedAt: serverTimestamp(),
    })

    return NextResponse.json({ success: true, orderId: params.orderId })
  } catch (error) {
    console.error("Error updating order:", error)
    return NextResponse.json({ error: "Failed to update order", details: error.message }, { status: 500 })
  }
}

