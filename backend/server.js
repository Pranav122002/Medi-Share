const express = require('express');
const bodyParser = require("body-parser")
const app = express()
const port = process.env.port || 5000;
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path")
const mongoUrl = "mongodb://0.0.0.0:27017/medi-share";
// const mongoUrl = "mongodb://localhost:27017/medi-share";

app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));

require('./models/medicine')
require('./models/user')
require('./models/message')
require('./models/order')

app.use(require("./routes/auth"))
app.use(require("./routes/order"))
// app.use(require("./routes/user"))
app.use(require("./routes/message"))

mongoose.connect(mongoUrl);
mongoose.connection.on("connected", () => {
    console.log("MongoDB connection successfull ...")
})
mongoose.connection.on("error", () => {
    console.log("MongoDB connection error !!!")
})

const server = app.listen(port, () => {
    console.log("Server is running on port" + " " + port + " ...")

})

