const router = require("express").Router();
const FuelQue = require("../models/shoppingCart.model");
const User = require("../models/user.model");

// @desc    Add to Card
// @route   POST /api/v1/shoppingCart
// @access  Public
router.post("/", (req, res) => {
  let body = req.body;
  // let shedsJSON = JSON.parse(JSON.stringify(req.body.sheds));

  let shedQue = new FuelQue({
    //
    idUser: body.idUser,
    ArTime: body.ArTime,
    sheds: body.sheds,
  });

  shedQue.save((err, shedQueDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    if (!shedQueDB) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    res.status(201).json({
      ok: true,
      shedQueDB,
    });
  });
});

// @desc    Get Add to Card Item by UserID
// @route   GET /api/v1/shoppingCart?userID=6271a2d1f46dc566241e6018
// @access  Public
router.get("/", async (req, res) => {
  try {
    const userID = await User.findById(req.query.userID);

    if (!userID) {
      res.status(404).json({ error: "invalid request" });
    }

    const fuelQue = await FuelQue.find() //
      .populate("Shed");

    res.json(fuelQue.map((fuelQue) => fuelQue.toJSON()));
  } catch (err) {
    console.log(err);
  }
});

// @desc    Delete shopping card by UserID
// @route   DELETE /api/v1/shoppingCart?userID=6271a2d1f46dc566241e6018
// @access  Public
router.delete("/", async (req, res) => {
  try {
    const userID = await User.findById(req.query.userID);

    if (!userID) {
      res.status(404).json({ error: "invalid request" });
    }

    const fuelQue = await FuelQue.find({ idUser: req.query.userID }).remove(); //
    console.log("FuelQue:", fuelQue);
    if (fuelQue) {
      res.json({ message: "Shopping Card details removed" });
    }
  } catch (error) {
    console.log(error);
  }
});

// @desc    Delete shopping card by ID
// @route   DELETE /api/v1/shoppingCart?userID=6271a2d1f46dc566241e6018
// @access  Public
router.delete("/ProductID/:id", async (req, res) => {
  const fuelQue = await FuelQue.findById(req.params.id); //

  if (fuelQue) {
    await fuelQue.remove();
    res.json({ message: "Order removed" });
  } else {
    res.status(404);
    res.json({ message: "Order not Found" });
  }
});

// @desc    Get All Add to Card Item
// @route   GET /api/v1/shoppingCart
// @access  Public
router.get("/allCardItems", async (req, res) => {
  // const fuelQue = await FuelQue.find().populate({
  //   path: "sheds.idShed",
  // });
  const fuelQue = await FuelQue.find().populate({
    path: 'sheds',
  }).populate({
    path: 'sheds',
    populate: {
        path: 'District'
    },
  });

  if (fuelQue) {
    res.json(fuelQue);
  } else {
    res.status(404);
    throw new Error("Something Error");
  }
});

module.exports = router;
