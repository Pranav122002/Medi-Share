const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const APPOINTMENT = mongoose.model("APPOINTMENT");
const USER = mongoose.model("USER");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { MONGOURI, JWT_SECRET } = require("../config/keys.js");

router.post("/api/book-appointment/:id", async (req, res, next) => {
  try {
    const { doctor, patient, appointment_date, appointment_time } = req.body;

    const data = await APPOINTMENT.create({
      doctor: doctor,
      patient: patient,
      appointment_date: appointment_date,
      appointment_time: appointment_time,
    });

    if (data) {
      return res.json({
        msg: "Appointment placed successfully. The doctor will confirm now.",
      });
    } else {
      return res.json({ msg: "Failed to place the appointment." });
    }
  } catch (ex) {
    next(ex);
  }
});

router.get("/api/my-doctor-appointments/:id", async (req, res, next) => {
  try {
    const appointments = await APPOINTMENT.find({
      doctor: req.params.id,
    })
      .populate("doctor", "-password")
      .populate("patient", "-password");
    res.json(appointments);
  } catch (error) {
    next(error);
  }
});

router.get("/api/my-patient-appointments/:id", async (req, res, next) => {
  try {
    const appointments = await APPOINTMENT.find({
      patient: req.params.id,
    })
      .populate("doctor", "-password")
      .populate("patient", "-password");
    res.json(appointments);
  } catch (error) {
    next(error);
  }
});

router.get("/api/doctor-appointments/:id", async (req, res, next) => {
  try {
    const appointments = await APPOINTMENT.find({
      doctor: req.params.id,
    })
      .populate("doctor", "-password")
      .populate("patient", "-password");

    res.json(appointments);
  } catch (error) {
    next(error);
  }
});

router.get("/api/patient-appointments/:id", async (req, res, next) => {
  try {
    const appointments = await APPOINTMENT.find({
      patient: req.params.id,
    })
      .populate("doctor", "-password")
      .populate("patient", "-password");

    res.json(appointments);
  } catch (error) {
    next(error);
  }
});

router.put("/api/confirm-appointment/:id", async (req, res, next) => {
  try {
    const appointment = await APPOINTMENT.findById(req.params.id);

    const patient = await USER.findById(appointment.patient);
    const doctor = await USER.findById(appointment.doctor);

    if (patient.credits >= doctor.doctor_details.fees) {
      patient.credits -= doctor.doctor_details.fees;
      await patient.save();

      appointment.confirm_status = true;
      appointment.reject_status = false;
      await appointment.save();

      res.json(appointment);
    } else {
      return res.json(
        "Patient has insufficient credits. Please reject the appointment."
      );
    }
  } catch (error) {
    next(error);
  }
});

router.put("/api/reject-appointment/:id", async (req, res, next) => {
  try {
    const appointment = await APPOINTMENT.findByIdAndUpdate(
      req.params.id,
      { confirm_status: false, reject_status: true },
      { new: true }
    );

    res.json(appointment);
  } catch (error) {
    next(error);
  }
});

router.put("/api/add-appointment-link/:id", async (req, res, next) => {
  const { appointment_link } = req.body;

  try {
    const appointment = await APPOINTMENT.findByIdAndUpdate(
      req.params.id,
      { appointment_link: appointment_link },
      { new: true }
    );

    res.json(appointment);
  } catch (error) {
    next(error);
  }
});

router.put("/api/add-rating-feedback/:id", async (req, res, next) => {
  const { rating, feedback } = req.body;

  try {
    const appointment = await APPOINTMENT.findByIdAndUpdate(
      req.params.id,
      { rating: rating, feedback: feedback },
      { new: true }
    );

    res.json(appointment);
  } catch (error) {
    next(error);
  }
});

router.get("/api/doctor-ratings-feedbacks/:id", async (req, res, next) => {
  try {
    const appointments = await APPOINTMENT.find({
      doctor: req.params.id,
      $or: [{ rating: { $exists: true } }, { feedback: { $exists: true } }],
    }).select("rating feedback");

    res.json(appointments);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
