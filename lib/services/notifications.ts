import { getToken } from "firebase/messaging"
import { doc, setDoc } from "firebase/firestore"
import { messaging, db } from "../firebase"

export const initializeNotifications = async (userId: string) => {
  try {
    if (!messaging) {
      console.warn("Firebase messaging not available")
      return
    }

    const permission = await Notification.requestPermission()
    if (permission !== "granted") {
      console.warn("Notification permission denied")
      return
    }

    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
    })

    if (!token) {
      console.warn("Failed to get FCM token")
      return
    }

    // Save the token to Firestore
    await setDoc(doc(db, "adminDevices", userId), {
      token,
      lastUpdated: new Date(),
    })

    console.log("Notification token saved successfully")
  } catch (error) {
    console.error("Notification initialization failed:", error)
  }
}

export const setupNotificationListener = () => {
  if (!messaging) {
    console.warn("Firebase messaging not available")
    return
  }

  // Handle incoming messages when the app is in the foreground
  messaging.onMessage((payload) => {
    try {
      new Notification(payload.notification.title, {
        body: payload.notification.body,
        icon: "/icon.png",
      })
    } catch (error) {
      console.error("Error showing notification:", error)
    }
  })
}

