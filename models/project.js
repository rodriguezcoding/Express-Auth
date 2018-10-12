const mongoose = require("mongoose");
const joi = require("joi");
const _ = require("lodash");
const projectSchema = new mongoose.Schema({
  projectName: {
    type: String,
    required: true
  },
  ownerID: {
    type: String,
    require: true
  },
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
  teamID: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
  date: { type: String }
});
