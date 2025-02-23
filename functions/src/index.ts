import * as functions from "firebase-functions"
import * as admin from "firebase-admin"
import * as nodemailer from "nodemailer"

admin.initializeApp()

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: functions.config().email.user,
    pass: functions.config().email.password,
  },
})

export const onNewOrder = functions.firestore.document("orders/{orderId}").onCreate(async (snap, context) => {
  const order = snap.data()

  // Send email notification
  const mailOptions = {
    from: functions.config().email.user,
    to: functions.config().email.admin, // Admin email address
    subject: `New Order Received - ${order.id}`,
    html: `
        <h1>New Order Received</h1>
        <p><strong>Order ID:</strong> ${order.id}</p>
        <p><strong>Product:</strong> ${order.product}</p>
        <p><strong>Amount:</strong> ₵${order.amount.toFixed(2)}</p>
        <p><strong>Customer:</strong> ${order.customerPhone}</p>
        <p><strong>Agent:</strong> ${order.agentName}</p>
        <p><strong>Status:</strong> ${order.status}</p>
        <p><a href="${functions.config().app.url}/admin?tab=orders">View Order</a></p>
      `,
  }

  await transporter.sendMail(mailOptions)

  // Send push notification to all admin devices
  const adminDeviceTokens = await admin
    .firestore()
    .collection("adminDevices")
    .get()
    .then((snapshot) => snapshot.docs.map((doc) => doc.data().token))

  const notification = {
    title: "New Order Received",
    body: `Order ${order.id} - ${order.product}`,
    icon: "/icon.png",
    click_action: `${functions.config().app.url}/admin?tab=orders`,
  }

  await admin.messaging().sendToDevice(adminDeviceTokens, {
    notification,
    data: {
      orderId: order.id,
    },
  })
})

