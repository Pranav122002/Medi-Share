const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const MEDICINE = mongoose.model("MEDICINE");
const USER = mongoose.model("USER");
const requireLogin = require("../middlewares/requireLogin");







//add medicine

router.post("/add_medicine", (req, res) => {
    const { med_name,   med_description } = req.body;

    if (!med_name || !med_description) {
        return res.status(422).json({ error: "Please add all the fields" })
    }

    MEDICINE.findOne({ $or: [ { med_name: med_name }] }).then((savedUser) => {
        if (savedUser) {
            console.log("Hello");
            return res.status(422).json({ error: "Medicine already exist with that med_name" })
        }

        const medicine = new MEDICINE({
           med_name,
           med_description
          
        })
        medicine.save()
                .then(user => { res.json({ message: "Registered successfully" }) })
                .catch(err => { console.log(err) })
    })

})


router.get("/all_medicine", (req, res) => {
    // const { med_name,   med_description } = req.body;

    // if (!med_name || !med_description) {
    //     return res.status(422).json({ error: "Please add all the fields" })
    // }

    MEDICINE.find({}, function(err, medicines) {
    //   console.log(users);
    res.send(medicines)
     });
})


module.exports = router;