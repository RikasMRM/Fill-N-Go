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
  Nic: {
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
    busQ: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    TukTukQ: [
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
    carQ: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    bikeQ: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    TukTukQ: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
});

module.exports = mongoose.model("FuelShed", userSchema);
