const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);


const itemSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 50,
  },
  count: {
    type: Number,
    required: true
  },
});

const orderSchema = new mongoose.Schema({
  customer: {
    type: new mongoose.Schema({
      name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 30,
      },
      phone: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 20,
      },
      address: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 500
      },
    }),
    required: true,
  },
  timestamp: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    default: "승인대기"
  },
  method: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 3,
  },
  items: [itemSchema],
});

const Order = mongoose.model("Order", orderSchema);

function validateOrder(order) {
  const schema = {
    customerId: Joi.objectId().required(),
    timestamp: Joi.number().required(),
    status: Joi.string().required().min(2).max(30),
    method: Joi.string().required().min(1).max(3),
    items: Joi.array().items(Joi.object()), //objectId or object?
  };

  return Joi.validate(order, schema);
}

exports.Order = Order;
exports.orderSchema = orderSchema;
exports.validate = validateOrder;
