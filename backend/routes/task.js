const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const TASK = mongoose.model("TASK");

router.post("/assign-task", async (req, res, next) => {
  try {
    const { task_info, deadline, volunteer_email, volunteer_name } = req.body;

    const data = await TASK.create({
      task_info: task_info,
      deadline: deadline,
      volunteer_email: volunteer_email,
      volunteer_name: volunteer_name,
    });

    if (data) {
      return res.json({ msg: "Task assigned to volunteer successfully..." });
    } else return res.json({ msg: "Failed to assign task..." });
  } catch (ex) {
    next(ex);
  }
});

router.get("/all-tasks", (req, res) => {
  TASK.find({ })
    .select(" -__v ")
  
    .sort("-createdAt")
    .then((tasks) => res.json(tasks))
    .catch((err) => console.log(err));
});

router.get("/my-tasks/:myname", (req, res) => {
  const volunteerName = req.params.myname;
  TASK.find({ volunteer_name: volunteerName })
    .sort("-createdAt")
    .then((tasks) => res.json(tasks))
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Failed to fetch tasks" });
    });
});


module.exports = router;
