const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  task_info: {
    type: String,
    required: true,
  },

  deadline: {
    type: String,
    required: true,
  },

  volunteer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "USER",
    required: true,
  },
  volunteer_name: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("TASK", taskSchema);
