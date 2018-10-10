const express = require("express");
const router = express();
const _ = require("lodash");
const emailConfirmation = require("../services/emailConfirmation.js");
const { Team, validateTeam, validateEmail } = require("../models/team.js");
const authToken = require("../middlewares/authToken.js");
const bcrypt = require("bcryptjs");

router.get("/teams", authToken, async (req, res) => {
  const teams = await Team.find({ ownerID: req.user._id });
  res.status(200).send(teams);
});

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

//send invite to new team member
router.post("/teams/invite/:id", authToken, async (req, res) => {
  const { error } = validateEmail(req.body.sendInvite);
  if (error) return res.status(400).send(error.details[0].message);

  const checkTeam = await Team.findById({ _id: req.params.id });
  if (!checkTeam) return res.status(400).send("This team does not exist");
  const checkMemberExistence = checkTeam.teamMembers.indexOf(
    req.body.sendInvite.email
  );

  if (checkMemberExistence > -1)
    return res.status(409).send("This member already exist");

  const invite = {
    email: req.body.sendInvite.email,
    hashedId: checkTeam.hashedId
  };

  const { smtpTransport, close } = emailConfirmation(true, false, invite);
  const sendMail = await smtpTransport;

  if (!sendMail) {
    close.close();
    return res
      .status(400)
      .send("There was an error trying to recover account please try again");
  }
  close.close();
  res.status(200).send(`The team invite has been sent`);
});

//verify the invite hash
router.get("/teams/invite/verify/:hash", async (req, res) => {
  const team = await Team.findOne({ hashedId: req.params.hash });
  if (!team) return res.status(400).send("Team not found");
  const hash = await bcrypt.hash(team._id.toString(), 10);
  const hashedId = hash.replace(/[/\\&;%@+.,]/g, "");
  team.hashedId = hashedId;
  await team.save();
  res.status(200).send(team.hashedId);
});

module.exports = router;
