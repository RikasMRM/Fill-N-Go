const asyncHandler = require('express-async-handler');
const District = require("../models/category.model");
const cloudinary = require("../utils/cloudinary");


// @desc    Create new Category
// @route   POST /api/v1/category
// @access  Public
const addDistrict = asyncHandler(async (req, res) => {
  try {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);

      let district = new District({ //
        District: req.body.District,
        avatar: result.secure_url,
        cloudinary_id: result.public_id,
      });

      const savedDistrict= await district.save();
      res.status(201).json(savedDistrict);
    } catch (error) {
      res.status(409).json({ message: error.message });
    }
})

// @desc    Get category by ID
// @route   GET /api/v1/category/:id
// @access  Public
const getDistrictById = asyncHandler(async (req, res) => {
  const district = await District.findById(req.params.id); //

  if (district) {
    res.json(district)
  } else {
    res.status(404)
    throw new Error('Category not found')
  }
})

// @desc    Update employee
// @route   PUT /api/v1/employee/:id
// @access  Public
const updateDistrict = asyncHandler(async (req, res) => {
  try {
    const updateDistrict = await District.updateOne( //
      { _id: req.params.id },
      {
        $set: {
          District: req.body.District,
        },
      }
    );
    res.json(updateDistrict);
  } catch (err) {
    res.status(404)
    res.json({ message: err });
  }

  try {
    let district = await District.findById(req.params.id); //
    // Delete image from cloudinary
    await cloudinary.uploader.destroy(district.cloudinary_id);
    // Upload image to cloudinary
    let result;
    if (req.file) {
      result = await cloudinary.uploader.upload(req.file.path);
    }
    const data = {
      District: req.body.District,
      avatar: result.secure_url,
      cloudinary_id: result.public_id,
    };
    district = await District.findByIdAndUpdate(req.params.id, data, { new: true }); //
    res.json(district);
  } catch (err) {
    console.log(err);
  }
})

// @desc    Get all Category
// @route   GET /api/v1/category
// @access  Public
const getAllDistrict = asyncHandler(async (req, res) => {
    try {
        const district = await District.find() //
        res.status(200).json(district)
    } catch (err) {
        res.json({ message: err });
    }
})

// @desc    Delete employee
// @route   DELETE /api/v1/employee/:id
// @access  Public
const deleteDistrict = asyncHandler(async (req, res) => {
    const district = await District.findById(req.params.id) //
  
    if (district) {
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(district.cloudinary_id);

      await district.remove()
      res.json({ message: 'Category removed' })
    } else {
      res.status(404)
      throw new Error('Category not found')
    }
})

module.exports = {
    addDistrict,
    getDistrictById,
    updateDistrict,
    getAllDistrict,
    deleteDistrict
}
