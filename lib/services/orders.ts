import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  getDocs,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore"
import { db } from "../firebase"

export interface Order {
  id: string
  agentId: string
  agentName: string
  customerPhone: string
  product: string
  amount: number
  date: string
  status: "completed" | "pending" | "cancelled" | "failed" | "review"
  paymentMethod?: string
  notes?: string
  exported?: boolean
  createdAt: Date
  timeline?: {
    status: string
    timestamp: string
    description: string
  }[]
}

export const ordersCollection = collection(db, "orders")

export const subscribeToOrders = (callback: (orders: Order[]) => void) => {
  try {
    const q = query(ordersCollection, orderBy("createdAt", "desc"))

    return onSnapshot(
      q,
      (snapshot) => {
        const orders = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
        })) as Order[]
        callback(orders)
      },
      (error) => {
        console.error("Error subscribing to orders:", error)
        callback([])
      },
    )
  } catch (error) {
    console.error("Error setting up orders subscription:", error)
    return () => {} // Return empty cleanup function
  }
}

export const createOrder = async (orderData: Omit<Order, "id" | "createdAt">) => {
  try {
    const docRef = await addDoc(ordersCollection, {
      ...orderData,
      createdAt: serverTimestamp(),
      status: "review", // Default status for new orders
      exported: false,
      timeline: [
        {
          status: "created",
          timestamp: new Date().toISOString(),
          description: "Order created",
        },
      ],
    })

    return docRef.id
  } catch (error) {
    console.error("Error creating order:", error)
    throw error
  }
}

export const updateOrderStatus = async (orderId: string, status: Order["status"]) => {
  try {
    const orderRef = doc(ordersCollection, orderId)
    const timeline = await getOrderTimeline(orderId)

    await updateDoc(orderRef, {
      status,
      timeline: [
        ...timeline,
        {
          status,
          timestamp: new Date().toISOString(),
          description: `Order status updated to ${status}`,
        },
      ],
    })
  } catch (error) {
    console.error("Error updating order status:", error)
    throw error
  }
}

export const getOrderTimeline = async (orderId: string) => {
  try {
    const orderRef = doc(ordersCollection, orderId)
    const orderSnap = await getDocs(query(collection(orderRef, "timeline")))
    return orderSnap.docs.map((doc) => doc.data())
  } catch (error) {
    console.error("Error getting order timeline:", error)
    return []
  }
}

export const markOrdersAsExported = async (orderIds: string[]) => {
  const batch = writeBatch(db)

  try {
    orderIds.forEach((id) => {
      const orderRef = doc(ordersCollection, id)
      batch.update(orderRef, {
        status: "pending",
        exported: true,
        timeline: [
          {
            status: "exported",
            timestamp: new Date().toISOString(),
            description: "Order exported and status changed to pending",
          },
        ],
      })
    })

    await batch.commit()
  } catch (error) {
    console.error("Error marking orders as exported:", error)
    throw error
  }
}

