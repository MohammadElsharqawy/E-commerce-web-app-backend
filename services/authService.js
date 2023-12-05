const jwt = require("jsonwebtoken");

const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

// @Desc  Sign up
// @Route POST /api/v1/auth/signup
// @access Public
exports.signUp = asyncHandler(async (req, res, next) => {
  // 1- create user.
  // 2- generate token.

  const user = await User.create({
    name: req.body.name,
    email: req.body.email, // check if it exists already but gonna do this in validation layer.
    password: req.body.password, // mongoose middleware will hash it.
  });

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRECT_KEY, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });

  res.status(201).json({ data: user, token });
});
