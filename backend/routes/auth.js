const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const USER = mongoose.model("USER");
const DOCTOR = mongoose.model("DOCTOR");
const VOLUNTEER = mongoose.model("VOLUNTEER");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { MONGOURI, JWT_SECRET } = require("../config/keys.js");

router.post("/api/signup", async (req, res) => {
  try {
    const { name, email, phone_no, password, role, certificate } = req.body;
    if (!name || !email || !password || !phone_no) {
      return res.status(422).json({ error: "Please add all the fields." });
    }

    const savedUser = await USER.findOne({ email: email });
    if (savedUser) {
      return res
        .status(422)
        .json({ error: "User already exists with that email." });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new USER({
      name,
      email,
      phone_no,
      password: hashedPassword,
      role: role,
    });

    let newUser;
    if (role === "user") {
      const userData = await user.save();
      res.json(userData);
    } else if (role === "doctor") {
      newUser = new DOCTOR(user);
      newUser.doctor_details.certificate = certificate;
      const userData = await newUser.save();
      res.json(userData);
    } else if (role === "volunteer") {
      newUser = new VOLUNTEER(user);
      newUser.volunteer_details.certificate = certificate;

      const userData = await newUser.save();
      res.json(userData);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred while signing up." });
  }
});

router.post("/api/signin", (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password) {
    return res.status(422).json({ error: "Please add email and password." });
  }

  USER.findOne({ email: email }).then((savedUser) => {
    if (!savedUser) {
      return res.status(422).json({ error: "Invalid email" });
    }
    bcrypt
      .compare(password, savedUser.password)
      .then((match) => {
        if (match) {
          const token = jwt.sign({ _id: savedUser.id }, JWT_SECRET);
          const { _id, name, email, role, subscription } = savedUser;
          if (savedUser.role === "doctor") {
            if (savedUser.doctor_details.verification === "unverified") {
              return res
                .status(422)
                .json({ error: "You have not been verified yet by Admin." });
            }
          }
          if (savedUser.role === "volunteer") {
            if (savedUser.volunteer_details.verification === "unverified") {
              return res
                .status(422)
                .json({ error: "You have not been verified yet by Admin." });
            }
          }
          res.json({ token, user: { _id, name, email, role, subscription } });
        } else {
          return res.status(422).json({ error: "Invalid password" });
        }
      })
      .catch((err) => console.log(err));
  });
});

router.get("/api/allusers/:id", async (req, res, next) => {
  try {
    const users = await USER.find({ _id: { $ne: req.params.id } }).select([
      "email",
      "name",
      "_id",
      "role",
    ]);
    return res.json(users);
  } catch (ex) {
    next(ex);
  }
});

router.get("/api/all-chat-users/:id", async (req, res, next) => {
  try {
    const users = await USER.find({
      _id: { $ne: req.params.id },
      role: { $ne: "admin" },
    }).select("-email -password");
    return res.json(users);
  } catch (ex) {
    next(ex);
  }
});

module.exports = router;
