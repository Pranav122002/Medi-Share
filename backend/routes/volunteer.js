const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const VOLUNTEER = mongoose.model("VOLUNTEER");

router.put("/api/volunteer-location/:id", (req, res) => {
  const _id = req.params.id;
  const { lng, lat } = req.body;
  VOLUNTEER.findByIdAndUpdate(
    _id,
    {
      $set: {
        "volunteer_details.location": {
          lng: lng,
          lat: lat,
        },
      },
    },
    { new: true }
  )
    .then((updatedDoc) => {
      if (updatedDoc) {
        res.status(200).json("Volunteer location recieved");
      } else {
        res.status(404).json("Volunteer loction not found");
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json("couldn't get volunteer location");
    });
});
module.exports = router;
