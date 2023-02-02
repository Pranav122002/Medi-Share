const express = require('express');
const app = express()
const port = process.env.port || 5000;
const mongoose = require("mongoose");
const { mongoUrl } = require("./keys");
const cors = require("cors");
const path = require("path")
const socket = require("socket.io");

app.use(cors())
require('./models/model')
require('./models/post')
app.use(express.json())
app.use(require("./routes/auth"))
app.use(require("./routes/createPost"))
app.use(require("./routes/user"))
app.use(require("./routes/messages"))
mongoose.connect(mongoUrl);

mongoose.connection.on("connected", () => {
    console.log("MongoDB connection successfull ...")
})

mongoose.connection.on("error", () => {
    console.log("MongoDB connection error !!!")
})

// // serving the frontend
// app.use(express.static(path.join(__dirname, "./frontend/build")))

// app.get("*", (req, res) => {
//     res.sendFile(
//         path.join(__dirname, "./frontend/build/index.html"),
//         function (err) {
//             res.status(500).send(err)
//         }
//     )
// })


const server = app.listen(port, () => {
    console.log("Server is running on port" + " " + port + " ...")

})


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
    