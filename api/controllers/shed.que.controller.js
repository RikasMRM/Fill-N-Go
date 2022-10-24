const router = require("express").Router();
const Shed = require("../models/product.model");
const Que = require("../models/shoppingCart.model");

// @desc    Get product by Category
// @route   GET /api/v1/products/list?category=62ba9bf274af7a5a0e917761
// @access  Public
router.get("/", async (request, response, next) => {
  try {
    const shed = await Shed.findById(request.query.shed);

    if (!shed) {
      response.status(404).json({ error: "invalid request" });
    }

    const que = await Que.find({ sheds: request.query.shed }).populate("sheds");
    console.log(que);
    response.json(que.map((que) => que.toJSON()));
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
