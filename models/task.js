const mongoose = require("mongoose");
const moment = require("moment");
const taskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  start: { type: String, required: true },
  due: { type: String, required: true },
  projectID: { type: String, require: true },
  usersID: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  //Initiated, Incomplete, Complete, onHold
  status: { type: String, default: "Initiated" },
  date: { type: String, default: moment().format("MMM Do YYYY, h:mm:ss a") }
});

module.exports = mongoose.model("Project", taskSchema);
