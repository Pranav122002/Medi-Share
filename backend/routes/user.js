const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const ORDER = mongoose.model("ORDER");
const USER = mongoose.model("USER");
const DOCTOR = mongoose.model("DOCTOR");
const VOLUNTEER = mongoose.model("VOLUNTEER");

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

router.put("/api/update-doctor-details/:id", (req, res) => {


  DOCTOR.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        "doctor_details.fees": req.body.doctor_details.fees,
        "doctor_details.qualification": req.body.doctor_details.qualification,
        "doctor_details.specialization": req.body.doctor_details.specialization,
        "doctor_details.experience": req.body.doctor_details.experience,
        "doctor_details.availability": req.body.doctor_details.availability,
        "doctor_details.hospital_name": req.body.doctor_details.hospital_name,
      },
    },
    { new: true }
  )
    .then((doc) => {
      res.json(doc);
    })
    .catch((err) => {
      console.error(err);
      res.json("User not found...");
    });
});

router.put("/api/update-volunteer-details/:id", (req, res) => {


  VOLUNTEER.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        "volunteer_details.qualification": req.body.volunteer_details.qualification,
        "volunteer_details.available": req.body.volunteer_details.available,
        "volunteer_details.NGO_name": req.body.volunteer_details.NGO_name,
        "volunteer_details.location.longitude": req.body.volunteer_details.location.longitude,
        "volunteer_details.location.latitude": req.body.volunteer_details.location.latitude,
      
      },
    },
    { new: true }
  )
    .then((doc) => {
      res.json(doc);
    })
    .catch((err) => {
      console.error(err);
      res.json("User not found...");
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
  USER.find({ role: "doctor" }).select("-password")
    .then((doctors) => {
      res.json(doctors);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: "Error fetching doctors" });
    });
});

router.get("/api/all-volunteers-and-doctors", (req, res) => {
  USER.find({ role: { $in: ["doctor", "volunteer"] } }).select("-password")
    .then((users) => {
      res.json(users);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: "Error fetching volunteers and doctors" });
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
