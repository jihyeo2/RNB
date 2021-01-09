const auth = require("../middleware/auth");
const bcrypt = require("bcrypt");
const Fawn = require("fawn");
const _ = require("lodash");
const { User, validate } = require("../models/user");
const express = require("express");
const router = express.Router();

router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user)
    return res.status(404).send("users_r: The user with the given ID was not found.");
  res.send(user);
});

router.post(
  "/",
  async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ phone: req.body.phone });
    if (user) return res.status(400).send("users_r: User already registered.");

    user = new User(
      _.pick(req.body, [
        "name",
        "phone",
        "address",
        "password",
        "isAdmin",
        "notification",
        "expoPushToken",
      ])
    );

    // user = new User({
    //   name: req.body.name,
    //   phone: req.body.phone,
    //   address: req.body.address,
    //   password: req.body.password,
    //   expoPushToken: req.body.expoPushToken,
    //   isAdmin: false
    // });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();

    const token = user.generateAuthToken();
    res.header("x-auth-token", token).send(user);
  }
);

//add orders and currentPassword into update?!
router.put("/me", auth, async (req, res) => {
  // const { error } = validate(req.body);
  // if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findById(req.user._id);
  if (!user)
    return res.status(404).send("users_r: The user with the given ID was not found.");

  const validPassword = await bcrypt.compare(
    req.body.currentPassword,
    user.password
  );
  if (!validPassword) {
    return res.status(400).send("Invalid password");
  }

  const salt = await bcrypt.genSalt(10);
  const new_password = await bcrypt.hash(req.body.password, salt);

  try {
    new Fawn.Task()
      .update(
        "users",
        { _id: user._id },
        {
          $set: {
            name: req.body.name,
            phone: req.body.phone,
            address: req.body.address,
            password: new_password,
            isAdmin: req.body.isAdmin,
            notification: req.body.notification,
            expoPushToken: req.body.expoPushToken
          },
        },
        { new: true }
      )
      .run();

    res.send(_.pick(user, ["_id", "name", "phone"]));
  } catch (ex) {
    res
      .status(500)
      .send("Error occured, thus the user was not updated successfully.");
  }
});

router.put("/notification", auth, async (req, res) => {
  // const { error } = validate(req.body);
  // if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findById(req.user._id);
  if (!user)
    return res.status(404).send("users_r: The user with the given ID was not found.");

  try {
    new Fawn.Task()
      .update(
        "users",
        { _id: user._id },
        {
          $set: {
            name: req.body.name,
            phone: req.body.phone,
            address: req.body.address,
            password: req.body.password,
            isAdmin: req.body.isAdmin,
            notification: req.body.notification,
            expoPushToken: req.body.expoPushToken
          },
        },
        { new: true }
      )
      .run();

    res.send(_.pick(user, ["_id", "name", "phone"]));
  } catch (ex) {
    res
      .status(500)
      .send("Error occured, thus the user was not updated successfully.");
  }
});

router.delete("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select(
    "-password -__v"
  );
  if (!user)
    return res.status(404).send("The user with the given ID was not found.");

  try {
    new Fawn.Task().remove("users", { _id: user._id }).run();
    res.send(user);
  } catch (ex) {
    res
      .status(500)
      .send("Error occured, thus the user was not deleted successfully.");
  }
});

module.exports = router;

// install joi-password-complexity to require more complex password to the users
