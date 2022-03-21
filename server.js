// server.js
var express = require("express");
var app = express();
var cors = require("cors");
require("dotenv").config();

// CORS Middleware
app.use(cors());

// Database Connection //
const mongoose = require("mongoose");
const mongoString = process.env.MONGO_URL;

mongoose.connect(mongoString);
const database = mongoose.connection;

database.on("error", (error) => {
  console.log(error);
});

database.once("connected", () => {
  console.log("Database Connected");
});

// Routes
const routes = require("./routes/routes");
app.use("/api", routes);

app.get("/", function (req, res) {
  res.send(`Hello World`);
});

// Server start
var server = app.listen(8080, function () {
  console.log("Backend Application listening at http://localhost:8080");
});
