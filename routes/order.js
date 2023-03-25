const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const ORDER = mongoose.model("ORDER");

router.get("/allorders", (req, res) => {
  ORDER.find()
    .select(" -__v -execute_status -requester -password")
    .populate("donar", "name -_id")
    .sort("-createdAt")
    .then((orders) => res.json(orders))
    .catch((err) => console.log(err));
});

router.get("/alldonateorders", (req, res) => {
  ORDER.find({ execute_status: false })
    .select(" -__v -execute_status -requester -password")
    .populate("donar", "name -_id")
    .sort("-createdAt")
    .then((orders) => res.json(orders))
    .catch((err) => console.log(err));
});

router.post("/donate", async (req, res, next) => {
  try {
    const { medicine_name, expiry_date, quantity, location, donar, requester } =
      req.body;
    const data = await ORDER.create({
      medicine_name: medicine_name,
      expiry_date: expiry_date,
      location: location,
      quantity: quantity,
      donar: donar,
      requester: requester,
    });
    if (data) return res.json({ msg: "Donate Order placed successfully..." });
    else return res.json({ msg: "Failed to place order..." });
  } catch (ex) {
    next(ex);
  }
});

router.put("/request/:order_id", (req, res) => {
  ORDER.findOne({ _id: req.params.order_id })
    .then((order) => {
      const curr_date = new Date();
      console.log(" curr_date = ", curr_date);

      const exp_date = new Date(order.expiry_date);
      console.log(" exp_date = ", exp_date);

      if (curr_date <= exp_date) {
        if (
          req.body.execute_status === false &&
          req.body.verify_status === true
        ) {
          ORDER.findByIdAndUpdate(
            req.params.order_id,
            {
              $set: { execute_status: true, requester: req.body.requester_id },
            },
            { new: true }
          )
            .then((doc) => {
              console.log(doc);
              res.json("Order Requested successfully...");
            })
            .catch((err) => {
              console.error(err);
            });
        } else if (req.body.execute_status === true) {
          res.json("Order is already executed...");
        } else if (req.body.verify_status === false) {
          res.json("Order is not verfied by Volunteer yet...");
        } else {
          res.json("Failed to request order...");
        }
      } else if (curr_date > exp_date) {
        res.json("Medicine is expired...");
      }
    })
    .catch((err) => {
      return res.status(404).json({ error: "Order not found..." });
    });
});

router.get("/order/:id", (req, res) => {
  ORDER.findOne({ _id: req.params.id })
    .then((order) => {
      return res.json(order);
    })
    .catch((err) => {
      return res.status(404).json({ error: "Order not found..." });
    });
});

router.get("/mydonatedorders/:id", (req, res) => {
  ORDER.find({ donar: req.params.id })
    .select(" -__v -execute_status -verify_status -requester ")
    .populate("donar", "name -_id")
    .sort("-createdAt")
    .then((orders) => res.json(orders))
    .catch((err) => console.log(err));
});

router.get("/myrequestedorders/:id", (req, res) => {
  ORDER.find({ requester: req.params.id })
    .select(" -__v -execute_status -verify_status -donar")
    .populate("requester", "name -_id")
    .sort("-createdAt")
    .then((orders) => res.json(orders))
    .catch((err) => console.log(err));
});

router.get("/unverifiedorders", (req, res) => {
  ORDER.find({ verify_status: false })
    .select(" -__v -execute_status -requester")
    .populate("donar", "name -_id")
    .sort("-createdAt")
    .then((orders) => res.json(orders))
    .catch((err) => console.log(err));
});

router.put("/verifyorder/:order_id", (req, res) => {
  ORDER.findByIdAndUpdate(
    req.params.order_id,
    { $set: { verify_status: true } },
    { new: true }
  )
    .then((doc) => {
      console.log(doc);
      res.json("Order Verified successfully...");
    })
    .catch((err) => {
      console.error(err);
    });
});

module.exports = router;
