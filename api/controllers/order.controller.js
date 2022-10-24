const asyncHandler = require('express-async-handler');
const Order = require("../models/order.model");

// @desc    Create new Order
// @route   POST /api/v1/order
// @access  Public
const addOrder = asyncHandler(async (req, res) => {
    const order = await new Order(req.body);

    try {
      const savedOrder = await order.save();
      res.status(201).json(savedOrder);
    } catch (error) {
      res.status(409).json({ message: error.message });
    }
})

// @desc    Get emplyee by ID
// @route   GET /api/v1/order/:id
// @access  Public
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate("User", "Name Email Number Address")
  .populate({
    path: 'Cart.Items',
    populate: {
        path: 'ProductId'
    },
  });

  if (order) {
    res.json(order)
  } else {
    res.status(404)
    throw new Error('Order not found')
  }
})

// @desc    Update order
// @route   PUT /api/v1/order/:id
// @access  Public
const updateOrder = asyncHandler(async (req, res) => {
  try {
    const updateOrder = await Order.updateOne(
      { _id: req.params.id },
      {
        $set: {
          OrderItems: req.body.OrderItems,
          FirstName: req.body.FirstName,
          LastName: req.body.LastName,
          ContactNumber: req.body.ContactNumber,
          Email: req.body.Email,
          NIC: req.body.NIC,
          Address01: req.body.Address01,
          Address02: req.body.Address02,
          ShippingAddress: req.body.ShippingAddress,
        },
      }
    );
    res.json(updateOrder);
  } catch (err) {
    res.status(404)
    res.json({ message: err });
  }
})

// @desc    Get all Orders
// @route   GET /api/v1/order
// @access  Public
const getAllOrders = asyncHandler(async (req, res) => {
    try {
        const order = await Order.find()
        .populate("User", "Name Email Number Address")
        .populate({
          path: 'Cart.Items',
          populate: {
              path: 'ProductId'
          },
        })
        res.status(200).json(order)
    } catch (err) {
        res.json({ message: err });
    }
})

// @desc    Delete order
// @route   DELETE /api/v1/order/:id
// @access  Public
const deleteOrder = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)
  
    if (order) {
      await order.remove()
      res.json({ message: 'Order removed' })
    } else {
      res.status(404)
      throw new Error('User not found')
    }
})

module.exports = {
  addOrder,
  getAllOrders,
  getOrderById,
  deleteOrder,
  updateOrder
}
