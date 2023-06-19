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

require("./models/annoucement");
require("./models/appointment");
require("./models/personal_message");
require("./models/message");
require("./models/medicine");
require("./models/order");
require("./models/task");
require("./models/user");

app.use(require("./routes/annoucement"));
app.use(require("./routes/appointment"));
app.use(require("./routes/auth"));
app.use(require("./routes/medicine"));
app.use(require("./routes/message"));
app.use(require("./routes/order"));
app.use(require("./routes/task"));
app.use(require("./routes/user"));


mongoose.connect(MONGOURI, { useNewUrlParser: true });
let isMongoDBConnected = false; 

mongoose.connection.on("connected", () => {
  if (!isMongoDBConnected) {
    console.log("MongoDB connection successfull");
    isMongoDBConnected = true;
  }
});

mongoose.connection.on("error", () => {
  console.log("MongoDB connection error !");
});

const server = app.listen(port, () => {
  console.log("Server is running on port" + " " + port + "");
});

const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

const onlineUsers = new Map();

io.on("connection", (socket) => {

  socket.on("message", (message) => {
    io.emit("message", message);
  });

  
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("personal-message", (message) => {
    const { sender_id, receiver_id } = message;

    const senderSocketId = onlineUsers.get(sender_id);
    if (senderSocketId) {
      io.to(senderSocketId).emit("personal-message", message);
    }

    const recipientSocketId = onlineUsers.get(receiver_id);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("personal-message", message);
    }
  });

  socket.on("disconnect", () => {
    onlineUsers.forEach((socketId, userId) => {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
      }
    });
  });
});

