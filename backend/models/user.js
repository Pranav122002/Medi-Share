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
  phone_number: {
    type: Number,
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
    default: 1000,
  },
  subscription: {
    type: Boolean,
    default: false,
  },
  subscription_end_date: {
    type: String,
  },

  doctor_details: {
   
    qualification: {
      type: String,
    },
    specialization: {
      type: String,
    },
    experience: {
      type: Number,
    },
    fees: {
      type: Number,
    },
    hospital_name: {
      type: String,
    },
    availability: {
      type: String,
    },
    certificate: {
      type: String,
    },
  },
});

module.exports = mongoose.model("USER", userSchema);
