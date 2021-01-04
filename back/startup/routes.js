const express = require("express");
const orders = require("../routes/orders");
const users = require("../routes/users");
const auth = require("../routes/auth");
const message = require("../routes/messages");
const expoPushTokens = require("../routes/expoPushTokens");

module.exports = function (app) {
  app.use(express.static("public"));
  app.use(express.json());
  app.use("/api/orders", orders);
  app.use("/api/users", users);
  app.use("/api/auth", auth);
  app.use("/api/messages", message);
  app.use("/api/expoPushTokens", expoPushTokens);
};
