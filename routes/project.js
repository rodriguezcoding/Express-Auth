const express = require("express");
const router = express();
const _ = require("lodash");
const { projectValidation, Project } = require("../models/project.js");
const authToken = require("../middlewares/authToken.js");

router.get("/projects/:id", authToken, async (req, res) => {
  const projects = await Project.find(
    req.params.id ? { _id: req.params.id } : ""
  );
  if (!projects) return res.status(404).send("Couldn't find any project");

  res.status(200).send({ projects });
});

router.post("/projects/:id", authToken, async (req, res) => {
  const { error } = projectValidation(req.body.project);
  if (error) return res.status(400).send(error.details[0].message);

  const project = new Project(req.body.project);
  project.ownerID = req.user._id;
  project.teamID = req.params.id;
  await project.save();

  res.status(200).send({ project });
});

router.patch("/projects/:id", authToken, async (req, res) => {
  const { error } = projectValidation(req.body.project);
  if (error) return res.status(400).send(error.details[0].message);

  const project = await Project.findById(req.params.id);
  if (!project) return res.status(400).send("Could not find the project");

  //   const updateMessage = res.status(200).send("Project updated successfully");
  //   if (req.body.hasOwnProperty(req.body.project.removeTask)) {
  //     const filter = project.tasks.filter(
  //       task => task !== req.body.project.removeTask
  //     );
  //     project.tasks = filter;
  //     await project.save();

  //     return updateMessage;
  //   }
  project.name = req.body.project.name;
  await project.save();
  return updateMessage;
});

router.delete("/project/:id", authToken, async (req, res) => {
  const project = await Project.findByIdAndDelete(req.params.id);
  if (!project) return res.status(400).send("Could not delete project");
  req.stale(200).send("Project deleted!");
});

module.exports = router;
