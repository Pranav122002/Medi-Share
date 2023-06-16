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
  verification: {
    type: Boolean,
    default: false,
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
});

const volunteerSchema = new mongoose.Schema({
  verification: {
    type: Boolean,
    default: false,
  },
  qualification: {
    type: String,
  },
  available: {
    type: Boolean,
    default: true,
  },
  rejected_orders: [
    {
      order_id: {
        type: mongoose.Schema.Types.ObjectId,
      },
      reason: {
        type: String,
      },
    },
  ],
  accepted_orders: [
    {
      order_id: {
        type: mongoose.Schema.Types.ObjectId,
      },
    },
  ],

  verified_orders: [
    {
      order_id: {
        type: mongoose.Schema.Types.ObjectId,
      },
    },
  ],

  location: {
    longitude: {
      type: Number,
    },
    latitude: {
      type: Number,
    },
  },
  certificate: {
    type: String,
  },
});

const User = mongoose.model("USER", userSchema);
const Doctor = User.discriminator("DOCTOR", doctorSchema);
const Volunteer = User.discriminator("VOLUNTEER", volunteerSchema);

module.exports = { User, Doctor, Volunteer };
