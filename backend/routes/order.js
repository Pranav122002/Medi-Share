require("dotenv").config();
const moment = require("moment-timezone");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const ORDER = mongoose.model("ORDER");
const USER = mongoose.model("USER");
const VOLUNTEER = mongoose.model("VOLUNTEER");
const MEDICINE = mongoose.model("MEDICINE");
const assignVolunteer = require("../Functions/assignVolunteer");
const path = require("path");
const medicine = require("../models/medicine");
const smsNotification = require("../Functions/SMSnotification");
const discardExpiredMeds = require("../Functions/discardExpiredMeds");

router.get("/api/all-remaining-orders", (req, res) => {
  ORDER.find({ execute_status: false })
    .select(" -__v -execute_status -password")
    .populate("requester", "name -_id")
    .populate("donar", "name -_id")
    .sort("-createdAt")
    .then((orders) => res.json(orders))
    .catch((err) => console.log(err));
});

router.get("/api/all-orders", async (req, res) => {
  ORDER.find()
    .populate("medicines")
    .populate("location")
    .populate("feedback")
    .populate("order_creation_date")
    .populate("order_assign_date")
    .populate("donar", "-password")
    .populate("requester", "-password")
    .populate("assigned_vol", "-password")
    .sort("-createdAt")
    .then((orders) => res.json(orders))
    .catch((err) => {
      console.log(err);
    });
});

router.get("/api/all-donate-orders", (req, res) => {
  ORDER.find({ order_type: "donate-order" })
    .populate("requester", "name -_id")
    .populate("donar", "name phone_no -_id")
    .sort("-createdAt")
    .then((orders) => res.json(orders))
    .catch((err) => console.log(err));
});

router.get("/api/req-order/:order_id", (req, res) => {
  ORDER.findOne({ _id: req.params.order_id })
    .populate("requester", "name -_id")
    .populate("donar", "name -_id")
    .then((order) => {
      if (!order) {
        return res.status(404).json({ error: "Order not found." });
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
      return res.status(404).json({ error: "Order not found." });
    });
});

router.get("/api/allorders", async (req, res) => {
  const pageNumber = parseInt(req.query.page) || 1; // Get the page number from the request query parameter
  const filterOption = req.query.filterOption;
  console.log();
  const pageSize = 100; // Number of orders per page

  try {
    let filter = {};

    //for
    if (filterOption === "Assigned") {
      filter.assigned_vol = null;
    } else if (filterOption === "Unassigned") {
      filter.assigned_vol = { $ne: null };
    } else if (filterOption === "Executed") {
      filter.execute_status = true;
    } else if (filterOption === "Verified") {
      filter.verify_status = true;
    }
    const totalFilteredOrders = await ORDER.countDocuments(filter);
    const totalOrders = await ORDER.countDocuments();
    const orders = await ORDER.find(filter)
      .select(" -__v -execute_status -password")
      .populate("requester", "name -_id")
      .populate("donar", "name -_id")
      .populate("assigned_vol", "name")
      .sort({ order_creation_date: -1 })
      .limit(pageSize)
      .skip((pageNumber - 1) * pageSize);
    // console.log(order.location.location)
    res.json({ orders, totalOrders, totalFilteredOrders });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

router.post("/api/donate-medicines", async (req, res, next) => {
  const istDate = moment().tz("Asia/Kolkata").format("DD-MM-YYYY");
  const istTime = moment().tz("Asia/Kolkata").format("HH:mm:ss");
  try {
    const {
      medicines,
      no_of_medicines,
      location,
      donar,
      requester,
      coordinates,
    } = req.body;
    // var coordinates = null
    console.log("coordinates: ", coordinates);
    const data = await ORDER.create({
      order_type: "donate-order",
      medicines: medicines,
      location: {
        location,
        ...(coordinates ? { lng: coordinates[0], lat: coordinates[1] } : {}),
      },
      donar: donar,
      requester: requester,
      no_of_medicines: no_of_medicines,
      order_creation_date: {
        date: istDate,
        time: istTime,
      },
    });
    if (data) {
      await USER.updateOne({ _id: donar }, { $inc: { credits: 100 } });
      res.json({ msg: "Donate Order placed successfully..." });
      //assignin volunteers to a order
      assignVolunteer(data._id, coordinates);
    } else res.json({ msg: "Failed to place order..." });
  } catch (ex) {
    next(ex);
  }
});

router.post("/api/request-medicines", async (req, res, next) => {
  try {
    const { cart, medCount, userID, location } = req.body;
    const data = await ORDER.create({
      order_type: "request-order",
      medicines: cart,
      location: location,
      requester: userID,
      no_of_medicines: medCount,
    });
    if (data) {
      return res.json({ msg: "Request Order placed successfully." });
    } else {
      console.log("Unable to Request");
      return res.json({ msg: "Failed to place order..." });
    }
  } catch (ex) {
    next(ex);
  }
});

router.put("/api/donate/:order_id", async (req, res) => {
  try {
    const order = await ORDER.findOne({ _id: req.params.order_id });

    if (req.body.execute_status === false && req.body.verify_status === false) {
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

        return res.json(
          "Order Donated successfully and Volunteer will verify now."
        );
      } else {
        return res.json("Failed to donate order.");
      }
    } else if (
      req.body.execute_status === true &&
      req.body.verify_status === true
    ) {
      return res.json("Order is already executed.");
    } else if (
      req.body.execute_status === true &&
      req.body.verify_status === false
    ) {
      return res.json("Order is already donated but is not verified yet.");
    } else {
      return res.json("Failed to donate order.");
    }
  } catch (err) {
    return res.status(404).json({ error: "Order not found." });
  }
});

router.put("/api/delivery-executed/:order_id", (req, res) => {
  console.log("order id : ", req.params.order_id);
  ORDER.findByIdAndUpdate(
    req.params.order_id,
    { $set: { execute_status: true } },
    { new: true }
  )
    .populate("requester", "name phone_no -_id")
    .populate("assigned_vol", "name -_id")
    .then((res) => {
      console.log(res);
      const order_id = req.params.order_id.toString().slice(-4);
      const userName = res.requester.name;
      const user_phone_no = res.requester.phone_no;
      const vol_name = res.assigned_vol.name;
      var msg = `Hey, ${userName}. Your ORDER ${order_id} has been DELIVERED by volunteer ${vol_name}. Please spare some time to fill the FEEDBACK form in the profile section of the Medi-Share website`;
      smsNotification(msg, user_phone_no);
      // console.log(msg)
    })
    .catch((err) => {
      res.status(500).json({ error: "order can't be updated" });
    });
});

router.put("/api/request/:order_id", (req, res) => {
  ORDER.findOne({ _id: req.params.order_id })
    .then((order) => {
      const curr_date = new Date();
      const exp_date = new Date(order.expiry_date.date);

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
              res.json(
                "Order Requested successfully and now will be delivered."
              );
            })
            .catch((err) => {
              console.error(err);
            });
        } else if (req.body.execute_status === true) {
          res.json("Order is already executed.");
        } else if (req.body.verify_status === false) {
          res.json("Order is not verfied by Volunteer yet.");
        } else {
          res.json("Failed to request order.");
        }
      } else if (curr_date > exp_date) {
        res.json("Medicine is expired.");
      }
    })
    .catch((err) => {
      return res.status(404).json({ error: "Order not found..." });
    });
});

router.put("/api/assign-order/:id", (req, res) => {
  const istDate = moment().tz("Asia/Kolkata").format("DD-MM-YYYY");
  const istTime = moment().tz("Asia/Kolkata").format("HH:mm:ss");
  ORDER.findByIdAndUpdate(
    req.params.id,
    {
      assigned_vol: req.body.assigned_vol,
      pickup_deadline: req.body.pickup_deadline,
      order_assign_date: {
        date: istDate,
        time: istTime,
      },
    },
    { new: true }
  )
    .populate("assigned_vol", "name phone_no -_id")
    .then((updatedOrder) => {
      if (updatedOrder) {
        console.log(updatedOrder);
        res.json({ msg: "Order assigned successfully", data: updatedOrder });
        //Send SMS notification to the volunteer about the order

        const vol_name = updatedOrder.assigned_vol.name;
        const order_type = updatedOrder.order_type;
        const order_id = updatedOrder._id.toString().slice(-4);
        const vol_phone_no = updatedOrder.assigned_vol.phone_no;
        const msg = `Hey,${vol_name}. You've been assigned a/an ${order_type} ${order_id}. Login to the Medi-Share website to accept it.`;
        smsNotification(msg, vol_phone_no);
      } else {
        res.json({ error: "Order not found" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.json({ error: "Order assignment unsuccessful" });
    });
});

router.get("/api/mydonatedorders/:id", (req, res) => {
  ORDER.find({ donar: req.params.id })
    .select(" -__v -execute_status -requester ")
    .populate("donar", "name -_id")
    .sort({ order_creation_date: -1 })
    .then((orders) => res.json(orders))
    .catch((err) => console.log(err));
});

router.get("/api/myrequestedorders/:id", (req, res) => {
  ORDER.find({ requester: req.params.id })
    .select(" -__v -verify_status -donar")
    .populate("requester", "name -_id")
    .sort({ order_creation_date: -1 })
    .then((orders) => res.json(orders))
    .catch((err) => console.log(err));
});

router.get("/api/unverifiedorders/:id", (req, res) => {
  ORDER.find({ assigned_vol: req.params.id })
    .select(" -__v ")
    .populate("donar", "name phone_no -_id")
    .populate("requester", "name phone_no -_id")
    .sort({ order_assign_date: -1 })
    .then((orders) => res.json(orders))
    .catch((err) => console.log(err));
});

router.put("/api/verify-donate-order/:order_id", (req, res) => {
  ORDER.findByIdAndUpdate(
    req.params.order_id,
    { $set: { verify_status: true } },
    { new: true }
  )
    .populate("donar", "name phone_no -_id")
    .populate("assigned_vol", "name")
    .then((doc) => {
      res.json("Order Verified successfully...");

      const medicines = doc.medicines;
      // Prepare the bulk operations array
      const bulkOps = medicines.map((medicine) => ({
        updateOne: {
          filter: { medicine_name: medicine.medicine_name },
          update: { $inc: { count: medicine.quantity } },
        },
      }));

      MEDICINE.bulkWrite(bulkOps)
        .then((result) => {
          //update the volunteer's verified_order_list
          const vol_id = doc.assigned_vol._id;
          console.log("doc.assigned_vol: ", doc.assigned_vol._id);
          VOLUNTEER.findByIdAndUpdate(vol_id, {
            $push: {
              "volunteer_details.verified_orders": {
                order_id: req.params.order_id,
              },
            },
            $pull: {
              "volunteer_details.accepted_orders": {
                order_id: req.params.order_id,
              },
            },
          })
            .then((result) => console.log(result))
            .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));

      //send SMS to the donars that the medicines have been collected
      console.log(doc);
      const order_id = req.params.order_id.toString().slice(-4);
      const userName = doc.donar.name;
      const user_phone_no = doc.donar.phone_no;
      const vol_name = doc.assigned_vol.name;
      var msg = `Hey, ${userName}. Your MEDICINES (ORDER ID ${order_id}) has been COLLECTED by volunteer ${vol_name}. Please spare some time to fill the FEEDBACK form in the profile section of the Medi-Share website`;
      // smsNotification(msg, user_phone_no)
      console.log(msg, user_phone_no);
    });
});

router.put("/api/verify-request-order/:order_id", (req, res) => {
  ORDER.findByIdAndUpdate(
    req.params.order_id,
    {
      $set: { verify_status: true },
    },
    { new: true }
  )
    .then((doc) => {
      console.log(doc);
      res.json("Order Verified successfully and now will be Donated.");
      res.json("Order Verified successfully and now will be Donated...");
    })
    .catch((err) => {
      console.error(err);
    });
});

router.put("/api/volunteer-accept/:id", (req, res) => {
  const vol_id = req.body.VolunteerId;
  ORDER.findByIdAndUpdate(
    req.params.id,
    {
      $set: { acceptance_status: "accepted" },
    },
    { new: true }
  )
    .populate("requester", "name phone_no -_id")
    .populate("donar", "name phone_no -_id")
    .populate("assigned_vol", "name -_id")
    .then((doc) => {
      console.log(doc);
      res.json("Order has been accepted");

      //Add this order to accepted_list of the volunteer
      VOLUNTEER.findByIdAndUpdate(
        vol_id,
        {
          $push: {
            "volunteer_details.accepted_orders": { order_id: req.params.id },
          },
        },
        { new: true }
      )
        .then((result) => console.log("accepted_list : ", result))
        .catch((err) => {
          console.error(err);
        });

      if (doc.order_type === "requset-order") {
        const medicines = doc.medicines;
        const bulkOps = medicines.map((medicine) => ({
          updateOne: {
            filter: { medicine_name: medicine.medicine_name },
            update: { $inc: { count: -medicine.quantity } },
          },
        }));
        // Prepare the bulk operations array

        MEDICINE.bulkWrite(bulkOps).then((result) => {
          console.log("Medince count updaed");
        });
      }

      const order_id = req.params.id.toString().slice(-4);
      const userName = doc.donar ? doc.donar.name : doc.requester.name;
      const user_phone_no = doc.donar
        ? doc.donar.phone_no
        : doc.requester.phone_no;
      const vol_name = doc.assigned_vol.name;
      var msg = `Hey, ${userName}. Your order ${order_id} has been assigned to ${vol_name}.`;
      if (doc.order_type === "donate-order") {
        msg += " The medicines will be collected soon.";
      } else if (doc.order_type === "request-order") {
        msg += " The order will be delivered soon.";
      }
      console.log(msg);
      // smsNotification(msg, user_phone_no)
    })
    .catch((err) => {
      console.error(err);
    });
});

router.put("/api/volunteer-reject/:id", (req, res) => {
  const vol_id = req.body.VolunteerId;
  console.log(req.body);
  console.log("Volid", vol_id);
  ORDER.findByIdAndUpdate(
    req.params.id,
    {
      $set: { acceptance_status: "pending" },
      $unset: { assigned_vol: 1, pickup_deadline: 1, order_assign_date: 1 },
    },
    { new: true }
  )
    .then((doc) => {
      // console.log(doc._id, doc)
      const order_location = [doc.location.lng, doc.location.lat];
      console.log("Order has been rejected");
      res.json("Order has been rejected");

      //Add the rejected order in the volunteer's rejected list.
      //This is done so that the order isn't assigned to this volunteer again.

      VOLUNTEER.findByIdAndUpdate(
        vol_id,
        {
          $push: {
            "volunteer_details.rejected_orders": { order_id: req.params.id },
          },
          $pull: {
            "volunteer_details.assigned_orders": { order_id: req.params.id },
          },
        },
        { new: true }
      ).then((result) => {
        console.log(result);
        if (result) {
          assignVolunteer(req.params.id, order_location);
        }
      });
    })
    .catch((err) => {
      console.error(err);
    });
});

router.post("/api/feedback/:order_id", (req, res) => {
  console.log(req.body);
  const stars = req.body.stars;
  const feedback = req.body.feedback;
  ORDER.findByIdAndUpdate(
    req.params.order_id,
    {
      $set: {
        feedback: {
          stars: stars,
          feedback: feedback,
        },
      },
    },
    { new: true }
  )
    .then((doc) => {
      console.log(doc);
      res.status(200).json({ success: "Thanks for your feedback" });
      VOLUNTEER.findByIdAndUpdate(
        //increment the avg_stars and feedback count
        doc.assigned_vol,
        {
          $inc: {
            "volunteer_details.feedback_count": 1,
            "volunteer_details.avg_stars": stars,
          },
        },
        { new: true }
      )
        .exec()
        .then((updatedVol) => {
          console.log(updatedVol);
          //use aggregate function to find the volunteer and perform division operation to get the avg.
          VOLUNTEER.aggregate([
            { $match: { _id: doc.assigned_vol } },
            {
              $project: {
                avg_stars: {
                  $divide: [
                    "$volunteer_details.avg_stars",
                    "$volunteer_details.feedback_count",
                  ],
                },
              },
            },
            { $limit: 1 },
          ])
            .exec()
            .then((results) => {
              //update the volunteer with the obtained results
              // console.log(results)
              console.log("avg stars updated");
              if (results.length > 0) {
                const avgStars = results[0].avg_stars;

                VOLUNTEER.findByIdAndUpdate(
                  doc.assigned_vol,
                  { $set: { "volunteer_details.avg_stars": avgStars } },
                  { new: true }
                )
                  .exec()
                  .then((updatedVolunteer) => {
                    console.log(updatedVolunteer);
                  })
                  .catch((error) => {
                    console.log(error);
                  });
              }
            });
        })
        .then((res) => {})
        .catch((err) => console.log(err));
    })

    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Feedback Error" });
    });
});

router.post("/api/order-rejected/:id", (req, res) => {
  console.log("rejecting the order");
  ORDER.findByIdAndUpdate(
    req.params.id,
    { is_order_rejected: true },
    { new: true }
  )
    .then((doc) =>
      res.status(200).json({ msg: "Order has been rejected", data: doc })
    )
    .catch((err) => console.log(err));
});
module.exports = router;
