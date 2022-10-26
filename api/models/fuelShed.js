const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  stationName: {
    type: String,
    required: true,
  },
  adminName: {
    type: String,
    required: true,
  },
  NIC: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: "shed",
  },
  Diesel: {
    arrivalTime: {
      type: String,
    },
    arrivedQuantity: {
      type: Number,
    },
    avaiableTotalFuelAmount: {
      type: Number,
      default: 0,
    },
    finishingTime: {
      type: String,
    },
    busQueue: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    threeWheelerQueue: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  Petrol: {
    arrivalTime: {
      type: String,
    },
    arrivedQuantity: {
      type: Number,
    },
    avaiableTotalFuelAmount: {
      type: Number,
      default: 0,
    },
    finishingTime: {
      type: String,
    },
    carQueue: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    bikeQueue: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    threeWheelerQueue: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
});

module.exports = mongoose.model("FuelShed", userSchema);
