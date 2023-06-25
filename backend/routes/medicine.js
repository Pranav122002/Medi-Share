const express = require("express");
const router = express.Router();
const moment = require("moment-timezone");
const mongoose = require("mongoose");
const MEDICINE = mongoose.model("MEDICINE");
const ORDER = mongoose.model("ORDER");
const USER = mongoose.model("USER");
const assignVolunteer = require("../Functions/assignVolunteer");

router.get("/api/allmedicines", (req, res) => {
  MEDICINE.find()
    .select("-__v")
    .sort("-createdAt")
    .then((medicines) => res.json(medicines))
    .catch((err) => console.log(err));
});

router.post("/api/addmedicine", async (req, res, next) => {
  try {
    const { medicine_name, description, disease } = req.body;
    const data = await MEDICINE.create({
      medicine_name: medicine_name,
      description: description,
      disease: disease,
    });

    if (data) return res.json({ msg: "Medicine added." });
    else return res.json({ msg: "Failed to add medicine." });
  } catch (ex) {
    next(ex);
  }
});

router.post("/api/add-medicines", async (req, res, next) => {
  try {
    const medicines = req.body;

    const createdMedicines = await MEDICINE.create(medicines);

    if (createdMedicines.length === medicines.length) {
      return res.json({ msg: "Medicines added successfully." });
    } else {
      return res.json({ msg: "Failed to add medicines." });
    }
  } catch (ex) {
    next(ex);
  }
});

router.post("/api/search-medicines", (req, res) => {
  let userPattern = new RegExp(req.body.query, "i"); // add "^" at start for exact search
  MEDICINE.find({ medicine_name: { $regex: userPattern } })
    .select("-__v")
    .then((medicine) => {
      res.json({ medicine });
    })
    .catch((err) => {
      console.log(err);
    });
});
router.post("/api/medicine-availablity", async (req, res, next) => {
  const cart = req.body.cart;

  const Availability = await Promise.all(
    cart.map(async (med) => {
      try {
        const result = await MEDICINE.findById(med.med_id).select(
          "medicine_name count"
        );

        if (result.count < med.quantity) {
          return result.medicine_name;
        } else {
          return null;
        }
      } catch (err) {
        console.log(err);
      }
    })
  );
  const filteredAvailability = Availability.filter((item) => item !== null);

  if (filteredAvailability.length > 0) {
    res.json(filteredAvailability);
  } else {
    const istDate = moment().tz("Asia/Kolkata").format("DD-MM-YYYY");
    const istTime = moment().tz("Asia/Kolkata").format("HH:mm:ss");
    try {
      const { cart, userID, location, coordinates, totalmeds, medicine_request_limit } = req.body;

      const data = await ORDER.create({
        order_type: "request-order",
        medicines: cart,
        location: {
          location,
          ...(coordinates ? { lng: coordinates[0], lat: coordinates[1] } : {}),
        },
        requester: userID,
        no_of_medicines: cart.length,
        order_creation_date: {
          date: istDate,
          time: istTime,
        },
        no_of_medicines: totalmeds
      });
      if (data) {

        const updateData = {
          cart: [],
          medicine_request_limit: medicine_request_limit
        };
        const nextMonth = new Date();
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        if (medicine_request_limit === 0) {
          updateData.reset_date = nextMonth;
        }
        
        USER.findByIdAndUpdate(
          req.body.userID,
          updateData,
          { new: true }
        ).then((user) => {
          if (user) {
            console.log(user)
            res.json({ success: "Request Order placed successfully" });
            //volunteer assignment
            assignVolunteer(data._id, coordinates);
          } else {
            res.json({ error: "Failed to update user cart" });
          }
        });
      } else {
        return res.json({ error: "Failed to place order" });
      }
    } catch (ex) {
      next(ex);
    }
  }
});
module.exports = router;
