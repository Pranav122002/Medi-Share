const mongoose = require("mongoose");

const communitymessageSchema = mongoose.Schema(
  {
    message: {
      text: { type: String, required: true },
    },
   
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "USER",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("COMMUNITYMESSAGE", communitymessageSchema);
