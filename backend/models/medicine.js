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
    
    expiry_date:{
        type: String,
    },
    
    quantity: {
        type: Number
    },
    
    isAvailable: {
        type: Boolean, default: false
    }
    
   
})

mongoose.model("MEDICINE", userSchema)