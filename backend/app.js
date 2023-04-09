const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.port || 5000;
const mongoose = require("mongoose");
const cors = require("cors");
const socket = require("socket.io");
const { MONGOURI, JWT_SECRET } = require("./config/keys");

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

require("./models/medicine");
require("./models/user");
require("./models/message");
require("./models/order");
require("./models/annoucement");
require("./models/disease");

app.use(require("./routes/auth"));
app.use(require("./routes/order"));
app.use(require("./routes/user"));
app.use(require("./routes/message"));
app.use(require("./routes/medicine"));
app.use(require("./routes/annoucement"));
app.use(require("./routes/disease"));

mongoose.connect(MONGOURI, { useNewUrlParser: true });
mongoose.connection.on("connected", () => {
  console.log("MongoDB connection successfull...");
});
mongoose.connection.on("error", () => {
  console.log("MongoDB connection error !!!");
});

const server = app.listen(port, () => {
  console.log("Server is running on port" + " " + port + "...");
});

const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.msg);
    }
  });
});
