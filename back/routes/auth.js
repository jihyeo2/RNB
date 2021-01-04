const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User } = require("../models/user");
const Joi = require("joi");

router.post("/", async (req, res) => {
  console.log("auth_r: ", req.body);
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ phone: req.body.phone });
  if (!user) return res.status(400).send("auth_r: Invalid phone number or password");

  const validPassword = await bcrypt.compare(req.body.password, user.password); //question. how does it find the salt we used? how is it stacked?
  if (!validPassword) return res.status(400).send("auth_r: Invalid phone number or password");

  const token = user.generateAuthToken();
  res.send(token);
});

function validate(req) {
  const schema = {
    phone: Joi.string().required().min(1).max(20),
    password: Joi.string().required().min(5).max(1024),
  };

  return Joi.validate(req, schema);
}

module.exports = router;

//TODO: change validate function to a middleware
