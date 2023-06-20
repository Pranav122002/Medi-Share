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
  phone_no: {
    type: String,
  },
  cart: [
    {
      medicine_name: {
        type: String
      },
      quantity: {
        type: Number
      },
      med_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MEDICINE"
      },
    },

  ],
  credits: {
    type: Number,
    default: 1000,
  },
  subscription: {
    type: Boolean,
    default: false,
  },
  location: {
    type: String,
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
    rejected_orders: [
      {
        order_id: {
          type: mongoose.Schema.Types.ObjectId
        },
      },
    ],
    accepted_orders: [
      {
        order_id: {
          type: mongoose.Schema.Types.ObjectId
        },
      },
    ],

    verified_orders: [
      {
        order_id: {
          type: mongoose.Schema.Types.ObjectId
        },
      }
    ],
    location: {
      lng: {
        type: Number,
        default: 0
      },
      lat: {
        type: Number,
        default: 0

      },
    },
    certificate: {
      type: String,
    },

    feedback_count: {
      type: Number,
      default: 0
    },
    avg_stars: {
      type: Number,
      default: 0
    }
  },
});

const USER = mongoose.model("USER", userSchema);
const DOCTOR = USER.discriminator("DOCTOR", doctorSchema);
const VOLUNTEER = USER.discriminator("VOLUNTEER", volunteerSchema);

module.exports = { USER, DOCTOR, VOLUNTEER };
