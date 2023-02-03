const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
   
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "user",
        required: true
    },
    // is_admin: {
    //     type:Boolean,
    //     default: true
    //     // require: true
    // }
   
})

mongoose.model("USER", userSchema)