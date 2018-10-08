const mongoose = require("mongoose");
const joi = require("joi");
const moment = require("moment");
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
  teamMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  teamProjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
  date: { type: String, required: true }
});
teamSchema.pre("save", next => {
  this.date = moment().format("MMM Do YYYY, h:mm:ss a");
  next();
});
// teamSchema.methods.genDate = () => {};
const validateTeam = team => {
  const picked = _.pick(team, [
    "ownerID",
    "ownerEmail",
    "hashedId",
    "teamName"
  ]);
  const teamSchema = {
    ownerID: joi.string().required(),
    ownerEmail: joi.string().required(),
    hashedId: joi.string().required(),
    teamName: joi.string().required()
  };
  return joi.validate(picked, teamSchema);
};
exports.Team = mongoose.model("Team", teamSchema);
