const mongoose = require("mongoose");
const joi = require("joi");
const _ = require("lodash");
const teamSchema = new mongoose.Schema({
  ownerID: {
    type: String,
    required: true
  },
  ownerEmail: {
    type: String,
    require: true
  },
  hashedId: { type: String },
  teamName: {
    type: String,
    required: true
  },
  teamMembers: [{ type: String, ref: "User" }],
  
  date: { type: String }
});

const validateTeam = team => {
  const picked = _.pick(team, ["teamName"]);
  const teamSchema = {
    teamName: joi.string().required()
  };
  return joi.validate(picked, teamSchema);
};

const validateEmail = email => {
  const schema = {
    email: joi
      .string()
      .min(5)
      .max(255)
      .email()
      .required()
  };

  return joi.validate(email, schema);
};
exports.Team = mongoose.model("Team", teamSchema);
exports.validateTeam = validateTeam;
exports.validateEmail = validateEmail;
