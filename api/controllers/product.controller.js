const asyncHandler = require('express-async-handler');
const Shed = require("../models/product.model");
const cloudinary = require("../utils/cloudinary");
const FuelQue = require('../models/shoppingCart.model');

// @desc    Create new Product
// @route   POST /api/v1/product
// @access  Public
const addShed = asyncHandler(async (req, res) => {
  try {
    // Upload image to cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);

    let shed = new Shed({//
      Name: req.body.Name,
      FuelArTime: req.body.FuelArTime,
      FuelFhTime: req.body.FuelFhTime,
      FuelType: req.body.FuelType,
      avatar: result.secure_url,
      cloudinary_id: result.public_id,
      Quantity: req.body.Quantity,
      District: req.body.District,
      isAvailable: req.body.isAvailable
    });

    // Save product
    await shed.save();
    res.json(shed);
  } catch (err) {
    res.json({ message: err });
    console.trace(err)
  }
});

// @desc    Get All Product
const getAllQueShed = asyncHandler(async (req, res) => {
  try {
    const shed = await FuelQue.find().populate("District")//
    res.status(200).json(shed)
  } catch (err) {
      res.json({ message: err });
  }
});




// @route   GET /api/v1/product
// @access  Public
const getAllShed = asyncHandler(async (req, res) => {
  try {
    const shed = await Shed.find().populate("District")//
    res.status(200).json(shed)
  } catch (err) {
      res.json({ message: err });
  }
});

// @desc    Delete order
// @route   DELETE /api/v1/order/:id
// @access  Public
const deleteShed = asyncHandler(async (req, res) => {
    const shed = await Shed.findById(req.params.id)//
  
    if (shed) {
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(shed.cloudinary_id);

      await shed.remove()
      res.json({ message: 'shed removed' })
    } else {
      res.status(404)
      throw new Error('shed not found')
    }
})

// @desc    Get product by ID
// @route   GET /api/v1/product/:id
// @access  Public
const getShedById = asyncHandler(async (req, res) => {
  const shed = await Shed.findById(req.params.id).populate("District");//

  if (shed) {
    res.json(shed)
  } else {
    res.status(404)
    throw new Error('shed not found')
  }
})

// @desc    Update product
// @route   PUT /api/v1/product/:id
// @access  Public
const updateShed = asyncHandler(async (req, res) => {
  try {
    let shed = await Shed.findById(req.params.id);//
    // Delete image from cloudinary
    await cloudinary.uploader.destroy(shed.cloudinary_id);
    // Upload image to cloudinary
    let result;
    if (req.file) {
      result = await cloudinary.uploader.upload(req.file.path);
    }
    const data = {
      Name: req.body.Name,
      FuelArTime: req.body.FuelArTime,
      FuelFhTime: req.body.FuelFhTime,
      FuelType: req.body.FuelType,
      avatar: result.secure_url,
      cloudinary_id: result.public_id,
      Quantity: req.body.Quantity,
      District: req.body.District,
      isAvailable: req.body.isAvailable
    };
    shed = await Shed.findByIdAndUpdate(req.params.id, data, { new: true });//
    res.json(shed);
  } catch (err) {
    console.log(err);
  }
})


module.exports = {
  addShed,
  getAllShed,
  deleteShed,
  getShedById,
  updateShed,
}