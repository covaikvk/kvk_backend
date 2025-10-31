const { Expo } = require("expo-server-sdk");
let expo = new Expo();

async function sendPushNotification(pushToken, title, message) {
  const messages = [];

  if (!Expo.isExpoPushToken(pushToken)) {
    console.log("Invalid Expo push token");
    return;
  }

  messages.push({
    to: pushToken,
    sound: "default",
    title,
    body: message,
    data: { extraData: "Hello!" },
  });

  const chunks = expo.chunkPushNotifications(messages);
  for (let chunk of chunks) {
    try {
      let ticket = await expo.sendPushNotificationsAsync(chunk);
      console.log(ticket);
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = sendPushNotification;
