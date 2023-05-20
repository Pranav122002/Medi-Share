const router = require("express").Router();
const MESSAGE = require("../models/message");
const GLOBALMESSAGE = require("../models/globalmessage");

router.post("/addmsg", async (req, res, next) => {
  try {
    const { from, to, message } = req.body;
    const data = await MESSAGE.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });
    if (data) return res.json({ msg: "Message added successfully..." });
    else return res.json({ msg: "Failed to add message to the database..." });
  } catch (ex) {
    next(ex);
  }
});

router.post("/getmsg", async (req, res, next) => {
  try {
    const { from, to } = req.body;
    const messages = await MESSAGE.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });
    const projectedMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
      };
    });
    res.json(projectedMessages);
  } catch (ex) {
    next(ex);
  }
});

router.post("/addmsgglobal", async (req, res, next) => {
  try {
    const { from,  message } = req.body;
    const data = await GLOBALMESSAGE.create({
      message: { text: message },
      users: [from],
      sender: from,
    });
    if (data) return res.json({ msg: "Message added successfully..." });
    else return res.json({ msg: "Failed to add message to the database..." });
  } catch (ex) {
    next(ex);
  }
});



router.post("/getmsgglobal", async (req, res, next) => {
  try {
    const { from } = req.body;
    const messages = await GLOBALMESSAGE.find().sort({ updatedAt: 1 }).populate('sender');
   
    const projectedMessages = messages.map((msg) => {
      const isFromSelf = msg.sender._id.toString() === from;
     
      return {
        fromSelf: isFromSelf,
        message: msg.message.text,
        sender_name: msg.sender.name,
      };
    });
    res.json(projectedMessages);
  } catch (ex) {
    next(ex);
  }
});


module.exports = router;
