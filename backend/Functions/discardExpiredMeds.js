const mongoose = require("mongoose");
const ORDER = mongoose.model("ORDER");
const MEDICINE = mongoose.model("MEDICINE");

const discardExpiredMeds = async () => {
  //find all the orders which have expired medicines.
  //find all those medicines in MEDICINE Model and decrement the medicine count.
  try {
    const currentDate = new Date();
    const expiredOrders = await ORDER.find({
      "medicines.expiry_date.date": { $lt: currentDate },
      "medicines.expiry_date.check_isExpired": { $ne: true },
      $or: [{ verify_status: true }, { execute_status: true }],
    });

    for (const order of expiredOrders) {
      for (const medicine of order.medicines) {
        if (
          medicine.expiry_date.date < currentDate &&
          !medicine.expiry_date.check_isExpired
        ) {
          const updatedMedicine = await MEDICINE.findOneAndUpdate(
            { medicine_name: medicine.medicine_name },
            { $inc: { count: -medicine.quantity } },
            { new: true }
          );
          if (updatedMedicine) {
            medicine.expiry_date.check_isExpired = true;
            await order.save();
          }
        }
      }
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = discardExpiredMeds;
