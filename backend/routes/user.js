const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const ORDER = mongoose.model("ORDER");
const USER = mongoose.model("USER");

router.get("/api/user/:id", (req, res) => {
  USER.findOne({ _id: req.params.id })
    .select("-password")
    .then((user) => {
      return res.json(user);
    })
    .catch((err) => {
      return res.status(404).json({ error: "User not found..." });
    });
});

router.put("/api/becomevolunteer/:id", (req, res) => {
  
  
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

router.get("/api/all-doctors", (req, res) => {
  USER.find({ role: "doctor" })
    .then((doctors) => {
      res.json(doctors);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: "Error fetching doctors" });
    });
});

router.put("/api/subscribe/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await USER.findById(id);

    if (user.credits >= 1000) {
      const subscriptionEndDate = new Date();
      subscriptionEndDate.setDate(subscriptionEndDate.getDate() + 30);

      const formattedEndDate = subscriptionEndDate.toISOString().split("T")[0];

      const updatedUser = await USER.findByIdAndUpdate(
        id,
        { $set: { subscription: true, subscription_end_date: formattedEndDate }, $inc: { credits: -1000 } },
        { new: true }
      );

      res.json("You have now subscribed to Medi-Share...");
    } else {
      res.json("Insufficient credits. Please earn or add credits to subscribe to Medi-Share...");
    }
  } catch (err) {
    console.error(err);
    res.json("An error occurred...");
  }
});


router.put('/api/end-subscription/:id', (req, res) => {
  USER.findByIdAndUpdate(
    req.params.id,
    { $unset: { subscription_end_date: "" }, subscription: false },
    { new: true }
  )
    .then((updatedUser) => {
      res.json(updatedUser);
    })
    .catch((error) => {
      res.status(500).json({ error: 'Failed to end user subscription' });
    });
});


router.get("/api/all-personal-users/:id", async (req, res, next) => {
  try {
    const personal_users = await USER.find({
      _id: { $ne: req.params.id },
      role: { $in: ["volunteer", "doctor"] },
    }).select(["email", "name", "_id"]);
    return res.json(personal_users);
  } catch (ex) {
    next(ex);
  }
});

module.exports = router;
