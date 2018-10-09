const mongoose = require("mongoose");
const joi = require("joi");
const moment = require("moment");
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
  teamProjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
  date: { type: String }
});
teamSchema.pre("save", next => {
  this.date = moment().format("MMM Do YYYY, h:mm:ss a");
  next();
});

const validateTeam = team => {
  const picked = _.pick(team, ["teamName"]);
  const teamSchema = {
    teamName: joi.string().required()
  };
  return joi.validate(picked, teamSchema);
};

exports.Team = mongoose.model("Team", teamSchema);
exports.validateTeam = validateTeam;
