const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const ORDER = mongoose.model("ORDER");
const USER = mongoose.model("USER");

// to get user profile
router.get("/user/:id", (req, res) => {
    USER.findOne({ _id: req.params.id })
        .select("-password")
        .then(user => {
            ORDER.find({ donar: req.params.id })
                .populate("donar", "_id")
                .populate("requester", "_id")
                .exec((err, order) => {
                    if (err) {
                        return res.status(422).json({ error: err })
                    }
                    res.status(200).json({ user, order })
                })
        }).catch(err => {
            return res.status(404).json({ error: "User not found..." })
        })
})


module.exports = router;