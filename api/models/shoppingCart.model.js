const mongoose = require("mongoose");

const fuelqueSchema = mongoose.Schema({
  idUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  ArTime: {
    type: String,
    required: true,
  },
  sheds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      trim: true,
      ref: "Shed",
      required: true,
    },
  ],
});

const FuelQue = mongoose.model("FuelQue", fuelqueSchema);

module.exports = FuelQue;
