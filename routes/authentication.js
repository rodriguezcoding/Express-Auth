const bcrypt = require("bcryptjs");
const {
  User,
  signUpValidation,
  signInValidation
} = require("../models/user.js");
const express = require("express");
const router = express();
const _ = require("lodash");
const emailConfirmation = require("../services/emailConfirmation.js");
const authToken = require("../middlewares/authToken.js");

//User registration
router.post("/sign-up", async (req, res) => {
  const { error } = signUpValidation(req.body.signUp);
  if (error) return res.status(400).send(error.details[0].message);

  const checkUser = await User  .findOne({ email: req.body.signUp.email });
  if (checkUser) return res.status(400).send("User already exist");

  const checkUserName = await User.findOne({
    displayName: req.body.signUp.displayName
  });
  if (checkUserName) return res.status(400).send("Display name already exist");

  req.body.signUp.isActive = false;
  const user = new User(req.body.signUp);

  const salting = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salting);
  let hashedId = await bcrypt.hash(user._id.toString(), 10);
  hashedId = hashedId.replace(/[/\\&;%@+,]/g, "");
  user.hashedId = hashedId;
  emailConfirmation(user.email, hashedId);
  await user.save();
  res.send(
    "An email confirmation has been sent to your email. Accounts not confirmed in 24 hours will be automatically deleted"
  );
});

//Email confirmation
router.get("/emailConfirmation/verify/:hash", async (req, res) => {
  const user = await User.findOne({ hashedId: req.params.hash });
  if (!user)
    return res.status(400).send("An error has occur during email confirmation");
  user.expire_at = undefined;
  user.hashedId = undefined;
  user.isActive = true;
  await user.save();
  const token = user.genToken();
  res
    .status(200)
    .header("x-auth-token", token)
    .send(
      "Great, your account is ready to use, you can now log into your account"
    );
});

//Re-send verification
router.post("/reSendVerification/:id", authToken, async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(400).send("User not found");
  emailConfirmation(user.email, user.hashedId);
  res.send(
    "An email confirmation has been sent to your email. Accounts not confirmed in 24 hours will be automatically deleted"
  );
});

//User authentication
router.post("/sign-in", async (req, res) => {
  const { error } = signInValidation(req.body.signIn);
  if (error) return res.status(400).send(error.details[0].message);

  const checkUser = await User.findOne({ email: req.body.signIn.email });
  if (!checkUser) return res.status(400).send("Invalid email or password");

  const validatePassword = await bcrypt.compare(
    req.body.signIn.password,
    checkUser.password
  );

  if (!validatePassword)
    return res.status(400).send("Invalid email or password");

  const token = checkUser.genToken();

  res.status(200).send(token);
});

module.exports = router;
