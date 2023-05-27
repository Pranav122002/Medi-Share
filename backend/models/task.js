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

  volunteer_email: {
    type: String,
    required: true,
  },
  volunteer_name: {
    type: String,
    required: true,
  },

});

mongoose.model("TASK", taskSchema);
