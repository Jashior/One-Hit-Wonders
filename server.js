// server.js
var express = require("express");
var app = express();
var cors = require("cors");
require("dotenv").config();
var mongoSanitize = require("express-mongo-sanitize");

// Middleware
app.use(cors());
app.use(mongoSanitize());

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

// Static Route
app.use(express.static("./dist/onehit"));
app.get("/*", function (req, res) {
  res.sendFile("index.html", { root: "dist/onehit" });
});

// Routes
const routes = require("./routes/routes");
app.use("/api", routes);

// Server start
LOCAL_PORT = 8080;
var server = app.listen(process.env.PORT || LOCAL_PORT, function () {
  console.log(`Backend Application listening at ${process.env.PORT || 8080}`);
});
