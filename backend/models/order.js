const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  medicine_name: {
    type: String,
    required: true,
  },
  expiry_date: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
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
    required: true,
  },
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "USER",
    // required: true,
  },
});

mongoose.model("ORDER", orderSchema);
