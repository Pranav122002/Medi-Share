const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const ORDER = mongoose.model("ORDER");
const USER = mongoose.model("USER");
const DOCTOR = mongoose.model("DOCTOR");
const VOLUNTEER = mongoose.model("VOLUNTEER");
const MEDICINE = mongoose.model("MEDICINE");

router.get("/api/user/:id", (req, res) => {
  USER.findOne({ _id: req.params.id })
    .select("-password")
    .then((user) => {
      return res.json(user);
     
    })
    .catch((err) => {
      return res.status(404).json({ error: "User not found." });
    });
});

router.put("/api/update-volunteer-details/:id", (req, res) => {
  VOLUNTEER.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        "volunteer_details.qualification":
          req.body.volunteer_details.qualification,
        "volunteer_details.available": req.body.volunteer_details.available,
        "volunteer_details.NGO_name": req.body.volunteer_details.NGO_name,
        "volunteer_details.location.lng":
          req.body.volunteer_details.location.lng,
        "volunteer_details.location.lat":
          req.body.volunteer_details.location.lat,
      },
    },
    { new: true }
  )
    .then((doc) => {
      res.json(doc);
    })
    .catch((err) => {
      console.error(err);
      res.json("User not found.");
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
      res.json("User not found.");
    });
});



router.get("/api/all-volunteers-and-doctors", (req, res) => {
  USER.find({ role: { $in: ["doctor", "volunteer"] } })
    .select("-password")
    .then((users) => {
      res.json(users);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: "Error fetching volunteers and doctors" });
    });
});

router.get("/api/all-volunteers", (req, res) => {
  USER.find({ role: "volunteer" }).select("-password")
    .then((volunteers) => {
      res.json(volunteers);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: "Error fetching volunteers." });
    });
});

router.post("/api/user-cart/:id", (req, res) => {
  const cart = req.body;
  USER.findByIdAndUpdate(
    { _id: req.params.id },
    {
      $push: { cart: { $each: cart } },
    },
    { new: true }
  )
    .then((updatedUser) => {
      res.status(200).json(updatedUser);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Failed to add cart items" });
    });
});

router.get("/api/user-cart/:id", (req, res) => {
  USER.find({ _id: req.params.id })
    .then((user) => {
      if (!user) {
        // User not found
        return res.status(404).json({ error: "User not found" });
      }
      // Return the cart
      res.status(200).json(user.cart);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Failed to get user cart" });
    });
});

router.delete("/api/delete-cart-item/:id", (req, res) => {
  const userId = req.params.id;
  const medId = req.body.medId;
  console.log(medId);
  USER.findByIdAndUpdate(
    userId,
    { $pull: { cart: { _id: medId } } },
    { new: true }
  )
    .then((updatedUser) => {
      console.log(updatedUser);
      res.status(200).json({ success: "Item Removed" });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Failed to remove item from cart" });
    });
});

router.get("/api/all-doctors", (req, res) => {
  USER.find({ role: "doctor" })
    .select("-password")
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
        {
          $set: { subscription: true, subscription_end_date: formattedEndDate },
          $inc: { credits: -1000 },
        },
        { new: true }
      );

      res.json("You have now subscribed to Medi-Share.");
    } else {
      res.json(
        "Insufficient credits. Please earn or add credits to subscribe to Medi-Share."
      );
    }
  } catch (err) {
    console.error(err);
    res.json("An error occurred.");
  }
});

router.put("/api/end-subscription/:id", (req, res) => {
  USER.findByIdAndUpdate(
    req.params.id,
    { $unset: { subscription_end_date: "" }, subscription: false },
    { new: true }
  )
    .then((updatedUser) => {
      res.json(updatedUser);
    })
    .catch((error) => {
      res.status(500).json({ error: "Failed to end user subscription" });
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

router.get("/api/verify-user/:id", async (req, res) => {
  const { id } = req.params;
  const user = await USER.findById(id);

  if (user.role === "doctor") {
    DOCTOR.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          "doctor_details.verification": "verified",
        },
      },
      { new: true }
    )
      .then((doc) => {
        res.json(doc);
      })
      .catch((err) => {
        console.error(err);
        res.json("User not found.");
      });
  } else if (user.role === "volunteer") {
    VOLUNTEER.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          "volunteer_details.verification": "verified",
        },
      },
      { new: true }
    )
      .then((doc) => {
        res.json(doc);
      })
      .catch((err) => {
        console.error(err);
        res.json("User not found.");
      });
  }
});

module.exports = router;
