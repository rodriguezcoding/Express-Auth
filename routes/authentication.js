const bcrypt = require("bcryptjs");
const { User, signUpValidate } = require("../models/user.js");
const express = require("express");
const router = express();
const _ = require("lodash");

router.post("/api/sign-up", async (req, res) => {
  const { error } = signUpValidate(req.body.signUp);
  if (error) return res.status(400).send(error.details[0].message);

  const checkUser = await User.findOne({ email: req.body.signUp.email });
  if (checkUser) return res.status(400).send("User already exist");

  const checkUserName = await User.findOne({
    userName: req.body.signUp.userName
  });
  if (checkUserName) return res.status(400).send("user");

  const user = new User(req.body.signUp);

  const salting = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salting);

  await user.save();
  const token = user.genToken();

  res
    .header("x-auth-token", token)
    .send(_.pick(user, ["_id", "email", "displayName", "profilePicture"]));
});

router.post("/api/sign-in", async (req, res) => {
    const {error}
})
module.exports = router;
