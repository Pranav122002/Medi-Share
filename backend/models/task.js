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
  status: {
    type: String,
    default: "pending",
  },
  completion: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("TASK", taskSchema);
