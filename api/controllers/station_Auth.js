const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const FuelShed = require("../models/fuel_Station");

//method: station authentication
//[POST]http://localhost:4000/api/auth/shed-owner/register        
exports.signup = async (req, res, next) => {
  console.log("req", req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed.");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  const stationName = req.body.stationName;
  const adminName = req.body.adminName;
  const Nic = req.body.Nic;
  const email = req.body.email;
  const password = req.body.password;

  try {
    const hashedPw = await bcrypt.hash(password, 12);

    const fuelShed = new FuelShed({
      stationName,
      adminName,
      Nic,
      email,
      password: hashedPw,
    });
    const result = await fuelShed.save();
    res
      .status(201)
      .json({
        success: true,
        message: "FuelShed created!",
        fuelShedId: result._id,
        result,
      });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
