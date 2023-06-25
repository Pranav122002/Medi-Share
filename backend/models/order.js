const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  order_type: {
    type: String,
    required: true,
  },
  medicines: [
    {
      medicine_name: {
        type: String,
        required: true,
      },
      expiry_date: {
        date: {
          type: Date,
        },
        check_isExpired: {
          type: Boolean,
          default: false,
        },
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  no_of_medicines: {
    type: Number,
  },
  location: {
    location: {
      type: String,
    },
    lng: {
      type: Number,
    },
    lat: {
      type: Number,
    },
  },
  execute_status: {
    type: Boolean,
    default: false,
  },
  verify_status: {
    type: Boolean,
    default: false,
  },
  donar: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "USER",
  },
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "USER",
  },
  assigned_vol: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "USER",
  },
  pickup_deadline: {
    type: Date,
  },
  acceptance_status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
  order_creation_date: {
    date: {
      type: String,
    },
    time: {
      type: String,
    },
  },
  order_assign_date: {
    date: {
      type: String,
    },
    time: {
      type: String,
    },
  },

  feedback: {
    stars: {
      type: Number,
    },
    feedback: {
      type: String,
      default: null,
    },
  },
  is_order_rejected: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("ORDER", orderSchema);
