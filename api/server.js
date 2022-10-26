const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const shedOwnerAuthRoutes = require("./routes/station_Auth");
const fuelStationRoutes = require("./routes/fuel_M");
require("dotenv").config();

const app = express();

app.use(bodyParser.json()); // application/json

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/api/auth", authRoutes);

app.use("/api/auth/shed-owner", shedOwnerAuthRoutes);

app.use("/api/fuel-station", fuelStationRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then((result) => {
    console.log("Database Conected");
    const server = app.listen(process.env.PORT || 4000);
    console.log(`Server running on port : ${server.address().port}`);
  })
  .catch((err) => console.log(err));
