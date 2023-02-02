const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const MEDICINE = mongoose.model("MEDICINE");
const USER = mongoose.model("USER");
const requireLogin = require("../middlewares/requireLogin");




// save multiple 
router.post("/add_many_medicine", (req, res) => {
    const array  = req.body;
    console.log(array);
    

 
    MEDICINE.insertMany(array).then((savedUser) => {
        console.log("succecc---");
        

        // const medicine = new MEDICINE({
        //    med_name,
        //    med_description
          
        // })
        // medicine.save()
        //         .then(user => { res.json({ message: "Registered successfully" }) })
        //         .catch(err => { console.log(err) })
    })

})


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








router.delete("/delete_medicine/:medicineId",  (req, res) => {
    MEDICINE.findOne({ _id: req.params.medicineId })
      
        .exec((err, medicine) => {
            if (err || !medicine) {
                return res.status(422).json({ error: err })
            }

            // if (medicine.postedBy._id.toString() == req.user._id.toString()) {

                medicine.remove()
                    .then(result => {
                        return res.json({ message: "Successfully deleted" })
                    }).catch((err) => {
                        console.log(err)
                    })
            // }
        })
})



module.exports = router;