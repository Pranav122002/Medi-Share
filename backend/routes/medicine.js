const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const MEDICINE = mongoose.model("MEDICINE");
const USER = mongoose.model("USER");
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







//add medicine

router.post("/add_medicine", (req, res) => {
    const med_name = req.body.med_name;
   
    const quantity = req.body.quantity;
    const expiry_date = req.body.expiry_date;
    const userId = req.body.userId;
    if (!med_name || !quantity || !expiry_date) {
        return res.status(422).json({ error: "Please add all the fields" })
    }

    MEDICINE.findOne({ $or: [ { _id: userId },{ med_name: med_name }] }).then((savedUser) => {
        if (savedUser) {
            console.log("Hello");
            return res.status(422).json({ error: "Medicine already exist with that med_name" })
        }

        const medicine = new MEDICINE({
           med_name,
            quantity,
            expiry_date,
          
        })
        medicine.save()
                .then(user => { res.json({ message: "Registered successfully" }) })
                .catch(err => { console.log(err) })
    })

})

// to follow user
router.put("/follow", requireLogin, (req, res) => {
    USER.findByIdAndUpdate(req.body.followId, {
        $push: { followers: req.user._id }
    }, {
        new: true
    }, (err, result) => {
        if (err) {
            return res.status(422).json({ error: err })
        }
        USER.findByIdAndUpdate(req.user._id, {
            $push: { following: req.body.followId }
        }, {
            new: true
        }).then(result => {
            res.json(result)

        })
            .catch(err => { return res.status(422).json({ error: err }) })
    }
    )
})


module.exports = router;