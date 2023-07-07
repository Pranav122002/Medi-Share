const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "USER",
    required: true,
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "USER",
    required: true,
  },
  appointment_date: {
    type: String,
    required: true,
  },
  appointment_time: {
    type: String,
    required: true,
  },
  appointment_link: {
    type: String,
  },
  confirm_status: {
    type: Boolean,
    default: false,
  },
  reject_status: {
    type: Boolean,
    default: false,
  },
  rating: {
    type: String,
  },
  feedback: {
    type: String,
  },
});

module.exports = mongoose.model("APPOINTMENT", appointmentSchema);
