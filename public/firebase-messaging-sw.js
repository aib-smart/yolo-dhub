importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js")
importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js")

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyB2rkap55H41Y5ovdzFlcBTzZqCKK52NLo",
  authDomain: "yolo-client-01.firebaseapp.com",
  projectId: "yolo-client-01",
  storageBucket: "yolo-client-01.appspot.com",
  messagingSenderId: "746596155070",
  appId: "1:746596155070:web:5c1a9761ce5f500a82e8ef",
})

const messaging = firebase.messaging()

messaging.onBackgroundMessage((payload) => {
  const { title, body, icon } = payload.notification

  self.registration.showNotification(title, {
    body,
    icon,
    badge: "/icon.png",
  })
})

