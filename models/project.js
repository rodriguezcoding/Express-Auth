const mongoose = require("mongoose");
const joi = require("joi");
const moment = require("moment");

const projectSchema = new mongoose.Schema({
  name: {type: String,required: true},
  ownerID: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
  teamID: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
  date: { type: String, default: moment().format("MMM Do YYYY, h:mm:ss a") }
});

const projectValidation = project => {
  const schema = {
    name: joi
      .string()
      .min(3)
      .max(50)
      .required()
  };
  return joi.validate(project, schema);
};

exports.Project = mongoose.model("Project", projectSchema);
exports.projectValidation = projectValidation;
