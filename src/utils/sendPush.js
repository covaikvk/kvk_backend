const { Expo } = require("expo-server-sdk");
let expo = new Expo();

async function sendPushNotification(pushToken, title, message) {
  try {
    if (!Expo.isExpoPushToken(pushToken)) {
      console.log("❌ Invalid Expo push token");
      return;
    }

    const messages = [
      {
        to: pushToken,
        sound: "default",
        title,
        body: message,
        data: { msg: "Hello from backend!" },
      },
    ];

    const chunks = expo.chunkPushNotifications(messages);

    for (let chunk of chunks) {
      let result = await expo.sendPushNotificationsAsync(chunk);
      console.log("✅ Push Sent:", result);
    }
  } catch (error) {
    console.log("❌ Error sending push:", error);
  }
}

module.exports = sendPushNotification;
