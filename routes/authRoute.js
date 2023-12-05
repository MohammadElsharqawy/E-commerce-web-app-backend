const express = require("express");

const { signupValidator } = require("../utilities/validators/authValidator");
const { signUp } = require("../services/authService");

const router = express.Router();

router.route("/").post(signupValidator, signUp);

module.exports = router;
