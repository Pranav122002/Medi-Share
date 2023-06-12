const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema({
  medicine_name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  disease: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("MEDICINE", medicineSchema);
