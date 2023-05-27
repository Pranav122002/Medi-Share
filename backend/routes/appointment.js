const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const APPOINTMENT = mongoose.model("APPOINTMENT");
const USER = mongoose.model("USER");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { MONGOURI, JWT_SECRET } = require("../config/keys.js");

router.post("/book-appointment/:id", async (req, res, next) => {
  try {
    const { doctor_name, patient_name, appointment_date } = req.body;

    const user = await USER.findById(req.params.id);
    const credits = user.credits;

    if (credits >= 200) {
      await USER.updateOne({ _id: req.params.id }, { $inc: { credits: -200 } });

      const data = await APPOINTMENT.create({
        doctor_name: doctor_name,
        patient_name: patient_name,
        appointment_date: appointment_date,
      });

      if (data) {
        return res.json({
          msg: "Appointment placed successfully. The doctor will confirm now...",
        });
      } else {
        return res.json({ msg: "Failed to place the appointment..." });
      }
    } else {
      return res.json({
        msg: "Insufficient credits. Please earn your credits to book an appointment...",
      });
    }
  } catch (ex) {
    next(ex);
  }
});

router.get("/my-appointments/:name", async (req, res, next) => {
  try {
    const appointments = await APPOINTMENT.find({
      doctor_name: req.params.name,
      confirm_status: false,
    });
    res.json(appointments);
  } catch (error) {
    next(error);
  }
});

router.get("/doctor-appointments/:name", async (req, res, next) => {
  try {
    const appointments = await APPOINTMENT.find({
      doctor_name: req.params.name,
      confirm_status: true,
    });

    res.json(appointments);
  } catch (error) {
    next(error);
  }
});

router.get("/patient-appointments/:name", async (req, res, next) => {
  try {
    const appointments = await APPOINTMENT.find({
      patient_name: req.params.name,
      confirm_status: true,
    });

    res.json(appointments);
  } catch (error) {
    next(error);
  }
});

router.put("/confirm-appointment/:id", async (req, res, next) => {
  try {
    const appointment = await APPOINTMENT.findByIdAndUpdate(
      req.params.id,
      { confirm_status: true },
      { new: true }
    );

    res.json(appointment);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
