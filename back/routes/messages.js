const { Message, validate } = require("../models/message");
const { Expo } = require("expo-server-sdk");
const { User } = require("../models/user");
const express = require("express");
const router = express.Router();
const messageCheck = require("../middleware/message");
const auth = require("../middleware/auth");
const sendPushNotification = require("../utilities/pushNotifications");

// router.get("/", auth, async (req, res) => {
//   const message = await Message.find({ userId: req.user._id });

//   if (!message)
//     return res.status(404).send("The message with the given ID was not found.");

//   res.send(message);
// });

const sendPushNotifications = async(user, message, notification) => {
  console.log("messages.js : ", user);
  await sendPushNotification(user.expoPushToken, message, notification);
};

router.post("/", messageCheck, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const message = new Message({
    title: req.body.title,
    body: req.body.body,
  });


  if (req.recipientId != 'admin') {
    const customer = await User.findById(req.recipientId);
    if (!customer) return res.status(400).send("No recipient exists.");


    sendPushNotifications(customer, message, customer.notification);
  } else {
    const users = await User.find({isAdmin: true});
    if (users.length == 0) return res.status(400).send("No recipient exists.");

    users.forEach(user => {
      sendPushNotifications(user,message, user.notification);
    });
  
  }

  await message.save();

  res.send(message);
});

// router.delete("/:id", async (req, res) => {
//   const message = await Message.findOneAndRemove({ _id: req.params.id });
//   res.send(message);
// });

module.exports = router;
