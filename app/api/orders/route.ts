import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

// 🟢 Create Order
export async function POST(req: Request) {
  try {
    const {
      agentId,
      agentName,
      customerPhone,
      product,
      amount,
      paymentMethod,
      paymentNetwork,
      transactionId,
      senderName,
      status,
      notes,
    } = await req.json();

    // Validate required fields
    if (
      !agentId ||
      !agentName ||
      !product ||
      !amount ||
      !paymentMethod ||
      !paymentNetwork ||
      !transactionId ||
      !senderName
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate a unique ID for the order
    const orderId = `order_${Date.now()}`;

    // Create a new order document in the agent's orders subcollection
    await setDoc(
      doc(db, "orders", agentId, "orders", orderId), // Path: orders > agentId > orders > orderId
      {
        agentId,
        agentName,
        customerPhone: customerPhone || "",
        product,
        amount,
        paymentMethod,
        paymentNetwork,
        transactionId,
        senderName,
        status: status || "pending",
        notes: notes || "",
        createdAt: serverTimestamp(), // Use server timestamp
        lastUpdated: serverTimestamp(), // Use server timestamp
      }
    );

    return NextResponse.json({ id: orderId }, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}