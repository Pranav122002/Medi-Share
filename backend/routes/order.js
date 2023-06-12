const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const ORDER = mongoose.model("ORDER");
const USER = mongoose.model("USER");

router.get("/api/req-order/:order_id", (req, res) => {
  ORDER.findOne({ _id: req.params.order_id })
    .populate("requester", "name -_id")
    .populate("donar", "name -_id")
    .then((order) => {
      if (!order) {
        return res.status(404).json({ error: "Order not found..." });
      }

      const isDonarFieldBlank = !order.donar;

      return res.json({ order, isDonarFieldBlank });
    })
    .catch((err) => console.log(err));
});

router.get("/api/order/:id", (req, res) => {
  ORDER.findOne({ _id: req.params.id })
    .then((order) => {
      return res.json(order);
    })
    .catch((err) => {
      return res.status(404).json({ error: "Order not found..." });
    });
});

router.get("/api/allorders", (req, res) => {
  ORDER.find({ execute_status: false })
    .select(" -__v -execute_status -password")
    .populate("requester", "name -_id")
    .populate("donar", "name -_id")
    .sort("-createdAt")
    .then((orders) => res.json(orders))
    .catch((err) => console.log(err));
});

router.post("/api/donate-medicines", async (req, res, next) => {
  try {
    const { medicine_name, expiry_date, quantity, location, donar, requester } =
      req.body;
    const data = await ORDER.create({
      order_type: "donate-order",
      medicine_name: medicine_name,
      expiry_date: expiry_date,
      location: location,
      quantity: quantity,
      donar: donar,
      requester: requester,
    });
    if (data) {

      await USER.updateOne(
        { _id: donar },
        { $inc: { credits: 100 } }
      );

      return res.json({ msg: "Donate Order placed successfully..." });
    } else return res.json({ msg: "Failed to place order..." });
  } catch (ex) {
    next(ex);
  }
});

router.post("/api/request-medicines", async (req, res, next) => {
  try {
    const { medicine_name, expiry_date, quantity, location, donar, requester } =
      req.body;
    const data = await ORDER.create({
      order_type: "request-order",
      medicine_name: medicine_name,
      expiry_date: expiry_date,
      location: location,
      quantity: quantity,
      donar: donar,
      requester: requester,
    });
    if (data) {
      return res.json({ msg: "Request Order placed successfully..." });
    } else return res.json({ msg: "Failed to place order..." });
  } catch (ex) {
    next(ex);
  }
});

router.put("/api/donate/:order_id", async (req, res) => {
  try {
    const order = await ORDER.findOne({ _id: req.params.order_id });

    if (
      req.body.execute_status === false &&
      req.body.verify_status === false
    ) {
      const updatedOrder = await ORDER.findByIdAndUpdate(
        req.params.order_id,
        {
          $set: { execute_status: true, donar: req.body.donar_id },
        },
        { new: true }
      );

      if (updatedOrder) {
       
        await USER.updateOne(
          { _id: req.body.donar_id },
          { $inc: { credits: 100 } }
        );

        console.log(updatedOrder);
        return res.json("Order Donated successfully and Volunteer will verify now...");
      } else {
        return res.json("Failed to donate order...");
      }
    } else if (
      req.body.execute_status === true &&
      req.body.verify_status === true
    ) {
      return res.json("Order is already executed...");
    } else if (
      req.body.execute_status === true &&
      req.body.verify_status === false
    ) {
      return res.json("Order is already donated but is not verified yet...");
    } else {
      return res.json("Failed to donate order...");
    }
  } catch (err) {
    return res.status(404).json({ error: "Order not found..." });
  }
});


router.put("/api/request/:order_id", (req, res) => {
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
              res.json("Order Requested successfully and now will be delivered...");
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



router.get("/api/mydonatedorders/:id", (req, res) => {
  ORDER.find({ donar: req.params.id })
    .select(" -__v -execute_status -verify_status -requester ")
    .populate("donar", "name -_id")
    .sort("-createdAt")
    .then((orders) => res.json(orders))
    .catch((err) => console.log(err));
});

router.get("/api/myrequestedorders/:id", (req, res) => {
  ORDER.find({ requester: req.params.id })
    .select(" -__v -execute_status -verify_status -donar")
    .populate("requester", "name -_id")
    .sort("-createdAt")
    .then((orders) => res.json(orders))
    .catch((err) => console.log(err));
});

router.get("/api/unverifiedorders", (req, res) => {
  ORDER.find({ verify_status: false })
    .select(" -__v -execute_status ")
    .populate("donar", "name -_id")
    .populate("requester", "name -_id")
    .sort("-createdAt")
    .then((orders) => res.json(orders))
    .catch((err) => console.log(err));
});

router.put("/api/verify-donate-order/:order_id", (req, res) => {
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

router.put("/api/verify-request-order/:order_id", (req, res) => {
  ORDER.findByIdAndUpdate(
    req.params.order_id,
    { $set: { verify_status: true} },
    { new: true }
  )
    .then((doc) => {
      console.log(doc);
      res.json("Order Verified successfully and now will be Donated...");
    })
    .catch((err) => {
      console.error(err);
    });
});

module.exports = router;
