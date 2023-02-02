const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const MEDICINE = mongoose.model("MEDICINE");
const requireLogin = require("../middlewares/requireLogin");

// to get user profile
router.get("/medicine/:id", (req, res) => {
    USER.findOne({ _id: req.params.id })
        .select("-password")
        .then(medicine => {
            console.log(res);
           
        }).catch(err => {
            return res.status(404).json({ error: "Medicine not found" })
        })
})


module.exports = router;