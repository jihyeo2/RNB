const { Order, validate } = require("../models/order");
const { User } = require("../models/user");
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
const ownerAdmin = require("../middleware/ownerAdmin");
const Fawn = require("fawn");
const express = require("express");
const router = express.Router();


Fawn.init(mongoose);

router.get("/", auth, ownerAdmin, async(req, res) => {
  orders = await Order.find().sort({timestamp: -1});
  if (!orders) return res.status.send(400).send("None exists.");

  res.send(orders);
});


//get for admin and customers 
router.get("/customer", auth, async (req, res) => {
  const user = await User.findById(req.user._id);
  
  if (!user)
  return res.status(404).send("The user with the given ID was not found.");
  
  const orders = user.orders;
  if (!orders) return res.status.send(400).send("None exists.");
  
  res.send(orders.reverse());
});

  router.post(
    "/",
    auth,
    async (req, res) => {
      const { error } = validate(req.body);
      if (error) return res.status(400).send(error.details[0].message);
      
      let order = await Order.findOne({timestamp: req.body.timestamp}); //TODO: later change to userId
      if (order) return res.status(400).send("Order already registered.");
      
      const user = await User.findById(req.user._id);
      if (!user) return res.status(400).send("Invalid user.");
      
      order = new Order({
        customer: {
        _id: user._id,
        name: user.name,
        phone: user.phone,
        address: user.address
      },
      timestamp: req.body.timestamp,
      status: req.body.status,
      method: req.body.method,
      items: req.body.items,
    });
    try {
      new Fawn.Task()
      .save("orders", order)
      .update("users", { _id: user._id }, { $addToSet: { orders: order } })
      .run();
      res.send(order);
    } catch (ex) {
      res
      .status(500)
      .send("Error occured, thus the order was not added successfully.");
    }
  }
  );

  //get for admin (no filter)
  router.post("/search", auth, ownerAdmin, async (req, res) => {
    let orders = null;
    switch (req.body.num) {
      case 0:
        orders = await Order.find({ "customer.name": req.body.value}).sort({timestamp: -1});
        if (!orders) return res.status.send(400).send("None exists.");
        break;
      case 1:
        orders = await Order.find({"customer.phone": req.body.value}).sort({timestamp: -1});
        if (!orders) return res.status.send(400).send("None exists.");
        break;
      case 2:
        orders = await Order.find({$and: [{timestamp: { $gte: ((parseInt(req.body.timestamp) - parseInt(req.body.timestamp) % 86400000) - 32400000 + 86400000)}}, {timestamp: { $lt: ((parseInt(req.body.timestamp) - parseInt(req.body.timestamp) % 86400000) - 32400000 + 86400000 * 2)}}]}).sort({timestamp: -1});
        if (!orders) return res.status.send(400).send("None exists.");
        break;
      default:
        break;
    }
  
    res.send(orders);
  });
  
  /*
  put request should be done in the following manner: 
  all values that have not changed should also be passed. If not passed, an error rises
  */
 
 router.put("/", auth, async (req, res) => {
   // const { error } = validate(req.body);
   // if (error) return res.status(400).send(error.details[0].message);
   
   const order = await Order.findById(req.body._id);
   if (!order)
   return res.status(404).send("The order with the given ID was not found.");
   
  const update = {
    _id: order._id,
    customer: {
      _id: req.body.customer._id,
      name: req.body.customer.name,
      phone: req.body.customer.phone,
      address: req.body.customer.address
    },
    timestamp: req.body.timestamp,
    status: req.body.status,
    method: req.body.method, 
    items: req.body.items,
  };

  const user = await User.findByIdAndUpdate(
    req.body.customer._id,
    {
      $set: {
        "orders.$[elem].customer": {
          _id: update.customer._id,
          name: update.customer.name,
          phone: update.customer.phone,
          address: update.customer.address,
        },
        "orders.$[elem].timestamp": update.timestamp,
        "orders.$[elem].status": update.status,
        "orders.$[elem].method": update.method,
        "orders.$[elem].items": update.items,
      },
    },
    { arrayFilters: [{ "elem._id": update._id }] }
  );
  if (!user) return res.status(400).send("Invalid user.");

  try {
    new Fawn.Task()
      .update(
        "orders",
        { _id: order._id },
        {
          $set: update,
        }
      )
      .run();
    res.send(order);
  } catch (ex) {
    console.log(ex);
    res
      .status(500)
      .send("Error occured, thus the order was not updated successfully.");
  }
});

router.delete("/:id", auth, async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order)
    return res.status(404).send("The order with the given ID was not found.");

  const user = await User.findByIdAndUpdate(order.customer._id, {
    $pull: { orders: { _id: order._id } },
  });

  try {
    new Fawn.Task().remove("orders", { _id: order._id }).run();
    res.send(order);
  } catch (ex) {
    res
      .status(500)
      .send("Error occured, thus the order was not deleted successfully.");
  }
});


module.exports = router;
