const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const ANNOUCEMENT = mongoose.model("ANNOUCEMENT");

router.get("/api/all-annoucements", (req, res) => {
  ANNOUCEMENT.find()
    .select(" -__v ")
    .sort("-createdAt")
    .then((annoucements) => res.json(annoucements))
    .catch((err) => console.log(err));
});

router.post("/api/add-annoucement", async (req, res, next) => {
  try {
    const { title, description, date, venue } = req.body;
    const data = await ANNOUCEMENT.create({
      title: title,
      description: description,
      date: date,
      venue: venue,
    });
    if (data) return res.json({ msg: "Annoucement added successfully." });
    else return res.json({ msg: "Failed to add annoucement." });
  } catch (ex) {
    next(ex);
  }
});

module.exports = router;
