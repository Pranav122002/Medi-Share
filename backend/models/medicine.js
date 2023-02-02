const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types
const userSchema = new mongoose.Schema({
    med_name: {
        type: String,
        required: true
    },
    med_description: {
        type: String,
        // required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    expiry_date: {
        type: String,
        // type: Date,
        required: true
    },
    userId: {
        type: ObjectId,
        ref: "USER"
    }
    // donors: [{ type: ObjectId, ref: "USER" }]
   
})

mongoose.model("MEDICINE", userSchema)