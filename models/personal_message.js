const mongoose = require("mongoose");

const personalmessageSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },
    sender_name: {
      type: String,
      required: true,
    },
    receiver_name: {
      type: String,
      required: true,
    },
    sender_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "USER",
      required: true,
    },
    receiver_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "USER",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("PERSONAL_MESSAGE", personalmessageSchema);
