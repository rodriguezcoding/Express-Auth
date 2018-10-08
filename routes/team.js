const express = require("express");
const router = express();
const _ = require("lodash");
const emailConfirmation = require("../services/emailConfirmation.js");
const { Team } = require("../models/team.js");
const authToken = require("../middlewares/authToken.js");
const bcrypt = require("bcryptjs");

router.post("/teams", authToken, async (req, res) => {
    
});
