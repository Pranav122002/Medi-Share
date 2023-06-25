require("dotenv").config();
const accountSid = process.env.accountSid;
const authToken = process.env.authToken;
const client = require("twilio")(accountSid, authToken);

const smsNotification = (msg, userPhone) => {
  client.messages
    .create({
      body: msg,
      from: process.env.whatsapp_phone_no, // Replace with your Twilio WhatsApp phone number
      to: userPhone, // Replace with recipient's phone number
    })
    .catch((error) => console.log(error));
};

module.exports = smsNotification;
