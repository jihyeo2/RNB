const { Expo } = require("expo-server-sdk");

const sendPushNotification = async (targetExpoPushToken, message, notification) => {
  const expo = new Expo();
  let chunks;
  if (notification) {
    chunks = expo.chunkPushNotifications([
      { 
        to: targetExpoPushToken, 
        title: JSON.stringify(message.title), 
        body: JSON.stringify(message.body), 
        priority: "high",
        channelId: 'default'
       }
    ]);
  } else {
    chunks = expo.chunkPushNotifications([
      { 
        to: targetExpoPushToken, 
        title: JSON.stringify(message.title), 
        body: JSON.stringify(message.body), 
        priority: "high",
        channelId: 'off'
       }
    ]);
  }

  console.log("created chunks", chunks);

  const tickets = [];

  const sendChunks = async () => {
    // This code runs synchronously. We're waiting for each chunk to be send.
    // A better approach is to use Promise.all() and send multiple chunks in parallel.
    for (let chunk of chunks) {
      try {
        let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        console.log("ticketChunk: ", ticketChunk);
        tickets.push(...ticketChunk);
      } catch (error) {
        console.log("error: ", error);
      }
    }
  };

  await sendChunks();
};

module.exports = sendPushNotification;
