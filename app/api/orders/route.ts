import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { NextResponse } from "next/server";

// 🟢 Fetch Orders
export async function GET(req: Request) {
    try {
      const { searchParams } = new URL(req.url)
      const agentId = searchParams.get("agentId")
  
      let ordersQuery = collection(db, "orders")
      if (agentId) {
        ordersQuery = query(ordersQuery, where("agentId", "==", agentId))
      }
  
      const querySnapshot = await getDocs(ordersQuery)
      const orders = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
  
      return NextResponse.json(orders, { status: 200 })
    } catch (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  }
  

// 🟢 Create Order
export async function POST(req: Request) {
  try {
    const { agentId, agentName, customerPhone, product, amount, paymentMethod, notes } = await req.json();

    const newOrder = {
      agentId,
      agentName,
      customerPhone,
      product,
      amount,
      status: "review",
      paymentMethod,
      notes,
      createdAt: serverTimestamp(),
      narration: "",
    };

    const docRef = await addDoc(collection(db, "orders"), newOrder);

    return NextResponse.json({ id: docRef.id, ...newOrder }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
