const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const jwt = require("jsonwebtoken");
const config = require("config");
const { orderSchema } = require("./order");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  phone: {
    type: String,
    required: true,
    minlength: 9,
    maxlength: 11,
  },
  address: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 500
  },
  currentPassword: {
    type: String,
    minlength: 6,
    maxlength: 1024,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 1024,
  },
  isAdmin: {
    type: Boolean,
    required: true,
    default: false
  },
  orders: [orderSchema],
  expoPushToken: String,
  notification: {
    type: Boolean,
    default: true,
    required: true,
  }
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin }, 
    config.get("jwtPrivateKey")
  );
  return token;
};

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = {
    name: Joi.string().required().min(2).max(30),
    phone: Joi.string().required().min(9).max(11),
    address: Joi.string().required().min(1).max(500),
    // currentPassword: Joi.string().min(5).max(1024),
    password: Joi.string().required().min(6).max(1024),
    isAdmin: Joi.boolean().required(),
    notification: Joi.boolean().required()
  };

  return Joi.validate(user, schema);
}

exports.User = User;
exports.userSchema = userSchema;
exports.validate = validateUser;
