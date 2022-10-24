const router = require("express").Router();
const Shed = require('../models/product.model')
const District = require('../models/category.model')

// @desc    Get product by Category
// @route   GET /api/v1/products/list?category=62ba9bf274af7a5a0e917761
// @access  Public
router.get('/', async (request, response, next) => {
    try {
      const district = await District.findById(request.query.district)
  
      if (!district) {
        response.status(404).json({ error: 'invalid request' })
      }
  
      const sheds = await Shed.find({ District: request.query.district })
        .populate("District")
  console.log(sheds)
      response.json(sheds.map(sheds => sheds.toJSON()))
    } catch (err) {
      console.log(err)
    }
})

module.exports = router
