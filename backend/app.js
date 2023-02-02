const express = require('express');
const bodyParser = require("body-parser")
const app = express()
const port = process.env.port || 5000;
const mongoose = require("mongoose");
const { mongoUrl } = require("./keys");
const cors = require("cors");
const path = require("path")


app.use(cors())
require('./models/user')
require('./models/medicine')
app.use(express.json())
app.use(require("./routes/auth"))
app.use(require("./routes/user"))
app.use(require("./routes/medicine"))
app.use(bodyParser.urlencoded({ extended: true }));

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

