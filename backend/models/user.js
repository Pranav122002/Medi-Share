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
  cart: [
    {
      medicine_name: {
        type: String,
      },
      quantity: {
        type: Number,
      },
      medicine_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MEDICINE",
      },
    },
  ],
});

const doctorSchema = new mongoose.Schema({
  doctor_details: {
    verification: {
      type: String,
      default: "unverified",
    },
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
      default: 200,
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

const volunteerSchema = new mongoose.Schema({
  volunteer_details: {
    verification: {
      type: String,
      default: "unverified",
    },
    qualification: {
      type: String,
    },
    NGO_name: {
      type: String,
    },
    available: {
      type: Boolean,
      default: true,
    },
  
    location: {
      longitude: {
        type: Number,
        default: 0
      },
      latitude: {
        type: Number,
        default: 0

      },
    },
    certificate: {
      type: String,
    },
  },
});

const USER = mongoose.model("USER", userSchema);
const DOCTOR = USER.discriminator("DOCTOR", doctorSchema);
const VOLUNTEER = USER.discriminator("VOLUNTEER", volunteerSchema);

module.exports = { USER, DOCTOR, VOLUNTEER };
