const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const ORDER = mongoose.model("ORDER");
const USER = mongoose.model("USER");

router.get("/user/:id", (req, res) => {
  USER.findOne({ _id: req.params.id })
    .select("-password")
    .then((user) => {
      return res.json(user);
    })
    .catch((err) => {
      return res.status(404).json({ error: "User not found..." });
    });
});

router.put("/becomevolunteer/:id", (req, res) => {
  
  
  USER.findByIdAndUpdate(
    req.params.id,
    { $set: { role: "volunteer" } },
    { new: true }
  )
    .then((doc) => {
      console.log(doc);
      res.json("You have became Volunteer now...");
    })
    .catch((err) => {
      console.error(err);
      res.json("User not found...");
    });
});

router.get("/all-doctors", (req, res) => {
  USER.find({ role: "doctor" })
    .then((doctors) => {
      res.json(doctors);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: "Error fetching doctors" });
    });
});

router.put("/subscribe/:id", async (req, res) => {
  try {
    const user = await USER.findById(req.params.id);

  

    const user_credits = user.credits;

    if (user_credits >= 2000) {
      const updatedUser = await USER.findByIdAndUpdate(
        req.params.id,
        { $set: { subscription: true }, $inc: { credits: -2000 } },
        { new: true }
      );


      res.json("You have now subscribed to Medi-Share...");
    } else {


      res.json(
        "Insufficient credits. Please earn or add credits to subscribe to Medi-Share..."
      );
    }
  } catch (err) {
    console.error(err);


    res.json("An error occurred...");
  }
});


module.exports = router;
