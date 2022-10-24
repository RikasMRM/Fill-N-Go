const router = require("express").Router();
const bcrypt = require("bcryptjs/dist/bcrypt");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

// @desc    Register User
// @route   POST /api/v1/user/register
// @access  Public
router.post(`/register`, async (req, res) => {
  //Checking if the user is already in the database
  const emailExist = await User.findOne({ Email: req.body.Email });
  if (emailExist)
    return res.status(400).json({ error_Message: "Email already exists" });

  //Hash passwords
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.Password, salt);

  //Create a new user
  const user = new User({
    Name: req.body.Name,
    Email: req.body.Email,
    Number: req.body.Number,
    Password: hashPassword,
    Address: req.body.Address,
  });
  try {
    console.log("user : ",user);
    const savedUser = await user.save();
    res.status(201).send(savedUser);
  } catch (err) {
    res.status(400).send(err);
  }
});

// @desc    Register User
// @route   POST /api/v1/user/login
// @access  Public
router.post("/login", async (req, res) => {

  //Checking if the email exists
  const user = await User.findOne({ Email: req.body.Email });
  if (!user)
    return res.status(400).json({ error_Message: "Email is not found" });

  //Password is Correct
  const validPass = await bcrypt.compare(req.body.Password, user.Password);
  if (!validPass)
    return res.status(400).json({ error_Message: "Invalid Password" });

  //Create and assing a token
  const token = jwt.sign(
    { _id: user._id, Name: user.Name, Email: user.Email, Number: user.Number, Address:user.Address, isAdmin:user.isAdmin},
    process.env.TOKEN_SECRET
  );
  res
    .header("auth-token", token)
    .json({
      token: token,
      user: { id: user._id, Name: user.Name, Email: user.Email, Number: user.Number, Address:user.Address, isAdmin:user.isAdmin },
    });
});

// @desc    Register User
// @route   POST /api/v1/user/forget-password
// @access  Public
router.patch("/forget-password", async (req, res) => {

  //Checking if the email exists
  const user = await User.findOne({ Email: req.body.Email });
  if (!user)
    return res.status(400).json({ error_Message: "Email is not found" });

  //Password is Correct
  const validPass = await bcrypt.compare(req.body.Password, user.Password);
  if (validPass)
    return res
      .status(400)
      .json({ error_Message: "Please Enter a New Password!" });

  //Hash passwords
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.Password, salt);

  const UpdatePassword = await User.updateOne({
    $set: {
      Password: hashPassword,
    },
  });
  res.json(UpdatePassword);
});

// @desc    Register User
// @route   POST /api/v1/user/
// @access  Public
router.get("/", async (req, res) => {
  try {
    const user = await User.find();
    // res.json({ data: user });
    res.json(user);
  } catch (err) {
    res.json({ message: err });
  }
});

module.exports = router;
