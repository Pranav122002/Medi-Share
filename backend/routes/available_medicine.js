const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const AVAILABLE_MEDICINE = mongoose.model("AVAILABLE_MEDICINE");
const USER = mongoose.model("USER");
const requireLogin = require("../middlewares/requireLogin");







//add medicine

router.post("/add_avail_medicine", (req, res) => {
    const { med_name,   med_description, expiry_date, donated_user } = req.body;

    if (!med_name || !med_description || !expiry_date || !donated_user) {
        return res.status(422).json({ error: "Please add all the fields" })
    }

    AVAILABLE_MEDICINE.findOne({ $or: [ { med_name: med_name }] }).then((savedUser) => {
        if (savedUser) {
            console.log("Hello");
            return res.status(422).json({ error: "Medicine already exist with that med_name" })
        }

        const medicine = new AVAILABLE_MEDICINE({
           med_name,
           med_description,
           expiry_date,
           donated_user
          
        })
        medicine.save()
                .then(user => { res.json({ message: "Registered successfully" }) })
                .catch(err => { console.log(err) })
    })

})



module.exports = router;