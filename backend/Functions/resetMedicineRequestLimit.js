const mongoose = require("mongoose");
const USER = mongoose.model("USER");
const smsNotification = require("./SMSnotification");

const resetMedicineRequestLimit = async () => {
  try {
    // Calculate the date one month ago
    const Today = new Date();

    // Find users with request_limit: 0 and reset_date is equal to current date
    const users = await USER.find({
      medicine_request_limit: 0,
      reset_date: { $eq: Today },
    });

    // Update the medicine_request_limit field for the users
    const updatePromises = users.map((user) => {
      return USER.updateOne(
        { _id: user._id },
        { $set: { medicine_request_limit: 50 } }
      );
    });
    await Promise.all(updatePromises);

    // Send notifications to users
    const notificationPromises = users.map((user) => {
      return smsNotification(user.phone_no, "Your medicine request limit has been reset to 50.");
    
    });
    await Promise.all(notificationPromises);
    console.log("Medicine request limits reset and notification sent to users.");
  } catch (error) {
    console.error("Error resetting medicine request limits and sending notification:", error);
  }
};

module.exports = resetMedicineRequestLimit;
