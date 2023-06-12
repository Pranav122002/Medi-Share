const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
 
  doctor_name: {
    type: String,
    required: true,
  },
  patient_name: {
    type: String,
    required: true,
  },
  appointment_date: {
    type: String,
    required: true,
  },
  
  confirm_status: {
    type: Boolean,
    default: false,
  },

});

module.exports = mongoose.model("APPOINTMENT", appointmentSchema);
