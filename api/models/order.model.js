const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  User: {
    type: mongoose.Schema.Types.ObjectId,
    trim: true,
    ref: "user",
  },
  Cart: {
    TotalQty: {
      type: Number,
      default: 0,
      required: true,
    },
    TotalCost: {
      type: Number,
      default: 0,
      required: true,
    },
    Items: [
      {
        ProductId: {
          type: mongoose.Schema.Types.ObjectId,
          trim: true,
          ref: "product",
          required: true,
        },
        Qty: {
          type: Number,
          default: 0,
        },
      },
    ],
  },
  Address: {
    type: String,
    required: true,
  },
  isApproved: {
    type: Boolean,
    required: true,
    default: false
  },
  isDispatched: {
    type: Boolean,
    required: true,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Employee = mongoose.model('Order', orderSchema)

module.exports = Employee;