const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "user",
  },
  credits: {
    type: Number,
    default: 0,
  },
  subscription: {
    type: Boolean,
    default: false,
  },
});

mongoose.model("USER", userSchema);
