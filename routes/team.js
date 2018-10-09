const express = require("express");
const router = express();
const _ = require("lodash");
const emailConfirmation = require("../services/emailConfirmation.js");
const { Team, validateTeam } = require("../models/team.js");
const authToken = require("../middlewares/authToken.js");
const bcrypt = require("bcryptjs");

//create team
router.post("/teams", authToken, async (req, res) => {
  const { error } = validateTeam(req.body.team);
  if (error) return res.status(400).send(error.details[0].message);

  const team = new Team(req.body.team);
  const hash = await bcrypt.hash(team._id.toString(), 10);
  const hashedId = hash.replace(/[/\\&;%@+.,]/g, "");
  team.hashedId = hashedId;
  team.ownerID = req.user._id;
  team.ownerEmail = req.user.email;

  await team.save();

  res.status(200).send(team);
});

module.exports = router;
