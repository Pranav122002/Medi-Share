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
});

mongoose.model("MEDICINE", medicineSchema);
