const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const TASK = mongoose.model("TASK");

router.post("/api/assign-task", async (req, res, next) => {
  try {
    const { task_info, deadline, volunteer_id, volunteer_name } = req.body;

    const data = await TASK.create({
      task_info: task_info,
      deadline: deadline,
      volunteer_id: volunteer_id,
      volunteer_name: volunteer_name,
    });

    if (data) {
      return res.json("Task assigned to volunteer successfully.");
    } else return res.json({ msg: "Failed to assign task." });
  } catch (ex) {
    next(ex);
  }
});

router.get("/api/all-tasks", (req, res) => {
  TASK.find({})
    .sort("-createdAt")
    .then((tasks) => res.json(tasks))
    .catch((err) => console.log(err));
});

router.get("/api/my-tasks/:id", (req, res) => {
  TASK.find({ volunteer_id: req.params.id })
    .sort("-createdAt")
    .then((tasks) => res.json(tasks))
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Failed to fetch tasks." });
    });
});

router.put("/api/accept-task/:task_id", async (req, res) => {
  try {
    const task = await TASK.findById(req.params.task_id);

    task.status = "accepted";
    await task.save();

    res.json(task);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while updating the task" });
  }
});

router.put("/api/reject-task/:task_id", async (req, res) => {
  try {
    const task = await TASK.findById(req.params.task_id);

    task.status = "rejected";
    await task.save();

    res.json(task);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while updating the task" });
  }
});

router.put("/api/complete-task/:task_id", async (req, res) => {
  try {
    const task = await TASK.findById(req.params.task_id);

    task.completion = true;
    await task.save();

    res.json(task);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while updating the task" });
  }
});

module.exports = router;
