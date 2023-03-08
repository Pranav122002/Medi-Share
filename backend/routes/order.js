const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const ORDER = mongoose.model("ORDER");

// Route
router.get("/allorders", (req, res) => {
  ORDER.find()
  .select(" -__v -execute_status -verify_status -requester -password")
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

    if (data) return res.json({ msg: "Order placed successfully..." });
    else return res.json({ msg: "Failed to place order..." });
  } catch (ex) {
    next(ex);
  }
});

router.put("/request/:order_id", (req, res) => {

if (req.body.execute_status === false && req.body.verify_status === true) {
  ORDER.findByIdAndUpdate(
    req.params.order_id,
    { $set: { execute_status: true, requester: req.body.requester_id } },
    { new: true }
  )
    .then((doc) => {
      console.log(doc);
      res.json("Order Requested successfully...");
    })
    .catch((err) => {
      console.error(err);
    });
} else if(req.body.execute_status === true){
  res.json("Order is already executed...");
}  
else if(req.body.verify_status === false){
  res.json("Order is not verfied by Volunteer yet...");
}
else {
  res.json("Failed to request order...");
}

 
});

// to get order profile
router.get("/order/:id", (req, res) => {
  ORDER.findOne({ _id: req.params.id })
    .then((order) => {
      return res.json(order);
    })
    .catch((err) => {
      return res.status(404).json({ error: "Order not found..." });
    });
});


module.exports = router;
